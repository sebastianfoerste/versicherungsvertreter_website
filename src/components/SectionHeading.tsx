import type { ReactNode } from "react";
import { cn } from "../utils/cn";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

export default function SectionHeading({ eyebrow, title, text, align = "left", dark, className }: Props) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <div className={cn("gc-eyebrow mb-3", dark && "text-gc-gold")}>{eyebrow}</div>}
      <h2 className={cn("mb-4", dark && "text-white")}>{title}</h2>
      {text && <p className={cn("text-[16px] leading-[26px] text-gc-muted", dark && "text-gc-ink-text")}>{text}</p>}
    </div>
  );
}
