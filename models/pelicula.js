// Importa la biblioteca mongoose
const mongoose = require('mongoose')

// Definir el esquema para el modelo Pelicula
const peliculaSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    publishDate:{
        type: Date,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    },
    coverImage: {
      type: Buffer,
      required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    director:{ // Referencia al director
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'Director'
    },
    trailer: {
        type: String,
        required: true
    },
})

// Método virtual para obtener la ruta de la imagen de portada
peliculaSchema.virtual('coverImagePath').get(function(){
    if(this.coverImage != null && this.coverImageType != null){
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

// Exporta el modelo Pelicula con el esquema definido
module.exports = mongoose.model('Pelicula', peliculaSchema)