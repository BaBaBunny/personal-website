import placeholder from '../assets/placeholder.jpg';
import { Link } from 'react-router-dom';
import './Portfolio.css';

function Portfolio() {
    return (
        <section id = "portfolio" className = "page-section">
            <h1 className="title">Portfolio</h1>
            <div className="portfolio-grid">
                <div className="portfolio-left">
                    <div className="portfolio-top">
                        <h2>CS Projects</h2>
                        <p className="subtitle">any sort of projects related to programming</p>
                        <Link to="/cs-projects">
                            <img src={placeholder} alt="Placeholder" className="portfolio-image"/>
                        </Link>
                    </div>
                    <div className="portfolio-bottom">
                        <h2>Blender Projects</h2>
                        <p className="subtitle">3D modeling & animation related</p>
                        <Link to="/blender">
                            <img src={placeholder} alt="Placeholder" className="portfolio-image"/>
                        </Link>
                    </div>
                </div>
                <div className="portfolio-right">
                    <div className="portfolio-top">
                        <h2>Content Creation</h2>
                        <p className="subtitle">youtube, filmmaking & video editing related</p>
                        <Link to="/content-creation">
                            <img src={placeholder} alt="Placeholder" className="portfolio-image"/>
                        </Link>
                    </div>
                    <div className="portfolio-bottom">
                        <h2>Arts n' Crafts</h2>
                        <p className="subtitle">random side stuff I do</p>
                        <Link to="/arts-crafts">
                            <img src={placeholder} alt="Placeholder" className="portfolio-image"/>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Portfolio