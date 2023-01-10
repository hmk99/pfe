const express= require("express")
const app= express()
const mysql= require("mysql")
const cors= require("cors")
const axios= require("axios")
const fastCsv= require("fast-csv")
const { json, query } = require("express")
const http= require("http")
const {Server}= require("socket.io")
const server= http.createServer(app)
app.use(cors())
app.use(express.json())
const convert= (word)=> {
    if(word!== ""){
    return word.split(" ").reverse().join(" ").toString()
    }else{
    return []
    }
}
const io= new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})
let users= []
io.on("connection", (socket)=> {
    //var online= Object.keys(io.engine.clients)
    //io.emit('online', JSON.stringify(online))
    socket.on("addUser", id=> {
        if(!users.includes(id)) {
            users.push(id)
        }
        io.emit("getUsers", users)
    })
    socket.on("deleteUser", id=> {
        if(users.includes(id)) {
            users= users.filter((item)=> {
                return item !== id
            })
        }
        io.emit("getUsers", users)
    })
    socket.on("joinRoom", (data)=> {
        socket.join(data)
        socket.join(convert(data))
    })
    socket.on("sendMsg", (data)=> {
        socket.to(data.room).emit("receiveMsg", data)
        //socket.to(convert(data.room)).emit("receiveMsg", data)
    })
    
    socket.on("deleteMsg", (data)=> {
        socket.to(data.room).emit("receiveDeleteMsg", data.id)
        //socket.to(convert(data.room)).emit("receiveMsg", data)
    })
})


const db= mysql.createConnection({
    user: 'hmk',
    host: 'localhost',
    password: 'hmk@99',
    database: 'pfe',
    charset : 'utf8mb4'
})

app.get("/getVerbs", (req, res)=> {
    db.query("select verb from verblist", 
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})

app.get("/allConj", (req, res)=> {
    db.query("select * from blanks", 
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})

app.post("/login", (req, res)=> {
    const email= req.body.email
    const pwd= req.body.pwd
    db.query("select * from user where email= ? and pwd= ?", [email, pwd],
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})

app.post("/register", (req, res)=> {
    const googleId= req.body.googleId
    const name= req.body.name
    const email= req.body.email
    const pwd= req.body.pwd
    const image= req.body.image
    const level= req.body.level
    db.query("insert into user (googleId, name, email, pwd, image, level) values (?, ?, ?, ?, ?, ?)", [googleId, name, email, pwd, image, level],
    (Err, Result)=> {
        if(Err){
            res.send(null)
        }else{
            for (let i = 0; i < 10; i++) {
                db.query(`insert into stats (userId, level, score, fails) values (?, ${i}, 0, 0)`, [googleId],
                (errStat, resStat)=> {
                    if(errStat){
                        console.log(errStat)
                    }else{
                        console.log("INSERTED")
                    }
                })              
            }
            db.query("select * from user order by id desc limit 1",
            (err, result)=> {
                if(err){
                    console.log(err)
                }else{
                    res.send(result)
                }
            })
            console.log("Inserted")
        }
    })
})
app.post("/loginGF", (req,res)=> {
    const googleId= req.body.googleId
    db.query("select * from user where googleId= ?",googleId,
    (err,result)=> {
        if(err){
            res.send(null)
        }else{
            res.send(result)
            //console.log(result)
        }
    })
})
app.post("/levelGlb", (req, res)=> {
    const googleId= req.body.googleId
    const level= req.body.level
    db.query("update user set level= ? where googleId= ?", [level, googleId],
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send("updated")
        }
    })
})

app.post("/getInfos", (req, res)=> {
    const id= req.body.id
    db.query("select * from user where googleId= ?", id,
    (err, result)=> {
        if(err){
            res.send(null)
        }else{
            res.send(result)
        }
    })
})

/*
app.post("/getQcm", (req, res)=> {
    const salim= req.body.salim
    const weak= req.body.weak
    db.query("select f.* from (select t.salim, t.weak, q.* from qcm q join type t where q.typeId= t.id) f where f.salim= ? and f.weak= ?", verb,
    (err, result)=> {
        if(err){
            res.send(null)
        }else{
            res.send(result)
        }
    })
})
app.post("/getFillReps", (req, res)=> {
    const type= req.body.type
    db.query("select rep from blanks where typeBlank= ?", type,
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            console.log(result)
            res.send(result)
        }
    })
})
*/
app.post("/getUsers", (req, res)=> {
    const type= req.body.type
    const googleId= req.body.googleId
    if(type=== "admin"){
        db.query(`select * from user where googleId <> "admin"`,
        (err, result)=> {
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        })
    }else if(type=== "user"){
        db.query(`select * from user where googleId <> "admin" and googleId <> ?`, googleId, 
        (err, result)=> {
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        })
    }
})

app.post("/deleteUser", (req, res)=> {
    const googleId= req.body.googleId
    db.query("delete from user where googleId= ?", googleId,
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(true)
            console.log("Deleted")
        }
    })
})

