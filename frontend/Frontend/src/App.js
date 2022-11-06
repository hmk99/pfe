import './styles/App.css'
import Axios from 'axios'
import {useState,useEffect, useRef} from 'react';
import logo from './images/logo.jpg'
import {BrowserRouter as Router , Routes ,Route, Link, BrowserRouter, useNavigate, Navigate, Redirect,  useParams} from 'react-router-dom'
import Login from './pages/Login'
import Admin from './pages/Admin'
import AdminCourse from './pages/AdminCourse'
import AdminExo from './pages/AdminExo'
import AdminStat from './pages/AdminStat'
import AdminData from './pages/AdminData'
import AdminNotes from './pages/AdminNotes';
import Register from './pages/Register'
import Level1 from './pages/Levels/Level1'
import Level2 from './pages/Levels/Level2'
import Level3 from './pages/Levels/Level3'
import Level4 from './pages/Levels/Level4'
import Level5 from './pages/Levels/Level5'
import Level0 from './pages/Levels/Level0'
import Level6 from './pages/Levels/Level6'
import Level7 from './pages/Levels/Level7'
import Level8 from './pages/Levels/Level8'
import Level9 from './pages/Levels/Level9'
import Level10 from './pages/Levels/Level10'
import Pss from './pages/Levels/Pss'
import Pre from './pages/Levels/Pre'
import Imp from './pages/Levels/Imp'
import Pp from './pages/Levels/Pp'
import Level from './pages/Level'
import Levels from './pages/Levels'
import { Squash as Hamburger } from 'hamburger-react'
import axios from 'axios'
import Button from '@mui/material/Button'
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, setAdmin, setTheme } from './Reducer'
import ReactSwitch from "react-switch"
import Stat from './pages/Stat'
import Param from './pages/Param'
import DarkModeToggle from "react-dark-mode-toggle"
import LevelTtest from './pages/Levels/LevelTtest'
import Chat from './pages/Chat'
import Qutrub from './pages/Qutrub'
import { Animator, ScrollContainer, ScrollPage, batch, Fade, FadeIn, Move, MoveIn, MoveOut, Sticky, StickyIn, ZoomIn } from "react-scroll-motion"
import RingLoader from 'react-spinners/RingLoader'
import Footer from './component/Footer';
function App() {
  const user = useSelector((state) => state.user)
  return (
   
    <div id= {user.theme}>
      <Router>
        <Routes>
          <Route exact path="/"  element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          {
            (!(user.user) || !(user.admin))
            &&<Route exact path="/register" element={<Register />} />
          }
          <Route path="*" element={<Err />}/>
          {
            (user.admin)
            &&<>
              <Route exact path="/admin" element={<Admin />} />
              <Route exact path="/adminCourse" element={<AdminCourse />} />
              <Route exact path="/adminExo" element={<AdminExo />} />
              <Route exact path="/adminStat" element={<AdminStat />} />
              <Route exact path="/adminData" element={<AdminData />} />
              <Route exact path="/adminNotes" element={<AdminNotes />} />
            </>
          }
          {
            (user.user && user.id!== undefined)
              &&<>
                <Route exact path="/levels/:id/:level" element={<Levels />} />
                <Route exact path="/stat/:id/:level" element={<Stat />} />
                <Route exact path="/param/:id/:level" element={<Param />} />
                <Route exact path="/chat/:id/" element={<Chat />} />
                <Route exact path="/qutrub/:id/" element={<Qutrub />} />
                {
                  user.test&&
                  <> 
                    <Route exact path="/level/:id" element={<Level />} />
                    <Route exact path="/levelTest/:id" element={<LevelTtest />} />
                  </>
                }
              </>
          }
          {
            (user.user && user.id!== undefined)
            &&<>
              <Route exact path="/level100/:id/:level" element={<Pss />} />
              <Route exact path="/level101/:id/:level" element={<Pre />} />
              <Route exact path="/level102/:id/:level" element={<Imp />} />
              <Route exact path="/level103/:id/:level" element={<Pp />} />
            </>
          }
          {
          (user.user && user.id!== undefined && user.level>= 0)
              &&<>
                <Route exact path="/level0/:id/:level" element={<Level0 />} />
              </>
          }
          {
          (user.user && user.id!== undefined && user.level> 0)
              &&<>
                <Route exact path="/level1/:id/:level" element={<Level1 />} />
              </>
          }
          {
            (user.user && user.id!== undefined && user.level> 1)
              &&<Route exact path="/level2/:id/:level" element={<Level2 />} />
          }
          {
            (user.user && user.id!== undefined && user.level> 2)
              &&<Route exact path="/level3/:id/:level" element={<Level3 />} />
          }
          {
            (user.user && user.id!== undefined && user.level> 3)
              &&<Route exact path="/level4/:id/:level" element={<Level4 />} />
          }
          {
            (user.user && user.id!== undefined && user.level> 4)
              &&<Route exact path="/level5/:id/:level" element={<Level5 />} />
          }
          {
            (user.user && user.id!== undefined && user.level> 5)
            
              &&<Route exact path="/level6/:id/:level" element={<Level6 />} />
            
          }
          {
            (user.user && user.id!== undefined && user.level> 6)
              &&<Route exact path="/level7/:id/:level" element={<Level7 />} />
          }
          {
            (user.user && user.id!== undefined && user.level> 7)
              &&<Route exact path="/level8/:id/:level" element={<Level8 />} />
          }
          {
            (user.user && user.id!== undefined && user.level> 8)
              &&<Route exact path="/level9/:id/:level" element={<Level9 />} />
          }
        </Routes>
      </Router>
    </div>
    
  );
}

