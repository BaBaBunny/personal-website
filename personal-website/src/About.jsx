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
        }, 20000);

        return () => clearInterval(interval); //cleanup on unmount
    }, [currentIndex, isShuffling]);

    const triggerShuffle = () => {
        if (isShuffling) return; //prevents double clicks/triggers
        setIsShuffling(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) %images.length);
            setIsShuffling(false);
        }, 400);
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
                        Greetings & Salutations!
                    </p>
                    <p>
                        I'm a 2nd-year Computing student at Queen's University.
                        This website is actually the very first project I've ever built (officially)!
                    </p>
                    <p>
                        <strong>I like making stuff. </strong>
                        Whether it's digital art, physical art, or video editing and content creation for my YouTube channel, I love the creative process.
                        I play the guitar and violin! And I'm also a huge film guy.
                        I love movies (and other forms of visual media).
                        Outside of my room, I enjoy skiing/snowboarding, playing tennis & badminton, or searching up new recipes to cook up in the kitchen.
                    </p>
                    <p>
                        <strong>Why this? </strong>
                        To act as a live portfolio to display my creations and experiences and-hopefully-help me get employed so I don't become homeless in 2 years.
                        And as a I learn and create more, I'm hoping that this site will grow into a library of wealth and knowledge.
                    </p>
                    <p>
                        (As of January 2nd, 2025)
                    </p>
                </div>
            </div>
        </section>
    );
}

export default About;