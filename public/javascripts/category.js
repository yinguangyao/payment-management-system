$(function() {
	//添加分类
	$(".addCategory").click(function() {
		$(this).attr("disabled", "true");
		var $name = $.trim($(".CategoryName").val());
		var $description = $.trim($(".CategoryDescription").val());
		if ($name == "") {
			alert("分类名不能为空");
			$(this).removeAttr("disabled");
		}
		$.ajax({
				url: "/category/add",
				type: "POST",
				dataType: "json",
				data: {
					name: $name,
					description: $description,
					lists: []
				}
			})
			.done(function(res) {
				if (res.message == "success") {
					alert("添加成功");
					window.location.reload();
					$(this).removeAttr("disabled");
				} else {
					alert(res.message);
					$(this).removeAttr("disabled");
				}
			})
	});
})