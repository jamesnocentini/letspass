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


        setTimeout(function() {
            $('#js-feed').slimScroll({
                height: '500px'
            });
            $('#js-buddy-list').slimScroll({
                height: '500px'
            });
            $('#js-helping-others').slimScroll({
                height: '250px'
            });
        }, 500);



        // OpenTok credentials
        var apiKey = '44285682';
        var secret = '24f997d6218bd292bf7a2a5deb11d2bc97c8a008';

        // Embedly API Key
        $.embedly.defaults.key = '5eec7cc8fc574a09b4d312009f9fef9b';

        //message array to hold the list of messages
        $scope.messages = [];

        $scope.joinSession = function(sessionId) {
            // Initializes the session and return the Session object
            var session = TB.initSession(sessionId);

            // Token Params
            var secondsInDay = 86400;
            var timeNow = Math.floor(Date.now()/1000);
            var expire = timeNow+secondsInDay;
            var role = "publisher";
            var data = "bob";

            var rand = Math.floor(Math.random()*999999);
            var dataString =  "session_id="+sessionId+"&create_time="+timeNow+"&expire_time="+expire+"&role="+role+"&connection_data="+data+"&nonce="+rand;

            // Encryption - using jquery plugin
            var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA1, secret);
            hmac.update( dataString );
            hash = hmac.finalize();

            preCoded = "partner_id="+apiKey+"&sig="+hash+":"+dataString;
            // This token is send to the opentok API when connecting to a session
            var token = "T1=="+$.base64.encode( preCoded );

            // Connect to a session
            session.connect(apiKey, token);

            //When connected publish the local stream
            session.on('sessionConnected', function(event) {
                session.publish('myCamera', { publishVideo: true, width: 150, height: 113});
                addStreams(event.streams);
            });

            //When a stream has been added subscribe to it
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
        };

        //Get all issues from node api
        Issue.getAll().then(
            function (data) {
                $scope.issues = data;
            }
        )

        //Bootstrap - jQuery code to enable the off-canvas layout
        $('[data-toggle=offcanvas-right]').click(function() {
            $('.row-offcanvas').toggleClass('active-right');
        });
        $('[data-toggle=offcanvas-left]').click(function() {
            $('.row-offcanvas').toggleClass('active-left');
        });

        //Init tags for the W3C. Can change later
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


        if (window.mozRTCPeerConnection) {
            $scope.webrtc_browser = true;
        } else if (window.webkitRTCPeerConnection) {
            $scope.webrtc_browser = true;
        } else {
            $scope.webrtc_browser = false;
        };

		// on connection to server, ask for user's name with an anonymous callback
		socket.on('connect', function(){
			// call the server-side function 'adduser' and send one parameter (name of user)
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

        //server notifies us of new message
		socket.on('updatechat', function (name, data) {
            console.log('FOUND LINKS IN MESSAGE :: ' + data.match(/(\s|>|^)(https?:[^\s<]*)/igm));
            //find links and replace with anchor tag - add class
            data = data.replace(/(\s|>|^)(https?:[^\s<]*)/igm,'$1<div><a target="_blank" href="$2" class="oembed">$2</a></div>');
            data = data.replace(/\r?\n/g, "<br>");


            //check if I sent the message
            if(name === ruser.name) {
                $scope.messages.unshift({me: true, name: 'Me', text: data});
            } else {
                $scope.messages.unshift({me: false, name: name, text: data})
            };

//            setTimeout(function() {
//                $('#js-feed').slimScroll({
//                    height: '200px'
//                });
//            }, 500);


			setTimeout(
				function() {
//                    $('.oembed').embedly(
//                        {
//                            maxwidth: 400,
//                            maxheight: 400,
//                            query: {maxwidth: 300},
//                            key: '5eec7cc8fc574a09b4d312009f9fef9b'
//                        }
//                    );
                    $('.oembed').embedly(
                        {
                            display: function(obj) {
                                //Overwrite the default display
                                if (obj.type === 'video' || obj.type === 'rich') {
                                    //Figure out the percent ratio for the padding. This is
                                    //(height / width) * 100
                                    var ratio = ((obj.height/obj.width)*100).toPrecision(4) + '%';

                                    //Wrap the embed in a responsive object div. See the CSS here!
                                    var div = $('<div class="responsive-object">').css({
                                        paddingBottom: ratio
                                    });

                                    //Add the embed to the div
                                    div.html(obj.html);

                                    //Replace the element with the div
                                    $(this).replaceWith(div);
                                }
                            }
                        }
                    );
					$('#js-feed').scrollTop($('#js-feed')[0] = 0);
				}, 100
			)
		});

        //send message to server and reset textarea
		$scope.sendMessage = function(text) {
			$scope.message = '';
            text = text.replace(/\r?\n/g, "<br>");
			socket.emit('sendchat', text);
		};

        //initialize the users object
		$scope.users = {};
        //receives list of users connected from server
		socket.on('updateusers', function(usernames) {
			$scope.users = usernames;
		});

        //initialize the new_issue object
        $scope.new_issue = {};
        $scope.new_issue.labels = {};

        //Show - Hide the form to add an Issue
        $scope.button = 'Add New';
        $scope.toggleForm = function() {
            if($scope.button === 'Add New') {
                $scope.button = 'Back';
            } else {
                $scope.button = 'Add New';
            }
        };

        //create a new issue
        $scope.createIssue = function() {
           var data = {title: $scope.new_issue.title, labels: []};
           //loop new_issue (looking for selected tags)
           for (key in $scope.new_issue.labels) {
               if(!$scope.new_issue.labels[key]) {

               } else {
                   data.labels.push($scope.new_issue.labels[key])
               }
           };


            //post request to get a sessionId from opentok api
            $http(
                {
                    method: 'POST',
                    url: 'https://api.opentok.com/hl/session/create',
                    headers: {'X-TB-PARTNER-AUTH': apiKey + ':' + secret}
                }
            ).then(function(result) {
                    console.log('XML received :: ' + result);
                    return result.data;
                })
                .then(
                function(xml_string) {
                    //parse xml
                    if (window.DOMParser) {
                        parser=new DOMParser();
                        xmlDoc=parser.parseFromString(xml_string,"text/xml");
                    } else  { // Internet Explorer
                        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                        xmlDoc.async=false;
                        xmlDoc.loadXML(xml_string);
                    }

                    var sessionId = xmlDoc.getElementsByTagName('session_id')[0].textContent;
                    console.log('SESSIONID is :: ' + sessionId);
                    //attach sessionId to data object
                    data.sessionId = sessionId;

                    //post the data object to server to create issue
                    Issue.createIssue(data)
                        .then(function(res) {
                            //Get all issues from node api
                            Issue.getAll().then(
                                function (data) {
                                    $scope.issues = data;
                                    $scope.button = 'Add New';
                                }
                            )
                        },
                        function(err) {

                        })
                });
        };

})
;