app.post("/getSW", (req, res)=> {
    const level= req.body.level
    db.query("select * from type where level= ?", level,
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})

app.post("/getCours", (req, res)=> {
    const level= req.body.level
    db.query("select * from (select id from type where level= ?) f join cours c where f.id= c.typeId", [level],
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})
app.post("/getConj", (req, res)=> {
    const level= req.body.level
    db.query("select * from (select id from type where level= ?) f join conj c where f.id= c.typeId", [level],
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})


app.get("/getAllCours", (req, res)=> {
    db.query("SELECT t.level, t.title, c.* FROM `cours` c join type t where c.typeId= t.id order  by level asc;", 
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})

app.post("/posAllConj", (req, res)=> {
    const level= req.body.level
    db.query("SELECT c.*, t.level, t.title FROM `conj` c join type t where c.typeId= t.id and t.level= ?", level, 
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})
app.get("/getAllConj", (req, res)=> {
    db.query("SELECT c.*, t.level, t.title FROM `conj` c join type t where c.typeId= t.id", 
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})

app.post("/getTypes", (req, res)=> {
    const all= req.body.all
    if(all){
        db.query("SELECT * FROM `type` where level< 10 or level BETWEEN 100 and 104 ORDER BY `level`  ASC;", 
        (err, result)=> {
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        })
    }else{
        db.query("SELECT * FROM `type` where level< 10 ORDER BY `level`  ASC", 
        (err, result)=> {
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        })
    }
})
app.post("/getTypeId", (req, res)=> {
    const title= req.body.title
    db.query("select * from type where title= ?", title,
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})
/*
app.get("/getTypeRules", (req, res)=> {
    db.query("select * from type t join conj c where t.id= c.typeid",
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})
app.post("/getTypeBlanks", (req, res)=> {
    typeBlank= req.body.typeBlank
    db.query("select * from type t join blanks b where t.id= b.typeid and b.typeBlank= ?", typeBlank,
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})*/
app.post("/addRule", (req, res)=> {
    const typeId= req.body.typeId
    const elem= req.body.elem
    db.query("insert into conj (typeId, elem) values (?, ?)", [typeId, elem], 
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send("add")
        }
    })
})
app.post("/updateRule", (req, res)=> {
    const elem= req.body.elem
    const id= req.body.id
    db.query("update conj set elem= ? where id= ?", [elem, id], 
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send("upd")
        }
    })
})
app.post("/deleteRule", (req, res)=> {
    const id= req.body.id
    db.query("delete from conj where id= ?", [id], 
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send("del")
        }
    })
})
app.post("/updateVerbDef", (req, res)=> {
    const id= req.body.id
    const def= req.body.def
    db.query("update cours set def= ? where id= ?", [def, id],
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send("UPD")
        }
    })
})

/*
app.post('/getRep', (req, res)=> {
    const id= req.body.id
    db.query("select * from blanks where id= ?", id,
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})
*/
app.post("/getBlanks", (req, res)=> {
    const salim= req.body.salim
    const weak= req.body.weak
    const temps= req.body.temps
    db.query(`select f.*, ROW_NUMBER() OVER(ORDER BY id DESC) row from (select * from blanks where salim= ? and weak= ? and temps= ? order by rand() limit 5) as f`, [salim, weak, temps],
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})
const sampleSize = (arr, n) => {
    let m = arr.length;
    while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr.slice(0, n)
}
/*app.post("/getFreqQcms", (req, res)=> {
    const salim= req.body.salim
    const weak= req.body.weak
    const min= req.body.freq
    const max= req.body.freq
    db.query(`select f.*, ROW_NUMBER() OVER(ORDER BY id DESC) row from ((select * from blanks WHERE temps in (1, 2) and (freq between ? and ?) and salim= ? and weak= ?  and op1<> "" and op2<> "" and op3<> "" and op4<> "" order by rand() limit 1) union (select * from blanks WHERE temps in (3, 4) and (freq> 100000) and salim= ? and weak= ? and op1<> "" and op2<> "" and op3<> "" and op4<> "" order by rand() limit 1) union (select * from blanks WHERE temps in (6, 8, 9) and (freq> 100000) and salim= ? and weak= ? and op1<> "" and op2<> "" and op3<> "" and op4<> "" order by rand() limit 1)) as f`, [salim, weak, salim, weak, salim, weak],
})*/
app.post("/getQcms", (req, res)=> {
    const salim= req.body.salim
    const weak= req.body.weak
    db.query(`select f.*, ROW_NUMBER() OVER(ORDER BY id DESC) row from ((select * from blanks WHERE temps in (1, 2) and (freq> 100000 or freq> 10000 or freq= 0) and salim= ? and weak= ?  and op1<> "" and op2<> "" and op3<> "" and op4<> "" ORDER by freq DESC, rand() limit 4) union (select * from blanks WHERE temps in (3, 4) and (freq> 100000 or freq> 10000 or freq= 0) and salim= ? and weak= ? and op1<> "" and op2<> "" and op3<> "" and op4<> "" ORDER by freq DESC, rand() limit 3) union (select * from blanks WHERE temps in (6, 8, 9) and (freq> 100000 or freq> 10000 or freq= 0) and salim= ? and weak= ? and op1<> "" and op2<> "" and op3<> "" and op4<> "" ORDER by freq DESC, rand() limit 3)) as f`, [salim, weak, salim, weak, salim, weak],
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })  
})
app.post("/getDnds", (req, res)=> {
    const salim= req.body.salim
    const weak= req.body.weak
    db.query(`select f.*, ROW_NUMBER() OVER(ORDER BY id DESC) row from ((select * from blanks WHERE temps in (1, 2) and (freq= 0) and salim= ? and weak= ?  and op1<> "" and op2<> "" and op3<> "" and op4<> "" ORDER by freq DESC, rand() limit 4) union (select * from blanks WHERE temps in (3, 4) and (freq= 0) and salim= ? and weak= ? and op1<> "" and op2<> "" and op3<> "" and op4<> "" ORDER by freq DESC, rand() limit 3) union (select * from blanks WHERE temps in (6, 8, 9) and (freq= 0) and salim= ? and weak= ? and op1<> "" and op2<> "" and op3<> "" and op4<> "" ORDER by freq DESC, rand() limit 3)) as f`, [salim, weak, salim, weak, salim, weak],
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })  
})

