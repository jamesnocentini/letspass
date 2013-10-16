angular.module('highlight', [])

.directive('highlight', function($timeout) {
        return {
            restrict: 'A',
            scope: {
                hexcolor: '@',
                title: '@'
            },
            link: function(scope, element, attrs) {

                $timeout(function() {
                    element.children()[1].style.backgroundColor = '#' + scope.hexcolor;
                }, 100)


                element.click(function(e) {
                    e.preventDefault();
                    console.log('Hey')
                    element.children()[0].checked = !element.children()[0].checked;
                    element.addClass('labelstyle-' + scope.hexcolor)
                    element.toggleClass('selected')
                })

            }
        }
    })