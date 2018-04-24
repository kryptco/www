// generic functions
function hasClass(element, clas){
  if (element.className.indexOf(clas) > -1){
    return true
  } else {
    return false
  }
}

function addClass(name, clas){
  var element = document.getElementById(name);
  element.classList.add(clas);
}

function removeClass(name, clas){
  var element = document.getElementById(name);
  element.classList.remove(clas);
}

function toggleClass(name, clas){
  var element = document.getElementById(name);
  element.classList.toggle(clas);
}



// loader elements
function loaderStates() {
  var request, approve, fail, success, bgd;
  request = document.getElementById('request-loader');
  approve = document.getElementById('approve-loader');
  fail = document.getElementById('fail-loader');
  success = document.getElementById('success-loader');
  bgd = document.getElementById('loader-bg');

  if (hasClass(request, 'show')){
    request.classList.remove('show');
    approve.classList.add('show');
  } else if (hasClass(approve, 'show')){
    approve.classList.remove('show');
    fail.classList.add('show');
  } else if (hasClass(fail, 'show')){
    fail.classList.remove('show');
    success.classList.add('show');
  } else if (hasClass(success, 'show')){
    success.classList.remove('show');
    request.classList.add('show');
  } else {
    request.classList.add('show');
    bgd.classList.add('show');
  }
}

function hideLoader() {
  var request, approve, fail, success, bgd;
  request = document.getElementById('request-loader');
  approve = document.getElementById('approve-loader');
  fail = document.getElementById('fail-loader');
  success = document.getElementById('success-loader');
  bgd = document.getElementById('loader-bg');

  request.classList.remove('show');
  approve.classList.remove('show');
  fail.classList.remove('show');
  success.classList.remove('show');
  bgd.classList.remove('show');
}

function startLoader() {
  var request, approve, fail, success, bgd;
  request = document.getElementById('request-loader');
  approve = document.getElementById('approve-loader');
  fail = document.getElementById('fail-loader');
  success = document.getElementById('success-loader');
  bgd = document.getElementById('loader-bg');

  request.classList.remove('show');
  approve.classList.remove('show');
  fail.classList.remove('show');
  success.classList.remove('show');
  bgd.classList.remove('show');

  request.classList.add('show');
  bgd.classList.add('show');
}

function finishLoaderSuccess() {
  var request, approve, fail, success, bgd;
  request = document.getElementById('request-loader');
  approve = document.getElementById('approve-loader');
  fail = document.getElementById('fail-loader');
  success = document.getElementById('success-loader');
  bgd = document.getElementById('loader-bg');

  request.classList.remove('show');
  approve.classList.remove('show');
  fail.classList.remove('show');
  success.classList.remove('show');
  bgd.classList.remove('show');

  success.classList.add('show');
  bgd.classList.add('show');
  setTimeout(hideLoader, 1000);
}



// sidebar functions
function closeSidebar() {
  var bar, overlay;
  bar = document.getElementById('sidebar');
  overlay = document.getElementById('sidebar-overlay');

  bar.classList.remove('open');
  overlay.classList.remove('open');
}

function openSidebar(){
  var bar, overlay;
  bar = document.getElementById('sidebar');
  overlay = document.getElementById('sidebar-overlay');

  bar.classList.add('open');
  overlay.classList.add('open');
}

function showSideTab(opentab){
  var sidebar, tabs, open, menu, tab;
  sidebar = document.getElementById('sidebar');
  tabs = sidebar.getElementsByClassName('tab');
  open = document.getElementById(opentab);
  menu = sidebar.getElementsByTagName('li');
  tab = document.getElementById(opentab + '-title');

  for (var i = 0; i < tabs.length; i++){
    tabs[i].classList.remove('show');
  }
  for (var j = 0; j < tabs.length; j++){
    menu[j].classList.remove('active');
  }
  open.classList.add('show');
  tab.classList.add('active');
}


// testing loading splash
function loadSplash(){
  var page, splash, progress;
  page = document.getElementById('page');
  splash = document.getElementById('loading-page');
  progress = document.getElementById('progress');

  page.classList.toggle('blurry');
  splash.classList.toggle('load');
  progress.classList.toggle('done'); // in reality you would update the progress transformY
}

function startSplashLoading() {
    progress = document.getElementById('progress');
    progress.classList.add('done');
}

function hideSplash() {
    setTimeout(function() {
        splash = document.getElementById('loading-page');
        splash.classList.remove('load');
    }, 100);
}



