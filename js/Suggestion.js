function getTrainingLog() {
    return JSON.parse(localStorage.getItem('trainingLog')) || [];
}

function calcOvertrainingScore(entry) {
    let score = 0;
    const rpe      = parseFloat(entry.rpe)                 || 0;
    const sleep    = parseFloat(entry.sleep)               || 0;
    const soreness = parseFloat(entry.preSessionSoreness)  || 0;
    const motiv    = parseFloat(entry.motivationLevel)     || 0;

    if (rpe >= 9)      score += 3; else if (rpe >= 7)      score += 1;
    if (sleep <= 5)    score += 3; else if (sleep <= 6)    score += 1;
    if (soreness >= 4) score += 3; else if (soreness >= 3) score += 1;
    if (motiv <= 2)    score += 3; else if (motiv === 3)   score += 1;

    return score;
}

function getSuggestion(score) {
    if (score >= 8) return {
        level: 'danger',
        icon: 'ti-alert-triangle',
        headline: 'High overtraining risk — prioritise recovery',
        points: [
            'Take 1–2 full rest days before your next session.',
            'Focus on sleep hygiene: aim for 8–9 hours tonight.',
            'Consider light mobility work or a gentle walk instead of a structured session.',
            'Reassess nutrition — ensure adequate carbohydrate and protein intake.',
        ]
    };
    if (score >= 5) return {
        level: 'warning',
        icon: 'ti-activity-heartbeat',
        headline: 'Moderate fatigue detected — reduce load today',
        points: [
            'Drop session intensity by 20–30% (RPE 5–6 ceiling).',
            'Shorten session duration if possible.',
            'Prioritise 7–8 hours of sleep tonight.',
            'Include a 10-minute cool-down and foam rolling post-session.',
        ]
    };
    if (score >= 2) return {
        level: 'info',
        icon: 'ti-checks',
        headline: 'Mild fatigue — train smart',
        points: [
            'Warm up thoroughly before ramping intensity.',
            'Listen to your body mid-session and back off if needed.',
            'Stay hydrated and eat a balanced meal within 2 hours post-session.',
        ]
    };
    return {
        level: 'success',
        icon: 'ti-star',
        headline: 'All systems go — great readiness!',
        points: [
            'Your recovery markers look excellent.',
            'You\'re primed to hit a quality session today.',
            'Use this window to tackle your key training goal for the week.',
        ]
    };
}

