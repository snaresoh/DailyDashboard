/* ═══════════════════════════════════════════════════════
   PRECISION — Shared Data Layer & Utilities
   ═══════════════════════════════════════════════════════ */

const WORKER   = 'https://polished-pond-d9e9.chenrinan.workers.dev';
const LS_KEY   = 'precision_v1';
const CACHE_TTL = 5 * 60 * 1000;
let   MEM = { daily: null, workouts: null, ts: 0 };

/* ── CSV Parser ─────────────────────────────────────── */
function parseCSV(raw) {
  const rows = []; let i = 0, n = raw.length;
  while (i < n) {
    const row = []; let eol = false;
    while (!eol && i < n) {
      let val = '';
      if (raw[i] === '"') {
        i++;
        while (i < n) {
          if (raw[i] === '"' && raw[i+1] === '"') { val += '"'; i += 2; }
          else if (raw[i] === '"') { i++; break; }
          else val += raw[i++];
        }
      } else {
        while (i < n && raw[i] !== ',' && raw[i] !== '\r' && raw[i] !== '\n') val += raw[i++];
      }
      row.push(val.trim());
      if (i < n && raw[i] === ',') i++; else eol = true;
    }
    while (i < n && (raw[i] === '\r' || raw[i] === '\n')) i++;
    if (row.some(v => v)) rows.push(row);
  }
  if (!rows.length) return [];

  // Auto-detect header row: skip rows that don't contain "Date" in first cell
  // The Daily sheet has a description row before the actual header row
  let headerIdx = 0;
  for (let ri = 0; ri < Math.min(rows.length, 3); ri++) {
    const first = (rows[ri][0]||'').trim();
    if (first.toLowerCase() === 'date' || first === 'Date') { headerIdx = ri; break; }
  }

  const hdrs = rows[headerIdx].map(h => h.replace(/\s+/g,' ').trim());
  return rows.slice(headerIdx + 1).map(cols => {
    const o = {}; hdrs.forEach((h,j) => { o[h] = (cols[j]||'').trim(); }); return o;
  }).filter(r => {
    const v = r[hdrs[0]];
    return v && v.trim() && v.toLowerCase() !== hdrs[0].toLowerCase();
  });
}

/* ── Fetch ──────────────────────────────────────────── */
function ftch(url, ms=9000) {
  return new Promise((res,rej) => {
    const t = setTimeout(() => rej(new Error('timeout')), ms);
    fetch(url,{cache:'no-store'}).then(r=>{clearTimeout(t);res(r);}).catch(e=>{clearTimeout(t);rej(e);});
  });
}

async function loadData(force=false) {
  const now = Date.now();
  if (!force && MEM.daily && (now-MEM.ts) < CACHE_TTL) return { daily:MEM.daily, workouts:MEM.workouts };
  try {
    const stored = JSON.parse(localStorage.getItem(LS_KEY)||'null');
    if (!force && stored && (now-stored.ts) < CACHE_TTL) {
      MEM = { daily:stored.daily, workouts:stored.workouts, ts:stored.ts };
      return { daily:MEM.daily, workouts:MEM.workouts };
    }
  } catch(e){}

  const [dr, wr] = await Promise.all([
    ftch(`${WORKER}?sheet=daily`),
    ftch(`${WORKER}?sheet=workouts`),
  ]);
  if (!dr.ok) throw new Error(`HTTP ${dr.status}`);
  if (!wr.ok) throw new Error(`HTTP ${wr.status}`);
  const [dt, wt] = await Promise.all([dr.text(), wr.text()]);
  MEM.daily = parseCSV(dt); MEM.workouts = parseCSV(wt); MEM.ts = now;
  try { localStorage.setItem(LS_KEY, JSON.stringify(MEM)); } catch(e){}
  return { daily:MEM.daily, workouts:MEM.workouts };
}

/* ── Field getters (handles both column naming conventions) ── */
const f = v => parseFloat(v)||0;
const getLoad  = r => f(r['Load']||r['Load(体感强度)']||0);
const getTrimp = r => f(r['TRIMP']||r['TRIMP(心肺强度)']||0);
const getCTL   = r => f(r['CTL']||r['CTL(体能)']||0);
const getATL   = r => f(r['ATL']||r['ATL(疲劳)']||0);
const getTSB   = r => f(r['TSB']||r['TSB(恢复)']||0);
const getACWR  = r => f(r['ACWR']||r['ACWR(急慢性负荷比)']||0);
const getHRV   = r => f(r['HRV']||0);
const getHRV7  = r => f(r['7天平均 HRV']||r['7天平均HRV']||0);
const getHRVR  = r => f(r['HRV Ratio']||0);
const getRHR   = r => f(r['RHR']||0);
const getSRPE  = r => f(r['单日总sRPE']||0);
const getInd   = r => (r['指示器']||'');
const getDate  = r => (r['Date']||r['date']||'').trim();

