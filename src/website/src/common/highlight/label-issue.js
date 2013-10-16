angular.module('labelIssue', [])

    .directive('labelIssue', function($timeout) {
        return {
            restrict: 'A',
            scope: {
                data: '@'
            },
            link: function(scope, element, attrs) {

                $timeout(function() {
                    element.addClass('labelstyle-' + scope.data.split('@')[1])
                }, 100)

            }
        }
    })