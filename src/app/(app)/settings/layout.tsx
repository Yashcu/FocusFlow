'use client';

import NavLink from '@/components/layout/nav-link'; // Correctly using your existing NavLink component
import { User, BriefcaseBusiness } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/settings', label: 'Account', icon: User },
    { href: '/settings/projects', label: 'Projects', icon: BriefcaseBusiness },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="md:w-1/4 lg:w-1/5">
        <nav className="flex flex-col space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              isActive={pathname === link.href}
              icon={link.icon}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
