angular.module('letspass.login', [
    'ui.state',
        'lp-user-service'
])

.config(function config ($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',
            views: {
                "main": {
                    controller: 'LoginCtrl',
                    templateUrl: 'login/login.tpl.html'
                }
            },
            data: { pageTitle: 'Login' },
            resolve: {
                ruser: ['user', function(user) {
                    return user.autologin('home', true);
                }]
            }
        })
    })

.controller('LoginCtrl', function LoginCtrl ($scope) {



});