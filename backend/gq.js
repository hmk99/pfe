//PREPA
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
//VAR
const pronoms= ["أنا", "نحن", "أنت", "أنتِ", "أنتما", "أنتما مؤ", "أنتم", "أنتن", "هو", "هي", "هما", "هما مؤ", "هم", "هن"]
const pronomsImp= ["أنت", "أنتِ", "أنتما", "أنتما مؤ", "أنتم", "أنتن"]
let ns= [1, 2, 3, 4]
var min
var rep
//FCTS
Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)]
}

const rand= (x, y, z)=> {
    let random= Math.floor(Math.random() * 14)
    while(random== x || random== y || random== z){
        random= Math.floor(Math.random() * 14)
    }
    return random
}
const randImp= (x, y, z)=> {
    let random= Math.floor(Math.random() * 6)
    while(random== x || random== y || random== z){
        random= Math.floor(Math.random() * 6)
    }
    return random
}
const Min= (a, b)=> {
    if(a< b){
        return a
    }else{
        return b
    }
}

const Replace= (verb)=> {
    if(verb!== undefined){
        return verb.replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, '')
    }else{
        return ""
    }
}

const shuffle= ()=> {
    for (let i = ns.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ns[i], ns[j]] = [ns[j], ns[i]];
    }
}

const corr= (pronom)=> {
    return pronoms.indexOf(pronom)
}
const corrImp= (pronom)=> {
    return pronomsImp.indexOf(pronom)+ 2
}
//API
app.post('/getVerbes', (req, res)=> {
    const salim= req.body.salim
    const weak= req.body.weak
    db.query("select * from verblist where salim= ? and weak= ?", [salim, weak], 
    (errList, resultList)=> {
        if(errList){
            console.log(errList)
        }
        else{
            res.send(resultList)
        }
    })
})

