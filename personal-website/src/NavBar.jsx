import { HashLink } from "react-router-hash-link";

function NavBar(){
    return(
        <div className = "navbar">
            <nav>
                <ul>
                    <li><Hashlink smooth to="/#home">Home</Hashlink></li>
                    <li><Hashlink smooth to="/#about">About</Hashlink></li>
                    <li><Hashlink smooth to="/#resume">Resume</Hashlink></li>
                    <li><Hashlink smooth to="/#portfolio">Portfolio</Hashlink></li>
                    <li><Hashlink smooth to="/#contact">Contact</Hashlink></li>
                </ul>
            </nav>
        </div>
    );
}

export default NavBar