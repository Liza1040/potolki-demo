import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "cta" | "brand" | "ghost";
type Size = "md" | "lg";

/**
 * ВАЖНО: display зашит в base. Передать снаружи `hidden` или `flex` через
 * className не выйдет — конфликт утилит решается порядком в CSS, а не в
 * атрибуте, и `inline-flex` побеждает. Прятать/растягивать кнопку нужно
 * обёрткой вокруг неё.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-bold " +
  "transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 " +
  "select-none text-center";

/**
 * Цвет текста на заливке — отдельные токены on-cta и on-brand, а не ink/white:
 * на светлой теме это тёмный текст на янтарном и белый на синем, на тёмной —
 * оба тёмные. Зашитый white провалил бы контраст на золотой кнопке (2.8:1).
 */
const variants: Record<Variant, string> = {
  cta: "bg-cta text-on-cta hover:bg-cta-dark active:bg-cta-dark shadow-sm",
  brand: "bg-brand text-on-brand hover:bg-brand-dark active:bg-brand-dark",
  ghost:
    "border border-control bg-panel text-ink hover:border-brand hover:text-brand",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 text-[15px]",
  lg: "min-h-14 px-6 py-3.5 text-base sm:text-[17px]",
};

interface CommonProps {
  readonly children: ReactNode;
  readonly variant?: Variant;
  readonly size?: Size;
  readonly className?: string;
}

interface LinkButtonProps extends CommonProps {
  readonly href: string;
}

export function LinkButton({
  href,
  children,
  variant = "cta",
  size = "lg",
  className = "",
}: LinkButtonProps) {
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </a>
  );
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button({
  children,
  variant = "cta",
  size = "lg",
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