const wkDate   = r => (r['Date']||r['date']||'').trim();
const wkSport  = r => (r['Sport']||r['sport']||'');
const wkDur    = r => f(r['Duration_min']||0);
const wkLoad   = r => f(r['Load']||r['load']||0);
const wkTrimp  = r => f(r['TRIMP']||r['trimp']||0);
const wkRPE    = r => f(r['RPE']||r['rpe']||0);
const wkAvgHR  = r => f(r['Avg_HR']||0);
const wkMaxHR  = r => f(r['Max_HR']||0);

/* ── Semantic helpers ───────────────────────────────── */
function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

const MONTHS_SHORT = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const MONTHS_LONG  = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];

function fmtDateLong(s) {
  const d = new Date((s||'').replace(/\//g,'-')); if(isNaN(d)) return s;
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
function fmtMonthYear(y,m) { return `${MONTHS_LONG[m]} ${y}`; }

function formLabel(tsb) {
  if(tsb > 25)  return { label:'FRESH',        col:'#a8e063' };
  if(tsb > 5)   return { label:'OPTIMAL',      col:'#a8e063' };
  if(tsb > -10) return { label:'PRODUCTIVE',   col:'#f5d020' };
  if(tsb > -30) return { label:'OVER',         col:'#ff6b35' };
  return              { label:'OVER REACHING',  col:'#ff3b30' };
}

function acwrLabel(acwr) {
  if(!acwr)      return { label:'REST',          col:'#555' };
  if(acwr < 0.8) return { label:'LOW',           col:'#5b9cf6' };
  if(acwr <=1.3) return { label:'OPTIMAL',       col:'#a8e063' };
  if(acwr <=1.5) return { label:'HIGH INTENSITY', col:'#f5d020' };
  return              { label:'OVER REACHING',   col:'#ff3b30' };
}

function loadBucket(load) {
  if(!load) return 'rest';
  if(load < 100) return 'low';
  if(load < 400) return 'medium';
  if(load < 700) return 'high';
  return 'peak';
}

function sportIcon(sport) {
  const s = (sport||'').toLowerCase();
  if(s.includes('网球')||s.includes('tennis'))    return '🎾';
  if(s.includes('羽毛球')||s.includes('badminton'))return '🏸';
  if(s.includes('跑')||s.includes('run'))         return '🏃';
  if(s.includes('游泳')||s.includes('swim'))      return '🏊';
  if(s.includes('骑')||s.includes('bike')||s.includes('cycl')) return '🚴';
  if(s.includes('力量')||s.includes('gym')||s.includes('weight')) return '🏋️';
  if(s.includes('瑜伽')||s.includes('yoga'))      return '🧘';
  if(s.includes('滑')||s.includes('ski')||s.includes('snow')) return '⛷️';
  if(s.includes('步行')||s.includes('walk'))      return '🚶';
  return '⚡';
}

function fmtDuration(mins) {
  if(!mins) return '—';
  const h=Math.floor(mins/60), m=Math.round(mins%60);
  return h>0 ? `${h}h ${m}m` : `${m}m`;
}

function buildDateIndex(daily) {
  const idx={};
  daily.forEach(r=>{ const k=getDate(r); if(k) idx[k]=r; });
  return idx;
}

/* ── Show loading/error ─────────────────────────────── */
function showLoading(el) {
  if(!el) return;
  el.innerHTML = `<div class="state-box"><div class="spinner"></div><span>LOADING</span></div>`;
}
function showError(el, msg) {
  if(!el) return;
  el.innerHTML = `<div class="state-box"><span style="font-size:24px">⚠</span><span>${msg}</span><button onclick="location.reload()">RETRY</button></div>`;
}
function setNav(page) {
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.page===page));
}

/* ── Shared Nav HTML ────────────────────────────────── */
const NAV_HTML = `<nav class="bottom-nav">
  <a class="nav-item" data-page="dashboard" href="dashboard.html">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>
    <span>DASHBOARD</span>
  </a>
  <a class="nav-item" data-page="calendar" href="calendar.html">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>
    <span>CALENDAR</span>
  </a>
  <a class="nav-item" data-page="trends" href="trends.html">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l5-5 4 4 9-9"/></svg>
    <span>TRENDS</span>
  </a>
  <a class="nav-item" data-page="logs" href="logs.html">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
    <span>LOGS</span>
  </a>
</nav>`;
