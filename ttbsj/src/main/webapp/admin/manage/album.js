/**
 * @file album
 * @author zhaojunbao
 * @date: 2017年12月6日 20:02:58
 * @version: V1.0
 */
'use strict';

$(function() {
	util.getAlbumList();
	
	$album.selector = {
		albumDatagrid : $('#albumDatagrid'),
		addAlbumModal : $('#addAlbumModal'),
		album_form : $('.album_form'),
	}
	$('#addAlbumBtn').click(function(){
		$album.selector.addAlbumModal.modal();
	});
	$('#addOk').click(function(){
		$album.addAlbum();
	});
	
	$('#upload_album_pic_btn').click(function(){
		$('#upload_img_modal').modal();
		
		$('#upload_img_div').fileUpload();
		var album_id_lv1 = $('#album_id_lv1').combobox('getText'),
			album_id_lv2 = $('#album_id_lv2').val().trim(),
			module = album_id_lv2 ? encodeURIComponent(album_id_lv1 + '/' + album_id_lv2) : encodeURIComponent(album_id_lv1);
		console.info(module);
		var	url = contextPath + '/uploadAction/uploadFile.action?type=image&module=' + module;
		
			console.log(url);
		$('#upload_img_div').plupload('getUploader').setOption('url', url);
	});
	var albumColumns = [{
		field : 'ck',
		checkbox : true
	}, {
		field : 'album_id',
		title : '专辑ID',
		width : 200,
		sortable : true,
	
	}, {
		field : 'album_lv1_name',
		title : '一级专辑名称',
		width : 100,
		sortable : true,
	},  {
		field : 'album_lv2_name',
		title : '二级专辑名称',
		width : 100,
		sortable : true,
	},{
		field : 'album_img',
		title : '专辑图片',
		width : 100,
		sortable : true,
		formatter: function(value, row, index ){
			return '<img width="50" height="50" src="/upload/'+ value +'"/>';
		}
	}, {
		field : 'create_date',
		title : '创建日期',
		width : 100,
		sortable : true,
	},  {
		field : 'remark',
		title : '备注',
		width : 100,
		sortable : true,
    }],
	albumOptions = {
		url : contextPath + '/albumAction/getAlbumListByPage.action',
		columns: [albumColumns],
		pagination : true,
		fitColumns : false,
		rownumbers : true,
		checkOnSelect:false,
//		width : 1307,
//		sortOrder : 'desc',
		idField : 'album_id',
		pageSize : 5,
		pageNumber : 1,
//		frozenColumns : [ ],
		pageList: [5],
	/*	queryParams : {
			"album_name" : "读经灵修"
		},*/
		loadFilter : function(data) {
			if (data != null) {
				if(data.result.rows != null){
					return data.result;
				}else{
					layer.alert(REMIND_MSG.NO_DATA);
					$album.userInfoDatagrid.datagrid('loadData', { total: 0, rows: [] });
				}
			} /*else {
				window.location.href='../login.html';
			}*/
		}
	};
	$album.selector.albumDatagrid.datagrid(albumOptions);
});

function reloadClear(){
	$('#az-user-tableList').datagrid('uncheckAll').datagrid('unselectAll').datagrid('clearSelections').datagrid("clearChecked");
	//$('#az-user-tableList').datagrid("reload",{ });
	$('#az-user-tableList').datagrid('load', $.serializeObject($('#z-user-searchForm')));
}

var $album = {
	addAlbum : function(){
		var reqParams = {};
		reqParams = $.serializeObject($('.album_form'));
		reqParams = $.extend(reqParams, $('.pic_preview_div').find('img').data());
		reqParams.album_id_lv1 = $('#album_id_lv1').combobox('getText');
//		reqParams.push({'name':'file_name', 'value': $('.pic_preview_div').find('img').data()});
		util.ajaxPostCus('/albumAction/addAlbum.action', reqParams, function(res){
			var result = res.result;
	   		if(res.errCd == '0'){
	   			if(result && result.success){
	   				$($fault.error_info_datagrid).datagrid('reload');
	   	    	}
	   		}else{
	   			layer.alert(res.errMsg);
	   		}
		})
	},
	userDetail : function(usId) {// 用户信息详情
		$.post('/albumAction/addAlbum.action', $.param({'usId':usId}), function(res) {
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

