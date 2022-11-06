import {BrowserRouter as Router , Routes ,Route, Link, useParams, useNavigate} from 'react-router-dom'
import Axios from 'axios'
import '../../styles/Levels.css'
import logo from '../../images/logo.jpg'
import {useState, useEffect} from 'react'

import {GoogleLogin, GoogleLogout} from 'react-google-login'
import Button from '@mui/material/Button'
import LevelInter from './LevelInter'
function Level4() {
  //Managment
  const navigate=useNavigate()
  const params= useParams()
  const id= params.id
  const level= params.level
  //Prepa
  
  return (
    <div className="Level2">
      <LevelInter id={id} level= "4" />
    </div>
  )
}
  
export default Level4;