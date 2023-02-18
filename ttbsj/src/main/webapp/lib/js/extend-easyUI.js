'use strict';

/**
 * 
 * @functionName: 
 * @Description: datagrid a 元素动画效果
 * @author: Double
 * @param: 
 * 
 */
//$(document).on('mouseenter', 'div.datagrid-body div.datagrid-cell a', function() {
//	$(this).text('[' + $(this).text() + ']');
//});
//$(document).on('mouseleave', 'div.datagrid-body div.datagrid-cell a', function() {
//	$(this).text($(this).text().replace('[', '').replace(']', ''));
//});

//easyUI验证扩展
//说明: easyUI自带验证有以下4个,有其他需要的在此处扩展
//	a. email：匹配E-Mail的正则表达式规则。
//	b. url：匹配URL的正则表达式规则。
//	c. length[0,100]：允许在x到x之间个字符。
//	d. remote['http://.../action.do','paramName']：发送ajax请求需要验证的值，当成功时返回true。
$.extend($.fn.validatebox.defaults.rules, {
	remote: {
		validator: function(value, url) {
			if($(this).next().has('textMark') && value == $(this).next().text()) {
				return true;
			} else {
				var data = {};
				data[this.name] = value;
				var response = $.ajax({
					url: contextPath + url[0],
					dataType: 'json',
					data: data,
					async: false,
					cache: false,
					type: 'post'
				}).responseText;
				response = $.parseJSON(response);
				return (response && response.errCd === 0 && response.result && response.result.success);
			}
		},
		message: '此名称已被占用'
	},
	equals: {    
        validator: function(value, param){    
            return value == $(param[0]).val();    
        },    
        message: '两次输入的密码不相同'   
    },   
	code: {
		validator: function(value) {
			return /^[0-9a-zA-Z\-_,.\s　]+$/.test(value); 
		},
		message: '只能填写字母、数字、下划线'
	},   
	chinese: {
		validator: function(value) {
			return /^[\u4e00-\u9fa5\-_，。\（）\s　]*$/.test(value); 
		},
		message: '只允许中文'
	},/*
	japanese: {
		validator: function(value) {
			return /^[\u0800-\u9fa5\-_、。\（）\s　]*$/.test(value); 
		},
		message: '只允许日文'
	},*/
	english: {
		validator: function(value) {
			return /^[0-9A-Za-z\-_,.:\""\&\()\s　]+$/.test(value); 
		},
		message: '只能填写英文、数字'
	},   
	integer: {
		validator: function(value) {
			return /^[+]?[0-9]+\d*$/.test(value); 
		},
		message: '只能填写整数'
	},
	number: {
		validator: function(value) {
			return /^([1-9]\d{0,3}|10000)$/.test(value); 
		},
		message: '只能填写1-8000整数'
	},
	decimal: {
		validator: function(value) {
			return /^\d{1,7}\.?\d{0,2}$/.test(value); 
		},
		message: '小数点后面最多填写两位'
	},
	decimalthree: {
		validator: function(value) {
			return /^\d{1,9}\.?\d{0,3}$/.test(value); 
		},
		message: '小数点后面最多填写三位'
	}, 
	decimalfour: {
		validator: function(value) {
			return /^\d{1,5}\.?\d{0,4}$/.test(value); 
		},
		message: '小数点后面最多填写四位'
	},  
	zip: {
		validator: function(value) {
			return /^\d{6,7}$/.test(value); 
		},
		message: '请输入正确邮编'
	},
	faxno: {
		validator: function(value) {
			return  /^(?!-)[0-9\-]{5,20}$/.test(value); 
		},
		message: '请输入正确传真号'
	}, 
	phone: {
		validator: function(value) {
			return  /^(13|15|18)\d{9}$/i.test(value);
		},
		message: '请输入正确手机号'
	},
	oneInteger: {
		validator: function(value) {
			return /^[+]?[1-9]+\d*$/.test(value); 
		},
		message: '只能填写1-9整数'
	},
	/*text: {
		validator: function(value) {
			return  /^[\u4e00-\u9fa5\-_，。\（）\s　]*$/.test(value); 
		},
		message: '含有非法字符'
	},*/
	idcard: {// 验证身份证
        validator: function (value) {
            return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value);
        },
        message: '身份证号码格式不正确'
    },
    name : {// 验证姓名，可以是中文或英文 
        validator : function(value) { 
            return /^[\Α-\￥]+$/i.test(value)|/^\w+[\w\s]+\w+$/i.test(value); 
        }, 
        message : '请输入姓名' 
    },
    ephone : {// 验证姓名，可以是中文或英文 
        validator : function(value) { 
            return /^(13|15|18)\d{9}$/i.test(value) | /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value); 
        }, 
        message : '手机号或邮箱' 
    },
    chinen : {// 匹配中文，英文字母和数字及_ 
        validator : function(value) { 
            return /^[\u4e00-\u9fa50-9A-Za-z,，；！。\.;\:"'!]+$/.test(value); 
        }, 
        message : '含有非法字符' 
    },
    
});

/**
 * @functionName: hideAllValidation
 * @Description: 隐藏easyui的所有验证红框
 * @author: Double
 */
jQuery.fn.hideAllValidation = function() {
	$(this).find('.validatebox-invalid').removeClass('validatebox-invalid').end().find('.textbox-invalid').removeClass('textbox-invalid');
} 

$(function() {
	//消除验证红框
	$('form').hideAllValidation();
	
	//点击查询按钮，datagrid clear chenked
	$('.searchForm').prev('.searchBtns').children('button:eq(0)').click(function() {
		$('#' + $('.acticle .datagrid:eq(0) .datagrid-view').children('table').attr('id')).datagrid('clearChecked');
	});
	
	//所有验证的时间间隔为1000ms
	if ($('.easyui-validatebox').length) {
		$('.easyui-validatebox').validatebox('options').missingMessage = '该字段是必需的';

	}
	
});