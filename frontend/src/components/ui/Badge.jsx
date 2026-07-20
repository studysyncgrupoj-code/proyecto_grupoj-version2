function Badge({
  children,
  variant = "blue",
  className = "",
  ...props
}) {
  const variantClass = {
    blue: "ss-badge-blue",
    success: "ss-badge-success",
    warning: "ss-badge-warning",
    danger: "ss-badge-danger",
  };

  const selectedVariant =
    variantClass[variant] || variantClass.blue;

  return (
    <span
      className={`ss-badge ${selectedVariant} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;