import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root=process.cwd();
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const get=(regex)=>Array.from(html.matchAll(regex),match=>match[1]);
const ids=get(/\bid="([^"]+)"/g);
const unique=new Set(ids);
assert.equal(ids.length,unique.size,'Duplicate HTML IDs');
for(const anchor of get(/\bhref="#([^"]+)"/g))assert(unique.has(anchor),'Unresolved section: #'+anchor);
for(const file of [...get(/\bsrc="([^"]+)"/g),...get(/\bhref="([^"]+)"/g)]){
 if(!file||file.startsWith('#')||/^(https?:|mailto:|tel:|data:)/i.test(file))continue;
 const relative=decodeURIComponent(file.split(/[?#]/)[0]).replace(/^\//,'');
 const resolved=path.resolve(root,relative);
 assert(resolved.startsWith(root+path.sep),'Escaping repository root: '+file);
 assert(fs.existsSync(resolved),'Missing local asset or route: '+file);
 if(fs.statSync(resolved).isDirectory())assert(fs.existsSync(path.join(resolved,'index.html')),'Missing directory index: '+file);
}
const inlineScripts=get(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g);
for(const code of inlineScripts){
 if(!code.trim()||code.trim().startsWith('{"@context"'))continue;
 new vm.Script(code,{filename:'index.html'});
}
for(const tag of ['header','main','footer','nav','section','article','div','span','dialog']){
 const starts=(html.match(new RegExp('<'+tag+'(?:\\s|>)','g'))||[]).length;
 const ends=(html.match(new RegExp('</'+tag+'>','g'))||[]).length;
 assert.equal(starts,ends,'Unbalanced <'+tag+'> tags');
}
for(const name of ['work','about','experience','sywtc','skills','credentials','contact','services','caseStudy','assistant']){
 assert(unique.has(name),'Missing expected section or dialog: '+name);
}
assert(html.includes('prefers-reduced-motion'),'Reduced-motion styles not found');
console.log('Portfolio smoke checks passed: internal links, local assets, scripts, sections and HTML tag balance.');


// Regional clock regression checks: DST boundaries and cross-midnight dates.
assert(html.includes('id="worldClock"'),'World clock control missing');
assert(html.includes('id="clockZone"'),'World clock zone selector missing');
assert(html.includes("America/New_York"),'Eastern IANA zone missing');
assert(html.includes("Intl.DateTimeFormat"),'Time zone-aware formatter missing');
const parts=(iso,zone)=>{
 const date=new Date(iso);
 const formatter=new Intl.DateTimeFormat('en-GB',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
 return Object.fromEntries(formatter.formatToParts(date).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
};
const offset=(iso,zone)=>{
 const formatter=new Intl.DateTimeFormat('en-US',{timeZone:zone,hour:'numeric',timeZoneName:'shortOffset'});
 return formatter.formatToParts(new Date(iso)).find(x=>x.type==='timeZoneName')?.value;
};
assert.deepEqual(parts('2026-03-08T06:59:00Z','America/New_York'),{day:'08',month:'03',year:'2026',hour:'01',minute:'59'});
assert.deepEqual(parts('2026-03-08T07:00:00Z','America/New_York'),{day:'08',month:'03',year:'2026',hour:'03',minute:'00'});
assert.equal(offset('2026-03-08T06:59:00Z','America/New_York'),'GMT-5');
assert.equal(offset('2026-03-08T07:00:00Z','America/New_York'),'GMT-4');
assert.equal(offset('2026-11-01T05:59:00Z','America/New_York'),'GMT-4');
assert.equal(offset('2026-11-01T06:00:00Z','America/New_York'),'GMT-5');
assert.deepEqual(parts('2026-11-14T16:30:00Z','Asia/Manila'),{day:'15',month:'11',year:'2026',hour:'00',minute:'30'});
assert.deepEqual(parts('2026-01-01T14:00:00Z','Australia/Sydney'),{day:'02',month:'01',year:'2026',hour:'01',minute:'00'});
console.log('World clock DST, regional offset and calendar rollover checks passed.');


const leadflowRoot=path.join(root,'projects/leadflow-ai');
const leadflowPage=fs.readFileSync(path.join(leadflowRoot,'index.html'),'utf8');
const leadflowMap=JSON.parse(fs.readFileSync(path.join(leadflowRoot,'workflow-map.json'),'utf8'));
assert.equal(leadflowMap.exported_nodes,19,'LeadFlow documented workflow node count');
assert.deepEqual(leadflowMap.routing.map(item=>item.path),['A','B','C','D'],'LeadFlow paths');
for(const required of ['id="leadForm"','id="leadScenario"','id="resultBody"','data-example="hot"','data-example="warm"','data-example="cold"','data-example="review"'])assert(leadflowPage.includes(required),'LeadFlow interaction missing: '+required);
const leadflowScripts=Array.from(leadflowPage.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g),m=>m[1]);
assert.equal(leadflowScripts.length,1,'Expected one LeadFlow demo script');
for(const script of leadflowScripts)new vm.Script(script,{filename:'projects/leadflow-ai/index.html'});
for(const secret of ['authorization: Bearer','sk_live_','xoxb-'])assert(!leadflowPage.includes(secret),'Sensitive credential pattern in demo');
assert(!fs.existsSync(path.join(leadflowRoot,'zapfile.json')),'Private Zapier export must not be committed');
console.log('LeadFlow AI demonstration and sanitized workflow checks passed.');
