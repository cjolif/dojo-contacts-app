define(["dojo/_base/declare", "dojo/_base/lang", "dojo/Deferred", "dojo/store/Memory", "dojo/store/util/QueryResults"],
	function(declare, lang, Deferred, Memory, QueryResults){

	var onFind = function(deferred, contacts){
		deferred.resolve(contacts);
	};

	var onFindId = function(deferred, id, contacts){
		for(var i = 0; i< contacts.length; i++){
			if(contacts[i]["id"] == id){
				deferred.resolve(contacts[i]);
				return;
			}
		}
		deferred.reject(new Error(this.idProperty + " not match."));
	};

	var onError = function(deferred, error){
		deferred.reject(error);
	};

	return declare(null, {
		// summary:
		//		This is a basic store for Contacts
		//		formatted data. It implements dojo/store/api/Store.

		contactFields: ["id", "displayName", "name", "phoneNumbers", "emails", "addresses"],

		constructor: function(options){
			// summary:
			//		Creates a contacts object store.
			declare.safeMixin(this, options);
		},

		get: function(id, options){
			//	summary:
			//		Retrieves an object by its identity.
			//	id: Number
			//		The identity to use to lookup the object
			//	returns: Object
			//		The object in the store that matches the given id.
			var deferred = new Deferred();
			this.find((options && options.contactFields) || this.contactFields,
				lang.partial(onFindId, deferred, id),
				lang.partial(onError, deferred),
				id);
			return deferred;
		},

		getIdentity: function(object){
			// summary:
			//		Returns an object's identity
			// object: Object
			//		The object to get the identity from
			//	returns: Number
			return object["id"];
		},

		query: function(query, options){
			var deferred = new Deferred();
			this.find((options && options.contactFields) || this.contactFields,
				lang.partial(onFind, deferred),
				lang.partial(onError, deferred),
				query?query:"");
			return new QueryResults(deferred);
		},


		memory: null,

		constructor: function(kwArgs){
			// summary:
			//		Creates a memory object store.
			this.contactFields = ["id", "displayName", "name", "phoneNumbers", "emails", "addresses"];
			contactsObj = this;
			ContactFindOptionsClass = function(filter, multiple){
				this.filter = filter || "";
				this.multiple = multiple || true;
			};
			this.inherited(arguments);
			this.memory = new Memory();
			this.memory.setData(this.data || []);
		},

		find: function(fields, onFindSuccess, onFindError, options){
			try{
				var _data = this.memory.data;
				fields = fields.length == 0 ? ["id"] : fields;
				var datas = [];
				// gather fields
				array.forEach(_data, function(item, i){
					var obj = {};
					for(var key in item){
						if(fields[0] === "*" || array.indexOf(fields, key) !== -1){
							obj[key]=item[key];
						}
					}
					datas.push(obj);
				});

				//Search value recursively
				var regexp = new RegExp("^" + options.filter || ".*" + "$", "i");
				function search(item){
					for(var key in item){
						switch(typeof item[key]){
							case "string":
								if(regexp.test(item[key])){
									return true;
								}
								break;
							case "object":
								if(search(item[key])){
									return true;
								}
								break;
						}
					}
					return false;
				}
				var ret=[];
				var _multiple = options.multiple;
				array.forEach(datas, function(item, i){
					if(search(item)){
						ret.push(item);
						if(!_multiple){
							return;
						}
					}
				});
				setTimeout(onFindSuccess(ret));
			}catch(e){
				setTimeout(onFindError(e));
			}
		},

		put: function(object){
			var id = this.getIdentity(object);
			var hasId = typeof id != "undefined";
			if(hasId){
				this.memory.put(object);
			}else{
				var err = new Error(this.idProperty + " is not exist.");
			}		},

		add: function(object){
			var id = this.getIdentity(object);
			var hasId = typeof id != "undefined";
			if(hasId){
				this.memory.put(object);
			}else{
				id = this.memory.add(object);
				object[this.idProperty] = id.toString();
				this.memory.put(object);
			}
			this.onSaveSuccess(object);
		},

		remove: function(object){
			var id = this.getIdentity(contact);
			var hasId = typeof id != "undefined";
			if(hasId){
				this.memory.remove(id);
				this.onRemoveSuccess(object);
			}else{
				var err = new Error(this.idProperty + " not found.");
				this.onRemoveError(err);
			}
		}
	});
});
