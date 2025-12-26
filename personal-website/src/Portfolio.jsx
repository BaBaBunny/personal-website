import placeholder from './assets/placeholder.jpg';

function Portfolio() {
    return (
        <section id = "portfolio" className = "page-section">
            <h1 className="title">Portfolio</h1>
            <div className="portfolio-grid">
                <div className="portfolio-left">
                    <img src={placeholder} alt="Placeholder" className="portfolio-featured"/>
                    <h2>Current Projects</h2>
                    <p className="subtitle">projects im currently working on</p>
                </div>
                <div className="portfolio-right">
                    <div className="portfolio-top">
                        <h2>Programming Related Projects</h2>
                        <p className="subtitle">any sort of projects related to programming</p>
                        <img src={placeholder} alt="Placeholder" className="portfolio-image"/>
                    </div>
                    <div className="portfolio-bottom">
                        <img src={placeholder} alt="Placeholder" className="portfolio-image"/>
                        <h2>Arts & Crafts</h2>
                        <p className="subtitle">other projects not-related to programming</p>
                    </div> 
                </div>
            </div>
        </section>
    );
}

export default Portfolio