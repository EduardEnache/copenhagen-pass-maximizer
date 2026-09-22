// Hand-written inline SVG icon set. No icon font/library dependency (the
// project brief forbids adding new dependencies) — every glyph below is a
// small, restrained line icon (1.5px stroke), always used paired with a
// visible text label elsewhere in the UI, never as the sole carrier of
// meaning. Decorative use sets aria-hidden.

import type { SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function base(size = 18) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
}

export function CompassIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-2 6-6 2 2-6z" />
    </svg>
  );
}

export function SunIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" />
    </svg>
  );
}

export function MoonIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z" />
    </svg>
  );
}

export function CalendarIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
    </svg>
  );
}

export function CalculatorIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7.5h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16v3" />
    </svg>
  );
}

export function MapIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M9 4L4 6v14l5-2 6 2 5-2V4l-5 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}

export function ChecklistIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M5 6.5l1.5 1.5L9.5 5M5 13.5l1.5 1.5L9.5 12M5 20.5l1.5 1.5L9.5 19" />
      <path d="M13 6h6M13 13h6M13 20h6" />
    </svg>
  );
}

export function NotesIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M6 3.5h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1z" />
      <path d="M14.5 3.5V8h4.5M8 12.5h8M8 16h5.5" />
    </svg>
  );
}

export function OverviewIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13" y="3.5" width="7.5" height="4.5" rx="1.5" />
      <rect x="13" y="10" width="7.5" height="10.5" rx="1.5" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" />
    </svg>
  );
}

export function PrintIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M6.5 8.5V4h11v4.5" />
      <rect x="4" y="8.5" width="16" height="8" rx="1.5" />
      <path d="M6.5 15.5h11V20h-11z" />
    </svg>
  );
}

export function ChevronRightIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function CheckCircleIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </svg>
  );
}

export function AlertTriangleIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M12 4.2 21 19.5H3z" />
      <path d="M12 10v4.2M12 17.3h.01" />
    </svg>
  );
}

export function InfoIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.6h.01" />
    </svg>
  );
}

export function HelpCircleIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.3 9.3a2.7 2.7 0 1 1 3.9 2.4c-.9.5-1.2 1-1.2 2M12 16.6h.01" />
    </svg>
  );
}

export function ClockIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3.2 2" />
    </svg>
  );
}

export function TrainIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="5" y="4" width="14" height="13" rx="4" />
      <path d="M5 12h14M8.5 17l-2 3.5M15.5 17l2 3.5" />
      <circle cx="9" cy="9.3" r=".4" fill="currentColor" />
      <circle cx="15" cy="9.3" r=".4" fill="currentColor" />
    </svg>
  );
}

export function BusIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="4" y="5" width="16" height="11.5" rx="2.5" />
      <path d="M4 11h16M7 20v-3M17 20v-3" />
      <circle cx="8" cy="13.5" r=".4" fill="currentColor" />
      <circle cx="16" cy="13.5" r=".4" fill="currentColor" />
    </svg>
  );
}

export function BoatIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4 14l1.7 4.5c.3.8 1 1.3 1.8 1.3h9c.8 0 1.5-.5 1.8-1.3L20 14z" />
      <path d="M7 14V6.5h6L17 14M7 9.5h8" />
    </svg>
  );
}

export function WalkIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="13" cy="4.5" r="1.6" />
      <path d="M10.5 8l1 3-3 2.5.5 6.5M11.5 11l3 1 2 5.5M11.5 11l2.5-2 3 1.5" />
    </svg>
  );
}

export function PlaneIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M10.5 3.5l1.5 5.5 6-2.2v2.4l-6 3.6.6 5 2 1.4v1.9l-3.6-1-.5.1-3.6 1v-1.9l2-1.4.6-5-6-3.6V6.8l6 2.2z" />
    </svg>
  );
}

export function BedIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M3.5 19v-9a2 2 0 0 1 2-2H10a2 2 0 0 1 2 2v3" />
      <path d="M3.5 13h17a1 1 0 0 1 1 1v5M12 13h9M20.5 19v-2" />
      <circle cx="7" cy="10.5" r="1.3" />
    </svg>
  );
}

export function LuggageIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="5" y="7.5" width="14" height="13" rx="2" />
      <path d="M9.5 7.5V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2.5M9.5 11.5v6M14.5 11.5v6" />
    </svg>
  );
}

export function ExternalLinkIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M9 6H5.5A1.5 1.5 0 0 0 4 7.5v11A1.5 1.5 0 0 0 5.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15" />
      <path d="M14 4h6v6M20 4l-9.5 9.5" />
    </svg>
  );
}

export function DownloadIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M12 3.5v11.5M8 11.5l4 4 4-4" />
      <path d="M4.5 17v2.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V17" />
    </svg>
  );
}

export function XIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function TicketIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4 9.5a2 2 0 0 0 0-3V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v1.5a2 2 0 0 0 0 3V16a2 2 0 0 0 0 3V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1.5a2 2 0 0 0 0-3z" />
      <path d="M14 4.5v15" strokeDasharray="2 2.4" />
    </svg>
  );
}

export function GaugeIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="M12 15l4-4.5M4 15h1.5M18.5 15H20" />
    </svg>
  );
}

export function UploadIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M12 15.5V4M8 8l4-4 4 4" />
      <path d="M4.5 17v2.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V17" />
    </svg>
  );
}

export function TrashIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M5 7h14M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2M7 7l1 12.5a1.5 1.5 0 0 0 1.5 1.4h5a1.5 1.5 0 0 0 1.5-1.4L17 7" />
    </svg>
  );
}

export function MealIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M7 3.5v7a2 2 0 0 0 2 2v8M7 3.5v5M9.2 3.5v5" />
      <path d="M17 3.5c-1.4 0-2.5 1.6-2.5 5s1.1 4.2 2.5 4.2M17 3.5v17" />
    </svg>
  );
}

export function BuildingIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="6" y="3.5" width="9" height="17" rx="1" />
      <path d="M9 7.5h3M9 11h3M9 14.5h3M15 10h3v10.5h-3zM6 20.5h12" />
    </svg>
  );
}