const Err= ()=> {
  return(
    <div className="Err" style= {{width: "100%", height: "100vh"}}>
      <center>
        <h1>
        ليس لديك حق الوصول إلى هذه الصفحة، أو رابط خاطئ يجب عليك تسجبل الدخول أولا، أو إنشاء حسابك، أو قم بإكمال المراحل السابقة، شكرا...
        </h1>
        <Link id="link" to="/login">
          <Button variant="contained">عودة</Button>
        </Link>
      </center>
    </div>
  )
}


const Home= ()=> {
  const navigate=useNavigate()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [load, setLoad]= useState(false)
  useEffect(()=> {
    if(user.user){
      if(user.id!== null){
        navigate(`/levels/${user.id}/${user.level}`)
      }else{
        navigate("/")
      }
    }
    else if(user.admin){
      navigate('/admin')
    }
  }, [])

  const[open, setOpen]= useState(false)
  const toggleTheme= ()=> {
    if(user.theme=== "light"){
      dispatch(setTheme({theme: "dark"}))
    }else{
      dispatch(setTheme({theme: "light"}))
    }
  }
  const menuRef= useRef(null)
  const btnRef= useRef(null)
  useEffect(() => {
      document.addEventListener("mousedown", handleOutsideClicks)
        return () => {
          document.removeEventListener("mousedown", handleOutsideClicks)
      }
  }, [open])
  const handleOutsideClicks =(event)=>{
    const ham= document.querySelector('.ham')
    const hamChild= document.querySelector('.hamburger-react')
    const hamGrand= document.querySelector('.hamburger-react div')
      if(open && menuRef.current && !menuRef.current.contains(event.target) && !btnRef.current.contains(event.target)){
        setOpen(false)
    }
  }

  return(
    <div className="Home">
      
      <nav 
      
      >
        <div ref= {btnRef} className="ham">
          <Hamburger toggled={open} onToggle={() => setOpen(!open)} />
        </div>
        <Link id="link" to="/login" >
          <h1>
            تسجيل الدخول
          </h1>
        </Link>
        <img id="logo" src={logo} alt="" />
      </nav>
      
      <div ref= {menuRef} className="ham_menu" style= {{width: open? "30%": 0, opacity: open? 1: 0}}>
        <DarkModeToggle className="darkBtn" onChange= {toggleTheme} checked= {user.theme=== "dark"} speed= {2} size= {80} />
        <button>
          <Link id='link' to="/login">
            ابدأ بالتعلم
          </Link>
        </button>
        <Link id="link" to="/login" >
          <h1>
            تسجيل الدخول
          </h1>
        </Link>
        <select name="langues" id="langues">
          <option value="Arabe">العربية</option>
          <option value="Francais">الفرنسية</option>
          <option value="Anglais">الانجليزية</option>
        </select>
      </div>
        <div className="Home_first">
            <div className="Home_first_container">
              <motion.h1 animate={{opacity: 1, x: 0, rotate: -7}} transition= {{delay: 2, duration: 0.5}} initial={{opacity: 0, x: -1000}}>
                تعلم التصريف العربي بسهولة
              </motion.h1>
              <motion.img animate={{width: "50%", rotate: -7}} transition= {{delay: 2.5, duration: 0.5}} initial={{width: 0}}  src="https://f.hubspotusercontent20.net/hubfs/6968579/Memrise%20July%202020/Images/blue-flash.svg" alt=""/>
              <br />
              <br />
              <center>
                <motion.p animate={{scale: 2}} transition= {{delay: 3, duration: 0.5}} initial={{scale: 0}}>
                  أمثلة و تمارين بسيطة من أجل التعلم بسرعة و بمتعة
                </motion.p>
              </center>
            </div>
            <motion.button animate={{opacity: 1, y: 0}} transition= {{delay: 3.5, duration: 0.5}} initial={{opacity: 0, y: 1000}}>
              <Link id='link' to="/register">
                إنشاء حساب   
              </Link>
            </motion.button>
        </div>

      <div className="Home_second">
        <br />
          <center>
          <h1 style= {{marginTop: "10vh"}}>
            لماذا تطبيقنا ؟
          </h1>
          <img src="https://f.hubspotusercontent20.net/hubfs/6968579/underline.png" alt="" />
          </center>
          <br />
          <br />
          <div className="Home_second_container">
            <div className="Home_second_container_elem">
              <img src="https://www.memrise.com/hubfs/Imported%20images/60dd4cd5525d358246ddf719_Vector%20(1).svg" alt="" />
              <p>تقنيات الذاكرة القائمة على البحث العلمي</p>
              <p>تعلم أكثر وأسرع مع خوارزمية التعلم المطورة باستخدام أفضل تقنيات العلوم المعرفية.</p>
            </div>
            <div className="Home_second_container_elem">
              <img src="https://www.memrise.com/hubfs/Iconography/Method_TwoTimes.svg" alt="" />
              <p>ضعف سرعة التعلم في الفصل الدراسي</p>
              <p>اعمل على ذاكرتك طويلة المدى بطريقة أفضل وأسرع من التعلم عن ظهر قلب.</p>
            </div>
            <div className="Home_second_container_elem">
              <img src="https://www.memrise.com/hubfs/Iconography/Method_Immerse.svg" alt="" />
              <p>التعلم الشيق</p>
              <p>بالإضافة إلى التعليم التفاعلي، قم بتتبع تقدمك عن طريق رؤية نتائجك</p>
            </div>
            <div className="Home_second_container_elem">
              <img src="https://www.memrise.com/hubfs/Iconography/Method_Goals.svg" alt="" />
              <p>التعلم المكثف</p>
              <p>قم بتسجيل الأفعال المرادة، بغرض مراجعتها لاحقا</p>
            </div>
          </div>
        
      </div>
      <br />
      <Footer />
    </div>
  )
}

export default App;
