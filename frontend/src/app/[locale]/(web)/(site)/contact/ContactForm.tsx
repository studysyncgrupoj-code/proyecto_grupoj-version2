'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { Controller, useForm, type Control } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import esLabels from 'react-phone-number-input/locale/es.json';
import 'react-phone-number-input/style.css';

import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import {
  contactSchema,
  type ContactFormData,
  type ContactFormInput,
} from '@/lib/contactSchema';
import { AppIcon, type UiIconName } from '@/lib/iconMap';
import { cn } from '@/utilities/cn';

const MESSAGE_MAX_LENGTH = 2000;

const DEFAULT_VALUES: ContactFormInput = {
  name: '',
  email: '',
  contactNumber: '',
  subject: '',
  message: '',
};

type SubmitStatus = 'idle' | 'success' | 'error';
type FormControl = Control<ContactFormInput, unknown, ContactFormData>;

/* ====================================================
   Envío
   ==================================================== */

async function sendContactMessage(data: ContactFormData): Promise<void> {
  // TODO: implementar el route handler POST /api/contact. Debe volver a validar
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      'No pudimos enviar tu mensaje. Inténtalo de nuevo en unos minutos.',
    );
  }
}

/* ====================================================
   Estilos: replican el contenedor de InputField (variante default, size md)
   para que teléfono y mensaje se vean idénticos al resto de campos.
   ==================================================== */
// TODO: Refactorizar estilos de PhoneInput y Textarea para unificar con InputField

const LABEL_CLASSES = 'text-sm font-semibold text-foreground';

const FIELD_SHELL = cn(
  'flex min-h-11 items-center gap-3 rounded-xl border px-3.5 text-sm shadow-sm',
  'transition-all duration-200',
  'hover:-translate-y-0.5 focus-within:-translate-y-0.5 focus-within:shadow-md',
  'border-border bg-surface text-foreground-muted',
  'hover:border-primary-hover hover:bg-surface-hover',
  'focus-within:border-border-focus focus-within:bg-surface-active',
);

const FIELD_SHELL_ERROR = 'border-danger focus-within:border-danger';

const FIELD_SHELL_DISABLED =
  'cursor-not-allowed bg-disabled text-disabled-text hover:border-border hover:bg-disabled hover:shadow-none hover:translate-y-0 focus-within:translate-y-0 focus-within:shadow-none focus-within:border-border';

const PHONE_INNER_CLASSES = cn(
  '[&_.PhoneInputInput]:h-full [&_.PhoneInputInput]:min-w-0 [&_.PhoneInputInput]:flex-1',
  '[&_.PhoneInputInput]:border-0 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:text-foreground [&_.PhoneInputInput]:outline-0',
  '[&_.PhoneInputInput]:placeholder:text-foreground-subtle',
  '[&_.PhoneInputInput]:disabled:cursor-not-allowed [&_.PhoneInputInput]:disabled:text-disabled-text',
);

const TEXTAREA_CLASSES =
  'min-h-28 w-full min-w-0 resize-y border-0 bg-transparent py-2.5 text-foreground outline-0 placeholder:text-foreground-subtle disabled:cursor-not-allowed disabled:text-disabled-text';

/* ====================================================
   Piezas auxiliares
   ==================================================== */

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-danger text-xs leading-relaxed">
      {message}
    </p>
  );
}

function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-danger ml-0.5">
      *
    </span>
  );
}

function Spinner() {
  return (
    <svg
      className="size-4 animate-spin motion-reduce:animate-none"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

/**
 * InputField es controlado (value/onChange), no reenvía `ref` y no expone
 * onBlur, así que no funciona con `register()`. Este wrapper lo conecta con
 * RHF vía Controller. El onBlur del div funciona porque el blur burbujea en
 * React, lo que permite que `mode: 'onTouched'` siga operando.
 */
interface ContactTextFieldProps {
  control: FormControl;
  name: 'name' | 'email' | 'subject';
  label: string;
  icon: UiIconName;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  disabled?: boolean;
}

function ContactTextField({
  control,
  name,
  label,
  icon,
  placeholder,
  type = 'text',
  autoComplete,
  disabled,
}: ContactTextFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div onBlur={field.onBlur}>
          <InputField
            name={field.name}
            label={label}
            type={type}
            value={field.value}
            onChange={field.onChange}
            icon={<AppIcon category="ui" name={icon} />}
            placeholder={placeholder}
            autoComplete={autoComplete}
            error={fieldState.error?.message}
            disabled={disabled}
          />
        </div>
      )}
    />
  );
}

// Ref estable: al montar el panel de éxito el foco pasa a su título.
const focusOnMount = (node: HTMLHeadingElement | null) => node?.focus();

/* ====================================================
   Formulario
   ==================================================== */

