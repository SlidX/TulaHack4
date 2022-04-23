const express = require("express")
const MongoClient = require("mongodb").MongoClient

const app = express()

// var session = require('express-session');
// var redis   = require('redis');

// const client  = redis.createClient({
//     host: 'localhost',
//     port: 6379
// })
// var redisStorage = require('connect-redis')(session);
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser('secret key'));

// client.on("error", function(error) {
//     console.log(error);
// });

// app.use(
//     session({
//       store: new redisStorage({
//         host: "127.0.0.1",
//         port: 6379,
//         client: client,
//       }),
//       secret: 'PlantsCare',
//       resave: true,
//       saveUninitialized: true,
//     })
//   )
//   app.set('trust proxy', 1);
const url = "mongodb://localhost:27017"

const mongoClient = new MongoClient(url)

app.use(express.static(`${__dirname}/`))



async function creatUser(personEmail,personPassword){
    try{
        await mongoClient.connect()
        const db = mongoClient.db("Person")
        const emailColl = db.collection("email")
        const passColl = db.collection("password")
        let id = 0
        await emailColl.count().then((count)=>{
            id = count
        })
        await emailColl.insertOne({
            "mail": personEmail,
            "id": id
        })
        await passColl.insertOne({
            "password": Buffer.from(personPassword).toString('base64'),
            "id": id
        })
        console.log(personEmail,personPassword)
    }catch(err){
        console.log(err)
    }finally {
        await mongoClient.close()
    }
}

async function creatPlant(plantName,plantType,growthTime,wateringPeriod){
    try{
        await mongoClient.connect()
        const db = mongoClient.db("Plant")
        const nameColl = db.collection("name")
        const typeColl = db.collection("type")
        const growthColl = db.collection("growth")
        const wateringColl = db.collection("watering")
        let id = 0
        await nameColl.count().then((count)=>{
            id = count
        })
        await nameColl.insertOne({
            "name": plantName,
            "id": id
        })
        await typeColl.insertOne({
            "type": plantType,
            "id": id
        })
        await growthColl.insertOne({
            "type": growthTime,
            "id": id
        })
        await wateringColl.insertOne({
            "type": wateringPeriod,
            "id": id
        })
    }catch(err){
        console.log(err)
    }finally {
        await mongoClient.close()
    }
}

async function findUser(mail, password){
    try{
        await mongoClient.connect()
        const bd = mongoClient.db("Person")
        const emailColl = bd.collection("email")
        const findMail = await emailColl.findOne({email: mail})
        if(findMail != null){
            const passColl = bd.collection("password")
            const findPass = await passColl.findOne({
                id: findMail.id
            })
            if(Buffer.from(findPass.password , 'base64').toString("ascii") == password){
                console.log("user ok!")  
                return true
            }
            else{
                console.log("Пароль не тот!")
            }
        }
        else{
            console.log("нет такого мыла")
        }
        return false
    }catch(err){
        console.log(err)
    }finally{
        await mongoClient.close()
    }
}

async function getProfile(mail){
    try{
        var obj = {
            name: String,
            plants: Array
        }
        await mongoClient.connect()
        const db = mongoClient.db("Person")
        const emailColl = db.collection("email")
        obj.name = await emailColl.findOne({
            email: mail
        })
        const plants = mongoClient.db(obj.name.id.toString())
        const plantsColl = plants.collection("plants")
        obj.plants = await plantsColl.find().toArray()
        console.log(obj)
    }catch(err){
        console.log(err)
    }finally{
        await mongoClient.close()
        return obj
    }
}

const urlencodedParser = express.urlencoded({extended : false})

app.get('/checkplant', (req,res)=>{
    creatPlant("cactus","derevo",3,"nikogda")
    res.send("new plant")
})

app.get('/checkperson', (req,res)=>{
    creatUser("fast35890@gmail.com","123")
    res.send("new person")
})

app.get('/profile',(req,res)=>{
    // if(!req.session.key){
    //     res.redirect("/")
    // }else{
    //     const profile = getProfile(req.session.key["email"])
    //     profile.then((profile)=>{
    //         res.send(profile)
    //     })
    // }
})

app.get('/', (req,res)=>{
    
    res.sendFile(`${__dirname}/index.html`)
    
})

app.get('/signin/:login/:pass',(req,res)=>{
    res.set('Access-Control-Allow-Origin', '*');
    if(findUser(req.params.login , req.params.pass))
    { 
        return req.params.login
    }else{return false}
})

app.get('/:login/:pass',urlencodedParser,(req,res)=>{
    res.set('Access-Control-Allow-Origin', '*');
    creatUser(req.params.login,req.params.pass)
})

app.listen(8001)