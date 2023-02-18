/**
 * @file user
 * @author zhaojunbao
 * @date: 2017年12月6日13:45:14
 * @version: V1.0
 */
'use strict';

$(function() {
	$user.selector = {
		userDatagrid : $('#userDatagrid'),
		addUserModal : $('#addUserModal'),
		user_form : $('.user_form'),
	}
	var userColumns = [{
		field : 'ck',
		checkbox : true
	},{
		field : 'scripture_user_id',
		title : '新入群用户ID',
		width : 200,
		sortable : true,
		hidden : true
	},{
		field : 'scripture_user_name',	
		title : '新入群用户名',
		width : 100,
		sortable : true,
	},{
		field : 'create_date',
		title : '新入群时间',
		width : 80,
		sortable : true,
    },{
		field : 'recite_count',
		title : '自入群以来一周内背经次数',
		width : 100,
		sortable : true,
	},{
		field : 'operation',
		title : '新人群人员处理建议',
		width : 120,
		sortable : true,
		formatter: function(value, row, index){
			var suggest = '自进群到目前为止不到一周, 继续观察';
			if(row.one_week == 'Y'){
				suggest = row.recite_count >= 5 ? '拉进小组' : '移出大群';
			}
			return suggest;
		}
	},{
		field : 'recited_YN',
		title : '今日是否已背',
		width : 100,
		sortable : true,
		formatter: function(value, row, index){
			if (value == 'Y'){//未确认
				return '已背诵';
			} else {
				return '<a data-user_id="'+ row.scripture_user_id +'" onclick="receited(this)">未背诵</a>';
			}
		}
	},{
		field : 'one_week',
		title : '自进群以来是否满一周',
		width : 100,
		sortable : true,
		formatter: function(value, row, index){
			return value == 'Y' ? '已满一周' : '未满一周';
		}
	},{
		field : 'last_recite_date',
		title : '最后一次背经时间',
		width : 100,
		sortable : true,
	}],
	userOptions = {
		url : contextPath + '/userAction/getUserListByPage.action',
		columns: [userColumns],
		pagination : true,
		fitColumns : true,
		rownumbers : true,
		checkOnSelect:false,
//		width : 1307,
		idField : 'user_id',
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
	$user.selector.userDatagrid.datagrid(userOptions);
	
	$('#add_scripture_user').click(function(){
		$('#addScriptureUserModal').modal();
	});
	$('#addOk').click(function(){
		addScriptureUser();
	});
	$('#del_scripture_user').click(function(){
		delScriptureUser();
	});
});
function receited(target){
	$.post('/userAction/addReceit.action', {'scripture_user_id':$(target).attr('data-user_id')}, function(result) {
		if (result.success) {
			layer.alert('已背诵');
			$user.selector.userDatagrid.datagrid('reload');
		} else {
			layer.alert('操作失败');
		}
	}, "JSON");
}
function addScriptureUser(){
	$.post('/userAction/addScriptureUser.action', {'scripture_user_name':$('#scripture_user_name').val()}, function(result) {
		if (result.success) {
			$('#addScriptureUserModal').modal('hide');
			layer.alert('添加新人成功');
			$user.selector.userDatagrid.datagrid('reload');
		} else {
			layer.alert('添加失败');
		}
	}, "JSON");
}
function delScriptureUser(){
	var scripture_user_ids = $('#userDatagrid').getIdsDatagridEasyUI(['scripture_user_id']);
	$.post('/userAction/delScriptureUser.action', {'scripture_user_ids' : scripture_user_ids}, function(result) {
		if (result.success) {
			layer.alert('删除成功');
			$user.selector.userDatagrid.datagrid('reload');
		} else {
			layer.alert('删除失败');
		}
	}, "JSON");
}
var $user = {
	userInfoDatagrid : $('#userInfoDatagrid'),
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

