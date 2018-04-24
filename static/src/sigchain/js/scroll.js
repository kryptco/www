window.onscroll = function() { scrollWatcher(); }

var doAnimate = true;

// disable scrolling 
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
//  document.onkeydown  = preventDefaultForScrollKeys;
}

// content
var breaks = [
      0.5,  // sig chain
      1.76, // data operation
      2.4,  // data signature
      3.23,  // data hash
      4,    // append
      4.8,  // distribute
      5.6,  // verify
      6.4,  // secure
      7.2   // footer
    ]

function scrollWatcher(){
  var spot = document.body.scrollTop;
  var vh = window.innerHeight;

  /* NOTE: there must be a better way to do this */

  if (spot > breaks[0] * vh){ // sig(nature) chain
    showSigNature();
    showData('reading-progress');
    bookmarkActive('sigchain');
    untopArrow();
  } else {
    hideSigNature();
    hideData('reading-progress');
    topArrow();
  }

  if (spot > breaks[1] * vh){ // data operation
    showData('operation');
    showData('operation_p');
    bookmarkActive('operation');
  } else {
    hideData('operation');
    hideData('operation_p');
  }

  if (spot > breaks[2] * vh){ // data signature
    fadeData('operation');
    hideData('operation_p');
    showData('signature');
    showData('signature_p');
    bookmarkActive('signature');
  } else {
    unfadeData('operation');
    hideData('signature');
    hideData('signature_p');
  }

  if (spot > breaks[3] * vh){ // data hash
    fadeData('signature');
    hideData('signature_p');
    showData('hash');
    showData('hash_p');
    showData('hash_line');
    bookmarkActive('hash');
  } else {
    unfadeData('signature');
    hideData('hash');
    hideData('hash_p');
    hideData('hash_line');
  }

  if (spot > breaks[4] * vh) { // hide data things
    hideData('operation');
    hideData('operation_p');
    hideData('signature');
    hideData('signature_p');
    hideData('hash');
    hideData('hash_p');
    hideData('hash_line');
    hideData('data-title');
    hideChain();
    appendChain();
    showData('append-info');
    bookmarkActive('append');
  } else {
    showData('data-title');
    showChain();
    unappendChain();
    hideData('append-info');
  }

  if (spot > breaks[5] * vh) { // distribute
    hideData('append-info');
    showData('distribute-info');
    showData('distribute_paths');
    showData('distribute_phones');
    bookmarkActive('distribute');
  } else if (spot > breaks[4] * vh) {
    hideData('distribute_paths');
    hideData('distribute_phones');
    hideData('distribute-info');
    showData('append-info');
  } else {
    hideData('distribute_paths');
    hideData('distribute_phones');
    hideData('distribute-info');
  }

  if (spot > breaks[6] * vh) { // verify
    hideData('distribute-info');
    hideData('distribute_paths');
    showData('verify-info');
    showData('verification');
    verifyPhones();
    bookmarkActive('verify');
  } else {
    hideData('verify-info');
    hideData('verification');
    unverifyPhones();
  }

  if (spot > breaks[7] * vh) { // secure
    hideData('verify-info');
    hideData('verification');
    showData('secure-info');
    appendMiniChain();
    bookmarkActive('secure');
  } else {
    hideData('secure-info');
    unappendMiniChain();
  }

  if (spot > breaks[8] * vh) { // footer
    hideData('secure-info');
    unappendMiniChain();
    hideData('distribute_phones');
    endChain();
    bookmarkActive('end');
    endArrow();
  } else {
    unendArrow();
    unendChain();
  }
}


// bookmark scrollspy functions
function bookmarkActive(frame){
  var bookmark = document.getElementById(frame + '_bookmark');
  var all_marks = document.getElementsByClassName('bookmark');

  for (mark of all_marks) {
    if (mark.id == bookmark.id){
      bookmark.classList.add('active');
    } else {
      mark.classList.remove('active');
    }
  }
}

function goToBookmark(frame, callback){
  var vh = window.innerHeight;
  var spot;

  if (frame == 'sigchain'){
    spot = .8;
  } else if (frame == 'operation'){
    spot = breaks[1];
  } else if (frame == 'signature'){
    spot = breaks[2];
  } else if (frame == 'hash'){
    spot = breaks[3];
  } else if (frame == 'append'){
    spot = breaks[4];
  } else if (frame == 'distribute'){
    spot = breaks[5];
  } else if (frame == 'verify'){
    spot = breaks[6];
  } else if (frame == 'secure'){
    spot = breaks[7];
  } else if (frame == 'end'){
    spot = 7.8;
  }

  window.scroll({top: spot*vh + 1, left: 0, behavior: 'smooth'});
  callback();
}


