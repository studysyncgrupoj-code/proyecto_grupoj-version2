'use client';

import LanguageToggle from '@/components/ui/LanguageToggle';
import Logo from '@/components/ui/logo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { HEADER_LINKS, isNavLinkActive } from '@/config/navigation';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Button } from '../../ui/Button';

const MOBILE_MENU_ID = 'mobile-menu';

export default function Header() {
  const t = useTranslations('header');
  const tLinks = useTranslations('header.links');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Cierra el menú móvil con Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="border-border bg-background/76 fixed top-0 left-0 z-50 flex min-h-20 w-full items-center justify-between border-b px-6 backdrop-blur-md sm:px-12">
      {/* Brand / Logo */}
      <Logo />

      {/* Navigation Menu - Desktop */}
      <nav
        className="hidden items-center gap-6 lg:flex lg:gap-8"
        aria-label={t('navLabel')}
      >
        {HEADER_LINKS.map((link) => {
          const isActive = isNavLinkActive(pathname, link);
          const isExternal = link.href.startsWith('http');

          if (isExternal) {
            return (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative px-0 py-7 text-xs font-bold transition-colors duration-200 ${
                  isActive
                    ? 'text-foreground'
                    : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                {tLinks(link.labelKey)}
                <span
                  className={`bg-primary absolute right-0 bottom-0 left-0 h-0.5 rounded-full shadow-md transition-transform duration-200 ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  aria-hidden="true"
                />
              </a>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-0 py-7 text-xs font-bold transition-colors duration-200 ${
                isActive
                  ? 'text-foreground'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              {tLinks(link.labelKey)}
              <span
                className={`bg-primary absolute right-0 bottom-0 left-0 h-0.5 rounded-full shadow-md transition-transform duration-200 ${
                  isActive ? 'scale-x-100' : 'scale-x-0'
                }`}
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </nav>

      {/* Actions - Desktop */}
      <div className="hidden items-center gap-4 lg:flex">
        <LanguageToggle />
        <ThemeToggle size="sm" />

        <Button href="/login" variant="ghost" size="sm">
          {t('login')}
        </Button>

        <Button
          href="/register"
          variant="primary"
          size="sm"
          icon="arrowRight"
          iconPosition="right"
        >
          {t('register')}
        </Button>
      </div>

      {/* Botón del menú - Mobile */}
      <Button
        variant="ghost"
        size="lg"
        icon={mobileMenuOpen ? 'close' : 'menu'}
        className="text-foreground lg:hidden"
        aria-label={mobileMenuOpen ? t('closeMenu') : t('openMenu')}
        aria-expanded={mobileMenuOpen}
        aria-controls={MOBILE_MENU_ID}
        onClick={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* Navigation Menu - Mobile */}
      {mobileMenuOpen && (
        <div
          id={MOBILE_MENU_ID}
          className="border-border bg-background absolute top-20 right-4 left-4 z-50 flex max-h-[calc(100dvh-6rem)] flex-col items-stretch gap-1 overflow-y-auto rounded-2xl border p-4 shadow-2xl lg:hidden"
        >
          {HEADER_LINKS.map((link) => {
            const isActive = isNavLinkActive(pathname, link);
            const isExternal = link.href.startsWith('http');

            if (isExternal) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative rounded-lg px-3 py-2 text-xs font-bold transition-colors duration-200 ${
                    isActive
                      ? 'text-foreground bg-surface-active'
                      : 'text-foreground-muted hover:bg-surface-hover hover:text-foreground'
                  }`}
                  onClick={closeMobileMenu}
                >
                  {tLinks(link.labelKey)}
                </a>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-3 py-2 text-xs font-bold transition-colors duration-200 ${
                  isActive
                    ? 'text-foreground bg-surface-active'
                    : 'text-foreground-muted hover:bg-surface-hover hover:text-foreground'
                }`}
                onClick={closeMobileMenu}
              >
                {tLinks(link.labelKey)}
              </Link>
            );
          })}

          <hr className="border-border my-3" />

          {/* Preferencias: idioma y tema */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3">
            <div className="flex items-center gap-2.5">
              <span className="text-foreground-muted text-xs font-semibold">
                {t('language')}
              </span>
              <LanguageToggle />
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-foreground-muted text-xs font-semibold">
                {t('theme')}
              </span>
              <ThemeToggle size="sm" />
            </div>
          </div>

          <hr className="border-border my-3" />

          {/* Login */}
          <Button
            href="/login"
            variant="ghost"
            size="sm"
            fullWidth
            onClick={closeMobileMenu}
          >
            {t('login')}
          </Button>

          {/* Registro */}
          <Button
            href="/register"
            variant="primary"
            size="sm"
            icon="arrowRight"
            iconPosition="right"
            fullWidth
            onClick={closeMobileMenu}
          >
            {t('register')}
          </Button>
        </div>
      )}
    </header>
  );
}
