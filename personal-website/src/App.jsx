import { Route, Routes } from 'react-router-dom';
import About from './About/About.jsx';
import ArtsCrafts from './Portfolio/Arts&Crafts.jsx';
import Contact from './Contact/Contact.jsx';
import DarkMode from './DarkMode/DarkMode.jsx';
import Fading from './Fading/Fading.jsx';
import Footer from './Footer/Footer.jsx';
import Home from './Home/Home.jsx';
import './index.css';
import NavBar from './NavBar/NavBar.jsx';
import Portfolio from './Portfolio/Portfolio.jsx';
import Projects from './Portfolio/Projects.jsx';
import Resume from './Resume/Resume.jsx';

function App() {
  return (
    <div className="app-container">
      { /* NavBar stays on all pages */}
      <NavBar />
      <DarkMode/>
      <Routes>
        {/* main page */}
        <Route path="/" element={
          <>
              <Home />
            <Fading>
              <hr className='divider'/>
              <About />
            </Fading>
            
            <Fading>
              <hr className='divider'/>
              <Resume />
            </Fading>

            <Fading>
              <hr className='divider'/>
              <Portfolio />
            </Fading>

            <Fading>
              <hr className='divider'/>
              <Contact />
            </Fading>

            <Footer />
          </>
        }/>
        {/* separate pages */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/arts-crafts" element={<ArtsCrafts />} />
      </Routes>
    </div>
  );
};

export default App;