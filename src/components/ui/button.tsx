import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button
      className={cn(
        "bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
