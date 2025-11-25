import { ReactNode } from "react";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  background?: "white" | "gray" | "gradient" | "transparent";
  padding?: "sm" | "md" | "lg" | "xl";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "6xl" | "7xl" | "full";
  withPattern?: boolean;
  patternOpacity?: number;
}

const backgroundClasses = {
  white: "bg-white",
  gray: "bg-slate-50",
  gradient: "bg-gradient-to-br from-slate-50 via-white to-blue-50",
  transparent: "bg-transparent",
};

const paddingClasses = {
  sm: "py-8",
  md: "py-12",
  lg: "py-12 lg:py-16",
  xl: "py-16 lg:py-20",
};

const maxWidthClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
};

export function SectionContainer({
  children,
  className = "",
  background = "white",
  padding = "lg",
  maxWidth = "6xl",
  withPattern = false,
  patternOpacity = 20,
}: SectionContainerProps) {
  return (
    <section
      className={`${backgroundClasses[background]} ${paddingClasses[padding]} relative ${className}`}
    >
      {withPattern && (
        <div className={`absolute inset-0 opacity-${patternOpacity}`}>
          <div className="absolute top-20 right-20 w-32 h-32 bg-red-50 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-orange-50 rounded-full blur-2xl"></div>
        </div>
      )}

      <div
        className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 relative z-10`}
      >
        {children}
      </div>
    </section>
  );
}
