angular.module('popover', [])

.directive('popover', function($compile) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var ele = angular.element('<div plus-one></div>');
            var computer = $compile(ele)(scope);
            setTimeout(function() {
                $(element).popover({trigger: 'click', content: computer[0].innerHTML, html: true});
            }, 300);


        }
    }
})