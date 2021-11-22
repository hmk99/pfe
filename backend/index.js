 const express= require("express")
const app= express()
const mysql= require("mysql")
const cors= require("cors")
const axios= require("axios")


app.use(cors())
app.use(express.json())

const db= mysql.createConnection({
    user: 'hmk',
    host: 'localhost',
    password: 'hmk@99',
    database: 'pfe'
})

app.get("/conj", async (req, res) => {
	try {
		const response = await axios({
			url: "https://qutrub.arabeyes.org/?verb=%D9%83%D8%AA%D8%A8",
			method: "get",
		});
		res.status(200).json(response.data.json)
        console.log(response.data)
	} catch (err) {
		res.status(500).json({ message: err })
	}
})

app.get("/getusers", (req, res)=> {
    db.query("select * from test", (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        } 
    })
})
app.get("/todos", (req, res)=> {
    db.query("select * from todo order by id desc", (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
            console.log(result)
        } 
    })
})

app.post("/addUser", (req, res)=> {
    const nom= req.body.nom
    const prenom= req.body.prenom
    const nickname= req.body.nickname
    db.query('insert into test (nom, prenom, nickname) values (?,?,?)', [nom, prenom, nickname],
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            console.log("inserted")
        }
    })
})
app.post("/addTodo", (req, res)=> {
    const todo= req.body.todo
    const date= req.body.date
    db.query('insert into todo (todo, date) values (?, ?)', [todo, date],
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            console.log("inserted")
        }
    })
})

app.delete("/delete/:id", (req, res)=> {
    const id= req.params.id
    db.query("delete from test where id= ?", id, (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send("deleted")
            console.log("deleted")
        }
    })
})
app.delete("/deleteTodo/:id", (req, res)=> {
    const id= req.params.id
    db.query("delete from todo where id= ?", id, (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send("deleted")
            console.log("deleted")
        }
    })
})

app.post("/update", (req, res)=> {
    const id= req.body.id
    const nickname= req.body.nickname
    db.query("update test set nickname= ? where id=?", [nickname, id],
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            console.log("updated")
        }
    })
})
app.post("/updateTodo", (req, res)=> {
    const id= req.body.id
    const todo= req.body.todo
    db.query("update todo set todo= ? where id=?", [todo, id],
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            console.log("updated")
        }
    })
})


app.get("/articles", (req, res)=> {
    db.query("select * from article order by id desc", 
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})

app.listen(5000,()=>{
    console.log('server started')
})