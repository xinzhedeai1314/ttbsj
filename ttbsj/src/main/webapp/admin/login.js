/**
 * @file 后台登陆页面js
 * @author dabao 
 * @date: 2017年12月6日10:53:12
 * @version: V1.0
 */
$(function(){
	$("article").slide({
		titCell : ".hd ul",
		mainCell : ".bd ul",
		effect : "fold",
		autoPlay : true,
		autoPage : true,
		trigger : "click"
	});
	$("#send-btn").click(function(){// 首页
		loginFun();
	});
	$("#ok").click(function(){// 首页
		loginFun();
	})
	$("#password").keypress(function(e){ //回车键登录
		if(e.which==13){ 
			loginFun();
		} 
	});
})
	function loginFun() {
		$.post('../userAction/login.action', $('form').serialize(), function(result) {
			if (result.success) {
				var userInfo = result.result;
				setCookie('userInfo', JSON.stringify(userInfo));
				console.info(userInfo);
				location.href = 'main/main.html';
			} else {
				alert(result.msg);
			}
		}, "JSON");
	}
