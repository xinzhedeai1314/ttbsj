/**
 * @file user
 * @author zhaojunbao
 * @date: 2017年12月6日13:45:14
 * @version: V1.0
 */
'use strict';

$(function() {
	$admin.selector = {
		adminDatagrid : $('#adminDatagrid'),
		addAdminModal : $('#addAdminModal'),
		admin_form : $('.admin_form'),
	}
	var userColumns = [{
		field : 'ck',
		checkbox : true
	},{
		field : 'user_id',
		title : '管理员ID',
		width : 100,
		sortable : true,
	
	},{
		field : 'user_name',
		title : '管理员名称',
		width : 100,
		sortable : true,
	},{
		field : 'type',
		title : '管理员类型',
		width : 100,
		sortable : true
	}, {
		field : 'gender',
		title : '管理员性别',
		width : 100,
		sortable : true,
		formatter : function(value, row, index) {
			return value == '0' ? '弟兄' : '姊妹';
		}
	}, {
		field : 'create_date',
		title : '加入日期',
		width : 100,
		sortable : true,
	}, {
		field : 'last_login_date',
		title : '最近登录日期',
		width : 100,
		sortable : true,
	}, {
		field : 'state',
		title : '登录状态',
		width : 100,
		sortable : true,
	} ],
	userOptions = {
		url : contextPath + '/userAction/getAdminListByPage.action',
		columns: [userColumns],
		pagination : true,
		fitColumns : true,
		rownumbers : true,
		checkOnSelect:false,
//		width : 1307,
		idField : 'admin_id',
		pageSize : 5,
		pageNumber : 1,
//		frozenColumns : [ ],
		pageList: [5],
		loadFilter : function(data) {
			if (data != null) {
				if(data.result.rows != null){
					data = data.result;
				}else{
					layer.alert(REMIND_MSG.NO_DATA);
					data = EMPTY_DATA;
				}
			}
			return data;
		}
	};
	$admin.selector.adminDatagrid.datagrid(userOptions);
});

var $admin = {
	userDetail : function(usId) {// 用户信息详情
		$.post('/mUserAction/userDetail.action', $.param({'usId':usId}), function(res) {
			if (res.success) {
				var result = res.result;
				if (result) {
					//用户详情模态框
					$("#UserdetailModal").modal();
					$("#az-user-mDetail td:even").css("width",90);
					$("#az-user-mDetail td:odd").css("width",370);
				}else{
					var txt = "未查到查询用户详情！";
					window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
				}
			}
			
		}, "JSON");
	},
	deleteUser : function(userIdList) {
		$.post('/mUserAction/deleteUser.action', $.param({'userIdList':userIdList}), function(result) {
			if (result.success) {
				var txt = "禁用成功！";
				window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
				reloadClear();
			} else {
				var txt = "禁用失败！";
				window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
			}
		}, "JSON");
	},
	modifyUser : function(userId,limit){
		$.post('/mUserAction/modifyUser.action', $.param({'usId':userId,'limit':limit}), function(result) {
			if (result.success) {
				var txt = "修改成功！";
				window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
				reloadClear();
			} else {
				var txt = "修改失败！";
				window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
			}
		}, "JSON");
	}

}

