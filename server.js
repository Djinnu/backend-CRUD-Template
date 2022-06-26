const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 8000
const cors = require('cors')
const { response } = require('express')
require('dotenv').config()

app.use(cors())

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'songs'

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.get('/', (req, res) => {
    db.collection('songs').find().sort({likes: -1}).toArray()
    .then(data => {
        res.render('index.ejs', {info: data})
    })
    .catch(error => console.error(error))
})


app.get('/api/:songName', (req, res) => {
    const songName = req.params.songName
    console.log(songName)
    db.collection('songs').find({'title': songName}).toArray()
    .then(data => {
        res.json(data)
    })
    .catch(error => console.error(error))
})


app.post('/addSong', (req, res) => {
    db.collection('songs').insertOne({title: req.body.title,
    artist: req.body.artist,
    id: req.body.id, likes: 0})
    .then(result => {
        console.log('Song added')
        res.redirect('/')
    })
})

app.put('/addOneLike', (req, res) => {
    db.collection('songs').updateOne({title: req.body.title, artist: req.body.artist, likes: req.body.likes}, {
        $set: {
            likes: req.body.likes + 1
        }
    }, {
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Added one like')
        res.json('Like added')
    })
    .catch(error => console.error(error))
})

app.delete('/deleteSong', (req, res) => {
    db.collection('songs').deleteOne({title: req.body.title})
    .then(result => {
        console.log('Song deleted')
        res.json('Song Deleted')
    })
    .catch(error => console.error(error))
})



app.listen(process.env.PORT || PORT, () => {
    console.log(`server is running on port ${PORT}, better go catch it!`)
})