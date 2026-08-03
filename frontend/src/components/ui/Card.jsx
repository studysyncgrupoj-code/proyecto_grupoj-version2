function Card({
  children,
  hover = false,
  className = "",
  ...props
}) {
  return (
    <div
      className={`ss-card ${hover ? "ss-card-hover" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;