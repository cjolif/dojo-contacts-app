define(["dojox/mobile/common", "dojox/mobile/Button", "dojox/mobile/FormLayout", "dojox/mobile/TextArea"],
	function(common){
	return {
		beforeActivate: function(previousView){
			this.backButton.set("label", previousView.nls.contacts);
			if((window.innerWidth || document.documentElement.clientWidth) <= common.tabletSize){
				this.backButton.domNode.style.display = "";
			}else{
				this.backButton.domNode.style.display = "none";
			}
		}
	}
});