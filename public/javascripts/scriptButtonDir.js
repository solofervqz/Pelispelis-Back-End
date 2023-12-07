// Función para mostrar/ocultar los botones del director
function mostrarBotones(directorId) {
    const btnRow = document.querySelector(`#director_${directorId} .btn-open`);
    btnRow.classList.add('show');
  }
  
  function ocultarBotones(directorId) {
    const btnRow = document.querySelector(`#director_${directorId} .btn-open`);
    btnRow.classList.remove('show');
  }
  
