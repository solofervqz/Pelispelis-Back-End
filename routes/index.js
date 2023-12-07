const express = require('express')
const router = express.Router()
const Pelicula = require('../models/pelicula')

// Mostrar las últimas 10 películas agegadas
router.get('/', async (req, res) => {
    let peliculas
    try{
        peliculas= await Pelicula.find().sort({createdAt: 'desc'}).limit(10).exec()
    }catch{
        peliculas = []
    }
    res.render('index', {peliculas: peliculas}) // Renderiza la vista principal con la lista de películas
})

// Exporta el router
module.exports = router