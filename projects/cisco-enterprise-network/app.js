(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const qsa = s => Array.from(document.querySelectorAll(s));

  const nodeInfo = {
    "PUBLIC-SRV":["Public Test Server","Simulates an Internet-hosted destination at 198.51.100.10 behind the ISP router."],
    "ISP":["ISP Router","Provides the public 203.0.113.0/29 handoff and a routed public-server network."],
    "EDGE1":["Enterprise Edge Router","Originates the OSPF default route, performs PAT for private networks, and publishes the DMZ web server with static NAT."],
    "DIST1":["Distribution Switch 1","Multilayer campus gateway. HSRP active for VLANs 10, 30, 50 and 99; aligned STP root placement."],
    "DIST2":["Distribution Switch 2","Redundant multilayer campus gateway. HSRP active for VLANs 20 and 40 and backup for remaining VLANs."],
    "ASW1":["HQ Access Switch 1","Dual-homed access layer for users, IT administration, and guest wireless access."],
    "ASW2":["HQ Access Switch 2","Dual-homed access layer hosting internal services and the DMZ web server."],
    "SERVICES":["Central DHCP / DNS","Centralized DHCP/DNS service at 10.10.30.10. Remote VLANs use DHCP relay."],
    "DMZ-WEB":["DMZ Web Server","Internal address 10.10.50.10, statically published as 203.0.113.3 TCP/80 and TCP/443."],
    "BR1":["Branch Router / ABR","OSPF area-border router: WAN in area 0, branch VLANs in area 10, summarized as 10.20.0.0/16."],
    "BR-SW1":["Branch Access Switch","Carries branch user, guest wireless, and management VLANs to BR1 using 802.1Q."]
  };

  const configs = [
    {name:"EDGE1",role:"EDGE ROUTER",file:"EDGE1.txt",preview:"hostname EDGE1\n!\ninterface g0/0\n description TO-ISP\n ip address 203.0.113.2 255.255.255.248\n ip nat outside\n ip access-group OUTSIDE-IN in\n no shutdown\n!\nrouter ospf 10\n router-id 10.10.10.10\n default-information originate\n!\nip nat inside source list NAT-INSIDE interface g0/0 overload\nip nat inside source static tcp 10.10.50.10 80 203.0.113.3 80\n..."},
    {name:"DIST1",role:"MULTILAYER DISTRIBUTION",file:"DIST1.txt",preview:"hostname DIST1\nip routing\nspanning-tree mode rapid-pvst\n!\ninterface vlan 10\n ip address 10.10.10.2 255.255.255.0\n standby 10 ip 10.10.10.1\n standby 10 priority 120\n standby 10 preempt\n..."},
    {name:"DIST2",role:"MULTILAYER DISTRIBUTION",file:"DIST2.txt",preview:"hostname DIST2\nip routing\nspanning-tree mode rapid-pvst\n!\ninterface vlan 20\n ip address 10.10.20.3 255.255.255.0\n standby 20 ip 10.10.20.1\n standby 20 priority 120\n standby 20 preempt\n..."},
    {name:"BR1",role:"BRANCH ROUTER / OSPF ABR",file:"BR1.txt",preview:"hostname BR1\n!\ninterface s0/0/0\n description WAN-TO-HQ\n ip address 10.255.10.2 255.255.255.252\n no shutdown\n!\ninterface g0/0.110\n encapsulation dot1Q 110\n ip address 10.20.10.1 255.255.255.0\n ip helper-address 10.10.30.10\n..."},
    {name:"ASW1",role:"HQ ACCESS SWITCH",file:"ASW1.txt",preview:"hostname ASW1\nspanning-tree mode rapid-pvst\n!\ninterface g0/1\n description UPLINK-DIST1\n switchport mode trunk\n switchport trunk allowed vlan 10,20,30,40,50,99\n!\ninterface range f0/1-10\n switchport mode access\n switchport access vlan 10\n switchport port-security\n..."},
    {name:"ASW2",role:"HQ SERVER / DMZ ACCESS",file:"ASW2.txt",preview:"hostname ASW2\nspanning-tree mode rapid-pvst\n!\ninterface f0/10\n description DHCP-DNS-SERVER\n switchport mode access\n switchport access vlan 30\n spanning-tree portfast\n!\ninterface f0/11\n description DMZ-WEB-SERVER\n switchport mode access\n switchport access vlan 50\n..."},
    {name:"BR-SW1",role:"BRANCH ACCESS SWITCH",file:"BR-SW1.txt",preview:"hostname BR-SW1\n!\nvlan 110\n name BR-USERS\nvlan 120\n name BR-GUEST\nvlan 199\n name BR-MGMT\n!\ninterface g0/1\n switchport mode trunk\n switchport trunk allowed vlan 110,120,199\n..."},
    {name:"ISP",role:"ISP SIMULATION ROUTER",file:"ISP.txt",preview:"hostname ISP\n!\ninterface g0/0\n description TO-EDGE1\n ip address 203.0.113.1 255.255.255.248\n no shutdown\n!\ninterface g0/1\n description PUBLIC-SERVER-LAN\n ip address 198.51.100.1 255.255.255.0\n no shutdown\n"}
  ];

  function setPage(page){
    qsa(".page").forEach(el=>el.classList.toggle("active",el.dataset.page===page));
    qsa(".nav-btn").forEach(el=>el.classList.toggle("active",el.dataset.section===page));
    window.scrollTo({top:0,behavior:"smooth"});
  }
  qsa(".nav-btn").forEach(btn=>btn.addEventListener("click",()=>setPage(btn.dataset.section)));
  qsa("[data-jump]").forEach(btn=>btn.addEventListener("click",()=>setPage(btn.dataset.jump)));

  qsa("[data-node]").forEach(btn=>btn.addEventListener("click",()=>{
    qsa("[data-node]").forEach(n=>n.classList.remove("selected"));
    btn.classList.add("selected");
    const info=nodeInfo[btn.dataset.node];
    $("nodeDetail").innerHTML="<span>"+btn.dataset.node+"</span><h3>"+info[0]+"</h3><p>"+info[1]+"</p>";
  }));

  function renderConfigs(){
    $("configList").innerHTML=configs.map((c,i)=>"<button class='config-item "+(i===0?"active":"")+"' data-config='"+i+"'><b>"+c.name+"</b><small>"+c.role+"</small></button>").join("");
    qsa("[data-config]").forEach(btn=>btn.addEventListener("click",()=>selectConfig(Number(btn.dataset.config))));
    selectConfig(0);
  }
  function selectConfig(i){
    const c=configs[i];
    qsa("[data-config]").forEach((b,idx)=>b.classList.toggle("active",idx===i));
    $("configRole").textContent=c.role;
    $("configTitle").textContent=c.name;
    $("configPreview").textContent=c.preview;
    $("configLink").href="https://github.com/Sachibara/Portfolio/blob/main/projects/cisco-enterprise-network/configs/"+c.file;
  }
  renderConfigs();
})();