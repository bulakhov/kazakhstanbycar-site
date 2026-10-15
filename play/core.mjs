// Versioned, deterministic rounds: a shared link always opens the same challenge.
export const VERSION = '1';
export function almatyDay(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Almaty',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}
export function validDay(value) {
  return /^20\d{2}-\d{2}-\d{2}$/.test(value || '') && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
}
export function random(seed) {
  let state = 2166136261;
  for (const ch of seed) state = Math.imul(state ^ ch.charCodeAt(0),16777619) >>> 0;
  return () => { state += 0x6D2B79F5; let t=state; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; };
}
export function shuffle(items, rng) {
  const out = [...items];
  for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
  return out;
}
export function roundsFor(day, bank) {
  const rng=random('kbc-v'+VERSION+'-'+day);
  return shuffle([...shuffle(bank.filter(p=>p.kz),rng).slice(0,3),...shuffle(bank.filter(p=>!p.kz),rng).slice(0,2)],rng);
}
export function restore(raw, rounds) {
  try {
    const value=JSON.parse(raw);
    if(value?.version!==VERSION || !Array.isArray(value.answers) || value.answers.length>5) return [];
    if(!value.answers.every((a,i)=>a.id===rounds[i].id && typeof a.guess==='boolean')) return [];
    return value.answers;
  } catch { return []; }
}
export const scoreFor = (answers, rounds) => answers.reduce((n,a,i)=>n+Number(a.guess===rounds[i].kz),0);
