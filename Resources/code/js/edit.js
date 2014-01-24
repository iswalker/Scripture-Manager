/* making the list of references
$('#edit-references-form').submit(function(e) {
    if (length($('#references-list')) < length(database references)) {
	    $(document.createElement('li'))
	    		.attr('class', 'invisible')
	    		.html('stuff from database')
	    		.appendTo('#references-list');
    }
	$('references-list').showViaUI();
});
*/

/*
setTimeout(function() {
	$header.click();
}, 1000);
*/

/*
$(document).click(function() {
	$('#li1').toggle('drop', {direction: 'down'});
	$('#li2').delay(300).toggle('drop', {direction: 'down'});
	$('#li3').delay(300).toggle('drop', {direction: 'down'});
});
*/

$('#references-body').accordion({
	heightStyle: 'content',
	collapsible: true
});
$('#references-body h4').click();
