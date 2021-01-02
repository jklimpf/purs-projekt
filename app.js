//Učitavanje potrebnih npm modula
const mqtt = require('mqtt')
const dotenv = require('dotenv')
const mongodb = require('mongodb')
const {sendWarningMailSoba1,sendWarningMailSoba2, sensor1Warning, sensor2Warning, dbError} = require ('./mail')
const express = require('express')
const path = require('path')
const hbs = require ('hbs')

//učitavanje config direktorija
dotenv.config({path: './config/dev.env'}) 

const app = express()

const port = process.env.PORT || 3000

const webDirectoryPath = path.join(__dirname, './web')
const viewsPath = path.join(__dirname, './templates/views')
const partialsPath = path.join(__dirname, './templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
app.use(express.static(webDirectoryPath))

var temp1, temp2, gasSensor, gasSensor2                
var poslanoSoba1 = false
var poslanoSoba2 = false
var poslanoSenzor1 = false
var poslanoSenzor2 = false
var poslanoDB = false
var lastTimeMeasured

// Definiranje baze podataka (mongoDB)
const MongoClient = mongodb.MongoClient                     

const connectionURL = process.env.MONGO_URI
const databaseName = 'node_dht_projekt'

//Provjeri uvjete (ako su zadovoljeni pošalji obavijest, ali samo jedanput)
const conditions = () =>{
    if(temp1 === 'nan') {
        if(poslanoSenzor1 === false){
             sensor1Warning()
             poslanoSenzor1 = true
         }
     }
    else poslanoSenzor1 = false

    if(temp2 === 'nan') {
        if(poslanoSenzor2 === false){
             sensor2Warning()
             poslanoSenzor2 = true
         }
     }
    else  poslanoSenzor2 = false

    if(temp1 > 27 || gasSensor > 1000) {
        if(poslanoSoba1 === false){
            sendWarningMailSoba1()

            // Ako je alarm uključen (uvjet zadovoljen) spremi taj događaj u bazu podataka
            MongoClient.connect(connectionURL, { useNewUrlParser: true,  useUnifiedTopology: true }, (error, client) =>{
                if(error) {
                    if(poslanoDB === false){
                        dbError()
                        poslanoDB = true
                    }
                    return console.log('Unable to connect to database!')
                 }
                 else poslanoDB = false
                 
                const db = client.db(databaseName)
            db.collection('alarmi').insertOne({
                soba: 'soba 1',
                date: new Date()
            })})
            poslanoSoba1 = true
        }
    }

    else poslanoSoba1 = false

    if(temp2 > 27 || gasSensor2 > 1000) {
        if(poslanoSoba2 === false){
            sendWarningMailSoba2()

            // Ako je alarm uključen (uvjet zadovoljen) spremi taj događaj u bazu podataka
            MongoClient.connect(connectionURL, { useNewUrlParser: true,  useUnifiedTopology: true }, (error, client) =>{
                if(error) {
                    if(poslanoDB === false){
                        dbError()
                        poslanoDB = true
                    }
                    return console.log('Unable to connect to database!')
                 }
                 else poslanoDB = false

                const db = client.db(databaseName)
            db.collection('alarmi').insertOne({
                soba: 'soba 2',
                date: new Date()
            })})
            poslanoSoba2 = true
        }
    }
    else poslanoSoba2 = false
}

const client = mqtt.connect('mqtt://mqtt.thingspeak.com', {             //spajanje na mqtt
    username: process.env.USERNAME,
    password: process.env.PASSWORD
})

const topic = process.env.TOPIC

client.on('connect', function() {
    console.log('connected')

    client.subscribe(topic, function(err) {
        if(! err) {
            console.log('subscribed')      
        }
    })
})

client.on('message', function(topic, message) {

    //raščlaniti JSON primljen s ThingSpeaka 
    const parsedMsg = JSON.parse(message)
         temp1 = parsedMsg.field1
         temp2 = parsedMsg.field2
         gasSensor = parsedMsg.field3
         gasSensor2 = parsedMsg.field4

         //ispitati uvjete (temperatura i plin)
         conditions()   
    
         //spremanje svakog podatka u bazu podataka 
    MongoClient.connect(connectionURL, { useNewUrlParser: true,  useUnifiedTopology: true }, (error, client) =>{
        if(error) {
            if(poslanoDB === false){
                dbError()
                poslanoDB = true
            }
            return console.log('Unable to connect to database!')
         }
         else poslanoDB = false
         
         const db = client.db(databaseName)
 
         db.collection('soba1').insertOne({
             temperatura: temp1.toString(),
             plin: gasSensor.toString(),
             date: new Date(),
         })    
        
         db.collection('soba2').insertOne({
            temperatura: temp2.toString(),
            plin: gasSensor2.toString(),
            date: new Date()
        })    
    })
    lastTimeMeasured = new Date()
    console.log('Temperatura1 = '+temp1 + '   Plin1 = '+gasSensor + '   Temperatura2 = '+temp2 + '   Plin2 = '+gasSensor2)
})

//routevi za web stranicu
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'O stranici'
    })
})

app.get('', (req, res) => {
    res.render('index', {
        title: 'Početna'
       
    })
})

app.get('/soba1', (req, res) => {
    res.render('soba1', {
        title: 'Soba 1',
        temp1: temp1,
        gasSensor: gasSensor,
        time: lastTimeMeasured    
    })
})

app.get('/soba2', (req, res) => {
    res.render('soba2', {
        title: 'Soba 2',
        temp2: temp2,
        gasSensor2: gasSensor2,
        time: lastTimeMeasured
    })
})

app.listen(port, () =>{
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port} ` )
})
