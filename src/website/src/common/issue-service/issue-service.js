angular.module('issue-service', [])

.factory('Issue', function($http) {
        return {
            getAll: function() {
                return $http.get('/1.0/issues')
                    .then(function(result) {return result.data});
            },
            createIssue: function(data) {
                return $http.post('/1.0/issues', data)
                    .then(function(result) {return result.data});
            }
        }
    })