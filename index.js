
module.exports = function(apiKey,licenseId) {	
	var self = this;
	var window = require("jsdom").jsdom().parentWindow;
	global.XMLHttpRequest = window.XMLHttpRequest;
	self.jQuery = require('jquery')(window);
	self.jQuery.support.cors = true;
	var clients = new require("./kangrouter.js").KangrouterAPIClients(self.jQuery);
	return clients.KangRouterJS(apiKey,licenseId)
};


