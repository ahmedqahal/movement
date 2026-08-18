// Small, consistent line icons (stroke-based, inherit currentColor).
const S = ({ size = 22, children, ...p }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    {children}
  </svg>
)

export const IconHome = (p) => (
  <S {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </S>
)

export const IconAnatomy = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2.2" />
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
  </S>
)

export const IconLearn = (p) => (
  <S {...p}>
    <path d="M3 5.5A2 2 0 0 1 5 4h6v15H5a2 2 0 0 0-2 1.5z" />
    <path d="M21 5.5A2 2 0 0 0 19 4h-6v15h6a2 2 0 0 1 2 1.5z" />
  </S>
)

export const IconTools = (p) => (
  <S {...p}>
    <path d="M14.5 5.5a3.5 3.5 0 0 0-4.9 4.4L4 15.5 8.5 20l5.6-5.6a3.5 3.5 0 0 0 4.4-4.9l-2.3 2.3-2.1-.6-.6-2.1z" />
  </S>
)

export const IconGlossary = (p) => (
  <S {...p}>
    <path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z" />
    <path d="M9 8h6M9 12h6M9 16h3" />
  </S>
)

export const IconGear = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
  </S>
)

export const IconChip = (p) => (
  <S {...p}>
    <rect x="6" y="6" width="12" height="12" rx="1.5" />
    <path d="M9 6V3M15 6V3M9 21v-3M15 21v-3M6 9H3M6 15H3M21 9h-3M21 15h-3" />
    <rect x="10" y="10" width="4" height="4" rx="0.5" />
  </S>
)

export const IconStrap = (p) => (
  <S {...p}>
    <rect x="8.5" y="8.5" width="7" height="7" rx="1.5" />
    <path d="M10 8.5 9 3h6l-1 5.5M10 15.5 9 21h6l-1-5.5" />
  </S>
)

export const IconBuild = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l2.5 2.5" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
  </S>
)

export const IconCheck = (p) => (
  <S {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </S>
)

export const IconArrow = (p) => (
  <S {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </S>
)

export const IconAlert = (p) => (
  <S {...p}>
    <path d="M12 3 2.5 20h19z" />
    <path d="M12 10v4M12 17.5v.5" />
  </S>
)

export const IconBulb = (p) => (
  <S {...p}>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.4 1 2.5h6c0-1.1.3-1.8 1-2.5A6 6 0 0 0 12 3z" />
  </S>
)

export const IconClock = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </S>
)

export const IconLevel = (p) => (
  <S {...p}>
    <path d="M5 20V10M12 20V4M19 20v-7" />
  </S>
)

export const IconStethoscope = (p) => (
  <S {...p}>
    <path d="M5 4v5a5 5 0 0 0 10 0V4" />
    <path d="M10 18a4 4 0 0 0 8 0v-3" />
    <circle cx="19" cy="13" r="2" />
  </S>
)

export const IconBook = (p) => (
  <S {...p}>
    <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" />
    <path d="M4 19a2 2 0 0 1 2-2h12" />
  </S>
)

export const IconLog = (p) => (
  <S {...p}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M4 9h16M9 4v16" />
  </S>
)

export const IconPlus = (p) => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
)

export const IconTrash = (p) => (
  <S {...p}>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13" />
  </S>
)

export const IconCamera = (p) => (
  <S {...p}>
    <path d="M4 8a2 2 0 0 1 2-2h1l1.5-2h7L18 6h0a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </S>
)

export const IconClose = (p) => (
  <S {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </S>
)

export const IconSearch = (p) => (
  <S {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </S>
)

export const IconCalc = (p) => (
  <S {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M8 7h8" />
    <path d="M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h4" />
  </S>
)

export const IconSun = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </S>
)

export const IconMoon = (p) => (
  <S {...p}>
    <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z" />
  </S>
)

export const IconPrint = (p) => (
  <S {...p}>
    <path d="M6 9V3h12v6" />
    <rect x="6" y="13" width="12" height="8" />
    <path d="M6 17H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2" />
  </S>
)

export const IconDownload = (p) => (
  <S {...p}>
    <path d="M12 4v10M8 11l4 4 4-4M5 19h14" />
  </S>
)

export const IconPlate = (p) => (
  <S {...p}>
    <rect x="3" y="4" width="18" height="16" rx="1.5" />
    <circle cx="9" cy="12" r="3.5" />
    <path d="M14 9h4M14 13h4M14 16h2" />
  </S>
)

export const IconLayers = (p) => (
  <S {...p}>
    <path d="M12 3 3 8l9 5 9-5-9-5z" />
    <path d="M3 13l9 5 9-5" />
  </S>
)
