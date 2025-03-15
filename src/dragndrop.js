    // Variable global para almacenar el id de la imagen
    let draggedImageId = null;

    // Función para permitir el dragover
    function allowDrop(event) {
        event.preventDefault();
    }

    // Función para manejar el drop de la imagen
    function drop(event) {
        event.preventDefault();
        
        // Obtener el id de la imagen arrastrada
        const data = event.dataTransfer.getData("text");
        const draggedImage = document.getElementById(data);

        // Almacenar el id en la variable global
        draggedImageId = draggedImage.id;

        // Colocar la imagen dentro de la zona de drop
        const dropZone = document.querySelector('.drop-zone');

        // Crear una nueva imagen en la zona de drop
        const img = document.createElement('img');
        img.id = 'draggedImage';
        img.src = draggedImage.src;
        
        // Añadir la imagen al área de drop y ocultar el texto
        dropZone.innerHTML = '';  // Eliminar el texto
        dropZone.appendChild(img);  // Agregar la imagen

        // Ocultar el texto y mostrar la imagen
        document.querySelector('.drop-zone p').style.display = 'none';
    }

    // Función para arrastrar la imagen
    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }



// Función para regresar al menú
function goBackToMenu() {
    document.getElementById("dragDropArea").style.display = "none"; // Ocultar la selección de personajes
    document.getElementById("menu").style.display = "flex"; // Mostrar el menú
    const canvas = document.getElementById("gameCanvas");
    canvas.style.display = "block"; 
}
