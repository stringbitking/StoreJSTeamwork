var UsersPersister = Class.create({
    init: function (apiUrl) {
        this.apiUrl = apiUrl;
    },
    login: function (username, password) {
        var user = {
            username: username,
            authCode: CryptoJS.SHA1(password).toString()
        };
        return postJSON(this.apiUrl + "login", user)
            .then(function (data) {
                //save to localStorage
                sessionKey = data.sessionKey;
                bashUsername = data.displayName;
                //return data;
            });
    },
    register: function (username, password) {
        var user = {
            username: username,
            authCode: CryptoJS.SHA1(password).toString()
        };
        return postJSON(this.apiUrl + "register", user)
            .then(function (data) {
                //save to localStorage
                sessionKey = data.sessionKey;
                bashUsername = data.displayName;
                return data.displayName;
            });
    },
    logout: function () {
        if (!sessionKey) {
            //gyrmi
        }
        var headers = {
            "X-sessionKey": sessionKey
        };
        //clear sessionKey
        sessionKey = "";
        return putJSON(this.apiUrl + "logout", headers);
    },
    currentUser: function () {
        return bashUsername;
    }
});