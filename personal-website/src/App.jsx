import { Route, Routes } from 'react-router-dom';
import About from './About.jsx';
import ArtsCrafts from './Arts&Crafts.jsx';
import Contact from './Contact.jsx';
import DarkMode from './DarkMode.jsx';
import Fading from './Fading.jsx';
import Footer from './Footer.jsx';
import Home from './Home.jsx';
import './index.css';
import NavBar from './NavBar.jsx';
import Portfolio from './Portfolio.jsx';
import Projects from './Projects.jsx';
import Resume from './Resume.jsx';

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

            <Fading>
              <Footer />
            </Fading>
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