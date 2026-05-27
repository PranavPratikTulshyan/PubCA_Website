'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Resources', href: '/resources' },
  { label: 'Learnings', href: '/learnings' },
  { label: 'My Builts', href: '/my-builts' },
  { label: 'Talk to Me', href: '/talk-to-me' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-navbar bg-white/85 backdrop-blur-md border-b border-neutral-border">
        <nav className="max-w-7xl mx-auto px-6 md:px-8 py-0 flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="font-heading font-bold text-heading-lg text-neutral-text-primary hover:text-primary-500 transition-colors"
          >
            Pranav PT
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`font-body text-body-md font-medium transition-colors ${
                      isActive
                        ? 'text-primary-500'
                        : 'text-neutral-text-secondary hover:text-primary-500'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-neutral-bg-secondary rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6 text-neutral-text-primary" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-neutral-text-primary" />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-20 left-0 right-0 bg-white border-b border-neutral-border md:hidden z-dropdown">
          <ul className="flex flex-col px-6 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block py-3 font-body text-body-md font-medium transition-colors ${
                      isActive
                        ? 'text-primary-500'
                        : 'text-neutral-text-secondary hover:text-primary-500'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