// scroll next
function toNext(pos, callback){
  var vh = window.innerHeight;
  var spot;

  if (pos < .8 * vh) {
    spot = .8;
  } else if (pos < breaks[1] * vh && pos >= .8 * vh) {
    spot = breaks[1];
  } else if (pos < breaks[2] * vh && pos >= breaks[1] * vh) {
    spot = breaks[2];
  } else if (pos < breaks[3] * vh && pos >= breaks[2] * vh) {
    spot = breaks[3];
  } else if (pos < breaks[4] * vh && pos >= breaks[3] * vh) {
    spot = breaks[4];
  } else if (pos < breaks[5] * vh && pos >= breaks[4] * vh) {
    spot = breaks[5];
  } else if (pos < breaks[6] * vh && pos >= breaks[5] * vh) {
    spot = breaks[6];
  } else if (pos < breaks[7] * vh && pos >= breaks[6] * vh) {
    spot = breaks[7];
  } else if (pos < 7.8 * vh && pos >= breaks[7] * vh) {
    spot = 7.8;
  }

  window.scroll({top: spot*vh + 1, left: 0, behavior: 'smooth'});
  callback();
}

function toLast(pos, callback){
  var vh = window.innerHeight;
  var spot;

  if (pos < breaks[1] * vh && pos >= .8 * vh) {
    spot = 0;
  } else if (pos < breaks[2] * vh && pos >= breaks[1] * vh) {
    spot = .8;
  } else if (pos < breaks[3] * vh && pos >= breaks[2] * vh) {
    spot = breaks[1];
  } else if (pos < breaks[4] * vh && pos >= breaks[3] * vh) {
    spot = breaks[2];
  } else if (pos < breaks[5] * vh && pos >= breaks[4] * vh) {
    spot = breaks[3];
  } else if (pos < breaks[6] * vh && pos >= breaks[5] * vh) {
    spot = breaks[4];
  } else if (pos < breaks[7] * vh && pos >= breaks[6] * vh) {
    spot = breaks[5];
  } else if (pos < 7.8 * vh && pos >= breaks[7] * vh) {
    spot = breaks[6];
  } else if (pos >= 7.8){
    spot = breaks[7];
  }

  window.scroll({top: spot*vh + 1, left: 0, behavior: 'smooth'});
  callback();
}


// hijacking the arrow keys ;)
// https://stackoverflow.com/questions/1402698/binding-arrow-keys-in-js-jquery
window.onkeydown = function(e) {
    e = e || window.event;

    switch(e.which || e.keyCode) {
        case 32:
          toNext(document.body.scrollTop, scrollWatcher);
          break;

        case 37: // left
          toLast(document.body.scrollTop, scrollWatcher);
          break;

        case 38: // up
          toLast(document.body.scrollTop, scrollWatcher);
          break;

        case 39: // right
          toNext(document.body.scrollTop, scrollWatcher);
          break;

        case 40: // down
          toNext(document.body.scrollTop, scrollWatcher);
          break;

        default: return;
    }
    e.preventDefault();
};


// frame control functions
function showSigNature(){
  var sigchain = document.getElementById('sigchain');
  var nature = document.getElementById('sig_nature');
  var chain = document.getElementById('sig_chain');
  var para = document.getElementById('sig_p');
  sigchain.classList.add('show');
  nature.classList.add('show');
  chain.classList.add('show');
  para.classList.add('show');
}

function hideSigNature(){
  var sigchain = document.getElementById('sigchain');
  var nature = document.getElementById('sig_nature');
  var chain = document.getElementById('sig_chain');
  var para = document.getElementById('sig_p');
  sigchain.classList.remove('show');
  nature.classList.remove('show');
  chain.classList.remove('show');
  para.classList.remove('show');
}

function showData(el){
  var element = document.getElementById(el);
  element.classList.add('show');
}

function fadeData(el){
  var element = document.getElementById(el);
  element.classList.add('fade');
}

function unfadeData(el){
  var element = document.getElementById(el);
  element.classList.remove('fade');
}

function hideData(el){
  var element = document.getElementById(el);
  element.classList.remove('show');
}

function hideChain(){
  var floating = document.getElementById('floating_block');
  floating.classList.add('hide-chain');
}

function showChain(){
  var floating = document.getElementById('floating_block');
  floating.classList.remove('hide-chain');
}

function appendChain(){
  var block = document.getElementById('block');
  block.classList.add('append');
}

function unappendChain(){
  var block = document.getElementById('block');
  block.classList.remove('append');
}

function verifyPhones(){
  var phones = document.getElementById('distribute_phones');
  phones.classList.add('verify');
}

function unverifyPhones(){
  var phones = document.getElementById('distribute_phones');
  phones.classList.remove('verify');
}

function appendMiniChain(){
  var phones = document.getElementById('distribute_phones');
  phones.classList.add('append');
}

function unappendMiniChain(){
  var phones = document.getElementById('distribute_phones');
  phones.classList.remove('append');
}

function endChain(){
  var floating = document.getElementById('floating_block');
  floating.classList.add('end');
}

function unendChain(){
  var floating = document.getElementById('floating_block');
  floating.classList.remove('end');
}

function endArrow(){
  var read = document.getElementById('reading-progress');
  read.classList.add('end');
}

function unendArrow(){
  var read = document.getElementById('reading-progress');
  read.classList.remove('end');
}

function topArrow(){
  var read = document.getElementById('reading-progress');
  read.classList.add('top');
}

function untopArrow(){
  var read = document.getElementById('reading-progress');
  read.classList.remove('top');
}
