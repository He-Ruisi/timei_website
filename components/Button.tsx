import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "font-crayon transition-all active:translate-x-1 active:translate-y-1 active:shadow-none border-2 border-crayon-black rounded-lg flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-crayon-yellow hover:bg-yellow-200 text-crayon-black shadow-sketch",
    secondary: "bg-white hover:bg-gray-50 text-crayon-black shadow-sketch",
    danger: "bg-crayon-red hover:bg-red-400 text-white shadow-sketch",
    ghost: "bg-transparent border-none shadow-none hover:bg-gray-100/50"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-lg font-bold"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
