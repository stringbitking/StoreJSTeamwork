/// <reference path="../libs/jquery-2.0.3.js" />
/// <reference path="../libs/jquery.validate.js" />
/// <reference path="../libs/angular.js" />
/// <reference path="../libs/underscore.js" />

var serviceUrl = function () {
    return "http://localhost:12666/api/";
}();

function LoginController($scope, $location, $rootScope, $http) {

    var url = serviceUrl + "users/login";

    $scope.loggingUser = {
        username: "",
        password: "",
        authCode: ""
    };

    $rootScope.loggedUser = {
        username: "",
        sessionKey: ""
    };

    $scope.login = function () {
        $scope.loggingUser.authCode = "d033e22ae348aeb5660fc2140aec35850c4da997";

        $http.post(url, {
            username: $scope.loggingUser.username,
            authCode: $scope.loggingUser.authCode
        })
        .success(function (user) {
            if (true) {
                $rootScope.loggedUser.sessionKey = user.SessionKey;
                $rootScope.loggedUser.username = $scope.loggingUser.username;
                saveToLocalStorage($rootScope.loggedUser);
                //$scope.$apply(function () { $location.path("/test"); })
                $location.path("/adminpage");
                //window.location.href = "/adminpage";
            }
        })
        .error(function (data, status, headers, config) {
            alert("error in LoginController");
            console.log(data, status, headers, config);
        })
    };

    function saveToLocalStorage(user) {
        localStorage.setItem("user", JSON.stringify(user));
    }
}

function UsersController($scope, $location, $rootScope, $http) {
    $http.get("Scripts/Admin/data/users.js")
    .success(function (users) {
        $scope.users = users;
    });
}

function CategoriesController($scope, $location, $rootScope, $http) {
    $http.get("Scripts/Admin/data/categories.js")
    .success(function (categories) {
        $scope.categories = categories;
    });
}

function CategoryController($scope, $location, $rootScope, $http, $routeParams) {
    var categoryName = $routeParams.name;

    $http.get("Scripts/Admin/data/products.js")
    .success(function (products) {
        var category = {
            name: categoryName,
            products: []
        }

        _.chain(products)
		.where({ "category": categoryName })
		.each(function (post) {
		    category.posts.push({
		        id: post.id,
		        title: post.title,
		        content: post.content
		    });
		})
        $scope.category = category;
    })
}

function AdminPageController($scope, $location, $rootScope, $http) {

    var loggedUser = $rootScope.loggedUser;

    $scope.currentUser = JSON.parse(localStorage.getItem("user"));
}

function ProductsController($scope, $location, $rootScope, $http) {
    $scope.predicate = '-name';
    var currentUserAsString = localStorage.getItem("user");
    var currentUser = JSON.parse(currentUserAsString);
    var sessionKey = currentUser.sessionKey;
    var url = serviceUrl + "products/all/";
    $scope.products = [];

    var config = {
        headers: {
            'X-sessionKey': sessionKey
        }
    };

    //$http({ method: "GET", url: url, headers: { 'X-sessionKey': sessionKey } })
    $http.get(url, config)
    .success(function (products) {
        $scope.products = products;
    })
    .error(function (data, status, headers, config) {
        alert("error in ProductsController");
        console.log(data, status, headers, config)
    });

    $scope.newProduct = {
        name: "",
        price: "",
        quantity: "",
        isDeleted: "",
        info: "",
        categories: ""
    }

    $scope.addNewProduct = function () {
        var prodUrl = serviceUrl + "products/create";
        var data = {
            Name: $scope.newProduct.name,
            Price: $scope.newProduct.price,
            Quantity: $scope.newProduct.quantity,
            IsDeleted: "false",
            Info: $scope.newProduct.info,
            Categories: $scope.newProduct.categories
        }

        $http.post(prodUrl, data, config)
        .success(function (products) {
            $('#newProduct').append('<p class="temp">Product Added!</p>');
            $('.temp').fadeOut("slow");

            $scope.newProduct = {
                name: "",
                price: "",
                quantity: "",
                isDeleted: "",
                info: "",
                categories: ""
            }
        })
        .error(function (data, status, headers, config) {
            alert("error in ProductsController");
            console.log(data, status, headers, config)
    });
    }

    $scope.changeAvailability = function (id, aval) {

        aval = !aval;
        for (var p in $scope.products) {
            if (p.Id == id) {
                p.IsDeleted = aval;
            }
        }
    }
}

function KengularController($scope) {

    $scope.myDataSource1 =
                [
                    {
                        "dataID": 1,
                        "dataName": "My Name",
                        "dataLocation": "My Location"
                    }
                ]


    $scope.myDataSource = new kendo.data.DataSource({
        transport: {
            read: "Scripts/Admin/data/myData.json"
        },
        pageSize: 5
    });
}