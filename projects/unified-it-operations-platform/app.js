(() => {
  "use strict";

  const STORAGE_KEY = "opsfusion_unified_v1";
  const $ = (id) => document.getElementById(id);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const now = () => new Date().toISOString();
  const uid = (prefix) => prefix + "-" + (crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10)).toUpperCase();

  const pageMeta = {
    overview: ["Unified operations", "Overview"],
    endpoints: ["Shared source of truth", "Endpoints"],
    troubleshooting: ["Network diagnostics", "Troubleshooting"],
    remote: ["Endpoint operations", "Remote Support"],
    documentation: ["Network records", "Documentation"],
    compliance: ["Endpoint posture", "Compliance"],
    incidents: ["Service workflow", "Incidents"],
    audit: ["Governance", "Audit Log"],
    settings: ["Configuration", "Settings"]
  };

  function seedState() {
    const stamp = now();
    return {
      meta: {
        version: 1,
        workspaceName: "OpsFusion Unified",
        createdAt: stamp,
        updatedAt: stamp
      },
      settings: {
        autoTicketCompliance: false,
        autoTicketDiagnostic: false
      },
      complianceRules: {
        maxMissingUpdates: 0,
        maxRebootAge: 14,
        requireFirewall: true,
        requireBitlocker: true,
        requireAv: true
      },
      endpoints: [
        {
          id: "EP-001", hostname: "HQ-FIN-01", ip: "10.20.10.21", mac: "00:1A:2B:3C:10:21",
          site: "HQ", type: "Workstation", os: "Windows 11 24H2", model: "Dell OptiPlex 7010",
          owner: "Finance", agent: "online", lastSeen: stamp, gateway: "10.20.10.1", dns: "10.20.10.53",
          updatesMissing: 0, av: "healthy", firewall: true, bitlocker: true, rebootAge: 3,
          cpu: 22, memory: 54, disk: 63, complianceManaged: true, issue: "healthy"
        },
        {
          id: "EP-002", hostname: "HQ-HR-02", ip: "10.20.10.34", mac: "00:1A:2B:3C:10:34",
          site: "HQ", type: "Workstation", os: "Windows 11 24H2", model: "HP EliteDesk 800 G9",
          owner: "HR", agent: "online", lastSeen: stamp, gateway: "10.20.10.1", dns: "10.20.10.53",
          updatesMissing: 2, av: "healthy", firewall: true, bitlocker: true, rebootAge: 19,
          cpu: 31, memory: 67, disk: 72, complianceManaged: true, issue: "dns"
        },
        {
          id: "EP-003", hostname: "BR-WS-01", ip: "10.30.20.15", mac: "00:1A:2B:4D:20:15",
          site: "Branch", type: "Workstation", os: "Windows 11 23H2", model: "Lenovo ThinkCentre M80s",
          owner: "Sales", agent: "online", lastSeen: stamp, gateway: "10.30.20.1", dns: "10.30.20.10",
          updatesMissing: 1, av: "stale", firewall: false, bitlocker: true, rebootAge: 9,
          cpu: 44, memory: 71, disk: 58, complianceManaged: true, issue: "gateway"
        },
        {
          id: "EP-004", hostname: "BR-LAP-03", ip: "10.30.20.44", mac: "00:1A:2B:4D:20:44",
          site: "Branch", type: "Laptop", os: "Windows 11 24H2", model: "Dell Latitude 5450",
          owner: "Operations", agent: "offline", lastSeen: "2026-09-22T02:14:00.000Z", gateway: "10.30.20.1", dns: "10.30.20.10",
          updatesMissing: 0, av: "healthy", firewall: true, bitlocker: false, rebootAge: 5,
          cpu: 0, memory: 0, disk: 48, complianceManaged: true, issue: "offline"
        },
        {
          id: "EP-005", hostname: "HQ-SRV-AD01", ip: "10.20.30.10", mac: "00:1A:2B:3C:30:10",
          site: "HQ", type: "Server", os: "Windows Server 2025", model: "PowerEdge R350",
          owner: "Infrastructure", agent: "online", lastSeen: stamp, gateway: "10.20.30.1", dns: "10.20.30.10",
          updatesMissing: 0, av: "healthy", firewall: true, bitlocker: true, rebootAge: 8,
          cpu: 18, memory: 61, disk: 69, complianceManaged: true, issue: "port"
        },
        {
          id: "NET-001", hostname: "HQ-GW-01", ip: "10.20.10.1", mac: "00:AA:10:20:00:01",
          site: "HQ", type: "Router", os: "IOS XE", model: "Cisco ISR 4331",
          owner: "Network Team", agent: "online", lastSeen: stamp, gateway: "", dns: "10.20.10.53",
          updatesMissing: 0, av: "n/a", firewall: true, bitlocker: true, rebootAge: 1,
          cpu: 17, memory: 42, disk: 35, complianceManaged: false, issue: "healthy"
        },
        {
          id: "NET-002", hostname: "HQ-SW-01", ip: "10.20.10.2", mac: "00:AA:10:20:00:02",
          site: "HQ", type: "Switch", os: "IOS XE", model: "Catalyst 9200L",
          owner: "Network Team", agent: "online", lastSeen: stamp, gateway: "10.20.10.1", dns: "10.20.10.53",
          updatesMissing: 0, av: "n/a", firewall: true, bitlocker: true, rebootAge: 1,
          cpu: 14, memory: 39, disk: 31, complianceManaged: false, issue: "healthy"
        }
      ],
      vlans: [
        { id: "VLAN-10-HQ", site: "HQ", vlan: 10, name: "Users", cidr: "10.20.10.0/24", gateway: "10.20.10.1", dns: "10.20.10.53" },
        { id: "VLAN-30-HQ", site: "HQ", vlan: 30, name: "Servers", cidr: "10.20.30.0/24", gateway: "10.20.30.1", dns: "10.20.30.10" },
        { id: "VLAN-20-BR", site: "Branch", vlan: 20, name: "Branch Users", cidr: "10.30.20.0/24", gateway: "10.30.20.1", dns: "10.30.20.10" }
      ],
      ports: [
        { id: "PORT-001", switch: "HQ-SW-01", port: "Gi1/0/3", endpointId: "EP-001", vlan: 10 },
        { id: "PORT-002", switch: "HQ-SW-01", port: "Gi1/0/7", endpointId: "EP-002", vlan: 10 },
        { id: "PORT-003", switch: "HQ-SW-01", port: "Gi1/0/24", endpointId: "NET-001", vlan: 10 }
      ],
      docChanges: [
        { id: "DOC-001", detail: "Initial HQ and Branch network documentation baseline.", createdAt: stamp }
      ],
      diagnostics: [],
      remoteActions: [],
      incidents: [
        {
          id: "INC-1001", endpointId: "EP-002", title: "HR workstation cannot resolve internal names",
          priority: "P2", status: "Active", source: "Troubleshooting", createdAt: stamp
        },
        {
          id: "INC-1002", endpointId: "EP-004", title: "Branch laptop agent offline",
          priority: "P3", status: "Pending", source: "Monitoring", createdAt: stamp
        }
      ],
      audit: [
        { id: "AUD-001", module: "System", action: "Workspace initialized", target: "OpsFusion", detail: "Unified shared-data workspace created.", createdAt: stamp }
      ]
    };
  }

  function loadState() {
    const base = seedState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return base;
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.endpoints)) return base;
      return {
        ...base,
        ...parsed,
        meta: { ...base.meta, ...(parsed.meta || {}) },
        settings: { ...base.settings, ...(parsed.settings || {}) },
        complianceRules: { ...base.complianceRules, ...(parsed.complianceRules || {}) },
        endpoints: Array.isArray(parsed.endpoints) ? parsed.endpoints : base.endpoints,
        vlans: Array.isArray(parsed.vlans) ? parsed.vlans : base.vlans,
        ports: Array.isArray(parsed.ports) ? parsed.ports : base.ports,
        docChanges: Array.isArray(parsed.docChanges) ? parsed.docChanges : base.docChanges,
        diagnostics: Array.isArray(parsed.diagnostics) ? parsed.diagnostics : [],
        remoteActions: Array.isArray(parsed.remoteActions) ? parsed.remoteActions : [],
        incidents: Array.isArray(parsed.incidents) ? parsed.incidents : base.incidents,
        audit: Array.isArray(parsed.audit) ? parsed.audit : base.audit
      };
    } catch (error) {
      console.warn("Unable to restore OpsFusion workspace:", error);
      return base;
    }
  }

  let state = loadState();
  let currentEndpointId = state.endpoints[0] ? state.endpoints[0].id : null;
  let selectedDiagnosticId = null;

  function saveState() {
    state.meta.updatedAt = now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function fmtDate(value) {
    if (!value) return "—";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
  }

  function toast(title, message) {
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = "<strong>" + esc(title) + "</strong><span>" + esc(message || "") + "</span>";
    $("toastRegion").appendChild(el);
    setTimeout(() => el.remove(), 3600);
  }

  function audit(module, action, target, detail) {
    state.audit.unshift({
      id: uid("AUD"),
      module: String(module || "System"),
      action: String(action || "Action"),
      target: String(target || ""),
      detail: String(detail || ""),
      createdAt: now()
    });
    state.audit = state.audit.slice(0, 500);
  }

  function endpointById(id) {
    return state.endpoints.find((item) => item.id === id) || null;
  }

  function incidentById(id) {
    return state.incidents.find((item) => item.id === id) || null;
  }

  function badge(text, tone) {
    return '<span class="badge ' + esc(tone || "") + '">' + esc(text) + "</span>";
  }

  function agentBadge(agent) {
    return agent === "online" ? badge("Online", "green") : badge("Offline", "red");
  }

  function priorityTone(priority) {
    if (priority === "P1") return "red";
    if (priority === "P2") return "amber";
    if (priority === "P3") return "blue";
    return "purple";
  }

  function statusTone(status) {
    if (status === "Resolved" || status === "Closed") return "green";
    if (status === "Pending") return "amber";
    if (status === "New" || status === "Active") return "blue";
    return "purple";
  }

  function evaluateEndpoint(endpoint) {
    if (!endpoint || endpoint.complianceManaged === false) {
      return { status: "not-applicable", failures: [], checks: [] };
    }
    const rules = state.complianceRules;
    const checks = [
      { key: "updates", label: "Missing updates", pass: Number(endpoint.updatesMissing || 0) <= Number(rules.maxMissingUpdates || 0), value: Number(endpoint.updatesMissing || 0) },
      { key: "av", label: "Antivirus / EDR", pass: !rules.requireAv || endpoint.av === "healthy", value: endpoint.av },
      { key: "firewall", label: "Endpoint firewall", pass: !rules.requireFirewall || endpoint.firewall === true, value: endpoint.firewall ? "Enabled" : "Disabled" },
      { key: "bitlocker", label: "Disk encryption", pass: !rules.requireBitlocker || endpoint.bitlocker === true, value: endpoint.bitlocker ? "Enabled" : "Disabled" },
      { key: "reboot", label: "Reboot age", pass: Number(endpoint.rebootAge || 0) <= Number(rules.maxRebootAge || 14), value: String(endpoint.rebootAge || 0) + " days" }
    ];
    const failures = checks.filter((check) => !check.pass);
    return { status: failures.length ? "noncompliant" : "compliant", failures, checks };
  }

  function fleetStats() {
    const managed = state.endpoints.filter((e) => e.complianceManaged !== false);
    const compliant = managed.filter((e) => evaluateEndpoint(e).status === "compliant").length;
    const online = state.endpoints.filter((e) => e.agent === "online").length;
    const openIncidents = state.incidents.filter((i) => !["Resolved", "Closed"].includes(i.status)).length;
    const complianceRate = managed.length ? Math.round((compliant / managed.length) * 100) : 100;
    const onlineRate = state.endpoints.length ? Math.round((online / state.endpoints.length) * 100) : 100;
    const incidentPenalty = Math.min(35, openIncidents * 6);
    const health = Math.max(0, Math.round(complianceRate * 0.5 + onlineRate * 0.35 + (100 - incidentPenalty) * 0.15));
    return { managed, compliant, online, openIncidents, complianceRate, onlineRate, health };
  }

  function openPage(page) {
    qsa("[data-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === page));
    qsa("[data-page]").forEach((button) => button.classList.toggle("active", button.dataset.page === page));
    if (pageMeta[page]) {
      $("pageEyebrow").textContent = pageMeta[page][0];
      $("pageTitle").textContent = pageMeta[page][1];
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    renderPage(page);
  }

  qsa("[data-page]").forEach((button) => button.addEventListener("click", () => openPage(button.dataset.page)));
  qsa("[data-go]").forEach((button) => button.addEventListener("click", () => openPage(button.dataset.go)));

  function renderPage(page) {
    if (page === "overview") renderOverview();
    if (page === "endpoints") renderEndpoints();
    if (page === "troubleshooting") renderTroubleshooting();
    if (page === "remote") renderRemote();
    if (page === "documentation") renderDocumentation();
    if (page === "compliance") renderCompliance();
    if (page === "incidents") renderIncidents();
    if (page === "audit") renderAudit();
    if (page === "settings") renderSettings();
  }

  function renderOverview() {
    const stats = fleetStats();
    $("kpiEndpoints").textContent = state.endpoints.length;
    $("kpiOnline").textContent = stats.online;
    $("kpiCompliance").textContent = stats.complianceRate + "%";
    $("kpiIncidents").textContent = stats.openIncidents;
    $("kpiDiagnostics").textContent = state.diagnostics.length;
    $("healthScoreHero").textContent = stats.health + "%";
    $("healthLabelHero").textContent = stats.health >= 90 ? "Healthy operations" : stats.health >= 75 ? "Attention required" : "Operational risk";
    $("healthBar").style.width = stats.health + "%";

    const attention = state.endpoints
      .map((endpoint) => ({ endpoint, compliance: evaluateEndpoint(endpoint) }))
      .filter((row) => row.endpoint.agent !== "online" || row.compliance.status === "noncompliant")
      .slice(0, 6);

    $("attentionQueue").innerHTML = attention.length ? attention.map((row) => {
      const reasons = [];
      if (row.endpoint.agent !== "online") reasons.push("agent offline");
      reasons.push(...row.compliance.failures.map((f) => f.label));
      return '<div class="stack-row"><div><strong>' + esc(row.endpoint.hostname) + '</strong><small>' +
        esc(row.endpoint.ip + " · " + row.endpoint.site + " · " + reasons.join(", ")) +
        '</small></div><button class="mini-btn" data-open-endpoint="' + esc(row.endpoint.id) + '">Open</button></div>';
    }).join("") : '<div class="empty">No endpoints require attention.</div>';

    const incidents = state.incidents.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
    $("recentIncidents").innerHTML = incidents.length ? incidents.map((incident) => {
      const ep = endpointById(incident.endpointId);
      return '<div class="stack-row"><div><strong>' + esc(incident.id + " · " + incident.title) + '</strong><small>' +
        esc((ep ? ep.hostname : "Unassigned") + " · " + incident.source) +
        '</small></div>' + badge(incident.status, statusTone(incident.status)) + '</div>';
    }).join("") : '<div class="empty">No incidents yet.</div>';

    $("overviewAudit").innerHTML = renderAuditEntries(state.audit.slice(0, 8));
    bindOpenEndpointButtons();
  }

  function uniqueSites() {
    return Array.from(new Set(state.endpoints.map((e) => e.site).filter(Boolean))).sort();
  }

  function fillEndpointSelect(select, selectedId, includeNetwork = true) {
    if (!select) return;
    const current = selectedId || select.value || currentEndpointId;
    const list = includeNetwork ? state.endpoints : state.endpoints.filter((e) => e.complianceManaged !== false);
    select.innerHTML = list.map((e) => '<option value="' + esc(e.id) + '">' + esc(e.hostname + " · " + e.ip) + "</option>").join("");
    if (list.some((e) => e.id === current)) select.value = current;
    else if (list[0]) select.value = list[0].id;
  }

  function renderEndpoints() {
    const siteFilter = $("endpointSiteFilter");
    const previousSite = siteFilter.value;
    siteFilter.innerHTML = '<option value="">All sites</option>' + uniqueSites().map((site) => '<option value="' + esc(site) + '">' + esc(site) + "</option>").join("");
    siteFilter.value = uniqueSites().includes(previousSite) ? previousSite : "";

    const search = $("endpointSearch").value.trim().toLowerCase();
    const site = siteFilter.value;
    const agent = $("endpointStateFilter").value;

    const rows = state.endpoints.filter((e) => {
      const haystack = [e.hostname, e.ip, e.owner, e.site, e.os, e.type].join(" ").toLowerCase();
      return (!search || haystack.includes(search)) && (!site || e.site === site) && (!agent || e.agent === agent);
    });

    $("endpointRows").innerHTML = rows.length ? rows.map((e) => {
      const comp = evaluateEndpoint(e);
      const compBadge = comp.status === "not-applicable" ? badge("N/A", "purple") :
        comp.status === "compliant" ? badge("Compliant", "green") : badge("Needs action", "amber");
      return "<tr>" +
        '<td><span class="cell-title">' + esc(e.hostname) + '</span><span class="cell-sub">' + esc(e.type + " · " + e.model) + "</span></td>" +
        "<td>" + esc(e.ip) + "</td><td>" + esc(e.site) + "</td><td>" + esc(e.owner || "—") + "</td><td>" + esc(e.os) + "</td>" +
        "<td>" + agentBadge(e.agent) + "</td><td>" + compBadge + '</td><td><button class="mini-btn" data-open-endpoint="' + esc(e.id) + '">Open</button></td></tr>';
    }).join("") : '<tr><td colspan="8" class="empty">No endpoints match the current filters.</td></tr>';

    bindOpenEndpointButtons();
  }

  function bindOpenEndpointButtons() {
    qsa("[data-open-endpoint]").forEach((button) => {
      button.onclick = () => openEndpointModal(button.dataset.openEndpoint);
    });
  }

  function showModal(title, bodyHtml, setup) {
    $("modalTitle").textContent = title;
    $("modalBody").innerHTML = bodyHtml;
    $("modalBackdrop").hidden = false;
    if (typeof setup === "function") setup($("modalBody"));
  }

  function closeModal() {
    $("modalBackdrop").hidden = true;
    $("modalBody").innerHTML = "";
  }

  $("modalCloseBtn").addEventListener("click", closeModal);
  $("modalBackdrop").addEventListener("click", (event) => {
    if (event.target === $("modalBackdrop")) closeModal();
  });

  function openEndpointModal(id) {
    const e = endpointById(id);
    if (!e) return;
    currentEndpointId = e.id;
    const comp = evaluateEndpoint(e);
    const failures = comp.failures.length ? comp.failures.map((f) => f.label).join(", ") : "None";
    showModal("Endpoint · " + e.hostname,
      '<div class="endpoint-card"><h3>' + esc(e.hostname) + '</h3><p>' + esc(e.ip + " · " + e.site + " · " + e.type) + '</p>' +
      '<div class="endpoint-meta">' +
      '<div><span>Owner</span><strong>' + esc(e.owner || "—") + '</strong></div>' +
      '<div><span>Agent</span><strong>' + esc(e.agent) + '</strong></div>' +
      '<div><span>OS</span><strong>' + esc(e.os) + '</strong></div>' +
      '<div><span>Model</span><strong>' + esc(e.model) + '</strong></div>' +
      '<div><span>Gateway</span><strong>' + esc(e.gateway || "—") + '</strong></div>' +
      '<div><span>DNS</span><strong>' + esc(e.dns || "—") + '</strong></div>' +
      '<div><span>Compliance</span><strong>' + esc(comp.status) + '</strong></div>' +
      '<div><span>Failures</span><strong>' + esc(failures) + '</strong></div>' +
      '</div></div>' +
      '<div class="modal-actions">' +
      '<button class="btn secondary" data-modal-page="documentation">Documentation</button>' +
      '<button class="btn secondary" data-modal-page="compliance">Compliance</button>' +
      '<button class="btn secondary" data-modal-page="remote">Remote Support</button>' +
      '<button class="btn primary" data-modal-page="troubleshooting">Troubleshoot</button>' +
      '</div>',
      (root) => {
        qsa("[data-modal-page]", root).forEach((button) => button.addEventListener("click", () => {
          closeModal();
          openPage(button.dataset.modalPage);
          if (button.dataset.modalPage === "troubleshooting") {
            $("diagEndpoint").value = e.id;
            currentEndpointId = e.id;
          }
          if (button.dataset.modalPage === "remote") {
            $("remoteEndpoint").value = e.id;
            currentEndpointId = e.id;
            renderRemote();
          }
        }));
      }
    );
  }

  $("endpointSearch").addEventListener("input", renderEndpoints);
  $("endpointSiteFilter").addEventListener("change", renderEndpoints);
  $("endpointStateFilter").addEventListener("change", renderEndpoints);

  $("addEndpointBtn").addEventListener("click", () => {
    const sites = uniqueSites();
    showModal("Add Endpoint",
      '<div class="form-grid">' +
      '<label class="field"><span>Hostname</span><input id="mHostname" required placeholder="HQ-WS-05"></label>' +
      '<label class="field"><span>IPv4 address</span><input id="mIp" required placeholder="10.20.10.50"></label>' +
      '<label class="field"><span>Site</span><input id="mSite" list="siteList" required placeholder="HQ"><datalist id="siteList">' + sites.map((s) => '<option value="' + esc(s) + '"></option>').join("") + '</datalist></label>' +
      '<label class="field"><span>Type</span><select id="mType"><option>Workstation</option><option>Laptop</option><option>Server</option><option>Router</option><option>Switch</option><option>Access Point</option></select></label>' +
      '<label class="field"><span>Owner</span><input id="mOwner" placeholder="Department / user"></label>' +
      '<label class="field"><span>OS / platform</span><input id="mOs" placeholder="Windows 11 24H2"></label>' +
      '<label class="field"><span>Model</span><input id="mModel" placeholder="Dell OptiPlex"></label>' +
      '<label class="field"><span>Agent</span><select id="mAgent"><option value="online">Online</option><option value="offline">Offline</option></select></label>' +
      '</div><div class="modal-actions"><button class="btn secondary" id="mCancel">Cancel</button><button class="btn primary" id="mSave">Add Endpoint</button></div>',
      (root) => {
        $("mCancel").onclick = closeModal;
        $("mSave").onclick = () => {
          const hostname = $("mHostname").value.trim();
          const ip = $("mIp").value.trim();
          const site = $("mSite").value.trim();
          if (!hostname || !validIp(ip) || !site) {
            toast("Invalid endpoint", "Hostname, valid IPv4 address, and site are required.");
            return;
          }
          if (state.endpoints.some((e) => e.hostname.toLowerCase() === hostname.toLowerCase() || e.ip === ip)) {
            toast("Duplicate endpoint", "Hostname and IP address must be unique.");
            return;
          }
          const type = $("mType").value;
          const managed = ["Workstation", "Laptop", "Server"].includes(type);
          const endpoint = {
            id: uid(managed ? "EP" : "NET"), hostname, ip, mac: "—", site, type,
            os: $("mOs").value.trim() || "Unknown", model: $("mModel").value.trim() || "Unknown",
            owner: $("mOwner").value.trim() || "Unassigned", agent: $("mAgent").value,
            lastSeen: now(), gateway: "", dns: "", updatesMissing: 0, av: managed ? "healthy" : "n/a",
            firewall: true, bitlocker: true, rebootAge: 0, cpu: 0, memory: 0, disk: 0,
            complianceManaged: managed, issue: "healthy"
          };
          state.endpoints.push(endpoint);
          currentEndpointId = endpoint.id;
          audit("Inventory", "Endpoint added", endpoint.hostname, endpoint.ip + " · " + endpoint.site);
          saveState();
          closeModal();
          renderAll();
          toast("Endpoint added", endpoint.hostname);
        };
      }
    );
  });

  function renderTroubleshooting() {
    fillEndpointSelect($("diagEndpoint"), currentEndpointId, true);
    if ($("diagEndpoint").value) currentEndpointId = $("diagEndpoint").value;
    renderDiagnosticSummary();
  }

  $("diagEndpoint").addEventListener("change", () => {
    currentEndpointId = $("diagEndpoint").value;
  });

  function diagnosticStep(endpoint, type, port) {
    const issue = endpoint.issue || "healthy";
    if (type === "ping") {
      if (issue === "offline") return { name: "Reachability", pass: false, detail: "No ICMP response from " + endpoint.ip + "." };
      if (issue === "gateway") return { name: "Reachability", pass: true, detail: "Host replies with elevated latency (86 ms)." };
      return { name: "Reachability", pass: true, detail: "Host replied successfully (12 ms average)." };
    }
    if (type === "gateway") {
      if (!endpoint.gateway) return { name: "Gateway", pass: true, detail: "No gateway expected for this record." };
      if (issue === "gateway" || issue === "offline") return { name: "Gateway", pass: false, detail: "Default gateway " + endpoint.gateway + " is unreachable." };
      return { name: "Gateway", pass: true, detail: "Default gateway " + endpoint.gateway + " is reachable." };
    }
    if (type === "dns") {
      if (issue === "dns" || issue === "offline") return { name: "DNS", pass: false, detail: "DNS lookup failed through " + (endpoint.dns || "configured resolver") + "." };
      return { name: "DNS", pass: true, detail: "DNS resolution completed successfully through " + (endpoint.dns || "configured resolver") + "." };
    }
    if (type === "internet") {
      if (["gateway", "offline"].includes(issue)) return { name: "Internet", pass: false, detail: "External reachability failed because the local path is unavailable." };
      return { name: "Internet", pass: true, detail: "External HTTPS reachability is available." };
    }
    if (type === "port") {
      if (issue === "offline") return { name: "TCP " + port, pass: false, detail: "Endpoint is offline; TCP test cannot complete." };
      if (issue === "port" && Number(port) === 443) return { name: "TCP " + port, pass: false, detail: "TCP port " + port + " is not accepting connections." };
      return { name: "TCP " + port, pass: true, detail: "TCP port " + port + " is reachable in the simulated endpoint profile." };
    }
    if (type === "trace") {
      if (issue === "offline") return { name: "Route trace", pass: false, detail: "Trace stops before the destination because the endpoint is offline." };
      if (issue === "gateway") return { name: "Route trace", pass: false, detail: "Trace stops at the local access segment before the default gateway." };
      return { name: "Route trace", pass: true, detail: "Route path: endpoint → gateway → WAN edge → destination." };
    }
    return { name: type, pass: true, detail: "Test completed." };
  }

  function runDiagnostic() {
    const endpoint = endpointById($("diagEndpoint").value);
    if (!endpoint) return;
    currentEndpointId = endpoint.id;
    const type = $("diagType").value;
    const port = Math.max(1, Math.min(65535, Number($("diagPort").value) || 443));
    const types = type === "full" ? ["ping", "gateway", "dns", "internet", "port", "trace"] : [type];
    const results = types.map((t) => diagnosticStep(endpoint, t, port));
    const pass = results.every((r) => r.pass);
    const diagnosis = pass ? "No blocking fault detected in the selected test scope." :
      results.some((r) => !r.pass && r.name === "DNS") ? "Likely DNS resolver or name-resolution path issue." :
      results.some((r) => !r.pass && r.name === "Gateway") ? "Likely local gateway, VLAN, routing, or access-path issue." :
      results.some((r) => !r.pass && r.name.startsWith("TCP")) ? "Likely service, host firewall, or upstream port-policy issue." :
      "Endpoint or path is unavailable and requires connectivity investigation.";
    const record = {
      id: uid("DIAG"), endpointId: endpoint.id, type, port, status: pass ? "pass" : "fail",
      summary: diagnosis, results, createdAt: now()
    };
    state.diagnostics.unshift(record);
    state.diagnostics = state.diagnostics.slice(0, 200);
    selectedDiagnosticId = record.id;
    audit("Troubleshooting", "Diagnostic completed", endpoint.hostname, type + " · " + record.status.toUpperCase() + " · " + diagnosis);

    if (!pass && type === "full" && state.settings.autoTicketDiagnostic) {
      createIncident({
        endpointId: endpoint.id,
        title: "Failed full diagnostic: " + diagnosis,
        priority: "P2",
        source: "Troubleshooting"
      }, true);
    }

    saveState();
    renderDiagnosticOutput(record);
    renderDiagnosticSummary();
    renderOverview();
    toast("Diagnostic completed", endpoint.hostname + " · " + record.status.toUpperCase());
  }

  $("runDiagBtn").addEventListener("click", runDiagnostic);

  function renderDiagnosticOutput(record) {
    const endpoint = endpointById(record.endpointId);
    const lines = [
      "OpsFusion Guided Diagnostic",
      "Endpoint: " + (endpoint ? endpoint.hostname + " (" + endpoint.ip + ")" : record.endpointId),
      "Started: " + fmtDate(record.createdAt),
      ""
    ];
    record.results.forEach((result) => {
      lines.push("[" + (result.pass ? "PASS" : "FAIL") + "] " + result.name);
      lines.push("  " + result.detail);
    });
    lines.push("");
    lines.push("Interpretation: " + record.summary);
    lines.push("Mode: portfolio-safe simulation; real probes require an authorized local agent.");
    $("diagTerminal").textContent = lines.join("\n");
  }

  function renderDiagnosticSummary() {
    const record = selectedDiagnosticId ? state.diagnostics.find((d) => d.id === selectedDiagnosticId) : state.diagnostics[0];
    if (!record) {
      $("diagSummary").className = "detail-empty";
      $("diagSummary").textContent = "No diagnostic selected yet.";
      $("diagCreateIncidentBtn").disabled = true;
      $("diagOpenEndpointBtn").disabled = true;
      return;
    }
    selectedDiagnosticId = record.id;
    const endpoint = endpointById(record.endpointId);
    $("diagSummary").className = "diag-card";
    $("diagSummary").innerHTML =
      "<h4>" + esc((endpoint ? endpoint.hostname : record.endpointId) + " · " + record.status.toUpperCase()) + "</h4>" +
      "<p>" + esc(record.summary) + "</p>" +
      '<div class="diag-lines">' +
      record.results.map((r) => '<div class="diag-line"><span>' + esc(r.name) + '</span>' + badge(r.pass ? "Pass" : "Fail", r.pass ? "green" : "red") + "</div>").join("") +
      "</div>";
    $("diagCreateIncidentBtn").disabled = false;
    $("diagOpenEndpointBtn").disabled = !endpoint;
  }

  $("diagCreateIncidentBtn").addEventListener("click", () => {
    const record = state.diagnostics.find((d) => d.id === selectedDiagnosticId);
    if (!record) return;
    const endpoint = endpointById(record.endpointId);
    createIncident({
      endpointId: record.endpointId,
      title: "Diagnostic follow-up: " + record.summary,
      priority: record.status === "fail" ? "P2" : "P4",
      source: "Troubleshooting"
    });
    renderDiagnosticSummary();
    toast("Incident created", endpoint ? endpoint.hostname : record.endpointId);
  });

  $("diagOpenEndpointBtn").addEventListener("click", () => {
    const record = state.diagnostics.find((d) => d.id === selectedDiagnosticId);
    if (record) openEndpointModal(record.endpointId);
  });

  function ipToInt(ip) {
    return ip.split(".").reduce((acc, octet) => ((acc << 8) + Number(octet)) >>> 0, 0) >>> 0;
  }

  function intToIp(value) {
    return [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join(".");
  }

  function validIp(ip) {
    const parts = String(ip || "").split(".");
    return parts.length === 4 && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) >= 0 && Number(part) <= 255);
  }

  function calculateCidr(value) {
    const parts = String(value || "").trim().split("/");
    const ip = parts[0];
    const prefix = Number(parts[1]);
    if (!validIp(ip) || !Number.isInteger(prefix) || prefix < 0 || prefix > 32) throw new Error("Enter a valid IPv4 CIDR, e.g. 192.168.10.25/24.");
    const ipInt = ipToInt(ip);
    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    const network = (ipInt & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const total = Math.pow(2, 32 - prefix);
    const usable = prefix >= 31 ? total : Math.max(0, total - 2);
    const first = prefix >= 31 ? network : network + 1;
    const last = prefix >= 31 ? broadcast : broadcast - 1;
    return {
      network: intToIp(network) + "/" + prefix,
      mask: intToIp(mask),
      broadcast: intToIp(broadcast),
      usable: usable,
      range: intToIp(first >>> 0) + " – " + intToIp(last >>> 0)
    };
  }

  $("cidrCalcBtn").addEventListener("click", () => {
    try {
      const result = calculateCidr($("cidrInput").value);
      $("cidrOutput").innerHTML =
        '<div><span>Network</span><strong>' + esc(result.network) + '</strong></div>' +
        '<div><span>Subnet mask</span><strong>' + esc(result.mask) + '</strong></div>' +
        '<div><span>Broadcast</span><strong>' + esc(result.broadcast) + '</strong></div>' +
        '<div><span>Usable hosts</span><strong>' + esc(result.usable) + '</strong></div>' +
        '<div style="grid-column:1/-1"><span>Host range</span><strong>' + esc(result.range) + "</strong></div>";
    } catch (error) {
      $("cidrOutput").innerHTML = '<div style="grid-column:1/-1"><span>Error</span><strong class="text-red">' + esc(error.message) + "</strong></div>";
    }
  });

  function renderRemote() {
    fillEndpointSelect($("remoteEndpoint"), currentEndpointId, true);
    const endpoint = endpointById($("remoteEndpoint").value);
    if (endpoint) currentEndpointId = endpoint.id;
    renderRemoteEndpointCard();
    renderRemoteActions();
  }

  $("remoteEndpoint").addEventListener("change", () => {
    currentEndpointId = $("remoteEndpoint").value;
    renderRemoteEndpointCard();
  });

  function renderRemoteEndpointCard() {
    const endpoint = endpointById($("remoteEndpoint").value);
    if (!endpoint) {
      $("remoteEndpointCard").innerHTML = '<div class="empty">No endpoint selected.</div>';
      return;
    }
    $("remoteEndpointCard").innerHTML =
      "<h3>" + esc(endpoint.hostname) + "</h3><p>" + esc(endpoint.ip + " · " + endpoint.site + " · " + endpoint.type) + "</p>" +
      '<div class="endpoint-meta">' +
      '<div><span>Agent</span><strong>' + esc(endpoint.agent) + '</strong></div>' +
      '<div><span>Last seen</span><strong>' + esc(fmtDate(endpoint.lastSeen)) + '</strong></div>' +
      '<div><span>CPU</span><strong>' + esc(endpoint.cpu + "%") + '</strong></div>' +
      '<div><span>Memory</span><strong>' + esc(endpoint.memory + "%") + '</strong></div>' +
      '<div><span>Disk</span><strong>' + esc(endpoint.disk + "%") + '</strong></div>' +
      '<div><span>Owner</span><strong>' + esc(endpoint.owner) + "</strong></div></div>";
    qsa("[data-remote-action]").forEach((button) => button.disabled = endpoint.agent !== "online");
  }

  function remoteOutput(endpoint, action) {
    const header = ["OpsFusion Remote Support", "Endpoint: " + endpoint.hostname + " (" + endpoint.ip + ")", "Action: " + action, ""];
    if (action === "system") {
      return header.concat([
        "OS: " + endpoint.os,
        "Model: " + endpoint.model,
        "CPU utilization: " + endpoint.cpu + "%",
        "Memory utilization: " + endpoint.memory + "%",
        "Disk utilization: " + endpoint.disk + "%",
        "Last agent check-in: " + fmtDate(endpoint.lastSeen)
      ]).join("\n");
    }
    if (action === "software") {
      return header.concat([
        "Microsoft 365 Apps · Current Channel",
        "Microsoft Edge · Managed",
        "Endpoint Security Agent · Healthy",
        "7-Zip · Approved",
        "Inventory source: portfolio-safe seeded endpoint profile"
      ]).join("\n");
    }
    if (action === "disk") {
      return header.concat([
        "Disk utilization: " + endpoint.disk + "%",
        "SMART summary: Healthy",
        "Free-space assessment: " + (endpoint.disk >= 85 ? "Action recommended" : "Within threshold"),
        "BitLocker: " + (endpoint.bitlocker ? "Enabled" : "Not enabled")
      ]).join("\n");
    }
    if (action === "network") {
      return header.concat([
        "IPv4: " + endpoint.ip,
        "Gateway: " + (endpoint.gateway || "N/A"),
        "DNS: " + (endpoint.dns || "N/A"),
        "Reachability profile: " + endpoint.issue,
        "Use the Troubleshooting module for interpreted diagnostics."
      ]).join("\n");
    }
    if (action === "logs") {
      return header.concat([
        "Collected: System event summary",
        "Collected: Application event summary",
        "Collected: Network adapter snapshot",
        "Collected: Endpoint agent status",
        "Result: Diagnostic package staged in portfolio workspace"
      ]).join("\n");
    }
    return header.concat(["Action completed in portfolio-safe simulation mode."]).join("\n");
  }

  qsa("[data-remote-action]").forEach((button) => button.addEventListener("click", () => {
    const endpoint = endpointById($("remoteEndpoint").value);
    if (!endpoint) return;
    const action = button.dataset.remoteAction;
    if (endpoint.agent !== "online") {
      toast("Endpoint offline", "Remote actions require an online agent.");
      return;
    }
    if (action === "service") {
      showServiceRestartModal(endpoint);
      return;
    }
    const labelMap = { system: "System Info", software: "Software Inventory", disk: "Disk Health", network: "Network Diagnostics", logs: "Collect Logs" };
    const label = labelMap[action] || action;
    const record = { id: uid("RA"), endpointId: endpoint.id, action: label, status: "Completed", reference: "", createdAt: now() };
    state.remoteActions.unshift(record);
    state.remoteActions = state.remoteActions.slice(0, 200);
    audit("Remote Support", label, endpoint.hostname, "Approved read-only support action completed.");
    saveState();
    $("remoteConsole").textContent = remoteOutput(endpoint, action);
    renderRemoteActions();
    renderOverview();
    toast("Remote action completed", endpoint.hostname + " · " + label);
  }));

  function showServiceRestartModal(endpoint) {
    showModal("Restart Approved Service",
      '<label class="field"><span>Service</span><select id="mService"><option>Print Spooler</option><option>Windows Update</option><option>DNS Client</option></select></label>' +
      '<label class="field"><span>Ticket / change reference</span><input id="mReference" placeholder="INC-1001 or CHG-204"></label>' +
      '<p style="font-size:.55rem;color:var(--muted)">State-changing support actions require an operational reference. This portfolio build simulates the restart and records it in the audit trail.</p>' +
      '<div class="modal-actions"><button class="btn secondary" id="mCancel">Cancel</button><button class="btn primary" id="mConfirm">Confirm Restart</button></div>',
      () => {
        $("mCancel").onclick = closeModal;
        $("mConfirm").onclick = () => {
          const reference = $("mReference").value.trim();
          const service = $("mService").value;
          if (!reference) {
            toast("Reference required", "Enter a ticket or approved change reference.");
            return;
          }
          const record = { id: uid("RA"), endpointId: endpoint.id, action: "Restart " + service, status: "Completed", reference, createdAt: now() };
          state.remoteActions.unshift(record);
          audit("Remote Support", "Approved service restart", endpoint.hostname, service + " · Reference " + reference);
          saveState();
          closeModal();
          $("remoteConsole").textContent = [
            "OpsFusion Remote Support",
            "Endpoint: " + endpoint.hostname,
            "Approved action: Restart " + service,
            "Reference: " + reference,
            "",
            "Service stop: simulated successful",
            "Service start: simulated successful",
            "Post-check: simulated healthy",
            "",
            "No arbitrary shell execution is exposed by this portfolio workflow."
          ].join("\n");
          renderRemoteActions();
          renderOverview();
          toast("Service restart recorded", endpoint.hostname + " · " + service);
        };
      }
    );
  }

  function renderRemoteActions() {
    const rows = state.remoteActions.slice(0, 12);
    $("remoteActionRows").innerHTML = rows.length ? rows.map((row) => {
      const ep = endpointById(row.endpointId);
      return '<div class="stack-row"><div><strong>' + esc(row.action + " · " + (ep ? ep.hostname : row.endpointId)) +
        '</strong><small>' + esc(fmtDate(row.createdAt) + (row.reference ? " · " + row.reference : "")) +
        '</small></div>' + badge(row.status, "green") + "</div>";
    }).join("") : '<div class="empty">No remote actions recorded yet.</div>';
  }

  function renderDocumentation() {
    $("docDevices").textContent = state.endpoints.length;
    $("docSites").textContent = uniqueSites().length;
    $("docVlans").textContent = state.vlans.length;
    $("docPorts").textContent = state.ports.length;

    const grouped = {};
    state.endpoints.forEach((e) => {
      if (!grouped[e.site]) grouped[e.site] = [];
      grouped[e.site].push(e);
    });
    $("topology").innerHTML = Object.keys(grouped).sort().map((site) =>
      '<div class="topology-site"><strong>' + esc(site) + '</strong><div class="topology-nodes">' +
      grouped[site].map((e) => '<div class="topology-node"><b>' + esc(e.hostname) + '</b><span>' + esc(e.type + " · " + e.ip) + "</span></div>").join("") +
      "</div></div>"
    ).join("");

    $("vlanRows").innerHTML = state.vlans.length ? state.vlans.map((v) =>
      '<div class="stack-row"><div><strong>' + esc(v.site + " · VLAN " + v.vlan + " · " + v.name) +
      '</strong><small>' + esc(v.cidr + " · GW " + v.gateway + " · DNS " + v.dns) +
      '</small></div><button class="mini-btn danger" data-remove-vlan="' + esc(v.id) + '">Remove</button></div>'
    ).join("") : '<div class="empty">No VLAN plans documented.</div>';

    $("docDeviceRows").innerHTML = state.endpoints.map((e) =>
      "<tr><td>" + esc(e.hostname) + "</td><td>" + esc(e.type) + "</td><td>" + esc(e.ip) + "</td><td>" + esc(e.site) +
      "</td><td>" + esc(e.model + " · " + e.os) + "</td><td>" + esc(e.owner) + "</td></tr>"
    ).join("");

    $("portRows").innerHTML = state.ports.length ? state.ports.map((p) => {
      const e = endpointById(p.endpointId);
      return '<div class="stack-row"><div><strong>' + esc(p.switch + " · " + p.port) +
        '</strong><small>' + esc((e ? e.hostname : p.endpointId) + " · VLAN " + p.vlan) +
        '</small></div><button class="mini-btn danger" data-remove-port="' + esc(p.id) + '">Remove</button></div>';
    }).join("") : '<div class="empty">No switch port mappings documented.</div>';

    $("docChangeRows").innerHTML = state.docChanges.slice(0, 12).map((c) =>
      '<div class="stack-row"><div><strong>' + esc(c.detail) + '</strong><small>' + esc(fmtDate(c.createdAt)) + "</small></div></div>"
    ).join("") || '<div class="empty">No documentation changes yet.</div>';

    qsa("[data-remove-vlan]").forEach((button) => button.onclick = () => {
      const row = state.vlans.find((v) => v.id === button.dataset.removeVlan);
      state.vlans = state.vlans.filter((v) => v.id !== button.dataset.removeVlan);
      audit("Documentation", "VLAN removed", row ? row.site + " VLAN " + row.vlan : button.dataset.removeVlan, row ? row.cidr : "");
      saveState();
      renderDocumentation();
      renderOverview();
    });

    qsa("[data-remove-port]").forEach((button) => button.onclick = () => {
      const row = state.ports.find((p) => p.id === button.dataset.removePort);
      state.ports = state.ports.filter((p) => p.id !== button.dataset.removePort);
      audit("Documentation", "Port mapping removed", row ? row.switch + " " + row.port : button.dataset.removePort, row ? row.endpointId : "");
      saveState();
      renderDocumentation();
      renderOverview();
    });
  }

  $("printDocsBtn").addEventListener("click", () => {
    audit("Documentation", "Documentation printed", state.meta.workspaceName, "Generated printable network documentation from unified state.");
    saveState();
    window.print();
  });

  $("addVlanBtn").addEventListener("click", () => {
    showModal("Add VLAN / IP Plan",
      '<div class="form-grid">' +
      '<label class="field"><span>Site</span><input id="mVlanSite" placeholder="HQ"></label>' +
      '<label class="field"><span>VLAN ID</span><input id="mVlanId" type="number" min="1" max="4094"></label>' +
      '<label class="field"><span>Name</span><input id="mVlanName" placeholder="Users"></label>' +
      '<label class="field"><span>CIDR</span><input id="mVlanCidr" placeholder="10.20.40.0/24"></label>' +
      '<label class="field"><span>Gateway</span><input id="mVlanGateway" placeholder="10.20.40.1"></label>' +
      '<label class="field"><span>DNS</span><input id="mVlanDns" placeholder="10.20.10.53"></label>' +
      '</div><div class="modal-actions"><button class="btn secondary" id="mCancel">Cancel</button><button class="btn primary" id="mSave">Add VLAN</button></div>',
      () => {
        $("mCancel").onclick = closeModal;
        $("mSave").onclick = () => {
          const site = $("mVlanSite").value.trim();
          const vlan = Number($("mVlanId").value);
          const name = $("mVlanName").value.trim();
          const cidr = $("mVlanCidr").value.trim();
          const gateway = $("mVlanGateway").value.trim();
          const dns = $("mVlanDns").value.trim();
          try { calculateCidr(cidr); } catch (error) { toast("Invalid CIDR", error.message); return; }
          if (!site || !name || !vlan || vlan < 1 || vlan > 4094 || !validIp(gateway)) {
            toast("Invalid VLAN record", "Site, VLAN ID, name, CIDR, and valid gateway are required.");
            return;
          }
          const row = { id: uid("VLAN"), site, vlan, name, cidr, gateway, dns: validIp(dns) ? dns : "" };
          state.vlans.push(row);
          state.docChanges.unshift({ id: uid("DOC"), detail: "Added " + site + " VLAN " + vlan + " (" + name + ").", createdAt: now() });
          audit("Documentation", "VLAN added", site + " VLAN " + vlan, cidr);
          saveState();
          closeModal();
          renderDocumentation();
          renderOverview();
          toast("VLAN documented", site + " · VLAN " + vlan);
        };
      }
    );
  });

  $("addPortBtn").addEventListener("click", () => {
    const switches = state.endpoints.filter((e) => /switch/i.test(e.type));
    showModal("Add Switch Port Mapping",
      '<div class="form-grid">' +
      '<label class="field"><span>Switch</span><select id="mPortSwitch">' + switches.map((e) => '<option value="' + esc(e.hostname) + '">' + esc(e.hostname) + "</option>").join("") + '</select></label>' +
      '<label class="field"><span>Port</span><input id="mPortName" placeholder="Gi1/0/12"></label>' +
      '<label class="field"><span>Endpoint</span><select id="mPortEndpoint">' + state.endpoints.map((e) => '<option value="' + esc(e.id) + '">' + esc(e.hostname) + "</option>").join("") + '</select></label>' +
      '<label class="field"><span>VLAN</span><input id="mPortVlan" type="number" min="1" max="4094"></label>' +
      '</div><div class="modal-actions"><button class="btn secondary" id="mCancel">Cancel</button><button class="btn primary" id="mSave">Add Mapping</button></div>',
      () => {
        $("mCancel").onclick = closeModal;
        $("mSave").onclick = () => {
          const sw = $("mPortSwitch").value;
          const port = $("mPortName").value.trim();
          const endpointId = $("mPortEndpoint").value;
          const vlan = Number($("mPortVlan").value);
          if (!sw || !port || !endpointId || !vlan) {
            toast("Missing details", "Switch, port, endpoint, and VLAN are required.");
            return;
          }
          state.ports.push({ id: uid("PORT"), switch: sw, port, endpointId, vlan });
          const ep = endpointById(endpointId);
          state.docChanges.unshift({ id: uid("DOC"), detail: "Mapped " + sw + " " + port + " to " + (ep ? ep.hostname : endpointId) + ".", createdAt: now() });
          audit("Documentation", "Port mapping added", sw + " " + port, (ep ? ep.hostname : endpointId) + " · VLAN " + vlan);
          saveState();
          closeModal();
          renderDocumentation();
          renderOverview();
        };
      }
    );
  });

  $("addChangeNoteBtn").addEventListener("click", () => {
    const detail = $("changeNoteInput").value.trim();
    if (!detail) return;
    state.docChanges.unshift({ id: uid("DOC"), detail, createdAt: now() });
    $("changeNoteInput").value = "";
    audit("Documentation", "Change note added", "Network documentation", detail);
    saveState();
    renderDocumentation();
    renderOverview();
    toast("Change note added", detail);
  });

  function renderCompliance() {
    const managed = state.endpoints.filter((e) => e.complianceManaged !== false);
    const rows = managed.map((e) => ({ endpoint: e, result: evaluateEndpoint(e) }));
    const compliant = rows.filter((r) => r.result.status === "compliant").length;
    const noncompliant = rows.length - compliant;
    const score = rows.length ? Math.round((compliant / rows.length) * 100) : 100;

    $("complianceScore").textContent = score + "%";
    $("complianceBreakdown").innerHTML =
      '<article><span>Managed endpoints</span><strong>' + rows.length + '</strong></article>' +
      '<article><span>Compliant</span><strong class="text-green">' + compliant + '</strong></article>' +
      '<article><span>Need action</span><strong class="text-amber">' + noncompliant + "</strong></article>";

    $("complianceRows").innerHTML = rows.length ? rows.map((row) => {
      const e = row.endpoint;
      const r = row.result;
      return "<tr>" +
        '<td><span class="cell-title">' + esc(e.hostname) + '</span><span class="cell-sub">' + esc(e.ip + " · " + e.site) + "</span></td>" +
        "<td>" + (e.updatesMissing === 0 ? badge("Current", "green") : badge(e.updatesMissing + " missing", "amber")) + "</td>" +
        "<td>" + badge(e.av, e.av === "healthy" ? "green" : "red") + "</td>" +
        "<td>" + badge(e.firewall ? "Enabled" : "Disabled", e.firewall ? "green" : "red") + "</td>" +
        "<td>" + badge(e.bitlocker ? "Enabled" : "Disabled", e.bitlocker ? "green" : "red") + "</td>" +
        "<td>" + esc(e.rebootAge + " days") + "</td>" +
        "<td>" + (r.status === "compliant" ? badge("Compliant", "green") : badge("Needs action", "amber")) + "</td>" +
        '<td><button class="mini-btn" data-remediate="' + esc(e.id) + '"' + (r.status === "compliant" ? " disabled" : "") + ">Create Ticket</button></td></tr>";
    }).join("") : '<tr><td colspan="8" class="empty">No compliance-managed endpoints.</td></tr>';

    qsa("[data-remediate]").forEach((button) => button.onclick = () => {
      const e = endpointById(button.dataset.remediate);
      if (!e) return;
      const result = evaluateEndpoint(e);
      createIncident({
        endpointId: e.id,
        title: "Compliance remediation: " + result.failures.map((f) => f.label).join(", "),
        priority: "P3",
        source: "Compliance"
      });
      renderCompliance();
      toast("Remediation incident created", e.hostname);
    });
  }

  function evaluateFleet(recordAudit = true) {
    const failing = state.endpoints.filter((e) => evaluateEndpoint(e).status === "noncompliant");
    if (state.settings.autoTicketCompliance) {
      failing.forEach((e) => {
        const exists = state.incidents.some((i) =>
          i.endpointId === e.id && i.source === "Compliance" && !["Resolved", "Closed"].includes(i.status)
        );
        if (!exists) {
          const result = evaluateEndpoint(e);
          createIncident({
            endpointId: e.id,
            title: "Compliance remediation: " + result.failures.map((f) => f.label).join(", "),
            priority: "P3",
            source: "Compliance"
          }, true);
        }
      });
    }
    if (recordAudit) audit("Compliance", "Fleet evaluated", state.meta.workspaceName, failing.length + " endpoint(s) require remediation.");
    saveState();
    renderCompliance();
    renderOverview();
    renderIncidents();
    if (recordAudit) toast("Fleet evaluated", failing.length + " endpoint(s) need action.");
  }

  $("evaluateComplianceBtn").addEventListener("click", () => evaluateFleet(true));

  function nextIncidentId() {
    const max = state.incidents.reduce((value, item) => {
      const n = Number(String(item.id || "").replace(/\D/g, ""));
      return Number.isFinite(n) ? Math.max(value, n) : value;
    }, 1000);
    return "INC-" + String(max + 1);
  }

  function createIncident(input, silent = false) {
    const incident = {
      id: nextIncidentId(),
      endpointId: input.endpointId || "",
      title: String(input.title || "New incident").trim(),
      priority: input.priority || "P3",
      status: input.status || "New",
      source: input.source || "Manual",
      createdAt: now()
    };
    state.incidents.unshift(incident);
    const ep = endpointById(incident.endpointId);
    audit("Incidents", "Incident created", incident.id, incident.title + (ep ? " · " + ep.hostname : ""));
    saveState();
    if (!silent) {
      renderIncidents();
      renderOverview();
    }
    return incident;
  }

  function renderIncidents() {
    const count = (status) => state.incidents.filter((i) => i.status === status).length;
    $("incNew").textContent = count("New");
    $("incActive").textContent = count("Active");
    $("incPending").textContent = count("Pending");
    $("incResolved").textContent = state.incidents.filter((i) => ["Resolved", "Closed"].includes(i.status)).length;

    const incidents = state.incidents.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    $("incidentRows").innerHTML = incidents.length ? incidents.map((i) => {
      const ep = endpointById(i.endpointId);
      return '<div class="incident-card">' +
        '<div><span class="ticket">' + esc(i.id) + '</span><div style="margin-top:5px">' + badge(i.priority, priorityTone(i.priority)) + "</div></div>" +
        '<div><h4>' + esc(i.title) + '</h4><p>' + esc((ep ? ep.hostname + " · " + ep.ip : "Unassigned") + " · " + i.source + " · " + fmtDate(i.createdAt)) + "</p></div>" +
        '<div class="incident-actions"><select data-incident-status="' + esc(i.id) + '">' +
        ["New", "Active", "Pending", "Resolved", "Closed"].map((s) => '<option' + (s === i.status ? " selected" : "") + ">" + s + "</option>").join("") +
        '</select>' + (ep ? '<button class="mini-btn" data-open-endpoint="' + esc(ep.id) + '">Endpoint</button>' : "") + "</div></div>";
    }).join("") : '<div class="empty">No incidents recorded.</div>';

    qsa("[data-incident-status]").forEach((select) => select.onchange = () => {
      const incident = incidentById(select.dataset.incidentStatus);
      if (!incident) return;
      const previous = incident.status;
      incident.status = select.value;
      audit("Incidents", "Incident status changed", incident.id, previous + " → " + incident.status);
      saveState();
      renderIncidents();
      renderOverview();
    });
    bindOpenEndpointButtons();
  }

  $("newIncidentBtn").addEventListener("click", () => {
    showModal("New Incident",
      '<div class="form-grid">' +
      '<label class="field span-2"><span>Title</span><input id="mIncidentTitle" placeholder="Describe the issue"></label>' +
      '<label class="field"><span>Endpoint</span><select id="mIncidentEndpoint"><option value="">Unassigned</option>' + state.endpoints.map((e) => '<option value="' + esc(e.id) + '">' + esc(e.hostname + " · " + e.ip) + "</option>").join("") + '</select></label>' +
      '<label class="field"><span>Priority</span><select id="mIncidentPriority"><option>P1</option><option>P2</option><option selected>P3</option><option>P4</option></select></label>' +
      '<label class="field"><span>Status</span><select id="mIncidentStatus"><option>New</option><option>Active</option><option>Pending</option></select></label>' +
      '<label class="field"><span>Source</span><select id="mIncidentSource"><option>Manual</option><option>Troubleshooting</option><option>Remote Support</option><option>Compliance</option><option>Monitoring</option></select></label>' +
      '</div><div class="modal-actions"><button class="btn secondary" id="mCancel">Cancel</button><button class="btn primary" id="mSave">Create Incident</button></div>',
      () => {
        $("mCancel").onclick = closeModal;
        $("mSave").onclick = () => {
          const title = $("mIncidentTitle").value.trim();
          if (!title) { toast("Title required", "Enter an incident title."); return; }
          createIncident({
            endpointId: $("mIncidentEndpoint").value,
            title,
            priority: $("mIncidentPriority").value,
            status: $("mIncidentStatus").value,
            source: $("mIncidentSource").value
          });
          closeModal();
          toast("Incident created", title);
        };
      }
    );
  });

  function renderAuditEntries(entries) {
    return entries.length ? entries.map((row) =>
      '<div class="audit-entry"><time>' + esc(fmtDate(row.createdAt)) + '</time><span class="module">' + esc(row.module) +
      '</span><div><strong>' + esc(row.action + (row.target ? " · " + row.target : "")) +
      '</strong><small>' + esc(row.detail || "") + "</small></div></div>"
    ).join("") : '<div class="empty">No audit events.</div>';
  }

  function renderAudit() {
    const modules = Array.from(new Set(state.audit.map((row) => row.module))).sort();
    const select = $("auditModuleFilter");
    const current = select.value;
    select.innerHTML = '<option value="">All modules</option>' + modules.map((m) => '<option value="' + esc(m) + '">' + esc(m) + "</option>").join("");
    if (modules.includes(current)) select.value = current;

    const query = $("auditSearch").value.trim().toLowerCase();
    const module = select.value;
    const rows = state.audit.filter((row) => {
      const haystack = [row.module, row.action, row.target, row.detail].join(" ").toLowerCase();
      return (!query || haystack.includes(query)) && (!module || row.module === module);
    });
    $("auditRows").innerHTML = renderAuditEntries(rows);
  }

  $("auditSearch").addEventListener("input", renderAudit);
  $("auditModuleFilter").addEventListener("change", renderAudit);

  $("clearAuditBtn").addEventListener("click", () => {
    if (!confirm("Clear the demo audit history in this browser?")) return;
    state.audit = [{ id: uid("AUD"), module: "System", action: "Audit reset", target: state.meta.workspaceName, detail: "Demo audit history cleared by the portfolio user.", createdAt: now() }];
    saveState();
    renderAudit();
    renderOverview();
    toast("Audit reset", "Demo history was cleared.");
  });

  function renderSettings() {
    $("ruleMissingUpdates").value = state.complianceRules.maxMissingUpdates;
    $("ruleRebootAge").value = state.complianceRules.maxRebootAge;
    $("ruleFirewall").checked = !!state.complianceRules.requireFirewall;
    $("ruleBitlocker").checked = !!state.complianceRules.requireBitlocker;
    $("ruleAv").checked = !!state.complianceRules.requireAv;
    $("autoTicketCompliance").checked = !!state.settings.autoTicketCompliance;
    $("autoTicketDiagnostic").checked = !!state.settings.autoTicketDiagnostic;
    $("workspaceNameInput").value = state.meta.workspaceName || "OpsFusion Unified";
  }

  $("saveRulesBtn").addEventListener("click", () => {
    state.complianceRules.maxMissingUpdates = Math.max(0, Number($("ruleMissingUpdates").value) || 0);
    state.complianceRules.maxRebootAge = Math.max(1, Number($("ruleRebootAge").value) || 14);
    state.complianceRules.requireFirewall = $("ruleFirewall").checked;
    state.complianceRules.requireBitlocker = $("ruleBitlocker").checked;
    state.complianceRules.requireAv = $("ruleAv").checked;
    audit("Compliance", "Compliance rules updated", state.meta.workspaceName, "Fleet evaluation policy changed.");
    saveState();
    evaluateFleet(false);
    toast("Compliance rules saved", "Fleet results recalculated.");
  });

  $("saveWorkflowSettingsBtn").addEventListener("click", () => {
    state.settings.autoTicketCompliance = $("autoTicketCompliance").checked;
    state.settings.autoTicketDiagnostic = $("autoTicketDiagnostic").checked;
    state.meta.workspaceName = $("workspaceNameInput").value.trim() || "OpsFusion Unified";
    audit("System", "Workflow settings updated", state.meta.workspaceName, "Portfolio automation settings saved.");
    saveState();
    renderOverview();
    toast("Workflow settings saved", state.meta.workspaceName);
  });

  $("resetWorkspaceBtn").addEventListener("click", () => {
    if (!confirm("Reset OpsFusion to the seeded unified workspace? All browser-local changes will be removed.")) return;
    state = seedState();
    currentEndpointId = state.endpoints[0].id;
    selectedDiagnosticId = null;
    saveState();
    renderAll();
    openPage("overview");
    toast("Workspace reset", "Seeded unified data restored.");
  });

  $("exportBtn").addEventListener("click", () => {
    audit("System", "Workspace exported", state.meta.workspaceName, "Unified JSON workspace exported from the browser.");
    saveState();
    const payload = JSON.stringify({ schema: "opsfusion-unified", version: 1, exportedAt: now(), workspace: state }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "opsfusion-workspace-" + new Date().toISOString().slice(0, 10) + ".json";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    renderOverview();
  });

  $("importInput").addEventListener("change", async () => {
    const file = $("importInput").files && $("importInput").files[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const imported = parsed.workspace || parsed;
      if (!imported || !Array.isArray(imported.endpoints) || !Array.isArray(imported.incidents)) {
        throw new Error("This file is not a valid OpsFusion workspace.");
      }
      if (!confirm("Replace the current browser workspace with " + file.name + "?")) return;
      state = {
        ...seedState(),
        ...imported,
        meta: { ...seedState().meta, ...(imported.meta || {}) },
        settings: { ...seedState().settings, ...(imported.settings || {}) },
        complianceRules: { ...seedState().complianceRules, ...(imported.complianceRules || {}) }
      };
      audit("System", "Workspace imported", file.name, "Unified state restored from JSON.");
      saveState();
      currentEndpointId = state.endpoints[0] ? state.endpoints[0].id : null;
      selectedDiagnosticId = null;
      renderAll();
      openPage("overview");
      toast("Workspace imported", file.name);
    } catch (error) {
      toast("Import failed", error.message || "Unable to read workspace.");
    } finally {
      $("importInput").value = "";
    }
  });

  function renderGlobalSearch(query) {
    const box = $("searchResults");
    const q = String(query || "").trim().toLowerCase();
    if (q.length < 2) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    const hits = [];
    state.endpoints.forEach((e) => {
      const hay = [e.hostname, e.ip, e.site, e.owner, e.type, e.os].join(" ").toLowerCase();
      if (hay.includes(q)) hits.push({ type: "endpoint", id: e.id, title: e.hostname, detail: e.ip + " · " + e.site + " · " + e.owner });
    });
    state.incidents.forEach((i) => {
      const hay = [i.id, i.title, i.status, i.priority, i.source].join(" ").toLowerCase();
      if (hay.includes(q)) hits.push({ type: "incident", id: i.id, title: i.id + " · " + i.title, detail: i.status + " · " + i.priority });
    });
    state.vlans.forEach((v) => {
      const hay = [v.site, v.vlan, v.name, v.cidr, v.gateway].join(" ").toLowerCase();
      if (hay.includes(q)) hits.push({ type: "vlan", id: v.id, title: v.site + " VLAN " + v.vlan + " · " + v.name, detail: v.cidr });
    });
    box.innerHTML = hits.slice(0, 10).map((hit, index) =>
      '<button class="search-hit" data-search-index="' + index + '"><strong>' + esc(hit.title) + '</strong><span>' + esc(hit.type + " · " + hit.detail) + "</span></button>"
    ).join("") || '<div class="empty">No matching records.</div>';
    box.hidden = false;
    qsa("[data-search-index]", box).forEach((button) => button.onclick = () => {
      const hit = hits[Number(button.dataset.searchIndex)];
      if (!hit) return;
      box.hidden = true;
      $("globalSearch").value = "";
      if (hit.type === "endpoint") openEndpointModal(hit.id);
      if (hit.type === "incident") openPage("incidents");
      if (hit.type === "vlan") openPage("documentation");
    });
  }

  $("globalSearch").addEventListener("input", (event) => renderGlobalSearch(event.target.value));
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".global-search-wrap")) $("searchResults").hidden = true;
  });

  function renderAll() {
    renderOverview();
    renderEndpoints();
    renderTroubleshooting();
    renderRemote();
    renderDocumentation();
    renderCompliance();
    renderIncidents();
    renderAudit();
    renderSettings();
  }

  renderAll();
  try {
    const initialCidr = calculateCidr($("cidrInput").value);
    $("cidrOutput").innerHTML =
      '<div><span>Network</span><strong>' + esc(initialCidr.network) + '</strong></div>' +
      '<div><span>Subnet mask</span><strong>' + esc(initialCidr.mask) + '</strong></div>' +
      '<div><span>Broadcast</span><strong>' + esc(initialCidr.broadcast) + '</strong></div>' +
      '<div><span>Usable hosts</span><strong>' + esc(initialCidr.usable) + "</strong></div>";
  } catch (_) {}
})();