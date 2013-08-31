/// <reference path="libs/_references.js" />


(function () {
	var appLayout = new kendo.Layout('<div id="main-content"></div><div id="menu-content"></div>');
	var data = persisters.get("api/");

	vmFactory.setPersister(data);

	var router = new kendo.Router();
	router.route("/", function () {
	    if (!data.users.currentUser()) {
	        router.navigate("/login");
	    }

        // start check some queries
	    //data.categories.getCategoryById(1);
	    //data.categories.getCategoriesWithPaging(1, 1);
	    //data.categories.getCategoriesByName('Beverages');
	    //data.products.getProductById(1);
	    //data.products.all();
	    //data.products.getProductsByPaging(1, 1);
	    data.orders.all();
	    data.orders.getOrderById(1);
        // stop check

	    viewsFactory.getHomeView().then(function (homeViewHtml) {
	        var vm = vmFactory.getHomeVM(
						function () {
						    router.navigate("/login");
						});
	        var view = new kendo.View(homeViewHtml, { model: vm });
	        appLayout.showIn('#main-content', view);
	        $("#main-menu").kendoMenu({ orientation: "horizontal" });

	    }, function () { alert('do not get home page') });
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

	router.route("/categories", function () {
	    viewsFactory.getCategoriesView()
        .then(function (categoriesHtml) {
            vmFactory.getCategoriesVM()
            .then(function (vm) {
                var view = new kendo.View(categoriesHtml, { model: vm });
                appLayout.showIn("#menu-content", view);
                $("#menu-content ul").kendoMenu({ orientation: "vertical" });
            }, function(){
                alert('cannot get model of categories');
            });
        }, function(){
            alert('cannot get categories');
        })
	});

	router.route("/products/single/:Id", function (id) {
	    //console.log(id);
	});


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