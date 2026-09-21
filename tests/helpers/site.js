const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', '..', 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(__dirname, '..', '..', 'main.js'), 'utf8');

function loadSite(elements, options){
  options = options || {};
  const document = Object.assign({
    documentElement: { getAttribute: function(){ return 'en'; } },
    getElementById: function(id){ return elements[id] || null; },
    querySelector: function(){ return null; },
    querySelectorAll: function(){ return []; },
    title: 'Portfolio'
  }, options.document);
  vm.runInNewContext(script, Object.assign({ document: document, window: {} }, options.globals));
  return document;
}

module.exports = { html: html, loadSite: loadSite };
