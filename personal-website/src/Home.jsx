import { useEffect, useState } from "react";

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
                <div>
                    <h1 key={currentWord} className="home-text">
                        {wordList[currentWord]}
                    </h1>
                </div>
                <div className="webring">
                    <a href='https://queensu-webring.ca/#bababunny.vercel.app?nav=prev'>←</a>
                    <a href='https://queensu-webring.ca/#bababunny.vercel.app' target='_blank'>
                        <img
                            src='https://queensu-webring.ca/assets/icons/cs/icon-blue.png'
                            alt="Queen's Computing Webring"
                        />
                    </a>
                    <a href='https://queensu-webring.ca/#bababunny.vercel.app?nav=next'>→</a>
                </div>
        </section>
    );
};

export default Home;