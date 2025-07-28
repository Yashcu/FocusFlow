import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { type ReactNode } from "react";

const NavLink = ({
  href,
  icon: Icon,
  children,
  isActive,
}: {
  href: string;
  icon: React.ElementType;
  children: ReactNode;
  isActive?: boolean;
}) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
      isActive && "bg-muted text-primary"
    )}
  >
    <Icon className="h-4 w-4" />
    {children}
  </Link>
);

export default NavLink;
