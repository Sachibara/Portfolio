(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const qsa = (s, root = document) => Array.from(root.querySelectorAll(s));
  const briefBase = "https://github.com/Sachibara/Portfolio/blob/main/projects/network-engineering-labs/";

  const labs = [
    {
      id:"lab1", code:"LAB 01", title:"Resilient Enterprise Campus", difficulty:"ADVANCED",
      summary:"Dual distribution multilayer switches with HSRP, LACP EtherChannel, Rapid-PVST, OSPF, DHCP relay, guest segmentation, and Internet-edge NAT.",
      devices:"7+", domains:"5 VLANs", focus:"Campus HA", time:"90–120 min",
      tech:["HSRP","LACP EtherChannel","Rapid-PVST","VLANs","Layer-3 Switching","OSPF","DHCP Relay","ACL","NAT/PAT"],
      objectives:[
        "Create redundant default gateways with HSRP and deliberate active/standby placement.",
        "Bundle distribution links with LACP EtherChannel and verify channel resiliency.",
        "Control Layer-2 forwarding by placing STP roots per VLAN.",
        "Route enterprise VLANs toward the Internet edge with OSPF.",
        "Isolate guest traffic while preserving outbound Internet connectivity."
      ],
      evidence:[
        "show standby brief with expected active/standby roles",
        "show etherchannel summary proving bundled links",
        "STP root verification for multiple VLANs",
        "OSPF neighbor and routing-table evidence",
        "Guest ACL deny test and HSRP failover ping test"
      ],
      topology:[
        ["ISP","WAN"],["EDGE1","NAT / OSPF"],["DIST1/2","HSRP / L3"],["ACCESS","802.1Q"],["USERS","VLANs"]
      ],
      brief:"lab-01-campus-ha.md", featured:["HSRP","STP","OSPF"]
    },
    {
      id:"lab2", code:"LAB 02", title:"Multi-Site OSPF Enterprise WAN", difficulty:"ADVANCED",
      summary:"HQ and two branch sites connected through an OSPF backbone with branch areas, ABR summarization, DHCP, router-on-a-stick, and backup WAN path engineering.",
      devices:"6+", domains:"3 Sites", focus:"WAN Routing", time:"80–110 min",
      tech:["OSPFv2","Multi-Area OSPF","ABR","Summarization","Router-on-a-Stick","DHCP","Default Route","Path Cost"],
      objectives:[
        "Build a multi-area OSPF design with HQ backbone and separate branch areas.",
        "Summarize branch prefixes at ABRs to reduce routing-table detail.",
        "Deliver branch VLAN routing through router-on-a-stick.",
        "Propagate a centralized Internet default route from HQ.",
        "Engineer a higher-cost backup path and validate reconvergence."
      ],
      evidence:[
        "show ip ospf neighbor across all WAN adjacencies",
        "show ip route ospf with summarized branch routes",
        "show ip protocols and OSPF area participation",
        "Traceroute before and after primary WAN failure",
        "DHCP bindings for both branch user networks"
      ],
      topology:[
        ["BR1","Area 10"],["HQ","Area 0"],["BR2","Area 20"],["ISP","Default"]
      ],
      brief:"lab-02-multisite-ospf.md", featured:["OSPF","ABR","WAN"]
    },
    {
      id:"lab3", code:"LAB 03", title:"Secure Internet Edge & DMZ", difficulty:"ADVANCED",
      summary:"Internet-edge security with inside, guest, management, and DMZ zones using NAT/PAT, static publishing, extended ACLs, SSH-only administration, and port security.",
      devices:"5+", domains:"4 Zones", focus:"Security Edge", time:"70–100 min",
      tech:["Extended ACL","NAT/PAT","Static NAT","DMZ","Guest Isolation","SSH","Port Security","Least Privilege"],
      objectives:[
        "Publish a DMZ web service using a dedicated public translated address.",
        "Allow inside users Internet access through PAT without exposing private addressing.",
        "Deny Internet access to internal networks except explicit DMZ services.",
        "Prevent Guest and DMZ networks from reaching protected internal segments.",
        "Restrict network-device administration to SSH."
      ],
      evidence:[
        "show ip nat translations after Internet and DMZ tests",
        "ACL hit counters for permitted and denied flows",
        "Successful public web-server access from Internet side",
        "Failed Guest-to-internal connectivity test",
        "SSH successful and Telnet denied"
      ],
      topology:[
        ["INTERNET","Outside"],["EDGE1","ACL / NAT"],["DMZ","Web"],["LAN","Inside"]
      ],
      brief:"lab-03-secure-dmz.md", featured:["ACL","NAT","DMZ"]
    },
    {
      id:"lab4", code:"LAB 04", title:"Dual-Stack IPv4/IPv6 Campus", difficulty:"INTERMEDIATE+",
      summary:"Two-site dual-stack network running IPv4 and IPv6 simultaneously with OSPFv2, OSPFv3, SLAAC, router-on-a-stick segmentation, and end-to-end validation.",
      devices:"6+", domains:"4 VLANs", focus:"IPv6", time:"60–90 min",
      tech:["IPv6","OSPFv3","OSPFv2","SLAAC","DHCPv6 Concepts","Dual Stack","802.1Q","IPv6 Troubleshooting"],
      objectives:[
        "Create a dual-stack addressing plan for multiple VLANs and a routed transit.",
        "Run OSPFv2 for IPv4 and OSPFv3 for IPv6.",
        "Allow endpoints to self-configure IPv6 addressing through SLAAC.",
        "Preserve VLAN segmentation while supporting both protocol families.",
        "Verify identical end-to-end service reachability over IPv4 and IPv6."
      ],
      evidence:[
        "show ipv6 interface brief",
        "show ipv6 ospf neighbor",
        "show ipv6 route ospf",
        "Successful IPv4 and IPv6 cross-site pings",
        "IPv4 and IPv6 traceroute comparison"
      ],
      topology:[
        ["SITE A","Dual Stack"],["R1","OSPFv2/v3"],["R2","OSPFv2/v3"],["SITE B","Dual Stack"]
      ],
      brief:"lab-04-dual-stack.md", featured:["IPv6","OSPFv3","SLAAC"]
    },
    {
      id:"lab5", code:"LAB 05", title:"Enterprise Troubleshooting Challenge", difficulty:"ASSESSMENT",
      summary:"Fault-injected enterprise network covering trunking, DHCP relay, OSPF adjacency, ACL behavior, port security, default routes, and client gateway configuration.",
      devices:"Variable", domains:"7 Faults", focus:"Troubleshooting", time:"60–120 min",
      tech:["Fault Isolation","RCA","VLAN/Trunking","OSPF","DHCP Relay","ACL","Port Security","Routing Validation"],
      objectives:[
        "Diagnose symptoms without immediately inspecting the known solution.",
        "Use Layer-1 through Layer-7 thinking to narrow fault scope.",
        "Apply one corrective change at a time and validate recovery.",
        "Document root cause, impact, commands used, and preventive action.",
        "Demonstrate repeatable troubleshooting rather than trial-and-error changes."
      ],
      evidence:[
        "Screenshot of broken behavior",
        "CLI evidence used to isolate each fault",
        "Corrected configuration excerpt",
        "Successful post-change verification",
        "Root-cause analysis for each incident"
      ],
      topology:[
        ["SYMPTOM","Observe"],["ISOLATE","Scope"],["FIX","Change"],["VERIFY","Prove"]
      ],
      brief:"lab-05-troubleshooting.md", featured:["RCA","VERIFY","OPS"]
    }
  ];

  const evidenceTypes = ["Topology Screenshot","Saved .pkt","CLI Verification","Policy/Service Test","Failure Test","Engineering Write-up"];
  const storageKey = "packet_tracer_lab_evidence_v2";
  let selectedLab = 0;
  let evidenceState = loadEvidence();

  function loadEvidence(){
    try{
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    }catch(_){ return {}; }
  }
  function saveEvidence(){ localStorage.setItem(storageKey, JSON.stringify(evidenceState)); }

  function escapeHtml(v){
    return String(v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  }

  function toast(title,msg){
    const el=document.createElement("div");
    el.className="toast";
    el.innerHTML="<b>"+escapeHtml(title)+"</b><span>"+escapeHtml(msg)+"</span>";
    $("toastRegion").appendChild(el);
    setTimeout(()=>el.remove(),2800);
  }

  function setView(view){
    qsa(".view").forEach(v=>v.classList.toggle("active",v.dataset.viewPanel===view));
    qsa(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
    const titles={
      overview:"Network Engineering Lab Control Center",
      labs:"Enterprise Lab Library",
      skills:"Network Engineering Skill Matrix",
      evidence:"Portfolio Evidence Tracker"
    };
    $("pageTitle").textContent=titles[view]||titles.overview;
    window.scrollTo({top:0,behavior:"smooth"});
  }

  qsa(".nav-link").forEach(btn=>btn.addEventListener("click",()=>setView(btn.dataset.view)));
  $("exploreLabsBtn").addEventListener("click",()=>setView("labs"));
  $("openEvidenceBtn").addEventListener("click",()=>setView("evidence"));

  function renderOverviewCards(){
    $("overviewLabCards").innerHTML=labs.map((lab,i)=>`
      <button class="lab-card" data-open-lab="${i}">
        <div class="lab-card-code">${lab.code}</div>
        <h3>${escapeHtml(lab.title)}</h3>
        <p>${escapeHtml(lab.summary)}</p>
        <div class="lab-card-tech">${lab.featured.map(t=>`<span>${escapeHtml(t)}</span>`).join("")}</div>
      </button>
    `).join("");
    qsa("[data-open-lab]").forEach(btn=>btn.addEventListener("click",()=>{
      selectedLab=Number(btn.dataset.openLab);
      renderLabLibrary();
      setView("labs");
    }));
  }

  function renderOverviewSkills(){
    const skills=[
      ["Routing & WAN",94],["Switching & Redundancy",96],["Security & Segmentation",90],
      ["IPv6 & Addressing",91],["Operations & Verification",95],["Troubleshooting / RCA",98]
    ];
    $("overviewSkillBars").innerHTML=skills.map(([name,pct])=>`
      <div class="skill-row"><span>${name}</span><div class="skill-track"><i style="width:${pct}%"></i></div><b>${pct}</b></div>
    `).join("");
  }

  function renderSelector(){
    $("labSelector").innerHTML=labs.map((lab,i)=>`
      <button class="lab-select ${i===selectedLab?"active":""}" data-select-lab="${i}">
        <b>${lab.code} · ${escapeHtml(lab.title)}</b>
        <small>${escapeHtml(lab.focus)} · ${escapeHtml(lab.difficulty)}</small>
      </button>
    `).join("");
    qsa("[data-select-lab]").forEach(btn=>btn.addEventListener("click",()=>{
      selectedLab=Number(btn.dataset.selectLab);
      renderLabLibrary();
    }));
  }

  function renderTopology(lab){
    const parts=[];
    lab.topology.forEach((n,i)=>{
      parts.push(`<div class="flow-node"><b>${escapeHtml(n[0])}</b><small>${escapeHtml(n[1])}</small></div>`);
      if(i<lab.topology.length-1) parts.push('<div class="flow-line"></div>');
    });
    return '<div class="flow">'+parts.join("")+'</div>';
  }

  function labCompleteCount(index){
    const key=labs[index].id;
    const st=evidenceState[key]||{};
    return evidenceTypes.filter(x=>st[x]).length;
  }

  function renderLabLibrary(){
    renderSelector();
    const lab=labs[selectedLab];
    $("detailCode").textContent=lab.code;
    $("detailTitle").textContent=lab.title;
    $("detailSummary").textContent=lab.summary;
    $("detailDifficulty").textContent=lab.difficulty;
    $("detailKpis").innerHTML=`
      <div><span>DEVICES</span><strong>${lab.devices}</strong></div>
      <div><span>NETWORK SCOPE</span><strong>${lab.domains}</strong></div>
      <div><span>PRIMARY FOCUS</span><strong>${lab.focus}</strong></div>
      <div><span>EST. BUILD</span><strong>${lab.time}</strong></div>
    `;
    $("detailTopology").innerHTML=renderTopology(lab);
    $("detailTechnologies").innerHTML=lab.tech.map(t=>`<span>${escapeHtml(t)}</span>`).join("");
    $("detailObjectives").innerHTML=lab.objectives.map(x=>`<li>${escapeHtml(x)}</li>`).join("");
    $("detailEvidence").innerHTML=lab.evidence.map(x=>`<li>${escapeHtml(x)}</li>`).join("");
    $("detailBriefLink").href=briefBase+lab.brief;
    const count=labCompleteCount(selectedLab);
    $("markCompleteBtn").textContent=count===evidenceTypes.length?"Lab Evidence Complete ✓":"Mark Lab Complete";
  }

  $("markCompleteBtn").addEventListener("click",()=>{
    const lab=labs[selectedLab];
    evidenceState[lab.id]=evidenceState[lab.id]||{};
    evidenceTypes.forEach(x=>evidenceState[lab.id][x]=true);
    saveEvidence();
    renderLabLibrary();
    renderEvidence();
    toast("Evidence updated",lab.title+" marked complete.");
  });

  function renderEvidence(){
    let done=0;
    $("evidenceLabs").innerHTML=labs.map((lab,li)=>{
      const key=lab.id;
      const st=evidenceState[key]||{};
      const completed=evidenceTypes.filter(x=>st[x]).length;
      done+=completed;
      return `
        <article class="evidence-card">
          <div class="evidence-card-head">
            <h3>${lab.code} · ${escapeHtml(lab.title)}</h3>
            <span class="evidence-count">${completed}/${evidenceTypes.length} COMPLETE</span>
          </div>
          <div class="check-grid">
            ${evidenceTypes.map(type=>`
              <label class="check-item">
                <input type="checkbox" data-evidence-lab="${li}" data-evidence-type="${escapeHtml(type)}" ${st[type]?"checked":""}>
                <span>${escapeHtml(type)}</span>
              </label>
            `).join("")}
          </div>
        </article>
      `;
    }).join("");

    const total=labs.length*evidenceTypes.length;
    const pct=Math.round(done/total*100);
    $("progressPercent").textContent=pct+"%";
    $("progressTitle").textContent=done+" / "+total+" evidence items complete";
    $("progressRing").style.setProperty("--progress",pct+"%");

    qsa("[data-evidence-lab]").forEach(box=>box.addEventListener("change",()=>{
      const lab=labs[Number(box.dataset.evidenceLab)];
      const type=box.dataset.evidenceType;
      evidenceState[lab.id]=evidenceState[lab.id]||{};
      evidenceState[lab.id][type]=box.checked;
      saveEvidence();
      renderEvidence();
      renderLabLibrary();
    }));
  }

  $("resetProgressBtn").addEventListener("click",()=>{
    if(!confirm("Reset all local evidence progress for this lab suite?")) return;
    evidenceState={};
    saveEvidence();
    renderEvidence();
    renderLabLibrary();
    toast("Progress reset","All evidence checkboxes were cleared.");
  });

  renderOverviewCards();
  renderOverviewSkills();
  renderLabLibrary();
  renderEvidence();
})();