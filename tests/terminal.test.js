const assert = require('node:assert/strict');
const test = require('node:test');
const { loadSite } = require('./helpers/site');

function terminal(reducedMotion){
  let document;
  const elements = {};
  ['artifacts', 'certs', 'cin', 'contact', 'experience', 'hints', 'inrow', 'lab', 'principles', 'stream', 'term', 'work'].forEach(function(id){
    const attributes = {};
    const listeners = {};
    elements[id] = {
      addEventListener: function(name, listener){ listeners[name] = listener; },
      appendChild: function(child){ this.children.push(child); },
      attributes: attributes,
      children: [],
      click: function(command){ listeners.click({ target: { closest: function(){ return { dataset: { c: command } }; } } }); },
      focus: function(options){
        if(id === 'cin' || attributes.tabindex != null){ document.activeElement = this; this.focusOptions = options; }
      },
      getAttribute: function(name){ return attributes[name] || null; },
      innerHTML: '',
      keydown: function(key, options){
        const event = Object.assign({ defaultPrevented: false, key: key, preventDefault: function(){ this.defaultPrevented = true; } }, options);
        listeners.keydown(event);
        return event;
      },
      parentElement: { scrollHeight: 500, scrollTop: 0 },
      scrollIntoView: function(options){ this.scrollOptions = options; },
      setAttribute: function(name, value){ attributes[name] = value; },
      value: ''
    };
  });
  const matchMedia = function(){ return { matches: Boolean(reducedMotion) }; };
  document = loadSite(elements, {
    document: { activeElement: null, createElement: function(){ return {}; } },
    globals: { matchMedia: matchMedia, window: { matchMedia: matchMedia } }
  });
  return { document: document, elements: elements };
}

function assertDestination(site, id, reducedMotion){
  const destination = site.elements[id];
  assert.equal(site.document.activeElement, destination);
  assert.equal(destination.attributes.tabindex, '-1');
  assert.equal(destination.focusOptions.preventScroll, true);
  assert.equal(destination.scrollOptions.behavior, reducedMotion ? 'auto' : 'smooth');
  assert.equal(destination.scrollOptions.block, 'start');
}

['artifacts', 'certs', 'contact', 'experience', 'lab', 'principles', 'work'].forEach(function(command){
  test('Typed ' + command + ' command moves keyboard navigation to its destination', function(){
    const site = terminal();
    site.elements.cin.focus();
    site.elements.cin.value = command;
    site.elements.cin.keydown('Enter');
    assertDestination(site, command);
  });
});

['contact', 'work'].forEach(function(command){
  test(command + ' chip leaves keyboard focus at its destination', function(){
    const site = terminal();
    site.elements.hints.click(command);
    assertDestination(site, command);
  });
});

test('Non-navigation chips return focus to the terminal input', function(){
  const site = terminal();
  site.elements.hints.click('help');
  assert.equal(site.document.activeElement, site.elements.cin);
});

test('Terminal navigation respects reduced motion', function(){
  const site = terminal(true);
  site.elements.hints.click('work');
  assertDestination(site, 'work', true);
});

test('Tab extends a partial command, then allows normal forward navigation', function(){
  const site = terminal();
  site.elements.cin.value = 'wor';
  assert.equal(site.elements.cin.keydown('Tab').defaultPrevented, true);
  assert.equal(site.elements.cin.value, 'work');
  assert.equal(site.elements.cin.keydown('Tab').defaultPrevented, false);
});

['', 'unknown', 'slo 99.9'].forEach(function(value){
  test('Tab allows forward navigation for ' + JSON.stringify(value), function(){
    const site = terminal();
    site.elements.cin.value = value;
    assert.equal(site.elements.cin.keydown('Tab').defaultPrevented, false);
    assert.equal(site.elements.cin.value, value);
  });
});

test('Shift+Tab preserves backward navigation even with a partial command', function(){
  const site = terminal();
  site.elements.cin.value = 'wor';
  assert.equal(site.elements.cin.keydown('Tab', { shiftKey: true }).defaultPrevented, false);
  assert.equal(site.elements.cin.value, 'wor');
});
