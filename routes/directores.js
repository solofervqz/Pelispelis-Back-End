const express = require('express')
const router = express.Router()
const Director = require('../models/director')
const Pelicula = require('../models/pelicula')

//Rutas para mostrar todos los directores o buscar por nombre
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const directores = await Director.find(searchOptions)
        res.render('directores/index',  { 
            directores: directores, 
            searchOptions : req.query
        })
    } catch{
        res.redirect('/')
    }    
})

//Nuevo director
router.get('/new', (req, res) => {
    res.render('directores/new', {director: new Director()})
})

//Crear director
router.post('/', async (req, res) => {
    const director = new Director({
        name: req.body.name
    })
    try {
        const newDirector = await director.save();
        res.redirect(`directores/${newDirector.id}`);
    } catch (err) {
        res.render('directores/new', {
            director: director,
            errorMessage: 'Error al crear director'
        });
    }
})

//Mostrar director
router.get('/:id', async (req, res) => {
    try {
        const director = await Director.findById(req.params.id)
        const pelicula = await Pelicula.find({ director: director.id }).limit(6).exec()
        res.render('directores/show', {
          director: director,
          peliculasByDirector: pelicula
        })
      } catch {
        res.redirect('/')
      }
})

router.get('/:id/edit', async (req, res) => {
    try{
        const director = await Director.findById(req.params.id)
        res.render('directores/edit', {director: director})
    }catch{
        res.redirect('/directores')
    }
})

//editar dir
router.put('/:id', async (req, res) => {
    let director
    try {
      director = await Director.findById(req.params.id)
      director.name = req.body.name
      await director.save()
      res.redirect(`/directores/${director.id}`)
    } catch {
      if (director == null) {
        res.redirect('/')
      } else {
        res.render('directores/edit', {
          directorr: director,
          errorMessage: 'Error al actualizar director'
        })
      }
    }
  })

//Borrar un director
router.delete('/:id', async (req, res) => {
  let director;
  try {
    director = await Director.findById(req.params.id);
    
    await Director.findOneAndDelete({ _id: req.params.id });

    res.redirect('/directores');
  } catch (error) {
    if (director == null) {
      res.redirect('/');
    } else {
      console.error(error);
      res.redirect(`/directores/${director.id}`);
    }
  }
});

module.exports = router