import {BrowserRouter as Router , Routes ,Route, Link, useParams, useNavigate} from 'react-router-dom'
import Axios from 'axios'
import '../styles/Admin.css'
import logo from '../images/logo.jpg'
import {useState, useEffect} from 'react'
import {GoogleLogin, GoogleLogout} from 'react-google-login'
import { useSelector, useDispatch } from 'react-redux'
import NavAdmin from '../component/NavAdmin'
import { CSVLink } from 'react-csv'
function AdminData() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const navigate=useNavigate()
    const params= useParams()
    const url= "http://localhost:3030"
    const [json, setJson]= useState([])
    const [headers, setHeaders]= useState([])
    const [qsts, setQsts]= useState([])
    const [saves, setSaves]= useState([])
    const [stats, setStats]= useState([])
    const [ready, setReady]= useState(false)

    const getData= (type)=> {
        Axios.post(`${process.env.REACT_APP_API_GET_DATA_CSV}`, {type: type})
        .then((res)=> {
            if(type=== 0){
                setQsts(res.data)
            }
            else if(type=== 1){
                setSaves(res.data)
            }
            else{
                setStats(res.data)
            }
        })
        .catch(err=> {
            console.log(err)
        })
    }
    useEffect(()=> {
        getData(0)
        getData(1)
        getData(2)
    }, [])
    
    
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
    const headerSave= [
        {label: "id", key: "id"},
        {label: "salim", key: "salim"},
        {label: "weak", key: "weak"},
        {label: "temps", key: "temps"},
        {label: "qst", key: "qst"},
        {label: "pronom", key: "pronom"},
        {label: "rep", key: "rep"},
        {label: "repDc", key: "repDc"},
        {label: "op1", key: "op1"},
        {label: "op2", key: "op2"},
        {label: "op3", key: "op3"},
        {label: "op4", key: "op4"},
        {label: "nbSaves", key: "nbSaves"},
    ]
    const headerStat= [
        {label: "salim", key: "salim"},
        {label: "weak", key: "weak"},
        {label: "title", key: "title"},
        {label: "score", key: "score"},
        {label: "fails", key: "fails"},
    ]
    const csvQsts= {
        filename: "Qsts.csv",
        headers: headerQst,
        data: qsts
    }
    const csvSaves= {
        filename: "SavedQsts.csv",
        headers: headerSave,
        data: saves
    }
    const csvStats= {
        filename: "Stats.csv",
        headers: headerStat,
        data: stats
    }
  return (
    <div className='AdminData'>
        <NavAdmin />
        <br /><br /><br /><br /><br />
        <div className='AdminDataLinks' style= {{width: "100%", height: "10vh", display: "flex", justifyContent: "space-evenly", alignItems: "center", textDecoration: "none"}}>
            <CSVLink 
            style= {{
                background: "white", color: "blue", marginTop: "10vh",
                
            }} 
            {...csvQsts}
            >
                قائمة الأسئلة
            </CSVLink>
            <CSVLink 
            style= {{
                background: "white", color: "blue", marginTop: "10vh",
                
            }} 
            {...csvSaves}
            >
                قائمة الأسئلة المحفوظة
            </CSVLink>
            <CSVLink 
            style= {{
                background: "white", color: "blue", marginTop: "10vh",
                
            }} 
            {...csvStats}
            >
                قائمة إحصائيات النتائج و التعثرات
            </CSVLink>
        </div>
    </div>
  )
}

export default AdminData