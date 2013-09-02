/// <reference path="libs/_references.js" />


(function () {

    function displayMenu() {
        var menu = $('#main-menu');
        menu.css({ "display": 'inline-block' });
        menu.kendoMenu({ orientation: "horizontal" });
        var isAdmin = data.users.isAdmin() + '';

        console.log(isAdmin);
        //$('#admin-panel').css({ "display": 'none' });

        if (isAdmin == 'true') {
            $('#admin-panel').css({ "display": 'inline-block' });
        }

        if (isAdmin == 'false') {
            $('#admin-panel').css({ "display": 'none' });
        }
        //else {
        //   
        //}
    }

	var appLayout = new kendo.Layout('<div id="menu-content"></div>');
    //var data = persisters.get("http://storecholrineteam.apphb.com/api/");
    var data = persisters.get("api/");

	vmFactory.setPersister(data);

	var router = new kendo.Router();
	router.route("/", function () {
	    if (!data.users.currentUser()) {
	        router.navigate("/login");
	    }


	    viewsFactory.getHomeView().then(function (homeViewHtml) {
	                var vm = vmFactory.getHomeVM(
	        					function () {
	        					    router.navigate("/login");
	        					});
	                var view = new kendo.View(homeViewHtml, { model: vm });
	                appLayout.showIn('#menu-content', view);
	                $("#main-menu").kendoMenu({ orientation: "horizontal" });

	            }, function () { alert('do not get home page') });

	    //visualizeUsernameAndLogout();
        // start check some queries
	    //data.categories.getCategoryById(1);
	    //data.categories.getCategoriesWithPaging(1, 1);
	    //data.categories.getCategoriesByName('Beverages');
	    //data.products.getProductById(1);
	    //data.products.all();
	    //data.products.getProductsByPaging(1, 1);
	    //data.orders.getMyOrders();
	    //data.orders.getOrderById(1);
	    //data.categories.all();
        // stop check


	    displayMenu();
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
					appLayout.showIn("#menu-content", view);
				}, function () {
				    alert("can't get login view");
				});
		}
	});

	router.route("/logout", function () {
	    data.users.logout();
	    var menu = $('#main-menu');
	    menu.css({ "display": 'none' });
	    router.navigate("/login");
	});

	router.route("/categories", function () {
	    displayMenu();

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

	router.route("/products/fromCategory/:Id", function (id) {

	    displayMenu();

	    viewsFactory.getProducstFromCategoryView()
        .then(function(productsHtml){
            vmFactory.getProductsFromCategoryVM(id)
            .then(function (vm) {
                var view = new kendo.View(productsHtml, { model: vm });
                //console.log(view);
                appLayout.showIn("#menu-content", view);
                //console.log(vm);
                //$("#products-grid").kendoGrid({
                //    dataSource: vm.products, //[{Name: "my name", Price: "100", Quantity:"10"}],//vm,
                //    columns: [
                //        { field: "Name", title: "Name", width: 100 },
                //        { field: "Price", title: "Price", width: 100 },
                //        { field: "Quantity", title: "Quantity", width: 100 },
                //    ]
                //});
            })
        })
	});

	router.route("/products", function () {
	    displayMenu();
	    viewsFactory.getAllProductsView()
        .then(function (productsHtml) {
            vmFactory.getAllProductsVM()
            .then(function (vm) {
                var view = new kendo.View(productsHtml, { model: vm });
                appLayout.showIn("#menu-content", view);
            }, function () {
                alert('cannot get model of products');
            });
        }, function () {
            alert('cannot get products');
        })
	});

	router.route("/products/:Id", function (id) {

	    displayMenu();
	    viewsFactory.getSingleView()
        .then(function (productHtml) {
            vmFactory.getSingleProductVM(id)
            .then(function (vm) {
                console.log(vm);
                var view = new kendo.View(productHtml, { model: vm });
                appLayout.showIn("#menu-content", view);
            })
        })
	});

	router.route("/orders", function () {
	    displayMenu();
	    viewsFactory.getAllOrdersView()
        .then(function (ordersHtml) {
            vmFactory.getAllOrdersVM()
            .then(function (vm) {
                var view = new kendo.View(ordersHtml, { model: vm });
                appLayout.showIn("#menu-content", view);
            }, function () {
                alert('cannot get model of products');
            });
        }, function () {
            alert('cannot get products');
        })
	});

	router.route("/basket", function () {
	    displayMenu();
	    viewsFactory.getProducstFromCartView()
        .then(function (productsHtml) {

            vmFactory.getProductsFromCartVM(function () {
                console.log("neshto APP");
                router.navigate("/categories");
            })
            .then(function (vm) {

                var view = new kendo.View(productsHtml, { model: vm });
                appLayout.showIn("#menu-content", view);
            }, function () {
                alert('cannot get model of products');
            });
        }, function () {
            alert('cannot get products');
        })
	});

	$(function () {
	    appLayout.render("#app");
		router.start();
	});
}());