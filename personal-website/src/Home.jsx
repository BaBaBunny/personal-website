import React, {useState, useEffect} from "react";

function Home(){
    const words = ["BABABUNNY", "MASSIVE", "WELCOME"];
    const [currentWord, setCurrentWord] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prevWord) => (prevWord + 1) % words.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return(
        <section id="home" className = "home-section">
            <h1 key={currentWord} className="home-text">
                {words[currentWord]}
            </h1>
        </section>
    );
}

export default Home