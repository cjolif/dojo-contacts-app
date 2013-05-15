define(["dojo/_base/array", "dojo/_base/lang", "dojo/has", "dojo/when", "dojo/Deferred", "dojo/query", "dojo/dom-class",
	"dijit/registry", "dojox/mobile/Button", "dojox/mobile/FormLayout", "dojox/mobile/TextArea"],
	function(array, lang, has, when, Deferred, query, domClass, registry){

	var DATA_MAPPING = {
		"phonehome": "phoneNumbers.home",
		"phonework": "phoneNumbers.work",
		"mailhome": "emails.home",
		"mailwork": "emails.work"
	};

	var getStoreField = function(arr, type){
		var index = array.indexOf(arr, function(item){
			return (item.type == type);
		});
		if(index == -1){
			// create one
			arr.push({
				type: type
			});
			index = arr.length - 1;
		}
		return arr[index];
	};

	return {
		beforeActivate: function(){
			// in case we are still under saving previous modifications, let's wait for
			// the operation to be completed as use resulting contact as input
			var view = this;
			when(view._savePromise, function(contact){
				view._savePromise = null;
				view._beforeActivate(contact);
			});
		},
		_beforeActivate: function(contact){
			// get the id of the displayed contact from the params if we don't have a contact
			// or from the contact if we have one
			if(contact){
				this.params.id = contact.id;
			}
			var id = this.params.id;

			// are we in edit mode or not? if we are we need to slightly update the view for that
			var edit = this.params.edit;
			// are we in create mode
			var create = (typeof id === "undefined");
			// change widgets readonly value based on that
			query("input", this.domNode).forEach(function(node){
				registry.byNode(node).set("readOnly", !edit);
			});
			// in edit mode change the label and params of the edit button
			this.editButton.set("label", edit?this.nls.ok:this.nls.edit);
			// put a listener to save the form when we are editing if there is no
			if(!this._onHandler && edit){
				this._onHandler = this.editButton.on("click", lang.hitch(this, this._saveForm));
			}else if(this._onHandler && !edit){
				this._onHandler.remove();
				this._onHandler = null;
			}
			var editButtonOptions = this.editButton.transitionOptions;
			editButtonOptions.params.edit = !edit;
			// also update the edit & ok button to reference the currently displayed item
			editButtonOptions.params.id = id;
			var cancelButtonOptions = this.cancelButton.transitionOptions;
			if(create){
				// if we cancel we want to go back to main view
				cancelButtonOptions.target = "list";
				if(cancelButtonOptions.params.id){
					delete cancelButtonOptions.params.id;
				}
			}else{
				cancelButtonOptions.target = "details";
				cancelButtonOptions.params.id = id;
			}
			// hide back button in edit mode
			if(edit){
				domClass.add(this.backButton.domNode, "hidden");
			}else{
				domClass.remove(this.backButton.domNode, "hidden");
			}
			// cancel button must be shown in edit mode only, same for delete button if we are not creating a new contact
			this.cancelButton.domNode.style.display = edit?"":"none";
			this.deleteButton.domNode.style.display = (edit&&(typeof id !== "undefined"))?"":"none";

			// let's fill the form with the currently selected contact
			// if nothing selected skip that part
			var view = this;
			var promise = null;
			if(!create && !contact){
				id = id.toString();
				// get the contact on the store
				promise = this.loadedStores.contacts.get(id);
			}else{
				promise = contact;
			}
			when(promise, function(contact){
				view.firstname.set("value", contact ? contact.name.givenName : null);
				view.lastname.set("value", contact ? contact.name.familyName : null);
				if(contact && contact.organizations && contact.organizations.length){
					view.company.set("value", contact.organizations[0].name);
				}else{
					view.company.set("value", null);
				}
				// reset binding fields
				for(var key in DATA_MAPPING){
					view[key].set("value", null);
				}
				if(contact){
					// set each phone number to the corresponding form field
					array.forEach(contact.phoneNumbers, function(number){
						// TODO deal with case where we don't support a particular field
						view["phone"+number.type].set("value",  number.value);
					});
					// set each mail field to the corresponding form field
					array.forEach(contact.emails, function(mail){
						// TODO deal with case where we don't support a particular field
						view["mail"+mail.type].set("value",  mail.value);
					});
				}
			});
		},
		_saveForm: function(){
			var id = this.params.id, view = this;
			view._savePromise = new Deferred();
			if(typeof id === "undefined"){
				view._createContact();
			}else{
				// get the contact on the store
				var promise = this.loadedStores.contacts.get(id.toString());
				when(promise, function(contact){
					view._saveContact(contact);
					// save the updated item into the store
					when(view.loadedStores.contacts.put(contact), function(contact){
						view._savePromise.resolve(contact);
					});
				});
			}
		},
		_createContact: function(){
			var contact = {
				"id": (Math.round(Math.random()*1000000)).toString(),
				"name": {},
				"displayName": "",
				"phoneNumbers": [],
				"emails": [],
				"organizations": []
			};
			var view = this;
			this._saveContact(contact);
			when(this.loadedStores.contacts.add(contact), function(contact){
				view._savePromise.resolve(contact);
			});
		},
		_saveContact: function(contact){
			// set back the values on the contact object
			var value, keys;
			// deal with name first
			var displayName = "";
			value = this.firstname.get("value");
			if(typeof value !== "undefined"){
				contact.name.givenName = value;
				displayName += value;
			}
			value = this.lastname.get("value");
			if(typeof value !== "undefined"){
				contact.name.familyName = value;
				displayName += " " + value;
			}
			contact.displayName = displayName;
			value = this.company.get("value");
			if(typeof value !== "undefined"){
				if(contact.organizations.length == 0){
					contact.organizations.push({});
				}
				contact.organizations[0].name = value;
			}
			for(var key in DATA_MAPPING){
				value = this[key].get("value");
				if(typeof value !== "undefined"){
					// there is a value, save it
					keys = DATA_MAPPING[key].split(".");
					getStoreField(contact[keys[0]], keys[1]).value = value;
				}
				// TODO remove existing value?
			}
		},
		_deleteContact: function(){
			this.loadedStores.contacts.remove(this.params.id.toString());
			// we want to be back to list
			this.app.transitionToView(this.domNode, { target: "list" });
		}
	}
});