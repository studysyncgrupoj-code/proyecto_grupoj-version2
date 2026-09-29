'use client';

import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { IconMap } from '@/lib/iconMap';
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '@/lib/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

type SubmitStatus = 'idle' | 'success' | 'error';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DEFAULT_VALUES: ForgotPasswordInput = { email: '' };

/* ====================================================
   Envío
   ==================================================== */

async function requestPasswordReset(email: string): Promise<string> {
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data: unknown = await response.json().catch(() => null);
  const backendMessage =
    data && typeof data === 'object' && 'message' in data
      ? (data as { message?: unknown }).message
      : null;

  if (!response.ok) {
    throw new Error(
      typeof backendMessage === 'string'
        ? backendMessage
        : 'No pudimos procesar tu solicitud. Inténtalo de nuevo.',
    );
  }

  return typeof backendMessage === 'string'
    ? backendMessage
    : 'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.';
}

// Ref estable: al mostrar el estado de éxito el foco pasa a su título.
const focusOnMount = (node: HTMLHeadingElement | null) => node?.focus();

/* ====================================================
   Modal
   ==================================================== */

export default function ForgotPasswordModal({
  isOpen,
  setIsOpen,
}: ForgotPasswordModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  const { mail: Mail } = IconMap.ui;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  // Al cerrar el modal, se reinician el formulario y el estado tras la
  // animación de salida, para que la próxima apertura empiece desde cero.
  useEffect(() => {
    if (isOpen) return;

    const timeout = setTimeout(() => {
      reset(DEFAULT_VALUES);
      setStatus('idle');
      setFeedback(null);
    }, 200);

    return () => clearTimeout(timeout);
  }, [isOpen, reset]);

  // Permite cerrar el modal con la tecla Escape.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  const handleClose = () => {
    if (isSubmitting) return;
    setIsOpen(false);
  };

  const onSubmit = async (data: ForgotPasswordInput) => {
    setFeedback(null);
    try {
      const message = await requestPasswordReset(data.email);
      setFeedback(message);
      setStatus('success');
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error inesperado. Inténtalo de nuevo.',
      );
      setStatus('error');
    }
  };

  const overlayMotion = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: shouldReduceMotion ? 0 : 0.2 },
  };

  const dialogMotion = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 16, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : 12, scale: 0.98 },
    transition: { duration: shouldReduceMotion ? 0 : 0.25 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="bg-foreground/40 fixed inset-0 z-100 grid place-items-center p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) handleClose();
          }}
          {...overlayMotion}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-password-title"
            className="border-border bg-surface relative w-full max-w-107.5 rounded-3xl border p-7 shadow-xl"
            {...dialogMotion}
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon="close"
              aria-label="Cerrar"
              onClick={handleClose}
              className="absolute top-4 right-4"
            />

            <AnimatePresence mode="wait" initial={false}>
              {status === 'success' ? (
                <motion.div
                  key="success"
                  role="status"
                  className="flex flex-col items-center pt-4 pb-2 text-center"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                >
                  <span
                    aria-hidden="true"
                    className="bg-success/10 text-success flex size-14 items-center justify-center rounded-full"
                  >
                    <IconMap.ui.checkCircle className="size-8" />
                  </span>
                  <h2
                    id="forgot-password-title"
                    ref={focusOnMount}
                    tabIndex={-1}
                    className="text-foreground mt-5 text-2xl font-semibold tracking-[-0.03em] focus:outline-none"
                  >
                    Revisa tu correo
                  </h2>
                  <p className="text-foreground-muted mt-2 max-w-sm text-sm leading-relaxed">
                    {feedback}
                  </p>
                  <Button
                    variant="primary"
                    fullWidth
                    className="mt-6"
                    onClick={handleClose}
                  >
                    Volver a inicio de sesión
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                >
                  <header className="mb-6 pr-8">
                    <span className="bg-primary/10 text-primary grid size-11 place-items-center rounded-xl">
                      <Mail size={20} />
                    </span>
                    <h2
                      id="forgot-password-title"
                      className="text-foreground mt-4 text-2xl font-semibold tracking-[-0.03em]"
                    >
                      ¿Olvidaste tu contraseña?
                    </h2>
                    <p className="text-foreground-muted mt-2 text-sm leading-relaxed">
                      Ingresa tu correo electrónico y te enviaremos las
                      instrucciones para restablecerla.
                    </p>
                  </header>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="grid gap-4"
                    aria-busy={isSubmitting}
                  >
                    <fieldset disabled={isSubmitting} className="grid gap-4">
                      <legend className="sr-only">
                        Formulario de recuperación de contraseña
                      </legend>

                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <InputField
                            label="Correo electrónico"
                            id="forgot-password-email"
                            type="email"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="nombre@correo.com"
                            autoComplete="email"
                            icon={<Mail />}
                            error={errors.email?.message}
                            required
                            disabled={isSubmitting}
                            size="md"
                            variant="default"
                          />
                        )}
                      />

                      {status === 'error' && feedback && (
                        <p
                          role="alert"
                          className="border-danger/30 bg-danger/10 text-danger m-0 rounded-xl border p-2.5 text-sm leading-relaxed"
                        >
                          {feedback}
                        </p>
                      )}

                      <div className="mt-1 grid gap-2.5">
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          fullWidth
                          disabled={!isValid || isSubmitting}
                          icon={isSubmitting ? undefined : 'arrowRight'}
                          iconPosition="right"
                        >
                          {isSubmitting
                            ? 'Enviando...'
                            : 'Enviar instrucciones'}
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="lg"
                          fullWidth
                          disabled={isSubmitting}
                          onClick={handleClose}
                        >
                          Volver a inicio de sesión
                        </Button>
                      </div>
                    </fieldset>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
