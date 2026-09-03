'use client';

import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { CustomLink } from '@/components/ui/Link';
import { IconMap } from '@/lib/iconMap';
import { loginSchema, type LoginInput } from '@/lib/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

type MessageType = 'success' | 'error' | '';

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    eye: Eye,
    eyeOff: EyeOff,
    lock: LockKeyhole,
    mail: Mail,
    graduationCap: GraduationCap,
  } = IconMap.ui;

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginInput) => {
    setMessage('');
    setMessageType('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || errorData.error || 'No se pudo iniciar sesión.',
        );
      }

      setMessage('Sesión iniciada correctamente. Redirigiendo...');
      setMessageType('success');

      reset({
        email: '',
        password: '',
      });

      setTimeout(() => router.push('/dashboard'), 1200);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'No se pudo iniciar sesión.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-background grid place-items-center p-6 lg:p-8">
      <div className="border-border/20 bg-card/50 w-full max-w-122.5 rounded-3xl border p-7 shadow-xl backdrop-blur-sm lg:p-[30px_34px]">
        <div className="mb-7 flex items-center gap-3 lg:hidden">
          <span className="border-primary/40 from-primary to-primary/70 text-primary-foreground grid h-10 w-10 place-items-center rounded-xl border bg-linear-to-br">
            <GraduationCap size={24} />
          </span>
          <strong className="text-foreground text-lg">StudySync</strong>
        </div>

        <header className="mb-6">
          <span className="text-primary text-xs font-extrabold tracking-[0.13em] uppercase">
            Bienvenido de nuevo
          </span>
          <h2 className="text-foreground my-2.5 text-4xl tracking-[-0.045em]">
            Inicia sesión
          </h2>
          <p className="text-muted-foreground m-0 text-sm leading-relaxed">
            Ingresa tus datos para continuar a tu espacio de trabajo.
          </p>
        </header>

        <form className="grid gap-3.5" onSubmit={handleSubmit(onSubmit)}>
          {/* Campo Email */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <InputField
                label="Correo electrónico"
                id="email"
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

          {/* Campo Contraseña */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <InputField
                label="Contraseña"
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={field.value}
                onChange={field.onChange}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                icon={<LockKeyhole />}
                error={errors.password?.message}
                required
                disabled={isSubmitting}
                size="md"
                variant="default"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                    }
                    className="text-muted-foreground hover:text-primary grid cursor-pointer place-items-center border-0 bg-transparent p-1 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            )}
          />

          {/* Recordarme + Olvidé mi contraseña */}
          <div className="flex items-center justify-between gap-2">
            <label className="text-muted-foreground inline-flex cursor-pointer items-center gap-2 text-xs leading-relaxed">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-primary"
                disabled={isSubmitting}
              />
              <span>Recordarme</span>
            </label>

            <CustomLink
              href="/recuperar-password"
              className="text-primary hover:text-primary/80 text-xs font-semibold no-underline transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </CustomLink>
          </div>

          {/* Mensaje de estado */}
          {message && (
            <p
              className={`m-0 rounded-xl border p-2.5 text-sm leading-relaxed ${
                messageType === 'success'
                  ? 'border-success/30 bg-success/10 text-success'
                  : 'border-danger/30 bg-danger/10 text-danger'
              }`}
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          )}

          {/* Botón de envío */}
          <Button
            variant={isSubmitting ? 'disabled' : 'primary'}
            size="lg"
            fullWidth
            icon="arrowRight"
            iconPosition="right"
            type="submit"
            disabled={isSubmitting || !isValid}
            aria-label={isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>

          <div className="text-muted-foreground my-1 flex items-center gap-3 text-xs before:h-px before:flex-1 before:bg-current/15 before:content-[''] after:h-px after:flex-1 after:bg-current/15 after:content-['']">
            o continúa con
          </div>

          <button
            type="button"
            className="border-border/50 bg-background/50 hover:bg-background text-foreground flex items-center justify-center gap-2.5 rounded-xl border py-2.5 text-sm font-medium transition-colors"
          >
            <span className="grid size-5 place-items-center text-sm font-bold">
              G
            </span>
            Continuar con Google
          </button>
        </form>

        <p className="text-muted-foreground mt-5 text-center text-sm">
          ¿Todavía no tienes una cuenta?
          <CustomLink
            href="/register"
            className="text-primary hover:text-primary/80 ml-1.5 font-semibold no-underline transition-colors"
          >
            Crear cuenta
          </CustomLink>
        </p>
      </div>
    </section>
  );
}
