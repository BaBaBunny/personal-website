import { Routes, Route } from 'react-router-dom'; // Removed 'Router' and 'Switch'
import NavBar from './NavBar.jsx';
import Home from './Home.jsx';
import About from './About.jsx';
import Resume from './Resume.jsx';
import Portfolio from './Portfolio.jsx';
import Contact from './Contact.jsx';
import Projects from './Projects.jsx';
import './index.css';

function App() {
  return (
    <div className="app-container">
      {/* NavBar stays on all pages */}
      <NavBar />
      <Routes>
        {/* main page */}
        <Route path="/" element={
          <>
            <Home />
            <hr className='divider'/>
            <About />
            <hr className='divider'/>
            <Resume />
            <hr className='divider'/>
            <Portfolio />
            <hr className='divider'/>
            <Contact />
          </>
        } />
        {/* separate pages */}
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </div>
  );
}

export default App;