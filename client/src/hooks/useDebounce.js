import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value by a specified delay.
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 400ms)
 * @returns The debounced value
 */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
