// we use define and not require to workaround Dojo build system limitation that prevents from making of this file
// a layer if it using require as it should be not define
define(["dojox/app/main", "dojo/sniff", "dojo/json", "dojo/text!./contacts.json", "dojox/mobile/common"],
	function(Application, has, json, config, common){
		// populate has flag on whether html5 history is correctly supported or not
		has.add("html5history", !has("ie") || has("ie") > 9);
		has.add("phone", ((window.innerWidth || document.documentElement.clientWidth) <= common.tabletSize));
		Application(json.parse(config));
});