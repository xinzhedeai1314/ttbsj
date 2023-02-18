/**
 * @file 公用方法js文件
 * @author zhaojunbao
 * @date: 2017年12月6日13:45:14
 * @version: V1.0
 */
'use strict';

/**
 * 常用提示信息集中配置
 */
var REMIND_MSG = {
	'NO_DATA' : '没有相关数据'	
};

/**
 * datagrid查询数据为空时，返回符合标准的数据为空的结构对象
 */
var EMPTY_DATA = {
		'total' : 0,
		'summarys' : null,
		'rows' : []
	};
/*var userInfo = getCookie('userInfo');
if (!userInfo) {
	window.parent.location.href = '/admin/login.html';
}else{
	userInfo = $.parseJSON(userInfo);
}
*/


/*$.ajaxPrefilter( function( options, originalOptions, jqXHR ) { 
	var accessToken = getCookie('access-token'), lang = getCookie('userLanguage');
	if (accessToken != null) jqXHR.setRequestHeader("access-token", accessToken);
	if (lang != null) jqXHR.setRequestHeader("Accept-Language", lang);
 });*/
var util = util || {};
util.ajaxPostCus = function(url, reqParams, callback) {
	$.ajax({
//        async: _async,
        url: contextPath + url,
        timeout:600000,//超时60秒
        data: reqParams, //{ "Alias": $("#PmuAlias").val(), "Name": $("#PmuName").val() },
        dataType: 'json',
        //ifModified:true, 
        type: "POST",
        cache: false,
        complete:function(res){
           // $load.removeClass('progressBar').addClass('progressBarNone');
           // $(".deviceback_opacity").hide();
        },
        dataFilter: function (data) {
        	var resObj = $.parseJSON(data);
        	if (resObj.errCd === -600) {
        		delCookie('access-token');
        		location.href = contextPath + '/error/time-out.html';//登录超时跳转页面
		    }else{
		    	return data;
		    }
        },
        success: callback,
        error: function (XMLHttpRequest, textStatus, errorThrown){
        	layer.alert(textStatus);
        }
    });
}
util.getUserList = function(){
	$('.user_id').combobox({//国家列表获取
	    textField: 'user_name',
	    valueField: 'user_id',
	    url : contextPath + '/userAction/getAllUserList.action',
	    loadFilter : function(data) {
			var result = data.result || [];
        	return result;
		},
		 onLoadSuccess: function () { //数据加载完毕事件
         },
		onSelect:function(data){ 
		}
	});
	console.log(this);
	return this;
}

util.getAlbumList = function(){
	$('.album_id').combobox({//所有专辑列表
	    textField: 'album_name',
	    valueField: 'album_id',
	    url : contextPath + '/albumAction/getAllAlbumList.action',
	    loadFilter : function(data) {
			var result = data.result || [];
        	return result;
		},
		onLoadSuccess: function () { //数据加载完毕事件
         },
		onSelect:function(data){ 
			var url = contextPath + '/albumAction/getAllAlbumList.action?parent_id=' + data.album_id; 
			$('.album_id_lv2').combobox('clear').combobox('reload', url);; //清除原来的数据重新载入数据
		}
	});
	return this;
}
/**
 * 获取二级专辑
 */
util.getAlbumLv2List = function(){
	$('.album_id_lv2').combobox({//所有专辑列表
	    textField: 'album_name',
	    valueField: 'album_id',
//	    url : contextPath + '/albumAction/getAllAlbumList.action',
	    loadFilter : function(data) {
			var result = data.result || [];
        	return result;
		},
		 onLoadSuccess: function () { //数据加载完毕事件
         },
		onSelect:function(data){ 
		}
	});
	return this;
}
/**
 * 重新加载网格数据并清空已选择的数据
 * @param type{ALL:重新加载并清空选中状态 CLEAR:只清空选中状态 RELOAD:只重新加载网格数据}
 * @returns {调用该方法的原对象}
 */
util.datagrid = function(type){
	var $datagrid = $('article').find('div.datagrid-view2').next();
	switch (type){
		case 'ALL':
			$datagrid.datagrid('uncheckAll').datagrid('unselectAll')
			 .datagrid('clearSelections').datagrid("clearChecked")
			 .datagrid('load', $.serializeObject($('#searchForm')));
			break;
		case 'RELOAD':
			$datagrid.datagrid('load', $.serializeObject($('#searchForm')));
			break;
		case 'CLEAR':
			$datagrid.datagrid('uncheckAll').datagrid('unselectAll')
			 		.datagrid('clearSelections').datagrid("clearChecked");
			break;
		case 'RESIZE':
			$datagrid.datagrid('resize');
			break;
		default :
			$datagrid.datagrid('uncheckAll').datagrid('unselectAll')
			 .datagrid('clearSelections').datagrid("clearChecked")
			 .datagrid('load', $.serializeObject($('#searchForm')));
			break;
	}
	return this;
}
/**
 * targetForm:表单对象选择字符串
 * type:表单操作类型
 * data:待填充到表单的数据对象
 */
util.form = function(targetForm, type, data){
	var $form = $(targetForm);
	switch (type){
		case 'RESET':
			$form.form('reset');
			break;
		case 'LOAD':
			$form.form('load', data);
			break;
		case 'CLEAR':
			$form.form('clear');
			break;
	}
	return this;
}
$(function(){//页面加载后常用公用功能提取
	$('.btn-success', '#searchForm').click(function(){//按条件搜索
		util.datagrid('RELOAD');
	});
	$('.btn-danger', '#searchForm').click(function(){//清空表单
		util.form('#searchForm', 'RESET');
		util.datagrid('RELOAD');
	});
	$(window).resize(function() {//调整窗体大小同时也调整网格的大小
		setTimeout(util.datagrid('RESIZE'), 600);
	});	
	//回到顶部公用代码
	$('body').append('<a class="goTop"></a>');
    $(window).scroll(function () {
        $(document).scrollTop() != 0 ? $(".goTop").fadeIn("slow") : $(".goTop").fadeOut("slow");
    });
	$(".goTop").click(function () {
	    $("html, body").animate({ scrollTop: 0 }, 300);//经过300ms回到顶部
	});
})
/**
 * 
 * @functionName: getIdsDatagridEasyUI
 * @Description: 获得datagrid中选中行的ids
 * @author: Double
 * @param: idFields [idField1, idField2, ...]
 * 
 */
jQuery.fn.getIdsDatagridEasyUI = function() {
	if (arguments.length === 1) {
		var rows = $(this).datagrid('getChecked'), idFields = arguments[0], ids = [];
		rows = rows.length ? rows : $(this).datagrid('getRows');
		for (var i=0; i<rows.length; i++) {
			if (idFields.length > 1) {
				var obj = new Object();
				for (var j=0; j<idFields.length; j++) {
					obj[idFields[j]] = rows[i][idFields[j]];
				}
				ids.push(obj);
			} else {
				ids.push(rows[i][idFields[0]]);
			}
		}
		$(this).datagrid('clearChecked');
		return JSON.stringify(ids);
	} else {
		$xcAlert("getIdsDatagridEasyUI : 参数错误, 支持1个参数(idFields)", $xcAlert.typeEnum.error);	
	}
} 