var Issues = db.collection('issues');

exports.newIssue = function(req, res) {
    var issue = req.body.issue;
    issue.user_name = req.user.name;
    issue.user_id   = req.user._id;
    Issues.insert(issue, function (err, doc) {
        res.redirect('/home');
    });
};

exports.getIssues = function(req, res) {
    Issues.find().toArray(function(err, docs) {
        res.status(200).send(docs);
    })
}