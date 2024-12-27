import { useRef, useEffect, useState } from 'react';

export const useParallax = (speed = 0.5) => {
  const ref = useRef(null);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const scrollY = window.scrollY;
        const elementTop = ref.current.offsetTop;
        const elementHeight = ref.current.offsetHeight;
        const viewportHeight = window.innerHeight;

        if (scrollY + viewportHeight > elementTop && scrollY < elementTop + elementHeight) {
          const relativeY = (scrollY + viewportHeight - elementTop) * speed;
          setParallaxY(relativeY);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return [ref, parallaxY];
};

