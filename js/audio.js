'use strict';
var songId = 2;
var foo = null;
var songList = [];
var currAud = false;
var currId = false;
document.getElementById("file").onchange = function() {
	var fileSrc = document.getElementById("file").value;
	if (fileSrc) {
		getHtmlElement(songId);
		songId++;
		foo = document.getElementById("file").value;
	}
};


var openPlaylist = function () {
	var playlistElements = "";
	songList = [];
	if( currAud ) { 
		if ( !currAud.paused ) {
			$("#playpausebtnList i").toggleClass("mdi-av-play-arrow mdi-av-pause");
		}
		document.getElementById( "progList" ).style.width = "0";
		currAud.pause();
		currAud.currentTime = 0;
		currAud.ontimeupdate = null;
		currAud = false;
		currId = false;
	}
	$("#playlistUl").html( playlistElements );
	for ( var i = 0; i < songId; i++ ) {
		var checkBool = document.getElementById('check'+i).checked;
		if ( checkBool ) {
			songList.push( i );
			var title = document.getElementById("title"+i).innerHTML;
			var playlistElementHtml = `<a href="#" class="collection-item" id="el${i}">${title}</a>`;
			playlistElements += playlistElementHtml;
			$("#playlistUl").html( playlistElements );
		}
	}
}

var getHtmlElement = function (id) {
	
	var fileSrc = document.getElementById("file").value;
	fileSrc = fileSrc.slice(12);
	var fileName = fileSrc;
	fileSrc = "audio/" + fileSrc;
	fileName = fileName.slice(0, -4);
	var html = `<audio id="myTune${id}">
		<source src="${fileSrc}">
	</audio>
	<li>
      <div class="collapsible-header">
		<span id="title${id}">${fileName}</span>
		<input type="checkbox" id="check${id}" />
		<label for="check${id}" style="float:right;  margin-top: 10px;"></label>
	</div>
      <div class="collapsible-body"><div class="container"><br>
	  <div align="center">
	  <a class="btn-floating waves-effect waves-circle waves-light yellow" onclick="window.rev(${id})"><i class="mdi-av-fast-rewind"></i></a>&nbsp;
	  <a class="large btn-floating btn-large waves-effect waves-circle waves-light red tooltipped" data-position="top" data-delay="10" data-tooltip="Click to play/pause" id="playpausebtn${id}" onclick="aud_play_pause${id}()">
  <i class="mdi-av-play-arrow"></i></a>&nbsp;
  <a class="btn-floating waves-effect waves-circle waves-light yellow" onclick="window.forw(${id})"><i class="mdi-av-fast-forward"></i></a>
  </div><br>
  <div class="progress">
      <div id="prog${id}" class="determinate" style="width:0%"></div>
  </div>
  <form action="#">
      <div align="left" class="col s6"><i class="small mdi-av-volume-mute" onclick="mute${id}();changevolume${id}(0)" id="vlm${id}"></i></div>
	  <div align="right" class="col s6"><i class="small mdi-av-volume-down" onclick="loud${id}();changevolume${id}(1)" id="vld${id}"></i></div>
	  <input type="range" id="range${id}" min="0" max="1" step="0.001" onmousemove="changevolume${id}(this.value)"/>
  </form>
    <div class="row">
    <form class="col s12" id="oldvers${id}">
		<div class="row">
			<div class="input-field col s12">
				<textarea id="textarea${id}" class="materialize-textarea" id="vers${id}"></textarea>
				<label for="textarea1">Introduceţi versurile</label>
			</div>
		</div>
	<a class="btn waves-effect waves-light" onclick="ver${id}()">Submit
	<i class="material-icons right">send</i>
	</a>
	</form>
    </div>
    </div><br></div></div>
    </li>`;
	$("#myUl").append(html);
	$('#myUl').collapsible();
	var aud = document.getElementById("myTune"+id);
	var leg = function() {
		var cur = aud.currentTime;
		var dur = aud.duration;
		var tot = cur/dur*100;
		var t = tot.toString()+'%';
		document.getElementById("prog"+id).style.width = t;
		var pbid = "#playpausebtn"+id;
		aud.onended = function () {
		$(pbid + " i").toggleClass("mdi-av-pause mdi-av-play-arrow");
		Materialize.toast('Stop', 1000, 'rounded')
	}
	}
	aud.ontimeupdate = leg;
	$(document)
         .ready(function()
         {
            $(".tooltipped")
               .tooltip(
               {
                  delay: 50
               });
         });
}

