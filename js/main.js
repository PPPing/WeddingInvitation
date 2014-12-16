var curNavIndex=-1;
var curPage="landing";
var imagelist=[];
var lasthref="";
var lastGalleryType="";
function navHandler(){
	$("#nav li").on("click",function(){
		console.log($(this).index());
		var href=$(this).find("a").data("href");
		if(href){
			var index=$(this).index();
			if(index!=curNavIndex||curPage=="landing"){
				console.log(href);				
				if(curNavIndex>=0){
					$("#nav li").eq(curNavIndex).removeClass("active");
					$("#navbar li").eq(curNavIndex).removeClass("active");
				}
				$(this).addClass("active");
				$("#navbar li").eq(index).addClass("active");
				curNavIndex=index;
				if(curPage!=href){
					$("#container").removeClass(curPage).addClass(href);
					curPage=href;
					loadContent(curPage);
				}
			}
		}
	});
	$("#navbar li").on("click",function(){
		console.log($(this).index());
		var href=$(this).find("a").data("href");
		if(href){
			var index=$(this).index();
			console.log(index+":"+curNavIndex);
			
			console.log(curPage+":"+href);
				
			if(curNavIndex>=0){
				$("#nav li").eq(curNavIndex).removeClass("active");
				$("#navbar li").eq(curNavIndex).removeClass("active");
			}
			$(this).addClass("active");
			$("#nav li").eq(index).addClass("active");
			if(curNavIndex!=index){
				curNavIndex=index;
				$("#container").removeClass(curPage).addClass(href);
				curPage=href;
				loadContent(curPage);
			}
			
		}
	});
	$("#navbar #switch").on("click",function(){
		console.log("switch");
		if(browser_mode=="mobile"&& !$("#container").hasClass("landing")){
			$("#container").removeClass(curPage).addClass("landing");
			loadContent("landing");
			curPage="landing";
		}
	});
	console.log($("#imageViewer #action #back"));
	$("#imageViewer #action #back").on("click",function(){
		viewNextImage(-1);
	});
	$("#imageViewer #action #next").on("click",function(){
		viewNextImage(1);
	});
	$("#imageViewer #window").on("click",function(){
		viewNextImage(1);
	});
	$("#imageViewer #action #gird").on("click",function(){
		$("#container").removeClass(curPage).addClass("gallery");
		curPage="gallery";	
		centerThumPos();
	});
}
function scrollHandler(delta){
	//if()
}
function viewNextImage(offset){
	console.log("ViewNextImage");
	if(curPage!="fullImage"){
		return;
	}
	$("#imageViewer").css("background-image","url('images/icon/loading.gif')");
	var index=$("#imageViewer #window").data("index");
	var type=$("#nav li").eq(curNavIndex).find("a").data("type");
	var nextIndex=new Number(index)+offset;
	if(nextIndex>=($("#thumnails>ul>li").length-1)){
		nextIndex=0;
	}else if(nextIndex<0){
		nextIndex=$("#thumnails>ul>li").length-2;
	}
	console.log("next:"+nextIndex+":"+$("#thumnails>ul>li").eq(nextIndex).data("path"));
	//$("#imageViewer #window").data("index",nextIndex).css("background-image","url(images/"+type+"/"+$("#thumnails>ul>li").eq(nextIndex).data("path")+")");
	$("#imageViewer #window").css("visibility","hidden").data("index",nextIndex)
				.attr("src","images/"+type+"/"+$("#thumnails>ul>li").eq(nextIndex).data("path"))
				.load(function(){
					$(this).css("visibility","visible");
					$("#imageViewer").css("background-image","none");
				});
}

function loadContent( href){
	console.log("loadContent");
	if(href=="landing"){
		jQuery('#content >div').removeClass('show').fadeOut("fast");
	}else{
			if(href=="gallery"&& $("#nav li").eq(curNavIndex).find("a").data("type")==lastGalleryType){
				jQuery('#content >div').addClass('show').fadeIn("fast");
				if(href=="gallery"){
					centerThumPos();
				}
			}else{
				lasthref=href;
				console.log("load:"+href);
				$.ajax({
					url: href+".html",
					context: document.body
				}).done(function(data) {
					jQuery('#content').html(data);
					//console.log(jQuery('#content #'+href));
					window.setTimeout(function(){
					jQuery('#content #'+href).addClass('show');
					},100);
				});
			}
	}
}
//***** Constant *******
var browser_mode="destop";//{"destop","mobile"}
var narbar_pos="top";
var contact_active=false;
//***********************
var winHeight=$(window).height();
var winWidth=$(window).width();

window.onresize = function(event) {
    winHeight=$(window).height();
	winWidth=$(window).width();
	rePosNarbar(narbar_pos);
	detectBrowserMode( winWidth );
};
var containerOffset=0;;
function centerContainer(){
	var conWidth=$("#container").width();
	containerOffset=Math.floor((winWidth-conWidth)/2);
	$("#container").css("left",containerOffset+"px");
}
function detectBrowserMode( winWidth ){
	if(winWidth>=768){
		browser_mode="destop";
		console.log("Destop Mode");
		$("#container").removeClass("mobile").addClass("destop");
		centerContainer();
	}else{
		browser_mode="mobile";
		console.log("Mobile Mode");
		$("#container").removeClass("destop").addClass("mobile");
		if(containerOffset!=0){
			$("#container").css("left","0");
		}
		stopMusic();
	
	}
	
	if(curPage=="gallery"){
		centerThumPos();
	}
}
var musicLoaded=false;
function playMusic(){
	if(!musicLoaded){
		console.log("PlayerMusic");
	$.ajax({
		url:"music.html",
		context: document.body
	}).done(function(data) {
			console.log("Music Loaded!");
			jQuery('body').append(data);
			musicLoaded=true;
	});
	}else{
		initSm2();
	}
	
}
function stopMusic(){
	if(musicLoaded){
	stopSm2();
	}
}
//menu height is 50px fixed
function rePosNarbar(curPos){
	if(curPos==="bottom"){
		$("#menu").css({"top":(winHeight-50),"bottom":"0"});
	}else if(curPos==="top"){
		//console.log(curPos);
		$("#menu").css({"top":"0","bottom":(winHeight-50)});
	}
	narbar_pos=curPos;
}
function toggleMobileMenu(){
	if(browser_mode=="mobile"){
		console.log("toggleMobileMenu");
		if($("#mobile-menu").hasClass("active")){
			$("#mobile-menu").removeClass("active");
			$("#menu").css("left","0");
		}else{
			$("#mobile-menu").addClass("active");
			$("#menu").css("left","100%");
		}
	}
	return true;
}
/* $(".container").ready(function(){
	detectBrowserMode( winWidth );
	navHandler();
	if(browser_mode=="destop"&&!navigator.userAgent.match(/ipad|iphone/i)!=null){
		playMusic();
	}
});  */