import React from 'react';

const variants = {
  primary: 'bg-accent text-primary hover:bg-accent-hover shadow-md active:scale-95',
  secondary: 'bg-surface text-text-primary hover:bg-elevated border border-border shadow-sm active:scale-95',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface/50 active:scale-95',
  danger: 'bg-danger/10 text-danger hover:bg-danger hover:text-white active:scale-95',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  loading = false,
  disabled,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
