import { useCallback, useState } from 'react';

export const useAsync = (asyncFn, immediate = false) => {
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState('');

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError('');
    try {
      return await asyncFn(...args);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Something went wrong';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  return { execute, loading, error, setError };
};
