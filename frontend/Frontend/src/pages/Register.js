import '../styles/App.css'
import logo from '../images/logo.jpg'
import avatar from '../images/avatar.jpg'
import { Squash as Hamburger } from 'hamburger-react'
import {BrowserRouter as Router , Routes ,Route, Link, useNavigate, useParams} from 'react-router-dom'
import Axios from "axios"
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {GoogleLogin, GoogleLogout} from 'react-google-login'
import { useState, useEffect } from 'react'
import FacebookLogin from 'react-facebook-login'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, setAdmin, setTest } from '../Reducer'
import { useAlert } from 'react-alert'
import Short from 'short-uuid'
import { useWait, Waiter } from "react-wait"
import RingLoader from 'react-spinners/RingLoader'
import EmailValidator from 'email-validator'
import passwordValidator from 'password-validator'

function Register() {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate=useNavigate()
    var schema = new passwordValidator()
    const faceId= "297279029101697"
    const clientId= "242502706628-okdg9gqun4g12usjbu5squvsvohl867s.apps.googleusercontent.com"
    const url= "http://localhost:3030"
    const alert = useAlert()
    const [googleId, setGoogleId]= useState('')
    const [name, setName]= useState('')
    const [email, setEmail]= useState('')
    const [pwd, setPwd]= useState('')
    const [load, setLoad]= useState(false)
    schema.is().min(8)                      
    .is().max(100)                                
    .has().letters(2)                             
    .has().digits(2) 
    .has().symbols(2)                               
    .has().not().spaces()  

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

    const register= (e)=> {
        if(EmailValidator.validate(email) && name!== "" && pwd!== "" && schema.validate(pwd)){
            e.preventDefault()
            Axios.post(`${url}/register`, {googleId: Short.generate(), name: name, email: email, pwd: pwd, image: avatar, level: 0})
            .then((res)=> {
                if(res.data.length> 0){
                    setLoad(true)
                    dispatch(setUser({user: true, id: res.data[0].googleId, level: 0}))
                    dispatch(setTest({test: true}))
                    setTimeout(() => {
                        setLoad(false)
                        alert.success(`تهانينا ${res.data[0].name}`)
                        navigate(`/level/${res.data[0].googleId}`)
                    }, 3000)
                }else{
                    alert.info("هذا الحساب موجود مسبقا، سجل الدخول")
                }
            })
            .catch(err=> {
                alert.error("هناك مشكلة، حاول مجددا")
            })
        }else if(!EmailValidator.validate(email) && !schema.validate(pwd)){
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                alert.error("بريد الكتروني خاطئ، حاول مجددا")
                alert.error("اختر كلمة سر أقلها 8 (أرقام و حروف)")
            }, 500)
        }else if(!EmailValidator.validate(email)){
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                alert.error("بريد الكتروني خاطئ، حاول مجددا")
            }, 500)
        }else if(!schema.validate(pwd)){
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
                alert.error("اختر كلمة سر أقلها 8 (أرقام و حروف و رموز)")
            }, 500)
        }
        
    }

    const registerGF= (googleId, name, email, pwd, image, level)=> {
        Axios.post(`${url}/register`, {googleId: googleId, name: name, email: email, pwd: pwd, image: image, level: level})
        .then((res)=> {
            if(res.data.length> 0){
                setLoad(true)
                dispatch(setUser({user: true, id: res.data[0].googleId, level: 0}))
                dispatch(setTest({test: true}))
                setTimeout(() => {
                alert.success(`تهانينا ${res.data[0].name}`)
                navigate(`/level/${res.data[0].googleId}`)
                }, 1000)
            }else{
                alert.info("هذا الحساب موجود مسبقا، سجل الدخول")
            }
        })
        .catch(err=> {
            alert.error("هناك مشكلة، حاول مجددا")
        })
    }

    const onLoginGoogle= (res)=> {
        registerGF(res.profileObj.googleId, res.profileObj.name, res.profileObj.email, "", res.profileObj.imageUrl, 0)
    }
    const onLoginFace= (res)=> {
        registerGF(res.id, res.name, res.email, "", res.picture.data.url, 0)
    }
    return (
        <div className="Register">
            {load ? 
            (<center>
                <div style= {{width: "100%", height: "15vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"}}>
                    <RingLoader
                        loading= {load}
                        color= {"blue"}
                        size= {50}
                    />
                    <p>انتظروا قليلا، رجاء...</p>
                </div>
            </center>)
            :(
            <>
            <nav>
                <img id="logo" src={logo} alt="" />
                <Link to="/login" >
                    <ArrowBackIcon id="Login_return" style={{color: "white"}}/>
                </Link>
            </nav>
            <div className="Register_form">
                <center>
                    <h1>
                        قم بإنشاء حساب للاستمتاع والتعلم بشكل أسرع 
                    </h1>
                </center>
                <GoogleLogin
                    className='loginGBtn'
                    clientId={clientId}
                    buttonText="انشئ حسابك عن طريق Google"
                    onSuccess={onLoginGoogle}
                    onFailure={null}
                    cookiePolicy={'single_host_origin'}
                />
                <FacebookLogin
                    className='loginFBtn'
                    appId={faceId}
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={onLoginFace}
                    textButton='انشئ حسابك عن طريق Facebook'
                />
                <form action="" onSubmit= {register}>
                    <TextField type="text" id="Login_form_input" helperText="قم بإدخال إسم المستخدم" label="إسم المستخدم" onChange= {(e)=> {setName(e.target.value)}} />
                    <TextField type="email" id="Login_form_input" helperText="قم بإدخال البريد الإلكتروني" label="البريد الإلكتروني" onChange= {(e)=> {setEmail(e.target.value)}} />
                    <TextField type="password" id="Login_form_input" helperText="قم بإدخال كلمة السر" label="كلمة السر" onChange= {(e)=> {setPwd(e.target.value)}} />
                    <Button type= 'submit' variant="contained" onClick= {register}>إنشاء الحساب</Button>
                </form>
            </div>
            </>)
            }
        </div>
    )
}

export default Register
