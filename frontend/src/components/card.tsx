import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-3xl border border-gray-200 bg-white/80 shadow-md shadow-gray-100 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = "Card";
