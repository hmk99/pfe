import {useState, useEffect} from 'react'
import {BrowserRouter as Router , Routes ,Route, Link, useParams, useNavigate} from 'react-router-dom'
import ReactSwitch from "react-switch"
import Axios from 'axios'
import {GoogleLogin, GoogleLogout} from 'react-google-login'
import Button from '@mui/material/Button'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, setScore, setTheme } from '../Reducer'
import Nav from '../component/Nav'
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion'
import '../styles/Param.css'
import DarkModeToggle from "react-dark-mode-toggle"
import Modal from "react-modal"
import { CSVLink } from 'react-csv'

function Param() {
    //SYS
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const navigate=useNavigate()
    const params= useParams()
    const levelUser= params.level
    const clientId= "242502706628-okdg9gqun4g12usjbu5squvsvohl867s.apps.googleusercontent.com"
    const url= "http://localhost:3030"
    //PREPA
    const [userData, setUserData]= useState()
    const [ready, setReady]= useState(false)
    const[delOpen, setDelOpen]= useState(false)
    const[qsts, setQsts]= useState([])

    const getInfos= ()=> {
        Axios.post(`${url}/getInfos`, {id: user.id})
        .then((res)=> {
          setUserData({ name: res.data[0].name, email: res.data[0].email, image: res.data[0].image, level: res.data[0].level })
          setReady(true)
        })
        .catch(err=> {
          console.log(err)
        })
    }
    const updateUser= (name)=> {
        Axios.post(`${url}/updateUserName`, {name: name, userId: user.id})
        .then(res=> {
            setUserData({...userData, name: ""})
            alert(`لقد تم تغيير إسم المستخدم إلى ${userData.name}`)
        })
    }
    const deleteUser= ()=> {
        Axios.post(`${url}/deleteUser`, {googleId: user.id})
        .then(res=> {
            dispatch(setUser({user: false, id: null, level: null}))
            navigate("/")
        })
    }
    const getData= ()=> {
        Axios.post(`${url}/dataCsv`, {type: 0})
        .then((res)=> {
            setQsts(res.data)
        })
    }
    useEffect(()=> {
        getInfos()
        getData()
    }, [])

    const logOut= ()=> {
        dispatch(setUser({user: false, id: null, level: null}))
        dispatch(setScore({score: null}))
        navigate("/")
    }
    const toggleTheme= ()=> {
        if(user.theme=== "light"){
          dispatch(setTheme({theme: "dark"}))
        }else{
          dispatch(setTheme({theme: "light"}))
        }
    }

    const headerQst= [
        {label: "id", key: "id"},
        {label: "salim", key: "salim"},
        {label: "weak", key: "weak"},
        {label: "temps", key: "temps"},
        {label: "qst", key: "qst"},
        {label: "freq", key: "freq"},
        {label: "pronom", key: "pronom"},
        {label: "rep", key: "rep"},
        {label: "repDc", key: "repDc"},
        {label: "op1", key: "op1"},
        {label: "op2", key: "op2"},
        {label: "op3", key: "op3"},
        {label: "op4", key: "op4"},
    ]
    const csvQsts= {
        filename: "Qsts.csv",
        headers: headerQst,
        data: qsts
    }
    
  return (
    <div className='Param'>
        <Nav />
        <br />
        <header>
            <h1>الإعدادات</h1>
            <ul>
                <li>شخصي</li>
                <li>
                    <CSVLink style={{textDecoration: "none", color: user.theme=== "light"? "black": "white"}} id= 'csv' {...csvQsts}>
                        قائمة الأسئلة   
                    </CSVLink>
                </li>
                <li onClick= {()=> {setDelOpen(true)}}>حذف الحساب</li>
                {ready&& <Modal id='defModal' ariaHideApp={false} isOpen={delOpen} onRequestClose={()=> setDelOpen(false)}>
                    <h3>{userData.name}، هل تريد حقا حذف حسابك ؟</h3>
                    <Button id= "statBtn" variant="contained" color="error" onClick={()=> {deleteUser()}}>تأكيد الحذف</Button>
                </Modal>
                }
            </ul>
        </header>
        <center>
        <div id="pers" className='userStatInfos' style= {{padding: "20px",
            marginTop: "10vh", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", border: "1px solid black", borderRadius: "20px",
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
            }}>
            {   ready &&<>
                <h3>الإسم: <form onSubmit= {(e)=> {e.preventDefault(); updateUser(userData.name)}}><input type="text" value={userData.name} onChange= {(e)=> {setUserData({...userData, name: e.target.value})}} /></form></h3>
                <h3>البريد الإلكتروني: {userData.email}</h3>
                <h3>المرحلة: {userData.level}</h3>
                <div style= {{width: "40%", display: "flex", justifyContent: "space-evenly", alignItems: "center"}}><h3>الوضع الليلي:</h3><DarkModeToggle onChange= {toggleTheme} checked= {user.theme=== "dark"} size= {65} speed= {2} /></div>
                <GoogleLogout
                    className= "mainLogOut"
                    clientId={clientId}
                    buttonText="تسجيل الخروج"
                    onLogoutSuccess={logOut}
                /></>
            }
        </div>
        </center>
        <br />
    </div>
  )
}

export default Param