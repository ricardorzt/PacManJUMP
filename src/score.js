/*document.addEventListener("DOMContentLoaded", function () {
    loadScores();
});
*/
function showScore() {
    
    canvas.style.display = "none";
     document.getElementById("scoreSection").style.display = "flex";
    
    document.getElementById("menu").style.display = "none";
    loadScores();


}

function closeScore() {
    document.getElementById("scoreSection").style.display = "none";

    
    document.getElementById("menu").style.display = "flex"; // Mostrar el menú
    const canvas = document.getElementById("gameCanvas");
    canvas.style.display = "block";
}
/*
function saveScore(name, score) {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    let players = JSON.parse(localStorage.getItem("players")) || {};
    let date = players[name] ? new Date(players[name].date).toLocaleDateString() : new Date().toLocaleDateString();
    
    scores.push({ name, date, score });
    localStorage.setItem("scores", JSON.stringify(scores));
}

function loadScores() {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    let tableBody = document.getElementById("scoreTableBody");
    tableBody.innerHTML = "";
    
    scores.sort((a, b) => b.score - a.score); // Ordenar por puntaje de mayor a menor
    
    scores.forEach(entry => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${entry.name}</td><td>${entry.date}</td><td>${entry.score}</td>`;
        tableBody.appendChild(row);
    });
}*/
