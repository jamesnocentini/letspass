var User = db.collection('user');

exports.login = function(req, res) {
    res.status(200).send(req.user);
};