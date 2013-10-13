var express     =       require('express');
var UM          =       require('./controllers/user-manager');
var GM          =       require('./controllers/group-manager');

var auth = require('./auth').authRequired;


module.exports = function(app) {

    require('./auth').routes(app);

    app.get('/1.0/autologin', auth, UM.login);


};