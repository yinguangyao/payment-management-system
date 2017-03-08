$(function(){
		//登录处理
	$(".login").on("click",function(){
		var $this=$(this);
		var $name=$.trim($(".loginName").val());
		var $password=$.trim($(".loginPassword").val());
		$this.attr("disabled","true");
		if($name==""||$password==""){
			alert("用户名或密码不能为空");
			$this.removeAttr("disabled")
		}
		$.ajax({
			url:"/user/login",
			data:{
				name:$name,
				password:$password
			},
			type:"POST",
			dataType:"json"
		}).done(function(res){
			if(res.message=="登录成功"){
			alert(res.message);
			window.location.reload();
			$this.removeAttr("disabled")
		}else{
			alert(res.message);
			$this.removeAttr("disabled")
		}
		})
	})
	//注册处理
	$(".register").on("click",function(){
		var $this=$(this);
		var $name=$.trim($(".registerName").val());
		var $password=$.trim($(".registerPassword").val());
		var $confirmPassword=$.trim($(".confirmPassword").val());
		var $sex=$.trim($(".userSex:checked").val());
		var $class=$.trim($("#class").val());
		var $identity=$.trim($("#identity").val());
		var $studentId=$.trim($("#studentId").val());
		$this.attr("disabled","true");
		if($name==""||$password==""||$confirmPassword==""||$sex==""||$class==""||$identity==""||$studentId==""){
			alert("任何一项都不能为空");
			$this.removeAttr("disabled")
		}
		if($password!=$confirmPassword){
			alert("前后密码输入不一致");
			$this.removeAttr("disabled");
		}
		$.ajax({
			url:"/user/register",
			data:{
				name:$name,
				password:$password,
				studentId:$studentId,
				sex:$sex,
				class:$class,
				identity:$identity
			},
			type:"POST",
			dataType:"json"
		}).done(function(res){
			if(res.message=="注册成功"){
			alert(res.message);
			window.location.reload();
			$this.removeAttr("disabled");
		}else{
			alert(res.message);
			$this.removeAttr("disabled")
		}
		})
	})
	//用户密码修改
	$("#editUserSubmit").click(function(){
		$(this).attr("disabled","true");
		var $oldPassword=$.trim($("#oldPassword").val()),
		$newPassword=$.trim($("#newPassword").val()),
		$confirmNewPassword=$.trim($("#confirmNewPassword").val());
		if($oldPassword==""||$newPassword==""||$confirmNewPassword==""){
			alert("任何一项不能为空");
			$(this).removeAttr("disabled");
			return;
		}
		if($newPassword!=$confirmNewPassword){
			alert("前后密码输入不一致");
			$(this).removeAttr("disabled");
			return;
		}
		$.ajax({
			url:"/user/update",
			type:"post",
			data:{
				oldPassword:$oldPassword,
				newPassword:$newPassword,
				confirmNewPassword:$confirmNewPassword,
				id:$("#userId").val()
			},
			dataType:"json"
		})
		.done(function(res){
			if(res.message=="success"){
				alert("修改成功");
				$(this).removeAttr("disabled");
				history.back(-1);
			}else{
				alert(res.message);
				$(this).removeAttr("disabled");
			}
		})
	});
})