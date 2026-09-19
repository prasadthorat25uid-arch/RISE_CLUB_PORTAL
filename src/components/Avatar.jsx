import React, { useState } from 'react';

/**
 * Extracts clean 2-letter initials from a user's full name.
 * Handles titles like "Dr.", "Prof.", middle names, etc.
 */
export const getInitials = (name = '') => {
  if (!name) return 'RI';
  const cleanName = name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, '').trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'RI';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Deterministically generates a vibrant gradient based on name string
 */
const getGradientByName = (name = '') => {
  const gradients = [
    'from-amber-500 via-orange-600 to-rose-600',
    'from-cyan-500 via-blue-600 to-indigo-600',
    'from-emerald-500 via-teal-600 to-cyan-600',
    'from-purple-500 via-pink-600 to-rose-600',
    'from-amber-400 via-yellow-500 to-orange-500',
    'from-violet-500 via-purple-600 to-indigo-700'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
  '3xl': 'w-24 h-24 text-3xl'
};

export const Avatar = ({
  src,
  name = 'RISE Member',
  size = 'md',
  className = '',
  borderClass = 'border border-amber-400/40',
  alt
}) => {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name);
  const gradient = getGradientByName(name);
  const sizeClass = sizeClasses[size] || size;

  // Reset img error if src changes
  React.useEffect(() => {
    setImgError(false);
  }, [src]);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={alt || name}
        onError={() => setImgError(true)}
        className={`${sizeClass} rounded-2xl object-cover shadow-md ${borderClass} ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-2xl bg-gradient-to-br ${gradient} text-slate-950 font-black font-outfit flex items-center justify-center shadow-lg select-none shrink-0 tracking-wider ${borderClass} ${className}`}
      title={name}
      aria-label={name}
    >
      <span>{initials}</span>
    </div>
  );
};

export default Avatar;
