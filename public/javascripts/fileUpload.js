//Obtener estilos de la raiz
const rootStyles = window.getComputedStyle(document.documentElement)

// Verificion del ancho y rel de la portada
if (rootStyles.getPropertyValue('--pelicula-cover-width-large') != null && rootStyles.getPropertyValue('--pelicula-cover-width-large') !== '') {
  ready()
} else {
  document.getElementById('main-css').addEventListener('load', ready)
}

// Procesar la carga de archivos al momento que la pagina esté lista
function ready() {
  const coverWidth = parseFloat(rootStyles.getPropertyValue('--pelicula-cover-width-large'))
  const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--pelicula-cover-aspect-ratio'))
  const coverHeight = coverWidth / coverAspectRatio
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / coverAspectRatio,
    imageResizeTargetWidth: coverWidth,
    imageResizeTargetHeight: coverHeight
  })
  
  FilePond.parse(document.body)
}