import {BrowserRouter as Router , Routes ,Route, Link, useParams, useNavigate} from 'react-router-dom'
import Axios from 'axios'
import '../styles/Admin.css'
import {useState, useEffect} from 'react'
import Button from '@mui/material/Button'
import ReactPaginate from 'react-paginate'
import { useSelector, useDispatch } from 'react-redux'
import Modal from 'react-modal'
import NavAdmin from '../component/NavAdmin'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import BarChart from '../component/BarChart'

function AdminNotes() {
    const dispatch = useDispatch()
    const theme = useSelector((state) => state.user.theme)
    const url= "http://localhost:3030"
    const [notes, setNotes]= useState([])
    const [types, setTypes]= useState([{level: "kdld"}])
    const [stats, setStats]= useState([])
    const [ratings, setRatings]= useState([])
    const [level, setLevel]= useState("")
    const [labLevel, setLabLevel]= useState(0)
    const[pageNum, setPageNum]= useState(0)
    const[ready, setReady]= useState(false)
    const[chartReady, setChartReady]= useState(false)
    const notePerPage= 10
    const pageVis= pageNum * notePerPage
    const pageCount = Math.ceil(notes.length / notePerPage)
    const pageChange = ({selected})=>{
        setPageNum(selected)
    }

    const getNotes= (level, rating)=> {
        Axios.post(`${process.env.REACT_APP_API_GET_NOTES}`, {level: level})
        .then(res=> {
            if(rating!== ""){
                setNotes(res.data.filter((val)=> {if(val.rating=== rating) {return val}}))
                setPageNum(0)
              }else{
                setNotes(res.data)
                setPageNum(0)
            }
        })
    }
    const getNotesStat= (level, rating)=> {
        Axios.post(`${process.env.REACT_APP_API_GET_NOTES_STAT}`, {level: level})
        .then(res=> {
            setStats(res.data)
            setReady(true)
        })
    }
    const getTypes= ()=> {
        Axios.post(`${process.env.REACT_APP_API_GET_VERB_TYPES}`, {all: false})
        .then((res)=> {
            setTypes(res.data)
        })
        .catch(err=> {
            console.log(err)
        })
    }
    const saved= {
        padding: "20px", width: "100%", minHeight: "20vh", display: "flex", flexDirection: "column", alignItems: "center"
    }
    const savedChild= {
        padding: "20px", width: "100%", minHeight: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"
    }

    const display= notes
        .slice(pageVis,pageVis + notePerPage)
        .map(e=> {
        return(
            <div style= {saved}>
                <div style= {savedChild}>
                    <h3 style= {{width: "10%", color: theme=== "light"? "#0062ff": "#ffc000"}}>{e.level}</h3>
                    <h3 style= {{width: "10%", color: e.rating== "سيئ"? "#dc143c": e.rating== "جيد"? "#4caf50": "#0062ff"}}>{e.rating}</h3>
                    <h4 style= {{width: "70%", color: theme!== "light"&& "white"}}>{e.note}</h4>
                </div>
                <div className="line"></div>
            </div>
        )
    })
    const getTypeName= (title)=> {
        return Axios.post(`${process.env.REACT_APP_API_GET_TYPE_ID}`, {title: title})
        .then(res=> {
            return res.data[0].level
        })
        .catch(err=> {
            console.log(err)
        })
    }

    useEffect(()=> {
        getNotes(0, "")
        getNotesStat(-1)
        getTypes()
    }, [])

    useEffect(()=> {
        let scoreColors= []
            stats.map((e, i)=> {
                let color= ""
                if(e.rating== "مقبول"){
                  color= "#0062ff"
                }else if(e.rating== "جيد"){
                  color= "#4caf50"
                }else if(e.rating== "سيئ"){
                  color= "red"
                }
                scoreColors[i]= color
            })
            setRatings({
                labels: stats.filter((v,i)=> stats.findIndex(v2=> (v2.level===v.level))===i ).map(e=> e.level), //stats.map(e=> e.level),
                datasets: [
                  {
                    label: "جيد",
                    data: stats.filter((val)=> {if(val.rating=== "جيد"){return val}}).map(e=> e.nbRating/ e.nbTotal),
                    backgroundColor: "#4caf50",
                    borderColor: theme=== "light"? "black": "white",
                    borderWidth: 2,
                  }, 
                  {
                    label: "مقبول",
                    data: stats.filter((val)=> {if(val.rating=== "مقبول"){return val}}).map(e=> e.nbRating/ e.nbTotal),
                    backgroundColor: "#0062ff",
                    borderColor: theme=== "light"? "black": "white",
                    borderWidth: 2,
                  }, 
                  {
                    label: "سيئ",
                    data: stats.filter((val)=> {if(val.rating=== "سيئ"){return val}}).map(e=> e.nbRating/ e.nbTotal),
                    backgroundColor: "red",
                    borderColor: theme=== "light"? "black": "white",
                    borderWidth: 2,
                  }, 
                ]
            });
            setChartReady(true)
        
    }, [stats])

    const addAllOp= (a, e)=> {
        a.unshift(e)
        return(a)
    }

  return (
    <div className='AdminNotes' style= {{overflowX: "hidden"}}>
        <NavAdmin />
        <br />
        <h1 style= {{marginTop: "10vh"}}>ملاحظات المستخدمين</h1>
        <p>
            في هذه الصفحة، تجد جميع ملاحظات المستخدمين و آرائهم حول التطبيق (من سرد الدروس إلى طرح التمارين، أو تحسينات مرجوة...)، بالإضافة إلى إحصائيات هاته الملاحظات لكل مرحلة، <a href='#statSection' style= {{cursor: "pointer", color: theme=== "light"? "#0062ff": "#ffc000"}}>من هنا...</a>
        </p>
        <br />
        <p>اختر حسب المرحلة</p>
        <div style= {{width: "80%", height: "10vh", gap: "10px", marginRight: "10px", display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", alignItems: "center"}}>
            <Dropdown placeholder= "اختر عنوان المرحلة..." options= {types.map(e=> e.title)} onChange= {(event)=> {getTypeName(event.value).then(res=> {getNotes(res, ""); setLevel(res)})}} />
            <Button style={{width: "fit-content"}} variant="contained" onClick= {()=> {getNotes(level, "مقبول")}}>مقبول</Button>
            <Button style={{width: "fit-content"}} variant="contained" color="success" onClick= {()=> {getNotes(level, "جيد")}}>جيد</Button>
            <Button style={{width: "fit-content"}} variant="contained" color="error" onClick= {()=> {getNotes(level, "سيئ")}}>سيئ</Button>
        </div>
        <div style= {savedChild}>
            <h3 style= {{width: "10%"}}>المرحلة</h3>
            <h3 style= {{width: "10%"}}>التقييم</h3>
            <h3 style= {{width: "70%"}}>الملاحظة</h3>
        </div>
        {
            display
        }
        <br />
        <center>
        <ReactPaginate
            previousLabel={"السابق"}
            nextLabel={"اللاحق"}
            pageCount={pageCount}
            onPageChange={pageChange}
            containerClassName={"pagBtns"}
            previousLinkClassName={"prevBtn"}
            nextLinkClassName={"nxtBtn"}
            activeClassName={"pagAct"}
            disabledClassName={"pagDis"}
            forcePage= {pageNum}
        />
        </center>
        <br />
        <div id="statSection">
            <h1>إحصائيات الملاحظات (%):</h1>
            <div style= {{width: "30%", marginRight: "10px"}}>
                <Dropdown placeholder= "اختر عنوان المرحلة..." options= {addAllOp(types.map(e=> e.title), "جميع المراحل")} onChange= {(e)=> {if(e.value=== "جميع المراحل") {getNotesStat(-1)} else{getTypeName(e.value).then(res=> getNotesStat(res))} }} />
            </div>
            <center>
            <div className="" style= {{width: "90%"}}>
                {chartReady ?<><BarChart chartData=  {ratings} /> </>: <h1>يرجى الإنتظار</h1>}
            </div>
            </center>
        </div>
    </div>
  )
}

export default AdminNotes