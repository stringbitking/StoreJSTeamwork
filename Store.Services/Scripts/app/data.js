/// <reference path="cart-repository.js" />
window.persisters = (function () {
	var sessionKey = localStorage.getItem('sessionKey');
	var bashUsername = localStorage.getItem('username');
	var isAdmin = localStorage.getItem('isAdmin');

	var UsersPersister = Class.create({
		init: function (apiUrl) {
			this.apiUrl = apiUrl;
		},
		login: function (username, password) {
			var user = {
				username: username,
				authCode: CryptoJS.SHA1(password).toString()
			};
			return httpRequester.postJSON(this.apiUrl + "login", user)
				.then(function (data) {
				    //save to localStorage
				    sessionKey = data.SessionKey;
				    bashUsername = username;
				    isAdmin = data.IsAdmin;
				    data.username = username;
				    //console.log(data);
				    localStorage.setItem('sessionKey', sessionKey);
				    localStorage.setItem('username', bashUsername);
				    localStorage.setItem('isAdmin', isAdmin);

					return data;
				});
		},
		register: function (username, password) {
			var user = {
				username: username,
				authCode: CryptoJS.SHA1(password).toString()
			};
			return httpRequester.postJSON(this.apiUrl + "register", user)
				.then(function (data) {
				    //save to localStorage
				    //console.log(data);
					sessionKey = data.SessionKey;
					bashUsername = username;
					isAdmin = data.IsAdmin;
					data.username = username;

					return data;
				});
		},
		logout: function () {
		    //alert('i logged out');
			if (!sessionKey) {
				//gyrmi
			}

			localStorage.removeItem('sessionKey');
			localStorage.removeItem('username');
			localStorage.removeItem('isAdmin');
			CartRepository.empty();

			var headers = {
				"X-sessionKey": sessionKey
			};
			//clear sessionKey
			sessionKey = "";
			bashUsername = "";

			return httpRequester.putJSON(this.apiUrl + "logout", headers);
		},
		currentUser: function () {
			return bashUsername;
		},
		isAdmin: function () {
		    return isAdmin;
		}
	});

	var CategoriesPersister = Class.create({
		init: function (apiUrl) {
			this.apiUrl = apiUrl;
		},
		all: function () {
		    var headers = {
		        "X-sessionKey": sessionKey
		    };
		    return httpRequester.getJSON(this.apiUrl + 'user_all', headers).then(function (data) {
		        //console.log(data);
		        return data;
		    });
		},
		getCategoryById: function (id) {
		    var headers = {
		        "X-sessionKey": sessionKey
		    };

		    return httpRequester.getJSON(this.apiUrl + 'user/' + id, headers).then(function (data) {
		        //console.log(data);
		        return data;
		    });
		},
	    // GET api/categories/user?page=0&count=2
		getCategoriesWithPaging: function (page, count) {
		    var headers = {
		        "X-sessionKey": sessionKey
		    };
		    var url = this.apiUrl + 'user?page=' + page + '&count=' + count;// + '&sessionKey=' + sessionKey;

		    return httpRequester.getJSON(url , headers).then(function (data) {
		        console.log(data);
		        //return data;
		    });
		},
	    // GET api/categories/user?keyword=webapi
		getCategoriesByName: function (keyword) {
		    var headers = {
		        "X-sessionKey": sessionKey
		    };
		    var url = this.apiUrl + 'user?keyword=' + keyword;// + '&sessionKey=' + sessionKey;

		    return httpRequester.getJSON(url, headers).then(function (data) {
		        console.log(data);
		        //return data;
		    });
		}
	});

	var ProductsPersister = Class.create({
	    init: function (apiUrl) {
	        this.apiUrl = apiUrl;
	    },
	    all: function () {
	        var headers = {
	            "X-sessionKey": sessionKey
	        };
	        return httpRequester.getJSON(this.apiUrl + 'all', headers).then(function (data) {
	            //console.log(data);
	            return data;
	        });
	    },
	    getProductById: function (id) {
	        var headers = {
	            "X-sessionKey": sessionKey
	        };
	        //console.log(sessionKey);
	        return httpRequester.getJSON(this.apiUrl + 'single/' + id, headers).then(function (data) {
	            console.log(data);
	            return data;
	        });
	    },
	    getProductsByPaging: function (page, count) {
	        var headers = {
	            "X-sessionKey": sessionKey
	        };
	        var url = this.apiUrl + 'all?page=' + page + '&count=' + count;// + '&sessionKey=' + sessionKey;

	        return httpRequester.getJSON(url, headers).then(function (data) {
	            console.log(data);
	            //return data;
	        });
	    }
	});

	var OrdersPersister = Class.create({
	    init: function (apiUrl) {
	        this.apiUrl = apiUrl;
	    },
	    getMyOrders: function () {
	        var headers = {
	            "X-sessionKey": sessionKey
	        };
	        return httpRequester.getJSON(this.apiUrl + 'myOrders', headers);
	    },
	    getOrderById: function (id) {
	        var headers = {
	            "X-sessionKey": sessionKey
	        };
	        //console.log(sessionKey);
	        return httpRequester.getJSON(this.apiUrl + 'single/' + id, headers).then(function (data) {
	            console.log(data);
	            //return data;
	        });
	    },
	    send: function (data) {
	        var headers = {
	            "X-sessionKey": sessionKey
	        };

	        return httpRequester.postJSON(this.apiUrl + 'create', data, headers).then(function (data) {
	            console.log(data);
	            return data;
	        });
	    },
	});

	var DataPersister = Class.create({
		init: function (apiUrl) {
			this.apiUrl = apiUrl;
			this.users = new UsersPersister(apiUrl + "users/");
			this.categories = new CategoriesPersister(apiUrl + "categories/");
			this.products = new ProductsPersister(apiUrl + "products/");
			this.orders = new OrdersPersister(apiUrl + "orders/");
			//this.stores = new StoresPersister(apiUrl + "stores/");
		}
	});


	return {
		get: function (apiUrl) {
			return new DataPersister(apiUrl);
		}
	}
}());