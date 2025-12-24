import profilePic from './assets/bababunny.png';

function About() {
    return (
        <section id="about" className="page-section">
            <h1 className="title">About Me</h1>
            <div className="about-content">
                <img src={profilePic} alt="Profile Picture" className="about-image"/>
                <div className="about-text">
                    <p>
                        Hello! I'm Bababunny, a passionate developer with a love for creating beautiful and functional web applications. With a background in computer science and a keen eye for design, I strive to build user-friendly experiences that make a difference.
                    </p>
                    <p>
                        When I'm not coding, you can find me exploring the outdoors, experimenting with new recipes in the kitchen, or indulging in my love for photography. I'm always eager to learn new technologies and take on exciting challenges.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default About