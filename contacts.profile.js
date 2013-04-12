var profile = {
	resourceTags:{
		declarative: function(filename){
			return /\.html?$/.test(filename); // tags any .html or .htm files as declarative
		},
		amd: function(filename, mid){
			return !this.copyOnly(filename, mid) && /\.js$/.test(filename);
		},
		copyOnly: function(filename, mid){
			return /build.profile/.test(filename);
		}
	}
};
