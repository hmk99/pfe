import '../styles/App.css'
import logo from '../images/logo.jpg'
import { Squash as Hamburger } from 'hamburger-react'
import {BrowserRouter as Router , Routes ,Route, Link} from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
function Register() {
    return (
        <div className="Register">
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
                <form action="">
                    <TextField id="Login_form_input" helperText="قم بإدخال إسم المستخدم" label="إسم المستخدم" />
                    <TextField id="Login_form_input" helperText="قم بإدخال البريد الإلكتروني" label="البريد الإلكتروني" />
                    <TextField id="Login_form_input" helperText="قم بإدخال كلمة السر" label="كلمة السر" />
                    <Button variant="contained">إنشاء الحساب</Button>
                </form>
            </div>
        </div>
    )
}

export default Register
