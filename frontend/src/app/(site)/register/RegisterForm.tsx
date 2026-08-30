'use client';

import { IconMap } from '@/lib/iconMap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';

// Tipos para el formulario
interface FormData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: 'ESTUDIANTE' | 'PROFESOR' | 'ADMINISTRADOR';
  activo: boolean;
}

type MessageType = 'success' | 'error' | '';

const INITIAL_FORM_DATA: FormData = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  rol: 'ESTUDIANTE',
  activo: true,
};

// Componente para los campos de entrada reutilizable
interface InputFieldProps {
  label: string;
  name?: string;
  type?: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
  isSelect?: boolean;
  options?: Array<{ value: string; label: string }>;
}

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  required = true,
  icon,
  rightElement,
  isSelect = false,
  options = [],
}: InputFieldProps) => {
  return (
    <label className="grid gap-1.5">
      <span className="text-foreground/90 text-sm font-semibold">{label}</span>
      <div className="border-border bg-background/50 text-muted-foreground hover:border-primary/50 hover:bg-background/80 hover:text-primary focus-within:border-primary/70 focus-within:bg-background/80 focus-within:text-primary flex min-h-12 items-center gap-3 rounded-xl border px-3.5 shadow-sm transition-all duration-200 focus-within:-translate-y-0.5 focus-within:shadow-md hover:-translate-y-0.5">
        <span className="shrink-0">{icon}</span>

        {isSelect ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="text-foreground [&>option]:bg-background [&>option]:text-foreground w-full min-w-0 cursor-pointer border-0 bg-transparent outline-0"
            required={required}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            required={required}
            className="text-foreground placeholder:text-muted-foreground/60 w-full min-w-0 border-0 bg-transparent outline-0"
          />
        )}

        {rightElement && <span className="shrink-0">{rightElement}</span>}
      </div>
    </label>
  );
};

export default function RegisterForm() {
  const router = useRouter();

  // Extraer iconos del mapeador con nombres correctos
  const {
    eye: Eye,
    eyeOff: EyeOff,
    lock: LockKeyhole,
    mail: Mail,
    user: User,
    graduationCap: GraduationCap,
    arrowRight: ArrowRight,
  } = IconMap.ui;

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<MessageType>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setMessageType('');

    // Validación de contraseñas
    if (formData.password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      setMessageType('error');
      return;
    }

    // Validación de longitud de contraseña
    if (formData.password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres.');
      setMessageType('error');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        let errorMessage = 'Error al registrar el usuario.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // El backend no devolvió JSON
        }
        throw new Error(errorMessage);
      }

      setMessage('Usuario registrado correctamente.');
      setMessageType('success');
      setFormData(INITIAL_FORM_DATA);
      setConfirmPassword('');

      // Redirigir después de un tiempo
      setTimeout(() => {
        router.push('/login');
      }, 1200);
    } catch (error) {
      console.error('Error al registrar usuario:', error);

      if (error instanceof TypeError) {
        setMessage(
          'No fue posible conectar con el backend. Verifica que el servidor esté ejecutándose.',
        );
      } else if (error instanceof Error) {
        setMessage(error.message || 'No se pudo registrar el usuario.');
      } else {
        setMessage('No se pudo registrar el usuario.');
      }
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-background grid place-items-center p-6 lg:p-8">
      <div className="border-border/20 bg-card/50 w-full max-w-122.5 rounded-3xl border p-7 shadow-xl backdrop-blur-sm lg:p-[30px_34px]">
        {/* Mobile Brand */}
        <div className="mb-7 flex items-center gap-3 lg:hidden">
          <span className="border-primary/40 from-primary to-primary/70 text-primary-foreground grid h-10 w-10 place-items-center rounded-xl border bg-linear-to-br">
            <GraduationCap size={24} />
          </span>
          <strong className="text-foreground text-lg">StudySync</strong>
        </div>

        {/* Header del formulario */}
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

        {/* Formulario */}
        <form className="grid gap-3.5" onSubmit={handleSubmit}>
          <InputField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Escribe tu nombre"
            autoComplete="given-name"
            icon={<User size={18} />}
          />

          <InputField
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Escribe tu apellido"
            autoComplete="family-name"
            icon={<User size={18} />}
          />

          <InputField
            label="Correo electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="nombre@correo.com"
            autoComplete="email"
            icon={<Mail size={18} />}
          />

          <InputField
            label="Contraseña"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            placeholder="Crea una contraseña"
            autoComplete="new-password"
            icon={<LockKeyhole size={18} />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
                className="text-muted-foreground hover:text-primary grid cursor-pointer place-items-center border-0 bg-transparent p-1 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <InputField
            label="Confirmar contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirma tu contraseña"
            autoComplete="new-password"
            icon={<LockKeyhole size={18} />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                aria-label={
                  showConfirmPassword
                    ? 'Ocultar contraseña'
                    : 'Mostrar contraseña'
                }
                className="text-muted-foreground hover:text-primary grid cursor-pointer place-items-center border-0 bg-transparent p-1 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          {/* Términos y condiciones */}
          <label className="text-muted-foreground inline-flex cursor-pointer items-start gap-2 text-xs leading-relaxed">
            <input type="checkbox" required className="accent-primary mt-0.5" />
            <span>Acepto los términos y la política de privacidad.</span>
          </label>

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

          {/* Botón de submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="border-primary/40 from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 inline-flex min-h-12.5 items-center justify-center gap-2.5 rounded-xl border bg-linear-to-br font-bold shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
          >
            <span>{isSubmitting ? 'Registrando...' : 'Crear cuenta'}</span>
            {!isSubmitting && <ArrowRight size={19} />}
          </button>
        </form>

        {/* Enlace a login */}
        <p className="text-muted-foreground mt-5 text-center text-sm">
          ¿Ya tienes una cuenta?
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 ml-1.5 font-semibold no-underline transition-colors"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </section>
  );
}
