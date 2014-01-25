var numTabs = 0;
var $tabs;

$(function() {
	var tabText = new Array();

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		alert("hey");
	}

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

    
    // formatting for edit tab
    $('#references-body').accordion({
		heightStyle: 'content',
		collapsible: true
	});
	$('#references-body h4').click();
	
	// formatting for stats tab


	// formatting for search tab
	$('#search-list').accordion({
		heightStyle: "content"
	});


});


var portraitTabWidth = 0;
var landscapeTabWidth = 0;

function resizeTabs(tabWidth) {
	$tabs.attr('style','width:'+ tabWidth +'px;');
}

function calculateTabWidth(orientation) {
	var tabYcoords = new Array();
	var tabIncrement = 1;
	var tabWidth = 0;


	do {
		$tabs.each(function(index) {
			tabYcoords[index] = document.getElementById('tab-'+ index)
										.getBoundingClientRect().top;
		});

		tabWidth += tabIncrement;
		$tabs.attr('style','width:'+ tabWidth +'px;');
	} while (tabYcoords[numTabs-2] == tabYcoords[numTabs-1]);
	
	// go back a step since we filled up the page (two steps for safety)
	tabWidth -= tabIncrement*2;

	if (orientation == 'portrait') {
		portraitTabWidth = tabWidth;
	} else {
		landscapeTabWidth = tabWidth;
	}
}

function detectOrientation() {
	var $window = $(window);
	
	if ($window.width() < $window.height()) {
		if (portraitTabWidth == 0) {
			calculateTabWidth('portrait');
		}
		resizeTabs(portraitTabWidth);
	} else {
		if (landscapeTabWidth == 0) {
			calculateTabWidth('landscape');
		}
		resizeTabs(landscapeTabWidth);
	}
}


$(window).resize(function() {
	detectOrientation();
});