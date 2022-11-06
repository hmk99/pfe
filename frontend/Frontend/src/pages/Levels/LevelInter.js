import {BrowserRouter as Router , Routes ,Route, Link, useParams, useNavigate} from 'react-router-dom'
import Axios from 'axios'
import '../../styles/Levels.css'
import logo from '../../images/logo.jpg'
import userLogo from '../../images/user.png'
import {useState, useEffect} from 'react'
import {GoogleLogin, GoogleLogout} from 'react-google-login'
import Button from '@mui/material/Button'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, setScore, setTheme } from '../../Reducer'
import Dnd from './Dnd'
import ReactSwitch from "react-switch"
import Nav from '../../component/Nav'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'
import DarkModeToggle from "react-dark-mode-toggle"
import { useAlert } from 'react-alert'
import Modal from 'react-modal'
import TextareaAutosize from '@mui/material/TextareaAutosize'

function LevelInter({id, level}) {
    //PREPA USER DATA
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const navigate=useNavigate()
    const params= useParams()
    const levelUser= params.level
    const clientId= "242502706628-okdg9gqun4g12usjbu5squvsvohl867s.apps.googleusercontent.com"
    const[userData, setUserData]= useState({})
    const url= "http://localhost:3030"
    const alert = useAlert()
    //COURS RULES
    const [salim, setSalim]= useState("")
    const [weak, setWeak]= useState("")
    const [title, setTitle]= useState("")
    const [SWReady, setSWReady]= useState(false)
    const[cours, setCours]= useState([])
    const[conjs, setConjs]= useState([])

    //QUIZZ
    const[qcms, setQcms]= useState([])
    const[qcmsStat, setQcmsStat]= useState([])
    const[quizReady, setQuizReady]= useState(false)
    const[quizStatReady, setQuizStatReady]= useState(false)
    const[quizz, setQuizz]= useState({q1: "", q2: "", q3: ""/*, q4: "", q5: "", q6: "", q7: "", q8: "", q9: "", q10: ""*/})
    const[quizReps, setQuizReps]= useState([])
    const[quizTry, setQuizTry]= useState(false)
    const[quizScore, setQuizScore]= useState(null)
    let quizzScoreNeg= 0
    //Fill Blanks
    const[blankPss, setBlankPss]= useState({q1: "", q2: "", q3: "", q4: "", q5: ""})
    const[blankPre, setBlankPre]= useState({q1: "", q2: "", q3: "", q4: "", q5: ""})
    const[blankImp, setBlankImp]= useState({q1: "", q2: "", q3: "", q4: "", q5: ""})
    const[blankMj, setBlankMj]= useState({q1: "", q2: "", q3: "", q4: "", q5: ""})
    const[blankMn, setBlankMn]= useState({q1: "", q2: "", q3: "", q4: "", q5: ""})
    const[blankPp, setBlankPp]= useState({q1: "", q2: "", q3: "", q4: "", q5: ""})
    const[blankPr, setBlankPr]= useState({q1: "", q2: "", q3: "", q4: "", q5: ""})
    const[blanksPss, setBlanksPss]= useState([])
    const[blanksPre, setBlanksPre]= useState([])
    const[blanksImp, setBlanksImp]= useState([])
    const[blanksPp, setBlanksPp]= useState([])
    const[blanksMan, setBlanksMan]= useState([])
    const[blanksMaj, setBlanksMaj]= useState([])
    const[blanksPr, setBlanksPr]= useState([])
    const[fillScore, setFillScore]= useState(null)
    const[fillTry, setFillTry]= useState(false)
    const[fillReps, setFillReps]= useState([])
    const [noteOpen, setNoteOpen]= useState(false) 
    const [note, setNote]= useState("") 
    const [rating, setRating]= useState("") 
    const [savedLevel, setSavedLevel]= useState(false)
    const [fillRepsReady, setFillRepsReady]= useState(false)
    const nbQuizz= 3
    const nbFills= 7
    const [wait, setWait]= useState(false)
    const getSW= ()=> {
      Axios.post(`${url}/getSW`, {level: level})
      .then((res)=> {
        setSalim(res.data[0].salim)
        setWeak(res.data[0].weak)
        setTitle(res.data[0].title)
        setSWReady(true)
      })
    }
    const sendNote= (rating, note)=> {
        Axios.post(`${url}/sendNote`, {userId: user.id, level: level, rating: rating, note: note})
        .then(res=> {
          alert.success("لقد تم إرسال ملاحظاتك بنجاح، شكرا جزيلا")
          setNote("")
        })
    }
    
    const getCours= ()=> {
        Axios.post(`${url}/getCours`, {level: level})
        .then((res)=> {
          if(res.data.length> 0){
            for (let i = 0; i < res.data.length; i++) {
              cours.push(res.data[i].def)
            }
          }
        })
    }
    
    const getConj= ()=> {
        Axios.post(`${url}/getConj`, {level: level})
        .then((res)=> {
          if(res.data.length> 0){
            setConjs(res.data)
          }
        })
    }
    
    const getQcms= ()=> {
      if(level!== "0"){
        Axios.post(`${url}/getQcms`, {salim: salim, weak: weak})
        .then((res)=> {
          if(res.data.length> 0){
            setQcms(res.data)
            for (let i = 0; i < res.data.length; i++) {
              quizReps.push(res.data[i].rep)
            }
            setQuizReady(true)
          }
        })
      }
    }
    const getQcmsStat= ()=> {
      Axios.post(`${url}/getQcmsStat`, {level: level})
      .then((res)=> {
        if(res.data.length> 0){
          setQcmsStat(res.data)
          for (let i = 0; i < res.data.length; i++) {
            quizReps.push(res.data[i].rep)
          }
          setQuizReady(true)
        }
      })
    }

    const pssChange= (e)=> {
      setBlankPss({...blankPss, [e.target.name]: e.target.value})
    }
    const preChange= (e)=> {
      setBlankPre({...blankPre, [e.target.name]: e.target.value})
    }
    const impChange= (e)=> {
      setBlankImp({...blankImp, [e.target.name]: e.target.value})
    }
    const mjChange= (e)=> {
      setBlankMj({...blankMj, [e.target.name]: e.target.value})
    }
    const mnChange= (e)=> {
      setBlankMn({...blankMn, [e.target.name]: e.target.value})
    }
    const ppChange= (e)=> {
      setBlankPp({...blankPp, [e.target.name]: e.target.value})
    }
    const prChange= (e)=> {
      setBlankPr({...blankPr, [e.target.name]: e.target.value})
    }

    const getBlanks= (temps)=> {
      Axios.post(`${url}/getBlanks`, {salim: salim, weak: weak, temps: temps})
      .then((res)=> {
        if(temps== 1){
          setBlanksPss(res.data)
 
        }else if(temps== 2){
          setBlanksPre(res.data)
  
        }else if(temps== 3){
          setBlanksMaj(res.data)
         
        }else if(temps== 4){
          setBlanksMan(res.data)
 
        }else if(temps== 6){
          //console.log(res.data)
          setBlanksImp(res.data)
  
        }else if(temps== 8){
          setBlanksPp(res.data)
  
        }else{
          setBlanksPr(res.data)
          
        }
        for (let i = 0; i < res.data.length; i++) {
          setFillReps(prv=> [...prv, res.data[i].rep])
        }
      })
      .catch(err=> {
        console.log(err)
      })
    }
    useEffect(()=> {
      console.log(fillReps)
    }, [fillReps])
    /*
    const getFillReps= (type)=>{
        Axios.post("http://localhost:3030/getFillReps", {type: type})
        .then((res)=> {
          if(type== 0){
            setFillDcReps(res.data)
          }
          else if(type== 1){
            setFillReps(res.data)
          }
        })
    }
    */
    useEffect(()=> {
      getSW()
      dispatch(setScore({score: null}))
    }, [])
    useEffect(()=> {
      if(SWReady){
        getCours()
        getConj()
        getQcms()
        getQcmsStat()
        getBlanks(1)
        getBlanks(2)
        getBlanks(3)
        getBlanks(4)
        getBlanks(6)
        getBlanks(8)
        getBlanks(9)
      }
        /*
        getQcm()
        getBlanks(0, 0)
        getBlanks(0, 1)
        getBlanks(0, 2)
        getFillReps(0)
        getFillReps(1)
        */
    }, [SWReady])
    const displayConj= conjs.map((e)=> {
        return(
          <div>
            <li>{e.elem}</li>
          </div>
        ) 
    })
    const[qstSave, setQstSave]= useState(true)
    const saveQst= (qstId)=> {
      if(quizTry && fillTry){
        Axios.post(`${url}/addSavedQst`, {userId: user.id, level: level, qstId: qstId})
        .then(res=> {
          setQstSave(!qstSave)
        })
        .catch(err=> {
          console.log(err)
        })
      }
    }
    useEffect(()=> {
      const saves= document.querySelectorAll('#saveBtn')
      if(quizScore && fillScore){
        saves.forEach(e=> {
          e.addEventListener('click', ()=> {
            if(user.theme=== "light"){
              e.style.color= "black"
            }else{
              e.style.color= "#ffc000"
            }
          })
        })
      }
    }, [quizScore, fillScore])
    const displayQcms= qcms.map((e)=> {
        return(
          <div className="qte">
            <h3>{e.pronom} ({e.qst}) 
              {
                (e.temps== 1) ?(
                  <>
                  في الماضي
                  </>
                ): (e.temps== 2) ?(
                  <>
                  في المضارع
                  </>
                ): (e.temps== 3) ?(
                  <>
                  في المضارع المجزوم
                  </>
                ): (e.temps== 4) ?( 
                  <>
                  في المضارع المنصوب
                  </>
                ): (e.temps== 6) ?(
                  <>
                  في الأمر
                  </>
                ): (e.temps== 8) ?(
                  <>
                  في الماضي المجهول
                  </>
                ): (
                  <>
                  في المضارع المجهول
                  </>
                )
              }
            </h3>
            <div className="alloptions" style= {{position: "relative"}}>
              <BookmarkAddIcon id= "saveBtn" onClick= {()=> {saveQst(e.id)}} style= {{position: "absolute", top: "0", right: "0", cursor: "pointer",color: "gray"}} />
              <div className={`op${e.row}`} onClick={()=> { eval(`setQuizz({...quizz, q${e.row} : e.op1})`) }}><p>{e.op1}</p></div>
              <div className={`op${e.row}`} onClick={()=> { eval(`setQuizz({...quizz, q${e.row} : e.op2})`) }}><p>{e.op2}</p></div>
              <div className={`op${e.row}`} onClick={()=> { eval(`setQuizz({...quizz, q${e.row} : e.op3})`) }}><p>{e.op3}</p></div>
              <div className={`op${e.row}`} onClick={()=> { eval(`setQuizz({...quizz, q${e.row} : e.op4})`) }}><p>{e.op4}</p></div>
            </div>
          </div>
        )
    })

    const displayStat= qcmsStat.map((e)=> {
      return(
        <div className='qte'> 
          <h3>
            {e.qte}
          </h3>
          <div className="alloptions">
              <div className={`op${e.row}`} onClick={()=> { eval(`setQuizz({...quizz, q${e.row} : e.op1})`) }}><p>{e.op1}</p></div>
              <div className={`op${e.row}`} onClick={()=> { eval(`setQuizz({...quizz, q${e.row} : e.op2})`) }}><p>{e.op2}</p></div>
              <div className={`op${e.row}`} onClick={()=> { eval(`setQuizz({...quizz, q${e.row} : e.op3})`) }}><p>{e.op3}</p></div>
              <div className={`op${e.row}`} onClick={()=> { eval(`setQuizz({...quizz, q${e.row} : e.op4})`) }}><p>{e.op4}</p></div>
          </div>
        </div>
      )
    })

    const displayPss= blanksPss.map((e, index)=> {
        return(
          <>
            <li style= {{minWidth: "50%"}}>
              <p>{e.pronom}</p>
              <p>({e.qst})</p>
              <input type="text" id='blank' name= {`q${index+ 1}`} value={eval(`blankPss.q${index + 1}`)} onChange= {pssChange} />
              <BookmarkAddIcon id= "saveBtn" onClick= {()=> {saveQst(e.id)}} style= {{cursor: "pointer",color: "gray"}} />
            </li>
          </>
        )
    })
    const displayPre= blanksPre.map((e, index)=> {
    return(
        <>
        <li>
            <p>{e.pronom}</p>
            <p>({e.qst})</p>
            <input type="text" id='blank' name= {`q${index+ 1}`} value={eval(`blankPre.q${index + 1}`)} onChange= {preChange} />
            <BookmarkAddIcon id= "saveBtn" onClick= {()=> {saveQst(e.id)}} style= {{cursor: "pointer",color: "gray"}} />
        </li>
        </>
    )
    })
    const displayMj= blanksMaj.map((e, index)=> {
      return(
          <>
          <li>
              <p>{e.pronom}</p>
              <p>({e.qst})</p>
              <input type="text" id='blank' name= {`q${index+ 1}`} value={eval(`blankMj.q${index + 1}`)} onChange= {mjChange}/>
              <BookmarkAddIcon id= "saveBtn" onClick= {()=> {saveQst(e.id)}} style= {{cursor: "pointer",color: "gray"}} />
          </li>
          </>
      )
    })
    const displayMn= blanksMan.map((e, index)=> {
      return(
          <>
          <li>
              <p>{e.pronom}</p>
              <p>({e.qst})</p>
              <input type="text" id='blank' name= {`q${index+ 1}`} value={eval(`blankMn.q${index + 1}`)} onChange= {mnChange}/>
              <BookmarkAddIcon id= "saveBtn" onClick= {()=> {saveQst(e.id)}} style= {{cursor: "pointer",color: "gray"}} />
          </li>
          </>
      )
    })
    const displayImp= blanksImp.map((e, index)=> {
      return(
          <>
          <li>
              <p>{e.pronom}</p>
              <p>({e.qst})</p>
              <input type="text" id='blank' name= {`q${index+ 1}`} value={eval(`blankImp.q${index + 1}`)} onChange= {impChange}/>
              <BookmarkAddIcon id= "saveBtn" onClick= {()=> {saveQst(e.id)}} style= {{cursor: "pointer",color: "gray"}} />
          </li>
          </>
      )
    })
    
    const displayPp= blanksPp.map((e, index)=> {
    return(
        <>
        <li>
            <p>{e.pronom}</p>
            <p>({e.qst})</p>
            <input type="text" id='blank' name= {`q${index+ 1}`} value={eval(`blankPp.q${index + 1}`)} onChange= {ppChange}/>
            <BookmarkAddIcon id= "saveBtn" onClick= {()=> {saveQst(e.id)}} style= {{cursor: "pointer",color: "gray"}} />
        </li>
        </>
    )
    })
    const displayPr= blanksPr.map((e, index)=> {
    return(
        <>
        <li>
            <p>{e.pronom}</p>
            <p>({e.qst})</p>
            <input type="text" id='blank' name= {`q${index+ 1}`} value={eval(`blankPr.q${index + 1}`)} onChange= {prChange}/>
            <BookmarkAddIcon id= "saveBtn" onClick= {()=> {saveQst(e.id)}} style= {{cursor: "pointer",color: "gray"}} />
        </li>
        </>
    )
    })
    const getStats= ()=> {
      Axios.post(`${url}/getUserStats`, {id: user.id})
      .then(res=> {
        for (let i = 0; i < res.data.length; i++) {
          if(res.data[i].level== level){
            setSavedLevel(res.data[i].saved)
          }
        }
      })
      .catch(err=> {
        console.log(err)
      })
    }
    const saveLevel= ()=> {
      Axios.post(`${url}/saveLevel`, {id: user.id, level: level})
      .then(res=> {
        setSavedLevel(prv=> !prv)
      })
    }
    useEffect(()=> {
      getStats()
    }, [])

    //EVALUATION

    const quizEval= ()=> {
      let score= 0
      if(quizReady){
        const ops= document.querySelectorAll('.alloptions div')
        ops.forEach(e=> {
          if(e.style.backgroundColor=== "black"){
              score++
          }
        }) 
        setQuizScore((((nbQuizz- score)/ nbQuizz)* 100).toFixed(2))
        console.log((((nbQuizz- score)/ nbQuizz)* 100).toFixed(2))
        setQuizTry(true)
      }
    }
    const empty= (obj)=> {
      let s=0
      Object.entries(obj).map(([eid, e])=> {
        if(e!== ""){
          s++
        }
      })
      if(Object.entries(obj).length== s){
        return true
      }else{
        return false
      }
    }
    
    const quizzCorr= ()=> {
      if( empty(quizz) && !quizTry){
        let y= []
        let items= []
        const ops= document.querySelectorAll('.alloptions div')
        for (let i = 0; i < nbQuizz; i++) {
          for (let j = i* 4; j < ((i * 4)+ 4); j++) {
            items.push(ops[j])    
          }
          y.push({
            op: `op${i+ 1}`,
            items: items
          })
          items= []
        }
        y.map((e, i)=> {
          e.items.map(ee=> { 
            if(ee.innerText=== quizReps[i]){
              ee.style.backgroundColor= "#228b22"
              ee.style.color= "white" 
            }
          })
        })
        quizEval()
      }
    }

    const fillScoreCalc= ()=> {
      let score= 0
      const blanks= document.querySelectorAll('#blank')
      blanks.forEach(e=> {
        console.log(e.style.backgroundColor)
        if(e.style.backgroundColor=== "rgb(34, 139, 34)"){
          score++
        }
      })
      console.log(score)
      setFillScore(((score/ nbFills)* 100).toFixed(2))
      console.log(((score / nbFills)* 100).toFixed(2))
      setFillTry(true)
    }
    const verbDC= (verb)=> {
      return verb.replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, '')
    }
    const objEmpty= (obj, n)=> {
      let nb=0
      Object.values(obj).map(e=> {
          if(e!== ""){
              nb++
          }
      })
      return (nb=== n)
  }
    const fillCorr= ()=> {
        const inputs= document.querySelectorAll('#blank')
          if(!fillTry && (objEmpty(blankPss, 1)) && (objEmpty(blankPre, 1)) && (objEmpty(blankImp, 1)) && (objEmpty(blankMj, 1)) && (objEmpty(blankMn, 1)) && (objEmpty(blankPp, 1)) && (objEmpty(blankPr, 1)) ){
            for (let i = 0; i < 1/*5*/; i++) {
              if(eval(`blankPss.q${i+1}`)=== fillReps[i]){
                inputs[i].style.backgroundColor= "#228b22"
                inputs[i].style.color= "white"
              }else{
                inputs[i].style.backgroundColor= "#dc143c"
                inputs[i].style.color= "white"
              }
            }
            for (let i = 1; i < 2/*10*/; i++) {
              if(eval(`blankPre.q${i /*-4*/}`)=== fillReps[i]){
                inputs[i].style.backgroundColor= "#228b22"
                inputs[i].style.color= "white"
              }else{
                inputs[i].style.backgroundColor= "#dc143c"
                inputs[i].style.color= "white"
              }
            }
            for (let i = 2; i < 3/*15*/; i++) {
              if(eval(`blankMj.q${i-1/*9*/}`)=== fillReps[i]){
                inputs[i].style.backgroundColor= "#228b22"
                inputs[i].style.color= "white"
              }else{
                inputs[i].style.backgroundColor= "#dc143c"
                inputs[i].style.color= "white"
              }
            }
            for (let i = 3; i < 4/*20*/; i++) {
              if(eval(`blankMn.q${i-2/*14*/}`)=== fillReps[i]){
                inputs[i].style.backgroundColor= "#228b22"
                inputs[i].style.color= "white"
              }else{
                inputs[i].style.backgroundColor= "#dc143c"
                inputs[i].style.color= "white"
              }
            }
            for (let i = 4; i < 5/*25*/; i++) {
              if(eval(`blankImp.q${i-3/*19*/}`)=== fillReps[i]){
                inputs[i].style.backgroundColor= "#228b22"
                inputs[i].style.color= "white"
              }else{
                inputs[i].style.backgroundColor= "#dc143c"
                inputs[i].style.color= "white"
              }
            }
            for (let i = 5; i < 6/*30*/; i++) {
              if(eval(`blankPp.q${i-4/*24*/}`)=== fillReps[i]){
                inputs[i].style.backgroundColor= "#228b22"
                inputs[i].style.color= "white"
              }else{
                inputs[i].style.backgroundColor= "#dc143c"
                inputs[i].style.color= "white"
              }
            }
            for (let i = 6; i < 7/*35*/; i++) {
              if(eval(`blankPr.q${i-5/*29*/}`)=== fillReps[i]){
                inputs[i].style.backgroundColor= "#228b22"
                inputs[i].style.color= "white"
              }else{
                inputs[i].style.backgroundColor= "#dc143c"
                inputs[i].style.color= "white"
              }
            }
            fillScoreCalc()
          }  
    }
    useEffect(()=> {
      if((quizTry && user.score && fillTry) || (level== 0 && quizTry)){
        let userScore= user.score
        let quizTotal= 0
        if(level== 0){
          quizTotal= quizScore
        }else{
          quizTotal= ((parseFloat(2* userScore) + parseFloat(2* quizScore) + parseFloat(fillScore))/ 5).toFixed(2)
        }
        if(user.level== level){
          if(quizTotal> 50){
            Axios.post(`${url}/statsUpdate`, {id: user.id, score: quizTotal, level: user.level, fail: false})
            dispatch(setUser({user: true, id: user.id, level: (parseInt(user.level)+ 1).toString()}))
            Axios.post(`${url}/levelUpdate`, {id: user.id})
            .then(res=> {
              if(quizTotal< 60){
                alert.success(`حسن، لقد مررت إلى المرحلة ${parseInt(level)+ 1} ، بمعدل: ${quizTotal} % 🎉`)
                //navigate(`/levels/${id}/${(parseInt(user.level)+ 1).toString()}`)
              }
              else if(quizTotal< 80){
                alert.success(`جيد، لقد مررت إلى المرحلة ${parseInt(level)+ 1}، بمعدل: ${quizTotal} % 🎉🎉`)
                //navigate(`/levels/${id}/${(parseInt(user.level)+ 1).toString()}`)
              }
              else{
                alert.success(`ممتاز، لقد مررت إلى المرحلة ${parseInt(level)+ 1}، بمعدل: ${quizTotal} % 🎉🎉🎇`)
                //navigate(`/levels/${id}/${(parseInt(user.level)+ 1).toString()}`)
              }
            })
            .catch(err=> {
              console.log(err)
            })
          }else{
            Axios.post(`${url}/statsUpdate`, {id: user.id, score: quizTotal, level: user.level, fail: true})
            alert.error(`معدلك هو: ${quizTotal} %، مع الأسف لقد فشلت في تجاوز هذه المرحلة، راجع أخطائك ثم حاول مرة أخرى 😔`)
          }
        }
        else{
          if(quizTotal< 50){
            Axios.post(`${url}/statsUpdate`, {id: user.id, score: quizTotal, level: level, fail: true})
          }else{
            Axios.post(`${url}/statsUpdate`, {id: user.id, score: quizTotal, level: level, fail: false})
          }
          alert.info(`معدلك هو: ${quizTotal} %`)
        }
        dispatch(setScore({score: null}))
        setQuizScore(0)
        setFillScore(0)
      }
    }, [quizTry, user.score, fillTry])

    

    //VANILLA JS
    useEffect(()=> {
      const op1= document.querySelectorAll('.op1')
      const op2= document.querySelectorAll('.op2')
      const op3= document.querySelectorAll('.op3')
      const op4= document.querySelectorAll('.op4')
      const op5= document.querySelectorAll('.op5')
      const op6= document.querySelectorAll('.op6')
      const op7= document.querySelectorAll('.op7')
      const op8= document.querySelectorAll('.op8')
      const op9= document.querySelectorAll('.op9')
      const op10= document.querySelectorAll('.op10')
      if(quizReady && !quizTry){
        //console.log(op1, op2, op3, op4, op5, op6, op7, op8, op9, op10)
        for (let i = 0; i < op1.length; i++) {
          op1[i].addEventListener('click', ()=> {
            op1.forEach(e=> {
                e.style.backgroundColor= "white" //
                e.style.color= "black"
            })
            op1[i].style.backgroundColor= "black"
            op1[i].style.color= "white"
          })
          op2[i].addEventListener('click', ()=> {
              op2.forEach(e=> {
                  e.style.backgroundColor= "white"
                  e.style.color= "black"
              })
              op2[i].style.backgroundColor= "black"
              op2[i].style.color= "white"
          })
          if(op3.length> 0){
          op3[i].addEventListener('click', ()=> {
              op3.forEach(e=> {
                  e.style.backgroundColor= "white"
                  e.style.color= "black"
              })
              op3[i].style.backgroundColor= "black"
              op3[i].style.color= "white"
          })
          }/*
          op4[i].addEventListener('click', ()=> {
              op4.forEach(e=> {
                  e.style.backgroundColor= "white"
                  e.style.color= "black"
              })
              op4[i].style.backgroundColor= "black"
              op4[i].style.color= "white"
          })
          op5[i].addEventListener('click', ()=> {
              op5.forEach(e=> {
                  e.style.backgroundColor= "white"
                  e.style.color= "black"
              })
              op5[i].style.backgroundColor= "black"
              op5[i].style.color= "white"
          })
          op9[i].addEventListener('click', ()=> {
              op9.forEach(e=> {
                  e.style.backgroundColor= "white"
                  e.style.color= "black"
              })
              op9[i].style.backgroundColor= "black"
              op9[i].style.color= "white"
          })
          op8[i].addEventListener('click', ()=> {
              op8.forEach(e=> {
                  e.style.backgroundColor= "white"
                  e.style.color= "black"
              })
              op8[i].style.backgroundColor= "black"
              op8[i].style.color= "white"
          })
          op7[i].addEventListener('click', ()=> {
              op7.forEach(e=> {
                  e.style.backgroundColor= "white"
                  e.style.color= "black"
              })
              op7[i].style.backgroundColor= "black"
              op7[i].style.color= "white"
          })
          op6[i].addEventListener('click', ()=> {
              op6.forEach(e=> {
                  e.style.backgroundColor= "white"
                  e.style.color= "black"
              })
              op6[i].style.backgroundColor= "black"
              op6[i].style.color= "white"
          })
          op10[i].addEventListener('click', ()=> {
              op10.forEach(e=> {
                  e.style.backgroundColor= "white"
                  e.style.color= "black"
              })
              op10[i].style.backgroundColor= "black"
              op10[i].style.color= "white"
          })*/
        }
      }
    }, [quizReady, quizTry, user.theme])
    
    return (
        <div className='LevelInter'>
            <Nav />
            <br /><br /><br /><br />
            <div className="" style= {{margin: "auto", width: "95%", minHeight: "10vh", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap"}}>
              <h1>المرحلة {level} : {title}</h1>
              <div className="switch" style= {{width: "max-content", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <h5>تسجيل المرحلة:</h5><span style= {{width: "5px"}}></span>
                <ReactSwitch onChange= {()=> {saveLevel(level)}} checked= {savedLevel} />
              </div>
              <Button variant='contained' style= {{width: "10%", minHeight: "40px", maxHeight: "40px"}} onClick= {()=> {setNoteOpen(true)}}>إرسال ملاحظات</Button>
              <Modal id='defModal' ariaHideApp={false} isOpen={noteOpen} onRequestClose={()=> setNoteOpen(false)}>
              <h4>إذا كانت لديك ملاحظات فيما يخص المرحلة {level}، ارسلها لنا من فضلك، شكرا</h4>
                <TextareaAutosize id='textArea' style= {{width: "90%", minHeight: "30%", overflow: "scroll"}} type="text" placeholder='ادخل ملاحظاتك' value= {note} onChange= {(e)=> {setNote(e.target.value)}} />
                <h4>ماهو تقييمك للمرحلة، من حيث سرد الدروس و طرح الأسئلة:</h4>
                <div className='ratingBtns' style= {{width: "60%", height: "10%", display: "flex", justifyContent: "space-evenly", alignItems: "center"}}>
                  <Button variant="contained" color="success" onClick= {()=> {setRating("جيد")}}>
                    جيد
                  </Button>
                  <Button variant="contained" onClick= {()=> {setRating("مقبول")}}>مقبول</Button>
                  <Button variant="contained" color="error" onClick= {()=> {setRating("سيئ")}}>
                    سيئ
                  </Button>
                </div>
                <br />
                <Button variant='contained' style= {{marginLeft: "10px"}} onClick= {()=> {sendNote(rating, note); setNoteOpen(false)}}>تأكيد الإرسال</Button>
              </Modal>
            </div>
            {
              (cours.length> 0) ? (
              <>
              <h1>الدرس</h1>
              <ol type='I'>
                {
                  (level== "0")? (
                    <>
                      <li id= "titleFir">تعريف الفعل ال{salim}</li>
                      {cours[0]}
                      <br /><br />
                      <li id= "titleFir">تعريف الفعل ال{weak}</li>
                      {cours[1]}
                    </>
                  ): (level=== "1" || level=== "2" || level=== "3") ? (
                    <>
                      <li id= "titleFir">تعريف الفعل ال{salim}</li>
                      {cours[0]}
                    </>
                  ): (
                    <>
                      <li id= "titleFir">تعريف الفعل ال{weak}</li>
                      {cours[0]}
                    </>
                  )
                }
                <br />
                {
                  (level!== "0") ?(
                    <>
                      <li id='titleFir'>
                          تصريفه:
                      </li>
                      <ol type= "1">
                          {displayConj}
                      </ol>
                    </>
                  ): null
                }
              </ol>
              <br /><br />
              </>
              ): null
            }
            <h1>التمارين</h1>
            {level!== "0" &&<div className="levelInterLinks" style= {{width: "100%", display: "flex", justifyContent: "space-evenly", alignItems: "center", flexWrap: "wrap"}}>
                  <h1>
                      <a href="#qcm" style= {{textDecoration: "none", color: user.theme=== "dark"? "#ffc000": "#0062ff"}} >اختيار الجواب الصحيح</a>     
                  </h1>
                  <h1>
                      <a style= {{textDecoration: "none", color: user.theme=== "dark"? "#ffc000": "#0062ff"}} href="#blanksSection" >اكمل الفراغ</a>
                  </h1>
                  <h1>
                      <a style= {{textDecoration: "none", color: user.theme=== "dark"? "#ffc000": "#0062ff"}} href="#dnd" >سحب الجواب الصحيح</a>
                  </h1>
              </div>}
              <p>يمكنك حفظ أي سؤال من أجل مراجعته لاحقا، في صفحة <span style= {{color: "red", fontWeight: "700"}}>"حسابي"، لكن بعد ظهور النتيجة</span></p>
            <br />
            <ol type='I'>
              <div id="qcm">
                <li id='titleFir'>
                    اختيار الجواب الصحيح  
                </li>
                <br />
                {
                  (level== "0") ? (
                    <div className="quiz">
                      {displayStat}
                    </div>
                  ): (
                    <div className="quiz">
                      {displayQcms}
                    </div>
                  )
                }
              </div>
              <br />
                <center>
                <Button id='btn' variant="contained" onClick={quizzCorr}>
                    تأكيد
                </Button>
                </center>
                <br />
                {
                  level!== "0" &&
                    <>
                    <div id='blanksSection'>
                      <li id='titleFir'>
                          صرف مايلي:  
                      </li>
                      <p>
                          دون الأخد بعين الإعتبار السكون.
                      </p>
                      <ol type='1'>
                          <li id='titleSec'>
                              في الماضي:
                          </li>
                          <div className="blanks">
                              <ol className="noIndentList">
                                  {displayPss}
                              </ol>
                          </div>
                          <li id='titleSec'>
                              في المضارع:
                          </li>
                          <div className="blanks">
                              <ol className="noIndentList">
                                  {displayPre}
                              </ol>
                          </div>
                          <li id='titleSec'>
                            في المضارع المجزوم:
                          </li>
                          <div className="blanks">
                              <ol className="noIndentList">
                                  {displayMj}
                              </ol>
                          </div>
                          <li id='titleSec'>
                            في المضارع المنصوب:
                          </li>
                          <div className="blanks">
                              <ol className="noIndentList">
                                  {displayMn}
                              </ol>
                          </div>
                          <li id='titleSec'>
                              في الأمر:
                          </li>
                          <div className="blanks">
                              <ol className="noIndentList">
                                  {displayImp}
                              </ol>
                          </div>
                          <li id='titleSec'>
                            في مجهول الماضي:
                          </li>
                          <div className="blanks">
                              <ol className="noIndentList">
                                  {displayPp}
                              </ol>
                          </div>
                          <li id='titleSec'>
                            في مجهول المضارع:
                          </li>
                          <div className="blanks">
                              <ol className="noIndentList">
                                  {displayPr}
                              </ol>
                          </div>
                          <Button id='btn' variant="contained" onClick= {fillCorr}>
                          تأكيد
                          </Button>
                      </ol>
                      </div>
                </>
                }
                <br />
                {level!== "0" && SWReady
                &&<div id="dnd">
                  <li id= "titleFir">اسحب الجواب الصحيح</li>
                  <p>قم بسحب جواب واحد فقط</p>
                  <Dnd salim= {salim} weak= {weak} level= {level} />
                </div>
                }
            </ol>
      
            
        </div>
    )
}

export default LevelInter;
