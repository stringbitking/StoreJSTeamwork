window.persisters = (function () {
	var sessionKey = localStorage.getItem('sessionKey');
	var bashUsername = localStorage.getItem('username');

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
				    data.username = username;

				    localStorage.setItem('sessionKey', sessionKey);
				    localStorage.setItem('username', bashUsername);

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

			var headers = {
				"X-sessionKey": sessionKey
			};
			//clear sessionKey
			sessionKey = "";
			bashUsername = "";

			return;//httpRequester.putJSON(this.apiUrl + "logout", headers);
		},
		currentUser: function () {
			return bashUsername;
		}
	});

	//var CarsPersister = Class.create({
	//	init: function (apiUrl) {
	//		this.apiUrl = apiUrl;
	//	},
	//	all: function () {
	//		return httpRequester.getJSON(this.apiUrl);
	//	}
	//});

	//var StoresPersister = Class.create({
	//})

	var DataPersister = Class.create({
		init: function (apiUrl) {
			this.apiUrl = apiUrl;
			this.users = new UsersPersister(apiUrl + "users/");
			//this.cars = new CarsPersister(apiUrl + "cars/");
			//this.stores = new StoresPersister(apiUrl + "stores/");
		}
	});


	return {
		get: function (apiUrl) {
			return new DataPersister(apiUrl);
		}
	}
}());