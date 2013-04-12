define(["dojo/_base/declare", "dojox/mobile/ListItem", "dojox/mobile/EdgeToEdgeStoreList", "dojox/mobile/FilteredListMixin"],
	function(declare, ListItem){
	var ContactListItem = declare(ListItem, {
		target: "detail",
		clickable: true,
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