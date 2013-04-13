define(["dojo/_base/declare", "dojo/has", "dojox/mobile/ListItem", "dojox/mobile/EdgeToEdgeStoreList", "dojox/mobile/FilteredListMixin"],
	function(declare, has, ListItem){
	var ContactListItem = declare(ListItem, {
		target: "detail",
		clickable: true,
		// we don't get an arrow if we are on a two panes layout (tablet)
		noArrow: !has("phone"),
		buildRendering: function(){
			this.inherited(arguments);
			this.transitionOptions = {
				params: {
					"id" : this.id
				}
			}
		}
	});

	return {
		ContactListItem: ContactListItem
	};
});