app.post("/getQcmsStat", (req, res)=> {
    const level= req.body.level
    db.query("select *, ROW_NUMBER() OVER(ORDER BY q.id ASC) row from (select id from type where level= ?) f join qcm q where f.id= q.typeId limit 3", level,
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})

app.post("/levelUpdate", (req, res)=> {
    const id= req.body.id
    db.query("update user set level= level + 1 where googleId= ?", id,
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send("updated")
            console.log("updated")
        }
    })
})

app.post("/failsUpdate", (req, res)=> {
    const id= req.body.id
    const level= req.body.level
    db.query("update stats set fails= fails + 1 where userId= ? and level= ?", [id, level],
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            console.log("UPD")
        }
    })
})
app.post("/statsUpdate", (req, res)=> {
    const userId= req.body.userId
    const score= req.body.score
    const level= req.body.level
    const fail= req.body.fail
    if(fail){
        db.query("update stats set fails= fails + 1, score= GREATEST(score, ?) where userId= ? and level= ?", [score, userId, level],
        (err, result)=> {
            if(err){
                console.log(err)
            }else{
                console.log("UPD")
            }
        })
    }else{
        db.query("update stats set score= GREATEST(score, ?) where userId= ? and level= ?", [score, userId, level],
        (err, result)=> {
            if(err){
                console.log(err)
            }else{
                console.log("UPD")
            }
        })
    }
})

app.post("/getUserStats", (req, res)=> {
    const id= req.body.id
    db.query("SELECT s.*, t.title FROM stats s JOIN type t where s.level= t.level and s.userId= ? order by s.level asc", id,
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})

app.post("/saveLevel", (req, res)=> {
    const id= req.body.id
    const level= req.body.level
    db.query("update stats set saved= !saved where userId= ? and level= ?", [id, level],
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send("UPD")
        }
    })
})
app.post("/addSavedQst", (req, res)=> {
    const userId= req.body.userId
    const level= req.body.level
    const qstId= req.body.qstId
    db.query("insert into userQsts (userId, level, qstId) values (?, ?, ?)", [userId, level, qstId],
    (err, result)=> {
        if(err){
            console.log(err)
        }
        else{
            res.send("ADD")
        }
    })
})
app.post('/getSavedQsts', (req, res)=> {
    const id= req.body.id
    const level= req.body.level
    if(typeof level=== "string"){
        db.query("SELECT b.*, u.userId, u.level FROM userqsts u join blanks b where u.qstId= b.id and u.userId= ?", [id],
        (err, result)=> {
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        })
    }else{
        db.query("SELECT b.*, u.userId, u.level FROM userqsts u join blanks b where u.qstId= b.id and u.userId= ? and u.level= ?", [id, level],
        (err, result)=> {
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        })
    }
})

app.post('/deleteSavedQst', (req, res)=> {
    const userId= req.body.userId
    const qstId= req.body.qstId
    db.query("delete from userqsts where userId= ? and qstId= ?", [userId, qstId],
    (err, result)=> {
        if(err){
            console.log(err)
        }
        else{
            res.send("DEL")
        }
    })
})

