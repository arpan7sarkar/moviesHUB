import React, { forwardRef, useId } from 'react';

const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}, ref) => {
  const internalId = useId();
  const inputId = id || internalId;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full bg-elevated border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-danger focus:border-danger' : 'border-border focus:border-accent'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-danger mt-0.5">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
