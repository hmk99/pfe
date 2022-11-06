import '../styles/App.css'
import logo from '../images/logo.jpg'
import { Squash as Hamburger } from 'hamburger-react'
import {BrowserRouter as Router , Routes ,Route, Link, useNavigate, useParams} from 'react-router-dom'
import Axios from "axios"
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {GoogleLogin, GoogleLogout} from 'react-google-login'
import FacebookLogin from 'react-facebook-login'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, setAdmin } from '../Reducer'
import { useAlert } from 'react-alert'
import RingLoader from 'react-spinners/RingLoader'

function Login() {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate= useNavigate()
    const clientId= "242502706628-okdg9gqun4g12usjbu5squvsvohl867s.apps.googleusercontent.com"
    const faceId= "297279029101697"
    const[email, setEmail]= useState("")
    const[pwd, setPwd]= useState("")
    const[err, setErr]= useState('')
    const url= "http://localhost:3030"
    const alert = useAlert()
    const [load, setLoad]= useState(false)

    useEffect(()=> {
        if(user.user){
            navigate(`/levels/${user.id}/${user.level}`)
        }
    }, [])
    useEffect(()=> {
        if(user.admin){
            navigate('/admin')
        }
    }, [])
    const loginAdmin= (e)=> {
        e.preventDefault()
        Axios.post(`${url}/login`, {email: email, pwd: pwd})
        .then((res)=> {
            if(res.data.length> 0){
                if(res.data[0].googleId== "admin"){
                    setLoad(true)
                    dispatch(setAdmin({admin: true}))
                    setTimeout(() => {
                        setLoad(false)
                        alert.success("مرحبا بكم")
                        navigate("/admin")
                    }, 5000)
                }else{
                    setLoad(true)
                    dispatch(setUser({user: true, id: res.data[0].googleId, level: res.data[0].level}))
                    setTimeout(() => {
                        setLoad(false)
                        alert.success(`مرحبا بك ${res.data[0].name}`)
                        navigate(`/levels/${res.data[0].googleId}/${res.data[0].level}`)
                    }, 3000)
                }
            }else{
                alert.error("مستخدم خاطئ، حاول مجددا")
            }
        })
        .catch(err=> {
            alert.error("هناك مشكلة، حاول مجددا")
        })
    }
    const loginGF= (googleId)=> {
        Axios.post(`${url}/loginGF`, {googleId: googleId})
        .then((res)=> {
            if(res.data.length> 0){
                setLoad(true)
                dispatch(setUser({user: true, id: res.data[0].googleId, level: res.data[0].level}))
                setTimeout(() => {
                    setLoad(false)
                    alert.success(`مرحبا بك ${res.data[0].name}`)
                    navigate(`/levels/${res.data[0].googleId}/${res.data[0].level}`)
                }, 1000)
            }else{
                alert.error("مستخدم خاطئ، حاول مجددا")
            }
        })
        .catch(err=> {
            alert.error("هناك مشكلة، حاول مجددا")
        })
    }

    const onLoginGoogle= (res)=> {
        loginGF(res.profileObj.googleId)
    }
    const onLoginFace= (res)=> {
        loginGF(res.id)
    }
    return (
        <div className="Login">
            {load ?
            (
            <center>
                <div style= {{width: "100%", height: "15vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"}}>
                    <RingLoader
                        loading= {load}
                        color= {"blue"}
                        size= {50}
                    />
                    <p>انتظروا قليلا، رجاء...</p>
                </div>
            </center>
            ):
            (<>
            <nav>
                <img id="logo" src={logo} alt="" />
                <Link to="/" >
                    <ArrowBackIcon id="Login_return" style={{color: "white"}}/>
                </Link>
            </nav>
            <div className="Login_form">
                <center>
                    <h1>
                        قم بتسجيل الدخول للحصول على المتعة والتعلم بشكل أسرع
                    </h1>
                </center>
                <GoogleLogin
                    className='loginGBtn'
                    clientId={clientId}
                    buttonText="سجل الدخول عن طريق Google"
                    onSuccess={onLoginGoogle}
                    onFailure={null}
                    cookiePolicy={'single_host_origin'}
                />
                <FacebookLogin
                    className='loginGBtn'
                    appId={faceId}
                    autoLoad={false}
                    fields="name,email,picture"
                    callback= {onLoginFace}
                    textButton='سجل الدخول عن طريق Facebook'
                />
                {/*
                    {showLogoutBtn ?
                    <GoogleLogout
                        clientId={clientId}
                        buttonText="Logout"
                        onLogoutSuccess={onLogoutSuccess}
                    >
                    </GoogleLogout>: null
                    }
                */}
                <form action="" onSubmit={loginAdmin} >
                    <TextField type="text" id="Login_form_input" helperText="قم بإدخال البريد الإلكتروني" label="البريد الإلكتروني" value={email} onChange={e=> {setEmail(e.target.value)}} />
                    <TextField type="password" id="Login_form_input" helperText="قم بإدخال كلمة السر" label="كلمة السر" value={pwd} onChange={e=> {setPwd(e.target.value)}}/>
                    <Button type='submit' variant="contained">تسجبل الدخول</Button>
                </form>
                <center>
                    <h3 style={{textDecoration: "underline"}}>
                        ليس لديك حساب؟<Link to="/register" style= {{color: "black"}}><span style= {{color: "red", cursor: "pointer"}}> قم بإنشاء حسابك الآن</span></Link>
                    </h3>
                </center>
            </div>
            </>)
            }
        </div>
    )
}

export default Login

