'use strict'

// import WarpJS
import { defaultWarper as warper } from '@warpjs/warp'
import engine from '@warpjs/engine'

// init WarpJS
engine.init()

//
// Backend functions
//
function processGitHub(data) {
  'warp +server -client'

  // raw
  // let dep = {};
  let reg = {};
  let fra = {};
  let com = {};
  let world = {};

  // processed
  // let pdep = {};
  let preg = {};
  let pfra = {};
  let pworld = {};

  for (let ii = 0; ii < data.length; ii++) {
    let d = data[ii];
    if (d.code.indexOf('DEP') !== -1) {
      // if (dep[d.code] === undefined) {
      //   dep[d.code] = [];
      // }
      // dep[d.code].push(d);
      continue;
    }
    if (d.code.indexOf('REG') !== -1) {
      if (reg[d.code] === undefined) {
        reg[d.code] = [];
      }
      reg[d.code].push(d);
      continue;
    }
    if (d.code.indexOf('COM') !== -1) {
      if (com[d.code] === undefined) {
        com[d.code] = [];
      }
      com[d.code].push(d);
      continue;
    }
    if (d.code.indexOf('FRA') !== -1) {
      if (fra[d.code] === undefined) {
        fra[d.code] = [];
      }
      fra[d.code].push(d);
      continue;
    }
    if (d.code.indexOf('WORLD') !== -1) {
      if (world[d.code] === undefined) {
        world[d.code] = [];
      }
      world[d.code].push(d);
      continue;
    }
    console.log("ERROR - Splitting", d);
  }

  let k;

  // k = Object.keys(dep);
  // if (k.length > 96) console.log("WARNING - dep too big", k.length);

  k = Object.keys(reg);
  if (k.length > 18) console.log("WARNING - reg too big", k.length);

  k = Object.keys(com);
  if (k.length > 2) console.log("WARNING - com too big", k.length);

  k = Object.keys(fra);
  if (k.length > 1) console.log("WARNING - fra too big", k.length);

  k = Object.keys(world);
  if (k.length > 1) console.log("WARNING - world too big", k.length);

  function process(one) {
    let r = {
      nom: one[one.length - 1].nom,
      stats: []
    }
    for (let ii = 0; ii < one.length; ii++) {
      let o = one[ii];
      r.stats.push({
        date: o.date,
        confirmes: o.casConfirmes,
        deces: o.deces
      })
    }
    return r;
  }

  let t;
  k = Object.keys(world);
  for (let ii = 0; ii < k.length; ii++) {
    t = process(world[k[ii]]);
    pworld[t.nom] = t;
  }

  k = Object.keys(fra);
  for (let ii = 0; ii < k.length; ii++) {
    t = process(fra[k[ii]]);
    pfra[t.nom] = t
  }

  // k = Object.keys(dep);
  // for (let ii = 0; ii < k.length; ii++) {
  //   t = process(dep[k[ii]])
  //   pdep[t.nom] = t
  // }

  k = Object.keys(reg);
  for (let ii = 0; ii < k.length; ii++) {
    t = process(reg[k[ii]])
    preg[t.nom] = t
  }

  k = Object.keys(com);
  for (let ii = 0; ii < k.length; ii++) {
    t = process(com[k[ii]])
    preg[t.nom] = t
  }

  return ({
    reg: preg,
    // dep: pdep,
    fra: pfra,
    world: pworld
  });
}

const getCoronavirusData = async () => {
  'warp +server -client'
  const axios = require('axios')
  const { data } = await axios.get('https://raw.githubusercontent.com/opencovid19-fr/data/master/dist/chiffres-cles.json');
  return processGitHub(data);
}

//
// Frontend
//
let data;
const start = async () => {
  data = await warper.call(getCoronavirusData);
  await regDump();
}

function dumpOne(type, key, one) {
  let last = one.stats[one.stats.length - 1];
  let before = one.stats[one.stats.length - 2];
  if (last.confirmes === undefined) return '';
  let h = '';
  h += '<tr onclick=\'cellClickHandler(\"' + type + '\",\"' + key + '\")\'>';
  h += '<td style="font-size:large;">' + one.nom + '</td>';
  h += '<td style="text-align:right">';
  if (last.confirmes === undefined) {
    h += '---';
  } else {
    h += '<b style="font-size:x-large;color:red">' + last.confirmes + '</b>';
    if (one.stats.length > 1) {
      h += ' <br>('
      let diff = last.confirmes - before.confirmes;
      if (diff >= 0) {
        h += '+'
      }
      h += diff;
      h += ')'
    }
  }
  h += '</td > ';
  h += '</tr>';
  return h;
}

