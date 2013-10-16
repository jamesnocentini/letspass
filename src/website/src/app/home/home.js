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
    'lp-user-service',
        'issue-service'
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
.controller( 'HomeCtrl', function HomeController( $scope, socket, ruser, Issue ) {


        Issue.getAll().then(
            function (data) {
                console.log(data);
                $scope.issues = data;
            }
        )


            $('[data-toggle=offcanvas-right]').click(function() {
                $('.row-offcanvas').toggleClass('active-right');
            });
            $('[data-toggle=offcanvas-left]').click(function() {
                $('.row-offcanvas').toggleClass('active-left');
            });
            $('[data-toggle="popover"]').popover(
                {
                    trigger: 'hover',
                    html: true
                }
            );

        $('.oembed').embedly({key: '5eec7cc8fc574a09b4d312009f9fef9b'});


        $scope.tags = [
            {
                color: 'cccccc',
                title: 'javascript'
            },
            {
                color: 'bfd4f2',
                title: 'canvas'
            },
            {
                color: 'fbca04',
                title: 'webworkers'
            },
            {
                color: '5319e7',
                title: 'microdata'
            },
            {
                color: 'cc317c',
                title: 'question'
            },
            {
                color: 'fc2929',
                title: 'error'
            }
        ];



        $scope.button = 'Back';
        $scope.toggleForm = function() {
            if($scope.button === 'Add New') {
                $scope.button = 'Back';
            } else {
                $scope.button = 'Add New';
            }
        };



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
                autoRequestMedia: true,
                media: {
                    audio:true
                }
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

            data = data.replace(/(\s|>|^)(https?:[^\s<]*)/igm,'$1<div><a href="$2" class="oembed">$2</a></div>');

            if(name === ruser.name) {
                $scope.messages.unshift({me: true, name: 'Me', text: data});
            } else {
                $scope.messages.unshift({me: false, name: name, text: data})
            };



			setTimeout(
				function() {
                    console.log('hey')
                    $('.oembed').embedly(
                        {
                            maxwidth: 400,
                            maxheight: 400,
                            query: {maxwidth: 300},
                            key: '5eec7cc8fc574a09b4d312009f9fef9b'
                        }
                    );
					$('#js-feed').scrollTop($('#js-feed')[0].scrollHeight);
				}, 1000
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

