
console.log('renderer.js started');

var cytoscape = require('cytoscape');
var Promise = require('bluebird');

var electron = require('electron')
var shell = electron.shell;
var ipcRenderer = electron.ipcRenderer;

var jQuery = global.jQuery = require('jquery');
// jQuery.qtip = require('qtip2');

// var cyqtip = require('cytoscape-qtip');
// cyqtip(cytoscape, jQuery); // register extension
//
// Can not register `qtip` for `collection` since `qtip` already exists in the prototype and can not be overridden
// console.trace()
// -  error @/home/user/isbm/isbm/node_modules/cytoscape/src/util/index.js:23
// -  overrideErr @/home/user/isbm/isbm/node_modules/cytoscape/src/extension.js:21
// -  setExtension @/home/user/isbm/isbm/node_modules/cytoscape/src/extension.js:33
// -  extension @/home/user/isbm/isbm/node_modules/cytoscape/src/extension.js:188
// -  cytoscape @/home/user/isbm/isbm/node_modules/cytoscape/src/index.js:27
// -  register @/home/user/isbm/isbm/node_modules/cytoscape-qtip/cytoscape-qtip.js:283
//-  (anonymous) @/home/user/isbm/isbm/renderer.js:14



document.addEventListener('DOMContentLoaded', function() {

  console.log('DOMContentLoaded from renderer.js');

  var cy = window.cy = cytoscape({
    container: document.getElementById('cy'),
    
    boxSelectionEnabled: false,
    autounselectify: true,
    
    style: [
      {
        selector: 'node',
        css: {
          'content': 'data(id)',
          'text-valign': 'center',
          'text-halign': 'center'
        }
      },
      {
        selector: '$node > node',
        css: {
          'padding-top': '10px',
          'padding-left': '10px',
          'padding-bottom': '10px',
          'padding-right': '10px',
          'text-valign': 'top',
          'text-halign': 'center',
          'background-color': '#bbb'
        }
      },
      {
        selector: 'edge',
        css: {
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier'
        }
      },
      {
        selector: ':selected',
        css: {
          'background-color': 'black',
          'line-color': 'black',
          'target-arrow-color': 'black',
          'source-arrow-color': 'black'
        }
      }
    ],
    
    elements: {
      nodes: [
        { data: { id: 'a', parent: 'b' }, position: { x: 215, y: 85 } },
        { data: { id: 'b' } },
        { data: { id: 'c', parent: 'b' }, position: { x: 300, y: 85 } },
        { data: { id: 'd' }, position: { x: 215, y: 175 } },
        { data: { id: 'e' } },
        { data: { id: 'f', parent: 'e' }, position: { x: 300, y: 175 } }
      ],
      edges: [
        { data: { id: 'ad', source: 'a', target: 'd' } },
        { data: { id: 'eb', source: 'e', target: 'b' } }
        
      ]
    },
    
    layout: {
      name: 'preset',
      padding: 5
    }
  });

  cy.on('click', 'node', function (evt){
      console.log( 'clicked ' + this.id() );

      var el = cy.getElementById(this.id())

      if (!el.isChild()) {
        if ('counter' in el) {
          el.counter += 1
        } else {
          el.counter = 0
        }
        cy.add({
          nodes: [
            { data: { id: el.id() + '.' + el.counter, parent: 'e'} }
          ]
        })
      }
  })

  cy.on('click', 'edge', function (evt){
      console.log( 'clicked ' + this.id() );
  })


});

jQuery(document).on('click', 'a[href^="http"]', function(event) {
  event.preventDefault();
  shell.openExternal(this.href);
});