function formatLabel(entry) {
    if (!entry.date) return '?';
    const d = new Date(entry.date + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
}

const levelColors = {
    danger:  { bg: '#FCEBEB', border: '#E24B4A', text: '#A32D2D', badge: '#F09595' },
    warning: { bg: '#FAEEDA', border: '#EF9F27', text: '#854F0B', badge: '#FAC775' },
    info:    { bg: '#E6F1FB', border: '#378ADD', text: '#185FA5', badge: '#85B7EB' },
    success: { bg: '#EAF3DE', border: '#639922', text: '#3B6D11', badge: '#97C459' },
};

export default function renderSuggestion() {
    const container = document.getElementById('suggestion-panel');
    if (!container) return;

    const log = getTrainingLog();

    if (log.length === 0) {
        container.innerHTML = `
            <div style="padding:1.25rem;border:0.5px solid #D3D1C7;border-radius:12px;text-align:center;color:#5F5E5A;font-size:14px;">
                <i class="ti ti-clipboard-list" style="font-size:28px;display:block;margin-bottom:8px;"></i>
                Log your first session to see readiness suggestions.
            </div>`;
        return;
    }

    const latest = log[log.length - 1];
    const score  = calcOvertrainingScore(latest);
    const s      = getSuggestion(score);
    const lc     = levelColors[s.level];

    const recent       = log.slice(-14);
    const labels       = recent.map(formatLabel);
    const rpeData      = recent.map(e => parseFloat(e.rpe)                 || 0);
    const sleepData    = recent.map(e => parseFloat(e.sleep)               || 0);
    const sorenessData = recent.map(e => parseFloat(e.preSessionSoreness)  || 0);
    const motivData    = recent.map(e => parseFloat(e.motivationLevel)     || 0);

    container.innerHTML = `
<h2 class="sr-only">Training Readiness Suggestion & Recent Metrics Chart</h2>

<div style="
    background:${lc.bg};
    border:1.5px solid ${lc.border};
    border-radius:12px;
    padding:1rem 1.25rem;
    margin-bottom:1.25rem;
">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap;">
        <i class="ti ${s.icon}" style="font-size:22px;color:${lc.text};" aria-hidden="true"></i>
        <span style="font-size:15px;font-weight:500;color:${lc.text};flex:1;">${s.headline}</span>
        <span style="background:${lc.badge};color:${lc.text};font-size:11px;font-weight:500;padding:3px 10px;border-radius:999px;">
            Score ${score}/12
        </span>
    </div>
    <ul style="margin:0;padding-left:1.2rem;color:${lc.text};font-size:13.5px;line-height:1.9;">
        ${s.points.map(p => `<li>${p}</li>`).join('')}
    </ul>
</div>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-bottom:1.25rem;">
    ${[
        { label: 'RPE',        val: latest.rpe,                icon: 'ti-flame' },
        { label: 'Sleep (h)',  val: latest.sleep,              icon: 'ti-moon' },
        { label: 'Soreness',   val: latest.preSessionSoreness, icon: 'ti-first-aid-kit' },
        { label: 'Motivation', val: latest.motivationLevel,    icon: 'ti-bolt' },
    ].map(m => `
        <div style="background:#f5f5f3;border-radius:8px;padding:0.6rem;text-align:center;">
            <i class="ti ${m.icon}" style="font-size:18px;color:#888;display:block;margin-bottom:2px;" aria-hidden="true"></i>
            <div style="font-size:20px;font-weight:500;color:#2C2C2A;">${parseFloat(m.val) || 0}</div>
            <div style="font-size:11px;color:#5F5E5A;">${m.label}</div>
        </div>`).join('')}
</div>

<div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:8px;font-size:12px;color:#5F5E5A;">
    <span style="display:flex;align-items:center;gap:5px;"><span style="width:12px;height:3px;background:#E24B4A;display:inline-block;border-radius:2px;"></span>RPE</span>
    <span style="display:flex;align-items:center;gap:5px;"><span style="width:12px;height:0;border-top:3px dashed #378ADD;display:inline-block;"></span>Sleep</span>
    <span style="display:flex;align-items:center;gap:5px;"><span style="width:12px;height:3px;background:#EF9F27;display:inline-block;border-radius:2px;"></span>Soreness</span>
    <span style="display:flex;align-items:center;gap:5px;"><span style="width:12px;height:3px;background:#639922;display:inline-block;border-radius:2px;"></span>Motivation</span>
</div>
<div style="font-size:12px;color:#888;margin-bottom:6px;">Last ${recent.length} session${recent.length === 1 ? '' : 's'}</div>

<div style="position:relative;width:100%;height:clamp(170px,45vw,220px);">
    <canvas id="suggestion-chart"
        role="img"
        aria-label="Line chart of RPE, sleep, soreness and motivation over the last ${recent.length} sessions.">
        Trends for RPE, sleep, soreness, and motivation.
    </canvas>
</div>`;

    function doChart() {
        const ctx = document.getElementById('suggestion-chart');
        if (!ctx) return;
        const existing = Chart.getChart(ctx);
        if (existing) existing.destroy();

        new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    { label:'RPE',       data:rpeData,      borderColor:'#E24B4A', backgroundColor:'rgba(226,75,74,0.07)',  borderWidth:2, pointRadius:4, pointStyle:'circle',  fill:false, tension:0.3 },
                    { label:'Sleep',     data:sleepData,    borderColor:'#378ADD', backgroundColor:'rgba(55,138,221,0.07)', borderWidth:2, pointRadius:4, pointStyle:'rectRot', borderDash:[5,4], fill:false, tension:0.3 },
                    { label:'Soreness',  data:sorenessData, borderColor:'#EF9F27', backgroundColor:'rgba(239,159,39,0.07)', borderWidth:2, pointRadius:4, pointStyle:'triangle', fill:false, tension:0.3 },
                    { label:'Motivation',data:motivData,    borderColor:'#639922', backgroundColor:'rgba(99,153,34,0.07)',  borderWidth:2, pointRadius:4, pointStyle:'star',    fill:false, tension:0.3 },
                ]
            },
            options: {
                responsive:true, maintainAspectRatio:false,
                plugins: { legend:{ display:false } },
                scales: {
                    y: { min:0, max:11, ticks:{ stepSize:2, color:'#888', font:{size:11} }, grid:{ color:'rgba(0,0,0,0.06)' } },
                    x: { ticks:{ autoSkip:false, maxRotation:45, color:'#888', font:{size:11} }, grid:{ display:false } }
                }
            }
        });
    }

    if (typeof Chart !== 'undefined') {
        doChart();
    } else {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
        s.onload = doChart;
        document.head.appendChild(s);
    }
}

// Auto-render on page load
document.addEventListener('DOMContentLoaded', renderSuggestion);