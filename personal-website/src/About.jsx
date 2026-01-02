import React, {useState, useEffect} from 'react';
import img1 from './assets/bababunny.png';
import img2 from './assets/lucas.png';


const About = () => {
    const images = [img1, img2]

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isShuffling, setIsShuffling] = useState(false);

    const nextIndex = (currentIndex + 1) % images.length;

    useEffect(() => {
        const interval = setInterval(() => {
            triggerShuffle();
        }, 5000);

        return () => clearInterval(interval); //cleanup on unmount
    }, [currentIndex, isShuffling]);

    const triggerShuffle = () => {
        if (isShuffling) return; //prevents double clicks/triggers
        setIsShuffling(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) %images.length);
            setIsShuffling(false);
        }, 600);
    }

    return (
        <section id="about" className="page-section">
            <h1 className="title">About Me</h1>
            <div className="about-content">
                <div className="card-stack" onClick={triggerShuffle}>
                    {/* Bottom card */}
                    <img
                        src={images[nextIndex]}
                        alt="next"
                        className={`card back-card ${isShuffling ? 'shuffling' : ''}`}
                    />
                    {/* Top card */}
                    <img
                        src={images[currentIndex]}
                        alt="current"
                        className={`card front-card ${isShuffling ? 'yielding' : ''}`}
                    />
                </div>

                <div className="about-text">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Nisl tincidunt eget nullam non.
                        Tincidunt arcu non sodales neque sodales ut etiam.
                        Lectus arcu bibendum at varius vel pharetra.
                        Morbi tristique senectus et netus et malesuada.

                    </p>
                    <p>
                        Universum et sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default About;