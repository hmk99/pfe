import {BrowserRouter as Router , Routes ,Route, Link, useParams, useNavigate} from 'react-router-dom'
import Axios from 'axios'
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
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'


function AdminCourse() {
    const dispatch = useDispatch()
    const theme = useSelector((state) => state.user.theme)
    const[cours, setCours]= useState([])
    const[types, setTypes]= useState([])
    const[rules, setRules]= useState([])
    const[pageNum,setPageNum]= useState(0)
    const[searchTerm, setSearchTerm]= useState("")
    const [defOpen, setDefOpen]= useState(false)
    const [defId, setDefId]= useState("")
    const [typeId, setTypeId]= useState("")
    const [conjOpen, setConjOpen]= useState(false)
    const [addConjOpen, setAddConjOpen]= useState(false)
    const [conjId, setConjId]= useState("")
    const [conjRule, setConjRule]= useState("")
    const [delId, setDelId]= useState("")
    const[delRuleOpen, setDelRuleOpen]= useState(false)
    const[delRule, setDelRule]= useState("")
    const[defType, setDefType]= useState("")
    var ls= []
    //VANILLA JS
    const[newDef, setNewDef]= useState("")
    const[newRule, setNewRule]= useState("")
    const[addNewRule, setAddNewRule]= useState("")
    
    const getAllCours= ()=> {
        Axios.get("http://localhost:3030/getAllCours")
        .then((res)=> {
            setCours(res.data)
        })
        .catch(err=> {
            console.log(err)
        })
    }
    const getTypes= ()=> {
        Axios.post("http://localhost:3030/getTypes", {all: true})
        .then((res)=> {
            setTypes(res.data)
        })
        .catch(err=> {
            console.log(err)
        })
    }
    const getRules= ()=> {
        Axios.get("http://localhost:3030/getAllConj")
        .then((res)=> {
            setDefOpen(false)
            setRules(res.data)
        })
        .catch(err=> {
            console.log(err)
        })
    }
    const updateVerbDef= (def, id)=> {
        Axios.post("http://localhost:3030/updateVerbDef", {def: def, id: id})
        .then((res)=> {
            getAllCours()
        })
        .catch(err=> {
            console.log(err)
        })
    }
    const getTypeId= (title)=> {
        Axios.post("http://localhost:3030/getTypeId", {title: title})
        .then(res=> {
            setTypeId(res.data[0].id)
        })
        .catch(err=> {
            console.log(err)
        })
    }
    const addRule= (typeId, elem)=> {
        Axios.post("http://localhost:3030/addRule", {typeId: typeId, elem: elem})
        .then((res)=> {
            getRules()
        })
        .catch(err=> {
            console.log(err)
        })
    }
    const updateRule= (elem, id)=> {
        Axios.post("http://localhost:3030/updateRule", {elem: elem, id: id})
        .then((res)=> {
            getRules()
        })
        .catch(err=> {
            console.log(err)
        })
    }
    const deleteRule= (id)=> {
        Axios.post("http://localhost:3030/deleteRule", {id: id})
        .then((res)=> {
            getRules()
        })
        .catch(err=> {
            console.log(err)
        })
    }
    useEffect(()=> {
        const inputAnim= document.querySelectorAll('.inputAnim')
        for (let i = 0; i < inputAnim.length; i++) {
            ls.push({value: inputAnim[i], anim: false})
        }
    }, [getRules])
    const modal= {
        content: {
            top: '50%', left: '50%', marginRight: '-50%',
            transform: 'translate(-50%, -50%)',position : "absolute", height: "20vh", width: "50%", background: "transarent",
            border: "1px black solid",
        }
    }
    
    
    const displayCours= cours.map((e, index)=> {
        return(
            <tr key={e.id} style= {{}}>
                <td id='title' style= {{color: theme=== "light"? "#0062ff": "#ffc000", fontWeight: "bolder"}}><center>{e.title}</center></td>
                <td id="tableDef"><center>{e.def}</center></td>
                <td id='tableChgCas'>
                    <div className="tableChg">
                        <Button id= "tableBtn" variant="contained" type='container' onClick={()=> {setDefOpen(true); setDefId(e.id); setDefType(e.title)}}>تغيير</Button>
                    </div>
                </td>
                
                <Modal 
                    id='defModal' ariaHideApp={false} isOpen={defOpen} onRequestClose={()=> setDefOpen(false)}>
                        <h3>تغيير تعريف <span style= {{color: "#0062ff", fontWeight: "bolder"}}> {defType} </span></h3>
                        <form style= {{height: "80%", width: "100%", display: "flex", justifyContent: "space-evenly", alignItems: "center", flexDirection: "column"}} >
                            <TextareaAutosize style= {{width: "90%", minHeight: "5vh"}} type="text" placeholder='ادخل التعريف الجديد' value= {newDef} onChange= {(e)=> {setNewDef(e.target.value)}} />
                            <Button id= "tableBtn" variant="contained" onClick={()=> {updateVerbDef(newDef, defId); setNewDef(""); setDefOpen(false)}}>تأكيد</Button>
                        </form>
                </Modal>
   
            </tr>
        )
    })
    const qstPerPage= 10
    const pageVis= pageNum * qstPerPage
    const pageCount = Math.ceil(rules.length / qstPerPage)
    const pageChange = ({selected})=>{
      setPageNum(selected)
    }
    const verbDC= (verb)=> {
        return verb.replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, '')
    }
    const saved= {
        width: "100%", minHeight: "15vh", display: "flex", flexDirection: "column", alignItems: "center",
        
    }
    const savedChild= {
        width: "100%", minHeight: "10vh", display: "flex", justifyContent: "space-between", alignItems: "center",
    }
    const displayRules= rules
    .filter((val)=> {
        if(searchTerm== ""){
            return val
        }else if( verbDC(val.title).includes(searchTerm) ){
            return val
        }
    })
    .slice(pageVis,pageVis + qstPerPage)
    .map((e)=> {
        return(
            <div style= {saved}>
                <motion.div style= {savedChild} layout animate={{opacity: 1}} initial={{opacity: 0}} exit={{opacity: 1}} >
                    <h3 id= "level" style= {{width: "10%", fontSize: "15px", color: theme=== "light"? "#0062ff": "#ffc000"}}>{e.level}</h3>
                    <h3 id= "title" style= {{width: "15%", fontSize: "15px", color: theme=== "light"? "#0062ff": "#ffc000"}}>{e.title}</h3>
                    <h3 style= {{width: "55%", fontSize: "15px"}}>{e.elem}</h3>
                    <div style= {{width: "15%", display: "flex", justifyContent: "space-evenly", flexWrap: "wrap", gap: "5px"}}>
                        <Button id= "updRuleBtn" variant='contained' onClick= {()=> {setConjOpen(true); setConjId(e.id); setConjRule(e.elem)}}>تغيير</Button>
                        <Button id= "delRuleBtn" variant="contained" color="error" onClick= {()=> {setDelRuleOpen(true); setDelId(e.id); setDelRule(e.elem)}}>حذف</Button>
                        <Modal id='defModal' ariaHideApp={false} isOpen={delRuleOpen} onRequestClose={()=>setDelRuleOpen(false)}>
                            <h3>هل تريد حقا حذف القاعدة</h3>
                            <p>" {delRule} "</p>
                            <Button variant="contained" color="error" onClick= {()=> {deleteRule(delId); setDelRuleOpen(false)}}>حذف</Button>
                        </Modal>
                    </div>
                </motion.div>
                <div className="line"></div>
                <Modal 
                    id='defModal' ariaHideApp={false} isOpen={conjOpen} onRequestClose={()=>setConjOpen(false)}>
                        <h3>هل تريد حقا تغيير القاعدة</h3>
                        <p>" {conjRule} "</p>
                        <form style= {{height: "80%", width: "100%", display: "flex", justifyContent: "space-evenly", alignItems: "center", flexDirection: "column"}} >
                            <TextareaAutosize style= {{width: "90%", minHeight: "5vh"}} type="text" placeholder='ادخل التعريف الجديد' value= {newRule} onChange= {(e)=> {setNewRule(e.target.value)}} />
                            <Button id= "tableBtn" variant="contained" onClick={()=> {updateRule(newRule, conjId); setNewRule(""); setConjOpen(false)}}>تأكيد</Button>
                        </form>
                </Modal>
          </div>
        )
    })
    useEffect(()=> {
        getAllCours()
        getTypes()
        getRules()
    }, [])
    useEffect(()=> {
        getTypeId("الفعل الصحيح السالم")
    }, [])

  return (
      <div className="AdminCourse">
            <NavAdmin />
            <br />
            <center>
            <div className="adminCLinks">
                <h3>توجيه إلى:</h3>
                <h1>
                    <a style= {{textDecoration: "none", color: theme=== "dark"? "#ffc000": "#0062ff"}} id='link' href="#cours" >التعريفات</a>     
                </h1>
                <h1>
                    <a style= {{textDecoration: "none", color: theme=== "dark"? "#ffc000": "#0062ff"}} id='link' href="#rules" >القواعد</a>
                </h1>
            </div>
            </center>
            <br />
            <center>
            <div id="cours">
                <table>
                    <tr>
                        <th>نوع الفعل</th>   
                        <th>التعريف</th>   
                        <th>تغيير التعريف</th>   
                    </tr>
                    {displayCours}
                </table>
            </div>
            </center>
            <br /><br />
            <div id= "rules" >
                <div style={{padding: "10px", width: "60%", minHeight: "5vh", display: "flex", justifyContent: "space-between", alignItems: "center", alignSelf: "flex-start", flexWrap: "wrap", gap: "20px"}}>
                    <h1>القواعد</h1>
                    <input id= 'statFilterInput' placeholder= "ابحث في العناوين..." type="text" value={searchTerm} onClick= {()=> {setPageNum(0)}} onChange={e=> {setSearchTerm(e.target.value)}} />
                    <div className="" style= {{width: "20%", display: "flex", justifyContent: "space-evenly", alignItems: "center"}}>
                        <p>اضافة قاعدة جديدة:</p>
                        <AddCircleIcon style= {{cursor: "pointer"}} onClick= {()=> {setAddConjOpen(true)}} />
                    </div>
                    <Modal id='defModal' ariaHideApp={false} isOpen={addConjOpen} onRequestClose={()=>setAddConjOpen(false)}>
                        <h3>اضف قاعدة جديدة</h3>
                        <Dropdown placeholder= "اختر عنوان المرحلة..." options= {types.map(e=> e.title)} onChange= {(event)=> {getTypeId(event.value)}} />
                        <TextareaAutosize style= {{width: "90%", minHeight: "5vh"}} type="text" placeholder='ادخل التعريف الجديد' value= {addNewRule} onChange= {(e)=> {setAddNewRule(e.target.value)}} />
                        <Button id= "tableBtn" variant="contained" onClick={()=> {addRule(typeId, addNewRule); setAddNewRule(""); setAddConjOpen(false)}}>إضافة</Button>
                    </Modal>
                </div>
                <div style= {saved}>
                    <div style={savedChild}>
                        <h3 style= {{width: "10%", fontSize: "15px"}}>المرحلة</h3>
                        <h3 style= {{width: "15%", fontSize: "15px"}}>العنوان</h3>
                        <h3 style= {{width: "55%", fontSize: "15px"}}>القاعدة</h3>
                        <div style={{width: "15%"}}></div>
                    </div>
                </div>
                <div style= {{minHeight: "50vh"}}>
                    <AnimatePresence>
                        {displayRules}
                    </AnimatePresence>
                </div>
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
                />
            </center>
            </div> 
            
      </div>
  )
}

export default AdminCourse;