//playlist
	
function changeTrack () {
	var vol;
	var lastId = currId;
	if ( currId === false || currId === songList.length - 1 ) {
		if ( currAud ) {
			currAud.ontimeupdate = null;
			vol = currAud.volume;
		}
		vol = 0.5;
		currId = 0;
	} else if ( currId < songList.length - 1 ) {
		currAud.ontimeupdate = null;
		vol = currAud.volume;
		currId++;
	}
	currAud = document.getElementById( "myTune" + songList[ currId ] );
	currAud.ontimeupdate = legList;
	currAud.volume = vol;
	if ( lastId !== false ) {
		currAud.play();
	}
}

function aud_play_pauseList(){
	
	if( currId === false ) {
		changeTrack();
	}
	if ( currAud.paused ) {
		Materialize.toast('Play', 1000, 'rounded');
		currAud.play();
	} else {
		Materialize.toast('Pause', 1000, 'rounded');
		currAud.pause();
	}
	$("#playpausebtnList i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}
function revList() {
	if(currAud.currentTime<=1)
	{
		currAud.currentTime=0;
	}
	else
	{
		currAud.currentTime--;
	}
}
function forList() {
	if(currAud.currentTime>=currAud.duration-1)
	{
		currAud.currentTime=currAud.duration;
	}
	else
	{
		currAud.currentTime++;
	}
}
function legList() {
    var cur = currAud.currentTime;
	var dur = currAud.duration;
	var tot = cur / dur * 100;
	var t = tot + '%';
    document.getElementById( "progList" ).style.width = t;
	currAud.onended = function () {
		changeTrack();
		Materialize.toast( 'Next Track', 1000, 'rounded' )
	}
}

function changevolumeList( amount ) {
    currAud.volume = amount;
}

function muteList(){
	document.getElementById("rangeList").value = "0";
	currAud.volume = 0;
}

function loudList(){
	document.getElementById("rangeList").value = "1";
	currAud.volume = 1;
}

// rest


function aud_play_pause0(){

  var myAudio0 = document.getElementById("myTune0");
  if ( myAudio0.paused ) {
	  Materialize.toast('Play', 1000, 'rounded')
    myAudio0.play();
  } else {
	  Materialize.toast('Pause', 1000, 'rounded')
    myAudio0.pause();
  }
  $("#playpausebtn0 i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}
var aud0 = document.getElementById("myTune0");
aud0.ontimeupdate = function() {
	leg0();
}
function rev0() {
	if(aud0.currentTime<=1)
	{
		aud0.currentTime=0;
	}
	else
	{
		aud0.currentTime--;
	}
}
function for0() {
	if(aud0.currentTime>=aud0.duration-1)
	{
		aud0.currentTime=aud0.duration;
	}
	else
	{
		aud0.currentTime++;
	}
}
function leg0() {
    var cur0 = aud0.currentTime;
	var dur0 = aud0.duration;
	var tot0 = cur0/dur0*100;
	var t0 = tot0.toString()+'%';
    document.getElementById("prog0").style.width = t0;
	aud0.onended = function () {
		$("#playpausebtn0 i").toggleClass("mdi-av-pause mdi-av-play-arrow");
		Materialize.toast('Stop', 1000, 'rounded')
	}
}

function changevolume0(amount) {
    var audioobject0 = document.getElementsByTagName("audio")[0];
    audioobject0.volume = amount;
}

function mute0(){
	document.getElementById("range0").value = "0";
	volume = "0";
}

function loud0(){
document.getElementById("range0").value = "1";
volume = "1";
}

function aud_play_pause1(){

  var myAudio1 = document.getElementById("myTune1");
  if ( myAudio1.paused ) {
	  Materialize.toast('Play', 1000, 'rounded')
    myAudio1.play();
  } else {
    myAudio1.pause();
	  Materialize.toast('Pause', 1000, 'rounded')
  } 
  $("#playpausebtn1 i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}
var aud1 = document.getElementById("myTune1");
aud1.ontimeupdate = function() {
	leg1();
};

function leg1() {
    var cur1 = aud1.currentTime;
	var dur1 = aud1.duration;
	var tot1 = cur1/dur1*100;
	var t1 = tot1.toString()+'%';
    document.getElementById("prog1").style.width = t1;
	aud1.onended = function () {
		$("#playpausebtn1 i").toggleClass("mdi-av-pause mdi-av-play-arrow");
		Materialize.toast('Stop', 1000, 'rounded')
	}
}
function changevolume1(amount) {
    var audioobject1 = document.getElementsByTagName("audio")[1];
    audioobject1.volume = amount;
}

function mute1(){
document.getElementById("range1").value = "0";
}

function loud1(){
document.getElementById("range1").value = "1";
}
function rev1() {
	if(aud1.currentTime<=1)
	{
		aud1.currentTime=0;
	}
	else
	{
		aud1.currentTime--;
	}
}
function for1() {
	if(aud1.currentTime>=aud0.duration-1)
	{
		aud1.currentTime=aud0.duration;
	}
	else
	{
		aud1.currentTime++;
	}
}
function aud_play_pause2(){

  var myAudio2 = document.getElementById("myTune2");
  if ( myAudio2.paused ) {
	  Materialize.toast('Play', 1000, 'rounded')
    myAudio2.play();
  } else {
    myAudio2.pause();
	Materialize.toast('Pause', 1000, 'rounded')
  }
  $("#playpausebtn2 i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}

function changevolume2(amount) {
    var audioobject2 = document.getElementsByTagName("audio")[2];
    audioobject2.volume = amount;
}

function mute2(){
document.getElementById("range2").value = "0";
}

function loud2(){
document.getElementById("range2").value = "1";
}
window.rev = function(nr) {
	var aud = document.getElementById("myTune"+nr);
	if(aud.currentTime<=1)
	{
		aud.currentTime=0;
	}
	else
	{
		aud.currentTime--;
	}
}
window.forw = function(nr) {
	var aud = document.getElementById("myTune"+nr);
	if(aud.currentTime>=aud.duration-1)
	{
		aud.currentTime=aud.duration;
	}
	else
	{
		aud.currentTime++;
	}
}
function aud_play_pause3(){

  var myAudio3 = document.getElementById("myTune3");
  if ( myAudio3.paused ) {
	Materialize.toast('Play', 1000, 'rounded')
    myAudio3.play();
  } else {
    myAudio3.pause();
	Materialize.toast('Pause', 1000, 'rounded')
  }
  $("#playpausebtn3 i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}


function changevolume3(amount) {
    var audioobject3 = document.getElementsByTagName("audio")[3];
    audioobject3.volume = amount;
}

function mute3(){
document.getElementById("range3").value = "0";
}

function loud3(){
document.getElementById("range3").value = "1";
}

function aud_play_pause4(){

  var myAudio4 = document.getElementById("myTune4");
  if ( myAudio4.paused ) {
	  Materialize.toast('Play', 1000, 'rounded')
    myAudio4.play();
  } else {
    myAudio4.pause();
	Materialize.toast('Pause', 1000, 'rounded')
  }
  $("#playpausebtn4 i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}

function changevolume4(amount) {
    var audioobject4 = document.getElementsByTagName("audio")[4];
    audioobject4.volume = amount;
}

function mute4(){
document.getElementById("range4").value = "0";
}

function loud4(){
document.getElementById("range4").value = "1";
}

function aud_play_pause5(){

  var myAudio5 = document.getElementById("myTune5");
  if ( myAudio5.paused ) {
	  Materialize.toast('Play', 1000, 'rounded')
    myAudio5.play();
  } else {
    myAudio5.pause();
	Materialize.toast('Pause', 1000, 'rounded')
  }
  $("#playpausebtn5 i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}

function changevolume5(amount) {
    var audioobject5 = document.getElementsByTagName("audio")[5];
    audioobject5.volume = amount;
}

function mute5(){
document.getElementById("range5").value = "0";
}

function loud5(){
document.getElementById("range5").value = "1";
}

function aud_play_pause6(){

  var myAudio6 = document.getElementById("myTune6");
  if ( myAudio6.paused ) {
	  Materialize.toast('Play', 1000, 'rounded')
    myAudio6.play();
  } else {
    myAudio6.pause();
	  Materialize.toast('Pause', 1000, 'rounded')
  }
  $("#playpausebtn6 i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}
function changevolume6(amount) {
    var audioobject6 = document.getElementsByTagName("audio")[6];
    audioobject6.volume = amount;
}

function mute6(){
document.getElementById("range6").value = "0";
}

function loud6(){
document.getElementById("range6").value = "1";
}

function aud_play_pause7(){

  var myAudio7 = document.getElementById("myTune7");
  if ( myAudio7.paused ) {
	  Materialize.toast('Play', 1000, 'rounded')
    myAudio7.play();
  } else {
    myAudio7.pause();
	Materialize.toast('Pause', 1000, 'rounded')
  }
  $("#playpausebtn7 i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}
function changevolume7(amount) {
    var audioobject7 = document.getElementsByTagName("audio")[7];
    audioobject7.volume = amount;
}

function mute7(){
document.getElementById("range7").value = "0";
}

function loud7(){
document.getElementById("range7").value = "1";
}

function aud_play_pause8(){

  var myAudio8 = document.getElementById("myTune8");
  if ( myAudio8.paused ) {
	  Materialize.toast('Play', 1000, 'rounded')
    myAudio8.play();
  } else {
    myAudio8.pause();
	Materialize.toast('Pause', 1000, 'rounded')
  }
  $("#playpausebtn8 i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}

function changevolume8(amount) {
    var audioobject8 = document.getElementsByTagName("audio")[8];
    audioobject8.volume = amount;
}

function mute8(){
document.getElementById("range8").value = "0";
}

function loud8(){
document.getElementById("range8").value = "1";
}

function aud_play_pause(id){

  var myAudio = document.getElementById("myTune" + id);
  if ( myAudio.paused ) {
	  Materialize.toast('Play', 1000, 'rounded')
    myAudio.play();
  } else {
    myAudio.pause();
	  Materialize.toast('Pause', 1000, 'rounded')
  }
  $("#playpausebtn9 i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}

function aud_play_pause9(){

  var myAudio9 = document.getElementById("myTune9");
  if ( myAudio9.paused ) {
	  Materialize.toast('Play', 1000, 'rounded')
    myAudio9.play();
  } else {
    myAudio9.pause();
	  Materialize.toast('Pause', 1000, 'rounded')
  }
  $("#playpausebtn9 i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}

function changevolume9(amount) {
    var audioobject9 = document.getElementsByTagName("audio")[9];
    audioobject9.volume = amount;
}

function mute9(){
document.getElementById("range9").value = "0";
}

function loud9(){
document.getElementById("range9").value = "1";
}

function aud_play_pause10(){

  var myAudio10 = document.getElementById("myTune10");
  if ( myAudio10.paused ) {
	  Materialize.toast('Play', 1000, 'rounded')
    myAudio10.play();
	  
  } else {
    myAudio10.pause();
	Materialize.toast('Pause', 1000, 'rounded')
  }
  $("#playpausebtn10 i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}

function changevolume10(amount) {
    var audioobject10 = document.getElementById("myTune10");
    audioobject10.volume = amount;
}

function mute10(){
document.getElementById("range10").value = "0";
}

function loud10(){
document.getElementById("range10").value = "1";
}

function aud_play_pause11(){

  var myAudio11 = document.getElementById("myTune11");
  if ( myAudio11.paused ) {
	  Materialize.toast('Play', 1000, 'rounded')
    myAudio11.play();
  } else {
    myAudio11.pause();
	  Materialize.toast('Pause', 1000, 'rounded')
  }
  $("#playpausebtn11 i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}

function changevolume11(amount) {
    var audioobject11 = document.getElementsByTagName("audio")[11];
    audioobject11.volume = amount;
}

function mute11(){
document.getElementById("range11").value = "0";
}

function loud11(){
document.getElementById("range11").value = "1";
}

function aud_play_pause12(){

  var myAudio12 = document.getElementById("myTune12");
  if ( myAudio12.paused ) {
	  Materialize.toast('Play', 1000, 'rounded')
    myAudio12.play();
  } else {
    myAudio12.pause();
	  Materialize.toast('Pause', 1000, 'rounded')
  }
  $("#playpausebtn12 i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}

function changevolume12(amount) {
    var audioobject12 = document.getElementsByTagName("audio")[12];
    audioobject12.volume = amount;
}

function mute12(){
document.getElementById("range12").value = "0";
}

function loud12(){
document.getElementById("range12").value = "1";
}

function aud_play_pause13(){

  var myAudio13 = document.getElementById("myTune13");
  if ( myAudio13.paused ) {
	  Materialize.toast('Play', 1000, 'rounded')
    myAudio13.play();
  } else {
    myAudio13.pause();
	  Materialize.toast('Pause', 1000, 'rounded')
  }
  $("#playpausebtn13 i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}

function changevolume13(amount) {
    var audioobject13 = document.getElementsByTagName("audio")[13];
    audioobject13.volume = amount;
}

function mute13(){
document.getElementById("range13").value = "0";
}

function loud13(){
document.getElementById("range13").value = "1";
}

function aud_play_pause14(){

  var myAudio14 = document.getElementById("myTune14");
  if ( myAudio14.paused ) {
	  Materialize.toast('Play', 1000, 'rounded')
    myAudio14.play();
  } else {
    myAudio14.pause();
	  Materialize.toast('Pause', 1000, 'rounded')
  }
  $("#playpausebtn14 i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}

function changevolume14(amount) {
    var audioobject14 = document.getElementsByTagName("audio")[14];
    audioobject14.volume = amount;
}

function mute14(){
document.getElementById("range14").value = "0";
}

function loud14(){
document.getElementById("range14").value = "1";
}

function aud_play_pause15(){

  var myAudio15 = document.getElementById("myTune15");
  if ( myAudio15.paused ) {
	  Materialize.toast('Play', 1000, 'rounded')
    myAudio15.play();
  } else {
    myAudio15.pause();
	  Materialize.toast('Pause', 1000, 'rounded')
  }
  $("#playpausebtn15 i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}

function changevolume15(amount) {
    var audioobject15 = document.getElementsByTagName("audio")[15];
    audioobject15.volume = amount;
}

function mute15(){
document.getElementById("range15").value = "0";
}

function loud15(){
document.getElementById("range15").value = "1";
}

function aud_play_pause16(){

  var myAudio16 = document.getElementById("myTune16");
  if ( myAudio16.paused ) {
	  Materialize.toast('Play', 1000, 'rounded')
    myAudio16.play();
  } else {
    myAudio16.pause();
	  Materialize.toast('Pause', 1000, 'rounded')
  }
  $("#playpausebtn16 i").toggleClass("mdi-av-play-arrow mdi-av-pause");
}

function changevolume16(amount) {
    var audioobject16 = document.getElementsByTagName("audio")[16];
    audioobject16.volume = amount;
}

function mute16(){
document.getElementById("range16").value = "0";
}

function loud16(){
document.getElementById("range16").value = "1";
}
