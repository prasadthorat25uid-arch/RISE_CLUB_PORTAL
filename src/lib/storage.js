import { supabase, isSupabaseConfigured } from './supabase';

const BUCKET_NAME = 'profile-photos';
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Validates a profile photo file.
 * Returns { valid: boolean, error: string | null }
 */
export const validateProfilePhoto = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return { 
      valid: false, 
      error: 'Profile photo must be JPG, JPEG, PNG, or WEBP.' 
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { 
      valid: false, 
      error: 'Profile photo must be smaller than 5 MB.' 
    };
  }

  return { valid: true, error: null };
};

/**
 * Converts a File object to a Base64 data URL for instant client preview and offline fallback.
 */
export const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads a profile photo to Supabase Storage under `profiles/{userId}/avatar_{timestamp}.{ext}`.
 * Falls back gracefully to high-res data URL if Supabase bucket is offline or in local demo mode.
 */
export const uploadProfilePhotoToStorage = async (file, userId) => {
  const validation = validateProfilePhoto(file);
  if (!validation.valid) {
    return { success: false, message: validation.error };
  }

  if (!userId) {
    return { success: false, message: 'Authentication required to upload profile photo.' };
  }

  // Create client data URL first for instant fallback & preview
  let localDataUrl = '';
  try {
    localDataUrl = await fileToDataUrl(file);
  } catch (err) {
    console.warn('Error reading file data URL:', err);
  }

  const fileExt = file.name.split('.').pop() || 'webp';
  const filePath = `profiles/${userId}/avatar_${Date.now()}.${fileExt}`;

  // Try Supabase Storage upload if client is configured
  if (isSupabaseConfigured && supabase?.storage) {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: '3600'
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return {
            success: true,
            url: publicUrlData.publicUrl,
            storagePath: filePath,
            message: 'Photo uploaded to Supabase Storage.'
          };
        }
      } else if (error) {
        console.warn('Supabase storage upload returned error (using fallback):', error.message);
      }
    } catch (err) {
      console.warn('Supabase storage network error (using fallback):', err);
    }
  }

  // Fallback to local Data URL
  if (localDataUrl) {
    return {
      success: true,
      url: localDataUrl,
      storagePath: filePath,
      message: 'Photo processed successfully.'
    };
  }

  return {
    success: false,
    message: 'Unable to process image file. Please try a different image.'
  };
};

/**
 * Removes a profile photo from Supabase Storage.
 */
export const deleteProfilePhotoFromStorage = async (storagePath, userId) => {
  if (!storagePath || !userId) return { success: true };

  // Security check: ensure path belongs to the user
  if (!storagePath.startsWith(`profiles/${userId}/`)) {
    return { success: false, message: 'Unauthorized: You can only remove your own photo.' };
  }

  if (isSupabaseConfigured && supabase?.storage) {
    try {
      await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
    } catch (err) {
      console.warn('Supabase storage delete warning:', err);
    }
  }

  return { success: true };
};
