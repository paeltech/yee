
interface YEELogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function YEELogo({ className = "", size = "md", showText = true }: YEELogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-16",
  };

  return (
    <div className={`flex items-center space-x-3 ml-2 ${className}`}>
      <img
        src="/mulika-logo.png"
        alt="YEE Portal Logo"
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
    </div>
  );
}


