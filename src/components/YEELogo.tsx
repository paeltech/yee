import { Users } from "lucide-react";

interface YEELogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function YEELogo({ className = "", size = "md", showText = true }: YEELogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const iconSizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0`}>
        {/* TODO: Replace with actual YEE logo image */}
        {/* <img src="/yee-logo.png" alt="YEE Logo" className="w-full h-full object-contain" /> */}
        <Users className={`${iconSizeClasses[size]} text-white`} />
      </div>
      {showText && (
        <div>
          <h1 className={`${size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-lg"} font-bold text-neutral-900`}>
            YEE Portal
          </h1>
          {size !== "sm" && (
            <p className="text-sm text-neutral-600">Youth Economic Empowerment Portal</p>
          )}
        </div>
      )}
    </div>
  );
}

