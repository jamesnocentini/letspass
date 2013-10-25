angular.module('issue-service', [])

.factory('Issue', function($http) {
        return {
            getAll: function(group) {
                return $http.get('/1.0/issues/' + group)
                    .then(function(result) {return result.data});
            },
            createIssue: function(data) {
                return $http.post('/1.0/issues', data)
                    .then(function(result) {return result.data});
            }
        }
    })