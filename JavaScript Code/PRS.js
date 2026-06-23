// ─────────────────────────────────────────────────────────
//  PRs.js  —  Personal Records Manager
//  Handles: field events (m) + weight room (lbs)
//  Stores:  localStorage key 'athletePRs'
// ─────────────────────────────────────────────────────────

const FIELD_EVENTS = [
    { id: 'shot_put',     name: 'Shot Put',     unit: 'm'   },
    { id: 'discus',       name: 'Discus',       unit: 'm'   },
    { id: 'hammer',       name: 'Hammer',       unit: 'm'   },
    { id: 'weight_throw', name: 'Weight Throw', unit: 'm'   },
    { id: 'javelin',      name: 'Javelin',      unit: 'm'   }
];

const WEIGHT_ROOM = [
    { id: 'bench',        name: 'Bench Press',  unit: 'lbs' },
    { id: 'back_squat',   name: 'Back Squat',   unit: 'lbs' },
    { id: 'power_clean',  name: 'Power Clean',  unit: 'lbs' },
    { id: 'deadlift',     name: 'Deadlift',     unit: 'lbs' },
    { id: 'clean_jerk',   name: 'Clean & Jerk', unit: 'lbs' },
    { id: 'front_squat',  name: 'Front Squat',  unit: 'lbs' },
    { id: 'push_press',   name: 'Push Press',   unit: 'lbs' },
    { id: 'snatch',       name: 'Snatch',       unit: 'lbs' }
];

// ── Data helpers ─────────────────────────────────────────

function loadPRData() {
    const raw = localStorage.getItem('athletePRs');
    if (raw) return JSON.parse(raw);

    // First run: build default structure
    const data = {
        field: FIELD_EVENTS.map(e => ({
            ...e, current: null, history: [], display: true
        })),
        weightRoom: WEIGHT_ROOM.map(e => ({
            ...e, current: null, history: [],
            display: ['bench', 'back_squat', 'power_clean'].includes(e.id)
        }))
    };
    localStorage.setItem('athletePRs', JSON.stringify(data));
    return data;
}

function savePRData(data) {
    localStorage.setItem('athletePRs', JSON.stringify(data));
}

// ── Popup open / close ────────────────────────────────────

function openPRs() {
    currentPRTab = 'field';
    setActiveTab('field');
    renderPRContent();
    document.getElementById('prPopup').style.display = 'flex';
}

function closePRs() {
    document.getElementById('prPopup').style.display = 'none';
    updateProfilePRs();
}

// ── Tabs ──────────────────────────────────────────────────

let currentPRTab = 'field';

function setActiveTab(tab) {
    document.querySelectorAll('.prTab').forEach(t => t.classList.remove('active'));
    document.getElementById('prTab_' + tab).classList.add('active');
}

function switchPRTab(tab) {
    currentPRTab = tab;
    setActiveTab(tab);
    renderPRContent();
}

// ── Render ────────────────────────────────────────────────

function renderPRContent() {
    const data   = loadPRData();
    const events = currentPRTab === 'field' ? data.field : data.weightRoom;
    const content = document.getElementById('prContent');

    content.innerHTML = events.map((ev, i) => `
        <div class="prEntry">
            <div class="prEntryTop">
                <div class="prLeft">
                    <label class="prToggleLabel" title="Show on profile">
                        <input type="checkbox"
                            ${ev.display ? 'checked' : ''}
                            onchange="toggleDisplay('${currentPRTab}', ${i})">
                        <span class="prToggleBox"></span>
                    </label>
                    <span class="prName">${ev.name}</span>
                </div>
                <div class="prRight">
                    <span class="prValue">${ev.current !== null ? ev.current + ' ' + ev.unit : '—'}</span>
                    <span class="prDate">${ev.history.length ? ev.history[ev.history.length - 1].date : ''}</span>
                    <button class="prUpdateBtn"
                        onclick="startPRUpdate('${currentPRTab}', ${i}, '${ev.id}')">Update</button>
                </div>
            </div>

            <div class="prUpdateForm" id="prUpdateForm_${ev.id}" style="display:none;">
                <input type="number" step="0.01" min="0" id="prInput_${ev.id}"
                    placeholder="${ev.unit === 'm' ? 'Distance (m)' : 'Weight (lbs)'}">
                <input type="date" id="prDate_${ev.id}">
                <button class="prSaveBtn"
                    onclick="confirmPRUpdate('${currentPRTab}', ${i}, '${ev.id}')">Save</button>
                <button class="prCancelBtn"
                    onclick="cancelPRUpdate('${ev.id}')">Cancel</button>
            </div>

            ${ev.history.length > 1 ? `
            <div class="prHistorySection">
                <button class="prHistoryToggle" onclick="togglePRHistory('${ev.id}')">
                    ▸ History (${ev.history.length - 1} previous)
                </button>
                <div class="prHistoryList" id="prHistoryList_${ev.id}" style="display:none;">
                    ${[...ev.history].reverse().slice(1).map(h =>
                        `<span class="prHistoryItem">${h.date} — ${h.value} ${ev.unit}</span>`
                    ).join('')}
                </div>
            </div>` : ''}
        </div>
    `).join('');
}

// ── Actions ───────────────────────────────────────────────

function toggleDisplay(type, index) {
    const data = loadPRData();
    data[type][index].display = !data[type][index].display;
    savePRData(data);
    updateProfilePRs();
}

function startPRUpdate(type, index, id) {
    // Close any other open update forms first
    document.querySelectorAll('.prUpdateForm').forEach(f => f.style.display = 'none');
    document.getElementById('prDate_' + id).value = new Date().toISOString().split('T')[0];
    document.getElementById('prUpdateForm_' + id).style.display = 'flex';
}

function cancelPRUpdate(id) {
    document.getElementById('prUpdateForm_' + id).style.display = 'none';
}

function confirmPRUpdate(type, index, id) {
    const newVal = parseFloat(document.getElementById('prInput_' + id).value);
    const date   = document.getElementById('prDate_' + id).value;

    if (isNaN(newVal) || newVal <= 0) { alert('Enter a valid number.'); return; }
    if (!date)                         { alert('Pick a date.');          return; }

    const data = loadPRData();
    const ev   = data[type][index];
    ev.current = newVal;
    ev.history.push({ value: newVal, date });
    savePRData(data);

    renderPRContent();
    updateProfilePRs();
}

function togglePRHistory(id) {
    const list = document.getElementById('prHistoryList_' + id);
    const btn  = list.previousElementSibling;
    const open = list.style.display === 'none';
    list.style.display = open ? 'flex' : 'none';
    const n = btn.textContent.match(/\d+/)?.[0] || '';
    btn.textContent = open
        ? `▾ History (${n} previous)`
        : `▸ History (${n} previous)`;
}

// ── Profile box (main page) ───────────────────────────────

function updateProfilePRs() {
    const box = document.getElementById('profilePRs');
    if (!box) return;

    const data    = loadPRData();
    const visible = [...data.field, ...data.weightRoom].filter(e => e.display);

    box.innerHTML = visible.length === 0
        ? '<p class="noprMsg">Tap to add your PRs</p>'
        : visible.map(e => `
            <div class="profilePRItem">
                <span class="profilePRName">${e.name}</span>
                <span class="profilePRValue">${e.current !== null ? e.current + ' ' + e.unit : '—'}</span>
            </div>
          `).join('');
}

document.addEventListener('DOMContentLoaded', updateProfilePRs);