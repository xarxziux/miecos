!function e(t,n,i){function o(f,s){if(!n[f]){if(!t[f]){var c="function"==typeof require&&require;if(!s&&c)return c(f,!0);if(r)return r(f,!0);var a=new Error("Cannot find module '"+f+"'");throw a.code="MODULE_NOT_FOUND",a}var u=n[f]={exports:{}};t[f][0].call(u.exports,function(e){var n=t[f][1][e];return o(n?n:e)},u,u.exports,e,t,n,i)}return n[f].exports}for(var r="function"==typeof require&&require,f=0;f<i.length;f++)o(i[f]);return o}({1:[function(e,t,n){!function(i,o){if("object"==typeof t&&"object"==typeof t.exports){var r=o(e,n);void 0!==r&&(t.exports=r)}else"function"==typeof define&&define.amd&&define(i,o)}(["require","exports"],function(e,t){"use strict";t.config={SCREENWIDTH:640,SCREENHEIGHT:480,MAXPLAYERS:1e3,INITGRASS:300,INITRABBITS:50,MAXGENESIZE:80,MAXGRASSHEALTH:300,MAXRABBITHEALTH:400,GRASSNUTRITION:20,MAXTRIES:200,TOTALRUNS:0,BLANKCHAR:".",GRASSCHAR:"|",RABBITCHAR:"r",FOXCHAR:"F",GRASSCOLOUR:"green",RABBITCOLOUR:"brown",OUTPUTFILENAME:"./miecos.output.txt"}})},{}],2:[function(e,t,n){!function(i,o){if("object"==typeof t&&"object"==typeof t.exports){var r=o(e,n);void 0!==r&&(t.exports=r)}else"function"==typeof define&&define.amd&&define(i,o)}(["require","exports","./utils","./config"],function(e,t){"use strict";function n(){return{health:r.config.MAXRABBITHEALTH/2,sated:!1,gene:o.getGeneString(),visible:!0,settings:f}}function i(){return{health:r.config.MAXGRASSHEALTH/2,sated:!1,gene:"",visible:!0,settings:s}}const o=e("./utils"),r=e("./config"),f={category:"herbivore",name:"rabbit",appearance:r.config.RABBITCOLOUR,maxHealth:r.config.MAXRABBITHEALTH},s={category:"plant",name:"grass",appearance:r.config.GRASSCOLOUR,maxHealth:r.config.MAXGRASSHEALTH};t.newRabbit=n,t.newGrass=i})},{"./config":1,"./utils":4}],3:[function(e,t,n){!function(i,o){if("object"==typeof t&&"object"==typeof t.exports){var r=o(e,n);void 0!==r&&(t.exports=r)}else"function"==typeof define&&define.amd&&define(i,o)}(["require","exports","./config","./entities"],function(e,t){"use strict";const n=e("./config"),i=e("./entities"),o=function(){const e=new Array(n.config.SCREENWIDTH).fill(null);return new Array(n.config.SCREENHEIGHT).fill(e)}();o[100][100]=i.newRabbit(),console.log(o[100][100].settings.name),console.log(o[100][100].gene)})},{"./config":1,"./entities":2}],4:[function(e,t,n){!function(i,o){if("object"==typeof t&&"object"==typeof t.exports){var r=o(e,n);void 0!==r&&(t.exports=r)}else"function"==typeof define&&define.amd&&define(i,o)}(["require","exports","./config"],function(e,t){"use strict";function n(e){return{health:e.health-1,sated:!1,gene:e.gene.slice(1)+e.gene.slice(0,1),visible:!0,settings:e.settings}}function i(e,t){const n=e.health+t,i=n>=e.settings.maxHealth;return{health:i?.75*n:n,sated:i,gene:e.gene.slice(1)+e.gene.slice(0,1),visible:!0,settings:e.settings}}function o(e){const t=e.health+1,n=t>=e.settings.maxHealth;return{health:n?.75*t:t,sated:n,gene:"",visible:t>=e.settings.maxHealth/2,settings:e.settings}}function r(e){return{health:0,sated:!1,gene:"",visible:!1,settings:e.settings}}function f(){const e=s(2,c.config.MAXGENESIZE),t=new Array(e).fill("I");return t.reduce(function(e){return e+String.fromCharCode(s(65,74))},"")}function s(e,t){return Math.floor(Math.random()*(t-e))+e}const c=e("./config");t.moveAnimal=n,t.feedAnimal=i,t.growPlant=o,t.eatPlant=r,t.getGeneString=f})},{"./config":1}]},{},[3]);