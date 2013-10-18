angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'letspass.login',
  'ui.state',
  'ui.route',
  'lp-socket-service',
  'lp-user-service',
        'popover',
        'highlight',
        'labelIssue',
        'issue-service'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider, $locationProvider ) {
    $urlRouterProvider.otherwise( '/login' );

    $locationProvider.html5Mode(true);
})

.run( function run () {




})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | AC 100' ;
    }
  });


    console.log(window.innerHeight);
        var height = window.innerHeight;
        setTimeout(function() {
//            document.getElementById('js-buddy-list').style.height = height - 120 + 'px';
//            document.getElementById('js-feed').style.height = height - 40 - 55 + 'px';
//            document.getElementById('js-helping-others').style.height = height / 2 - 80 + 'px';
//            document.getElementById('js-webrtc').style.height = height / 2 - 80 + 'px';
        }, 500)
//    $scope.$watch($scope.height, function() {
//        console.log('HEY')
//    })

})

;

