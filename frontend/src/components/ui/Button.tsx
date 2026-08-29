'use client';
import { IconMap, type SocialIconName, type UiIconName } from '@/lib/iconMap';
import { cn } from '@/utilities/cn';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { CustomLink, type CustomLinkProps } from './Link';

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonVariant =
  'primary' | 'secondary' | 'social' | 'ghost' | 'disabled';

interface WithTextContent {
  children: React.ReactNode;
  'aria-label'?: string;
}
interface OnlyIconContent {
  children?: never;
  'aria-label': string;
}
type ButtonContentProps = WithTextContent | OnlyIconContent;

interface BaseProps {
  variant: ButtonVariant;
  icon?: SocialIconName | UiIconName;
  iconPosition?: 'left' | 'right';
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

type ButtonAsLink = BaseProps &
  ButtonContentProps &
  Omit<CustomLinkProps, 'children' | 'className' | 'aria-label'> & {
    href: CustomLinkProps['href'];
    type?: never;
  };
type ButtonAsButton = BaseProps &
  ButtonContentProps &
  Omit<
    ComponentPropsWithoutRef<'button'>,
    'children' | 'className' | 'aria-label'
  > & {
    href?: never;
  };
export type ButtonProps = ButtonAsLink | ButtonAsButton;

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: cn(
    'border border-transparent bg-accent text-white shadow-lg shadow-accent/25',
    'hover:bg-accent/90 hover:shadow-accent/35',
    'active:bg-accent/80 active:shadow-accent/20',
    'focus-visible:ring-accent',
  ),
  secondary: cn(
    'border border-transparent bg-primary text-white shadow-lg shadow-primary/25',
    'hover:bg-primary/90 hover:shadow-primary/35',
    'active:bg-primary/80 active:shadow-primary/20',
    'focus-visible:ring-primary',
  ),
  social: cn(
    'border border-foreground/10 bg-foreground/5 text-foreground',
    'hover:border-foreground/20 hover:bg-foreground/10',
    'active:bg-foreground/15',
    'focus-visible:ring-primary',
  ),
  ghost: cn(
    'border border-transparent bg-transparent text-foreground/70',
    'hover:bg-foreground/5 hover:text-foreground',
    'active:bg-foreground/10',
    'focus-visible:ring-primary',
  ),
  disabled:
    'border-transparent bg-foreground/10 text-foreground/40 pointer-events-none shadow-none active:scale-100',
};

const BUTTON_SIZES: Record<ButtonSize, { default: string; iconOnly: string }> =
  {
    sm: {
      default: 'h-9 gap-1.5 rounded-xl px-4 text-xs',
      iconOnly: 'size-9 rounded-xl',
    },
    md: {
      default: 'h-11 gap-2 rounded-xl px-5 text-sm',
      iconOnly: 'size-11 rounded-xl',
    },
    lg: {
      default: 'h-12 gap-2.5 rounded-2xl px-7 text-base',
      iconOnly: 'size-12 rounded-2xl',
    },
  };

function resolveIcon(icon: SocialIconName | UiIconName): ReactNode {
  const IconComponent =
    IconMap.social[icon as SocialIconName] ?? IconMap.ui[icon as UiIconName];
  if (!IconComponent) return null;
  return <IconComponent className="size-4 shrink-0" aria-hidden="true" />;
}

function isLinkProps(props: ButtonProps): props is ButtonAsLink {
  return 'href' in props && props.href !== undefined;
}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const {
    variant,
    icon,
    iconPosition = 'left',
    size = 'md',
    fullWidth = false,
    className,
    children,
    'aria-label': ariaLabel,
  } = props;

  const isActuallyDisabled =
    variant === 'disabled' || ('disabled' in props && !!props.disabled);
  const resolvedVariant: ButtonVariant = isActuallyDisabled
    ? 'disabled'
    : variant;
  const isIconOnly = !children && !!icon;
  const sizeClasses = BUTTON_SIZES[size];

  const finalClasses = cn(
    'inline-flex items-center justify-center font-medium',
    'transition-all duration-200 select-none active:scale-95',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
    BUTTON_VARIANTS[resolvedVariant],
    isIconOnly ? sizeClasses.iconOnly : sizeClasses.default,
    fullWidth && 'w-full',
    // Usar variables CSS para estados
    'hover:shadow-md',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    className,
  );

  const iconEl = icon ? resolveIcon(icon) : null;
  const content = isIconOnly ? (
    iconEl
  ) : (
    <>
      {iconPosition === 'left' && iconEl}
      {children}
      {iconPosition === 'right' && iconEl}
    </>
  );

  //TODO: Validar alvertencia por variable que asigna pero no se usa nunca al ser desestructurado.
  if (isLinkProps(props)) {
    const {
      href,
      variant: _variant,
      icon: _icon,
      iconPosition: _iconPosition,
      size: _size,
      fullWidth: _fullWidth,
      className: _className,
      children: _children,
      'aria-label': _ariaLabel,
      ...linkRest
    } = props;

    return (
      <CustomLink
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={finalClasses}
        aria-label={ariaLabel}
        aria-disabled={isActuallyDisabled}
        tabIndex={isActuallyDisabled ? -1 : undefined}
        {...linkRest}
      >
        {content}
      </CustomLink>
    );
  }

  const {
    variant: _variant,
    icon: _icon,
    iconPosition: _iconPosition,
    size: _size,
    fullWidth: _fullWidth,
    className: _className,
    children: _children,
    'aria-label': _ariaLabel,
    disabled: _disabled,
    type = 'button',
    ...buttonRest
  } = props;

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={finalClasses}
      aria-label={ariaLabel}
      aria-disabled={isActuallyDisabled}
      disabled={isActuallyDisabled}
      {...buttonRest}
    >
      {content}
    </button>
  );
});
Button.displayName = 'Button';
