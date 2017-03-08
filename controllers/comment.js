var Category = require("../database/models/category");
var List = require("../database/models/list");
var Comment = require("../database/models/comment");
var User = require("../database/models/user");
//提出问题
exports.question = function(req, res) {
        var id = req.body.id;
        var content = req.body.content;
        var userId = req.session.user._id;
        console.log(userId + "___")
        var comment = new Comment({
            content: content,
            list: id,
            from: userId
        });
        comment.save(function(err, comment) {
            if (err) {
                return console.log(err);
            }
            User.findById(userId, function(err, user) {
                if (err) {
                    return console.log(err);
                }
                user.comment.push(comment._id);
                user.save(function(err) {
                    if (err) {
                        return console.log(err)
                    }
                })
            });
            List.findById(id, function(err, list) {
                if (err) {
                    return console.log(err);
                }
                list.comment.push(comment._id);
                list.save(function(err) {
                    if (err) {
                        return console.log(err)
                    }
                })
            })
            res.send({
                message: "success"
            })
        })
    }
    //根据是否为管理员来判断，如果是管理员，就获取所有问答，如果不是，就只获取自己提的所有问题
exports.list = function(req, res) {
        if (req.params.id) {
            User.findOne({
                    _id: req.params.id
                })
                .populate({
                    path: "comment comment.from"
                })
                .sort('meta.updateAt')
                .exec(function(err, user) {
                    if (err) {
                        return console.log(err);
                    }
                    res.render("comment/myComment", {
                        comments: user.comment
                    })
                })
        } else {
            Comment.find({})
                .populate("from")
                .sort('meta.updateAt')
                .exec(function(err, comments) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(comments)
                    res.render("comment/list", {
                        comments: comments
                    })
                })
        }
    }
    //管理员回复
exports.reply = function(req, res) {
        var data = req.body;
        console.log(data);
        Comment.findById(data.id, function(err, comment) {
            if (err) {
                return console.log(err);
            }
            comment.reply.push({
                from: data.from,
                to: data.to,
                content: data.content
            });
            comment.save(function(err) {
                if (err) {
                    return console.log(err);
                }
                res.send({
                    message: "success"
                });
            })
        });
    }
    //查看提问的详细页面
exports.detail = function(req, res) {
    var id = req.params.id;
    Comment.findOne({
            _id: id
        })
        .populate("list from reply.from")
        .exec(function(err, comment) {
            if (err) {
                return console.log(err)
            }
            List.findOne({
                    _id: comment.list._id
                })
                .populate("category")
                .exec(function(err, list) {
                    if (err) {
                        return console.log(err)
                    }
                    res.render("comment/detail", {
                        comment: comment,
                        category: list.category
                    })
                })
        })
}