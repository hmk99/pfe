import {BrowserRouter as Router , Routes ,Route, Link, useParams, useNavigate} from 'react-router-dom'
import Axios from 'axios'
import '../../styles/Levels.css'
import LevelInter from './LevelInter'
function Level0() {
    //Managment
    const navigate=useNavigate()
    const params= useParams()
    const id= params.id
    const level= params.level
    //Prepa
  
  return (
    <div className='level2'>
        <LevelInter id={id} level= "0" />
    </div>
  )
}

export default Level0