import { ReactNode } from "react";
import Link from "next/link";

interface ButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function Button({
  href,
  children,
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`bg-white text-black px-6 py-4 rounded-md ${className}`}
    >
      {children}
    </Link>
  );
}
