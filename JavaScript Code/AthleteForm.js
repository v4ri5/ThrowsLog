import renderSuggestion from './Suggestion.js';

document.getElementById('AthleteForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const entry = {
        date: document.getElementById('date').value,
        event: document.getElementById('athleteEvent').value,
        sessionType: document.getElementById('SessionType').value,
        description: document.getElementById('Description').value,
        keyTakeaways: document.getElementById('keyTakeaways').value,
        rpe: document.getElementById('RPE').value,
        sleep: document.getElementById('sleep').value,
        preSessionSoreness: document.getElementById('PreSessionSoreness').value,
        ateBeforeSession: document.getElementById('AteBeforeSession').value,
        ateAfterSession: document.getElementById('AteAfterSession').value,
        motivationLevel: document.getElementById('MotivationLevel').value,
        injuries: document.getElementById('injuries').value
    };

    const existing = JSON.parse(localStorage.getItem('trainingLog')) || [];
    existing.push(entry);
    localStorage.setItem('trainingLog', JSON.stringify(existing));

    alert('Entry Saved');
    this.reset();

    // calls closePopup() from the parent (main) page
    window.parent.renderSuggestion();
    window.parent.closePopup();
});

document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
});

