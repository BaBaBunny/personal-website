import NavBar from './NavBar.jsx'
import Home from './Home.jsx'
import About from './About.jsx'
import Resume from './Resume.jsx'
import Portfolio from './Portfolio.jsx'
import Contact from './Contact.jsx'
import Projects from './Projects.jsx'
import './index.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

function App() {
  return(
    <Router>
      <div>
        <NavBar/>
          <div>
            <Switch>
              <Route path="/">
                <Home/>
              </Route>
            </Switch>
          </div>
      </div>
    </Router>
  );
}

export default App

{/* <Home/>
<hr className='divider'/>
<About/>
<hr className='divider'/>
<Resume/>
<hr className='divider'/>
<Portfolio/>
<hr className='divider'/>
<Contact/> */}