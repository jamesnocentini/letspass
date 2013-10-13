angular.module('lp-user-service', [])

.factory('user', function($http, $state, $rootScope) {
        return {
            autologin: function(redirect, bool_should_redirect_if_logged_in) {

                if(!arguments[1]) {
                    bool_should_redirect_if_logged_in = false;
                }

                if(!bool_should_redirect_if_logged_in) {
                    return $http.get('/1.0/autologin')
                        .then(function(result) {return result.data})
                        .then(
                        function(data) {
                            $rootScope.current = data;

                            return data;
                        },
                        function(err) {
                            if(!arguments.length) {

                            } else {
                                $state.transitionTo(redirect);
                            }
                        }
                    )
                } else {
                    return $http.get('/1.0/autologin')
                        .then(function(result) {return result.data})
                        .then(
                        function(data) {
                            $rootScope.current = data;
                            $state.transitionTo(redirect);
                            return data;
                        },
                        function(err) {
                        }
                    )
                }
            }
        }
    })