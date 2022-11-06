import {BrowserRouter as Router , Routes ,Route, Link, useParams, useNavigate} from 'react-router-dom'
import '../../styles/Levels.css'
import LevelInter from './LevelInter'
function Level8() {
  //Managment
  const navigate=useNavigate()
  const params= useParams()
  const id= params.id
  const level= params.level
  //Prepa
  

  return (
    <div className="Level2">
      <LevelInter id={id} level= "8" />
    </div>
  )
}
  
export default Level8;