'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { BsFillMoonStarsFill } from 'react-icons/bs';
import { FaSun } from 'react-icons/fa6';

interface Particle {
  id: number;
  delay: number;
  duration: number;
}

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function ThemeToggle({ size = 'md' }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');

  // Definir tamaños
  const sizes = {
    sm: {
      button: 'h-10 w-16', // 40px x 64px
      thumb: 'h-7 w-7', // 28px x 28px
      icon: 14,
      padding: 'p-1',
      thumbX: 28, // desplazamiento para sm
    },
    md: {
      button: 'h-14 w-22', // 56px x 88px
      thumb: 'h-10 w-10', // 40px x 40px
      icon: 18,
      padding: 'p-1.5',
      thumbX: 38,
    },
    lg: {
      button: 'h-16 w-26', // 64px x 104px
      thumb: 'h-11 w-11', // 44px x 44px
      icon: 20,
      padding: 'p-1.5',
      thumbX: 46,
    },
  };

  const currentSize = sizes[size] || sizes.md;

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  const generateParticles = () => {
    const newParticles: Particle[] = [];
    const particleCount = 3;

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        delay: i * 0.1,
        duration: 0.6 + i * 0.1,
      });
    }

    setParticles(newParticles);
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
      setParticles([]);
    }, 1000);
  };

  const handleToggle = () => {
    generateParticles();
    setTheme(isDark ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <div className="relative inline-block">
        <div
          className={`relative flex ${currentSize.button} items-center rounded-full bg-gray-200 ${currentSize.padding}`}
        >
          <div className={`${currentSize.thumb} rounded-full bg-gray-300`} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id="grain-light">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="4"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="saturate"
              values="0"
              result="desaturatedNoise"
            />
            <feComponentTransfer in="desaturatedNoise" result="lightGrain">
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="lightGrain" mode="overlay" />
          </filter>
          <filter id="grain-dark">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="4"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="saturate"
              values="0"
              result="desaturatedNoise"
            />
            <feComponentTransfer in="desaturatedNoise" result="darkGrain">
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="darkGrain" mode="overlay" />
          </filter>
        </defs>
      </svg>

      <motion.button
        ref={toggleRef}
        onClick={handleToggle}
        className={`relative flex ${currentSize.button} items-center ${currentSize.padding} overflow-hidden rounded-full transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none`}
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at top left, #1e293b 0%, #0f172a 40%, #020617 100%)'
            : 'radial-gradient(ellipse at top left, #ffffff 0%, #f1f5f9 40%, #cbd5e1 100%)',
          boxShadow: isDark
            ? `
              inset 3px 3px 8px rgba(0, 0, 0, 0.9),
              inset -3px -3px 8px rgba(71, 85, 105, 0.4),
              inset 0 0 15px rgba(0, 0, 0, 0.6),
              0 2px 4px rgba(0, 0, 0, 0.4),
              0 8px 16px rgba(0, 0, 0, 0.3)
            `
            : `
              inset 3px 3px 8px rgba(148, 163, 184, 0.5),
              inset -3px -3px 8px rgba(255, 255, 255, 1),
              inset 0 0 15px rgba(203, 213, 225, 0.3),
              0 2px 4px rgba(0, 0, 0, 0.1),
              0 8px 16px rgba(0, 0, 0, 0.08)
            `,
          border: isDark
            ? '1.5px solid rgba(51, 65, 85, 0.6)'
            : '1.5px solid rgba(203, 213, 225, 0.6)',
          borderRadius: '9999px',
        }}
        aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
        role="switch"
        aria-checked={isDark}
        whileTap={{ scale: 0.95 }}
      >
        {/* Capa de borde interno */}
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            top: '3px',
            right: '3px',
            bottom: '3px',
            left: '3px',
            boxShadow: isDark
              ? 'inset 0 1px 4px rgba(0, 0, 0, 0.9), inset 0 -1px 2px rgba(71, 85, 105, 0.3)'
              : 'inset 0 1px 4px rgba(100, 116, 139, 0.4), inset 0 -1px 2px rgba(255, 255, 255, 0.8)',
          }}
        />

        {/* Iconos de fondo */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">
          <FaSun
            size={currentSize.icon}
            className={isDark ? 'text-yellow-100' : 'text-amber-600'}
          />
          <BsFillMoonStarsFill
            size={currentSize.icon}
            className={isDark ? 'text-yellow-100' : 'text-slate-700'}
          />
        </div>

        {/* Thumb circular */}
        <motion.div
          className={`relative z-10 flex ${currentSize.thumb} items-center justify-center overflow-hidden rounded-full`}
          style={{
            background: isDark
              ? 'linear-gradient(145deg, #64748b 0%, #475569 50%, #334155 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #fefefe 50%, #f8fafc 100%)',
            boxShadow: isDark
              ? `
                inset 2px 2px 3px rgba(100, 116, 139, 0.4),
                inset -2px -2px 3px rgba(0, 0, 0, 0.8),
                0 4px 16px rgba(0, 0, 0, 0.6),
                0 2px 8px rgba(0, 0, 0, 0.5)
              `
              : `
                inset 2px 2px 3px rgba(203, 213, 225, 0.3),
                inset -2px -2px 3px rgba(255, 255, 255, 1),
                0 4px 16px rgba(0, 0, 0, 0.18),
                0 2px 8px rgba(0, 0, 0, 0.12)
              `,
            border: isDark
              ? '1.5px solid rgba(148, 163, 184, 0.3)'
              : '1.5px solid rgba(255, 255, 255, 0.9)',
            borderRadius: '9999px',
          }}
          animate={{
            x: isDark ? currentSize.thumbX : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 22,
          }}
        >
          {/* Brillo del thumb */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                'linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, transparent 40%, rgba(0, 0, 0, 0.1) 100%)',
              mixBlendMode: 'overlay',
              borderRadius: '9999px',
            }}
          />

          {/* Partículas */}
          {isAnimating &&
            particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: '8px',
                    height: '8px',
                    background: isDark
                      ? 'radial-gradient(circle, rgba(147, 197, 253, 0.5) 0%, rgba(147, 197, 253, 0) 70%)'
                      : 'radial-gradient(circle, rgba(251, 191, 36, 0.7) 0%, rgba(251, 191, 36, 0) 70%)',
                    borderRadius: '9999px',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: isDark ? 5 : 6, opacity: [0, 1, 0] }}
                  transition={{
                    duration: isDark ? 0.5 : particle.duration,
                    delay: particle.delay,
                    ease: 'easeOut',
                  }}
                />
              </motion.div>
            ))}

          {/* Icono del thumb */}
          <div className="relative z-10">
            {isDark ? (
              <BsFillMoonStarsFill
                size={currentSize.icon - 2}
                className="text-yellow-200"
              />
            ) : (
              <FaSun size={currentSize.icon - 2} className="text-amber-500" />
            )}
          </div>
        </motion.div>
      </motion.button>
    </div>
  );
}
