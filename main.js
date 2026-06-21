/* =========================================================================
   fabriziodecicco.dev — site behaviour
   Vanilla JS, no dependencies. Deferred. Sections degrade gracefully:
   every interactive block has a usable no-JS state in the HTML.
   ========================================================================= */
(function(){
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Theme — shared setTheme(), persisted, drives the toggle + terminal
     --------------------------------------------------------------------- */
  var seg = document.getElementById('themeSeg');
  function setTheme(mode){
    if(mode !== 'light' && mode !== 'dark') return;
    root.setAttribute('data-theme', mode);
    try{ localStorage.setItem('theme', mode); }catch(e){}
    if(seg) seg.querySelectorAll('button').forEach(function(b){
      b.setAttribute('aria-pressed', b.dataset.thm === mode ? 'true' : 'false');
    });
  }
  function currentTheme(){ return root.getAttribute('data-theme') || 'dark'; }
  if(seg){
    // reflect the pre-paint choice
    setTheme(currentTheme());
    seg.addEventListener('click', function(e){
      var b = e.target.closest('button'); if(!b) return;
      setTheme(b.dataset.thm);
    });
  }

  /* ---------------------------------------------------------------------
     Reliability Lab — error-budget calculator (also reused by terminal slo)
     --------------------------------------------------------------------- */
  var WINDOWS = [['per day',1440],['per week',10080],['per month',43200],['per quarter',129600],['per year',525600]];
  function fmtDur(m){
    if(m < 1) return Math.round(m*60) + ' s';
    if(m < 60) return (m<10 ? m.toFixed(2) : m.toFixed(1)) + ' min';
    var h = m/60; if(h < 24) return h.toFixed(h<10 ? 2 : 1) + ' h';
    return (h/24).toFixed(1) + ' d';
  }
  (function lab(){
    var num = document.getElementById('num'),
        range = document.getElementById('range'),
        budget = document.getElementById('budget'),
        windows = document.getElementById('windows'),
        presets = document.getElementById('presets');
    if(!num || !range || !budget || !windows) return;

    function calc(s){
      if(!isFinite(s)) s = 0; if(s < 0) s = 0; if(s > 100) s = 100;
      var b = 1 - s/100;
      budget.textContent = (b*100).toFixed(s>99.99 ? 4 : (s>99.9 ? 3 : 2)) + '%';
      windows.innerHTML = WINDOWS.map(function(w){
        return '<div class="wcard'+(w[0]==='per month'?' mo':'')+'"><div class="wt">'+w[0]+
               '</div><div class="wv">'+fmtDur(b*w[1])+'</div></div>';
      }).join('');
    }
    function setVal(v, from){
      v = parseFloat(v); if(!isFinite(v)) return;
      if(from !== 'num') num.value = v;
      if(from !== 'range') range.value = Math.max(90, Math.min(99.999, v));
      calc(v);
    }
    num.addEventListener('input', function(){ setVal(num.value, 'num'); });
    range.addEventListener('input', function(){ setVal(range.value, 'range'); });
    if(presets) presets.addEventListener('click', function(e){
      var b = e.target.closest('button'); if(!b) return; setVal(b.dataset.v, 'preset');
    });
    calc(parseFloat(num.value) || 99.9);
  })();

  /* ---------------------------------------------------------------------
     Case study — interactive architecture diagram
     --------------------------------------------------------------------- */
  (function caseStudy(){
    var detail = document.getElementById('detail');
    if(!detail) return;
    var info = {
      orchestrator:{ n:'Orchestrator', r:'routes work · plays the developer', o:[
        'Receives a task, dispatches the right specialists, assembles their findings into one verdict.',
        'Acts as the developer-in-the-loop across the whole workflow.'] },
      'code-review':{ n:'Code Review agent', r:'PRs · standards · pipeline impact', o:[
        'Reviews pull requests against the team standards.',
        'Flags changes that affect the build or pipeline.'] },
      qa:{ n:'QA agent', r:'branch checkout · tests', o:[
        'Checks out the branch and runs the test suite.',
        'Reports failures back to the orchestrator.'] },
      release:{ n:'Release agent', r:'promotion readiness', o:[
        'Assesses whether a change is ready to promote.',
        'Coordinates the release.'] },
      infrastructure:{ n:'Infrastructure agent', r:'IaC · provisioning', o:[
        'Validates IaC and provisioning changes before they land.',
        'Guards the paved road so changes stay reproducible.'] },
      reliability:{ n:'Reliability agent', r:'SLOs · incident signals', o:[
        'Watches SLOs and incident signals.',
        'Surfaces reliability risk tied to a specific change.'] },
      'self-improvement':{ n:'Self-improvement loop', r:'weekly self-analysis', o:[
        'Weekly self-analysis that surfaces gaps.',
        'Feeds improvements back into the agents.'] },
      skills:{ n:'Shared skills layer', r:'conventions · safety guardrails', o:[
        'Reusable conventions every agent draws on — plus safety guardrails.',
        'Guardrails gate anything destructive.'] }
    };
    var nodes = Array.prototype.slice.call(document.querySelectorAll('.node'));
    function render(id){
      var d = info[id]; if(!d) return;
      detail.innerHTML = '<div class="dname">'+d.n+'</div><div class="drole">'+d.r+'</div>'
        + '<ul class="downs">' + d.o.map(function(x){ return '<li>'+x+'</li>'; }).join('') + '</ul>';
      nodes.forEach(function(n){
        var on = n.dataset.id === id;
        n.classList.toggle('on', on);
        n.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
    nodes.forEach(function(n){
      n.addEventListener('click', function(){ render(n.dataset.id); });
      n.addEventListener('mouseenter', function(){ render(n.dataset.id); });
      n.addEventListener('focus', function(){ render(n.dataset.id); });
    });
    render('orchestrator');
  })();

  /* ---------------------------------------------------------------------
     Engineering artifacts — inline viewer + working Blob download.
     Bodies are byte-identical to the files in /lab/.
     --------------------------------------------------------------------- */
  (function artifacts(){
    var grid = document.getElementById('grid'),
        pv = document.getElementById('pv'),
        fn = document.getElementById('fn');
    if(!grid || !pv || !fn) return;

    var tpl = {
      adr:{ file:'adr-template.md', body:
"# ADR-NNN — <short title>\n\n"+
"- Status:     Proposed | Accepted | Superseded by ADR-XXX\n"+
"- Date:       YYYY-MM-DD\n"+
"- Deciders:   <names / roles>\n\n"+
"## Context\n"+
"What problem are we solving? What constraints and forces are at play?\n"+
"(Keep it factual — no solution yet.)\n\n"+
"## Decision\n"+
"What we are doing, in one or two plain sentences.\n\n"+
"## Consequences\n"+
"  + Positive:   ...\n"+
"  - Trade-off:  ...\n"+
"  ~ Follow-up:  ...\n\n"+
"## Alternatives considered\n"+
"- <Option A> — why not\n"+
"- <Option B> — why not\n" },

      slo:{ file:'slo-definition.md', body:
"# SLO — <service> · <user journey>\n\n"+
"Owner:        <team>\n"+
"SLI:          proportion of valid requests served < 300 ms with a 2xx/3xx\n"+
"Measurement:  <source — e.g. Datadog APM / load-balancer logs>\n"+
"Window:       rolling 30 days\n\n"+
"Target:       99.9%\n"+
"Error budget: 0.1%   (~43 min / 30 days)\n\n"+
"Alerting (multi-window burn-rate):\n"+
"  - page     14.4x over 1h    /   6x over 6h\n"+
"  - ticket    3x  over 1d     /   1x over 3d\n\n"+
"Exclusions:   planned maintenance windows\n"+
"Review:       monthly, with the error-budget policy\n" },

      incident:{ file:'incident-review.md', body:
"# Incident review — INC-NNN              (blameless)\n\n"+
"Date / duration:  YYYY-MM-DD · Xh Ym\n"+
"Severity:         SEV-?\n"+
"Author:           <name>\n\n"+
"## Summary\n"+
"One paragraph: what broke, who was affected, how it ended.\n\n"+
"## Timeline (UTC)\n"+
"  T0       detect     — how we found out\n"+
"  T+0m     triage     — first responders / hypothesis\n"+
"  T+0m     mitigate   — what stopped the bleeding\n"+
"  T+0m     resolve    — full restoration\n\n"+
"## Impact\n"+
"Users affected, SLO impact, error budget consumed.\n\n"+
"## Root cause\n"+
"The actual cause — systems, not people.\n\n"+
"## What went well / what didn't\n\n"+
"## Action items\n"+
"  - [ ] <owner> — <fix> — due <date>\n" },

      tf:{ file:'terraform-module-checklist.md', body:
"# Terraform module — production-readiness checklist\n\n"+
"  [ ] README with inputs, outputs, and a usage example\n"+
"  [ ] examples/ directory that `terraform plan`s cleanly\n"+
"  [ ] Provider and module versions pinned\n"+
"  [ ] No hardcoded secrets — values via variables / key vault\n"+
"  [ ] Required vs optional inputs are obvious; sane defaults\n"+
"  [ ] fmt + validate + tflint + trivy (security) run in CI\n"+
"  [ ] Consistent tags / labels on every resource\n"+
"  [ ] Remote state backend + locking configured\n"+
"  [ ] Idempotent — a second apply shows no changes\n"+
"  [ ] CHANGELOG + semver tag on release\n" }
    };

    var cards = Array.prototype.slice.call(document.querySelectorAll('.art'));
    function view(id){
      var t = tpl[id]; if(!t) return;
      pv.textContent = t.body; fn.textContent = t.file;
      cards.forEach(function(c){ c.classList.toggle('on', c.dataset.id === id); });
    }
    function download(id){
      var t = tpl[id]; if(!t) return;
      try{
        var blob = new Blob([t.body], {type:'text/markdown;charset=utf-8'});
        var url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url; a.download = t.file; document.body.appendChild(a); a.click();
        setTimeout(function(){ URL.revokeObjectURL(url); a.remove(); }, 120);
      }catch(e){ view(id); }
    }
    grid.addEventListener('click', function(e){
      var b = e.target.closest('button'); if(!b) return;
      if(b.classList.contains('dl')) download(b.dataset.id); else view(b.dataset.id);
    });
    view('adr');
  })();

  /* ---------------------------------------------------------------------
     Hero terminal — bootable, interactive, data-driven command map
     --------------------------------------------------------------------- */
  (function terminal(){
    var stream = document.getElementById('stream'),
        inrow = document.getElementById('inrow'),
        hints = document.getElementById('hints'),
        input = document.getElementById('cin'),
        term = document.getElementById('term');
    if(!stream || !input || !term) return;

    function esc(s){ return s.replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
    function el(html, cls, pre){
      var d = document.createElement('div');
      d.className = 'line' + (pre ? ' pre' : '') + (cls ? ' ' + cls : '');
      d.innerHTML = html; stream.appendChild(d); return d;
    }
    function promptLine(cmd){ el('<span class="pr">$</span> ' + esc(cmd)); }
    function scrollBody(){ var tb = stream.parentElement; tb.scrollTop = tb.scrollHeight; }
    function go(id){
      var t = document.getElementById(id);
      if(t) t.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'start'});
    }
    function nav(id, label, lines){
      el('→ opening ' + label, 'dm');
      (lines || []).forEach(function(l){ el('  ' + l, 'dm'); });
      go(id);
    }

    // ---- command map: single source of truth ----
    var cmds = {
      about:   { d:'one-line profile', run:function(){
          el('IoT Infrastructure Architect &amp; Lead DevOps Engineer.', 'b');
          el('10+ years building reliable cloud infrastructure for global IoT platforms.', 'dm'); } },
      stack:   { d:'core stack', run:function(){
          el('Azure · AKS · Azure Functions · <span class="ac">Terraform</span> · Datadog · Azure DevOps · Kubernetes · SRE', 'dm'); } },
      devices: { d:'platform scale', run:function(){
          el('<span class="ok">50,000+</span> devices in production — scaling to <span class="ok">~300,000</span> within a year.'); } },
      certs:   { d:'certifications', run:function(){
          el('<span class="ac">CKA</span> · <span class="ac">LFCS</span> · <span class="ac">AZ-104</span> · <span class="ac">AZ-400</span>'); } },
      experience: { d:'work history', run:function(){
          el('Culligan International   <span class="dm">Infrastructure Architect</span>   <span class="dm">2023–present</span>');
          el('MSC Mediterranean Shipping   <span class="dm">DevOps Engineer</span>   <span class="dm">2022–2023</span>');
          el('Deltatre   <span class="dm">Support Supervisor → Software Engineer</span>   <span class="dm">2015–2022</span>');
          go('experience'); } },
      topology:{ d:'platform diagram', run:function(){
          el('devices ─(CoAP·LWM2M·MQTT)→ ingest ─→ azure[AKS+Functions] ─→ datadog·SLO ─→ incident ↺', 'ac', true);
          el('  Azure handles MQTT; the IoT bridge speaks CoAP &amp; LWM2M.', 'dm'); } },
      contact: { d:'links', run:function(){
          el('github.com/fabrideci · linkedin.com/in/fabriziodecicco · fabri.deci@gmail.com', 'ac');
          go('contact'); } },

      work:       { d:'open the case study', run:function(){ nav('work', '<span class="b">multi-agent engineering assistant</span>', []); } },
      principles: { d:'how I work', run:function(){ nav('principles', 'operating principles', ['each one: principle · failure mode · response']); } },
      systems:    { d:'systems I would build', run:function(){ nav('systems', '“systems I would build”', ['architectural opinions, not just past work']); } },
      lab:        { d:'reliability lab', run:function(){ nav('lab', 'Reliability Lab', ['try: <span class="ac">slo 99.9</span>']); } },
      artifacts:  { d:'downloadable templates', run:function(){ nav('artifacts', 'engineering artifacts', ['ADR · SLO · incident-review · Terraform module checklist']); } },

      slo:   { d:'compute an error budget', run:function(a){
          var t = parseFloat(a && a[0]);
          if(!isFinite(t)){ el('usage: <span class="ac">slo &lt;target%&gt;</span>   e.g. <span class="ac">slo 99.9</span>', 'dm'); return; }
          if(t < 0) t = 0; if(t > 100) t = 100;
          var mins = (1 - t/100) * 43200, disp = mins >= 60 ? (mins/60).toFixed(1)+' h' : mins.toFixed(1)+' min';
          el('SLO <span class="b">'+t+'%</span> → error budget <span class="ok">'+disp+'</span> / 30 days'); } },
      theme: { d:'switch theme', run:function(a){
          var cur = currentTheme();
          var m = (a && a[0]) ? a[0].toLowerCase() : (cur === 'dark' ? 'light' : 'dark');
          if(m !== 'dark' && m !== 'light'){ el('usage: <span class="ac">theme dark|light</span>', 'dm'); return; }
          setTheme(m); el('theme → <span class="ac">'+m+'</span>', 'dm'); } },
      ls:    { d:'list sections', run:function(){
          el('about.md   experience/   work/   principles/   lab/   artifacts/   contact.md', 'dm', true); } },
      resume:{ d:'download résumé (PDF)', run:function(){
          el('→ downloading <span class="ac">Fabrizio-De-Cicco-Resume.pdf</span>', 'dm');
          var a = document.createElement('a');
          a.href = 'assets/Fabrizio-De-Cicco-Resume.pdf'; a.download = 'Fabrizio-De-Cicco-Resume.pdf';
          document.body.appendChild(a); a.click(); a.remove(); } },
      clear: { d:'clear the screen', run:function(){ stream.innerHTML = ''; } },

      sudo:  { d:'(try it)', run:function(){ el('sudo: permission denied — you’re not on the on-call rotation 🙂', 'al'); } },
      coffee:{ d:'(try it)', run:function(){ el('☕ brewing… <span class="dm">deploy responsibly.</span>'); } }
    };

    var helpGroups = [
      ['navigate', ['work','principles','systems','lab','artifacts']],
      ['info',     ['about','stack','devices','certs','experience','topology','contact']],
      ['tools',    ['slo','theme','ls','resume','clear']],
      ['fun',      ['sudo','coffee']]
    ];
    cmds.help = { d:'list commands', run:function(){
      helpGroups.forEach(function(grp){
        el('<span class="dm">'+grp[0]+'</span>');
        grp[1].forEach(function(k){
          if(cmds[k]) el('  <span class="ac">'+k+'</span>' + ' '.repeat(Math.max(2, 12-k.length)) +
                         '<span class="dm">'+cmds[k].d+'</span>', null, true);
        });
      });
    }};

    function exec(raw){
      var t = raw.trim(); if(!t) return;
      var parts = t.split(/\s+/), name = parts[0].toLowerCase(), args = parts.slice(1);
      promptLine(t);
      if(cmds[name]) cmds[name].run(args);
      else el('command not found: ' + esc(name) + ' — try <span class="ac">help</span>', 'al');
      scrollBody();
    }

    function ready(){
      if(inrow) inrow.hidden = false;
      if(hints) hints.hidden = false;
      input.focus();
    }

    var boot = [
      { cmd:'whoami', out:function(){
          el('Fabrizio De Cicco — IoT Infrastructure Architect &amp; Lead DevOps Engineer', 'ok'); } },
      { cmd:'cat profile.md', out:function(){
          el('10+ yrs of cloud infra for global IoT · <span class="ok">50K+</span> devices in prod (→300K)', 'dm');
          el('Azure · Kubernetes · <span class="ac">Terraform</span> · Datadog · SRE', 'dm'); } }
    ];
    function readyHint(){
      el('<span class="dm">type</span> <span class="ac">help</span> <span class="dm">· Tab completes · try</span> <span class="ac">slo 99.9</span> <span class="cursor"></span>');
    }

    if(reduce){
      boot.forEach(function(step){ promptLine(step.cmd); step.out(); });
      readyHint(); ready();
    } else {
      var bi = 0;
      function typeCmd(text, done){
        var span = el('<span class="pr">$</span> <span class="t"></span>').querySelector('.t');
        var i = 0;
        (function tick(){
          if(i <= text.length){ span.textContent = text.slice(0, i++); setTimeout(tick, 38); }
          else done();
        })();
      }
      function nextBoot(){
        if(bi < boot.length){
          var step = boot[bi++];
          typeCmd(step.cmd, function(){ setTimeout(function(){ step.out(); setTimeout(nextBoot, 320); }, 140); });
        } else { readyHint(); ready(); }
      }
      setTimeout(nextBoot, 450);
    }

    // input + tab-completion (no history)
    input.addEventListener('keydown', function(e){
      if(e.key === 'Enter'){ var v = input.value; input.value = ''; exec(v); return; }
      if(e.key === 'Tab'){
        e.preventDefault();
        var parts = input.value.split(/\s+/);
        if(parts.length > 1) return;                 // only complete the command name
        var frag = parts[0].toLowerCase(), keys = Object.keys(cmds);
        var matches = frag ? keys.filter(function(k){ return k.indexOf(frag) === 0; }) : keys;
        if(matches.length === 1){ input.value = matches[0]; }
        else if(matches.length > 1){
          var lcp = matches.reduce(function(a, b){
            var i = 0; while(i < a.length && i < b.length && a[i] === b[i]) i++; return a.slice(0, i);
          });
          if(lcp.length > frag.length) input.value = lcp;
          el('<span class="dm">' + matches.join('   ') + '</span>');
          scrollBody();
        }
      }
    });
    if(hints) hints.addEventListener('click', function(e){
      var b = e.target.closest('.cmdchip'); if(!b) return; exec(b.dataset.c); input.focus();
    });
    term.addEventListener('click', function(e){ if(!e.target.closest('a,button')) input.focus(); });
  })();

})();
