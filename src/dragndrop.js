
        // Función para permitir el dragover
        function allowDrop(event) {
            event.preventDefault();
        }

        // Función para manejar el drop de la imagen
        function drop(event) {
            event.preventDefault();
            const data = event.dataTransfer.getData("text");
            const draggedImage = document.getElementById(data);
            document.getElementById("draggedImage").src = draggedImage.src;
            document.getElementById("draggedImage").style.display = "block";
        }

        // Función para arrastrar la imagen
        function drag(ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        }

