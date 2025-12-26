import {Routes, Route} from 'react-router-dom'
import NavBar from './NavBar.jsx'
import Home from './Home.jsx'
import About from './About.jsx'
import Resume from './Resume.jsx'
import Portfolio from './Portfolio.jsx'
import Contact from './Contact.jsx'
import Projects from './projects.jsx'
import './index.css'

function App() {
  return(
    <>
      <NavBar/>
      <Routes>
        <Route path="/" element={
        <>
          <Home/>
          <hr className='divider'/>
          <About/>
          <hr className='divider'/>
          <Resume/>
          <hr className='divider'/>
          <Portfolio/>
          <hr className='divider'/>
          <Contact/>
        </>
        } />
        <Route path="/projects" element={<Projects/>} />
      </Routes>
    </>
  );
}

export default App