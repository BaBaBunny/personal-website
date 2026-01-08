import { useEffect, useState } from "react";
import Fading from './Fading';

function Home(){
    const wordList = ["BABABUNNY", "MASSIVE", "WELCOME"];
    const [currentWord, setCurrentWord] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prevWord) => {
                let newWord;
                do {
                    newWord = Math.floor(Math.random() * wordList.length); //random number (0,1) * wordList, then rounded to lowest whole number
                } while (newWord == prevWord); // checks if word is same as previous
                
                return newWord;
            })
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    return(
        <section id="home" className = "home-section">
            <Fading>
                <h1 key={currentWord} className="home-text">
                    {wordList[currentWord]}
                </h1>
            </Fading>
        </section>
    );
};

export default Home;