var Category = require("../database/models/category");
var List = require("../database/models/list");
//获取所有分类
exports.index = function(req, res) {
		Category.fetch(function(err, items) {
			if (err) {
				console.log(err);
			}
			res.render("category/category", {
				title: "分类",
				categorys: items
			});
		});
	}
	//添加分类
exports.add = function(req, res) {
		var _body = req.body;
		var category = new Category(_body);
		category.save();
		res.send({
			message: "success"
		});
	}
	//删除分类
exports.delete = function(req, res) {
		var id = req.params.id;
		if (id) {
			Category.findById(id, function(err, category) {
				if (err) {
					return console.log(err)
				}
				List.remove({
						_id: {
							$in: category.lists
						}
					})
					.exec(function(err) {
						if (err) {
							return console.log(err);
						}
						Category.delete(id, function(err) {
							if (err) {
								return console.log(err)
							}
							res.redirect("/category");
						});
					});
			});
		}
	}
	//查看分类详情以及下面所有记录
exports.detail = function(req, res) {
	var id = req.params.id;
	console.log(req.url);
	Category.findOne({
			_id: id
		})
		.populate({
			path: "lists",
			select: "name amount type"
		})
		.sort({
			createAt: -1
		})
		.exec(function(err, item) {
			if (err) {
				console.log(err);
			}
			console.log("hello" + item + "world");
			console.log(item.lists);
			res.render("category/detail", {
				title: "详情页",
				item: item,
				id: id
			})
		});
}