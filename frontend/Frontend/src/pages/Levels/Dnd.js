import Axios  from 'axios'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import Button from '@mui/material/Button'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, setScore } from '../../Reducer'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'
function Dnd({salim, weak, level}) {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const url= "http://localhost:3030"
    const[qsts, setQsts]= useState([])
    const [cards, setcards]= useState([{}])
    const [colBack, setColBack]= useState([])
    const [reps, setReps]= useState([])
    const[dataReady, setDataReady]= useState(false)
    const[colReady, setColReady]= useState(false)
    const[dndTry, setDndTry]= useState(false)
    const nbDnd= 3
    const getQsts= ()=> {
        Axios.post(`${url}/getDnds`, {salim: salim, weak: weak})
        .then((res)=> {
            for (let i = 0; i < res.data.length; i++) {
                reps.push(res.data[i].rep)
                let ops= []
                ops.push({id: `${res.data[i].id}pvt`, temps: res.data[i].temps, pronom: res.data[i].pronom, qst: res.data[i].qst})
                ops.push({id: `${res.data[i].id}1`, content: res.data[i].op1})
                ops.push({id: `${res.data[i].id}2`, content: res.data[i].op2})
                ops.push({id: `${res.data[i].id}3`, content: res.data[i].op3})
                ops.push({id: `${res.data[i].id}4`, content: res.data[i].op4})
                cards.push(ops)
            }
            cards.shift()
            setDataReady(true)
        })
        .catch(err=> {
            console.log(err)
        })
    }

    useEffect(()=> {
        getQsts()
    }, [])

    const crr= (n)=> {
      switch (n) {
        case 1:
          return "الماضي"
          break;
        case 2:
            return "المضارع"
          break;
        case 3:
            return "المضارع المجزوم"
          break;
        case 4:
            return "المضارع المنصوب"
          break;
        case 6:
            return "الأمر"
          break;
        case 8:
            return "مجهول الماضي"
        break;
        case 9:
            return "مجهول المضارع"
        default:
          return ""
      } 
    }

    useEffect(()=> {
        if(dataReady){
            cards.map((e, i)=> {
                colBack[`qst${i}`]= 
                {
                    optionDg:
                        {
                            id: e[0].id,
                            name: /*level== 0? `${e[0].qst}`:*/ `${e[0].pronom} (${e[0].qst}) في ${crr(e[0].temps)}:`,
                            items: e.slice(1)
                        },
                    optionDp: 
                        {
                            id: e[0].id,
                            name: `الجواب:`,
                            items: []
                        }
                }
            })
            setColReady(true)
        }
    }, [dataReady])

    const onDragEnd = (result, eid, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;
      
        if (source.droppableId !== destination.droppableId) {
          const sourceColumn = columns[source.droppableId];
          const destColumn = columns[destination.droppableId];
          const sourceItems = [...sourceColumn.items];
          const destItems = [...destColumn.items];
          const [removed] = sourceItems.splice(source.index, 1);
          destItems.splice(destination.index, 0, removed);
            setColumns({
                ...colBack, 
                [eid]: {...colBack[eid], 
                [source.droppableId]: 
                {...sourceColumn, items: sourceItems},
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                    }
                }
            })
        } else {
          const column = columns[source.droppableId];
          const copiedItems = [...column.items];
          const [removed] = copiedItems.splice(source.index, 1);
          copiedItems.splice(destination.index, 0, removed);
          setColumns({
            ...columns,
            [source.droppableId]: {
              ...column,
              items: copiedItems
            }
          });
        }
    }
    const[qstSave, setQstSave]= useState(true)
    const saveLevel= (qstId)=> {
      if(dndTry){
        Axios.post(`${url}/addSavedQst`, {userId: user.id, level: level, qstId: qstId})
        .then(res=> {
          setQstSave(!qstSave)
        })
        .catch(err=> {
          console.log(err)
        })
      }
    }
    useEffect(()=> {
      const saves= document.querySelectorAll('#saveBtnDnd')
      if(dndTry){
        saves.forEach(e=> {
          e.addEventListener('click', ()=> {
            if(user.theme=== "light"){
              e.style.color= "black"
            }else{
              e.style.color= "#ffc000" 
            }
          })
        })
      }
    }, [user.score])
    const display= Object.entries(colBack).map(([eid, e])=> {
        return(
          <DragDropContext
          onDragEnd={result => onDragEnd(result, eid, e, setColBack)}
          >
          {
              Object.entries(e).map(([columnId, column], index) => {
              return (
                  
                  <div
                  style={{
                      display: "flex",
                      width: "40%",
                      alignItems: "center",
                      flexWrap: "wrap",
                      border: user.theme=== "light"
                      ? "0.5px black solid"
                      : "0.5px white solid",
                      boxShadow: user.theme=== "light"
                      ? "0px 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                      : "0px 4px 8px 0 rgba(160, 160, 160, 0.2), 0 6px 20px 0 rgba(160, 160, 160, 0.19)",
                      borderRadius: "10px",
                  
                  }}
                  key={columnId}
                  className= {`drop${level}${eid}`}
                  >
                  <h2>{column.name}</h2>
                  <BookmarkAddIcon id= "saveBtnDnd" onClick= {()=> {saveLevel(column.id.slice(0, -3))}} style= {{cursor: "pointer",color: "gray"}} />
                  <div  style={{ margin: 10, width: "80%"}} >
                      <Droppable droppableId={columnId} key={columnId} >
                      {(provided, snapshot) => {
                          return (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              
                              style={{
                              display: "flex",
                              alignItems: "center",
                             
                              flexDirection: "column",
                              background: snapshot.isDraggingOver
                                  ? "lightblue"
                                  : "lightgrey",
                              width: "100%",
                              minHeight: 280,
                              
                              }}
                            >
                                
                              
                              {
                   
                              column.items.map((item, index) => {
                                  return (
                                      <Draggable
                                      key={item.id}
                                      draggableId={item.id}
                                      index={index}
                                      >
                                      {(provided, snapshot) => {
                                          return (
                                          <div
                                          
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                            userSelect: "none",
                                            width: "50%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            margin: "8px 0 8px 0",
                                            minHeight: "50px",
                                            backgroundColor: snapshot.isDragging
                                                ? "#263B4A"
                                                : "#456C86",
                                            color: "white",
                                            ...provided.draggableProps.style
                                            }}
                                          >
                                            <center>{item.content}</center>
                                            
                                          </div>
                                          );
                                      }}
                                      </Draggable>
                                  )
                                  })

                              }
                              {provided.placeholder}
                          </div>
                          );
                      }}
                      </Droppable>
                  </div>
                  </div>
              );
              })  
          }
        </DragDropContext>
        )
  })

  const evalDnd= ()=> {
    let score= 0
    let y= []
    let n= 0
    for (let i = 0; i < nbDnd; i++) {
      y.push(
        document.querySelectorAll(`.drop${level}qst${i}`)[1]
      )
    }
    Object.entries(colBack).map(([eid, e], i)=> {
      if(e.optionDp.items.length> 0){ 
        n++
      }
    })
    if(n> nbDnd- 1 && !dndTry){
      for (let i = 0; i < reps.length; i++) {
        if(reps[i]== y[i].textContent.slice(7)){
          score++
          y[i].style.background= "#228b22" 
          y[i].style.color= "white" 
        }else{
          y[i].style.background= "#dc143c"
          y[i].style.color= "white"
        }
      }
      setDndTry(true)
      console.log(score)
      dispatch(setScore({score: ((score/ nbDnd)* 100).toFixed(2) }))
    } 
  }

    return (
      <div style= {{gap: "20px", display: "flex", justifyContent: "space-evenly", flexWrap: "wrap", alignItems: "center"}}>
        {
          (colReady) ? (
            <>
            {
              display
            }
            <div className="" style= {{width: "100%"}}>
                <center><Button variant="contained" onClick= {evalDnd} style= {{}} >تأكيد</Button></center>
            </div> 
            </>
          ): <h1>انتظروا...</h1>    
        } 
      </div>
    )
}

export default Dnd