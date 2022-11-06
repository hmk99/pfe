import '../styles/Level.css'
import {BrowserRouter as Router , Routes ,Route, Link, useParams, useNavigate} from 'react-router-dom'
import{useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, setAdmin } from '../Reducer'
function Levels() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const[isReady, setIsReady]= useState(false)
    const[refresh, setRefresh]= useState(false)
    const params= useParams()
    const navigate= useNavigate()
    const id= params.id
    //const level= params.level
    function isLevel() {
        const levels= document.querySelectorAll('.Levels div div')
        if(levels!== []){
            for (let i = 0; i < parseInt(user.level)+ 5; i++) {
                if(levels[i].classList!== undefined){
                    levels[i].classList.add('isLevel')
                }
            }
        } 
    }

    const goLevel= (lev)=> {
        navigate(`/levels/${id}/${user.level}`)
        navigate(`/level${lev}/${id}/${user.level}`)
    }

    useEffect(()=> {
        isLevel()
    }, [])
    
    return (
        <div className="Levels">
            <h1>
                قائمة المستويات
            </h1>
            <div className="">
                <div className="" onClick={()=> {goLevel(100)}}>
                    <h3>الماضي و المضارع</h3>
                </div>
                <div className="" onClick={()=> {goLevel(101)}}>
                    <h3>المضارع 2</h3>
                </div>
                <div className="" onClick={()=> {goLevel(102)}}>
                    <h3>الأمر</h3>
                </div>
                <div className="" onClick={()=> {goLevel(103)}}>
                    <h3>المبني للمجهول</h3>
                </div>
                <div className="" onClick={()=> {goLevel(0)}}>
                    <h3>0</h3>
                </div>
                <div className="" onClick={()=> {goLevel(1)}}>
                    <h3>1</h3>
                </div>
    
                <div className="" onClick={()=> {goLevel(2)}}>
                    <h3>2</h3>
                </div>
                <div className="" onClick={()=> {goLevel(3)}}>
                    <h3>3</h3>
                </div>
                <div className="" onClick={()=> {goLevel(4)}}>
                    <h3>4</h3>
                </div>
            
    
                <div className="" onClick={()=> {goLevel(5)}}>
                    <h3>5</h3>
                </div>
                <div className="" onClick={()=> {goLevel(6)}}>
                    <h3>6</h3>
                </div>
                <div className="" onClick={()=> {goLevel(7)}}>
                    <h3>7</h3>
                </div>
                <div className="" onClick={()=> {goLevel(8)}}>
                    <h3>8</h3>
                </div>
                <div className="" onClick={()=> {goLevel(9)}}>
                    <h3>9</h3>
                </div>
            </div>
        </div>
    )
}

export default Levels