app.post("/updateUserName", (req, res)=> {
    const name= req.body.name
    const userId= req.body.userId
    db.query("update user set name= ? where googleId= ?", [name, userId],
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send("UPD")
        }
    })
})
app.post("/deleteUserName", (req, res)=> {
    const userId= req.body.userId
    db.query("delete from user where userId= ?", [userId],
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send("DEL")
        }
    })
})
app.post("/adminStats", (req, res)=> {
    const fs= req.body.fs
    if(fs){
        db.query("SELECT level, round(avg(fails), 2) fails, round(avg(score), 2) scores FROM `stats` GROUP by level", 
        (err, result)=> {
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        })
    }else{
        db.query("select level, count(*) / (select count(*) from user) levels from user GROUP by level;", 
        (err, result)=> {
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        })
    }
})
app.post("/adminSavedQsts", (req, res)=> {
    const level= req.body.level
    db.query("select b.*, u.level, u.id, count(qstId) nb from userqsts u join blanks b where u.qstId= b.id and level= ? group by qstId ORDER by u.id desc;", level, 
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})
app.post("/dataCsv", (req, res)=> {
    const type= req.body.type
    if(type=== 0){
        db.query("select * from blanks", (err, result)=> {
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        })
    }
    else if(type=== 1){
        db.query("SELECT b.*, count(u.qstId) nbSaves FROM `userqsts` u join blanks b where u.qstId= b.id GROUP by u.qstId", (err, result)=> {
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        })
    }
    else if(type=== 2){
        db.query("SELECT t.salim, t.weak, t.title, s.score, s.fails FROM `stats` s join type t where s.level= t.level GROUP by t.level, s.userId", (err, result)=> {
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        })
    }
})

app.post("/getChatUsers", (req, res)=> {
    const level= req.body.level
    const googleId= req.body.googleId
    const type= req.body.type
    if(type=== "is"){
        db.query(`select * from user where googleId<> "admin" and level= ? and googleId<> ? order by rand() limit 3`, [level, googleId],
        (err, result)=> {
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        })
    }else if(type=== "sup"){
        db.query(`select * from user where googleId<> "admin" and level> ? and googleId<> ? order by rand() limit 3`, [level, googleId],
        (err, result)=> {
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        })
    }else if(type=== "inf"){
        db.query(`select * from user where googleId<> "admin" and level< ? and googleId<> ? order by rand() limit 3`, [level, googleId],
        (err, result)=> {
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        })
    } 
})

app.post("/getMsgs", (req, res)=> {
    const userId= req.body.userId
    const guestId= req.body.guestId
    db.query("select * from msg where (userId= ? and guestId= ?) or (guestId= ? and userId= ?)", [userId, guestId, userId, guestId],
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})
app.post("/getMsgsOld", (req, res)=> {
    const userId= req.body.userId
    db.query("select f.*, u.name, u.image, u.level from (SELECT *, max(id) max FROM msg where userId= ? GROUP by guestId order by max desc) as f join user u where f.guestId= u.googleId order by f.max desc", userId,
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})
app.post("/sendMsg", (req, res)=> {
    const userId= req.body.userId
    const guestId= req.body.guestId
    const text= req.body.text
    db.query("insert into msg (userId, guestId, text) values (?, ?, ?)", [userId, guestId, text],
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            db.query("select max(id) max from msg", (errId, resultId)=> {
                if(err){
                    console.log(err)
                }else{
                    res.send(resultId)
                }
            })
        }
    })
})
app.post("/delMsg", (req, res)=> {
    const id= req.body.id
    db.query("delete from msg where id= ?", id, (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send("DELMsg")
        }
    })
})

app.post("/getNotes", (req, res)=> {
    const level= req.body.level
    db.query("select * from notes where level= ?", level, (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})
app.post("/getNotesStat", (req, res)=> {
    const level= req.body.level
    if(level< 0){
        db.query("select f.level, f.rating, f.nbRating, sum(nbRating) over(PARTITION by f.level) nbTotal from(SELECT level, rating, count(*) nbRating FROM `notes` GROUP by level, rating) as f", (err, result)=> {
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        })
    }else{
        db.query("select f.level, f.rating, f.nbRating, sum(nbRating) over(PARTITION by f.level) nbTotal from(SELECT level, rating, count(*) nbRating FROM `notes` GROUP by level, rating) as f where f.level= ?", level, (err, result)=> {
            if(err){
                console.log(err)
            }else{
                res.send(result)
            }
        })
    }
})
app.post("/sendNote", (req, res)=> {
    const userId= req.body.userId
    const level= req.body.level
    const rating= req.body.rating
    const note= req.body.note
    db.query("insert into notes (userId, level, rating, note) values (?, ?, ?, ?)", [userId, level, rating, note], (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send("Note Ins")
        }
    })
})

server.listen(3030, ()=> {
    console.log("server started")
})