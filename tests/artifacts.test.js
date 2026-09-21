const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { html, loadSite } = require('./helpers/site');

const files = {
  adr: 'adr-template.md',
  incident: 'incident-review.md',
  skill: 'skill-template.md',
  slo: 'slo-definition.md',
  tf: 'terraform-module-checklist.md'
};

function artifacts(lang){
  let document;
  const elements = {};
  const requests = [];
  const rows = Object.keys(files).map(function(id){
    const button = { attributes: {}, setAttribute: function(name, value){ this.attributes[name] = value; } };
    const row = {
      button: button,
      classList: { toggle: function(){} },
      dataset: { id: id },
      querySelector: function(){ return button; }
    };
    button.closest = function(){ return row; };
    return row;
  });
  ['fn', 'grid', 'preview-status', 'pv'].forEach(function(id){
    elements[id] = {
      addEventListener: function(name, handler){ this[name] = handler; },
      attributes: {},
      setAttribute: function(name, value){ this.attributes[name] = value; },
      textContent: ''
    };
  });
  document = loadSite(elements, {
    document: {
      activeElement: null,
      documentElement: { getAttribute: function(){ return lang || 'en'; } },
      querySelectorAll: function(selector){ return selector === '.frow' ? rows : []; }
    },
    globals: {
      fetch: function(url){
        return new Promise(function(resolve, reject){ requests.push({ reject: reject, resolve: resolve, url: url }); });
      }
    }
  });
  return {
    document: document,
    elements: elements,
    requests: requests,
    rows: rows,
    select: function(id){
      const button = rows.find(function(row){ return row.dataset.id === id; }).button;
      document.activeElement = button;
      elements.grid.click({ target: { closest: function(){ return button; } } });
      assert.equal(document.activeElement, button, 'Selection must retain the initiating focus');
    }
  };
}

async function settle(request, text, failure){
  if(failure) request.reject(new Error('Unavailable'));
  else request.resolve({ ok: true, text: function(){ return Promise.resolve(text); } });
  await new Promise(function(resolve){ setImmediate(resolve); });
}

test('Preview exposes a status region and identifies its current filename', function(){
  assert.match(html, /id="preview-status"[^>]*role="status"/);
  assert.match(html, /id="pv"[^>]*aria-describedby="fn"/);
});

['en', 'it'].forEach(function(lang){
  test('All five real Markdown files expose selection, loading and ready state in ' + lang, async function(){
    const site = artifacts(lang);
    for(const id of Object.keys(files)){
      if(id !== 'adr') site.select(id);
      const request = site.requests.at(-1);
      const text = fs.readFileSync(path.join(__dirname, '..', 'lab', files[id]), 'utf8');
      assert.equal(request.url, 'lab/' + files[id]);
      assert.equal(site.elements.pv.attributes['aria-busy'], 'true');
      assert.match(site.elements['preview-status'].textContent, lang === 'it' ? /Caricamento/ : /Loading/);
      for(const row of site.rows) assert.equal(row.button.attributes['aria-pressed'], String(row.dataset.id === id));
      await settle(request, text);
      assert.equal(site.elements.pv.textContent, text);
      assert.equal(site.elements.pv.attributes['aria-busy'], 'false');
      assert.match(site.elements['preview-status'].textContent, lang === 'it' ? /Anteprima pronta/ : /Preview ready/);
      assert.ok(site.elements['preview-status'].textContent.includes(files[id]));
    }
    const count = site.requests.length;
    site.select('adr');
    assert.equal(site.requests.length, count, 'Cached files do not need another request');
    assert.equal(site.elements.pv.attributes['aria-busy'], 'false');
    assert.ok(site.elements['preview-status'].textContent.includes(files.adr));
  });

  test('Active request failures clear loading state and identify the file in ' + lang, async function(){
    const site = artifacts(lang);
    await settle(site.requests[0], '', true);
    assert.equal(site.elements.pv.attributes['aria-busy'], 'false');
    assert.match(site.elements['preview-status'].textContent, lang === 'it' ? /non disponibile/ : /unavailable/);
    assert.ok(site.elements['preview-status'].textContent.includes(files.adr));
  });
});

[false, true].forEach(function(failure){
  test('Stale ' + (failure ? 'failure' : 'success') + ' cannot replace the latest pending selection', async function(){
    const site = artifacts();
    site.select('slo');
    site.select('adr');
    await settle(site.requests[0], 'Old ADR', failure);
    await settle(site.requests[1], 'Old SLO', failure);
    assert.equal(site.elements.pv.attributes['aria-busy'], 'true');
    assert.match(site.elements['preview-status'].textContent, /Loading.*adr-template/);
    await settle(site.requests[2], 'Current ADR');
    assert.equal(site.elements.pv.textContent, 'Current ADR');
    assert.equal(site.elements.pv.attributes['aria-busy'], 'false');
    assert.match(site.elements['preview-status'].textContent, /ready.*adr-template/);
  });
});
