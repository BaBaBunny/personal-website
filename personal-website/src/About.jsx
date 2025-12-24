import profilePic from './assets/bababunny.png';

function About() {
    return (
        <section id="about" className="page-section">
            <h1 className="title">About Me</h1>
            <div className="about-content">
                <img src={profilePic} alt="Profile Picture" className="about-image"/>
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

export default About