const regDump = async () => {
  appUpdateReg.classList.add("active");
  // appUpdateDep.classList.remove("active");
  appUpdateFra.classList.remove("active");
  //$('#etatTitle').html('Région');
  $('#etat').html('');
  $('#myspinner').show();
  let h = "";
  let k = Object.keys(data.reg)
    .sort(function order(key1, key2) {
      if (key1 < key2) return -1;
      else if (key1 > key2) return +1;
      else return 0;
    });
  for (let ii = 0; ii < k.length; ii++) {
    h += dumpOne('reg', k[ii], data.reg[k[ii]])
  }
  $('#etat').html(h);
  $('#myspinner').hide();
}

// const depDump = async () => {
//   appUpdateReg.classList.remove("active");
//   appUpdateDep.classList.add("active");
//   appUpdateFra.classList.remove("active");

//   $('#etat').html('');
//   $('#myspinner').show();
//   let h = "";
//   let k = Object.keys(data.dep)
//     .sort(function order(key1, key2) {
//       if (key1 < key2) return -1;
//       else if (key1 > key2) return +1;
//       else return 0;
//     });
//   for (let ii = 0; ii < k.length; ii++) {
//     h += dumpOne('dep', k[ii], data.dep[k[ii]])
//   }
//   $('#etat').html(h);
//   $('#myspinner').hide();
// }

const fraDump = async () => {
  appUpdateReg.classList.remove("active");
  // appUpdateDep.classList.remove("active");
  appUpdateFra.classList.add("active");

  $('#etat').html('');
  $('#myspinner').show();
  let h = "";
  let k = Object.keys(data.fra);
  for (let ii = 0; ii < k.length; ii++) {
    h += dumpOne('fra', k[ii], data.fra[k[ii]])
  }
  k = Object.keys(data.world);
  for (let ii = 0; ii < k.length; ii++) {
    h += dumpOne('world', k[ii], data.world[k[ii]])
  }

  $('#etat').html(h);
  $('#myspinner').hide();
}

const appUpdateReg = document.getElementById('appUpdateReg')
// const appUpdateDep = document.getElementById('appUpdateDep')
const appUpdateFra = document.getElementById('appUpdateFra')

appUpdateReg.onclick = function () {
  regDump();
};
// appUpdateDep.onclick = function () {
//   depDump();
// };
appUpdateFra.onclick = function () {
  fraDump();
};

appWelcome.onclick = function () {
  $('#WELCOME').hide();
  $('#RESULTS').show();
}
const appDetailsBack = document.getElementById('appDetailsBack')
appDetailsBack.onclick = function () {
  $('#DETAILS').hide();
  $('#RESULTS').show();
  window.scrollTo(0, scrollTopPosition);
}

let scrollTopPosition;
function cellClickHandler(type, key) {
  $('#RESULTS').hide();
  $('#DETAILS').show();
  scrollTopPosition = window.scrollY;
  window.scrollTo(0, 0);

  let x;
  let detailText;
  if (type === "reg") {
    x = data.reg[key];
    detailText = x.nom;
  }
  // if (type === "dep") {
  //   x = data.dep[key]
  //   detailText = x.nom;
  // }
  if (type === "fra") {
    x = data.fra[key]
    detailText = 'France';
  }
  if (type === "world") {
    x = data.world[key]
    detailText = 'Monde';
  }

  $('#detailsTitle').html(detailText);

  let showC = false;
  let hDataC = '<table class="table" style="width:100%">';
  hDataC += '<head><tr>';
  hDataC += '<th style="text-align:center;width:40%">Date</th>';
  hDataC += '<th style="text-align:center;">Cas</th>';
  hDataC += '<th style="text-align:center;">Variation</th>';
  hDataC += '</tr></head><tbody>';
  for (let ii = x.stats.length - 1; ii >= 0; ii--) {
    showC = true;
    hDataC += '<tr>';
    hDataC += '<td style="text-align:center;">' + x.stats[ii].date + '</td>';
    hDataC += '<td style="text-align:center;"><b>' + x.stats[ii].confirmes + '</b></td>';
    if (ii > 0) {
      let diff = x.stats[ii].confirmes - x.stats[ii - 1].confirmes;
      let color = 'green'
      if (diff > 0) {
        diff = '+ ' + diff;
        color = 'red'
      } else {
        if (diff < 0) {
          diff = '- ' + Math.abs(diff);
        } else
          diff = '  ' + diff;
      }
      hDataC += '<td style="text-align:center;color:' + color + '"><b>' + diff + '</b></td>';
    }
    else
      hDataC += '<td></td>';
    hDataC += '</tr>'
  }
  hDataC += '</tbody></table>'
  if (showC)
    $('#detailsConfirmes').html(hDataC);
  else
    $('#detailsConfirmes').html('');
}

window.cellClickHandler = cellClickHandler;

// Launch
start();
$('#WELCOME').show()
