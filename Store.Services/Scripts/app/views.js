﻿/// <reference path="../libs/_references.js" />


window.viewsFactory = (function () {
	var rootUrl = "Scripts/partials/";

	var templates = {};

	function getTemplate(name) {
		var promise = new RSVP.Promise(function (resolve, reject) {
			if (templates[name]) {
				resolve(templates[name])
			}
			else {
				$.ajax({
					url: rootUrl + name + ".html",
					type: "GET",
					success: function (templateHtml) {
						templates[name] = templateHtml;
						resolve(templateHtml);
					},
					error: function (err) {
						reject(err)
					}
				});
			}
		});
		return promise;
	}

	function getLoginView() {
		return getTemplate("login-form");
	}

	//function getCarsView() {
	//	return getTemplate("cars");
	//}

	function getHomeView() {
	    return getTemplate("home");
	}

	function getCategoriesView() {
	    return getTemplate("all-categories");
	}

	function getProducstFromCategoryView() {
	    return getTemplate("products-from-category");
	}

	function getAllProductsView() {
	    return getTemplate("all-products");
	}

	function getSingleView() {
	    return getTemplate("single-product");
	}

	function getAllOrdersView() {
	    return getTemplate("all-orders");
	}

	function getProducstFromCartView() {
	    return getTemplate("products-from-cart");
	}

	function getAboutView() {
	    return getTemplate("about");
	}

	function getContactstView() {
	    return getTemplate("contacts");
	}

	return {
	    getLoginView: getLoginView,
	    getSingleView: getSingleView,
	    getContactstView: getContactstView,
	    getAboutView: getAboutView,
		getHomeView: getHomeView,
		getCategoriesView: getCategoriesView,
		getProducstFromCategoryView: getProducstFromCategoryView,
		getAllProductsView: getAllProductsView,
		getAllOrdersView: getAllOrdersView,
		getProducstFromCartView: getProducstFromCartView,
	};
}());