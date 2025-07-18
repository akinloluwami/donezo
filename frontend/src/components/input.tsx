import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`rounded-full border border-gray-300 px-5 h-14 bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent transition-all w-full ${className}`}
      {...props}
    />
  )
);

Input.displayName = "Input";
