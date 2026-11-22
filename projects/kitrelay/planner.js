function plan(stock, schedule) {
  const inventory = new Map(), rounds = new Map(), names = new Map(), tables = new Map();
  function rows(input, size, label) {
    return input.split(/\r?\n/).flatMap((line, i) => {
      if (!line.trim()) return [];
      const fields = line.split(',').map(v => v.trim());
      if (fields.length !== size || fields.some(v => !v) || !/^\d{1,7}$/.test(fields.at(-1))) {
        throw Error(label + ', line ' + (i + 1) + ': check the columns and enter a whole quantity (0–9999999).');
      }
      return [fields];
    });
  }
  function add(map, key, n) { map.set(key, (map.get(key) || 0) + n); }
  for (const [name, count] of rows(stock, 2, 'Supplies')) {
    const item = name.toLowerCase(); names.set(item, name); add(inventory,item,+count);
  }
  for (const [round, station, name, count] of rows(schedule, 4, 'Requirements')) {
    if (!/^[1-9]\d{0,5}$/.test(round)) throw Error('Use round numbers from 1 to 999999.');
    const item = name.toLowerCase(), table = station.toLowerCase();
    if (!names.has(item)) names.set(item,name);
    tables.set(table,station);
    if (!rounds.has(+round)) rounds.set(+round,new Map());
    const needs = rounds.get(+round);
    if (!needs.has(item)) needs.set(item,new Map());
    add(needs.get(item),table,+count);
  }
  let previous = new Map();
  const result = [];
  for (const round of [...rounds.keys()].sort((a,b)=>a-b)) {
    const next = new Map(), actions = [], needs = rounds.get(round);
    for (const item of new Set([...needs.keys(),...previous.keys()])) {
      const before = previous.get(item) || new Map(), want = needs.get(item) || new Map();
      const donors = [], receivers = [], placed = new Map(); next.set(item,placed);
      let reserve = inventory.get(item) || 0;
      const name = names.get(item);
      for (const table of new Set([...before.keys(),...want.keys()])) {
        const have = before.get(table)||0, need = want.get(table)||0, keep = Math.min(have,need);
        reserve -= have; placed.set(table,keep);
        if (keep) actions.push('Keep '+keep+' × '+name+' at '+tables.get(table)+'.');
        if (have>keep) donors.push({table,n:have-keep});
        if (need>keep) receivers.push({table,n:need-keep});
      }
      for (const dest of receivers) {
        for (const src of donors) {
          const n = Math.min(dest.n,src.n);
          if (!n) continue;
          actions.push('Move '+n+' × '+name+' from '+tables.get(src.table)+' to '+tables.get(dest.table)+'.');
          src.n-=n; dest.n-=n; add(placed,dest.table,n);
        }
        const n=Math.min(reserve,dest.n);
        if(n) actions.push('Pack '+n+' × '+name+' from storage for '+tables.get(dest.table)+'.');
        reserve-=n; add(placed,dest.table,n);
        if(dest.n>n) actions.push('Short by '+(dest.n-n)+' × '+name+' at '+tables.get(dest.table)+'.');
      }
      for(const src of donors) if(src.n) actions.push('Return '+src.n+' × '+name+' from '+tables.get(src.table)+' to storage.');
    }
    result.push({round,actions}); previous=next;
  }
  return result;
}
if(typeof module!=='undefined') module.exports=plan;
