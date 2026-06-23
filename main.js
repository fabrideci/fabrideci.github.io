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
     i18n — EN/IT toggle. English markup in index.html is the source of
     truth: we capture it from the DOM at load, and only author the IT side.
     No dependencies, persisted, mirrors the theme toggle.
     --------------------------------------------------------------------- */
  function currentLang(){ return root.getAttribute('lang') === 'it' ? 'it' : 'en'; }

  // Italian translations of the static [data-i18n] body content. Keys map to
  // index.html data-i18n attributes; missing keys fall back to English.
  var IT = {
    'a11y.skip':'Vai al contenuto',
    'aria.lang':'Lingua', 'aria.theme':'Tema', 'aria.stream':'Output del terminale',
    'aria.cin':'Comando terminale — scrivi help', 'aria.sections':'Sezioni',
    'aria.slider':'Cursore obiettivo SLO', 'aria.preview':'Anteprima artefatto',
    'bar.lang':'Lingua', 'bar.theme':'Tema', 'bar.dark':'Scuro', 'bar.light':'Chiaro',
    'term.connected':'connesso',
    'hero.scroll':'↓ scorri per il sito completo',
    'hero.role':'Architetto di Infrastrutture IoT e Lead DevOps Engineer',
    'hero.bio':'Ho oltre 10 anni di esperienza nella costruzione di infrastrutture cloud affidabili per piattaforme IoT globali — attualmente guido l\'architettura e l\'affidabilità dell\'infrastruttura IoT in Culligan International. Gestisco <strong>oltre 50.000 dispositivi in produzione, in crescita verso ~300.000</strong>, su Azure con Kubernetes, IaC Terraform-first e osservabilità basata su Datadog. Azure gestisce i flussi MQTT; un bridge IoT parla CoAP e LWM2M.',
    'hero.fact1':'<b>50.000+</b> dispositivi in produzione',
    'hero.fact2':'in crescita verso <b>~300.000</b>',
    'hero.fact3':'10+ anni',
    'hero.fact4':'CKA · LFCS · AZ-104 · AZ-400',
    'hero.fact5':'Focalizzato su Terraform',
    'nav.work':'Caso di studio', 'nav.principles':'Principi', 'nav.experience':'Esperienza',
    'nav.systems':'Sistemi che costruirei', 'nav.lab':'Reliability Lab', 'nav.artifacts':'Artefatti',
    'nav.skills':'Competenze', 'nav.certs':'Certificazioni', 'nav.contact':'Contatti',
    'hero.note':'La pagina si apre come un terminale interattivo — ogni comando corrisponde a una sezione reale, quindi il terminale è la navigazione del sito. Scrivi <span class="ac">help</span> per iniziare, premi <span class="ac">Tab</span> per completare, oppure prova <span class="ac">slo 99.9</span> per un vero error budget. Qui è tutto statico: <b>0 dipendenze, 0 tracker</b>.',

    'principles.eyebrow':'// come lavoro',
    'principles.h':'Principi operativi',
    'principles.sub':'Sei convinzioni che plasmano il mio modo di costruire — e, per ciascuna, la modalità di guasto da cui ti assicurano e la pratica che le rende effettive. Il colore è essenziale: <b>ambra = il guasto</b>, <b>verde = la risposta</b>.',
    'principles.fmlab':'⚠ modalità di guasto', 'principles.rslab':'✓ risposta',
    'pr1.cat':'affidabilità', 'pr1.h':'L\'affidabilità è una funzionalità.',
    'pr1.fm':'L\'affidabilità viene aggiunta dopo il lancio — la prima volta che scopri che un percorso è fragile è da un utente, alle 3 del mattino.',
    'pr1.rs':'Progetta per il guasto, definisci gli SLO in anticipo, spendi l\'error budget come denaro vero. Datadog, Grafana e Prometheus osservano ciò che gli utenti percepiscono davvero.',
    'pr2.cat':'automazione', 'pr2.h':'Automatizza il lavoro ripetitivo.',
    'pr2.fm':'I passaggi manuali divergono, vengono saltati sotto pressione e vivono nella testa di una sola persona — finché quella persona non è in ferie.',
    'pr2.rs':'Fatto a mano due volte → diventa codice. Terraform e Azure DevOps fanno la ripetizione; gli esseri umani fanno il giudizio.',
    'pr3.cat':'osservabilità', 'pr3.h':'Non puoi gestire ciò che non vedi.',
    'pr3.fm':'Senza segnali fai debug a indovinare; l\'MTTR esplode perché un cliente se n\'è accorto prima di qualsiasi dashboard.',
    'pr3.rs':'Metriche, log, tracce e SLO arrivano con il sistema, non dopo — l\'osservabilità è un requisito di build, non un ticket di follow-up.',
    'pr4.cat':'semplicità', 'pr4.h':'Vince ciò che è noioso e prevedibile.',
    'pr4.fm':'Un\'infrastruttura ingegnosa e su misura diventa un singolo punto di guasto che solo il suo autore comprende — e non sarà sempre reperibile.',
    'pr4.rs':'Scegli blocchi semplici e ben compresi e percorsi consolidati. Il prevedibile batte l\'ingegnoso ogni volta che ti chiamano.',
    'pr5.cat':'infrastructure as code', 'pr5.h':'Infrastructure as code, o non è successo.',
    'pr5.fm':'Server unici e modifiche click-ops non possono essere revisionate, riprodotte o annullate — e nessuno ricorda perché la produzione differisce dallo staging.',
    'pr5.rs':'Tutto riproducibile, revisionabile, versionato in Terraform. Niente snowflake, niente sorprese, storia completa in Git.',
    'pr6.cat':'leadership', 'pr6.h':'Guidare abilitando.',
    'pr6.fm':'Un eroe che possiede tutta la conoscenza è un collo di bottiglia; il team si blocca ogni volta che non è disponibile, e segue il burnout.',
    'pr6.rs':'Fai mentoring, documenta e rimuovi gli attriti così il team va più veloce di quanto potrebbe chiunque da solo — me incluso.',

    'exp.eyebrow':'// esperienza',
    'exp.h':'Dove ho costruito',
    'exp.sub':'Ogni ruolo porta un glifo a tratto lineare tratto dal dominio di quell\'azienda — che fa anche da metafora infrastrutturale. Passa il mouse su un ruolo per vedere il suo motivo muoversi.',
    'exp1.h':'Architetto di Infrastrutture <span style="color:var(--dim); font-weight:500">(prec. DevOps Engineer)</span>',
    'exp1.when':'Lug 2023 — oggi', 'exp1.pill':'Milano · IoT · acqua',
    'exp1.b1':'Guido l\'architettura e l\'affidabilità dell\'infrastruttura IoT per la Culligan IoT Platform.',
    'exp1.b2':'Possiedo design e operazioni dell\'infrastruttura end-to-end — scalabilità, sicurezza, costi.',
    'exp1.b3':'Faccio mentoring al team DevOps/SRE; faccio evolvere CI/CD, IaC e Datadog sull\'IoT globale.',
    'exp2.h':'DevOps Engineer', 'exp2.when':'Mar 2022 — Lug 2023', 'exp2.pill':'Torino · container · scala',
    'exp2.b1':'Costruito e mantenuto pipeline CI/CD scalabili su Azure DevOps (YAML).',
    'exp2.b2':'Automatizzato il provisioning con Ansible, Bicep e Rundeck — meno config manuale.',
    'exp2.b3':'Avviato osservabilità e logging con Datadog per un rilevamento più rapido.',
    'exp3.h':'Supervisore Supporto <span style="color:var(--dim); font-weight:500">→ Software Engineer</span>',
    'exp3.when':'Ago 2015 — Mar 2022', 'exp3.pill':'Torino · sport · real-time',
    'exp3.b1':'Supervisionato un team di supporto applicativo di <strong style="color:var(--text)">12 persone</strong>.',
    'exp3.b2':'Costruito app backend e web (C#, SQL, ASP.NET, Angular) — Agile / TDD.',
    'exp3.b3':'Mantenuto microservizi ad alta disponibilità su Azure con Docker e Kubernetes.',

    'work.eyebrow':'// lavori selezionati',
    'work.h':'Assistente di ingegneria multi-agente',
    'work.sub':'Un sistema AI multi-agente che aiuta un team di piattaforma a revisionare, testare, rilasciare e gestire il software con più coerenza e meno fatica — adottato in tutto il team di lead engineering.',
    'work.mc1':'Ruolo: <b>Progettazione e sviluppo</b>',
    'work.mc2':'Contesto: <b>Tooling interno della piattaforma IoT</b>',
    'work.mc3':'Costruito con: <b>Claude Code · MCP · TypeScript</b>',
    'work.arch':'Architettura ad alto livello — tocca un blocco',
    'work.lab.control':'controllo', 'work.lab.specialists':'agenti specialisti',
    'work.lab.shared':'condiviso', 'work.lab.integ':'integrazioni · MCP',
    'work.conn1':'↓ smista agli specialisti', 'work.conn2':'↑ tutti su una base condivisa',
    'work.conn3':'↕ connesso al toolchain via MCP',
    'node.orchestrator.nm':'Orchestratore', 'node.orchestrator.ro':'smista il lavoro · fa lo sviluppatore',
    'node.code-review.nm':'Code Review', 'node.code-review.ro':'PR · standard',
    'node.qa.nm':'QA', 'node.qa.ro':'test',
    'node.release.nm':'Release', 'node.release.ro':'promozione',
    'node.infrastructure.nm':'Infrastruttura', 'node.infrastructure.ro':'controlli IaC',
    'node.reliability.nm':'Reliability', 'node.reliability.ro':'SLO · incidenti',
    'node.self-improvement.nm':'Auto-miglioramento', 'node.self-improvement.ro':'ciclo settimanale',
    'node.skills.nm':'Livello di skill riutilizzabili', 'node.skills.ro':'convenzioni condivise · guardrail di sicurezza',
    'work.ichip1':'Sorgente e PR', 'work.ichip2':'Issue', 'work.ichip3':'CI/CD',
    'work.ichip4':'Qualità del codice', 'work.ichip5':'Osservabilità', 'work.ichip6':'Chat',
    'work.hintline':'Ogni agente possiede <b>un singolo workflow</b> e porta solo il contesto che gli serve — organizzato per workflow, non per ruolo.',
    'work.run':'<span class="pr">$</span> review --pr 1487\n<span class="ar">→ orchestratore: smistamento agli specialisti</span>\n<span class="ok">✓</span> code review — standard + impatto pipeline\n<span class="ok">✓</span> qa — checkout branch + test\n<span class="ok">✓</span> release — pronto per la promozione\n<span class="ok">✓</span> reliability — SLO + segnali di incidente\n<span class="ok">✓</span> <span class="b">review pronta — 0 bloccanti, 2 suggerimenti</span>',
    'work.problem.h':'Problema',
    'work.problem.p':'In un insieme crescente di repository, code review, QA, coordinamento dei rilasci e monitoraggio dell\'affidabilità erano in gran parte manuali — lenti da eseguire, difficili da mantenere coerenti e un costante drenaggio del tempo degli ingegneri senior.',
    'work.approach.h':'Approccio',
    'work.approach.p':'Ho progettato e costruito un insieme di agenti AI specialisti in Claude Code, ciascuno proprietario di un singolo workflow e con una libreria comune di skill riutilizzabili. Si integrano con il toolchain esistente del team tramite MCP, stanno dietro a <b>guardrail di sicurezza che bloccano qualsiasi cosa distruttiva</b> e alimentano un ciclo settimanale di auto-analisi che fa emergere le lacune.',
    'work.dl':'due decisioni che l\'hanno plasmato',
    'work.dec1':'Organizzare gli agenti <b>per workflow, non per ruolo</b> — così ciascuno porta solo il contesto che gli serve.',
    'work.dec2':'Spostare le convenzioni condivise in un <b>livello di skill</b> — così la conoscenza non è duplicata tra gli agenti.',
    'work.outcome.h':'Risultato',
    'work.outcome.p':'Distribuito al team di lead engineering e ora parte di come la piattaforma rilascia. Lo misuro rispetto a <b>baseline di adozione, cycle time e defect-leakage</b> piuttosto che a metriche di vanità — con il ciclo di feedback che migliora costantemente gli agenti nel tempo.',

    'sys.eyebrow':'// architettura',
    'sys.h':'Sistemi che costruirei',
    'sys.sub':'Il lavoro passato mostra cosa ho fatto; questo mostra come <b>penso</b>. Cinque posizioni che difenderei sul costruire e scalare una piattaforma — volutamente schierate.',
    'sys.movelab':'prima mossa',
    'sys1.tag':'baseline della piattaforma',
    'sys1.stance':'Rilascia identità, aggiornamenti e osservabilità prima di una singola funzionalità.',
    'sys1.why':'Per i prodotti connessi, il compito della piattaforma è mantenere una flotta sicura, aggiornabile e visibile — non rilasciare funzionalità il primo giorno. Identità del dispositivo, aggiornamento over-the-air e telemetria end-to-end sono i muri portanti; <b>aggiungili dopo e starai ricostruendo le fondamenta sotto una flotta in produzione.</b>',
    'sys1.move':'pipeline di identità + OTA + telemetria, prima delle funzionalità di prodotto.',
    'sys2.tag':'standardizzazione',
    'sys2.stance':'Scegli i default noiosi prima che il team sia abbastanza grande da litigare.',
    'sys2.why':'Il momento più economico per standardizzare moduli IaC, gestione dei segreti, pipeline e una convenzione SLO è a due repository, non a venti. Ogni settimana che aspetti, la divergenza si accumula e la migrazione diventa politica. <b>La standardizzazione non è burocrazia — è il percorso consolidato</b> che permette alle persone di smettere di reinventare le tubature.',
    'sys2.move':'una libreria di moduli Terraform + un template di pipeline + una convenzione di osservabilità.',
    'sys3.tag':'kubernetes',
    'sys3.stance':'Non usare Kubernetes finché il problema non ha la forma di Kubernetes.',
    'sys3.why':'AKS è giusto quando hai molti servizi, reali esigenze di scaling e un team che può gestirne la superficie operativa. Per una manciata di servizi è una tassa — le piattaforme container gestite producono lo stesso risultato con una frazione delle operazioni. <b>La complessità va guadagnata col carico, non adottata per il curriculum.</b>',
    'sys3.move':'giustifica il cluster rispetto al numero di servizi e alla capacità di on-call.',
    'sys4.tag':'AI nella delivery',
    'sys4.stance':'Lascia che gli agenti propongano; non lasciarli mai pushare senza supervisione.',
    'sys4.why':'Gli agenti AI sono un moltiplicatore di forza su review, QA e preparazione dei rilasci — ma qualsiasi cosa distruttiva resta dietro un gate umano e un guardrail. Organizzali per workflow così ciascuno porta contesto minimo, dai loro un livello di skill condiviso così le convenzioni non divergono. <b>La vittoria è coerenza e fatica rimossa, non autonomia fine a se stessa.</b>',
    'sys4.move':'agenti dietro guardrail, con gate su qualsiasi cosa irreversibile.',
    'sys5.tag':'affidabilità vs costo',
    'sys5.stance':'Uno SLO è un budget — spendilo, non sovra-ingegnerizzare.',
    'sys5.why':'Inseguire più nove di quanti gli utenti percepiscano davvero brucia solo denaro e tempo di ingegneria. Definisci lo SLO dall\'esperienza utente reale, poi spendi l\'error budget: rilascia più velocemente finché è sano, rallenta e irrobustisci quando non lo è. <b>Affidabilità e costo non sono opposti — l\'error budget è la manopola che li scambia di proposito.</b>',
    'sys5.move':'imposta gli SLO da segnali percepiti dagli utenti, poi lascia che il budget guidi il ritmo.',

    'lab.eyebrow':'// reliability lab',
    'lab.h':'Calcolatore di error budget',
    'lab.sub':'Scegli un obiettivo di disponibilità e vedi quanto downtime ti compra davvero — il numero dietro ogni conversazione "servono più nove".',
    'lab.targetslo':'SLO obiettivo', 'lab.commontargets':'Obiettivi comuni',
    'lab.budgetlab':'Error budget', 'lab.budgetof':'del tempo in cui puoi essere down',

    'art.eyebrow':'// artefatti',
    'art.h':'Artefatti di ingegneria',
    'art.sub':'Template che uso davvero, de-identificati e liberi da prendere — la differenza tra un portfolio che <em>descrive</em> competenza e uno che te ne <em>mette in mano</em>. Ognuno è un vero <code>.md</code> nella cartella <a href="https://github.com/fabrideci/fabrideci.github.io/tree/main/lab">/lab</a>.',
    'art.adr.h':'Architecture Decision Record',
    'art.adr.p':'Cattura una decisione, il suo contesto e i trade-off — così il te futuro (e il team) sa <em>perché</em>.',
    'art.slo.h':'Definizione SLO',
    'art.slo.p':'Una specifica di una pagina per un obiettivo: SLI, target, error budget e gli alert sul burn-rate che lo sostengono.',
    'art.incident.h':'Revisione incidente',
    'art.incident.p':'Uno scheletro di postmortem senza colpe: timeline, impatto, causa radice e azioni con responsabili.',
    'art.tf.h':'Checklist modulo Terraform',
    'art.tf.p':'Il gate di production-readiness che un modulo supera prima di essere ammesso sul percorso consolidato.',
    'art.view':'Vedi', 'art.dl':'Scarica', 'art.repo':'Repo', 'art.pmeta':'markdown · template',

    'skills.eyebrow':'// competenze e stack', 'skills.h':'Competenze e stack',
    'skills.c1':'Cloud e container', 'skills.c2':'IoT e messaggistica', 'skills.c3':'Dati e analytics',
    'skills.c4':'Networking e sicurezza', 'skills.c5':'Infrastructure as Code', 'skills.c6':'CI/CD e automazione',
    'skills.c7':'Osservabilità e SRE', 'skills.c8':'Pratiche e leadership',

    'certs.eyebrow':'// certificazioni', 'certs.h':'Certificazioni',

    'contact.eyebrow':'// contatti',
    'contact.h':'Costruiamo qualcosa di affidabile.',
    'contact.lead':'Architettura, affidabilità della piattaforma o delivery assistita dall\'AI — se hai qualcosa del genere sul piatto, sono felice di parlarne.',
    'contact.email':'Email', 'contact.resume':'Curriculum (PDF)',
    'contact.loc':'con base a <b>Torino, Italia</b> · disponibile da remoto',

    'foot.status':'Tutti i sistemi operativi',
    'foot.static':'statico · <b>0 dipendenze</b> · <b>0 tracker</b>',
    'foot.handcoded':'scritto a mano — <a href="https://github.com/fabrideci/fabrideci.github.io">sorgente</a>'
  };

  // Document-level strings that live in attributes, not innerHTML.
  var META_IT = {
    title:'Fabrizio De Cicco — Architetto di Infrastrutture IoT',
    desc:'Fabrizio De Cicco — Architetto di Infrastrutture IoT e Lead DevOps Engineer. 10+ anni a costruire infrastrutture cloud affidabili per piattaforme IoT globali. Azure, Kubernetes, Terraform, Datadog, SRE.',
    cinPh:'scrivi un comando…'
  };

  // Capture the English source of truth from the DOM (before any swap).
  var EN = {};
  document.querySelectorAll('[data-i18n]').forEach(function(elm){
    EN[elm.getAttribute('data-i18n')] = elm.innerHTML;
  });
  var EN_ARIA = {};
  document.querySelectorAll('[data-i18n-aria]').forEach(function(elm){
    EN_ARIA[elm.getAttribute('data-i18n-aria')] = elm.getAttribute('aria-label');
  });
  var metaDescEl = document.querySelector('meta[name="description"]');
  var cinEl = document.getElementById('cin');
  var META_EN = {
    title: document.title,
    desc: metaDescEl ? metaDescEl.getAttribute('content') : '',
    cinPh: cinEl ? cinEl.getAttribute('placeholder') : ''
  };

  var langListeners = [];
  function addLangListener(fn){ langListeners.push(fn); }

  function applyLang(lang, skipListeners){
    var it = lang === 'it';
    // 1 · static body content
    document.querySelectorAll('[data-i18n]').forEach(function(elm){
      var k = elm.getAttribute('data-i18n');
      var html = (it && IT[k] != null) ? IT[k] : EN[k];
      if(html != null) elm.innerHTML = html;
    });
    // 2 · document meta
    document.title = it ? META_IT.title : META_EN.title;
    if(metaDescEl) metaDescEl.setAttribute('content', it ? META_IT.desc : META_EN.desc);
    // 3 · translatable aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(function(elm){
      var k = elm.getAttribute('data-i18n-aria');
      var v = (it && IT[k] != null) ? IT[k] : EN_ARIA[k];
      if(v != null) elm.setAttribute('aria-label', v);
    });
    // 4 · the terminal input placeholder
    if(cinEl) cinEl.setAttribute('placeholder', it ? META_IT.cinPh : META_EN.cinPh);
    // 5 · let dynamic modules (terminal, diagram, lab) re-render
    if(!skipListeners) langListeners.forEach(function(fn){ try{ fn(lang); }catch(e){} });
  }

  var langSeg = document.getElementById('langSeg');
  function setLang(mode){
    if(mode !== 'en' && mode !== 'it') return;
    root.setAttribute('lang', mode);
    try{ localStorage.setItem('lang', mode); }catch(e){}
    if(langSeg) langSeg.querySelectorAll('button').forEach(function(b){
      b.setAttribute('aria-pressed', b.dataset.lng === mode ? 'true' : 'false');
    });
    applyLang(mode);
  }
  if(langSeg){
    // reflect the pre-paint choice on the toggle
    langSeg.querySelectorAll('button').forEach(function(b){
      b.setAttribute('aria-pressed', b.dataset.lng === currentLang() ? 'true' : 'false');
    });
    langSeg.addEventListener('click', function(e){
      var b = e.target.closest('button'); if(!b) return;
      setLang(b.dataset.lng);
    });
  }

  /* ---------------------------------------------------------------------
     Reliability Lab — error-budget calculator (also reused by terminal slo)
     --------------------------------------------------------------------- */
  var WINMINS = [1440, 10080, 43200, 129600, 525600];
  var WINLABELS = {
    en: ['per day','per week','per month','per quarter','per year'],
    it: ['al giorno','a settimana','al mese','al trimestre','all\'anno']
  };
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

    var shown = 99.9;
    function calc(s){
      shown = s;
      if(!isFinite(s)) s = 0; if(s < 0) s = 0; if(s > 100) s = 100;
      var b = 1 - s/100;
      var labels = WINLABELS[currentLang()];
      budget.textContent = (b*100).toFixed(s>99.99 ? 4 : (s>99.9 ? 3 : 2)) + '%';
      windows.innerHTML = WINMINS.map(function(min, i){
        return '<div class="wcard'+(i===2?' mo':'')+'"><div class="wt">'+labels[i]+
               '</div><div class="wv">'+fmtDur(b*min)+'</div></div>';
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
    addLangListener(function(){ calc(shown); });
  })();

  /* ---------------------------------------------------------------------
     Case study — interactive architecture diagram
     --------------------------------------------------------------------- */
  (function caseStudy(){
    var detail = document.getElementById('detail');
    if(!detail) return;
    var INFO = {
      en: {
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
      },
      it: {
        orchestrator:{ n:'Orchestratore', r:'smista il lavoro · fa lo sviluppatore', o:[
          'Riceve un task, smista gli specialisti giusti, assembla i loro risultati in un unico verdetto.',
          'Fa da sviluppatore-nel-loop su tutto il workflow.'] },
        'code-review':{ n:'Agente Code Review', r:'PR · standard · impatto pipeline', o:[
          'Revisiona le pull request rispetto agli standard del team.',
          'Segnala le modifiche che impattano la build o la pipeline.'] },
        qa:{ n:'Agente QA', r:'checkout branch · test', o:[
          'Fa il checkout del branch ed esegue la suite di test.',
          'Riporta i fallimenti all\'orchestratore.'] },
        release:{ n:'Agente Release', r:'pronto per la promozione', o:[
          'Valuta se una modifica è pronta per essere promossa.',
          'Coordina il rilascio.'] },
        infrastructure:{ n:'Agente Infrastruttura', r:'IaC · provisioning', o:[
          'Valida le modifiche IaC e di provisioning prima che vengano applicate.',
          'Protegge il percorso consolidato così le modifiche restano riproducibili.'] },
        reliability:{ n:'Agente Reliability', r:'SLO · segnali di incidente', o:[
          'Osserva SLO e segnali di incidente.',
          'Fa emergere il rischio di affidabilità legato a una modifica specifica.'] },
        'self-improvement':{ n:'Ciclo di auto-miglioramento', r:'auto-analisi settimanale', o:[
          'Auto-analisi settimanale che fa emergere le lacune.',
          'Riporta i miglioramenti negli agenti.'] },
        skills:{ n:'Livello di skill condivise', r:'convenzioni · guardrail di sicurezza', o:[
          'Convenzioni riutilizzabili a cui ogni agente attinge — più guardrail di sicurezza.',
          'I guardrail bloccano qualsiasi cosa distruttiva.'] }
      }
    };
    var nodes = Array.prototype.slice.call(document.querySelectorAll('.node'));
    var curId = 'orchestrator';
    function render(id){
      var d = INFO[currentLang()][id]; if(!d) return;
      curId = id;
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
    addLangListener(function(){ render(curId); });
  })();

  /* ---------------------------------------------------------------------
     Engineering artifacts — the inline viewer fetches the real /lab/*.md
     files (same-origin, no third party) and Download is a native <a download>
     link in the HTML. The files in /lab/ are the single source of truth.
     --------------------------------------------------------------------- */
  (function artifacts(){
    var grid = document.getElementById('grid'),
        pv = document.getElementById('pv'),
        fn = document.getElementById('fn');
    if(!grid || !pv || !fn) return;

    var FILES = {
      adr:'adr-template.md', slo:'slo-definition.md',
      incident:'incident-review.md', tf:'terraform-module-checklist.md'
    };
    var TXT = {
      en: { loading:'Loading…', err:function(f){ return 'Preview unavailable — open lab/' + f; } },
      it: { loading:'Caricamento…', err:function(f){ return 'Anteprima non disponibile — apri lab/' + f; } }
    };
    var cache = {};
    var cards = Array.prototype.slice.call(document.querySelectorAll('.art'));
    function view(id){
      var file = FILES[id]; if(!file) return;
      fn.textContent = file;
      cards.forEach(function(c){ c.classList.toggle('on', c.dataset.id === id); });
      if(cache[id] != null){ pv.textContent = cache[id]; return; }
      pv.textContent = TXT[currentLang()].loading;
      fetch('lab/' + file).then(function(r){ return r.text(); }).then(function(t){
        cache[id] = t; if(fn.textContent === file) pv.textContent = t;   // ignore a stale fetch
      }).catch(function(){ pv.textContent = TXT[currentLang()].err(file); });
    }
    grid.addEventListener('click', function(e){
      var b = e.target.closest('.view'); if(!b) return;   // Download is a native link
      view(b.dataset.id);
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

    // All terminal-facing copy, per language. Command *keys* stay English
    // (real shell verbs); their descriptions and output are translated.
    var TERM = {
      en: {
        desc:{ about:'one-line profile', stack:'core stack', devices:'platform scale',
          certs:'certifications', experience:'work history', topology:'platform diagram',
          contact:'links', work:'open the case study', principles:'how I work',
          systems:'systems I would build', lab:'reliability lab', artifacts:'downloadable templates',
          slo:'compute an error budget', theme:'switch theme', ls:'list sections',
          resume:'download résumé (PDF)', clear:'clear the screen', sudo:'(try it)',
          coffee:'(try it)', help:'list commands' },
        groups:{ navigate:'navigate', info:'info', tools:'tools', fun:'fun' },
        opening:'→ opening ',
        notfound:function(n){ return 'command not found: ' + n + ' — try <span class="ac">help</span>'; },
        about:['IoT Infrastructure Architect &amp; Lead DevOps Engineer.',
               '10+ years building reliable cloud infrastructure for global IoT platforms.'],
        stack:'Azure · AKS · Azure Functions · <span class="ac">Terraform</span> · Datadog · Azure DevOps · Kubernetes · SRE',
        devices:'<span class="ok">50,000+</span> devices in production — scaling to <span class="ok">~300,000</span> within a year.',
        certs:'<span class="ac">CKA</span> · <span class="ac">LFCS</span> · <span class="ac">AZ-104</span> · <span class="ac">AZ-400</span>',
        experience:['Culligan International   <span class="dm">Infrastructure Architect</span>   <span class="dm">2023–present</span>',
                     'MSC Mediterranean Shipping   <span class="dm">DevOps Engineer</span>   <span class="dm">2022–2023</span>',
                     'Deltatre   <span class="dm">Support Supervisor → Software Engineer</span>   <span class="dm">2015–2022</span>'],
        topology:['devices ─(CoAP·LWM2M·MQTT)→ ingest ─→ azure[AKS+Functions] ─→ datadog·SLO ─→ incident ↺',
                  '  Azure handles MQTT; the IoT bridge speaks CoAP &amp; LWM2M.'],
        contact:'github.com/fabrideci · linkedin.com/in/fabriziodecicco · fabri.deci@gmail.com',
        nav:{ work:['<span class="b">multi-agent engineering assistant</span>', []],
              principles:['operating principles', ['each one: principle · failure mode · response']],
              systems:['“systems I would build”', ['architectural opinions, not just past work']],
              lab:['Reliability Lab', ['try: <span class="ac">slo 99.9</span>']],
              artifacts:['engineering artifacts', ['ADR · SLO · incident-review · Terraform module checklist']] },
        sloUsage:'usage: <span class="ac">slo &lt;target%&gt;</span>   e.g. <span class="ac">slo 99.9</span>',
        sloResult:function(t, disp){ return 'SLO <span class="b">'+t+'%</span> → error budget <span class="ok">'+disp+'</span> / 30 days'; },
        themeUsage:'usage: <span class="ac">theme dark|light</span>',
        themeSet:function(m){ return 'theme → <span class="ac">'+m+'</span>'; },
        ls:'about.md   experience/   work/   principles/   lab/   artifacts/   contact.md',
        resume:'→ downloading <span class="ac">Fabrizio-De-Cicco-Resume.pdf</span>',
        sudo:'sudo: permission denied — you’re not on the on-call rotation 🙂',
        coffee:'☕ brewing… <span class="dm">deploy responsibly.</span>',
        boot:[{ cmd:'whoami', out:[['Fabrizio De Cicco — IoT Infrastructure Architect &amp; Lead DevOps Engineer','ok']] },
              { cmd:'cat profile.md', out:[['10+ yrs of cloud infra for global IoT · <span class="ok">50K+</span> devices in prod (→300K)','dm'],
                                            ['Azure · Kubernetes · <span class="ac">Terraform</span> · Datadog · SRE','dm']] }],
        readyHint:'<span class="dm">type</span> <span class="ac">help</span> <span class="dm">· Tab completes · try</span> <span class="ac">slo 99.9</span> <span class="cursor"></span>'
      },
      it: {
        desc:{ about:'profilo in una riga', stack:'stack principale', devices:'scala della piattaforma',
          certs:'certificazioni', experience:'storia lavorativa', topology:'diagramma della piattaforma',
          contact:'link', work:'apri il caso di studio', principles:'come lavoro',
          systems:'sistemi che costruirei', lab:'reliability lab', artifacts:'template scaricabili',
          slo:'calcola un error budget', theme:'cambia tema', ls:'elenca le sezioni',
          resume:'scarica il curriculum (PDF)', clear:'pulisci lo schermo', sudo:'(provalo)',
          coffee:'(provalo)', help:'elenca i comandi' },
        groups:{ navigate:'naviga', info:'info', tools:'strumenti', fun:'divertimento' },
        opening:'→ apertura ',
        notfound:function(n){ return 'comando non trovato: ' + n + ' — prova <span class="ac">help</span>'; },
        about:['Architetto di Infrastrutture IoT e Lead DevOps Engineer.',
               '10+ anni a costruire infrastrutture cloud affidabili per piattaforme IoT globali.'],
        stack:'Azure · AKS · Azure Functions · <span class="ac">Terraform</span> · Datadog · Azure DevOps · Kubernetes · SRE',
        devices:'<span class="ok">50.000+</span> dispositivi in produzione — in crescita verso <span class="ok">~300.000</span> entro un anno.',
        certs:'<span class="ac">CKA</span> · <span class="ac">LFCS</span> · <span class="ac">AZ-104</span> · <span class="ac">AZ-400</span>',
        experience:['Culligan International   <span class="dm">Infrastructure Architect</span>   <span class="dm">2023–oggi</span>',
                     'MSC Mediterranean Shipping   <span class="dm">DevOps Engineer</span>   <span class="dm">2022–2023</span>',
                     'Deltatre   <span class="dm">Support Supervisor → Software Engineer</span>   <span class="dm">2015–2022</span>'],
        topology:['devices ─(CoAP·LWM2M·MQTT)→ ingest ─→ azure[AKS+Functions] ─→ datadog·SLO ─→ incident ↺',
                  '  Azure gestisce MQTT; il bridge IoT parla CoAP e LWM2M.'],
        contact:'github.com/fabrideci · linkedin.com/in/fabriziodecicco · fabri.deci@gmail.com',
        nav:{ work:['<span class="b">assistente di ingegneria multi-agente</span>', []],
              principles:['principi operativi', ['ognuno: principio · modalità di guasto · risposta']],
              systems:['“sistemi che costruirei”', ['opinioni architetturali, non solo lavoro passato']],
              lab:['Reliability Lab', ['prova: <span class="ac">slo 99.9</span>']],
              artifacts:['artefatti di ingegneria', ['ADR · SLO · revisione incidente · checklist modulo Terraform']] },
        sloUsage:'uso: <span class="ac">slo &lt;target%&gt;</span>   es. <span class="ac">slo 99.9</span>',
        sloResult:function(t, disp){ return 'SLO <span class="b">'+t+'%</span> → error budget <span class="ok">'+disp+'</span> / 30 giorni'; },
        themeUsage:'uso: <span class="ac">theme dark|light</span>',
        themeSet:function(m){ return 'tema → <span class="ac">'+m+'</span>'; },
        ls:'about.md   experience/   work/   principles/   lab/   artifacts/   contact.md',
        resume:'→ scaricamento <span class="ac">Fabrizio-De-Cicco-Resume.pdf</span>',
        sudo:'sudo: permesso negato — non sei nel turno di reperibilità 🙂',
        coffee:'☕ in preparazione… <span class="dm">fai deploy responsabilmente.</span>',
        boot:[{ cmd:'whoami', out:[['Fabrizio De Cicco — Architetto di Infrastrutture IoT e Lead DevOps Engineer','ok']] },
              { cmd:'cat profile.md', out:[['10+ anni di infra cloud per IoT globale · <span class="ok">50K+</span> dispositivi in prod (→300K)','dm'],
                                            ['Azure · Kubernetes · <span class="ac">Terraform</span> · Datadog · SRE','dm']] }],
        readyHint:'<span class="dm">scrivi</span> <span class="ac">help</span> <span class="dm">· Tab completa · prova</span> <span class="ac">slo 99.9</span> <span class="cursor"></span>'
      }
    };
    function L(){ return TERM[currentLang()]; }

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
      el(L().opening + label, 'dm');
      (lines || []).forEach(function(l){ el('  ' + l, 'dm'); });
      go(id);
    }

    // ---- command map: single source of truth (output text comes from TERM) ----
    var cmds = {
      about:   { run:function(){ var S=L(); el(S.about[0], 'b'); el(S.about[1], 'dm'); } },
      stack:   { run:function(){ el(L().stack, 'dm'); } },
      devices: { run:function(){ el(L().devices); } },
      certs:   { run:function(){ el(L().certs); } },
      experience: { run:function(){ L().experience.forEach(function(l){ el(l); }); go('experience'); } },
      topology:{ run:function(){ var S=L(); el(S.topology[0], 'ac', true); el(S.topology[1], 'dm'); } },
      contact: { run:function(){ el(L().contact, 'ac'); go('contact'); } },

      work:       { run:function(){ var n=L().nav.work;       nav('work', n[0], n[1]); } },
      principles: { run:function(){ var n=L().nav.principles; nav('principles', n[0], n[1]); } },
      systems:    { run:function(){ var n=L().nav.systems;    nav('systems', n[0], n[1]); } },
      lab:        { run:function(){ var n=L().nav.lab;        nav('lab', n[0], n[1]); } },
      artifacts:  { run:function(){ var n=L().nav.artifacts;  nav('artifacts', n[0], n[1]); } },

      slo:   { run:function(a){
          var S=L(), t = parseFloat(a && a[0]);
          if(!isFinite(t)){ el(S.sloUsage, 'dm'); return; }
          if(t < 0) t = 0; if(t > 100) t = 100;
          var mins = (1 - t/100) * 43200, disp = mins >= 60 ? (mins/60).toFixed(1)+' h' : mins.toFixed(1)+' min';
          el(S.sloResult(t, disp)); } },
      theme: { run:function(a){
          var S=L(), cur = currentTheme();
          var m = (a && a[0]) ? a[0].toLowerCase() : (cur === 'dark' ? 'light' : 'dark');
          if(m !== 'dark' && m !== 'light'){ el(S.themeUsage, 'dm'); return; }
          setTheme(m); el(S.themeSet(m), 'dm'); } },
      ls:    { run:function(){ el(L().ls, 'dm', true); } },
      resume:{ run:function(){
          el(L().resume, 'dm');
          var a = document.createElement('a');
          a.href = 'assets/Fabrizio-De-Cicco-Resume.pdf'; a.download = 'Fabrizio-De-Cicco-Resume.pdf';
          document.body.appendChild(a); a.click(); a.remove(); } },
      clear: { run:function(){ stream.innerHTML = ''; } },

      sudo:  { run:function(){ el(L().sudo, 'al'); } },
      coffee:{ run:function(){ el(L().coffee); } }
    };

    var helpGroups = [
      ['navigate', ['work','principles','systems','lab','artifacts']],
      ['info',     ['about','stack','devices','certs','experience','topology','contact']],
      ['tools',    ['slo','theme','ls','resume','clear']],
      ['fun',      ['sudo','coffee']]
    ];
    cmds.help = { run:function(){
      var S = L();
      helpGroups.forEach(function(grp){
        el('<span class="dm">'+(S.groups[grp[0]] || grp[0])+'</span>');
        grp[1].forEach(function(k){
          if(cmds[k] && S.desc[k]) el('  <span class="ac">'+k+'</span>' + ' '.repeat(Math.max(2, 12-k.length)) +
                         '<span class="dm">'+S.desc[k]+'</span>', null, true);
        });
      });
    }};

    function exec(raw){
      var t = raw.trim(); if(!t) return;
      var parts = t.split(/\s+/), name = parts[0].toLowerCase(), args = parts.slice(1);
      promptLine(t);
      if(cmds[name]) cmds[name].run(args);
      else el(L().notfound(esc(name)), 'al');
      scrollBody();
    }

    function ready(){
      if(inrow) inrow.hidden = false;
      if(hints) hints.hidden = false;
      // Ready to type — but don't scroll the page or yank focus back if the
      // user already moved into it (e.g. tabbed to the skip link during boot).
      var ae = document.activeElement;
      if(!ae || ae === document.body) input.focus({ preventScroll:true });
    }

    function readyHint(){ el(L().readyHint); }

    var bootGen = 0;
    function runBoot(){
      var gen = ++bootGen, boot = L().boot;   // a newer run (language switch) supersedes any pending one
      if(reduce){
        boot.forEach(function(step){ promptLine(step.cmd); step.out.forEach(function(o){ el(o[0], o[1]); }); });
        readyHint(); ready();
      } else {
        var bi = 0;
        function typeCmd(text, done){
          var span = el('<span class="pr">$</span> <span class="t"></span>').querySelector('.t');
          var i = 0;
          (function tick(){
            if(gen !== bootGen) return;
            if(i <= text.length){ span.textContent = text.slice(0, i++); setTimeout(tick, 38); }
            else done();
          })();
        }
        function nextBoot(){
          if(gen !== bootGen) return;
          if(bi < boot.length){
            var step = boot[bi++];
            typeCmd(step.cmd, function(){ setTimeout(function(){ if(gen !== bootGen) return; step.out.forEach(function(o){ el(o[0], o[1]); }); setTimeout(nextBoot, 320); }, 140); });
          } else { readyHint(); ready(); }
        }
        setTimeout(nextBoot, 450);
      }
    }
    runBoot();

    // On language switch, reset the terminal so on-screen output matches.
    addLangListener(function(){
      stream.innerHTML = '';
      runBoot();
    });

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

  /* ---------------------------------------------------------------------
     Apply the persisted/initial language to the static body + meta once
     everything is wired. Modules already rendered in the right language via
     currentLang(), so skip the listener re-render here.
     --------------------------------------------------------------------- */
  applyLang(currentLang(), true);

})();
