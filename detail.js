define(["dojo/_base/array", "dojo/_base/lang", "dojo/has", "dojo/when", "dojo/query", "dijit/registry", "dojox/mobile/Button",
		"dojox/mobile/FormLayout", "dojox/mobile/TextArea"],
	function(array, lang, has, when, query, registry){
	return {
		beforeActivate: function(previousView){
			// get the id of the displayed contact from the params
			var id = this.params.id;

			// we set the back button label to the name of the previous view (taken from its nls)
			this.backButton.set("label", previousView.nls.contacts);
			// we show/hide the back button based on whether we are on tablet or phone layout, as we have two panes
			// in tablet it makes no sense to get a back button
			this.backButton.domNode.style.display = has("phone")?"":"none";

			// are we in edit mode or not? if we are we need to slightly update the view for that
			var edit = this.params.edit;
			// change widgets readonly value based on that
			query("input").forEach(function(node){
				registry.byNode(node).set("readOnly", !edit);
			});
			// in edit mode change the label and params of the edit button
			this.editButton.set("label", edit?this.nls.ok:this.nls.edit);
			// put a listener to save the form when we are editing if there is no
			if(!this._onHandler){
				this._onHandler = this.editButton.on("click", lang.hitch(this, this._saveForm));
			}else{
				this._onHandler.remove();
				this._onHandler = null;
			}
			var editButtonOptions = this.editButton.transitionOptions;
			editButtonOptions.params.edit = !edit;
			// also update the edit & ok button to reference the currently displayed item
			editButtonOptions.params.id = id;
			var cancelButtonOptions = this.cancelButton.transitionOptions;
			cancelButtonOptions.params.id = id;
			// cancel button must be shown in edit mode only
			this.cancelButton.domNode.style.display = edit?"":"none";
			// if visible back button must be hidden in tablet mode (does not show up in phone anyway)
			if(edit && has("phone")){
				this.backButton.domNode.style.display = "none";
			}

			// let's fill the form with the currently selected contact
			// if nothing selected skip that part (TODO: empty fields)
			var view = this;
			if(typeof id !== "undefined"){
				id = id.toString();
				// get the contact on the store
				var promise = this.loadedStores.contacts.get(id);
				when(promise, function(contact){
					// set each phone number to corresponding field
					array.forEach(contact.phoneNumbers, function(number){
						view["phone"+number.type].set("value",  number.value);
					});
				});
			}
		},
		_saveForm: function(){
			var id = this.params.id;
			// get the contact on the store
			var promise = this.loadedStores.contacts.get(id);
			var view = this;
			when(promise, function(contact){
				// set back the values to the store
				array.forEach(contact.phoneNumbers, function(number){
					number.value = view["phone"+number.type].get("value");
				});
				// save the updated item into the store
				view.loadedStores.contacts.put(contact);
			});
		}
	}
});