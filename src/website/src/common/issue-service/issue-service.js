angular.module('issue-service', [])

.factory('Issue', function($http) {
        return {
            getAll: function() {
                return $http.get('/1.0/issues')
                    .then(function(result) {return result.data});
            }
        }
    })