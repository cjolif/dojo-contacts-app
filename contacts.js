require(["dojox/app/main", "dojo/sniff", "dojo/json", "dojo/text!./contacts.json", "dojox/mobile/common"],
	function(Application, has, json, config, common){
		// populate has flag on whether html5 history is correctly supported or not
		has.add("html5history", !has("ie") || has("ie") > 9);
		has.add("phone", ((window.innerWidth || document.documentElement.clientWidth) <= common.tabletSize));
		Application(json.parse(config));
});