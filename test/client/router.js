(function(window, $) {
	var Router = function() {

	}

	Router.prototype.init = function() {
			window.addEventListener("hashchange", function() {});
	}
	Router.prototype.route = function(hash, callback) {
		if(callback) callback();
		
	}

}(window, jQuery))