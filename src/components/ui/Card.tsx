export function Card({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={`bg-surface/95 backdrop-blur-xl rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
