import placeholder from './assets/placeholder.jpg';

function Portfolio() {
    return (
        <section id = "portfolio" className = "page-section">
            <h1 className="title">Portfolio</h1>
            <div className="portfolio-grid">
                <div className="portfolio-left">
                    <h2>Current Projects</h2>
                    <p className="subtitle">projects im currently working on</p>
                    <img src={placeholder} alt="Placeholder" className="portfolio-featured"/>
                </div>
                <div className="portfolio-right">
                    <div className="portfolio-top">
                        <h2>Programming Related Projects</h2>
                        <p className="subtitle">any sort of projects related to programming</p>
                        <Link to="/projects">
                            <img src={placeholder} alt="Placeholder" className="portfolio-image"/>
                        </Link>
                    </div>
                    <div className="portfolio-bottom">
                        <h2>Arts & Crafts</h2>
                        <p className="subtitle">other projects not-related to programming</p>
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