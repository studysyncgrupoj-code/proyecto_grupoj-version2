import { cn } from '@/utilities/cn';
import { ChangeEvent, cloneElement, isValidElement, ReactNode } from 'react';

export interface InputFieldProps {
  label: string;
  name?: string;
  type?: string;
  value: string | number | boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  icon?: ReactNode;
  rightElement?: ReactNode;
  isSelect?: boolean;
  options?: Array<{ value: string; label: string }>;
  error?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  id?: string;
}

// Type helper para props de iconos
interface IconProps {
  size?: number;
  className?: string;
}

// Type helper para props de elementos derecho
interface RightElementProps {
  className?: string;
}

export const InputField = ({
  label,
  name,
  id,
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
  error,
  disabled = false,
  className = '',
  containerClassName = '',
  size = 'md',
  variant = 'default',
}: InputFieldProps) => {
  // Mapeo de tamaños consistente con el sistema de diseño
  const sizeClasses = {
    sm: 'min-h-9 text-xs px-2.5 gap-2',
    md: 'min-h-11 text-sm px-3.5 gap-3',
    lg: 'min-h-12 text-base px-4 gap-3.5',
  };

  // Mapeo de variantes
  const variantClasses = {
    default: cn(
      'border-border bg-background/50 text-muted-foreground',
      'hover:border-primary/50 hover:bg-background/80 hover:text-primary',
      'focus-within:border-primary/70 focus-within:bg-background/80 focus-within:text-primary',
    ),
    filled: cn(
      'border-transparent bg-background/80 text-muted-foreground',
      'hover:bg-background/90 hover:text-primary',
      'focus-within:bg-background focus-within:text-primary focus-within:border-primary/70',
    ),
    outlined: cn(
      'border-2 border-border bg-transparent text-muted-foreground',
      'hover:border-primary/50 hover:text-primary',
      'focus-within:border-primary focus-within:text-primary',
    ),
  };

  const iconSizeMap = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  const fieldId = id || name;

  const baseInputClasses = cn(
    'text-foreground',
    'placeholder:text-muted-foreground/60',
    'w-full min-w-0 border-0 bg-transparent outline-0',
    disabled && 'cursor-not-allowed opacity-50',
    className,
  );

  const baseContainerClasses = cn(
    'flex items-center rounded-xl border shadow-sm',
    'transition-all duration-200',
    'focus-within:-translate-y-0.5 focus-within:shadow-md',
    'hover:-translate-y-0.5',
    sizeClasses[size],
    variantClasses[variant],
    error &&
      'border-danger/50 focus-within:border-danger focus-within:shadow-danger/20',
    disabled &&
      'cursor-not-allowed opacity-50 hover:border-border hover:bg-background/50 hover:shadow-none hover:translate-y-0',
    containerClassName,
  );

  // ✅ Función segura para renderizar iconos - SIN ANY
  const renderIcon = (iconElement: ReactNode) => {
    if (!iconElement) return null;

    if (isValidElement<IconProps>(iconElement)) {
      const existingProps = iconElement.props;

      // Usamos un approach diferente: envolver en un span con el tamaño
      // en lugar de clonar el elemento
      const iconSize = iconSizeMap[size];

      return (
        <span className={cn('shrink-0', existingProps.className)}>
          {cloneElement(iconElement, {
            size: iconSize,
          } as Partial<IconProps>)}
        </span>
      );
    }

    return <span className="shrink-0">{iconElement}</span>;
  };

  // ✅ Función segura para renderizar elementos derecho - SIN ANY
  const renderRightElement = (element: ReactNode) => {
    if (!element) return null;

    if (isValidElement<RightElementProps>(element)) {
      const existingProps = element.props;

      // Si es un botón o componente personalizado, añadimos las clases
      const isCustomComponent =
        typeof element.type === 'function' ||
        (typeof element.type === 'object' && element.type !== null);

      if (isCustomComponent) {
        return cloneElement(element, {
          className: cn(
            'text-muted-foreground hover:text-primary',
            'grid cursor-pointer place-items-center',
            'border-0 bg-transparent p-1 transition-colors',
            existingProps.className,
          ),
        } as Partial<RightElementProps>);
      }
    }

    return <span className="shrink-0">{element}</span>;
  };

  // Estilos para opciones del select
  const selectOptionClasses = cn(
    'bg-background text-foreground',
    'hover:bg-primary/10',
    'focus:bg-primary/20',
  );

  const errorId = fieldId ? `${fieldId}-error` : undefined;

  return (
    <div className="grid gap-1.5">
      <label htmlFor={fieldId} className="grid gap-1.5">
        <span
          className={cn(
            'text-sm font-semibold',
            disabled ? 'text-muted-foreground/60' : 'text-foreground/90',
          )}
        >
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </span>
        <div className={baseContainerClasses}>
          {icon && renderIcon(icon)}

          {isSelect ? (
            <select
              id={fieldId}
              name={name}
              value={String(value)}
              onChange={onChange}
              className={baseInputClasses}
              required={required}
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={errorId}
            >
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className={selectOptionClasses}
                >
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={fieldId}
              type={type}
              name={name}
              value={String(value)}
              onChange={onChange}
              placeholder={placeholder}
              autoComplete={autoComplete}
              required={required}
              disabled={disabled}
              className={baseInputClasses}
              aria-invalid={!!error}
              aria-describedby={errorId}
            />
          )}

          {rightElement && renderRightElement(rightElement)}
        </div>
      </label>
      {error && errorId && (
        <p
          id={errorId}
          className={cn(
            'text-danger text-xs leading-relaxed',
            'animate-in fade-in duration-200',
          )}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
