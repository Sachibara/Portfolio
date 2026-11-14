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
for(const name of ['work','about','experience','sywtc','skills','credentials','contact','siteSearch','caseStudy']){
 assert(unique.has(name),'Missing expected section or dialog: '+name);
}
assert(html.includes('prefers-reduced-motion'),'Reduced-motion styles not found');
console.log('Portfolio smoke checks passed: internal links, local assets, scripts, sections and HTML tag balance.');
