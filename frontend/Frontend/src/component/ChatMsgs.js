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
import '../styles/Chat.css'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import ReactPaginate from 'react-paginate'
import Modal from 'react-modal'
import TextField from '@mui/material/TextField'
import SendIcon from '@mui/icons-material/Send'
import io from 'socket.io-client'
import ScrollToBottom from 'react-scroll-to-bottom'
import DeleteIcon from '@mui/icons-material/Delete'
import userImage from '../images/user.png'
const socket= io.connect("http://localhost:3030")

function ChatMsgs({userId, guestId, name, img, level, open, hide}) {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const url= "http://localhost:3030"
    const [msgs, setMsgs]= useState([])
    const [msg, setMsg]= useState("")
    const [msgRec, setMsgRec]= useState("")
    const [maxId, setMaxId]= useState(0)
    const [dateId, setDateId]= useState("")
    const [delId, setDelId]= useState("")
    const [delText, setDelText]= useState("")
    const [delModal, setDelModal]= useState(false)
    const [deleted, setDeleted]= useState(false)

    const getMsgs= ()=> {
        Axios.post(`${url}/getMsgs`, {userId: userId, guestId: guestId})
        .then(res=> {
            setMsgs(res.data)
        })
        .catch(err=> {
            console.log(err)
        })
    }
    const sendMsg= ()=> {
        if(msg!== ""){
            Axios.post(`${url}/sendMsg`, {userId: userId, guestId: guestId, text: msg})
            .then(res=> {
                socket.emit("sendMsg", {id: res.data[0].max, text: msg, userId: userId, guestId: guestId, room: userId+ " "+ guestId, time: new Date().toISOString().slice(0, 19)})
                //setMsgs(prv=> [...prv, {id: res.data[0].max, text: msg, userId: userId, guestId: guestId, room: userId+ " "+ guestId, time: new Date().toISOString().slice(0, 19)}])
                getMsgs()
                setMsg("")
            })
            .catch(err=> {
                console.log(err)
            })
        }
    }
    const delMsg= (id)=> {
        Axios.post(`${url}/delMsg`, {id: id})
        .then(res=> {
            socket.emit("deleteMsg", {id: id, room: userId+ " "+ guestId})
            getMsgs()
            setDateId('')
            setDelText('')
            setDelModal(false)
        })
    }
    useEffect(()=> {
        socket.emit("joinRoom", userId+ " "+ guestId)
    }, [open])
    
    useEffect(()=> {
        socket.on("receiveMsg", (data)=> {
            setMsgs(prv=> [...prv, data])
        })
    }, [socket])

    useEffect(()=> {
        socket.on("receiveDeleteMsg", (id)=> {
            setMsgs(
                msgs.filter((val)=>{
                    return val.id !== id
                })
            )
        })
    }, [msgs])

    useEffect(()=> {
        getMsgs()
    }, [open])

    const t= {
        display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center",
        content: {
         backgroundColor: user.theme=== "dark"? "rgb(19, 0, 70)": "white", padding: "0",  height: "85vh"
        }
    }
    
  return (
    <div className='ChatMsgs'>
        <br /><br />
        <Modal id='ChatModal' style= {t} ariaHideApp={false} isOpen={open} onRequestClose={hide}>
            <div style= {{height: "10%", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "column", marginTop: "5px"}}>
                <img src= {img} style= {{height: "20px", width: "20px", borderRadius: "50%"}} alt= "user" />
                <p style= {{color: user.theme=== "light"? "#0062ff": "#ffc000"}}>{name}: {level}</p>
            </div>
            <ScrollToBottom className='msgContainer' >
                <motion.div className="" style= {{display: "flex", flexDirection: "column", padding: "10px"}}>
                {
                    msgs.map((e, i)=> {
                        return(
                            <>
                            <motion.p dir= "auto" animate= {{x: 0}} transition= {{duration: 0.6}} onClick= {()=> {setDateId(i); setDelId(e.id); setDelText(e.text)}}
                                style= {{
                                    x: 1000,
                                    alignSelf: e.userId!== user.id&& "flex-end", height: "80%", width: "fit-content", maxWidth: "30%", padding: "10px",
                                    border: "none", borderRadius: "5px", boxShadow: user.theme=== "light"? "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.3)": "0 2px 5px 0 white, 0 2px 5px 0 white",    
                                    background: e.userId== user.id? "#0062ff": "gray", color: "white", cursor: "pointer"                          
                            }}>
                                {e.text}
                                
                            </motion.p>
                            <motion.span style= {{display: dateId!== i&& "none", alignSelf: e.userId!== user.id&& "flex-end", color: user.theme!== "light"&& "white"}}>
                                {new Date(e.time).toString().slice(3, 21).replace('T', ' ')}
                                <DeleteIcon id= "delMsgBtn" style= {{display: e.userId!== user.id&& "none"}} onClick= {()=> {setDelModal(true)}} />
                            </motion.span>
                            <center>
                            <Modal id='delMsgModal' ariaHideApp={false} isOpen={delModal} onRequestClose={()=> {setDelModal(false)}}>
                                <h3>هل تريد حقا حذف هذه الرسالة: " {delText} "</h3>
                                <Button id= "statBtn" variant="contained" color="error" onClick={()=> {delMsg(delId)}}>تأكيد الحذف</Button>
                            </Modal>
                            </center>
                            </>
                        )
                    })
                }
                </motion.div>
            </ScrollToBottom> 
            <center>
            <form action="" onSubmit= {(e)=> {e.preventDefault(); sendMsg(msg)}} style= {{width: "80%", height: "5%", display: "flex", justifyContent: "space-evenly", alignItems: "center"}}>
                <SendIcon id= "sendMsgBtn" style= {{color: user.theme!== "light"&& "white", cursor: "pointer"}} onClick= {()=> {sendMsg(msg)}} />
                <TextField style= {{width: "90%", background: user.theme!== "light"&& "white"}} id="outlined-basic" label="رسالة جديدة" variant="outlined" value= {msg} onChange= {(e)=> {setMsg(e.target.value)}} />
            </form>
            </center>
        </Modal>
    </div>
  )
}

export default ChatMsgs