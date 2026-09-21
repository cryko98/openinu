type P = React.SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const NewChatIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

export const SidebarIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M9.5 4v16" />
  </svg>
);

export const SearchIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

export const SendIcon = (p: P) => (
  <svg {...base} {...p} strokeWidth={2.2}>
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </svg>
);

export const StopIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <rect x="7" y="7" width="10" height="10" rx="2" />
  </svg>
);

export const CopyIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h8" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base} {...p} strokeWidth={2.2}>
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
);

export const ChevronIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const SunIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const MoonIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
);

export const ChartIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 3v18h18" />
    <path d="m7 14 3.5-4 3 3L20 6" />
  </svg>
);

export const BookIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5A2.5 2.5 0 0 0 4 20.5Z" />
    <path d="M4 18.5V4.5" />
  </svg>
);

export const CoinIcon = (p: P) => (
  <svg {...base} {...p}>
    <ellipse cx="12" cy="6.5" rx="8" ry="3.3" />
    <path d="M4 6.5v11c0 1.8 3.6 3.3 8 3.3s8-1.5 8-3.3v-11" />
    <path d="M4 12c0 1.8 3.6 3.3 8 3.3s8-1.5 8-3.3" />
  </svg>
);

export const MapIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m9 4 6 2.5L21 4v14l-6 2.5L9 18l-6 2.5V6.5Z" />
    <path d="M9 4v14M15 6.5v14" />
  </svg>
);

export const XIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M17.5 3h3.1l-6.8 7.8L21.8 21h-6.2l-4.9-6.4L5.1 21H2l7.3-8.3L2.4 3h6.4l4.4 5.8L17.5 3Zm-1.1 16.1h1.7L7.7 4.8H5.9l10.5 14.3Z" />
  </svg>
);

export const PortraitIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2.5" />
    <circle cx="9" cy="9.5" r="1.8" />
    <path d="m3.5 17 4.2-4.2a2 2 0 0 1 2.8 0L15 17" />
    <path d="m14 14.5 1.8-1.8a2 2 0 0 1 2.8 0l1.9 1.9" />
  </svg>
);

export const InstagramIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

export const ExternalIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M14 4h6v6" />
    <path d="M20 4 10 14" />
    <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
  </svg>
);

export const PawIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <ellipse cx="7" cy="8" rx="2" ry="2.6" />
    <ellipse cx="12" cy="6.2" rx="2.1" ry="2.8" />
    <ellipse cx="17" cy="8" rx="2" ry="2.6" />
    <ellipse cx="19.6" cy="12.8" rx="1.8" ry="2.2" />
    <path d="M12 11.2c2.6 0 5.3 2.4 5.3 4.7 0 2-1.7 3.3-3.6 3.3-.9 0-1.2-.3-1.7-.3s-.8.3-1.7.3c-1.9 0-3.6-1.3-3.6-3.3 0-2.3 2.7-4.7 5.3-4.7Z" />
  </svg>
);

export const RefreshIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20 11A8 8 0 0 0 6.3 6.3L4 8.5" />
    <path d="M4 4v4.5h4.5" />
    <path d="M4 13a8 8 0 0 0 13.7 4.7L20 15.5" />
    <path d="M20 20v-4.5h-4.5" />
  </svg>
);
