import {BrowserRouter as Router , Routes ,Route, Link, useParams, useNavigate} from 'react-router-dom'
import Axios from 'axios'
import '../../styles/Levels.css'
import logo from '../../images/logo.jpg'
import userLogo from '../../images/user.png'
import {useState, useEffect, useRef} from 'react'
import {GoogleLogin, GoogleLogout} from 'react-google-login'
import Button from '@mui/material/Button'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, setScore, setTheme, setTest } from '../../Reducer'
import Dnd from './Dnd'
import ReactSwitch from "react-switch"
import Nav from '../../component/Nav'
import { useAlert } from 'react-alert'

const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)

function LevelTtest() {
    const url= "http://localhost:3030"
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate=useNavigate()
    const alert = useAlert()
    const[userName, setUserName]= useState("")
    const[showFir, setShowFir]= useState(false)
    const[showZero, setShowZero]= useState(false)
    const[showSec, setShowSec]= useState(false)
    const[showThr, setShowThr]= useState(false)
    const[showFrth, setShowFrth]= useState(false)
    const[ready, setReady]= useState(false)
    const[zeros, setZeros]= useState([])
    const[sal, setSal]= useState([])
    const[mah, setMah]= useState([])
    const[mod, setMod]= useState([])
    const[mahMod, setMahMod]= useState([])
    const[levels, setLevels]= useState([])
    const[level, setLevel]= useState(0)
    const ref0= useRef(null)
    const ref1= useRef(null)
    const ref2= useRef(null)
    const ref3= useRef(null)
    const ref4= useRef(null)
    const succMoy= 70
    const executeScroll = (ref) => scrollToRef(ref)
    const getQcms= ()=> {
        for (let i = 0; i < 5; i++) {
            Axios.post(`${url}/getSW`, {level: i})
            .then((res)=> {
                setLevels(prev=> [...prev, {
                    id: res.data[0].id,
                    salim: res.data[0].salim,
                    weak: res.data[0].weak,
                    title: res.data[0].title,
                    level: res.data[0].level,
                    display: i== 0? true: false
                }])
            })
        }
        setReady(true)
    }
    
    useEffect(()=> {
        getQcms()
        dispatch(setScore({score: null}))
    }, [])

    useEffect(()=> {
        if(user.score!== null){
            if(level< 4){
                if(user.score< succMoy){
                    alert.error(`لقد فشلت في تجاوز المرحلة ${level} 😔`) 
                    dispatch(setUser({user: true, id: user.id, level: level}))
                    dispatch(setTest({test: false}))
                    Axios.post(`${url}/levelGlb`, {level: level, googleId: user.id})
                    .then((res)=> {
                        navigate(`/levels/${user.id}/${level}`)
                    })
                }else{
                    setLevel(prev=> prev+ 1)
                    levels.map(e=> {
                        if(e.level=== level+ 1){
                            e.display= true
                        }
                    })
                    alert.success(`لقد تجازوت اختبار المرحلة ${level}`)
                    executeScroll(eval(`ref${level+ 1}`))
                }
            }else{
                if(user.score< succMoy){
                    alert.success(`لقد فشلت في تجاوز المرحلة ${level} 😔`)
                    dispatch(setUser({user: true, id: user.id, level: level}))
                    dispatch(setTest({test: false}))
                    Axios.post(`${url}/levelGlb`, {level: level, googleId: user.id})
                    .then(()=> {
                        navigate(`/levels/${user.id}/${level}`)
                    })
                }else{
                    alert.success(`تهانينا، لقد تجاوزت جميع مراحل الاختبار 🎉🎉`)
                    dispatch(setUser({user: true, id: user.id, level: level+ 1}))
                    dispatch(setTest({test: false}))
                    Axios.post(`${url}/levelGlb`, {level: level, googleId: user.id})
                    .then(()=> {
                        navigate(`/levels/${user.id}/${level+ 1}`)
                    })
                }
            }
            dispatch(setScore({score: null}))
        }
    }, [user.score])

   

    const showLevels= levels.map((e, i)=> {
        return(
            <div ref= {eval(`ref${i}`)} style= {{height: "min-content", opacity: !e.display&& "0", transition: "all 1s ease-in-out"}}>
                <h3>المرحلة {e.level} : {e.title}</h3>
                 <Dnd salim= {e.salim} weak= {e.weak} level= {e.level} />
            </div>
        )
    })
  return (
    <div className='LevelTest'>
        <center>
            <h1>اختبار المستوى لتحديد المرحلة</h1>
        </center>
        <br /><br />
        {
            ready&& showLevels
        }
    </div>
  )
}

export default LevelTtest