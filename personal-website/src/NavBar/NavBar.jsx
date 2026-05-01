import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HashLink } from "react-router-hash-link";
import './NavBar.css';
import SpotifyWidget from './Spotify/SpotifyWidget';

const NavBar = () => {
    const [hasScrolled, setHasScrolled] = useState(false);

    const location = useLocation();
    const isMainPage = location.pathname === "/";

    useEffect(() => {
        const islandTriggerY = isMainPage ? 75 : 0;

        const handleScroll = () => {
            if (window.scrollY > islandTriggerY) {
                setHasScrolled(true);
            }
            else {
                setHasScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [isMainPage]);

    const isIslandMode = !isMainPage || hasScrolled;
    const navbarClass = isIslandMode ? 'navbar scrolled' : 'navbar';

    return(
        <nav className={navbarClass}>
            <ul>
                <li><HashLink smooth to="/#home">Home</HashLink></li>
                <li><HashLink smooth to="/#about">About</HashLink></li>
                <li><HashLink smooth to="/#resume">Resume</HashLink></li>
                <li><HashLink smooth to="/#portfolio">Portfolio</HashLink></li>
                <li><HashLink smooth to="/#contact">Contact</HashLink></li>
            </ul>
            <div className="navbar-widget-container">
                <SpotifyWidget compact={isIslandMode} />
            </div>
        </nav>
    );
};

export default NavBar;