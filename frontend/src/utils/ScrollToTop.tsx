import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth', // স্মুথ স্ক্রোলিংয়ের জন্য ('auto' দিতে পারেন যদি ইনস্ট্যান্ট চান)
    });
  }, [pathname]);

  return null;
};