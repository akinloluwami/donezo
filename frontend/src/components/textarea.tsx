import React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      className={`rounded-3xl border border-gray-300 px-5 py-4 bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none ${className}`}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
