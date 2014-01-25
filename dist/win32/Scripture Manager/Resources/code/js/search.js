/* we want to load in all current references on program launch
get references from database and make h4 for each unique book
add li for each note in book: "17 [block]: note"
on editing or adding a new note, refresh just that one note (not all of them)
*/

/*
$('#see-all').click(function(e) {
	$('#search-list').show()
});
*/

$('#search-list').accordion({
	heightStyle: "content"
});