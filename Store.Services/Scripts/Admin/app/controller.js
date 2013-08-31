/// <reference path="../libs/angular.js" />
/// <reference path="../libs/underscore.js" />

function LoginController($scope, $location, $rootScope, $http) {
    $scope.newUser = {
        username: "",
        password: ""
    };

    $rootScope.loggedUser = {
        username: "",
        sessionKey: ""
    };

    $scope.login = function () {
        $http.get("Scripts/Admin/data/users.js")
        .success(function (users) {
            if ($scope.newUser.username == users[0].username
                && $scope.newUser.password == users[0].password) {
                $rootScope.loggedUser.sessionKey = users[0].sessionKey;
                $rootScope.loggedUser.username = users[0].username;
                saveToLocalStorage($rootScope.loggedUser);
                //$scope.$apply(function () { $location.path("/test"); })
                $location.path("/adminpage");
                //window.location.href = "/adminpage";
            }
        })
        .error(function (err) {
            alert("error");
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