var database;

$(function() {
	// uncomment below to clear database
	//Lawnchair(function() { this.nuke(); });

	Lawnchair(function() {
		this.keys(function(keys) {
			if (keys == '') {
				database = new Lawnchair({table:'database',
										  adaptor:'webkit'},
										  function(){});
				
				database.save({key:'One',
			    			   chapters:[{key:'1', verses:[12]},
			    				  		 {key:'2', verses:[1,2,4]}]},
			    				  		 function(obj){ });
			} else {
				database = Lawnchair('database', function(){});
			}
		});
	});

	
});

$(document).click(function(evt) {
	database.get('One', function(obj) {
		//alert('got:'+ obj.chapters[0].verses);
	});

	database.exists('One', function(exists) {
		//alert('tried:'+ exists);
	});
});