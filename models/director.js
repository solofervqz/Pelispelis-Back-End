// Importa la biblioteca mongoose y el modelo Pelicula para establecer la relación entre ellos
const mongoose = require('mongoose')
const Pelicula = require('./pelicula')

// Definir el esquema para el modelo Director
const directorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

// Middleware que se ejecuta antes borrar un director
directorSchema.pre('findOneAndDelete', async function (next) {
    try {
      const directorId = this.getFilter()._id;
      const peliculas = await Pelicula.find({ director: directorId });
  
      if (peliculas.length > 0) {
        throw new Error('El director tiene películas asociadas');
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  });

/*
directorSchema.pre('deleteOne', function(next){
    Pelicula.find({director: this.id}, (err, peliculas) =>{
        if (err) {
            console.error('Error searching for movies:', err)
            next(err)
        } else if (peliculas.length > 0) {
            next(new Error('El director aun tiene películas publicadas '))
        } else {
            next()
        }
    })
})
*/

// Exporta el modelo Director con el esquema definido
module.exports = mongoose.model('Director', directorSchema)