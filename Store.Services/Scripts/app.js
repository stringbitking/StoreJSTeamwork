/// <reference path="libs/_references.js" />


(function () {
	var appLayout = new kendo.Layout('<div id="main-content"></div>');
	var data = persisters.get("api/");

	vmFactory.setPersister(data);

	var router = new kendo.Router();
	router.route("/", function () {
	    if (!data.users.currentUser()) {
	        router.navigate("/login");
	    }

	    viewsFactory.getHomeView().then(function (homeViewHtml) {
	        //console.log('before view home');

	        var vm = vmFactory.getHomeVM(
                //logout function
						function () {
						    router.navigate("/login");
						});
	        //console.log(vm);
	        var view = new kendo.View(homeViewHtml, { model: vm });
	        appLayout.showIn('#main-content', view);
	        $("#main-menu").kendoMenu({ orientation: "horizontal" });

	    }, function () { alert('do not get home page') });


		//viewsFactory.getCarsView()
		//	.then(function (carsViewHtml) {
		//		vmFactory.getCarsVM()
		//		.then(function (vm) {
		//			var view =
		//				new kendo.View(carsViewHtml,
		//				{ model: vm });
		//			appLayout.showIn("#main-content", view);
		//		}, function (err) {
		//			//...
		//		});
		//	});
	});

	router.route("/login", function () {
		if (data.users.currentUser()) {
			router.navigate("/");
		}
		else {
			viewsFactory.getLoginView()
				.then(function (loginViewHtml) {
					var loginVm = vmFactory.getLoginVM(
						function () {
							router.navigate("/");
						});
					var view = new kendo.View(loginViewHtml,
						{ model: loginVm });
					appLayout.showIn("#main-content", view);
				}, function () {
				    alert("can't get login view");
				});
		}
	});

	router.route("/logout", function () {
	    data.users.logout();
	    router.navigate("/login");
	});

	//only for registered users
	//router.route("/special", function () {
	//	if (!data.users.currentUser()) {
	//		router.navigate("/login");
	//	}
	//});

	$(function () {
		appLayout.render("#app");
		router.start();
	});
}());