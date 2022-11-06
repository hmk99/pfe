import {useState, useEffect} from 'react'
import Axios from 'axios'
import Button from '@mui/material/Button'
import { useSelector, useDispatch } from 'react-redux'
import Nav from '../component/Nav'
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion'
import '../styles/Param.css'
import RingLoader from 'react-spinners/RingLoader'

function Qutrub() {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [input, setInput]= useState("")
    const [verbs, setVerbs]= useState([])
    const [conjData, setConjData]= useState([])
    const [conjObj, setConjObj]= useState({})
    const [conjAll, setConjAll]= useState([])
    const [conjWrd, setConjWrd]= useState(null)
    const[conjWrdPr, setConjWrPr]= useState("")
    const [load, setLoad]= useState(false)
    const pronoms= ["أنا", "نحن", "أنت", "أنتِ", "أنتما", "أنتمامؤ", "أنتم", "أنتن", "هو", "هي", "هما", "همامؤ", "هم", "هن"]
    const tenses= [1, 2, 3, 4, 6, 8, 9]
    const corr= (s)=> {
        switch (s) {
            case "الماضي" || "ماضي":
            return 1
            break;
            case "المضارع" || "مضارع":
            return 2
            break;
            case "المجزوم" || "مجزوم":
            return 2
            break;
            case "المنصوب" || "منصوب":
            return 4
            break;
            case "الأمر":
            return 6
            break;
            default: return ""
        }
    }
    const corrInv= (n)=> {
        switch (n) {
          case 1:
            return "الماضي المعلوم"
            break;
          case 2:
            return "المضارع المعلوم"
            break;
          case 4:
            return "المضارع المنصوب"
            break;
          case 3:
            return "المضارع المجزوم"
            break;
          case 5:
            return "المضارع المؤكد الثقيل"
            break;
          case 6:
            return "الأمر"
            break;
          case 7:
            return "الأمر المؤكد"
            break;
          case 8:
            return "الماضي المبني للمجهول"
            break;
          case 9:
            return "المضارع المبني للمجهول"
            break;
          case 10:
            return "المضارع المجهول المجزوم"
            break;
          case 11:
            return "المضارع المجهول المنصوب"
            break;
          case 12:
            return "المضارع المؤكد الثقيل المجهول "
            break;
          default: return ""
        }
    }

    const getVerbs= ()=> {
        Axios.get('http://localhost:3030/getVerbs')
        .then(res=> {
          for (let i = 0; i < res.data.length; i++) {
            verbs.push(res.data[i].verb)
          }
        })
    }
    const dc= (array)=> {
        let arrayDc= []
        array.map(e=> {
          arrayDc.push(e.replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, ''))
        })
        return arrayDc
    }
    useEffect(()=> {
        getVerbs()
      }, [])
      const conj= (verb, temps, pronom)=> {
        console.log(`le verbe est: ${verb}, le temps est: ${temps}, le pronom est: ${pronom}`)
        var uri = `https://qutrub.arabeyes.org/api?verb=${verb}`
        var url = encodeURI(uri)
        Axios.get(url)
        .then((res)=> {
          setLoad(true)
          const data= res.data.result
          const array= Object.keys(data)
          Object.entries(data).map(([eid, e], index)=> {
            if(pronom> 0 && temps!== undefined){
              if(eid== pronom+ 1){
                setConjWrd(e[temps])
                setConjWrPr(pronoms[pronom])
              }
            }else if(pronom>= 0){
              if(eid== pronom+ 1){
                setConjObj(e)
              }
            }else if(temps!== undefined){
              setConjData(oldArray => [...oldArray, e[temps]])
            }else{
              setConjAll(data)
            }
          })
          setInput("")
          setTimeout(() => {
            setLoad(false)
        }, 500)
        })
        .catch(err=> {
            console.log(err)
        })
    }
    const convert= (word)=> {
        if(word!== ""){
          return word.split(" ")
        }else{
          return []
        }
    }
    const getConj= ()=> {
        setConjData([])
        setConjAll([])
        setConjObj({})
        setConjWrd(null)
        var verb, temps, pronom= ""
        if(input!== ""){
          convert(input).map(e=> {
            if((verbs.includes(e) || dc(verbs).includes(e)) && e!== "صرف" && e!== "أنت" && e!== "مع"&& e!== "هم"){
              verb= e
            }
            else if(tenses.includes(corr(e))){
              temps= corr(e)
            }else if(pronoms.includes(e)){
              pronom= e
            }
          })
          if(input.includes("الماضي المبني للمجهول" || "الماضي المجهول" || "مجهول الماضي")){
            temps= 8
          }
          if(input.includes("المضارع المبني للمجهول" || "المضارع المجهول" || "مجهول المضارع")){
            temps= 9
          }
          conj(verb, temps, pronoms.indexOf(pronom))
        }
    }

    const titleAll= (i)=> ({
      color: i===0 ? user.theme=== "light"? "#0062ff": "#ffc000":
      user.theme=== "light"? "black": "white"
    })
    const title= {
      color: user.theme=== "light"? "#0062ff": "#ffc000"
    }
    const verb= {
        color: user.theme=== "light" ? "black": "white"
    }
    const width= {
        width: "5%"
    }

    const display= conjData.map((e, i)=> {
        return(
          <motion.div layout animate= {{x: 0}} transition= {{duration: 0.5}} style= {{x: -1000}}> 
            <h3 style={title}>{pronoms[i- 1]}{i!== 0&& <>:</>}</h3> 
            {
              i===0 ?(
                <h4 style={title}>{e} :</h4>
              ): (
                <h4 style={verb}>{e}</h4>
              )
            }
          </motion.div>
        )
    })
      const displayObj= Object.entries(conjObj).map(([eid, e], i)=> {
        return(
          <motion.div layout animate= {{x: 0}} transition= {{duration: 0.5}} style= {{x: -1000}}> 
            <h3 style= {title}>{corrInv(i)}{i!== 0&& <>:</>}</h3> 
            {
              i===0 ?(
                <h4 style= {title}>{e} :</h4>
              ): (
                <h4 style= {verb}>{e}</h4>
              )
            }
          </motion.div>
        )
    })

    const displayAll= Object.values(conjAll).map((e, i)=> {
      return(
        <motion.div layout animate={{opacity: 1}} transition={{ duration: 0.5}} style= {{width: "100%", opacity: 0, display: 'flex', justifyContent: "space-evenly", alignItems: "center"}}>
          <h3 style= {{...title, width: "5%"}}>{e[0]}</h3>
          <h4 style= {{...titleAll(i), width: "10%"}}>{e[1]}</h4>
          <h4 style= {{...titleAll(i), width: "10%"}}>{e[2]}</h4>
          <h4 style= {{...titleAll(i), width: "10%"}}>{e[3]}</h4>
          <h4 style= {{...titleAll(i), width: "10%"}}>{e[4]}</h4>
          <h4 style= {{...titleAll(i), width: "10%"}}>{e[5]}</h4>
          <h4 style= {{...titleAll(i), width: "10%"}}>{e[6]}</h4>
          <h4 style= {{...titleAll(i), width: "10%"}}>{e[7]}</h4>
          <h4 style= {{...titleAll(i), width: "10%"}}>{e[8]}</h4>
          <h4 style= {{...titleAll(i), width: "10%"}}>{e[9]}</h4>
        </motion.div>
      )
    })

  return (
    <div style= {{width: "100%", minHeight: "100vh"}}>
        <Nav />
        <br />
        <center><h1 style= {{marginTop: "10vh"}}>ما هو قطرب ؟</h1></center>
        <p style= {{margin: "10px"}}>
            برنامج قطرب لتصريف الأفعال العربية، في الأزمنة ويسندها إلى الضمائر.
            قطرب برنامج مفتوح المصدر، يوفّر للمستخدم استعمالا مجانيا، في شكل موقع وب، وبرنامج لسطح المكتب. <a href="https://qutrub.arabeyes.org/" style= {{color: "#0062ff"}}>اقرأ المزيد...</a>
        </p>
        <br />
        <center>
            <h4>اسأل <span style= {{fontStyle: "italic"}}>قطرب</span> بالصيغة التي تريدها، مع ذكر الفعل و الضمير أو الزمن أو كلاهما، مثال: "صرف لي الفعل خرج في الماضي مع هم" أو "صرف الفعل خرج "...</h4>
            <form action="" onSubmit= {(e)=> {e.preventDefault(); getConj()}} style= {{width: "90%", height: "20vh", display: "flex", justifyContent: "space-evenly", alignItems: "center"}}>
                <input type="text" placeholder= 'بحث...' value= {input} onChange= {(e)=> {setInput(e.target.value)}} 
                style= {{
                height: "5vh", width: "80%"
                }}
                />
                <Button  variant="contained" onClick= {getConj}>بحث</Button>
            </form>
        </center>
        {load? (
          <center>
              <div style= {{width: "100%", height: "15vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"}}>
                  <RingLoader
                      loading= {load}
                      color= {"blue"}
                      size= {50}
                  />
                  <p>انتظروا قليلا، رجاء...</p>
              </div>
          </center>
        ):
        <>
        {
          conjWrd!== null && <motion.div animate={{x: 0}} transition= {{duration: 0.5}} style ={{x: -1000}} ><center><h1 style= {title}>{conjWrdPr}: </h1><h2 style= {verb}>{conjWrd}</h2></center></motion.div>
        }
        {
          conjData.length> 0 &&(<div style= {{minHeight: "50vh", width: "100%", display: "flex", justifyContent: "space-evenly", alignItems: "center", flexWrap: "wrap", gap: "50px"}}>{display}</div>)
        }
        {
          Object.values(conjAll).length>0 && <div style= {{width: "100%", minHeight: "50vh", display: 'flex', justifyContent: "space-evenly", alignItems: "center", flexDirection: "column", flexWrap: "wrap"}}>
            
              {displayAll}
            
          </div>
        }
        {
          Object.values(conjObj).map.length> 0&& (<div className="" style= {{minHeight: "50vh", width: "100%", display: "flex", justifyContent: "space-evenly", alignItems: "center", flexWrap: "wrap", gap: "50px"}}>{displayObj}</div>)
        }
        </>
        }
    </div>
  )
}

export default Qutrub