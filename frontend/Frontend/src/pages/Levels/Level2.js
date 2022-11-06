import {BrowserRouter as Router , Routes ,Route, Link, useParams, useNavigate} from 'react-router-dom'
import Axios from 'axios'
import '../../styles/Levels.css'
import Button from '@mui/material/Button'
import LevelInter from './LevelInter'
function Level2() {
  //Managment
  const navigate=useNavigate()
  const params= useParams()
  const id= params.id
  const level= params.level
  //Prepa

  return (
    <div className="Level2">
      <LevelInter id={id} level= "2" />
    </div>
  )
}
  
export default Level2;