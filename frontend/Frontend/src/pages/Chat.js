import {useState, useEffect, useRef} from 'react'
import Axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import Nav from '../component/Nav'
import '../styles/Chat.css'
import ChatMsgs from '../component/ChatMsgs'
import SearchUser from '../component/SearchUser'
import RingLoader from 'react-spinners/RingLoader'
import { useNetwork } from '../component/useNetwork'
import avatar from '../images/avatar.jpg'
import io from 'socket.io-client'
const socket= io.connect("http://localhost:3030")

function Chat() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const theme = useSelector((state) => state.user.theme)
    const url= "http://localhost:3030"

    const[isUsers, setIsUsers]= useState([])
    const[users, setUsers]= useState([])
    const[supUsers, setSupUsers]= useState([])
    const[infUsers, setInfUsers]= useState([])
    const[msgsOld, setMsgsOld]= useState([])
    const[onlines, setOnlines]= useState([])
    const [open, setOpen]= useState(false)
    const [openIs, setOpenIs]= useState(false)
    const [userReady, setUserReady]= useState(false)
    const [guestId, setGuestId]= useState("")
    const [guestName, setGuestName]= useState("")
    const [guestImg, setGuestImg]= useState("")
    const [loadOld, setLoadOld]= useState(null)
    const [loadSugg, setLoadSugg]= useState(null)
    const[infos, setInfos]= useState()
    const [isShown, setIsShown] = useState(false)
    const [level, setLevel]= useState("")
    
    useEffect(()=> {
        if(!loadOld && !loadSugg){
            var imgs = document.querySelectorAll('img')
            imgs.forEach(e=> {
                if(e.alt=== "user"){
                    if(! (e.complete && e.naturalHeight !== 0)){
                        e.src= avatar
                    }
                }
            })
        }
    }, [loadOld, loadSugg])

    const hide= ()=> {
        setOpen(false)
        setGuestId("")
    }
    const getUsers= ()=> {
        Axios.post(`${url}/getUsers`, {type: "user", googleId: user.id})
        .then(res=> {
            setUsers(res.data)
            setUserReady(true)
        })
    }
    const getSuggs= (type)=> {
        Axios.post(`${url}/getChatUsers`, {level: user.level, googleId: user.id, type: type})
        .then(res=> {
            setLoadSugg(true)
            if(type=== "is"){
                setIsUsers(res.data)
            }
            else if(type=== "sup"){
                setSupUsers(res.data)
            }
            else if(type=== "inf"){
                setInfUsers(res.data)
            }
            setTimeout(() => {
                setLoadSugg(false)
            }, 2000)
        })
    }

    const getOld= ()=> {
        Axios.post(`${url}/getMsgsOld`, {userId: user.id})
        .then(res=> {
            setLoadOld(true)
            setMsgsOld(res.data)
            setTimeout(() => {
                setLoadOld(false)
            }, 2000)
        })
    }
    useEffect(()=> {
        getUsers()
        socket.emit("addUser", user.id)
    }, [])
    useEffect(()=> {
        getSuggs("is")
        getSuggs("sup")
        getSuggs("inf")
        getOld()
    }, [])

    useEffect(()=> {
        socket.on("getUsers", (data)=> {setOnlines(data)})
    }, [socket])
    const old= useRef(null)
    const inf= useRef(null)
    useEffect(()=> {
        if(old.current!== null && inf!== null){
        }
    }, [old])
    const displayOld= msgsOld.map(e=> {
        return(
            <>
            <div className="ChatSuggsUser" style= {{flexDirection: "row", justifyContent: "space-between"}} onClick= {()=> {setOpen(true); setGuestId(e.guestId); setGuestName(e.name); setGuestImg(e.image); setLevel(e.level)}}>
                <div className="" style= {{position: "relative", padding: "5px"}}>
                    <img ref= {old} src= {e.image} alt="user" />
                    {onlines.includes(e.guestId)&& <div className="" style= {{height: "7px", width: "7px", background: "#31A24C", borderRadius: "50%", border: user.theme== "light"? "2px solid white": "2px solid rgb(19, 0, 70)", position: "absolute", bottom: "15%", right: "15%"}}></div>}
                </div>
                <h3>{e.name}</h3>
            </div> 
            <ChatMsgs userId={user.id} guestId= {guestId} name= {guestName} img= {guestImg} level= {level} open= {open} hide= {hide} />
            </>
        )
    })

    const displayIsUsers= isUsers.map(e=> {
        return(
            <>
            <div className="ChatSuggsUser" onClick= {()=> {setOpen(true); setGuestId(e.googleId); setGuestName(e.name); setGuestImg(e.image); setLevel(e.level)}}>
                <div className="" style= {{position: "relative"}}>
                    <img src= {e.image} alt="user" onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}/>
                    {onlines.includes(e.guestId)&& <div className="" style= {{height: "5px", width: "5px", background: "green", borderRadius: "50%", border: "1px solid white", position: "absolute", bottom: "15%", right: "15%"}}></div>}
                </div>
                <p>{e.name}</p>
            </div>
            <ChatMsgs userId={user.id} guestId= {guestId} name= {guestName} img= {guestImg} level= {level} open= {openIs} hide= {hide} />
            </>
        )
    })
    const displaySupUsers= supUsers.map(e=> {
        return(
            <>
            <div className="ChatSuggsUser" onClick= {()=> {setOpen(true); setGuestId(e.googleId); setGuestName(e.name); setGuestImg(e.image); setLevel(e.level)}}>
                <div className="" style= {{position: "relative"}}>
                    <img src= {e.image} alt="user" onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}/>
                    {onlines.includes(e.guestId)&& <div className="" style= {{height: "5px", width: "5px", background: "green", borderRadius: "50%", border: "1px solid white", position: "absolute", bottom: "15%", right: "15%"}}></div>}
                </div>
                <p>{e.name}</p>
            </div>
            <ChatMsgs userId={user.id} guestId= {guestId} name= {guestName} img= {guestImg} level= {level} open= {open} hide= {hide} />
            </>
        )
    })
    const displayInfUsers= infUsers.map(e=> {
        return(
            <>
            <div className="ChatSuggsUser" onClick= {()=> {setOpen(true); setGuestId(e.googleId); setGuestName(e.name); setGuestImg(e.image); setLevel(e.level)}}>
                <div className="" style= {{position: "relative"}}>
                    <img ref= {inf} src= {e.image} alt="user" onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}/>
                    {onlines.includes(e.guestId)&& <div className="" style= {{height: "5px", width: "5px", background: "green", borderRadius: "50%", border: "1px solid white", position: "absolute", bottom: "15%", right: "15%"}}></div>}
                </div>
                <p>{e.name}</p>
            </div>
            <ChatMsgs key={e.id} userId={user.id} guestId= {guestId} name= {guestName} img= {guestImg} level= {level} open= {open} hide= {hide} />
            </>
        )
    })

  return (
    <div className='Chat'>
        <Nav />
        <br />
        {userReady&& <SearchUser data= {users} />}
        <h1>اقتراحات</h1>
        <div className="ChatSuggs">
            {
                loadSugg? (
                    <center>
                        <div style= {{width: "100%", height: "15vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"}}>
                            <RingLoader
                                loading= {loadSugg}
                                color= {"blue"}
                                size= {50}
                            />
                        </div>
                    </center>
                ): 
                (
                <>
                    {isUsers.length> 0&& <div className=""><p style= {{fontWeight: "bolder", color: user.theme=== "dark"? "#ffc000": "#0062ff"}}>مستخدمون من نفس المرحلة:</p>{displayIsUsers}</div>}
                    {supUsers.length> 0&& <div className=""><p style= {{fontWeight: "bolder", color: user.theme=== "dark"? "#ffc000": "#0062ff"}}>مستخدمون من مراحل أعلى:</p>{displaySupUsers}</div>}
                    {infUsers.length> 0&& <div className=""><p style= {{fontWeight: "bolder", color: user.theme=== "dark"? "#ffc000": "#0062ff"}}>مستخدمون من مراحل أدني:</p>{displayInfUsers}</div>}
                </>
                )
            }
            </div>
        <br /><br />
        <div className=""></div>
        <br />
        <div className="line"></div>
        <h1>دردشات سابقة</h1>
        <div className="ChatOld" style= {{width: "100%", minHeight: "50vh", display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
            {
                loadOld? (
                    <center>
                        <div style= {{width: "100%", height: "15vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly"}}>
                            <RingLoader
                                loading= {loadOld}
                                color= {"blue"}
                                size= {50}
                            />
                        </div>
                    </center>
                ): (
                    <>{
                        displayOld
                    }</>
                )
            }
        </div>
    </div>
  )
}

export default Chat