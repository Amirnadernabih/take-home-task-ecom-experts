export type IconName = 'camera' | 'shield' | 'sensor' | 'grid';

interface IconProps {
  name: string;
  className?: string;
}

const strokeIconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function Icon({ name, className }: IconProps) {
  const common = {
    className,
    ...strokeIconProps,
  };

  switch (name) {
    case 'camera':
      return (
        <svg {...common}>
          <rect x="7" y="5" width="10" height="8.5" rx="1.75" />
          <circle cx="12" cy="9.25" r="2.5" />
          <circle cx="12" cy="9.25" r="0.65" fill="currentColor" stroke="none" />
          <path d="M11 13.5v1.75" />
          <path d="M8.5 17.25h7" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path
            d="M12 4.25 6 7v4.75c0 3.35 2.55 5.95 6 6.85 3.45-.9 6-3.5 6-6.85V7L12 4.25Z"
            fill="currentColor"
            fillOpacity="0.12"
          />
          <path d="M12 4.25 6 7v4.75c0 3.35 2.55 5.95 6 6.85 3.45-.9 6-3.5 6-6.85V7L12 4.25Z" />
        </svg>
      );
    case 'sensor':
      return (
        <svg {...common}>
          <rect x="8" y="4.5" width="8" height="3.5" rx="0.75" />
          <circle cx="10.25" cy="6.25" r="0.45" fill="currentColor" stroke="none" />
          <circle cx="13.75" cy="6.25" r="0.45" fill="currentColor" stroke="none" />
          <path d="M5 10q7 6 14 0" />
          <path d="M7 12.5q5 4 10 0" />
          <path d="M9.5 15q2.5 2.5 5 0" />
        </svg>
      );
    case 'grid':
      return (
        <svg {...common}>
          <path d="M10.5 5.5 12 4 13.5 5.5" />
          <circle cx="7" cy="10" r="1.15" />
          <circle cx="12" cy="10" r="1.15" />
          <circle cx="17" cy="10" r="1.15" />
          <circle cx="7" cy="14" r="1.15" />
          <circle cx="12" cy="14" r="1.15" />
          <circle cx="17" cy="14" r="1.15" />
          <circle cx="7" cy="18" r="1.15" />
          <circle cx="12" cy="18" r="1.15" />
          <circle cx="17" cy="18" r="1.15" />
        </svg>
      );
    case 'truck':
      return (
        <svg {...common}>
          <path d="M3 14h11v-5H8L5.5 7H3v7Z" />
          <path d="M14 9h3l2 3v5h-5V9Z" />
          <circle cx="7" cy="16.5" r="1.5" />
          <circle cx="16.5" cy="16.5" r="1.5" />
        </svg>
      );
    case 'cam-unlimited':
      return (
        <svg {...common}>
          <path
            d="M12 4.25 6 7v4.75c0 3.35 2.55 5.95 6 6.85 3.45-.9 6-3.5 6-6.85V7L12 4.25Z"
            fill="currentColor"
            fillOpacity="0.12"
          />
          <path d="M12 4.25 6 7v4.75c0 3.35 2.55 5.95 6 6.85 3.45-.9 6-3.5 6-6.85V7L12 4.25Z" />
          <path d="M9.5 12.5 11.5 14.5 15 11" />
        </svg>
      );
    case 'motion-sensor':
      return (
        <svg {...common}>
          <path d="M5 10q7 6 14 0" />
          <path d="M7 12.5q5 4 10 0" />
          <path d="M9.5 15q2.5 2.5 5 0" />
        </svg>
      );
    case 'sense-hub':
      return (
        <svg {...common}>
          <rect x="6" y="8" width="12" height="9" rx="1.5" />
          <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
        </svg>
      );
    case 'microsd':
      return (
        <svg {...common}>
          <path d="M8 7h8l2 3v9H6V10l2-3Z" />
          <path d="M10 14h4" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
  }
}
