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
.controller( 'HomeCtrl', function HomeController( $scope, socket, ruser, Issue, $http ) {




        var apiKey = '44285682';

        var secret = '24f997d6218bd292bf7a2a5deb11d2bc97c8a008';

//        var sessionId = '2_MX40NDI4NTY4Mn5-VGh1IE9jdCAxNyAwMzo1NDo1NSBQRFQgMjAxM34wLjYxMjIwOTc0fg';




        $scope.joinSession = function(sessionId) {
            var session = TB.initSession(sessionId);



            // Token Params
            var secondsInDay = 86400;
            var timeNow = Math.floor(Date.now()/1000);
            var expire = timeNow+secondsInDay;
            var role = "publisher";
            var data = "bob";

//        data = escape(data);
            var rand = Math.floor(Math.random()*999999);
            var dataString =  "session_id="+sessionId+"&create_time="+timeNow+"&expire_time="+expire+"&role="+role+"&connection_data="+data+"&nonce="+rand;

            // Encryption
            var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA1, secret);
            hmac.update( dataString );
            hash = hmac.finalize();

            preCoded = "partner_id="+apiKey+"&sig="+hash+":"+dataString;
            var token = "T1=="+$.base64.encode( preCoded );


            session.connect(apiKey, token);



            session.on('sessionConnected', function(event) {
                session.publish('myCamera', { publishVideo: true, width: 150, height: 113});
                addStreams(event.streams);
            });

            session.on('streamCreated', function (event) {

                addStreams(event.streams);

            });

            function addStreams(streams) {
                for (var i = 0; i< streams.length; i++) {
                    if (streams[i].connection.connectionId != session.connection.connectionId) {
                        session.subscribe(streams[i], 'remote' + i, { width: 150, height: 113});
                    }
                }
            };
        }




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



        $scope.button = 'Add New';
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
        };

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

            console.log('LINK :: ' + data.match(/(\s|>|^)(https?:[^\s<]*)/igm));

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

        $.valHooks.textarea = {
            get: function(elem) {
                return elem.value.replace(/\r?\n/g, "\r\n");
            }
        };

        $scope.checkForLinks = function() {

            var links = $scope.post.message.match(/(\s|>|^)(https?:[^\s<]*)/igm);

            if(!links) {

                $scope.preview.message = $scope.post.message.replace(/\r?\n/g, "<br>");

            } else {

                var data = $scope.post.message.replace(/(\s|>|^)(https?:[^\s<]*)/igm,'$1<div><a href="$2" class="oembed">$2</a></div>');

                $scope.preview.message = data;
                setTimeout(
                    function() {
                        console.log('hey')
                        $('.oembed').embedly(
                            {
                                maxwidth: 400,
                                maxheight: 400,
                                query: {maxwidth: 50},
                                key: '5eec7cc8fc574a09b4d312009f9fef9b'
                            }
                        );
                        $('#js-feed').scrollTop($('#js-feed')[0].scrollHeight);
                    }, 1000
                )


//                var deferred = $.embedly.extract(links, {
//
//                }).progress(function (data) {
//
//                }).done(function(results) {
//                        console.log(results);
//                        $scope.$apply(function() {
//                                $scope.preview.message = $scope.post.message.replace(/\r?\n/g, "<br>")
//                        });
//                });
            }
        }

        $scope.preview = {};
        $scope.post = {};

        $.embedly.defaults.key = '5eec7cc8fc574a09b4d312009f9fef9b';

        var deferred = $.embedly.extract('http://google.com', {

        }).progress(function (data) {

        }).done(function(results) {
                console.log(results);
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

        $scope.new_issue = {};

        $scope.createIssue = function() {

           var data = {title: $scope.new_issue.title, labels: []};
           for (key in $scope.new_issue) {
               if(!$scope.new_issue[key]) {

               } else {
                   data.labels.push($scope.new_issue[key])
               }
           };


            $http(
                {
                    method: 'POST',
                    url: 'https://api.opentok.com/hl/session/create',
                    headers: {'X-TB-PARTNER-AUTH': apiKey + ':' + secret}
                }
            ).then(function(result) {
                    console.log('Hey', result);
                    return result.data;
                })
                .then(
                function(xml_string) {

                    console.log('Hey', data)

                    if (window.DOMParser)
                    {
                        parser=new DOMParser();
                        xmlDoc=parser.parseFromString(xml_string,"text/xml");
                    } else  { // Internet Explorer
                        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                        xmlDoc.async=false;
                        xmlDoc.loadXML(xml_string);
                    }
                    console.log('Session ID: ', xmlDoc.getElementsByTagName('session_id')[0].textContent);

                    var sessionId = xmlDoc.getElementsByTagName('session_id')[0].textContent;
                    data.sessionId = sessionId;

                    console.log(data)

                    Issue.createIssue(data)
                        .then(function() {

                        },
                        {

                        })
                },
                function(err) {

                }
            )






        }


})

;

