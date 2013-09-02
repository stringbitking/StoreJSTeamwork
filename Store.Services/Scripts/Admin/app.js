angular.module("store", [])
	.config(["$routeProvider", function ($routeProvider) {
	    $routeProvider
			.when("/login", { templateUrl: "Scripts/Admin/partials/login-form.html", controller: LoginController })
			.when("/adminpage", { templateUrl: "Scripts/Admin/partials/adminpage.html", controller: AdminPageController })
			.when("/users", { templateUrl: "Scripts/Admin/partials/users.html", controller: UsersController })
			//.when("/categories", { templateUrl: "Scripts/Admin/partials/categories.html", controller: CategoriesController })
            //.when("/category/:name", { templateUrl: "Scripts/Admin/partials/products-by-category.html", controller: CategoryController })
            .when("/products", { templateUrl: "Scripts/Admin/partials/products.html", controller: ProductsController })
            .when("/newproduct", { templateUrl: "Scripts/Admin/partials/newproduct.html", controller: ProductsController })
            .when("/orders", { templateUrl: "Scripts/Admin/partials/orders.html", controller: OrdersController })
			.otherwise({ redirectTo: "/login" });
	}])
    //.run(function ($rootScope, $location) {

    //    $rootScope.$on("$routeChangeStart", function (event, next, current) {
    //        if ($rootScope.loggedUser == null) {

    //            if (next.templateUrl == "Scripts/partials/login-form.html") {

    //            } else {
    //                //alert("NO SUCH USER BITCH");
    //                $location.path("/login");
    //            }
    //        }
    //    });
    //})