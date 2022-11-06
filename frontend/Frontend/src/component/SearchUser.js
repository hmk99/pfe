import {useState, useEffect} from 'react'
import '../styles/Chat.css'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import ChatMsgs from './ChatMsgs'
import { useSelector, useDispatch } from 'react-redux'

function SearchUser( {data} ) {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const[guestId, setGuestId]= useState("")
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");
    const [open, setOpen]= useState(false)
    const hide= ()=> {
        setOpen(false)
        setGuestId("")
    }
    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setWordEntered(searchWord)
        const newFilter = data.filter((value) => {
        return value.name.toLowerCase().includes(searchWord.toLowerCase());
        });

        if (searchWord === "") {
        setFilteredData([])
        } else {
        setFilteredData(newFilter)
        }
    };

    const clearInput = () => {
        setFilteredData([])
        setWordEntered("")
    };
  return (
    <div className= 'SearchUser'>
        <center>
        <div className="SearchUserInputs">
            <input id='searchBar' placeholder= 'ابحث عن مستخدمين...' type="text" value={wordEntered} onChange={handleFilter} />
            {wordEntered&& <CloseIcon style= {{position: "absolute", left: "5%", cursor: "pointer"}} onClick= {clearInput} />}
        </div>
        {filteredData.length != 0 && (
            <div className="Users" >
            {filteredData.slice(0, 15).map((e, key) => {
                return(
                    <div style={{width: "100%", height: "40%", display: "flex", justifyContent: "space-evenly", alignItems: "center"}}>
                        <h4 style= {{color: "black"}} onClick= {()=> {setOpen(true); setGuestId(e.googleId)}}>{e.name}</h4>
                        <p style= {{color: "black"}}>مرحلة {e.level}</p>
                        <ChatMsgs key={e.id} userId={user.id} guestId= {guestId} open= {open} hide= {hide} />
                    </div>
                )
            })}
            </div>
        )}
        </center>
    </div>
  )
}

export default SearchUser