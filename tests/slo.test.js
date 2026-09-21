const assert = require('node:assert/strict');
const test = require('node:test');
const { html, loadSite } = require('./helpers/site');

function calculator(){
  const elements = {};
  ['budget', 'num', 'presets', 'range', 'windows'].forEach(function(id){
    const attributes = {};
    const input = html.match(new RegExp('<input\\b[^>]*\\bid="' + id + '"[^>]*>'));
    const listeners = {};
    if(input) Array.from(input[0].matchAll(/([\w-]+)="([^"]*)"/g)).forEach(function(match){
      attributes[match[1]] = match[2];
    });
    elements[id] = {
      addEventListener: function(name, listener){ listeners[name] = listener; },
      attributes: attributes,
      innerHTML: '',
      input: function(value){ this.value = String(value); listeners.input(); },
      textContent: '',
      value: attributes.value || ''
    };
  });
  loadSite(elements);
  return elements;
}

test('SLO slider supports the same full target domain and precision as the number input', function(){
  const elements = calculator();
  ['max', 'min', 'step'].forEach(function(attribute){
    assert.equal(elements.range.attributes[attribute], elements.num.attributes[attribute], attribute);
  });
});

[
  { budget: '100.00%', target: 0 },
  { budget: '50.00%', target: 50 },
  { budget: '10.00%', target: 90 },
  { budget: '0.10%', target: 99.9 },
  { budget: '0.0010%', target: 99.999 },
  { budget: '0.0000%', target: 100 }
].forEach(function(example){
  test('Number entry keeps the slider and error budget aligned at ' + example.target + '%', function(){
    const elements = calculator();
    elements.num.input(example.target);
    assert.equal(Number(elements.range.value), example.target);
    assert.equal(elements.budget.textContent, example.budget);
  });

  test('Slider entry keeps the number and error budget aligned at ' + example.target + '%', function(){
    const elements = calculator();
    elements.range.input(example.target);
    assert.equal(Number(elements.num.value), example.target);
    assert.equal(elements.budget.textContent, example.budget);
  });
});
