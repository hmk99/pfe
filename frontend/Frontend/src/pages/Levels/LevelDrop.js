import {BrowserRouter as Router , Routes ,Route, Link, useParams, useNavigate} from 'react-router-dom'
import Axios from 'axios'
import '../../styles/Levels.css'
import logo from '../../images/logo.jpg'
import {useState, useEffect} from 'react'

import {GoogleLogin, GoogleLogout} from 'react-google-login'
import Button from '@mui/material/Button'
function Level2() {
  //Managment
  const navigate=useNavigate()
  const params= useParams()
  const id= params.id
  const level= params.level
  const clientId= "242502706628-okdg9gqun4g12usjbu5squvsvohl867s.apps.googleusercontent.com"
  const[user, setUser]= useState("")
  const[image, setImage]= useState("")
  //Prepa
  const verb1= "الصحيح"
  const verb2= "السالم"
  const[cours1, setCours1]= useState("") 
  const[cours2, setCours2]= useState("") 
  const[conj, setConj]= useState([])
  //Quizz
  const[qcms, setQcms]= useState([])
  const[quizReady, setQuizReady]= useState(false)
  const[quiz1, setQuiz1]= useState("")
  const[quiz2, setQuiz2]= useState("")
  const[quiz3, setQuiz3]= useState("")
  const[quiz4, setQuiz4]= useState("")
  const[quizRep, setQuizRep]= useState([])
  const[quizTry, setQuizTry]= useState(false)
  const[quizScore, setQuizScore]= useState(0)
  let quizzScoreNeg=0
  
  //Fill Blanks
  const[blanksDcPss, setBlanksDcPss]= useState([])
  const[blanksDcPre, setBlanksDcPre]= useState([])
  const[blanksDcImp, setBlanksDcImp]= useState([])
  const[fillDcPss1, setFillDcPss1]= useState("")
  const[fillDcPss2, setFillDcPss2]= useState("")
  const[fillDcPss3, setFillDcPss3]= useState("")
  const[fillDcPss4, setFillDcPss4]= useState("")
  const[fillDcPss5, setFillDcPss5]= useState("")
  const[fillDcPre1, setFillDcPre1]= useState("")
  const[fillDcPre2, setFillDcPre2]= useState("")
  const[fillDcPre3, setFillDcPre3]= useState("")
  const[fillDcPre4, setFillDcPre4]= useState("")
  const[fillDcPre5, setFillDcPre5]= useState("")
  const[fillDcImp1, setFillDcImp1]= useState("")
  const[fillDcImp2, setFillDcImp2]= useState("")
  const[fillDcImp3, setFillDcImp3]= useState("")
  const[fillDcImp4, setFillDcImp4]= useState("")
  const[fillDcImp5, setFillDcImp5]= useState("")
  let fillScore= 0
  let fillDcScore= 0
  const[fillTry, setFillTry]= useState(false)
  const[fillDcTry, setFillDcTry]= useState(false)
  const[fillDcReps, setFillDcReps]= useState([])
  const[fillReps, setFillReps]= useState([])

  const getUsername= ()=> {
    Axios.post("http://localhost:3030/getInfos", {id: id})
    .then((res)=> {
        setUser(res.data[0].name)
    })
  }
  const getImage= ()=> {
      Axios.post("http://localhost:3030/getInfos", {id: id})
      .then((res)=> {
          setImage(res.data[0].image)
      })
  }
  const getCours= ()=> {
    Axios.post("http://localhost:3030/getCours", {verb: verb1})
    .then((res)=> {
      setCours1(res.data[0].def)
    })
    Axios.post("http://localhost:3030/getCours", {verb: verb2})
    .then((res)=> {
      setCours2(res.data[0].def)
    })
  }
  const getConj= ()=> {
    Axios.post("http://localhost:3030/getConj", {verb: verb2})
    .then((res)=> {
      setConj(res.data)
    })
  }
  const getQcm= ()=> {
    Axios.post("http://localhost:3030/getQcm", {verb: verb2})
    .then((res)=> {
      setQcms(res.data)
      setQuizReady(true)
    })
  }
  const getBlanks= (typeBlank, temps)=> {
    Axios.post("http://localhost:3030/getBlanks", {verb: verb2, typeBlank: typeBlank, temps: temps})
    .then((res)=> {
      if(typeBlank== 0){
        if(temps== 0){
          setBlanksDcPss(res.data)
        }else if(temps== 1){
          setBlanksDcPre(res.data)
        }else{
          setBlanksDcImp(res.data)
        }
      }
    })
  }
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

  useEffect(()=> {
    getImage()
    getUsername()
    getCours()
    getConj()
    getQcm()
    getBlanks(0, 0)
    getBlanks(0, 1)
    getBlanks(0, 2)
    getFillReps(0)
    getFillReps(1)
  }, [])
  const displayConj= conj.map((e)=> {
    return(
      <div>
        <li>{e.elem}</li>
      </div>
    ) 
  })

  const displayQcms= qcms.map((e)=> {
    return(
      <div className="qte">
        <h3>{e.qte}</h3>
        <div className="alloptions">
          <div className={`op${e.id}`} onClick={()=> {eval(`setQuiz${e.id}`)(e.op1)}}><p>{e.op1}</p></div>
          <div className={`op${e.id}`} onClick={()=> {eval(`setQuiz${e.id}`)(e.op2)}}><p>{e.op2}</p></div>
          <div className={`op${e.id}`} onClick={()=> {eval(`setQuiz${e.id}`)(e.op3)}}><p>{e.op3}</p></div>
          <div className={`op${e.id}`} onClick={()=> {eval(`setQuiz${e.id}`)(e.op4)}}><p>{e.op4}</p></div>
        </div>
      </div>
    )
  })

  const quizEval= ()=> {
    if(quizReady){
      const ops= document.querySelectorAll('.alloptions div')
      ops.forEach(e=> {
        if(e.style.backgroundColor=== "black"){
            quizzScoreNeg++
        }
      })
      setQuizTry(true)
    }
  }
  const quizzCorr= ()=> {
    const op1= document.querySelectorAll('.op1')
    const op2= document.querySelectorAll('.op2')
    const op3= document.querySelectorAll('.op3')
    const op4= document.querySelectorAll('.op4')
    if(quiz1!=="" && quiz2!=="" && quiz3!=="" && quiz4!=="" && !quizTry)
    {
      op1.forEach(e=> {
          if(e.innerText=== qcms[0].rep){
              e.style.backgroundColor= "green"
              e.style.color= "white"
          }
      })
      op2.forEach(e=> {
          if(e.innerText=== qcms[1].rep){
              e.style.backgroundColor= "green"
              e.style.color= "white"
          }
      })
      op3.forEach(e=> {
          if(e.innerText=== qcms[2].rep){
              e.style.backgroundColor= "green"
              e.style.color= "white"
          }
      })
      op4.forEach(e=> {
          if(e.innerText=== qcms[3].rep){
              e.style.backgroundColor= "green"
              e.style.color= "white"
          }
      })
      quizEval()
    }
  }
  
  const displayDcPss= blanksDcPss.map((e, index)=> {
    return(
      <>
        <li>
          {e.qte}
          <input type="text" id='blankDc' value={eval(`fillDcPss${index + 1}`)} onChange={e=> {eval(`setFillDcPss${index + 1}`)(e.target.value)}} />
        </li>
      </>
    )
  })
  const displayDcPre= blanksDcPre.map((e, index)=> {
    return(
      <>
        <li>
          {e.qte}
          <input type="text" id='blankDc' value={eval(`fillDcPre${index + 1}`)} onChange={e=> {eval(`setFillDcPre${index + 1}`)(e.target.value)}} />
        </li>
      </>
    )
  })
  const displayDcImp= blanksDcImp.map((e, index)=> {
    return(
      <>
        <li>
          {e.qte}
          <input type="text" id='blankDc' value={eval(`fillDcImp${index + 1}`)} onChange={e=> {eval(`setFillDcImp${index + 1}`)(e.target.value)}}/>
        </li>
      </>
    )
  })
  const fillScoreCalc= (type)=> {
    const blanks= document.querySelectorAll(`#blank${type}`)
    blanks.forEach(e=> {
        if(e.style.backgroundColor=== "green"){
          if(type== "Dc"){
            fillDcScore++
          }
        }
    })
    console.log(fillDcScore)
    setFillDcTry(true)
  }
  const fillCorr= (type)=> {
    const inputs= document.querySelectorAll(`#blank${type}`)
    if(type== "Dc"){
      if(fillDcPss1!== "" && fillDcPss2!== "" && fillDcPss3!== "" && fillDcPss4!== "" && !fillDcTry && fillDcPre1!== "" && fillDcPre2!== "" && fillDcPre3!== "" && fillDcPre4!== ""){
        for (let i = 0; i < 4; i++) {
          if(eval(`fillDcPss${i+1}`)=== fillDcReps[i].rep){
            inputs[i].style.backgroundColor= "green"
            inputs[i].style.color= "white"
          }else{
            inputs[i].style.backgroundColor= "red"
            inputs[i].style.color= "white"
          }
        }
        for (let i = 4; i < 8; i++) {
          if(eval(`fillDcPre${i-3}`)=== fillDcReps[i].rep){
            inputs[i].style.backgroundColor= "green"
            inputs[i].style.color= "white"
          }else{
            inputs[i].style.backgroundColor= "red"
            inputs[i].style.color= "white"
          }
        }
        for (let i = 8; i < 12; i++) {
          if(eval(`fillDcImp${i-7}`)=== fillDcReps[i].rep){
            inputs[i].style.backgroundColor= "green"
            inputs[i].style.color= "white"
          }else{
            inputs[i].style.backgroundColor= "red"
            inputs[i].style.color= "white"
          }
        }
        fillScoreCalc("Dc")
      }
    }    
  }

  //VANILLA JS
  useEffect(()=> {
    const op1= document.querySelectorAll('.op1')
    const op2= document.querySelectorAll('.op2')
    const op3= document.querySelectorAll('.op3')
    const op4= document.querySelectorAll('.op4')
      for (let i = 0; i < op1.length; i++) {
        op1[i].addEventListener('click', ()=> {
          op1.forEach(e=> {
              e.style.backgroundColor= "white"
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
        op3[i].addEventListener('click', ()=> {
            op3.forEach(e=> {
                e.style.backgroundColor= "white"
                e.style.color= "black"
            })
            op3[i].style.backgroundColor= "black"
            op3[i].style.color= "white"
          })
        op4[i].addEventListener('click', ()=> {
            op4.forEach(e=> {
                e.style.backgroundColor= "white"
                e.style.color= "black"
            })
            op4[i].style.backgroundColor= "black"
            op4[i].style.color= "white"
          })
      }
  }, [quizReady])
  const dropDown= ()=> {
    const down= document.querySelector('.dropDown')
    down.classList.toggle('dropAnim')
  }
  const logOut= ()=> {
    localStorage.setItem("user", JSON.stringify({user: false, id: "", level: 1}))
    navigate("/")
  }

  return (
    <div className="Level2">
      <nav>
        {
          (user && image) ?
          <div className='userInfos'>
              <h1 id='userName'>
                  {user}
              </h1>
              <img id='imgProfile' src= {image} alt="" onClick={dropDown}/>
          </div>
          : null
        }
        <img id="logo" src={logo} alt="" />
      </nav>
      <div className="dropDown">
        <li>الرئيسية</li>
        <li>حسابي</li>
        <li>الإعدادات</li>
        <GoogleLogout
          className= "logOut"
          clientId={clientId}
          buttonText="تسجيل الخروج"
          onLogoutSuccess={logOut}
        />
      </div>
      <br /><br /><br /><br />
      <h1>
        الدرس
      </h1>
      <ol type='I'>
        <li id= "titleFir">
          تعريف الفعل الصحيح
        </li>
        <p>
          {cours1}
        </p>
        <br />
        <li id='titleFir'>
          تعريف الفعل السالم  
        </li>
        <p>
          {cours2}
        </p>
        <li id='titleFir'>
          تصريفه:
        </li>
          <ol type= "1">
            {displayConj}
          </ol>
      </ol>
      <br />
      <br />
      <h1>
        التمارين:
      </h1>
      <br />
      <ol type= "I">
        <li id='titleFir'>
          اختيار الجواب الصحيح  
        </li>
        <br />
        <div className="quiz">
          {displayQcms}
        </div>
        <center>
          <Button id='btn' variant="contained" onClick={quizzCorr}>
            تأكيد
          </Button>
        </center>
        <br />
        <li id='titleFir'>
          ضع التشكيل المناسب  
        </li>
        <p>
          دون الأخد بعين الإعتبار السكون.
        </p>
        <ol>
          <li id='titleSec'>
            في الماضي:
          </li>
          <div className="blanks">
            <ol className="noIndentList">
              {displayDcPss}
            </ol>
          </div>
          <li id='titleSec'>
            في المضارع:
          </li>
          <div className="blanks">
            <ol className="noIndentList">
              {displayDcPre}
            </ol>
          </div>
          <li id='titleSec'>
            في الأمر:
          </li>
          <div className="blanks">
            <ol className="noIndentList">
              {displayDcImp}
            </ol>
            <br />
            <Button id='btn' variant="contained" onClick= {()=> {fillCorr("Dc")}}>
              تأكيد
            </Button>
          </div>
        </ol>
      </ol>

    </div>
  )
  }
  
  export default Level2;