// testing loading bar
function showLoading(){
  var bar = document.getElementById('loading-bar');
  var load = document.getElementById('loaded');

  bar.style.visibility = 'visible';
  load.style.visibility = 'visible';
  bar.style.animationName = 'fadeIn';
  bar.style.animationDuration = '1s';
  load.style.animationName = 'fadeIn';
  load.style.animationDuration = '1s';

  setTimeout(function() {updateLoading(bar, load)}, 800);
}

var i = 0;

function updateLoading(bar, load){ //should maybe have a timeout
  if (i < 101){
    load.style.width = (i).toString() + '%';
    i += 10;
    setTimeout(updateLoading, 85, bar, load);
  } else {
    setTimeout(function() {closeLoading(bar, load)}, 500);
  }
}

function closeLoading(bar, load){
  bar.style.animationName = 'fadeOut';
  bar.style.animationDuration = '1s';
  load.style.animationName = 'fadeOut';
  load.style.animationDuration = '1s';

  setTimeout(function() {resetLoading(bar, load)}, 1000);
}

function resetLoading(bar, load){
  bar.style.visibility = 'hidden';
  load.style.visibility = 'hidden';
  bar.style.animationName = undefined;
  load.style.animationName = undefined;
  i = 0;
  load.style.width = 0;
  console.log('done')
}

function loadAnimate(){ //showy version
  var bar = document.getElementById('loading-bar');
  var load = document.getElementById('loaded');

  bar.style.animationName = 'loading';
  bar.style.animationDuration = '5s';
  load.style.animationName = 'loaded';
  load.style.animationDuration = '5s';
}



// drawing charts
function drawChart(keys, values, analytic){
  var chart = document.getElementById(analytic + '-chart');
  var line = document.getElementById(analytic + '-line');
  var clip = document.getElementById(analytic + '-clipoly');
  var axis = document.getElementById(analytic + '-axis');
  var nums = values;
  var num_map = [10, 80, 160, 230];
  var max = Math.max.apply(null, nums);
  var months = keys;
  var month_map = [0, 70, 140, 210];

  // clear points
  line.setAttribute('points', '');
  clip.setAttribute('points', '10,110');
  while(axis.lastChild){
    axis.removeChild(axis.lastChild);
  }

  for (var m in months) {
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttributeNS(null, "x", month_map[m]);
    text.setAttributeNS(null, "y", 120);
    text.appendChild(document.createTextNode(months[m]));
    axis.appendChild(text);
  }

  for (var n in nums) {
    var point = chart.createSVGPoint();
    point.x = num_map[n];
    point.y = 105 - (100 / max) * nums[n];
    line.points.appendItem(point);
    clip.points.appendItem(point);
  }
  var endclip = chart.createSVGPoint();
  endclip.x = 230;
  endclip.y = 110;
  clip.points.appendItem(endclip);

  chart.style.animationName = 'loadChart';
  chart.style.animationDuration = '1s';
  setTimeout(function(){chart.style.animationName = ''}, 1200);
}

function initCharts(months, employees, sshs, signs){
  drawChart(months, employees, 'employee');
  drawChart(months, sshs, 'ssh');
  drawChart(months, signs, 'signs');

  setTimeout(function(){
      drawChart(months, [0, 2, 2, 6], 'employee');
    }, 1500) // example update of a chart
}



// settings inputs
function editTeam(){
  var input = document.getElementById('team-input');
  var button = document.getElementById('team-edit');

  if (input.className.indexOf('disabled') > -1){
    input.readOnly = false;
    button.innerHTML = 'Save';
    input.classList.toggle('disabled');
  } else {
    input.readOnly = true;
    button.innerHTML = 'Edit';
    input.classList.toggle('disabled');
  }
}

function editWindow(){
  var hour = document.getElementById('window-hr-input');
  var min = document.getElementById('window-min-input');
  var min_label = document.getElementById('min-label');
  var button = document.getElementById('window-edit');

  if (hour.className.indexOf('disabled') > -1){
    hour.readOnly = false;
    min.readOnly = false;
    button.innerHTML = 'Save';
    min_label.style.display = "inline";
    min.style.display = "inline";
    hour.classList.toggle('disabled');
    min.classList.toggle('disabled');
  } else {
    hour.readOnly = true;
    min.readOnly = true;
    if(hour.value == 0 | hour.value == null){
      hour.value = 0;
    }
    if(min.value == 0 | min.value == null){
      min.value = 0;
      min_label.style.display = "none";
      min.style.display = "none";
    }
    button.innerHTML = 'Edit';
    hour.classList.toggle('disabled');
    min.classList.toggle('disabled');
  }
}



