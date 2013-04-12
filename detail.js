define(["dojo/has", "dojox/mobile/Button", "dojox/mobile/FormLayout", "dojox/mobile/TextArea"],
	function(has){
	return {
		beforeActivate: function(previousView){
			// we set the back button label to the name of the previous view (taken from its nls)
			this.backButton.set("label", previousView.nls.contacts);
			// we show/hide the back button based on whether we are on tablet or phone layout, as we have two panes
			// in tablet it makes no sense to get a back button
			this.backButton.domNode.style.display = has("phone")?"":"none";
		}
	}
});