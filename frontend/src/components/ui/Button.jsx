function Button({
  children,
  variant = "primary",
  type = "button",
  className = "",
  disabled = false,
  onClick,
  ...props
}) {
  const variantClass = {
    primary: "ss-button-primary",
    secondary: "ss-button-secondary",
    ghost: "ss-button-ghost",
  };

  const selectedVariant =
    variantClass[variant] || variantClass.primary;

  return (
    <button
      type={type}
      className={`ss-button ${selectedVariant} ${className}`.trim()}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;