// add new member
function openAddTeam(){
  addClass('team-bg', 'show');
  addClass('team-container', 'show');
  addClass('options', 'show');
}

function closeAddTeam(){
  var box = document.getElementById('option-details');
  var list = document.getElementById('emails');
  var bg = document.getElementById('team-bg');
  var all = ['team-bg', 'team-container', 'options', 'ind-title', 'team-title', 'open-title', 'enter-ind', 'add-link', 'option-details', 'link-load', 'mail-link', 'ind-create'];

  if (bg.className.indexOf('unclosable') <= -1){
    for (var a in all){
      removeClass(all[a], 'show');
    }
    box.style.height = 0;
    removeClass('option-details', 'sandwich');
    while(list.lastChild){
      list.removeChild(list.lastChild);
    }
  }
}

function addInd(){
  var list = document.getElementById('emails');
  var input = document.getElementById('ind-email');
  var item = document.createElement('LI');
  if ((input != '' | input != null) & input.value.indexOf('@') > -1){
    // add to list
    item.innerHTML = input.value.replace(/\s/g, '');;
    list.appendChild(item);

    // increase height
    var box = document.getElementById('option-details');
    var height = box.style.height;
    var int_height = parseInt(height.substring(0, height.indexOf('p')))
    box.style.height = (int_height + 25).toString() + 'px';
    input.value = '';

    createMailto();
  }
}

function getEmails() {
    var el = document.getElementById("emails");
    var emailsArray = new Array();

    for (i = 0; i < el.children.length; i++) {
        emailsArray[i] = el.children[i].innerHTML;
    }

    return emailsArray;
}

function openIndLink(){
  var box = document.getElementById('option-details');
  box.style.height = '100px';
  removeClass('options', 'show');
  addClass('ind-title', 'show');
  addClass('enter-ind', 'show');
  addClass('option-details', 'show');
  addClass('mail-link', 'show');
  addClass('ind-create', 'show');
  addClass('option-details', 'sandwich');
}

function openTeamLink(){
  var box = document.getElementById('option-details');
  removeClass('options', 'show');
  addClass('team-title', 'show');
  addClass('option-details', 'show');
}

function openOpenLink(){
  var box = document.getElementById('option-details');
  removeClass('options', 'show');
  addClass('open-title', 'show');
  addClass('option-details', 'show');
  createLink();
}

function createLink(){
  var box = document.getElementById('option-details');
  var status = document.getElementById('link-load-text');
  status.innerHTML = "Requesting approval from Krypton";
  addClass('team-bg', 'unclosable');
  addClass('link-load', 'show');
  removeClass('enter-ind', 'show');
  setTimeout(function() {status.innerHTML = "Phone approval required"}, 1000);
  box.style.height = '45px';
}

function showLink(){
  var box = document.getElementById('option-details');
  removeClass('team-bg', 'unclosable');
  removeClass('link-load', 'show');
  addClass('add-link', 'show');
  box.style.height = '65px';
}

function createIndLink(){
  var emails = document.getElementById('emails');
  var input = document.getElementById('ind-email');
  if (emails.lastChild){
    removeClass('ind-create', 'show');
    removeClass('option-details', 'sandwich');
    createMailto();
    createLink();
  } else {
    input.style.animationName = 'shake';
    input.style.animationDuration = '.6s';
    addClass('ind-create', 'oops');
    setTimeout(function(){input.style.animationName = ''; removeClass('ind-create', 'oops')}, 1000)
  }
}

function createMailto(){
  var emails = document.getElementById('emails').children;
  var list = [];
  var button = document.getElementById('mail-link');
  var self = `self@krypt.co`;
  var mailto = `mailto:`;
  for (var i = 0; i < emails.length; i++){
    list.push(emails[i].innerHTML);
  }
  mailto += list.join();
  mailto += `?cc=self@krypt.co` + `&subject=Invitation%20to%20Krypton%20Teams%21&body=You%27re%20invited%20to%20join%20Team%20Awesome%20on%20Krypton%20Teams%21%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Step%201.%20Download%3A%20%20https%3A//get.krypt.co%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Step%202.%20Visit%20the%20link%20below%20on%20your%20phone`;
  button.href = mailto;
}
