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

// Componente para las tarjetas de beneficios
const BenefitCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <article className="border-border/50 bg-card/50 hover:border-primary/40 hover:bg-card flex items-center gap-3.5 rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
    <div className="border-primary/30 bg-primary/10 text-primary grid h-10.5 w-10.5 shrink-0 place-items-center rounded-xl border">
      {icon}
    </div>
    <span className="block">
      <strong className="text-foreground block text-sm">{title}</strong>
      <small className="text-muted-foreground mt-1 block text-xs leading-relaxed">
        {description}
      </small>
    </span>
  </article>
);

export default function RegisterPage() {
  const router = useRouter();

  // Extraer iconos del mapeador con nombres correctos
  const {
    eye: Eye,
    eyeOff: EyeOff,
    lock: LockKeyhole,
    mail: Mail,
    user: User,
    users: Users,
    shield: ShieldCheck,
    sparkles: Sparkles,
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

  // Opciones para el select de roles
  const roleOptions = [
    { value: 'ESTUDIANTE', label: 'Estudiante' },
    { value: 'PROFESOR', label: 'Profesor' },
    { value: 'ADMINISTRADOR', label: 'Administrador' },
  ];

  return (
    <div className="bg-background text-foreground grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
      {/* Sección de showcase - izquierda */}
      <section className="border-border/20 from-background/80 via-background to-background relative flex min-h-screen flex-col overflow-hidden border-r bg-gradient-to-br p-8 lg:p-[34px_46px]">
        {/* Decoración de fondo - usando variables CSS */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.035)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_82%)] bg-[length:42px_42px]" />

        {/* Glows decorativos - usando variables CSS */}
        <div className="bg-primary/10 pointer-events-none absolute -top-[180px] -right-[120px] h-[410px] w-[410px] rounded-full blur-[100px]" />
        <div className="bg-primary/5 pointer-events-none absolute -bottom-[150px] -left-[180px] h-[360px] w-[360px] rounded-full blur-[100px]" />

        {/* Logo */}
        <Link
          href="/"
          className="relative z-10 flex w-fit items-center gap-3 transition-opacity hover:opacity-80"
        >
          <span className="border-primary/40 from-primary to-primary/70 text-primary-foreground grid h-12 w-12 place-items-center rounded-2xl border bg-gradient-to-br shadow-lg">
            <GraduationCap size={26} strokeWidth={2.2} />
          </span>
          <span className="grid gap-0.5">
            <strong className="text-foreground text-lg tracking-[-0.03em]">
              StudySync
            </strong>
            <small className="text-muted-foreground text-xs">
              Study Together
            </small>
          </span>
        </Link>

        {/* Contenido principal */}
        <div className="relative z-10 my-auto w-full max-w-[650px] py-12">
          <span className="border-primary/25 bg-primary/10 text-primary inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tracking-[0.08em] uppercase">
            <Sparkles size={15} />
            Empieza hoy
          </span>

          <h1 className="text-foreground mt-6 mb-4 max-w-[650px] text-5xl leading-[0.98] font-extrabold tracking-[-0.065em] lg:text-[clamp(3rem,6vw,5.1rem)]">
            Crea tu espacio.
            <span className="text-primary [text-shadow:0_0_38px_rgba(14,165,233,0.24)]">
              {' '}
              Aprende sin límites.
            </span>
          </h1>

          <p className="text-muted-foreground m-0 max-w-[590px] text-lg leading-relaxed">
            Únete a StudySync y organiza tus cursos, salas de estudio,
            actividades y progreso desde una sola plataforma.
          </p>

          <div className="mt-8 grid max-w-[610px] grid-cols-1 gap-3.5 sm:grid-cols-2">
            <BenefitCard
              icon={<Users size={21} />}
              title="Comunidad activa"
              description="Conecta con estudiantes y profesores."
            />
            <BenefitCard
              icon={<ShieldCheck size={21} />}
              title="Cuenta protegida"
              description="Tus datos y avances permanecen seguros."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-muted-foreground/60 relative z-10 flex justify-between gap-5 text-xs">
          <span>© 2026 StudySync</span>
          <span>Aprende. Colabora. Crece.</span>
        </div>
      </section>

      {/* Sección del formulario - derecha */}
      <section className="bg-background grid min-h-screen place-items-center p-6 lg:p-8">
        <div className="border-border/20 bg-card/50 w-full max-w-[490px] rounded-3xl border p-7 shadow-xl backdrop-blur-sm lg:p-[30px_34px]">
          {/* Mobile Brand */}
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <span className="border-primary/40 from-primary to-primary/70 text-primary-foreground grid h-10 w-10 place-items-center rounded-xl border bg-gradient-to-br">
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
              label="Tipo de cuenta"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              placeholder=""
              isSelect
              options={roleOptions}
              icon={<Users size={18} />}
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
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              }
            />

            {/* Términos y condiciones */}
            <label className="text-muted-foreground inline-flex cursor-pointer items-start gap-2 text-xs leading-relaxed">
              <input
                type="checkbox"
                required
                className="accent-primary mt-0.5"
              />
              <span>Acepto los términos y la política de privacidad.</span>
            </label>

            {/* Mensaje de estado - usando variables CSS */}
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
              className="border-primary/40 from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-xl border bg-gradient-to-br font-bold shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
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
    </div>
  );
}