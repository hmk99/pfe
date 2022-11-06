import {BrowserRouter as Router , Routes ,Route, Link, useLocation, useNavigate} from 'react-router-dom'
import Axios from 'axios'
import '../styles/Levels.css'
import '../styles/Admin.css'
import logo from '../images/logo.jpg'
import admin from '../images/admin.jpg'
import {useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, setAdmin, setTheme } from '../Reducer'
import DarkModeToggle from "react-dark-mode-toggle"

function NavAdmin() {
    const dispatch = useDispatch()
    const theme = useSelector((state) => state.user.theme)
    const navigate=useNavigate()
    const[open, setOpen]= useState(false)
    const logOut= ()=> {
        dispatch(setAdmin({admin: false}))
        navigate("/")
    }
    const menuRef= useRef(null)
    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClicks)
          return () => {
            document.removeEventListener("mousedown", handleOutsideClicks)
        }
    }, [open])
    const handleOutsideClicks =(event)=>{
        if(open && menuRef.current && !menuRef.current.contains(event.target) && event.target!== document.querySelector('#imgProfile')){
            setOpen(false)
        }
    }
    const toggleTheme= ()=> {
        if(theme=== "light"){
          dispatch(setTheme({theme: "dark"}))
        }else{
          dispatch(setTheme({theme: "light"}))
        }
    }
  return (
    <div>
        <nav style= {{zIndex: 2}}>
            <div className='userInfos'>
                <h1 style= {{fontSize: "100%"}}>
                    administrator
                </h1>
                <img id='imgProfile' src= {admin} alt="" onClick= {()=> {setOpen(!open)}} />
            </div>
            <img id="logo" src={logo} alt="" />
            <div ref= {menuRef} className="dropDown" style= {{visibility: open&& "visible", opacity: open&& 1, transform: open&& "scaleY(1)"}} >
                <li>
                    <Link id='dropLink' to="/admin">
                        قائمة المستخدمين
                    </Link>
                </li>
                <li>
                    <Link id= "dropLink" to="/adminCourse">
                        الدروس  
                    </Link>
                </li>
                <li>
                    <Link id="dropLink" to= "/adminStat">
                        الإحصائيات    
                    </Link>
                </li>
                <li>
                    <Link id="dropLink" to= "/adminNotes">
                        الملاحظات    
                    </Link>
                </li>
                <li>
                    <Link id="dropLink" to= "/adminData">
                        البيانات    
                    </Link>
                </li>
                <li onClick={logOut}><span>تسجيل الخروج</span></li>
                <li>
                    <DarkModeToggle onChange= {toggleTheme} checked= {theme=== "dark"} size= {60} speed= {2} />
                </li>
            </div>
        </nav>
    </div>
  )
}

export default NavAdmin