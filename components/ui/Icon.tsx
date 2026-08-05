import type { ReactNode } from "react";

import type { IconName } from "@/content/types";

/**
 * Инлайновые иконки: без библиотеки, без лишних запросов.
 * Всегда декоративные — смысл несёт текст рядом.
 */
const paths: Record<IconName, ReactNode> = {
  ruble: (
    <path d="M9 20V4h5a4 4 0 0 1 0 8H7m0 4h7" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  shield: <path d="M12 3l7 3v6c0 4-3 7.5-7 9-4-1.5-7-5-7-9V6l7-3zm-3 9l2 2 4-4" />,
  broom: (
    <>
      <path d="M14 3l7 7" />
      <path d="M11 6l7 7-4 4-9 2 2-9 4-4z" />
    </>
  ),
  ruler: (
    <>
      <rect x="2" y="8" width="20" height="8" rx="2" />
      <path d="M7 8v3M12 8v4M17 8v3" />
    </>
  ),
  document: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  install: (
    <>
      <path d="M3 8h18v4a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8z" />
      <path d="M8 15v3M16 15v3M12 4v4" />
    </>
  ),
  check: <path d="M4 12.5l5 5L20 6.5" />,
  room: (
    <>
      <path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  kitchen: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M4 12h16M8 6.5v2M8 15.5v2" />
    </>
  ),
  bath: (
    <>
      <path d="M4 11h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3z" />
      <path d="M7 11V5.5A1.5 1.5 0 0 1 8.5 4h0A1.5 1.5 0 0 1 10 5.5M7 20l-1 1M17 20l1 1" />
    </>
  ),
  flat: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M12 4v17M3 12h9M16 8.5h2M16 16.5h2" />
    </>
  ),
  chevron: <path d="M6 9l6 6 6-6" />,
  phone: (
    <path d="M6.5 3h3l1.5 4-2 1.5a11 11 0 0 0 4.5 4.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3z" />
  ),
};

interface IconProps {
  readonly name: IconName;
  readonly className?: string;
}

export function Icon({ name, className = "size-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
