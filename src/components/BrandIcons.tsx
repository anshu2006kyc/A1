import React from 'react';

export interface BrandIconProps {
  className?: string;
  size?: number;
  animated?: boolean;
  withCircle?: boolean;
}

/**
 * Official Real WhatsApp Vector Icon
 */
export const WhatsAppIcon: React.FC<BrandIconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size || 24}
    height={size || 24}
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.83a8.184 8.184 0 0 1-5.82 2.41h-.01c-1.49 0-2.95-.4-4.23-1.16l-.3-.18-3.12.82.83-3.04-.2-.32a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24h.03zm-4.7 3.65c-.26 0-.67.1-.98.44-.31.34-1.2 1.17-1.2 2.86 0 1.69 1.23 3.32 1.4 3.55.17.23 2.37 3.78 5.84 5.14 2.87 1.13 3.46.91 4.08.85.62-.06 2-.82 2.28-1.61.28-.79.28-1.47.2-1.61-.08-.14-.3-.23-.63-.39-.33-.16-1.95-.96-2.25-1.07-.3-.11-.52-.17-.74.17-.22.34-.86 1.07-1.05 1.29-.19.22-.38.25-.71.08-.33-.16-1.39-.51-2.65-1.63-.98-.87-1.64-1.95-1.83-2.28-.19-.33-.02-.51.14-.67.15-.15.33-.39.5-.58.17-.19.22-.33.33-.55.11-.22.06-.42-.03-.58-.08-.17-.74-1.78-1.01-2.44-.27-.64-.54-.55-.74-.56-.19-.01-.41-.01-.63-.01z" />
  </svg>
);

/**
 * Official Real Telegram Vector Icon with authentic paper airplane fold geometry & animation support
 */
export const TelegramIcon: React.FC<BrandIconProps> = ({
  className = 'w-5 h-5',
  size,
  animated = false,
  withCircle = false,
}) => {
  return (
    <svg
      viewBox="0 0 240 240"
      width={size || 24}
      height={size || 24}
      className={`${className} ${animated ? 'animate-telegram-fly' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Telegram"
    >
      <defs>
        <linearGradient id="telegramGradientOfficial" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2AABEE" />
          <stop offset="100%" stopColor="#229ED9" />
        </linearGradient>
      </defs>

      {/* Optional official circular background */}
      {withCircle && (
        <circle cx="120" cy="120" r="120" fill="url(#telegramGradientOfficial)" />
      )}

      {/* Authentic Telegram paper airplane paths with aerodynamic paper fold depth */}
      <g className={animated ? 'animate-telegram-fly' : ''}>
        {/* Underside fold shadow */}
        <path
          d="M98 175c-3.88 0-3.22-1.47-4.56-5.16L82 132.88 177 74"
          fill="currentColor"
          opacity="0.72"
        />
        {/* Rudder flap connector */}
        <path
          d="M98 175c3 0 4.33-1.37 6-3l16-15.56-20-12"
          fill="currentColor"
          opacity="0.5"
        />
        {/* Main wing and cockpit body */}
        <path
          d="M100 144.44l48.42 35.78c5.56 3.07 9.56 1.48 10.95-5.14l19.7-92.83c2.03-8.15-3.11-11.83-8.45-9.4L45.47 110.15c-7.95 3.19-7.89 7.63-1.41 9.61l32.14 10.04 74.4-46.94c3.51-2.13 6.73-.99 4.08 1.36z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};

/**
 * Official Standalone Circular Telegram Brand Badge
 */
export const TelegramBadge: React.FC<BrandIconProps> = (props) => (
  <TelegramIcon {...props} withCircle={true} className={`${props.className || 'w-10 h-10'} text-white`} />
);
