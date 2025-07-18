import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={`bg-accent rounded-full text-white px-5 h-14 hover:bg-accent/90 transition-colors ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
