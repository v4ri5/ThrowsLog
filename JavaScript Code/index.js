function openPopup() {
    document.getElementById("athleteForm").style.display = "flex";
}
function openPopupvideo() {
    document.getElementById("Video_Player").style.display = "flex";
}

function closePopup() {
    document.getElementById("athleteForm").style.display = "none";
}

function closePopupvideo() {
    document.getElementById("Video_Player").style.display = "none";
}

const entries = JSON.parse(localStorage.getItem('trainingLog')) || [];
entries.forEach(entry => {
    console.log(entry);
});

function openHistory() {
    const popup = document.getElementById('trainingHistory');
    const content = document.getElementById('historyContent');

    const entries = JSON.parse(localStorage.getItem('trainingLog')) || [];

    if (entries.length === 0) {
        content.innerHTML = '<p style="color:#999; text-align:center;">No entries yet.</p>';
    } else {
        content.innerHTML = entries.map(entry => `
            <div class="historyEntry">
                <h3>${entry.date} — ${entry.event}</h3>
                <p><strong>Description:</strong> ${entry.description}</p>
                <p><strong>Key Takeaways:</strong> ${entry.keyTakeaways}</p>
                <p><strong>Feel:</strong> ${entry.feel}</p>
                <p><strong>Sleep:</strong> ${entry.sleep} hrs</p>
                <p><strong>Ate:</strong> ${entry.food}</p>
                <p><strong>Injuries:</strong> ${entry.injuries}</p>
            </div>
        `).join('');
    }

    popup.style.display = 'flex';
}

function closeHistory() {
    document.getElementById('trainingHistory').style.display = 'none';
}