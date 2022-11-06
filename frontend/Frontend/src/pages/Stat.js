import {useState, useEffect} from 'react'
import {BrowserRouter as Router , Routes ,Route, Link, useParams, useNavigate} from 'react-router-dom'
import ReactSwitch from "react-switch"
import Axios from 'axios'
import {GoogleLogin, GoogleLogout} from 'react-google-login'
import Button from '@mui/material/Button'
import { useSelector, useDispatch } from 'react-redux'
import logo from '../images/logo.jpg'
import { setUser, setScore, setTheme } from '../Reducer'
import Nav from '../component/Nav'
import BarChart from '../component/BarChart'
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion'
import '../styles/Param.css'
import ReactPaginate from 'react-paginate'
import Modal from 'react-modal'
import Dropdown from 'react-dropdown'
import avatar from '../images/avatar.jpg'
import RingLoader from 'react-spinners/RingLoader'
function Stat() {
    //PREPA
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const theme = useSelector((state) => state.user.theme)
    const navigate=useNavigate()
    const url= "http://localhost:3030"
    const [userData, setUserData]= useState(false)
    const [userStats, setUserStats]= useState([])
    const [userQsts, setUserQsts]= useState([])
    const [types, setTypes]= useState([{level: "جميع المراحل"}])
    const [ready, setReady]= useState(false)
    const [chartReady, setChartReady]= useState(false)
    const[pageNum,setPageNum]= useState(0)
    const[searchTerm, setSearchTerm]= useState("")
    const [delQst, setDelQst]= useState("")
    const [delId, setDelId]= useState("")
    const [delOpen, setDelOpen]= useState(false)
    //Pagination
    

    const corr= (n)=> {
      switch (n) {
        case 1:
          return "الماضي"
          break;
        case 2:
          return "المضاع"
          break;
        case 3:
          return "المجزوم"
          break;
        case 4:
          return "المنصوب"
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
    useEffect(()=> {
      if(ready){
          var e = document.querySelector('img')
          if(e.alt=== "user"){
              if(! (e.complete && e.naturalHeight !== 0)){
                  e.src= avatar
              }
          }
      }
  }, [ready])

    const getStats= ()=> {
      Axios.post(`${url}/getUserStats`, {id: user.id})
      .then(res=> {
        setUserStats(res.data)
      })
      .catch(err=> {
        console.log(err)
      })
    }

    const getQsts= (level)=> {
      Axios.post(`${url}/getSavedQsts`, {id: user.id, level: level})
      .then(res=> {
        setUserQsts(res.data)
        setPageNum(0)
      })
    }
    const getTypes= ()=> {
      Axios.post("http://localhost:3030/getTypes", {all: false})
      .then((res)=> {
        for (let i = 0; i < res.data.length; i++) {
          setTypes(prv=> [...prv, res.data[i]]) 
        }
      })
      .catch(err=> {
          console.log(err)
      })
    }

    useEffect(()=> {
      getInfos()
      getStats()
      getQsts("")
      getTypes()
    }, [])

    const qstPerPage= 10
    const pageVis= pageNum * qstPerPage
    const pageCount = Math.ceil(userQsts.length / qstPerPage)
    const pageChange = ({selected})=>{
      setPageNum(selected)
    }

    const [userScores, setUserScores] = useState() 
    const [userFails, setUserFails] = useState() 
    useEffect(()=> {
      let scoreColors= []
      let failColors= []
      if(ready){
        userStats.map((e, i)=> {
          let color= ""
          if(e.score< 50){
            color= "#f44336"
          }else if(e.score< 75){
            color= "#4caf50"
          }else{
            color= "#1b5e20"
          }
          scoreColors[i]= color
        })
        userStats.map((e, i)=> {
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
        setUserScores({
          labels: userStats.map((e)=> e.level),
          datasets: [
            {
              label: "Score",
              data: userStats.map((e)=> e.score),
              backgroundColor: scoreColors,
              borderColor: theme=== "light"? "black": "white",
              borderWidth: 2,
            },
          ],
        });
        setUserFails({
          labels: userStats.map((e)=> e.level),
          datasets: [
            {
              label: "Fails",
              data: userStats.map((e)=> e.fails),
              backgroundColor: failColors,
              borderColor: theme=== "light"? "black": "white",
              borderWidth: 2,
            },
          ],
        });
        setChartReady(true)
      }
    }, [userStats])

    const saveLevel= (level)=> {
      Axios.post(`${url}/saveLevel`, {id: user.id, level: level})
      .then(res=> {
        getStats()
      })
    }
    const deleteQst= (qstId, level)=> {
      Axios.post(`${url}/deleteSavedQst`, {userId: user.id, qstId: qstId})
      .then(res=> {
        getQsts(level)
      })
      .catch(err=> {
        console.log(err)
      })
    }
    const saved= {
      width: "100%", minHeight: "20vh", display: "flex", flexDirection: "column", alignItems: "center"
    }
    const savedChild= {
      width: "100%", minHeight: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"
    }
    const displayLevels= userStats.map((e, i)=> {
      return(
        <div style= {saved}>
          <div style= {savedChild}>
            <h3 style= {{width: "10%", fontSize: "15px", color: theme=== "light"? "#0062ff": "#ffc000"}} >{e.level}</h3>
            <h3 style= {{width: "75%", fontSize: "15px"}} >{e.title}</h3>
            <div className="switch" style= {{width: "15%"}}>
              <ReactSwitch onChange= {()=> {saveLevel(e.level)}} checked= {e.saved} />
            </div>
          </div>
          <div className='line'></div>
        </div>
      )
    })
    
    const verbDC= (verb)=> {
      return verb.replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, '')
    }
    const displayQsts= userQsts
    .filter((val)=> {
      if(searchTerm== ""){
          return val
      }else if(verbDC(val.qst).includes(searchTerm)){
          return val
      }
    })
    .slice(pageVis,pageVis + qstPerPage)
    .map((e)=> {
        return(
          <motion.div layout animate={{opacity: 1}} initial={{opacity: 0}} exit={{opacity: 1}} >
            <div style= {saved}>
              <div style= {savedChild}>
                <h3 style= {{width: "10%", fontSize: "15px", color: theme=== "light"? "#0062ff": "#ffc000"}}>{e.level}</h3>
                <h4 style= {{width: "55%", fontSize: "15px"}}>{e.pronom} ({e.qst}) في {corr(e.temps)}</h4>
                <h3 style= {{width: "10%", fontSize: "15px", color: "#dc143c"}}>{e.rep}</h3>
                <div className="statBtn" style= {{width: "15%"}}>
                  <Button id= "statBtn" variant="contained" color="error" onClick= {()=> {setDelOpen(true); setDelQst(`${e.pronom} (${e.qst}) في ${corr(e.temps)}`); setDelId(e.id)}}>حذف</Button>
                  <Modal id='defModal' ariaHideApp={false} isOpen={delOpen} onRequestClose={()=>setDelOpen(false)}>
                    <h3>هل تريد حقا حذف السؤال</h3>
                    <p>" {delQst} "</p>
                    <Button id= "statBtn" variant="contained" color="error" onClick= {()=> {deleteQst(delId, e.level); setDelOpen(false)}}>حذف</Button>
                  </Modal>
                </div>
              </div>
              <div className="line"></div>
            </div>
          </motion.div>
        )
    })

  return (
    <div className='Stat'>
        <Nav />
        <br /><br />
        <center>
        {userData ? <div className='userStatInfos' style= {{
            marginTop: "10vh", minHeight: "50vh", display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", border: "1px solid black", borderRadius: "20px",
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
            }}>
            <img src= {userData.image} style= {{borderRadius: "50%", height: "5%", width: "5%", objectFit: "cover"}} alt="user" />
            <h1>معلومات خاصة:</h1>
            <h1>- مرحبا بك {userData.name}</h1>
            <h1>- بريدك: {userData.email}</h1>
            <h1>- مرحلتك هي: {userData.level}</h1>
        </div>: <center>
                  <br />
                  <div style= {{width: "100%", height: "15vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"}}>
                      <RingLoader
                          loading= {!ready}
                          color= {"blue"}
                          size= {50}
                      />
                  </div>
                </center>
        }
        </center>
        <div className="levelInterLinks" style= {{width: "100%", display: "flex", justifyContent: "space-evenly", alignItems: "center", flexWrap: "wrap"}}>
          <h3>توجيه إلى:</h3>
          <h1>
            <a href="#scoresSection" style= {{textDecoration: "none", color: user.theme=== "dark"? "#ffc000": "#0062ff"}} >النتائج</a>     
          </h1>
          <h1>
            <a style= {{textDecoration: "none", color: user.theme=== "dark"? "#ffc000": "#0062ff"}} href="#failsSection" >التعثرات</a>
          </h1>
          <h1>
            <a style= {{textDecoration: "none", color: user.theme=== "dark"? "#ffc000": "#0062ff"}} href="#levelsSection" >المراحل</a>
          </h1>
          <h1>
            <a style= {{textDecoration: "none", color: user.theme=== "dark"? "#ffc000": "#0062ff"}} href="#qstsSection" >الأسئلة</a>
          </h1>
        </div>
        <ol type='1'>
          <div id="scoresSection" style= {{paddingTop: "10vh"}}>
          <h1><li>إحصائيات النتائج في المراحل:</li></h1>
          <div className="" style= {{width: "70%", margin: "auto"}}>
            {chartReady ?<><BarChart chartData=  {userScores} /> </>: <center><br /><div style= {{width: "100%", height: "15vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"}}>
              <RingLoader
                loading= {!chartReady}
                color= {"blue"}
                size= {50}
              /></div></center>
            }
          </div>
          </div>
          <div id="failsSection" style= {{paddingTop: "10vh"}}>
          <h1><li>إحصائيات التعثرات:</li></h1>
          <div className="" style= {{width: "70%", margin: "auto"}}>
            {chartReady ?<><BarChart chartData=  {userFails} /> </>: <center><br /><div style= {{width: "100%", height: "15vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"}}>
              <RingLoader
                loading= {!chartReady}
                color= {"blue"}
                size= {50}
              /></div></center>
            }
          </div>
          </div>
          <div id="levelsSection" style= {{paddingTop: "10vh"}}>
          <h1><li>قائمة المراحل المحفوظة:</li></h1>
          <div className="" style= {{width: "100%", minHeight: "50vh"}}>
            {
              displayLevels
            }
          </div>
          </div>
          <div id="qstsSection" style= {{paddingTop: "10vh"}}>
          <h1><li>قائمة الأسئلة المحفوظة:</li></h1>
          <div className="" style= {{width: "100%", minHeight: "50vh"}}>
            <div style={{width: "50%", height: "5vh", display: "flex", justifyContent: "space-evenly", alignItems: "center"}}>
              <div style= {{width: "30%", marginRight: "10px"}}>
                <Dropdown placeholder= "اختر عنوان المرحلة..." options= {types.map(e=> e.level)} onChange= {(event)=> {getQsts(event.value); console.log(typeof event.value)}} />
              </div>
              <input id= 'statFilterInput' placeholder='ابحث في جميع المراحل...' type="text" value={searchTerm} onClick= {()=> {getQsts("")}} onChange={e=> {setSearchTerm(e.target.value)}} />
            </div>
            <div style= {savedChild}>
              <h3 style= {{width: "10%", fontSize: "15px"}}>المرحلة</h3>
              <h3 style= {{width: "55%", fontSize: "15px"}}>السؤال</h3>
              <h3 style= {{width: "10%", fontSize: "15px"}}>الإجابة</h3>
              <div style={{width: "15%"}} ></div>
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
          </div>
        </ol>
        
    </div>
  )
}

export default Stat