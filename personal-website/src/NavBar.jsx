import { HashLink } from "react-router-hash-link";

function NavBar(){
    return(
        <div className = "navbar">
            <nav>
                <ul>
                    <li><HashLink smooth to="/home">Home</HashLink></li>
                    <li><HashLink smooth to="/about">About</HashLink></li>
                    <li><HashLink smooth to="/resume">Resume</HashLink></li>
                    <li><HashLink smooth to="/portfolio">Portfolio</HashLink></li>
                    <li><HashLink smooth to="/contact">Contact</HashLink></li>
                </ul>
            </nav>
        </div>
    );
}

export default NavBar