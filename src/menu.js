const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let pacManX = 50;
let pacManY = canvas.height / 2;
let pacManMouth = 0.2;
let mouthDirection = 1;
const dots = [];

for (let i = 50; i < canvas.width - 50; i += 50) {
    dots.push({ x: i, y: pacManY });
}

function drawPacMan(x, y) {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(x, y, 50, pacManMouth * Math.PI, (2 - pacManMouth) * Math.PI);
    ctx.lineTo(x, y);
    ctx.fill();
}

function drawDots() {
    ctx.fillStyle = "white";
    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function updateScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDots();
    drawPacMan(pacManX, pacManY);
    pacManMouth += 0.05 * mouthDirection;
    if (pacManMouth >= 0.4 || pacManMouth <= 0.1) {
        mouthDirection *= -1;
    }
    pacManX += 2;
    if (pacManX > canvas.width + 50) {
        pacManX = -50;
    }
    requestAnimationFrame(updateScene);
}
updateScene();

function showAlert(message) {
    const alertBox = document.getElementById("alerta");
    const alertMessage = document.getElementById("alertMessage");
    alertMessage.textContent = message;
    alertBox.style.display = "flex";
}

function closeAlert() {
    document.getElementById("alerta").style.display = "none";
}

function validatePlayerName(name) {
    const regex = /^[a-zA-Z0-9_]{4,8}$/;
    return regex.test(name);
}

function startGame() {
    let playerName = document.getElementById("playerName").value.trim();
    
    
    if (playerName.trim() === "") {
        const selectedName = document.getElementById("existingNames").value;
        if (selectedName === "") {
            showAlert("¡Ingresa un nombre!");
            return;
        }
        playerName = selectedName;
    }


    if (!validatePlayerName(playerName)) {
        showAlert("El alias debe tener entre 4 y 8 caracteres y solo puede contener letras, dígitos y _." );
        return;
    }
        
       

    let players = JSON.parse(localStorage.getItem("players")) || {};
    if (!players[playerName]) {
        players[playerName] = { date: new Date().toISOString() };
        localStorage.setItem("players", JSON.stringify(players));
    }

    localStorage.setItem("playerName", playerName);
    document.getElementById("menu").style.display = "none";
    canvas.style.display = "none";
    document.getElementById("dragDropArea").style.display = "flex";
}

function showScore() {}
function showCredits() {}
function exitGame() {
    window.close();
}

window.onload = function() {
    const players = JSON.parse(localStorage.getItem("players")) || {};
    const existingNames = document.getElementById("existingNames");
    existingNames.innerHTML = '<option value="">Seleccionar un jugador ya registrado</option>';
    
    if (Object.keys(players).length > 0) {
        existingNames.style.display = "inline-block";
        Object.keys(players).forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            existingNames.appendChild(option);
        });
    } else {
        existingNames.style.display = "none";
    }
};
