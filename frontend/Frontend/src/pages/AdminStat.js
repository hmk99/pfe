import {BrowserRouter as Router , Routes ,Route, Link, useParams, useNavigate} from 'react-router-dom'
import Axios from 'axios'
import '../styles/Levels.css'
import '../styles/Admin.css'
import logo from '../images/logo.jpg'
import {useState, useEffect} from 'react'
import {GoogleLogin, GoogleLogout} from 'react-google-login'
import Button from '@mui/material/Button'
import ReactPaginate from 'react-paginate'
import useForceUpdate from 'use-force-update'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, setAdmin } from '../Reducer'
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import Modal from 'react-modal'
import NavAdmin from '../component/NavAdmin'
import BarChart from '../component/BarChart'
import Dropdown from 'react-dropdown'

function AdminStat() {
  const url= "http://localhost:3030"
  const theme = useSelector((state) => state.user.theme)
  const [stats, setStats]= useState([])
  const [level, setLevel]= useState()
  const [fails, setFails]= useState()
  const [scores, setScores]= useState()
  const [levels, setLevels]= useState([])
  const [types, setTypes]= useState([])
  const [qsts, setQsts]= useState([])
  const[typeLevel, setTypeLevel]= useState("")
  const [ready, setReady]= useState(false)
  const [readyLev, setReadyLev]= useState(false)
  const [chartReady, setChartReady]= useState(false)
  const[filterShow, setFilterShow]= useState(false)
  const[filterLevel, setFilterLevel]= useState(0)
  const[pageNum, setPageNum]= useState(0)
  const qstPerPage= 10
  const pageVis= pageNum * qstPerPage
  const pageCount = Math.ceil(qsts.length / qstPerPage)
  const pageChange = ({selected})=>{
    setPageNum(selected)
  }
  const corr= (n)=> {
    switch (n) {
      case 1:
        return "الماضي"
        break;
      case 2:
        return "المضاع"
        break;
      case 3:
        return "المنصوب"
        break;
      case 4:
        return "المجزوم"
        break;
      case 6:
        return "الأمر"
        break;
      case 8:
        return "مجهول الماضي"
        break;
      case 9:
        return "مجهول المضارع"
        break;
    }
  }
  const getStats= ()=> {
    Axios.post(`${url}/adminStats`, {fs: true})
    .then(res=> {
      setStats(res.data)
      setReady(true)
    })
    .catch(err=> {
      console.log(err)
    })
  }
  const getLevels= ()=> {
    Axios.post(`${url}/adminStats`, {fs: false})
    .then(res=> {
      setLevels(res.data)
      setReadyLev(true)
    })
    .catch(err=> {
      console.log(err)
    })
  }
  const getSavedQsts= (level, order)=> {
    Axios.post(`${url}/adminSavedQsts`, {level: level})
    .then(res=> {
      if(order=== true){
        setQsts(res.data.sort((a, b)=> {return b.nb - a.nb}))
        setPageNum(0)
      }else{
        setQsts(res.data)
        setPageNum(0)
      }
    })
    .catch(err=> {
      console.log(err)
    })
  }
  const getTypes= ()=> {
    Axios.post("http://localhost:3030/getTypes", {all: false})
    .then((res)=> {
        setTypes(res.data)
    })
    .catch(err=> {
        console.log(err)
    })
  }
  const getTypeName= (title)=> {
    return Axios.post("http://localhost:3030/getTypeId", {title: title})
    .then(res=> {
        return res.data[0].level
    })
    .catch(err=> {
        console.log(err)
    })
  }
  useEffect(()=> {
    getStats()
    getLevels()
    getSavedQsts(filterLevel, false)
    getTypes()
  }, [])

  useEffect(()=> {
    let scoreColors= []
    let failColors= []
    let levelColors= []
    if(ready || readyLev){
      stats.map((e, i)=> {
        let color= ""
        if(e.scores< 50){
          color= "#f44336"
        }else if(e.scores< 75){
          color= "#4caf50"
        }else{
          color= "#1b5e20"
        }
        scoreColors[i]= color
      })
      stats.map((e, i)=> {
        let color= ""
        if(e.fails< 3){
          color= "#e57373"
        }else if(e.fails< 5){
          color= "#f44336"
        }else{
          color= "#b71c1c"
        }
        failColors[i]= color
      })
      levels.map((e, i)=> {
        let color= ""
        if(e.levels< 10){
          color= "#e57373"
        }else if(e.fails< 15){
          color= "#f44336"
        }else{
          color= "#b71c1c"
        }
        levelColors[i]= color
      })
      setScores({
        labels: stats.map((e)=> e.level),
        datasets: [
          {
            label: "Scores",
            data: stats.map((e)=> e.scores),
            backgroundColor: scoreColors,
            borderColor: theme=== "light"? "black": "white",
            borderWidth: 2,
          },
        ],
      });
      setFails({
        labels: stats.map((e)=> e.level),
        datasets: [
          {
            label: "Fails",
            data: stats.map((e)=> e.fails),
            backgroundColor: failColors,
            borderColor: theme=== "light"? "black": "white",
            borderWidth: 2,
          },
        ],
      });
      setLevel({
        labels: levels.map((e)=> e.level),
        datasets: [
          {
            label: "Level Average",
            data: levels.map((e)=> e.levels),
            backgroundColor: levelColors,
            borderColor: theme=== "light"? "black": "white",
            borderWidth: 2,
          },
        ],
      });
      setChartReady(true)
    }
  }, [ready, readyLev])
  const saved= {
    width: "100%", minHeight: "20vh", display: "flex", flexDirection: "column", alignItems: "center"
  }
  const savedChild= {
    width: "100%", minHeight: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"
  }
  const displayQsts= qsts
    .slice(pageVis,pageVis + qstPerPage)
    .map((e)=> {
        return(
          <motion.div layout animate={{opacity: 1}} initial={{opacity: 0}} exit={{opacity: 1}} >
            <div style= {saved}>
              <div style= {savedChild}>
                <h3 id= "level" style= {{width: "10%", fontSize: "15px", color: theme=== "light"? "#0062ff": "#ffc000"}}>{e.level}</h3>
                <h4 style= {{width: "60%", fontSize: "15px"}}>{e.pronom} ({e.qst}) في {corr(e.temps)}</h4>
                <h3 id= "rep" style= {{width: "10%", fontSize: "15px", color: "#dc143c"}}>{e.rep}</h3>
                <h3 id= "nb" style= {{width: "10%", fontSize: "15px", color: theme=== "light"? "#0062ff": "#ffc000"}}>{e.nb}</h3>
              </div>
              <div className="line"></div>
            </div>
          </motion.div>
        )
    })

  return (
    <div>
        <NavAdmin />
        <br /><br />
        <ol type= "1" style= {{marginTop: "10vh"}}>
          <h1><li>متوسط مراحل المستخدمين:</li></h1>
          <div className="" style= {{width: "70%", margin: "auto"}}>
            {chartReady ?<><BarChart chartData=  {level} /> </>: <h1>يرجى الإنتظار</h1>}
          </div>
          <h1><li>متوسط التعثرات:</li></h1>
          <div className="" style= {{width: "70%", margin: "auto"}}>
            {chartReady ?<><BarChart chartData=  {fails} /> </>: <h1>يرجى الإنتظار</h1>}
          </div>
          <h1><li>متوسط النتائج:</li></h1>
          <div className="" style= {{width: "70%", margin: "auto"}}>
            {chartReady ?<><BarChart chartData=  {scores} /> </>: <h1>يرجى الإنتظار</h1>}
          </div>
          <h1><li>قائمة الأسئلة المحفوظة:</li></h1>
          <div className="" style= {{width: "100%", minHeight: "50vh"}}>
            <div style={{width: "60%", minHeight: "5vh", display: "flex", justifyContent: "space-evenly", alignItems: "center", flexWrap: "wrap", gap: "10px"}}>
              <div style= {{width: "60%", marginRight: "10px"}}>
                <Dropdown placeholder= "اختر عنوان المرحلة..." options= {types.map(e=> e.title)} onChange= {(event)=> {getTypeName(event.value).then(res=> {getSavedQsts(res, false); setFilterLevel(res)}); }} />
              </div>
              <Button variant="contained" type='container' onClick= {()=> {getSavedQsts(filterLevel, true)}}>الأكثر حفظا</Button>
            </div>
            <div style= {savedChild}>
              <h3 style= {{width: "10%", fontSize: "15px"}}>المرحلة</h3>
              <h3 style= {{width: "60%", fontSize: "15px"}}>السؤال</h3>
              <h3 style= {{width: "10%", fontSize: "15px"}}>الإجابة</h3>
              <h3 style= {{width: "10%", fontSize: "15px"}}>عدد مرات الحفظ</h3>
            </div>
            <div style= {{minHeight: "50vh"}}>
              <AnimatePresence>
                {displayQsts}
              </AnimatePresence>
            </div>
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
          </div>
        </ol>
        
    </div>
  )
}

export default AdminStat