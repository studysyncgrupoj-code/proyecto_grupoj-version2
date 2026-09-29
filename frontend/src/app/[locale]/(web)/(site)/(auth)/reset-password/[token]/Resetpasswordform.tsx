'use client';

import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { CustomLink } from '@/components/ui/Link';
import { IconMap } from '@/lib/iconMap';
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from '@/lib/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface ResetPasswordFormProps {
  token: string;
}

const DEFAULT_VALUES: ResetPasswordInput = {
  password: '',
  confirmPassword: '',
};

/* ====================================================
   Envío
   ==================================================== */

async function submitNewPassword(
  token: string,
  password: string,
): Promise<string> {
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
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
        : 'No pudimos restablecer tu contraseña. Inténtalo de nuevo.',
    );
  }

  return typeof backendMessage === 'string'
    ? backendMessage
    : 'Tu contraseña se actualizó correctamente.';
}

// Ref estable: al mostrar el estado de éxito el foco pasa a su título.
const focusOnMount = (node: HTMLHeadingElement | null) => node?.focus();

/* ====================================================
   Formulario
   ==================================================== */

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  const { lock: LockKeyhole, graduationCap: GraduationCap } = IconMap.ui;

  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  const motionProps = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : -8 },
    transition: { duration: shouldReduceMotion ? 0 : 0.25 },
  };

  const onSubmit = async (data: ResetPasswordInput) => {
    setFeedback(null);
    try {
      const message = await submitNewPassword(token, data.password);
      setFeedback(message);
      setStatus('success');
      setTimeout(() => router.push('/login'), 1600);
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error inesperado. Inténtalo de nuevo.',
      );
      setStatus('error');
    }
  };

  const isInvalidLink =
    status === 'error' &&
    !!feedback &&
    /no es válido|expir|no válido/i.test(feedback);

  return (
    <section className="bg-background grid place-items-center p-6 lg:p-8">
      <div className="border-border bg-surface w-full max-w-122.5 rounded-3xl border p-7 shadow-xl lg:p-[30px_34px]">
        <div className="mb-7 flex items-center gap-3 lg:hidden">
          <span className="border-primary from-primary to-primary-hover text-primary-foreground grid h-10 w-10 place-items-center rounded-xl border bg-linear-to-br">
            <GraduationCap size={24} />
          </span>
          <strong className="text-foreground text-lg">StudySync</strong>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {status === 'success' ? (
            <motion.div
              key="success"
              role="status"
              className="flex flex-col items-center py-8 text-center"
              {...motionProps}
            >
              <span
                aria-hidden="true"
                className="bg-success/10 text-success flex size-14 items-center justify-center rounded-full"
              >
                <IconMap.ui.checkCircle className="size-8" />
              </span>
              <h2
                ref={focusOnMount}
                tabIndex={-1}
                className="text-foreground mt-5 text-2xl font-semibold tracking-[-0.03em] focus:outline-none"
              >
                Contraseña actualizada
              </h2>
              <p className="text-foreground-muted mt-2 max-w-sm text-sm leading-relaxed">
                {feedback} Te llevaremos a iniciar sesión en un momento.
              </p>
              <Button
                variant="primary"
                fullWidth
                className="mt-6"
                onClick={() => router.push('/login')}
              >
                Ir a iniciar sesión
              </Button>
            </motion.div>
          ) : (
            <motion.div key="form" {...motionProps}>
              <header className="mb-6">
                <span className="text-primary text-xs font-extrabold tracking-[0.13em] uppercase">
                  Nueva contraseña
                </span>
                <h2 className="text-foreground my-2.5 text-4xl tracking-[-0.045em]">
                  Restablece tu contraseña
                </h2>
                <p className="text-foreground-muted m-0 text-sm leading-relaxed">
                  Crea una nueva contraseña segura para tu cuenta de StudySync.
                </p>
              </header>

              <form
                className="grid gap-3.5"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                aria-busy={isSubmitting}
              >
                <fieldset disabled={isSubmitting} className="grid gap-3.5">
                  <legend className="sr-only">
                    Formulario de restablecimiento de contraseña
                  </legend>

                  {/* Nueva contraseña */}
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        label="Nueva contraseña"
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Crea una nueva contraseña"
                        autoComplete="new-password"
                        icon={<LockKeyhole />}
                        error={errors.password?.message}
                        required
                        disabled={isSubmitting}
                        size="md"
                        variant="default"
                        rightElement={
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            icon={showPassword ? 'eyeOff' : 'eye'}
                            aria-label={
                              showPassword
                                ? 'Ocultar contraseña'
                                : 'Mostrar contraseña'
                            }
                            onClick={() => setShowPassword((prev) => !prev)}
                          />
                        }
                      />
                    )}
                  />

                  {/* Confirmar contraseña */}
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        label="Confirmar contraseña"
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Repite tu nueva contraseña"
                        autoComplete="new-password"
                        icon={<LockKeyhole />}
                        error={errors.confirmPassword?.message}
                        required
                        disabled={isSubmitting}
                        size="md"
                        variant="default"
                        rightElement={
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            icon={showConfirmPassword ? 'eyeOff' : 'eye'}
                            aria-label={
                              showConfirmPassword
                                ? 'Ocultar contraseña'
                                : 'Mostrar contraseña'
                            }
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                          />
                        }
                      />
                    )}
                  />

                  {/* Mensaje de error */}
                  {status === 'error' && feedback && (
                    <div
                      role="alert"
                      className="border-danger/30 bg-danger/10 text-danger m-0 grid gap-2 rounded-xl border p-2.5 text-sm leading-relaxed"
                    >
                      <p className="m-0">{feedback}</p>
                      {isInvalidLink && (
                        <CustomLink
                          href="/login"
                          className="text-danger font-semibold underline underline-offset-2"
                        >
                          Solicitar un nuevo enlace
                        </CustomLink>
                      )}
                    </div>
                  )}

                  {/* Botón de envío */}
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    icon="arrowRight"
                    iconPosition="right"
                    type="submit"
                    disabled={isSubmitting || !isValid}
                  >
                    {isSubmitting
                      ? 'Actualizando...'
                      : 'Restablecer contraseña'}
                  </Button>
                </fieldset>
              </form>

              <p className="text-foreground-muted mt-5 text-center text-sm">
                ¿Recordaste tu contraseña?
                <CustomLink
                  href="/login"
                  className="text-primary hover:text-primary-hover ml-1.5 font-semibold no-underline transition-colors"
                >
                  Iniciar sesión
                </CustomLink>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
