import {BrowserRouter as Router , Routes ,Route, Link, useParams, useNavigate} from 'react-router-dom'
import Axios from 'axios'
import '../styles/Levels.css'
import '../styles/Admin.css'
import logo from '../images/logo.jpg'
import {useState, useEffect} from 'react'
import {GoogleLogin, GoogleLogout} from 'react-google-login'
import Button from '@mui/material/Button'
import ReactPaginate from 'react-paginate'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, setAdmin } from '../Reducer'
function AdminExo() {
    const dispatch = useDispatch()
    const navigate=useNavigate()
    const id= "admin"
    const[user, setUser]= useState("")
    const[image, setImage]= useState("")
    const[dc, setDc]= useState([])
    const[blanks, setBlanks]= useState([])
    const[types, setTypes]= useState([])

    const getImg= ()=> {
        Axios.post("http://localhost:3030/getInfos", {id: id})
        .then((res)=> {
            setImage(res.data[0].image)
        })
        .catch(err=> {
            console.log(err)
        })
    }

    const getBlanks= (typeBlank)=> {
        Axios.post("http://localhost:3030/getTypeBlanks", {typeBlank: typeBlank})
        .then((res)=> {
            if(typeBlank=== 0){
                setDc(res.data)
                
            }else{
                setBlanks(res.data)
            }
        })
        .catch(err=> {
            console.log(err)
        })
    }
    const getTypes= ()=> {
        Axios.get("http://localhost:3030/getTypes")
        .then((res)=> {
            setTypes(res.data)
        })
        .catch(err=> {
            console.log(err)
        })
    }

    const displayBlanks= types.map((e, index)=> {
        return(
            <>
                <tr>
                    <td rowSpan= "13" style={{width: "5%", fontStyle: "italic", color: "#0062ff", fontWeight: "700"}}><center>{types[index].type}</center></td>
                    
                </tr>
                {
                    dc.map((i)=> {
                        if (i.type=== types[index].type){
                            return {id: i.id, qte: i.qte}
                        }
                    })
                    .map((e)=> {
                        if(e!== undefined){
                            return(
                                <tr style= {{width: "80%"}}>
                                    <td>{e.qte}</td>
                                </tr>
                            )
                        }
                    })
                }
            </>
        )
    })

    const logOut= ()=> {
        dispatch({
            type: 'set_user',
            user: false,
            admin: false, 
            level: 0
        })
        localStorage.setItem("admin", JSON.stringify({admin: false})) 
        navigate("/")
    }
    useEffect(()=> {
        dispatch({
            type: 'set_user',
            user: false,
            admin: true, 
            level: 0
        }) 
        getImg()
        getBlanks(0)
        getBlanks(1)
        getTypes()
    }, [])
    const dropDown= ()=> {
        const down= document.querySelector('.dropDown')
        down.classList.toggle('dropAnim')
    }
  return (
      <div className="AdminExo">
        <nav>
                {
                (image) ?
                <div className='userInfos'>
                    <h1>
                        administrator
                    </h1>
                    <img id='imgProfile' src= {image} alt="" onClick={dropDown}/>
                </div>
                : null
                }
                <img id="logo" src={logo} alt="" />
                <div className="dropDown">
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
                        <Link id="dropLink" to= "/adminExo">
                            التمارين    
                        </Link>
                    </li>
                    <li onClick={logOut}><span>تسجيل الخروج</span></li>
                </div>
            </nav>
            <br />
            <center>
                <div className="adminCLinks">
                    <h1>
                        <a id='link' href="#dc">التشكيل</a>
                    </h1>
                    <h1>
                        <a id='link' href="#conj">التصريف</a>
                    </h1>
                    <h1>
                        <a id='link' href="#qcm">اختيار الجواب الصحيح</a>
                    </h1>
                </div>
            </center>
            <br />
            <div id="dc">
                <center>
                <table style= {{width: "min-content"}}>
                    <thead>
                        <tr>
                            <th>نوع الفعل</th>
                            <th style= {{width: "80%"}}>السؤال</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        displayBlanks
                    }
                    </tbody>
                </table>
                </center>
            </div>
            <br />
            <div id="conj">

            </div>
            <br />
            <div id="qcm">

            </div>
      </div>
  )
}

export default AdminExo;