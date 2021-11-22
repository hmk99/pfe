import './styles/App.css'
import Axios from 'axios'
import {useState,useEffect} from 'react';
import logo from './images/logo.jpg'
import {BrowserRouter as Router , Routes ,Route, Link} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close';
import { Squash as Hamburger } from 'hamburger-react'
import axios from 'axios';

function App() {
  return (
    <Router>
      <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

const Home= ()=> {
  const[open, setOpen]= useState(false)
  const ham_menu= ()=> {
    const menu= document.querySelector('.ham_menu')
    if(!open){
      menu.style.width= 30+ "%"
      menu.style.opacity= 1
      setOpen(true)
    }else{
      menu.style.width= 0+ "%"
      menu.style.opacity= 0
      setOpen(false)
    }
  }

  const display= ()=> {
    Axios.get("http://localhost:3030/conj")
    .then(res=> {
      console.log(res.data)
    })
  }
  display()

  return(
    <div className="Home">
      <nav>
        <img id="logo" src={logo} alt="" />
        <Link id="link" to="/login" >
        <h1>
          Se connecter
        </h1>
        </Link>
        <div className="ham" onClick={ham_menu}>
          <Hamburger />
        </div>
      </nav>
      <div className="ham_menu">
        <button>
          Commencez à apprendre
        </button>
        <Link id="link" to="/login" >
          <h1>
            Se connecter
          </h1>
        </Link>
        <select name="langues" id="langues">
          <option value="Arabe">Arabe</option>
          <option value="Francais">Francais</option>
          <option value="Anglais">Anglais</option>
        </select>
      </div>
      <div className="Home_first">
        <div className="">
          <h1>
            Apprends l'Arabe facilement
          </h1>
          <img src="https://f.hubspotusercontent20.net/hubfs/6968579/Memrise%20July%202020/Images/blue-flash.svg" alt=""/>
          <br />
          <br />
          <p>
            Des phrases utiles dans la vie de tous les jours. Enseignées via des clips vidéo avec des habitant.e.s du coin
          </p>
        </div>
        <button>Lancez-vous</button>
      </div>

      <div className="Home_second">
        <h1>
          Pourquoi Memrise ?
        </h1>
        <img src="https://f.hubspotusercontent20.net/hubfs/6968579/underline.png" alt="" />
        <br />
        <br />
        <div className="">
          <div className="">
            <img src="https://www.memrise.com/hubfs/Imported%20images/60dd4cd5525d358246ddf719_Vector%20(1).svg" alt="" />
            <p>Des techniques mémorielles basées sur des recherches scientifiques</p>
            <p>Apprends plus et plus vite grâce à un algorithme d’apprentissage développé d’après les meilleures techniques de science cognitive.</p>
          </div>
          <div className="">
            <img src="https://www.memrise.com/hubfs/Iconography/Method_TwoTimes.svg" alt="" />
            <p>Deux fois plus rapide que d’apprendre dans une salle de classe</p>
            <p>Fais travailler ta mémoire à long terme grâce à une méthode qui est meilleure et plus rapide que l’apprentissage par cœur traditionnel.</p>
          </div>
          <div className="">
            <img src="https://www.memrise.com/hubfs/Iconography/Method_Immerse.svg" alt="" />
            <p>Apprentissage immersif. Apprends comme si tu habitais sur place.</p>
            <p>Ne perds pas de temps avec des phrases que personne n’utilise. Apprends la langue dont les gens se servent vraiment.</p>
          </div>
          <div className="">
            <img src="https://www.memrise.com/hubfs/Iconography/Method_Goals.svg" alt="" />
            <p>Couvre tout, des essentiels à connaître en vacances à tes objectifs sur le long terme</p>
            <p>Trouve les sujets qui te conviennent : des discussions en vacances jusqu’à la rencontre avec la belle-famille.</p>
          </div>
        </div>
      </div>

      <div className="table_section">
        
      </div>
    </div>
  )
}

export default App;
