import {BrowserRouter as Router , Routes ,Route, Link, useLocation, useNavigate} from 'react-router-dom'
import Axios from 'axios'
import '../styles/Levels.css'
import '../styles/Admin.css'
import logo from '../images/logo.jpg'
import admin from '../images/admin.jpg'
import {useState, useEffect} from 'react'
import {GoogleLogin, GoogleLogout} from 'react-google-login'
import Button from '@mui/material/Button'
import ReactPaginate from 'react-paginate'
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, setAdmin } from '../Reducer'
import NavAdmin from '../component/NavAdmin'
import Modal from 'react-modal'

function Admin() {
    const dispatch = useDispatch()
    const theme = useSelector((state) => state.user.theme)
    const navigate=useNavigate()
    const id= "admin"
    const[users, setUsers]= useState([])
    const[pageNum,setPageNum]= useState(0)
    const userPerPage= 5
    const pageVis= pageNum * userPerPage
    const[searchTerm, setSearchTerm]= useState("")
    const[userModal, setUserModal]= useState(false)
    const[delId, setDelId]= useState("")
    const[delName, setDelName]= useState("")
    /*
    const search= ()=> {
        setUsers(
            users.filter((val)=> {
                if(searchTerm== ""){
                    return val
                }else if(val.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())){
                    return val
                }
            })
        )
    }

    useEffect(()=> {
        search()
        return(
            getUsers()
        )
    }, [searchTerm])
    */
    const getUsers= ()=> {
        Axios.post("http://localhost:3030/getUsers", {type: "admin"})
        .then((res)=> {
            setUsers(res.data)
        })
    }

    const deleteUser= (googleId)=> {
        Axios.post("http://localhost:3030/deleteUser", {googleId: googleId})
        .then((res)=> {
            if(res){
                getUsers()
            }
        })
        .catch(err=> {
            console.log(err)
        })
    }

    const pageCount = Math.ceil(users.length / userPerPage)
    const pageChange = ({selected})=>{
        setPageNum(selected)
    }

    useEffect(()=> {
        getUsers()
    }, [])

    const displayUsers= users
    .filter((val)=> {
        if(searchTerm== ""){
            return val
        }else if(val.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())){
            return val
        }
    })
    .slice(pageVis,pageVis + userPerPage)
    .map((e)=> {
        return(
            <motion.div className="user" layout animate={{opacity: 1}} initial={{opacity: 0}} exit={{opacity: 1}} >
                <div className="userNameImg" style= {{width: "30%"}}>
                    <img id="userImage" src={e.image} alt="" />
                    <h1  style= {{color: theme=== "light"? "#0062ff": "#ffc000"}}>
                        {e.name}
                    </h1>
                </div>
                <h3 style= {{width: "40%"}}>
                    {e.email}
                </h3>
                <h3  style= {{width: "5%"}}>
                    {e.level}
                </h3>
                <div className="" style= {{width: "10%"}}>
                    <center><Button id= "delUserBtn" variant="contained" color="error" onClick={()=> {setUserModal(true); setDelName(e.name); setDelId(e.id)}}>حذف</Button></center>
                </div>
                <Modal id='defModal' ariaHideApp={false} isOpen={userModal} onRequestClose={()=> setUserModal(false)}>
                    <h3>هل تريد حقا حذف هذا المستخدم <span style= {{color: "red"}}>{delName}</span> ؟</h3>
                    <Button id= "statBtn" variant="contained" color="error" onClick={()=> {deleteUser(e.googleId); setUserModal(false)}}>تأكيد الحذف</Button>
                </Modal>
            </motion.div>
        )
    })

    
    return (
        <div className="Admin">
            <NavAdmin />
            <input id='searchBar' placeholder='ابحث...' type="text" value={searchTerm} onClick= {()=> {setPageNum(0)}} onChange={e=> {setSearchTerm(e.target.value)}} />
            <div className="users">
                <div className="usersInfos">
                    <div className="">
                        <h1 style={{width: "30%", margin: "auto"}}>
                            الإسم
                        </h1>
                    </div>
                    <h3 style={{width: "40%"}}>
                        البريد الإلكتروني
                    </h3>
                    <h3 style={{width: "5%"}}>
                        المرحلة
                    </h3>
                    <h3 style={{width: "10%"}}>
                        <center>حذف</center>
                    </h3>
                </div>
                <AnimatePresence>
                    {displayUsers}
                </AnimatePresence>
                <br />
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
  )
}

export default Admin;

