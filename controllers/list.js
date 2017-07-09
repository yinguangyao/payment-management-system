var List = require("../database/models/list");
var Category = require("../database/models/category");
var Comment = require("../database/models/comment");
//在分类下面删除一条记录
exports.delete = function(req, res) {
		var id = req.query.id,
			categoryId = req.query.categoryId;
		if (id) {
			List.findById(id, function(err, list) {
				if (err) {
					return console.log(err)
				}
				Comment.remove({
						_id: {
							$in: list.comment
						}
					})
					.exec(function(err) {
						if (err) {
							return console.log(err);
						}
						List.delete(id, function(err) {
							res.redirect("/category/list/" + categoryId);
						});

					})
			})
		}
	}
	//获取所有记录
exports.all = function(req, res) {
		List.find({})
			.populate({
				path: "category"
			})
			.exec(function(err, list) {
				if (err) {
					return console.log(err)
				}
				console.log(list)
				res.render("list/all", {
					list: list
				})
			})
	}
	//在所有记录里面删除一条记录
exports.allDelete = function(req, res) {
		var id = req.params.id;
		List.findById(id, function(err, list) {
			if (err) {
				return console.log(err)
			}
			Comment.remove({
					_id: {
						$in: list.comment
					}
				})
				.exec(function(err) {
					if (err) {
						return console.log(err);
					}
					List.delete(id, function(err) {
						res.redirect("/list/all");
					});

				})
		})
	}
	//查看记录详情
exports.view = function(req, res) {
		var id = req.params.id;
		Category.fetch(function(err, categories) {
			if (err) {
				console.log(err);
			}
			List.findOne({
					_id: id
				})
				.populate({
					path: "category comment"
				})
				.exec(function(err, list) {
					if (err) {
						return console.log(err);
					}
					Comment.find({
							list: list._id
						})
						.populate({
							path: "from reply.from reply.to"
						})
						.sort("meta.updateAt")
						.exec(function(err, comments) {
							console.log(comments + "___")
							res.render("list/detail", {
								list: list,
								comments: comments
							});
						})

				});

		});

	}
	//根据是否从ajax传入了id来判断，是添加一条记录，还是修改这条记录
exports.edit = function(req, res) {
		var id = req.params.id;
		if (id) {
			List.findById(id, function(err, list) {
				if (err) {
					return console.log(err);
				}
				Category.fetch(function(err, items) {
					if (err) {
						return console.log(err);
					}
					res.render("list/edit", {
						title: "添加",
						categories: items,
						list: list
					});
				});

			})

		} else {
			Category.fetch(function(err, items) {
				if (err) {
					console.log(err);
				}
				res.render("list/edit", {
					title: "添加",
					categories: items,
					list: {}
				});
			});
		}
	}
	//保存修改或者添加后的结果，如果输入的时间格式不正确，就默认设置为当前时间
exports.save = function(req, res) {
	var _data = req.body;
	var a = /^(\d{4})-(\d{2})-(\d{2})$/; //正则表达式判断时间格式
	if (!a.test(_data.date)) {
		_data.date = Date.now();
	}
	if (_data.id) {
		List.update({
			_id: _data.id
		}, {
			$set: {
				name: _data.name,
				amount: _data.amount,
				category: _data.category,
				type: _data.type,
				createAt: _data.date,
				content: _data.content
			}
		}, function(err) {
			if (err) {
				return console.log(err);
			}
			res.send({
				message: "success"
			});
		});
	} else {
		var list = new List({
			name: _data.name,
			amount: _data.amount,
			category: _data.category,
			type: _data.type,
			createAt: _data.date,
			content: _data.content
		});
		var id = _data.category;
		list.save(function(err) {
			if (err) {
				console.log(err);
			}
			Category.findById(id, function(err, category) {
				if (err) {
					console.log(err)
				}
				category.lists.push(list._id);
				category.save(function(err) {
					if (err) {
						console.log(err);
					}
					res.send({
						message: "success"
					});
				})
			});
		});
	}
}