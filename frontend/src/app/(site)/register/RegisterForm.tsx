'use client';

import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { CustomLink } from '@/components/ui/Link';
import { IconMap } from '@/lib/iconMap';
import { registerWithConfirmSchema } from '@/lib/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

type MessageType = 'success' | 'error' | '';

// Extendemos el schema para incluir acceptedTerms como booleano con validación
const registerSchema = registerWithConfirmSchema.extend({
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
});

type RegisterFormInput = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    eye: Eye,
    eyeOff: EyeOff,
    lock: LockKeyhole,
    mail: Mail,
    user: User,
    graduationCap: GraduationCap,
  } = IconMap.ui;

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      confirmPassword: '',
      activo: true,
      acceptedTerms: false,
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormInput) => {
    setMessage('');
    setMessageType('');
    setIsSubmitting(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { acceptedTerms, ...formData } = data;

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            errorData.error ||
            'Error al registrar el usuario.',
        );
      }

      setMessage('Usuario registrado correctamente. Redirigiendo...');
      setMessageType('success');

      reset({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: '',
        activo: true,
        acceptedTerms: false,
      });

      setTimeout(() => router.push('/login'), 1200);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'No se pudo registrar el usuario.';
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
            Nueva cuenta
          </span>
          <h2 className="text-foreground my-2.5 text-4xl tracking-[-0.045em]">
            Regístrate
          </h2>
          <p className="text-muted-foreground m-0 text-sm leading-relaxed">
            Completa tus datos para empezar a utilizar StudySync.
          </p>
        </header>

        <form className="grid gap-3.5" onSubmit={handleSubmit(onSubmit)}>
          {/* Campo Nombre */}
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <InputField
                label="Nombre"
                id="nombre"
                value={field.value}
                onChange={field.onChange}
                placeholder="Escribe tu nombre"
                autoComplete="given-name"
                icon={<User />}
                error={errors.nombre?.message}
                required
                disabled={isSubmitting}
                size="md"
                variant="default"
              />
            )}
          />

          {/* Campo Apellido */}
          <Controller
            name="apellido"
            control={control}
            render={({ field }) => (
              <InputField
                label="Apellido"
                id="apellido"
                value={field.value}
                onChange={field.onChange}
                placeholder="Escribe tu apellido"
                autoComplete="family-name"
                icon={<User />}
                error={errors.apellido?.message}
                required
                disabled={isSubmitting}
                size="md"
                variant="default"
              />
            )}
          />

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
                placeholder="Crea una contraseña"
                autoComplete="new-password"
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

          {/* Campo Confirmar Contraseña */}
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
                placeholder="Confirma tu contraseña"
                autoComplete="new-password"
                icon={<LockKeyhole />}
                error={errors.confirmPassword?.message}
                required
                disabled={isSubmitting}
                size="md"
                variant="default"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? 'Ocultar contraseña'
                        : 'Mostrar contraseña'
                    }
                    className="text-muted-foreground hover:text-primary grid cursor-pointer place-items-center border-0 bg-transparent p-1 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                }
              />
            )}
          />

          {/* Checkbox Términos y Condiciones */}
          <Controller
            name="acceptedTerms"
            control={control}
            render={({ field }) => (
              <label className="text-muted-foreground inline-flex cursor-pointer items-start gap-2 text-xs leading-relaxed">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="accent-primary mt-0.5"
                  disabled={isSubmitting}
                />
                <span>Acepto los términos y la política de privacidad.</span>
              </label>
            )}
          />
          {errors.acceptedTerms && (
            <p className="text-danger text-xs leading-relaxed">
              {errors.acceptedTerms.message}
            </p>
          )}

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
            aria-label={
              isSubmitting ? 'Registrando usuario...' : 'Crear cuenta'
            }
          >
            {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
          </Button>
        </form>

        <p className="text-muted-foreground mt-5 text-center text-sm">
          ¿Ya tienes una cuenta?
          <CustomLink
            href="/login"
            className="text-primary hover:text-primary/80 ml-1.5 font-semibold no-underline transition-colors"
          >
            Iniciar sesión
          </CustomLink>
        </p>
      </div>
    </section>
  );
}
