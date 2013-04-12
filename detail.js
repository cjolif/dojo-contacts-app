define(["dojo/_base/array", "dojo/has", "dojo/when", "dojox/mobile/Button", "dojox/mobile/FormLayout", "dojox/mobile/TextArea"],
	function(array, has, when){
	return {
		beforeActivate: function(previousView){
			// we set the back button label to the name of the previous view (taken from its nls)
			this.backButton.set("label", previousView.nls.contacts);
			// we show/hide the back button based on whether we are on tablet or phone layout, as we have two panes
			// in tablet it makes no sense to get a back button
			this.backButton.domNode.style.display = has("phone")?"":"none";
			// let's fill the form with the currently selected contact
			// for that get the id from the params
			var id = this.params.id;
			// if nothing selected skip that part (TODO: empty fields)
			var view = this;
			if(typeof id !== "undefined"){
				id = id.toString();
				// get the contact on the store
				var promise = this.loadedStores.contacts.get(id);
				when(promise, function(contact){
					// set each phone number to corresponding field
					array.forEach(contact.phoneNumbers, function(number){
						view["phone"+number.type].getElementsByTagName("span")[0].innerHTML = number.value;
					});
				});
			}
		}
	}
});