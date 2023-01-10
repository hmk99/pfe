import React from 'react'
import {BrowserRouter as Router , Routes ,Route, Link, BrowserRouter, useNavigate, Navigate, Redirect,  useParams} from 'react-router-dom'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded'
import '../styles/App.css'
import { useSelector, useDispatch } from 'react-redux'
function Footer() {
    const user = useSelector((state) => state.user)
    const child= {
        flexWrap: "wrap", width: "30%", minHeight: "50%", display: 'flex', flexDirection: "column", justifyContent: "space-between", alignItems: "center"
    }
    const link= {
        color: "white", textDecoration: "none"
    }
  return (
    <div className='Footer' 
    style={{
        borderTop: "0.5px black solid", width: "100%", minHeight: "20vh", display: 'flex', justifyContent: "space-evenly", alignItems: "flex-start",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.3)", color: "black", background: user.theme=== "light"? "linear-gradient(to right, #4286f4, #373B44)": "linear-gradient(to right, #21447c, #cddcff)",
    }}
    >
        <ul style= {child}>
            <h3>راسلنا: </h3>
            <li><a style= {link} href = "mailto: taha.zerrouki@gmail.com">ابعث رسالة</a></li>
        </ul>
        <ul style= {child}>
            <h3>القائمة: </h3>
            <li><Link style= {link} to= "/">الرئيسية</Link></li>
            <li><li><a style= {link} href="https://qutrub.arabeyes.org/">قطرب</a></li></li>
        </ul>
        <ul style= {child}>
            <h3>للتواصل: </h3>
            <div style= {{width: "50%", height: "100%", display: "flex", justifyContent: "space-between", alignItems:"center", flexWrap: "wrap", gap: "15px"}}>
                <FacebookRoundedIcon id= "footerIcon" style={{color: "white", cursor: "pointer"}} />
                <InstagramIcon id= "footerIcon" style={{color: "white", cursor: "pointer"}}/>
                <TwitterIcon id= "footerIcon" style={{color: "white", cursor: "pointer"}}/> 
           </div>
        </ul>
    </div>
  )
}

export default Footer