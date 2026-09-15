'use client';

import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { CustomLink } from '@/components/ui/Link';
import { IconMap } from '@/lib/iconMap';
import { loginSchema, type LoginInput } from '@/lib/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';

type MessageType = 'success' | 'error' | '';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await signIn('credentials', {
        ...data,
        redirect: false,
        redirectTo: '/dashboard',
      });

      if (!response || response.error) {
        throw new Error('Correo electrónico o contraseña incorrectos.');
      }

      setMessage('Sesión iniciada correctamente. Redirigiendo...');
      setMessageType('success');

      reset({
        email: '',
        password: '',
      });

      window.location.assign(response.url ?? '/dashboard');
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

          <div className="flex justify-end">
            <CustomLink
              href="/forgot-password"
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
