import { Routes, Route } from 'react-router-dom';
import NavBar from './NavBar.jsx';
import Home from './Home.jsx';
import About from './About.jsx';
import Resume from './Resume.jsx';
import Portfolio from './Portfolio.jsx';
import Contact from './Contact.jsx';
import Projects from './Projects.jsx';
import ArtsCrafts from './Arts&Crafts.jsx';
import Fading from './Fading.jsx';
import './index.css';

function App() {
  return (
    <div className="app-container">
      { /* NavBar stays on all pages */}
      <NavBar />
      <Routes>
        /* main page */
        <Route path="/" element={
          <>
            <Fading>
              <Home />
            </Fading>
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