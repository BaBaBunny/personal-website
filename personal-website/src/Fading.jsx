import { useEffect, useRef, useState } from 'react';

export default function Fading({children}) {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            });
        }, {threshold: 0.05});

        const {current} = domRef;
        if (current) observer.observe(current);

        return () => {
            if (current) observer.unobserve(current);
        };
    }, []);

    return (
        <div
            className={`fading ${isVisible ? 'visible' : ''}`}
            ref={domRef}
        >
            {children}
        </div>
    );
};