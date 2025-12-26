function Portfolio() {
    return (
        <section id = "portfolio" className = "page-section">
            <h1 className="title">Portfolio</h1>
            <div className="portfolio-grid">
                <div className="portfolio-left">
                    <h2>Current Projects</h2>
                    <p>my featured</p>
                </div>
                <div className="portfolio-right">
                    <div className="portfolio-top">
                        <h2>Programming Related Projects</h2>
                        <p>my past work</p>
                    </div>
                    <div className="portfolio-bottom">
                        <h2>Arts & Crafts</h2>
                        <p>my links</p>
                    </div> 
                </div>
            </div>
        </section>
    );
}

export default Portfolio