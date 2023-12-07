const express = require('express')
const router = express.Router()
const Pelicula = require('../models/pelicula')
const Director = require('../models/director')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//Rutas para los peliculas y busqueda por fecha y titulo
router.get('/', async (req, res) => {
    let query = Pelicula.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try{
        const peliculas = await query.exec()
        res.render('peliculas/index', {
            peliculas: peliculas,
            searchOptions: req.query
        })
    }catch{
        res.redirect('/')
    }
})

//Nuevo pelicula
router.get('/new', async (req, res) => {
    renderNewPage(res, new Pelicula())
})

//Crear pelicula
router.post('/',  async (req, res) => {
    const pelicula = new Pelicula({
        title: req.body.title,
        director: req.body.director,
        publishDate: new Date(req.body.publishDate),
        duration: req.body.duration,
        description: req.body.description,
        trailer: req.body.trailer
   })
   saveCover(pelicula, req.body.cover)

    try{
        const newPelicula = await pelicula.save()
        res.redirect('peliculas/${newPelicula.id}')
    }catch(error){
        console.error(error); // Imprimir el error en la consola
        renderNewPage(res, pelicula, true)
   }
})

//Mostrar peliculas
router.get('/:id', async (req, res) => {
    try {
      const peliculas = await Pelicula.findById(req.params.id)
                             .populate('director')
                             .exec()
      res.render('peliculas/show', { pelicula: peliculas })
    } catch {
      res.redirect('/')
    }
  })
  
  // Editar pelicula
  router.get('/:id/edit', async (req, res) => {
    try {
      const pelicula = await Pelicula.findById(req.params.id)
      renderEditPage(res, pelicula)
    } catch {
      res.redirect('/')
    }
  })
  
  // Update pelicula Route 
  router.put('/:id', async (req, res) => {
    let pelicula
  
    try {
      pelicula = await Pelicula.findById(req.params.id)
      pelicula.title = req.body.title
      pelicula.director = req.body.director
      pelicula.publishDate = new Date(req.body.publishDate)
      pelicula.duration = req.body.duration
      pelicula.description = req.body.description
      pelicula.trailer = req.body.trailer
      if (req.body.cover != null && req.body.cover !== '') {
        saveCover(pelicula, req.body.cover)
      }
      await pelicula.save()
      res.redirect(`/peliculas/${pelicula.id}`)
    } catch {
      if (pelicula != null) {
        renderEditPage(res, pelicula, true)
      } else {
        redirect('/')
      }
    }
  }) 
  
  // Pagina para borrar pelicula
  router.delete('/:id', async (req, res) => {
    let pelicula
    try {
      pelicula = await Pelicula.findById(req.params.id)
      await pelicula.deleteOne()
      res.redirect('/peliculas')
    } catch {
      if (pelicula != null) {
        res.render('peliculas/show', {
          pelicula: pelicula,
          errorMessage: 'No se pudo borrar el pelicula'
        })
      } else {
        res.redirect('/')
      }
    }
  })

async function renderNewPage(res, pelicula, hasError = false){
    renderFormPage(res, pelicula, 'new', hasError)
}

async function renderFormPage(res, pelicula, form, hasError = false){
    try{
        const directores = await Director.find({})
        const params = {
            directores: directores,
            pelicula: pelicula
        }
        if (hasError){
            if(form === 'edit'){
                params.errorMessage = 'Error al actualizar pelicula'
            } else {
                params.errorMessage = 'Error al crear pelicula'
            }
        }
        res.render(`peliculas/${form}`, params)
    } catch {
        res.redirect('/peliculas')
    }
}

async function renderEditPage(res, pelicula, hasError = false){
    renderFormPage(res, pelicula, 'edit', hasError)
}

function saveCover(pelicula, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
      pelicula.coverImage = new Buffer.from(cover.data, 'base64')
      pelicula.coverImageType = cover.type
    }
  }

module.exports = router