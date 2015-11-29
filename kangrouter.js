
function KangrouterAPIClients(jQuery) {
	
	this.KangRouterJS = function(apiKey,licenseId) {
		var host = "https://thesolvingmachine.com"
		var errors=[];
		this.solverPath = "/kangrouter/srv/v1/solvers"
	
	    getQuery = function(path,pars) {
	        var allPars = "?licenseId="+licenseId;
	    	if (pars) {
	    		for (k in pars) {
	    			allPars += "&"+k+"="+pars[k];
	    		}
	    	}
	    	return path+allPars;
	    };
	    this.createSolver = function(problem) {
	    	var path = this.solverPath;
	    	var query = getQuery(path,{"deleteExisting":1});
	    	var payload = JSON.stringify(problem);
	    	var df =  jQuery.Deferred();
	    	 jQuery.ajax({
	    	    url: host+query,
	    	    type: "POST",
	    	    data: payload,
	    	    dataType: 'json',
	    	    contentType : 'application/json',
	    	    headers : { 'Authorization': apiKey }
	    	})
	    	.done(function(solverId){ df.resolve(solverId); })
	    	.fail(function(jqXHR, textStatus, errorThrown){ df.reject(jqXHR.responseJSON)});
	    	return df.promise();
	    };
	    this.getStatus = function(solverId) {
	    	var path = this.solverPath+"/"+solverId+"/status";
	    	var query = getQuery(path,{});
	    	var df =  jQuery.Deferred();
	    	 jQuery.ajax({
	    	    url: host+query,
	    	    type: "GET",
	    	    dataType: 'json',
	    	    contentType : 'application/json',
	    	    headers : { 'Authorization': apiKey }
	    	})
	    	.done(function(data){ df.resolve(data); })
	    	.fail(function(jqXHR, textStatus, errorThrown){ df.reject(jqXHR.responseJSON)});
	    	return df.promise();
	    };
	    this.stop = function(solverId) {
	    	var path = this.solverPath+"/"+solverId+"/stop";
	    	var query = getQuery(path,{});
	    	var df =  jQuery.Deferred();
	    	 jQuery.ajax({
	    	    url: host+query,
	    	    type: "PUT",
	    	    dataType: 'json',
	    	    contentType : 'application/json',
	    	    headers : { 'Authorization': apiKey }
	    	})
	    	.done(function(data){ df.resolve(data); })
	    	.fail(function(jqXHR, textStatus, errorThrown){ df.reject(jqXHR.responseJSON)});
	    	return df.promise();
	    };
	    this.getSolution = function(solverId,includeDistTimeMatrices) {
	    	var path = this.solverPath+"/"+solverId+"/solution";
	    	var query = getQuery(path,{"includeDistTimeMatrices":self.includeDistTimeMatrices});
	    	var df =  jQuery.Deferred();
	    	 jQuery.ajax({
	    	    url: host+query,
	    	    type: "GET",
	    	    dataType: 'json',
	    	    contentType : 'application/json',
	    	    headers : { 'Authorization': apiKey }
	    	})
	    	.done(function(data){ df.resolve(data); })
	    	.fail(function(jqXHR, textStatus, errorThrown){ df.reject(jqXHR.responseJSON)});
	    	return df.promise();
	    };
	    this.getErrors = function() {
	  	  	return errors;
	    };
	    this.isValid = function(solverId) {
	    	return solverId!=null;
	    };
	    this.solve = function(problem,pollInterval) {
	    	var self = this;
	    	if (!pollInterval)
	    		pollInterval = 1000;
	    	var df =  jQuery.Deferred();
	    	var _solverId;
	    	function processSolution(solverId) {
	    		self.getSolution(solverId)
	    			.done(function(solution){
	    				df.resolve(solution);
	    			})
	    			.fail(function(errors){
	    				df.reject(errors);
	    			});
	    	}
	    	function updateProgress(solverId) {
	    		self.getStatus(solverId)
					.done(function(status){
						if (self.progressPoll && (
							status.execStatus=="invalid" ||
							status.execStatus=="completed")) {
							clearInterval(self.progressPoll);
							self.progressPoll = null;
						}
						if (status.execStatus!="invalid")
							df.notify(status);
						if (status.execStatus=="completed") 
							processSolution(solverId);
						else
						if (status.execStatus=="invalid") 
							df.reject(status.errors);
					})
					.fail(function(errors){
						if (self.progressPoll)
							clearInterval(self.progressPoll);
		    			df.reject(errors);
					});
	    	}
	    	self.createSolver(problem)
	    		.done(function(solverId){
	    			_solverId = solverId;
	    			self.progressPoll = setInterval(
	    					updateProgress.bind(self,solverId),
	    					pollInterval);
	    		})
	    		.fail(function(errors){
	    			df.reject(errors);
	    		});
	    	var r = df.promise();
	    	r.stop = function(){
	    		if (df.state()!="pending")
	    			return;
	    		if (_solverId)
	    			return self.stop(_solverId); 
	    		return  jQuery.Deferred().resolve();
	    	};
	    	return r;
	    };
	    return this;
	}
	
	this.GeocoderJS = function(apiKey,licenseId) {
		var host = "https://thesolvingmachine.com"
		var errors=[];
		this.geocoderPath = "/routing/srv/v1/geocoders"
	    getQuery = function(path,pars) {
	    	var d = new Date();
	    	var secsSinceEpoch = Math.floor(d.getTime()/1000);
	        var allPars = "?licenseId="+licenseId;
	    	if (pars) {
	    		for (k in pars) {
	    			allPars += "&"+k+"="+pars[k];
	    		}
	    	}
	    	return path+allPars;
	    };
	    this.createGeocoder = function(problem) {
	        var path = this.geocoderPath;
	    	var query = getQuery(path,{"deleteExisting":1});
	    	var payload = JSON.stringify(problem);
	    	var df =  jQuery.Deferred();
	    	 jQuery.ajax({
	    	    url: host+query,
	    	    type: "POST",
	    	    data: payload,
	    	    dataType: 'json',
	    	    contentType : 'application/json',
	    	    headers : { 'Authorization': apiKey }
	    	})
	    	.done(function(data){ df.resolve(data.geocoderId); })
	    	.fail(function(jqXHR, textStatus, errorThrown){ df.reject(jqXHR.responseJSON)});
	    	return df.promise();
	    };
	    this.getStatus = function(geocoderId) {
	        var path = this.geocoderPath + "/"+geocoderId+"/status";
	    	var query = getQuery(path,{});
	    	var df =  jQuery.Deferred();
	    	 jQuery.ajax({
	    	    url: host+query,
	    	    type: "GET",
	    	    dataType: 'json',
	    	    contentType : 'application/json',
	    	    headers : { 'Authorization': apiKey }
	    	})
	    	.done(function(data){ df.resolve(data); })
	    	.fail(function(jqXHR, textStatus, errorThrown){ df.reject(jqXHR.responseJSON)});
	    	return df.promise();
	    };
	    this.stop = function(geocoderId) {
	        var path = this.geocoderPath + "/"+geocoderId+"/stop";
	    	var query = getQuery(path,{});
	    	var df =  jQuery.Deferred();
	    	 jQuery.ajax({
	    	    url: host+query,
	    	    type: "PUT",
	    	    dataType: 'json',
	    	    contentType : 'application/json',
	    	    headers : { 'Authorization': apiKey }
	    	})
	    	.done(function(data){ df.resolve(data); })
	    	.fail(function(jqXHR, textStatus, errorThrown){ df.reject(jqXHR.responseJSON)});
	    	return df.promise();
	    };
	    this.getSolution = function(geocoderId) {
	        var path = this.geocoderPath +"/"+geocoderId+"/solution";
	    	var query = getQuery(path,{});
	    	var df =  jQuery.Deferred();
	    	 jQuery.ajax({
	    	    url: host+query,
	    	    type: "GET",
	    	    dataType: 'json',
	    	    contentType : 'application/json',
	    	    headers : { 'Authorization': apiKey }
	    	})    	
	    	.done(function(data){ df.resolve(data); })
	    	.fail(function(jqXHR, textStatus, errorThrown){ df.reject(jqXHR.responseJSON)});
	    	return df.promise();
	    };
	    this.getErrors = function() {
	  	  	return errors;
	    };
	    this.isValid = function(geocoderId) {
	    	return geocoderId!=null;
	    };
	    this.solve = function(problem,pollInterval) {
	    	var self = this;
	    	if (!pollInterval)
	    		pollInterval = 1000;
	    	var df =  jQuery.Deferred();
	    	function processSolution(geocoderId) {
	    		self.getSolution(geocoderId)
	    			.done(function(solution){
	    				df.resolve(solution);
	    			})
	    			.fail(function(errors){
	    				df.reject(errors);
	    			});
	    	}
	    	function updateProgress(geocoderId) {
	    		self.getStatus(geocoderId)
					.done(function(status){
						if (self.progressPoll && (
							status.execStatus=="invalid" ||
							status.execStatus=="completed")) {
							clearInterval(self.progressPoll);
							self.progressPoll = null;
						}
						if (status.execStatus!="invalid")
							df.notify(status);
						if (status.execStatus=="completed") 
							processSolution(geocoderId);
						else
						if (status.execStatus=="invalid") 
							df.reject(status.errors);
					})
					.fail(function(errors){
						if (self.progressPoll)
							clearInterval(self.progressPoll);
		    			df.reject(errors);	    			
					});
	    	}
	    	self.createGeocoder(problem)
	    		.done(function(geocoderId){
	    			self.progressPoll = setInterval(
	    					updateProgress.bind(self,geocoderId),
	    					pollInterval);
	    		})
	    		.fail(function(errors){
	    			df.reject(errors);
	    		});
	    	return df.promise();
	    };
	    return this;
	}
	return this;
} // KangrouterAPIClients

if (typeof jQuery !== 'undefined') {
	KangRouterJS = KangrouterAPIClients(jQuery).KangRouterJS
	GeocoderJS = KangrouterAPIClients(jQuery).GeocoderJS
}

if (typeof module !== 'undefined' {
	module.exports = {
			//KangRouterJS: KangRouterJS
			KangrouterAPIClients: KangrouterAPIClients
	};
}
