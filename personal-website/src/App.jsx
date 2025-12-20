import NavBar from './NavBar.jsx'
import Home from './Home.jsx'
import About from './About.jsx'
import Resume from './Resume.jsx'
import Portfolio from './Portfolio.jsx'
import Contact from './Contact.jsx'
import './index.css'

function App() {
  return(
    <div>
      <NavBar/>
      <Home/>
      <About/>
      <Resume/>
      <Portfolio/>
      <Contact/>
    </div>
  );
}

export default App