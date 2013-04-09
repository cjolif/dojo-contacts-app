define(["dojo/_base/declare", "dojo/_base/array", "dojo/Deferred", "dojo/store/Memory", "dojo/store/util/QueryResults"],
	function(declare, array, Deferred, Memory, QueryResults){

	return declare(null, {
		// summary:
		//		This is a basic store for Contacts
		//		formatted data. It implements dojo/store/api/Store.

		contactFields: ["id", "displayName", "name", "phoneNumbers", "emails", "addresses"],

		constructor: function(options){
			// summary:
			//		Creates a contacts object store.
			declare.safeMixin(this, options);
			this._memory = new Memory();
			this._memory.setData(this.data || []);
		},

		get: function(id, options){
			//	summary:
			//		Retrieves an object by its identity.
			//	id: Number
			//		The identity to use to lookup the object
			//	options: Object
			//		Accepts contactFields property
			//	returns: Object
			//		The object in the store that matches the given id.
			var deferred = new Deferred();
			this._find((options && options.contactFields) || this.contactFields,
				function(contacts){
					// search is by keyword on all fields, so we need to double check
					// we did not get false positive results
					for(var i = 0; i < contacts.length; i++){
						if(contacts[i]["id"] == id){
							deferred.resolve(contacts[i]);
							return;
						}
					}
					deferred.reject(new Error(this.idProperty + " not match."));
				},
				deferred, id);
			return deferred.promise;
		},

		query: function(query, options){
			var deferred = new Deferred();
			this._find((options && options.contactFields) || this.contactFields,
				function(contacts){
					deferred.resolve(contacts);
				},
				deferred, query?query:"");
			// TODO: what about queryEngine?
			return new QueryResults(deferred.promise);
		},

		_memory: null,

		getIdentity: function(object){
			return this._memory.getIdentity(object);
		},

		_find: function(fields, success, deferred, options){
			try{
				var _data = this._memory.data;
				fields = fields.length == 0 ? ["id"] : fields;
				var datas = [];
				// gather fields
				array.forEach(_data, function(item){
					var obj = {};
					for(var key in item){
						if(fields[0] === "*" || array.indexOf(fields, key) !== -1){
							obj[key]=item[key];
						}
					}
					datas.push(obj);
				});

				//Search value recursively
				var regexp = new RegExp("^" + (options.filter || ".*" + "$"), "i");
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
				array.forEach(datas, function(item){
					if(search(item)){
						ret.push(item);
						if(!_multiple){
							// TODO fix this
							return;
						}
					}
				});
				success(ret);
			}catch(e){
				deferred.reject(e);
			}
		},

		put: function(object){
			this._memory.put(object);
		},

		add: function(object){
			this._memory.add(object);
		},

		remove: function(id){
			this._memory.remove(id);
		}
	});
});
