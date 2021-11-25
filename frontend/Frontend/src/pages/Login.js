import '../styles/App.css'
import logo from '../images/logo.jpg'
import { Squash as Hamburger } from 'hamburger-react'
import {BrowserRouter as Router , Routes ,Route, Link} from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
function Login() {
    return (
        <div className="Login">
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
                <form action="">
                    <TextField id="Login_form_input" helperText="قم بإدخال البريد الإلكتروني" label="البريد الإلكتروني" />
                    <TextField id="Login_form_input" helperText="قم بإدخال كلمة السر" label="كلمة السر" />
                    <Button variant="contained">تسجبل الدخول</Button>
                </form>
                <center>
                    <h3 style={{textDecoration: "underline"}}>
                        ليس لديك حساب؟<Link to="/register" style= {{color: "black"}}><span style= {{color: "red", cursor: "pointer"}}> قم بإنشاء حسابك الآن</span></Link>
                    </h3>
                </center>
            </div>
        </div>
    )
}

export default Login

