var Issues = db.collection('issues');

exports.newIssue = function(req, res) {
    var issue = req.body;
    issue.user_name = req.user.name;
    issue.user_id   = req.user._id;
    Issues.insert(issue, function (err, doc) {
        res.status(200).send('ok');
    });
};

exports.getIssues = function(req, res) {
    Issues.find({group: req.params.group}).toArray(function(err, docs) {
        res.status(200).send(docs);
    })
}