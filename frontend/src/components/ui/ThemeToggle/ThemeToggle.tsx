'use client';

import ThemeToggleClient from './ThemeToggleClient';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function ThemeToggle({
  size = 'md',
}: ThemeToggleProps) {
  return (
    <ThemeToggleClient
      size={size}
      toLightLabel="Cambiar a modo claro"
      toDarkLabel="Cambiar a modo oscuro"
    />
  );
}
