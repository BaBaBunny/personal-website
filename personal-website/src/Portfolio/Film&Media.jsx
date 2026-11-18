import { HashLink as Link } from 'react-router-hash-link';

function FilmMedia() {
    return (
        <>
            <Link to="/#portfolio" className="back-button">
                <i className="fa solid fa-xmark"></i>
            </Link>
            <section className="page-section">
                
                <h1 className="title">Film & Media</h1>
                <p>Here is where you'll find of my film & media related works.</p>
            </section>
        </>
    );    
};

export default FilmMedia;