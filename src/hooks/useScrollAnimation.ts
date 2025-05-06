import { useState, useEffect, useRef } from 'react';
import throttle from 'lodash.throttle';

/**
 * Custom React hook that detects scroll events and provides scroll position data.
 *
 * @returns An object containing the current scroll Y offset (scrollY) and a boolean indicating whether the user is scrolling down (isScrollingDown).
 */
const useScrollAnimation = () => {
  const [scrollY, setScrollY] = useState<number>(0);
  const [isScrollingDown, setIsScrollingDown] = useState<boolean>(false);
  const previousScrollY = useRef<number>(0);

  useEffect(() => {
    const handleScroll = throttle(() => {
      try {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

        if (typeof currentScrollY !== 'number' || !Number.isFinite(currentScrollY)) {
          console.error('Invalid scroll position:', currentScrollY);
          return;
        }

        setIsScrollingDown(currentScrollY > previousScrollY.current);
        setScrollY(currentScrollY);
        previousScrollY.current = currentScrollY;
      } catch (error) {
        console.error('Error handling scroll event:', error);
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { scrollY: Number.isFinite(scrollY) ? scrollY : 0, isScrollingDown };
};

export default useScrollAnimation;