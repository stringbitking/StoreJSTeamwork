/// <reference path="../libs/storage-handler.js" />
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

	function getProductsFromCategoryVM(id) {
	    return data.categories.getCategoryById(id)
            .then(function (category) {
                var viewModel = {
                    name: category.Name,
                    products: category.Products,
                    message: "",
                };
                return kendo.observable(viewModel);
            });
	}

	function getAllProductsVM() {
	    return data.products.all()
        .then(function (products) {
            var viewModel = {
                products: products,
                message: ""
            };

            return kendo.observable(viewModel);
        })
	}

	function getSingleProductVM(id) {
	    return data.products.getProductById(id)
        .then(function (product) {
            var viewModel = {
                product: product,
                message: "",
                quantityToBuy: 0,
                sendToBasket: function () {
                    CartRepository.addProduct(this.get("product.Id"), this.get("quantityToBuy"), this.get("product.Name"), this.get("product.Price"));
                    //console.log(this.get("product.Price"));
                    this.set("message", this.get("product.Name")+" was added to your basket!");
                    this.set("quantityToBuy", 0);
                }
            };

            return kendo.observable(viewModel);
        })
	}

	function getAllOrdersViewModel() {
	    return data.orders.getMyOrders()
        .then(function (orders) {
            console.log("orders: ");
            console.log(orders);
            var viewModel = {
                orders: orders,
                message: ""
            };

            return kendo.observable(viewModel);
        })
	}

	function getProductsFromCartVM(successCallback) {
	    var promise = new RSVP.Promise(function (resolve, reject) {
	        //CartRepository.empty();
	        //CartRepository.addProduct(1, 2, "name 1", 23.5);
	        //CartRepository.addProduct(2, 1, "name 2", 12);

	        var productsArr = CartRepository.getCart();

	        var viewModel = {

	            products: productsArr,
	            message: "",
	            clearBasket: function () {
	                CartRepository.empty();
	                console.log("neshto");
	                successCallback();
	            },
	            sendOrder: function () {
	                var self = this;
	                var orderArr = {
	                    ProductList: CartRepository.getOrderData()
	                }
	                data.orders.send(orderArr).then(function () {
	                    CartRepository.empty();
	                    self.set("message", "Your order was sent Succesfully!");
	                });
	            }
	        };
	        resolve(kendo.observable(viewModel));
	    });

	    return promise;
	}

	return {
	    getLoginVM: getLoginViewModel,
	    getSingleProductVM: getSingleProductVM,
		getHomeVM: getHomeViewModel,
		getCategoriesVM: getCategoriesViewModel,
		getAllProductsVM:getAllProductsVM,
		getProductsFromCategoryVM: getProductsFromCategoryVM,
		getAllOrdersVM: getAllOrdersViewModel,
		getProductsFromCartVM: getProductsFromCartVM,
		setPersister: function (persister) {
			data = persister
		}
	};
}());