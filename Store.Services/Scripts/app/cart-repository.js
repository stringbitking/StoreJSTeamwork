/// <reference path="../libs/storage-handler.js" />
(function () {
    if (!Storage.prototype.setObject) {
        Storage.prototype.setObject = function setObject(key, obj) {
            var jsonObj = JSON.stringify(obj);
            this.setItem(key, jsonObj);
        };
    }
    if (!Storage.prototype.getObject) {
        Storage.prototype.getObject = function getObject(key) {
            var jsonObj = this.getItem(key);
            var obj = JSON.parse(jsonObj);
            return obj;
        };
    }
})();

var CartRepository = (function () {

    this.addProduct = function (id, quantity, name, price) {

        var cart = localStorage.getObject('cart') || [];

        for (var i = 0, l = cart.length; i < l; i += 1) {
            if (cart[i].id == id) {

                cart[i].quantity++;
                cart[i].total = cart[i].quantity * cart[i].price;

                localStorage.setObject('cart', cart);

                return;
            } 
            
        }
        var tot=quantity*price
        var product = {
            id: id,
            quantity: quantity,
            name:name,
            price: price,
            total:tot,
        };
        cart.push(product);
        localStorage.setObject('cart', cart);
        return;
    }

    this.deleteProduct = function (id) {
        var cart = localStorage.getObject('cart') || [];
        for (var i = 0; i < cart.length; i++) {
            if (id == cart[i].id) {
                cart[i] == cart[cart.length - 1];
                cart.pop();
                break;
            }
        }
    }

    this.empty = function () {
        localStorage.setObject('cart', []);
        var totalCount = localStorage.getObject('itemsCount');
        if (totalCount) {
            localStorage.setObject('itemsCount', 0);
        }
    }

    this.getCart = function () {
        return localStorage.getObject('cart') || [];
    }

    this.getTotalAmount = function () {
        var cart = localStorage.getObject('cart') || [];
        var sum = 0;
        for (var i = 0; i < cart.length; i++) {
            sum += cart[i].price * cart[i].quantity;
        }
        return sum;
    }
    this.getOrderData = function () {
        var cart = localStorage.getObject('cart') || [];
        var order = [];
        for (var i = 0; i < cart.length; i++) {
            var item = {
                id: cart[i].id,
                quantity: cart[i].quantity
            }
            order.push(item);
        }
        return order;
    }

    return {
        addProduct: addProduct,
        deleteProduct: deleteProduct,
        empty: empty,
        getCart: getCart,
        getTotalAmount: getTotalAmount,
        getOrderData: getOrderData,
    }
})();