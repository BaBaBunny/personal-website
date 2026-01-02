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

                <p>
                    Greetings and Salutations hires or anyone else who has stumbled upon this magnificent place.
                </p>
                <p>
                    I'm currently 2nd year undergraduate student, studying Computer Science at Queen's (or as they call it: School of Computing).
                    This website that you're on right now is the first thing I've ever made (during the 2025 winter break).
                </p>
                <p>
                    I like making stuff. I consider myself a relatively creative & imaginative person.
                    I'm one of those people who has a passion for arts but I don't really make that much stuff on my own.
                    BUT-I am looking to change that, with this website being the first stepping stone.
                </p>
                <p>
                    I have made SOME things, both physical arts and crafts and virtual creations, like animations and modelling through Blender.
                    I also have a YouTube channel (I haven't uploaded in nearly 2 years *whoopsie*) where I enjoy making *mostly* gameplay videos, with some occasional creative outputs (i need to start vlogging lol).
                    So essentially I know how to video edit, generate ideas, do 3D model, draw, animate, oh and music.
                    I play the guitar and violin! I'm also a huge film guy. I love movies (and other forms of visual media).
                    I also ski and snowboard (once so far), play tennis, badminton, swim, exercise, scroll reels and TikTok, and ponder the thoughts of the universe, etc...The usual y'know?
                </p>
                <p>
                    Anyway the point of this website is to-well act as a portfolio and resume to for employers to see (and hopefully hire me so I don't become homeless in 2 years). But not only just that, but also a way for me to display things I've created-no matter what it is-on one platform. Which will be this site. So as time passes, this website will grow larger and larger, eventually (i hope) becoming large enough to be essentially an library of my life and its workings.
                </p>
                <p>
                    (as of January 2nd, 2025)
                </p>
            </div>
        </section>
    );
}

export default About;