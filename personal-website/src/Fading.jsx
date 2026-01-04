import React, { useState, useRef, useEffect } from 'react';

export default function Fading({children}) {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                //If it's on screen (isIntersecting), set visible to true
                //If it leaves screen, set visible to false (fade out)
                setIsVisible(entry.isIntersecting);
            });
        });

        const {current} = domRef;
        if (current) observer.observe(current);

        return () => {
            if (current) observer.unobserve(current);
        };
    }, []);

    return (
        <div
            className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}
            ref={domRef}
            // style={{ minHeight: '50px', width: '100%' }} /*to make sure observer can see*/
        >
            {children}
        </div>
    );
};