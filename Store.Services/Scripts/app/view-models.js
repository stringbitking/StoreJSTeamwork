/// <reference path="../libs/_references.js" />

window.vmFactory = (function () {
	var data = null;

	function getLoginViewModel(successCallback) {		
		var viewModel = {
			username: "admin",
			password: "admin",
			message: "",            
			login: function () {
			    var self = this;
				data.users.login(this.get("username"), this.get("password"))
					.then(function () {
						if (successCallback) {
							successCallback();
						}
					}, function (e) {
					    self.set("message", e.responseJSON.Message);
					    console.log(e.responseJSON.Message);
					});
			},
			register: function () {
			    var self = this;
				data.users.register(this.get("username"), this.get("password"))
					.then(function () {
						if (successCallback) {
							successCallback();
						}
					}, function (e) {
					    self.set("message", e.responseJSON.Message);
					    console.log(e.responseJSON.Message);
					});
			}
		};
		return kendo.observable(viewModel);
	};

	//function getCarsViewModel() {
	//    return data.cars.all()
	//		.then(function (cars) {
	//		    var viewModel = {
	//		        cars: cars,
	//		        message: ""
	//		    };
	//		    return kendo.observable(viewModel);
	//		});
	//};

	function getHomeViewModel(logoutCallback) {
	    var userModel = {
	        username: data.users.currentUser(),
	        message: "",
	        logout: function () {
	            data.users.logout();
	            logoutCallback();
	        }
	    }

	    return kendo.observable(userModel);
	};

	function getCategoriesViewModel() {
	    return data.categories.all()
            .then(function (categories) {
                //console.log(categories);
                var viewModel = {
                    categories: categories,
                    message: ""
                };

                return kendo.observable(viewModel);
            });
	}

	return {
		getLoginVM: getLoginViewModel,
		//getCarsVM: getCarsViewModel,
		getHomeVM: getHomeViewModel,
		getCategoriesVM: getCategoriesViewModel,
		setPersister: function (persister) {
			data = persister
		}
	};
}());