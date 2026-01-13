import { useEffect, useState } from 'react';

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
   
    return savedMode === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('darkMode', isDark.toString());
  }, [isDark]);

  return [isDark, setIsDark];
};

export default useDarkMode;