if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require ('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const directorRouter = require('./routes/directores')
const peliculaRouter = require('./routes/peliculas')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views') //de donde viene el views
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', error => console.log('Conectado a Mongoose'))


//ROUTES
app.use('/', indexRouter)
app.use('/directores', directorRouter)
app.use('/peliculas', peliculaRouter)

app.listen(process.env.PORT || 3000)