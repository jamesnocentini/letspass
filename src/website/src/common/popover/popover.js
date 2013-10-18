angular.module('popover', [])

//the jquery popover plugin takes html content a one argument
//the list of hangouts, however is placed in a directive template
//so we compile the directive in the popover link function and
//then pass it to the popover plugin

.directive('popover', function($compile) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var ele = angular.element('<div plus-one></div>');
            var computer = $compile(ele)(scope);
            setTimeout(function() {
                $(element).popover({trigger: 'click', content: computer[0].innerHTML, html: true});
            }, 800);
        }
    }
});