app.post('/getTypes', (req, res)=> {
    db.query("SELECT weak, salim FROM `verblist` WHERE weak is not null and salim is not null GROUP BY weak, salim", 
    (err, result)=> {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})

const conj= (verb, temps)=> {
    var uri = `https://qutrub.arabeyes.org/api?verb=${verb}`
    var url = encodeURI(uri)
    return axios.get(url)
    .then((res)=> {
        const data= res.data.result
        const array= Object.keys(data)
        let final= []
        for (let i = 1; i < array.length; i++) {
            final.push(data[i][temps]) 
        }
        return final
    })
    .catch(err=> {
        console.log(err)
    })
}
/*
app.post("/insert", (req, res)=> {
    let first= false
    axios.get("http://localhost:5000/getTypes")
    .then((t)=> {
        for (let j = 0; j < t.data.length; j++) {
            axios.post("http://localhost:5000/getVerbes", {salim: t.data[j].salim, weak: t.data[j].weak})
            .then((r)=> {
                min= Min(r.data.length, 33)
                for (let i = 0; i < min; i++) {
                    let pronom= pronoms.sample()
                    let k= corr(pronom)
                    let op1= rand(k)
                    let op2= rand(k, op1)
                    let op3= rand(k, op1, op2)
                    conj(r.data[i].verb, 1).then(q=> {
                        shuffle()
                        if(q[k]!== undefined){
                            db.query(`insert into blanks (salim, weak, temps, qst, pronom, rep, repDc, op${ns[0]}, op${ns[1]}, op${ns[2]}, op${ns[3]}) values ("${r.data[i].salim}", "${r.data[i].weak}", 1, "${r.data[i].verb}", "${pronom}", "${q[k]}", "${Replace(q[k])}", "${q[k]}", "${q[op1]}", "${q[op2]}", "${q[op3]}")`)
                        }
                    })
                }
                for (let i = 0; i < min; i++) {
                    let pronom= pronoms.sample()
                    let k= corr(pronom)
                    let op1= rand(k)
                    let op2= rand(k, op1)
                    let op3= rand(k, op1, op2)
                    conj(r.data[i].verb, 2).then(q=> {
                        shuffle()
                        if(q[k]!== undefined){
                            db.query(`insert into blanks (salim, weak, temps, qst, pronom, rep, repDc, op${ns[0]}, op${ns[1]}, op${ns[2]}, op${ns[3]}) values ("${r.data[i].salim}", "${r.data[i].weak}", 2, "${r.data[i].verb}", "${pronom}", "${q[k]}", "${Replace(q[k])}", "${q[k]}", "${q[op1]}", "${q[op2]}", "${q[op3]}")`)
                        }
                    })
                }
                for (let i = 0; i < min; i++) {
                    let pronom= pronoms.sample()
                    let k= corr(pronom)
                    let op1= rand(k)
                    let op2= rand(k, op1)
                    let op3= rand(k, op1, op2)
                    conj(r.data[i].verb, 3).then(q=> {
                        shuffle()
                        if(q[k]!== undefined){
                            db.query(`insert into blanks (salim, weak, temps, qst, pronom, rep, repDc, op${ns[0]}, op${ns[1]}, op${ns[2]}, op${ns[3]}) values ("${r.data[i].salim}", "${r.data[i].weak}", 3, "${r.data[i].verb}", "${pronom}", "${q[k]}", "${Replace(q[k])}", "${q[k]}", "${q[op1]}", "${q[op2]}", "${q[op3]}")`)  
                        }
                    })
                }
                for (let i = 0; i < min; i++) {
                    let pronom= pronoms.sample()
                    let k= corr(pronom)
                    let op1= rand(k)
                    let op2= rand(k, op1)
                    let op3= rand(k, op1, op2)
                    conj(r.data[i].verb, 4).then(q=> {
                        shuffle()
                        if(q[k]!== undefined){
                            db.query(`insert into blanks (salim, weak, temps, qst, pronom, rep, repDc, op${ns[0]}, op${ns[1]}, op${ns[2]}, op${ns[3]}) values ("${r.data[i].salim}", "${r.data[i].weak}", 4, "${r.data[i].verb}", "${pronom}", "${q[k]}", "${Replace(q[k])}", "${q[k]}", "${q[op1]}", "${q[op2]}", "${q[op3]}")`)  
                        }
                    })
                }
                for (let i = 0; i < min; i++) {
                    let pronom= pronomsImp.sample()
                    let k= corrImp(pronom)
                    let op1= randImp(k)
                    let op2= randImp(k, op1)
                    let op3= randImp(k, op1, op2)
                    conj(r.data[i].verb, 6).then(q=> {
                        shuffle()
                        if(q[k]!== undefined){
                            db.query(`insert into blanks (salim, weak, temps, qst, pronom, rep, repDc, op${ns[0]}, op${ns[1]}, op${ns[2]}, op${ns[3]}) values ("${r.data[i].salim}", "${r.data[i].weak}", 6, "${r.data[i].verb}", "${pronom}", "${q[k]}", "${Replace(q[k])}", "${q[k]}", "${q[op1]}", "${q[op2]}", "${q[op3]}")`)  
                        }
                    })
                }
                for (let i = 0; i < min; i++) {
                    let pronom= pronoms.sample()
                    let k= corr(pronom)
                    let op1= rand(k)
                    let op2= rand(k, op1)
                    let op3= rand(k, op1, op2)
                    conj(r.data[i].verb, 8).then(q=> {
                        shuffle()
                        if(q[k]!== undefined){
                            db.query(`insert into blanks (salim, weak, temps, qst, pronom, rep, repDc, op${ns[0]}, op${ns[1]}, op${ns[2]}, op${ns[3]}) values ("${r.data[i].salim}", "${r.data[i].weak}", 8, "${r.data[i].verb}", "${pronom}", "${q[k]}", "${Replace(q[k])}", "${q[k]}", "${q[op1]}", "${q[op2]}", "${q[op3]}")`) 
                        }
                    })
                }
                for (let i = 0; i < min; i++) {
                    let pronom= pronoms.sample()
                    let k= corr(pronom)
                    let op1= rand(k)
                    let op2= rand(k, op1)
                    let op3= rand(k, op1, op2)
                    conj(r.data[i].verb, 9).then(q=> {
                        shuffle()
                        if(q.length> 0 && q[k]!== undefined){
                            db.query(`insert into blanks (salim, weak, temps, qst, pronom, rep, repDc, op${ns[0]}, op${ns[1]}, op${ns[2]}, op${ns[3]}) values ("${r.data[i].salim}", "${r.data[i].weak}", 9, "${r.data[i].verb}", "${pronom}", "${q[k]}", "${Replace(q[k])}", "${q[k]}", "${q[op1]}", "${q[op2]}", "${q[op3]}")`)
                        }
                    })
                }
            })
            .catch(errr=> {
                console.log(errr)
            })
        }
    })
    .catch(errt=> {
        console.log(errt)
    })                                                              
})
*/

app.listen(5000,()=>{
    console.log('server started')
})

