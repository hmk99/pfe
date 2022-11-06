import {useState, useEffect, useRef} from 'react'
import {BrowserRouter as Router , Routes ,Route, Link, useParams, useNavigate} from 'react-router-dom'
import ReactSwitch from "react-switch"
import avatar from '../images/avatar.jpg'
import Axios from 'axios'
import {GoogleLogin, GoogleLogout} from 'react-google-login'
import Button from '@mui/material/Button'
import { useSelector, useDispatch } from 'react-redux'
import logo from '../images/logo.jpg'
import userImage from '../images/user.png'
import { setUser, setScore, setTheme } from '../Reducer'
import '../styles/Levels.css'
import DarkModeToggle from "react-dark-mode-toggle"
import RingLoader from 'react-spinners/RingLoader'
import io from 'socket.io-client'
const socket= io.connect("http://localhost:3030")

function Nav() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const navigate=useNavigate()
    const params= useParams()
    const levelUser= params.level
    const clientId= "242502706628-okdg9gqun4g12usjbu5squvsvohl867s.apps.googleusercontent.com"
    const[userData, setUserData]= useState({})
    const[userDataReady, setUserDataReady]= useState(false)
    const[load, setLoad]= useState(null)
    const[open, setOpen]= useState(false)
    const url= "http://localhost:3030"

    useEffect(()=> {
        if(!load){
            var e = document.querySelector('#imgProfile')
            if(! (e.complete && e.naturalHeight !== 0)){
                e.src= avatar
            }
        }
    }, [load])
    const getInfos= ()=> {
        Axios.post(`${url}/getInfos`, {id: user.id})
        .then((res)=> {
            setLoad(true)
            setUserData({userName: res.data[0].name, userImage: res.data[0].image})
            setTimeout(() => {
                setLoad(false)
            }, 1000)
        })
        .catch(err=> {
          console.log(err)
        })
    }
    const logOut= ()=> {
        dispatch(setUser({user: false, id: null, level: null}))
        dispatch(setScore({score: null}))
        socket.emit("deleteUser", user.id)
        navigate("/")
    }
    const toggleTheme= ()=> {
        if(user.theme=== "light"){
          dispatch(setTheme({theme: "dark"}))
        }else{
          dispatch(setTheme({theme: "light"}))
        }
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
    useEffect(()=> {
        getInfos()
    }, [])


  return (
    <div>
        <nav style= {{zIndex: 2}}>
            <div className='userInfos'>
            
            <h1 id='userName'>
                {userData.userName}
            </h1>
            <img id='imgProfile' src= {userData.userImage} alt= "" onClick= {()=> {setOpen(!open)}} />
            </div>
            <img id="logo" src={logo} alt="" />
        </nav>
        <div ref= {menuRef} className="dropDown" style= {{visibility: open&& "visible", opacity: open&& 1, transform: open&& "scaleY(1)"}}>
            <li><Link id= "dropLink" to= {`/levels/${user.id}/${user.level}`}>المراحل</Link></li>
            <li><Link id='dropLink' to= {`/stat/${user.id}/${user.level}`}>حسابي</Link></li>
            <li><Link id='dropLink' to= {`/chat/${user.id}`}>دردشة</Link></li>
            <li><Link id='dropLink' to= {`/qutrub/${user.id}`}>اسأل <span style= {{fontWeight: "bolder"}}>قطرب</span></Link></li>
            <li><Link id='dropLink' to= {`/param/${user.id}/${user.level}`}>الإعدادات</Link></li>
            <GoogleLogout
                className= "logOut"
                clientId={clientId}
                buttonText="تسجيل الخروج"
                onLogoutSuccess={logOut}
            />
            <li>
                <DarkModeToggle onChange= {toggleTheme} checked= {user.theme=== "dark"} size= {60} speed= {2} />
            </li>
        </div>
    </div>
  )
}

export default Nav