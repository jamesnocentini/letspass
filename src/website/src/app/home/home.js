/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'ngBoilerplate.home', [
  'ui.state',
  'plusOne',
  'lp-socket-service',
		'lp-user-service'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
	url: '/home',
	views: {
	  "main": {
		controller: 'HomeCtrl',
		templateUrl: 'home/home.tpl.html'
	  }
	},
	data:{ pageTitle: 'Home' },
      resolve: {
          ruser: ['user', function(user) {
              return user.autologin('login');
          }]
      }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'HomeCtrl', function HomeController( $scope, socket, ruser ) {

        if (window.mozRTCPeerConnection) {
            $scope.webrtc_browser = true;
        } else if (window.webkitRTCPeerConnection) {
            $scope.webrtc_browser = true;
        } else {
            $scope.webrtc_browser = false;
        }

		$scope.messages = [];

		// on connection to server, ask for user's name with an anonymous callback
		socket.on('connect', function(){
			// call the server-side function 'adduser' and send one parameter (value of prompt)
			socket.emit('adduser', ruser.name);
		});


        $scope.offerWebRTC = function(to) {

            var data = {from: ruser.name, to: to};
            socket.emit('webRTC', data);

            var webrtc = new SimpleWebRTC({
                // the id/element dom element that will hold "our" video
                localVideoEl: 'localVideo',
                // the id/element dom element that will hold remote videos
                remoteVideosEl: 'remoteVideos',
                // immediately ask for camera access
                autoRequestMedia: true
            });

            webrtc.on('readyToCall', function () {
                // you can name it anything
                webrtc.joinRoom('test');
            });
        }

        socket.on('webRTCReceived', function() {
            $scope.answering_webrtc = true;
        });

        $scope.accept_webrtc = function() {
            $scope.answering_webrtc = false;
            var webrtc = new SimpleWebRTC({
                // the id/element dom element that will hold "our" video
                localVideoEl: 'localVideo',
                // the id/element dom element that will hold remote videos
                remoteVideosEl: 'remoteVideos',
                // immediately ask for camera access
                autoRequestMedia: true
            });

            webrtc.on('readyToCall', function () {
                // you can name it anything
                webrtc.joinRoom('test');
            });
        };

		socket.on('updatechat', function (name, data) {
            if(name === ruser.name) {
                $scope.messages.push({me: true, name: 'Me', text: data});
            } else {
                $scope.messages.push({me: false, name: name, text: data})
            }

			setTimeout(
				function() {
					$('#js-feed').scrollTop($('#js-feed')[0].scrollHeight);
				}, 100
			)
		});

		$scope.sendMessage = function(text) {
			$scope.message = '';
			socket.emit('sendchat', text);
			console.log($('#js-feed')[0].scrollHeight)
			setTimeout(
				function() {
					$('#js-feed').scrollTop($('#js-feed')[0].scrollHeight);
				}, 100
			)

		};

		$scope.users = {};
		socket.on('updateusers', function(usernames) {
			$scope.users = usernames;
		});


})

;

