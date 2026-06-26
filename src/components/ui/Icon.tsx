export type IconName = 'camera' | 'shield' | 'sensor' | 'grid';

interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    'aria-hidden': true,
  } as const;

  switch (name) {
    case 'camera':
      return (
        <svg {...common}>
          <path d="M4 8.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5" />
          <path d="M8 6.5h8l1.5 2H6.5L8 6.5Z" />
          <circle cx="12" cy="12.5" r="2.75" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 4.5 5 7.5v5c0 4.2 3 7.4 7 8.5 4-1.1 7-4.3 7-8.5v-5L12 4.5Z" />
        </svg>
      );
    case 'sensor':
      return (
        <svg {...common}>
          <path d="M5 12a7 7 0 0 1 14 0" />
          <path d="M8.5 12a3.5 3.5 0 0 1 7 0" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'grid':
      return (
        <svg {...common}>
          <rect x="5" y="5" width="6" height="6" rx="1" />
          <rect x="13" y="5" width="6" height="6" rx="1" />
          <rect x="5" y="13" width="6" height="6" rx="1" />
          <rect x="13" y="13" width="6" height="6" rx="1" />
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
