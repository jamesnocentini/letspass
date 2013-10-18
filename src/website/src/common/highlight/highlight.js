angular.module('highlight', [])

.directive('highlight', function($timeout) {
        return {
            restrict: 'A',
//            templateUrl: 'highlight/highlight.tpl.html',
            scope: {
                hexcolor: '@',
                title: '@'
            },
            link: function(scope, element, attrs) {

                scope.tag_name = true;

                $timeout(function() {
                    element.children()[1].style.backgroundColor = '#' + scope.hexcolor;
                }, 100)


                element.click(function(e) {
                    e.preventDefault();
                    scope.$apply(element.children()[0].checked = !element.children()[0].checked);
                    element.addClass('labelstyle-' + scope.hexcolor)
                    element.toggleClass('selected')
                    console.log(scope.tag_name)
                })

            }
        }
    })