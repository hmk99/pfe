import '../styles/Level.css'
import {BrowserRouter as Router , Routes ,Route, Link, useParams, useNavigate} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, setAdmin, setTest } from '../Reducer'
import Axios from 'axios'
import {useState, useEffect} from 'react'
import Button from '@mui/material/Button'
function Level() {
    const url= "http://localhost:3030"
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate=useNavigate()
    const[userName, setUserName]= useState("")
    const getUsername= ()=> {
        Axios.post(`${url}/getInfos`, {id: user.id})
        .then((res)=> {
            setUserName(res.data[0].name)
        })
    }

    const choose= (level)=> {
        Axios.post(`${url}/levelGlb`, {level: level, googleId: user.id})
        .then((res)=> {
            dispatch(setUser({user: true, id: user.id, level: level}))
            dispatch(setTest({test: false}))
            navigate(`/levels/${user.id}/${level}`)
        })
        .catch(err=> {
            alert("هناك مشكلة، حاول مجددا")
        })
    }
    
    useEffect(()=> {
        getUsername()
    }, [])

    return (
        <div className="Level">
            <center>
                {
                    userName ?(
                        <h1>
                            مرحبا بك 🎉<span>{userName}</span>🎉، ما هو مستواك ؟
                        </h1>
                    ): null
                }
            </center>
            <center>
                <h3>يمكنك اختيار المرحلة المناسبة لك، أو القيام باختبار لتحديد مستواك و من ثم سيتم اختياره بطريقة تلقائية</h3>
                <Button id= "statBtn" variant="contained" onClick= {()=> {navigate(`/levelTest/${user.id}`)}}>بدء الاختبار</Button>
            </center>
            <br />
            <div className="LevelBoxes">
                <div className="" onClick= {()=> {choose(0)}}>
                    <div className="flipInner">
                        <h2>مبتدئ</h2>
                        <p>إذا كنت لا تملك أي فكرة على التصريف العربي، فهذا الخيار يسمح لك بالبدء من المرحلة الأولى</p>
                    </div>
                </div>
                <div className="" onClick= {()=> {choose(2)}}>
                    <div className="flipInner">
                        <h2>متوسط</h2>
                        <p>إذا كنت تعرف الفرق بين الفعل الصحيح و المعتل و تملك فكرة عن الفعل السالم، فهذا الخيار يسمح لك بالبدء من مرحلة الفعل المهموز و المضعف</p>
                    </div>
                </div>
                <div className="" onClick= {()=> {choose(5)}}>
                    <div className="flipInner">
                        <h2>متقدم</h2>
                        <p>إذا كنت تعرف كيفية تصريف الأفعال الصحيحة، فهذا الخيار يسمح لك بالبدء من مرحلة الأفعال المعتلة</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Level
