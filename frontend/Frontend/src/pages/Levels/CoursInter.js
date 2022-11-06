import {BrowserRouter as Router , Routes ,Route, Link, useParams, useNavigate} from 'react-router-dom'
import Axios from 'axios'
import '../../styles/Levels.css'
import logo from '../../images/logo.jpg'
import fir from '../../images/100.png'
import sec from '../../images/101.png'
import thir from '../../images/102.png'
import frth from '../../images/103.png'
import {useState, useEffect} from 'react'
import {GoogleLogin, GoogleLogout} from 'react-google-login'
import Button from '@mui/material/Button'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, setAdmin } from '../../Reducer'
import Nav from '../../component/Nav'

function CoursInter({id, level}) {
    //PREPA
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const navigate=useNavigate()
    const params= useParams()
    const levelUser= params.level
    const clientId= "242502706628-okdg9gqun4g12usjbu5squvsvohl867s.apps.googleusercontent.com"
    const[userName, setUserName]= useState("")
    const[image, setImage]= useState("")
    const[photo, setPhoto]= useState("")
    const url= "http://localhost:3030"
    const kh= "khsy"
    //COURS
    const [salim, setSalim]= useState("")
    const [weak, setWeak]= useState("")
    const [title, setTitle]= useState("")
    const [SWReady, setSWReady]= useState(false)
    const[cours, setCours]= useState([])
    const[conj, setConj]= useState([])
    const getInfos= ()=> {
        Axios.post(`${url}/getInfos`, {id: id})
        .then((res)=> {
          setUserName(res.data[0].name)
          setImage(res.data[0].image)
        })
        .catch(err=> {
          console.log(err)
        })
    }
    
    const getSW= ()=> {
      Axios.post(`${url}/getSW`, {level: level})
      .then((res)=> {
        setSalim(res.data[0].salim)
        setWeak(res.data[0].weak)
        setTitle(res.data[0].title)
        setSWReady(true)
      })
    }

    const getCours= ()=> {
        Axios.post(`${url}/getCours`, {level: level})
        .then((res)=> {
          if(res.data.length> 0){
            setCours(res.data)
          }
        })
    }
    const getConj= ()=> {
        Axios.post(`${url}/getConj`, {level: level})
        .then((res)=> {
          if(res.data.length> 0){
            setConj(res.data)
          }
        })
    }

    const displayConj= conj.map(e=> {
        return(
            <>
                <p>
                    - {e.elem}
                </p>
            </>
        )
    })

    useEffect(()=> {
        getInfos()
        getSW()
        if(level== 100){
            setPhoto("fir")
        }else if(level== 101){
            setPhoto("sec")
        }else if(level== 102){
            setPhoto("thir")
        }else{
            setPhoto("firth")
        }
      }, [])
    useEffect(()=> {
        if(SWReady){
            getCours()
            getConj()
        }
    }, [SWReady])
  return (
    <div className='LevelInter'>
        <Nav />
        <br /><br /><br /><br />
        <h1>{title}</h1>
        {
            (cours.length> 0) ? (
                <>
                    <h1>الدروس</h1>
                    <ol type='I'>
                        <>
                            <li id= "titleFir">تعريف الفعل ال{salim}</li>
                                {cours[0].def}
                            <br />
                        </>
                        {
                            (weak!== "") ? (
                                <>
                                    <br />
                                    <li id= "titleFir">تعريف الفعل ال{weak}</li>
                                    {cours[1].def}
                                </>
                            ): null
                        }
                    </ol>
                </>
            ): null
        }
        <h1>القواعد</h1>
        {
            displayConj
        }
        <br /><br /><br /><br />
        <h1>
            مثال عن تصريف مع جميع الضمائر:
        </h1>
        {
            (level== "100") ?(
                <img id='imgEx' src= {fir} alt="" />
            ):
            (level== "101") ?(
                <img id='imgEx' src= {sec} alt="" />
            ):
            (level== "102") ?(
                <img id='imgEx' src= {thir} alt="" />
            ):
            (
                <img id='imgEx' src= {frth} alt="" />
            )
        }
    </div>
  )
}

export default CoursInter