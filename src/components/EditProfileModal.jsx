import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './Avatar';
import { 
  uploadProfilePhotoToStorage, 
  validateProfilePhoto 
} from '../lib/storage';
import { 
  X, 
  Upload, 
  Trash2, 
  Save, 
  Lock, 
  Github, 
  Linkedin, 
  Globe, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Loader2,
  Camera
} from 'lucide-react';

export const EditProfileModal = ({ isOpen, onClose, targetUser = null }) => {
  const { updateMemberProfile, addToast } = useData();
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);

  const user = targetUser || currentUser;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    photo: user?.photo || '',
    bio: user?.bio || '',
    researchInterests: Array.isArray(user?.researchInterests) 
      ? user?.researchInterests.join(', ') 
      : (user?.researchInterests || ''),
    technicalSkills: Array.isArray(user?.technicalSkills) 
      ? user?.technicalSkills.join(', ') 
      : (user?.technicalSkills || ''),
    githubUrl: user?.githubUrl || user?.github || '',
    linkedinUrl: user?.linkedinUrl || user?.linkedin || '',
    portfolioLink: user?.portfolioLink || user?.portfolioUrl || '',
    phone: user?.phone || ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.photo || '');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Reset form when target user or modal open status changes
  React.useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        photo: user.photo || '',
        bio: user.bio || '',
        researchInterests: Array.isArray(user.researchInterests) 
          ? user.researchInterests.join(', ') 
          : (user.researchInterests || ''),
        technicalSkills: Array.isArray(user.technicalSkills) 
          ? user.technicalSkills.join(', ') 
          : (user.technicalSkills || ''),
        githubUrl: user.githubUrl || user.github || '',
        linkedinUrl: user.linkedinUrl || user.linkedin || '',
        portfolioLink: user.portfolioLink || user.portfolioUrl || '',
        phone: user.phone || ''
      });
      setPhotoPreview(user.photo || '');
      setSelectedFile(null);
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  // Handle local file selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateProfilePhoto(file);
    if (!validation.valid) {
      setErrorMessage(validation.error);
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);

    // Instant local preview
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove photo action
  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPhotoPreview('');
    setFormData(prev => ({ ...prev, photo: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form submission & Save
  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (trimmedName.length < 2) {
      setErrorMessage('Full name must be at least 2 characters.');
      return;
    }

    if (trimmedName.length > 70) {
      setErrorMessage('Full name must be 70 characters or less.');
      return;
    }

    setIsSaving(true);

    let finalPhotoUrl = formData.photo;

    // If new photo file was picked, upload to Supabase Storage
    if (selectedFile) {
      setIsUploadingPhoto(true);
      const uploadRes = await uploadProfilePhotoToStorage(selectedFile, user.id);
      setIsUploadingPhoto(false);

      if (uploadRes.success) {
        finalPhotoUrl = uploadRes.url;
      } else {
        setErrorMessage(uploadRes.message || 'Failed to upload photo.');
        setIsSaving(false);
        return;
      }
    } else if (photoPreview === '') {
      finalPhotoUrl = '';
    }

    // Call updateMemberProfile
    const res = await updateMemberProfile(user.id, {
      name: trimmedName,
      photo: finalPhotoUrl,
      bio: formData.bio,
      researchInterests: formData.researchInterests,
      technicalSkills: formData.technicalSkills,
      githubUrl: formData.githubUrl,
      linkedinUrl: formData.linkedinUrl,
      portfolioLink: formData.portfolioLink,
      phone: formData.phone
    }, currentUser?.id);

    setIsSaving(false);

    if (res.success) {
      setSuccessMessage('Your profile has been updated successfully.');
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setErrorMessage(res.message || 'Unable to update profile. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="glass-panel w-full max-w-2xl rounded-3xl border border-amber-500/40 p-6 sm:p-8 space-y-6 bg-slate-900 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
              <Sparkles className="w-3 h-3" />
              <span>Personal Account Settings</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-outfit">
              Edit Member Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* SECTION 1: PROFILE PHOTO UPLOADER */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Profile Photo
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Supabase Storage (`profile-photos`)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Avatar Preview */}
              <div className="relative group">
                <Avatar
                  src={photoPreview}
                  name={formData.name || user.name}
                  size="3xl"
                  className="w-24 h-24 rounded-3xl"
                />
                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-slate-950/70 rounded-3xl flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                  </div>
                )}
              </div>

              {/* Upload & Remove Controls */}
              <div className="space-y-2 text-center sm:text-left flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 transition-all shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                  </button>

                  {photoPreview && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950 text-rose-300 text-xs font-semibold border border-rose-800/40 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 leading-normal">
                  Supported formats: <strong className="text-slate-300">JPG, PNG, WEBP</strong> • Max file size: <strong className="text-slate-300">5 MB</strong>
                </p>
                {!photoPreview && (
                  <p className="text-[10px] text-amber-400/80">
                    No photo selected — your initials avatar ({formData.name ? formData.name.substring(0, 2).toUpperCase() : 'RI'}) will be displayed automatically.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: FULL NAME & READ-ONLY ACCOUNT FIELDS */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Full Name <span className="text-amber-400">*</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  Visible across research papers, projects, and directory
                </span>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. Prasad Thorat"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>

            {/* Read-Only Account Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Email (Institutional Account)</span>
                </span>
                <p className="text-slate-300 font-mono text-xs mt-0.5">{user.email}</p>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Student PRN / Member ID</span>
                </span>
                <p className="text-amber-400 font-mono text-xs mt-0.5">
                  {user.prn} <span className="text-slate-500">({user.memberId})</span>
                </p>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Assigned RISE Role</span>
                </span>
                <p className="text-white font-semibold text-xs mt-0.5">{user.role}</p>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Department & Year</span>
                </span>
                <p className="text-slate-300 text-xs mt-0.5">{user.department} ({user.academicYear})</p>
              </div>
            </div>
          </div>

          {/* SECTION 3: RESEARCH BIO & SKILLS */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Bio & Research Focus
              </label>
              <textarea
                rows={3}
                placeholder="Share your research background, technical specialization, and goals with RISE..."
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Research Interests (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Generative AI, Robotics, Computer Vision"
                  value={formData.researchInterests}
                  onChange={e => setFormData({ ...formData, researchInterests: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Technical Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python, PyTorch, ROS2, C++, CUDA"
                  value={formData.technicalSkills}
                  onChange={e => setFormData({ ...formData, technicalSkills: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: SOCIAL & PORTFOLIO LINKS */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Online Profiles & Contact
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-slate-400" />
                  <span>GitHub Profile</span>
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={formData.githubUrl}
                  onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>LinkedIn Profile</span>
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedinUrl}
                  onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Portfolio URL</span>
                </label>
                <input
                  type="url"
                  placeholder="https://yourportfolio.dev"
                  value={formData.portfolioLink}
                  onChange={e => setFormData({ ...formData, portfolioLink: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Contact Phone</span>
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* SECTION 5: MODAL ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default EditProfileModal;
