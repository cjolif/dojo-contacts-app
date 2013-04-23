define.amd.jQuery = true;
define(["jquery", "dojo/when"], function ($, when){
	$(document).bind( "mobileinit", function(){
		// need to disable jQuery Mobile hash support that it clashes with dojox/app own support
        $.mobile.hashListeningEnabled = false;
		// need to disable jQuery Mobile pushState support
        $.mobile.pushStateEnabled = false;
    });

	return {
		init:function (){
			var view = this;
			require(["jquerym"], function (){
				// we need to load jQuery Mobile at init to parse the page
			});
		},
		beforeActivate: function(){
			var view = this;
			require(["jquerym"], function (){
				// we should fill the jQuery Mobile list with that one
				var html = "";
				when(view.loadedStores.contacts.query(), function(contacts){
					var i;
					for(i = 0; i < contacts.length; i++){
						html += '<li id="' + contacts[i].id + '">' + contacts[i].displayName + '</li>';
					}
					$(view.list).append($(html));
					$(view.list).listview("refresh");
				});
			});
		}
	};
});
