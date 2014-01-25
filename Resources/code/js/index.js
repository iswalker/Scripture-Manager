var numTabs = 0;
var $tabs;

$(function() {
	var $head = $('body');
	$head.html($head.html() + '');

	var tabText = new Array();

	// initialize properties of each tab
	var $tab;
	$('#tabs li').each(function(index) {
		$tab = $(this);
		tabText[numTabs] = $tab.html()
		$tab.html('<a>'+ tabText[index] +'</a>')
			.attr('id', 'tab-'+ index);
		numTabs += 1;
	});
	$tabs = $('#tabs a');
	$tabs.each(function(index) {
		$(this).attr('href','#tabContent-'+ index)
			   .attr('class','centered');
		$(document.createElement('div'))
		    	.attr('id', 'tabContent-'+ index)
		    	.appendTo('#tabs');
	});

	// initialize formatting of each tab
    $('#tabs').tabs(); // jQuery does its magic here
    detectOrientation();

    // initialize content of each tab
    // file name corresponds to tab name
    $('#tabs div').each(function(index) {
    	$(this).load('code/html/'+ tabText[index].toLowerCase() +'.html');
    });
});


var portraitTabWidth = 0;
var landscapeTabWidth = 0;
var lastPortraitWidth = 0;
var lastLandscapeWidth = 0;

function resizeTabs(orientation) {
	var tabYcoords = new Array();
	var tabIncrement = 1;
	var tabWidth = 0;

	do {
		tabWidth += tabIncrement;
		$tabs.attr('style','width:'+ tabWidth +'px;');

		$tabs.each(function(index) {
			tabYcoords[index] = document.getElementById('tab-'+ index)
										.getBoundingClientRect().top;
		});
	} while (tabYcoords[0] == tabYcoords[numTabs-1]);
	
	// go back a step since we filled up the page (two steps for safety)
	tabWidth -= tabIncrement*2;
	$tabs.attr('style','width:'+ tabWidth +'px;');

	if (orientation == 'portrait') {
		portraitTabWidth = tabWidth;
	} else {
		landscapeTabWidth = tabWidth;
	}
}

function detectOrientation() {
	var $window = $(window);
	var windowWidth = $window.width();
	var windowHeight = $window.height();
	
	if (windowWidth < windowHeight) { // we're in portrait layout
		// either we haven't initialized the tabs or their portrait view mode changed
		console.log('lastPortrait='+lastPortraitWidth+' & windowWidth='+windowWidth);
		if ((portraitTabWidth == 0) || (lastPortraitWidth != windowWidth)) {
			console.log('RESIZING');
			resizeTabs('portrait');
		}

		lastPortraitWidth = windowWidth;
	} else { // it's in landscape

		console.log('lastLandscape='+lastLandscapeWidth+' & windowWidth='+windowWidth);
		// either we haven't initialized the tabas or their landscape view mode changed
		if ((landscapeTabWidth == 0) || (lastLandscapeWidth != windowWidth)) {
			console.log('RESIZING');
			resizeTabs('landscape');
		}

		lastLandscapeWidth = windowWidth;
	}
}


$(document).click(function() {
	setTimeout(function(){
		detectOrientation();
	}, 450); // debouncing
});

$(window).resize(function() {
	detectOrientation();
});