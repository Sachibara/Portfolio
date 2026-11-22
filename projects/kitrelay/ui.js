const el=id=>document.getElementById(id);
const stock=el('stock'),schedule=el('schedule'),out=el('out');
function render(){
  out.replaceChildren();el('error').textContent='';el('print').disabled=true;
  try{
    const rounds=plan(stock.value,schedule.value);
    if(!rounds.length) out.textContent='Enter a round or load the example to generate your sheet.';
    for(const {round,actions} of rounds){
      const section=document.createElement('article'), heading=document.createElement('h3'), list=document.createElement('ul');
      heading.textContent='Round '+round;
      for(const action of actions.length?actions:['No supplies to move.']){
        const li=document.createElement('li');li.textContent=action;list.append(li);
      }
      section.append(heading,list);out.append(section);
    }
    el('print').disabled=!rounds.length;
  }catch(e){el('error').textContent=e.message;out.textContent='Correct the highlighted input issue to generate your sheet.'}
  try{localStorage.setItem('kitrelay.v1',JSON.stringify([stock.value,schedule.value]));el('save').textContent='Saved on this device.'}catch{el('save').textContent='Device storage unavailable. Print your sheet to keep it.'}
}
try{const data=JSON.parse(localStorage.getItem('kitrelay.v1'));if(Array.isArray(data)&&data.length===2&&data.every(v=>typeof v==='string'))[stock.value,schedule.value]=data}catch{}
function replace(a,b){if((stock.value||schedule.value)&&!confirm('Replace the current workshop inputs?'))return;stock.value=a;schedule.value=b;render()}
el('example').onclick=()=>replace('Scissors, 8\nRulers, 4','1, Paper studio, Scissors, 6\n1, Map studio, Rulers, 4\n2, Paper studio, Scissors, 2\n2, Map studio, Scissors, 7\n2, Paper studio, Rulers, 4');
el('clear').onclick=()=>replace('','');
stock.oninput=schedule.oninput=render;el('print').onclick=()=>window.print();render();