export function ContactForm() {
  const shouldReduceMotion = useReducedMotion();
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ContactFormInput, unknown, ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  const messageLength = watch('message')?.length ?? 0;

  const motionProps = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : -8 },
    transition: { duration: shouldReduceMotion ? 0 : 0.25 },
  };

  const onSubmit = async (data: ContactFormData) => {
    setServerError(null);
    try {
      await sendContactMessage(data);
      reset(DEFAULT_VALUES);
      setStatus('success');
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error inesperado. Inténtalo de nuevo.',
      );
      setStatus('error');
    }
  };

  return (
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
            <AppIcon category="ui" name="checkCircle" className="size-8" />
          </span>
          <h2
            ref={focusOnMount}
            tabIndex={-1}
            className="text-foreground mt-5 font-serif text-2xl font-semibold focus:outline-none"
          >
            ¡Mensaje enviado!
          </h2>
          <p className="text-foreground-muted mt-2 max-w-sm text-sm">
            Gracias por escribirnos. Revisaremos tu mensaje y te responderemos
            al correo que nos indicaste.
          </p>
          <Button
            variant="social"
            className="mt-6"
            onClick={() => setStatus('idle')}
          >
            Enviar otro mensaje
          </Button>
        </motion.div>
      ) : (
        <motion.div key="form" {...motionProps}>
          <header className="mb-6">
            <h2 className="text-foreground font-serif text-2xl font-semibold">
              Envíanos un mensaje
            </h2>
            <p className="text-foreground-muted mt-1.5 text-sm">
              Completa el formulario y te responderemos lo antes posible.
            </p>
          </header>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-busy={isSubmitting}
          >
            {/* fieldset disabled deshabilita todos los campos mientras se envía */}
            <fieldset disabled={isSubmitting} className="min-w-0 space-y-5">
              <legend className="sr-only">Formulario de contacto</legend>

              <ContactTextField
                control={control}
                name="name"
                label="Nombre completo"
                icon="user"
                placeholder="Tu nombre"
                autoComplete="name"
                disabled={isSubmitting}
              />

              <ContactTextField
                control={control}
                name="email"
                label="Correo electrónico"
                type="email"
                icon="mail"
                placeholder="tucorreo@ejemplo.com"
                autoComplete="email"
                disabled={isSubmitting}
              />

              <div className="grid gap-1.5">
                <label htmlFor="contactNumber" className={LABEL_CLASSES}>
                  Teléfono de contacto{' '}
                  <span className="text-foreground-muted font-normal">
                    (opcional)
                  </span>
                </label>
                <Controller
                  name="contactNumber"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      id="contactNumber"
                      name={field.name}
                      labels={esLabels}
                      defaultCountry="CO"
                      placeholder="300 123 4567"
                      autoComplete="tel"
                      value={field.value || undefined}
                      onChange={(value) => field.onChange(value ?? '')}
                      onBlur={field.onBlur}
                      disabled={isSubmitting}
                      aria-invalid={!!errors.contactNumber}
                      aria-describedby={
                        errors.contactNumber ? 'contactNumber-error' : undefined
                      }
                      className={cn(
                        FIELD_SHELL,
                        PHONE_INNER_CLASSES,
                        errors.contactNumber && FIELD_SHELL_ERROR,
                        isSubmitting && FIELD_SHELL_DISABLED,
                      )}
                    />
                  )}
                />
                <FieldError
                  id="contactNumber-error"
                  message={errors.contactNumber?.message}
                />
              </div>

              <ContactTextField
                control={control}
                name="subject"
                label="Asunto"
                icon="tag"
                placeholder="¿Sobre qué quieres hablar?"
                disabled={isSubmitting}
              />

              <div className="grid gap-1.5">
                <label htmlFor="message" className={LABEL_CLASSES}>
                  Mensaje
                  <RequiredMark />
                </label>
                <div
                  className={cn(
                    FIELD_SHELL,
                    'items-start',
                    errors.message && FIELD_SHELL_ERROR,
                    isSubmitting && FIELD_SHELL_DISABLED,
                  )}
                >
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Cuéntanos en qué podemos ayudarte…"
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? 'message-error' : 'message-counter'
                    }
                    className={TEXTAREA_CLASSES}
                    {...register('message')}
                  />
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <FieldError
                      id="message-error"
                      message={errors.message?.message}
                    />
                  </div>
                  <span
                    id="message-counter"
                    className={cn(
                      'text-foreground-muted shrink-0 text-xs',
                      messageLength > MESSAGE_MAX_LENGTH && 'text-danger',
                    )}
                  >
                    {messageLength}/{MESSAGE_MAX_LENGTH}
                  </span>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {status === 'error' && serverError && (
                  <motion.p
                    key="server-error"
                    role="alert"
                    className="border-danger/30 bg-danger/10 text-danger flex items-start gap-2 rounded-xl border p-3 text-sm"
                    {...motionProps}
                  >
                    <AppIcon
                      category="ui"
                      name="alert"
                      className="mt-0.5 size-4 shrink-0"
                    />
                    {serverError}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={!isValid || isSubmitting}
                icon={isSubmitting ? undefined : 'send'}
                iconPosition="right"
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Enviando…
                  </>
                ) : (
                  'Enviar mensaje'
                )}
              </Button>
            </fieldset>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
