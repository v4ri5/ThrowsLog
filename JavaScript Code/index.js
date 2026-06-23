import renderSuggestion from './Suggestion.js';


function openPopup() {
    document.getElementById("athleteForm").style.display = "flex";
    renderSuggestion();
}
function openPopupvideo() {
    document.getElementById("Video_Player").style.display = "flex";
}

function closePopup() {
    document.getElementById("athleteForm").style.display = "none";
  renderSuggestion(); // Refresh the suggestion panel after closing the form
}

function closePopupvideo() {
    document.getElementById("Video_Player").style.display = "none";
}

    
    


window.openPopup = openPopup;
window.closePopup = closePopup;

const entries = JSON.parse(localStorage.getItem('trainingLog')) || [];
entries.forEach(entry => {
    console.log(entry);
});

let allEntries = [];
let newestFirst = true;

function openHistory() {
    const popup = document.getElementById('trainingHistory');
    allEntries = JSON.parse(localStorage.getItem('trainingLog')) || [];
    allEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    document.getElementById('entryCount').textContent = allEntries.length + ' Entries';
    updateFlameColor(allEntries.length);
    updateStats();
    renderEntries(allEntries);
    popup.style.display = 'flex'
}

function toggleSort(){
    newestFirst = !newestFirst
    document.getElementById('sortToggle').textContent = newestFirst ? 'Newest First' : 'Oldest First';
    filterHistory();
}
function filterHistory(){
    const search = document.getElementById('historyFilter').value.toLowerCase();
    const feelFilter = document.getElementById('sortByFeel').value;

    let filtered = allEntries.filter(entry => {
        const matchesEvent = (entry.event || '').toLowerCase().includes(search);
        const matchesFeel = feelFilter === '' || entry.feel === feelFilter;
        return matchesEvent && matchesFeel;
    });

    if(!newestFirst) filtered.reverse();
    renderEntries(filtered);
}
window.deleteEntry = deleteEntry;
function deleteEntry(index){
    const stored = JSON.parse(localStorage.getItem('trainingLog')) || [];
    const entryToDelete = allEntries[index];

    const storedIndex = stored.findIndex(entry =>
        entry.date === entryToDelete.date &&
        entry.event === entryToDelete.event &&
        entry.description === entryToDelete.description 
    );

    if (storedIndex !== -1){
       stored.splice(storedIndex,1); 
       localStorage.setItem('trainingLog', JSON.stringify(stored));
        openHistory();
    }   
}
function renderEntries(entries) {
    const content = document.getElementById('historyContent');
    if (entries.length === 0) {
        content.innerHTML = '<p style="color:#999; text-align:center;">No entries found.</p>';
    } else {
        content.innerHTML = entries.map((entry, index) => `
            <div class="historyEntry">
                <h3>${entry.date} — ${entry.event} — ${entry.sessionType}</h3>
                <p><strong>Description:</strong> ${entry.description}</p>
                <p><strong>Key Takeaways:</strong> ${entry.keyTakeaways}</p>
                <p><strong>RPE:</strong> ${entry.rpe}</p>
                <p><strong>Pre-Session Soreness:</strong> ${entry.preSessionSoreness}</p>
                <p><strong>Ate Before Session:</strong> ${entry.ateBeforeSession}</p>
                <p><strong>Ate After Session:</strong> ${entry.ateAfterSession}</p>
                <p><strong>Motivation Level:</strong> ${entry.motivationLevel}</p>
                <p><strong>Sleep:</strong> ${entry.sleep} hrs</p>
                <p><strong>Injuries:</strong> ${entry.injuries || 'None'} </p>
                <button class="deleteBtn" onclick="deleteEntry(${index})">Delete</button>    
            </div>
        `).join('');
    }
}

function updateStats() {
    // Sleep average
    const sleepEntries = allEntries.filter(e => e.sleep);
    const avgSleep = sleepEntries.length
        ? (sleepEntries.reduce((sum, e) => sum + parseFloat(e.sleep), 0) / sleepEntries.length).toFixed(1)
        : 0;

    // Streak — count consecutive days from today backwards
    const dates = allEntries
        .map(e => new Date(e.date).toDateString())
        .filter((d, i, arr) => arr.indexOf(d) === i) // remove duplicates
        .reverse(); // oldest first

    let streak = 0;
    let check = new Date();
    check.setHours(0, 0, 0, 0);

    

    document.getElementById('entryCount').textContent = 
        `${allEntries.length} Entries · Avg Sleep: ${avgSleep}hrs · ${streak}Streak`;
}

function closeHistory() {
    document.getElementById('trainingHistory').style.display = 'none';
}



function getFlameColor(count) {
    if (count <= 2)  return '#2b2b2b';   // dark gray
    if (count <= 5)  return '#8B0000';   // dark red
    if (count <= 10) return '#cc2200';   // deep red
    if (count <= 20) return '#ff4500';   // orange red
    if (count <= 30) return '#ff8c00';   // orange
    if (count <= 40) return '#ffd700';   // yellow
    if (count <= 60) return '#ffffff';   // white hot
    if (count <= 80) return '#00aaff';   // blue
    return '#8a2be2';                    // violet
}

function updateFlameColor(count) {
    const flames = document.querySelectorAll('.flame, .flame-main');
    const color = getFlameColor(count);
    flames.forEach(flame => {
        flame.style.fill = color;
    });
}


const tlBtn = document.getElementById('TL_button');
tlBtn.addEventListener('click', openPopup);
const historyBtn = document.getElementById('trainingHistorybtn');
historyBtn.addEventListener('click', openHistory);
const closehistoryBtn = document.getElementById('closeHistory');
closehistoryBtn.addEventListener('click', closeHistory);
const closeBtn = document.getElementById('closeBut')
closeBtn.addEventListener('click', closePopup);
const closePRsBtn = document.getElementById('closePRs');
closePRsBtn.addEventListener('click', closePRs);
const prTabField = document.getElementById('prTab_field');
prTabField.addEventListener('click', () => switchPRTab('field'));
const prTabWeightRoom = document.getElementById('prTab_weightRoom');
prTabWeightRoom.addEventListener('click', () => switchPRTab('weightRoom'));
const sortToggleBtn = document.getElementById('sortToggle');
sortToggleBtn.addEventListener('click', toggleSort);
const historyFilterInput = document.getElementById('historyFilter');
historyFilterInput.addEventListener('input', filterHistory);
const sortByFeelSelect = document.getElementById('sortByFeel');
sortByFeelSelect.addEventListener('change', filterHistory);
