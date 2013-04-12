require(["dojox/app/build/buildControlApp"], function(){
});

var profile = {
	// relative to this file
	basePath: "../..",
	// relative to base path
	releaseDir: "./contactsApp-release",
	action: "release",
	cssOptimize: "comments",
	mini: true,
	packages:[{
		name: "dojo",
		location: "./dojo"
	},{
		name: "dijit",
		location: "./dijit"
	},{
		name: "contactsApp",
		location: "./contactsApp"
	},{
		name: "dojox",
		location: "./dojox"
	}],
	selectorEngine: "acme",
	layers: {
		"dojo/dojo": {
			boot: true,
			customBase: true
		},
		"contactsApp/contacts": {
			include: ["contactsApp/contacts"]
		}
	}
};



