$(function() {
	$('.date_ajust_div').hide();
	$('.header').load("header.html");
	$('.footer').load("footer.html");
	$('#confirmBtn').click(function() {
		if($('#type').val() == 'A'){
			if($('#scripture_url').val().trim()){
				addScripture();
			}else{
				layer.alert('视频连接不能为空(⊙o⊙)…');
			}
		}else{
			addScripture();
		}
	});
	$('#searchBtn').click(function() {
		getScripture();
	});
	/*var nowTime = new Date()
	if(nowTime.getDay() != 7){
		$('.alert-warning').css('visibility', 'hidden');
	}else{
		$('#type option:gt(1)').hide();
		$('.alert-warning').css('visibility', 'visible');
	}*/
	$('#importBtn').click(function() {
		$('#upload_scripture_modal').modal();
		/*var uploadDiv = $('#upload_scripture_div');
		uploadDiv.fileUpload();
		uploadDiv.plupload('getUploader').setOption('url',
				'/scriptureAction/impScriptureBatch.action');*/
	});
	
	$('#upload_scripture_div').plupload({
		// General settings
		runtimes : 'html5,flash,silverlight,html4',
		url : contextPath + '/scriptureAction/impScriptureBatch.action',

		// User can upload no more then 20 files in one go (sets multiple_queues to false)
		max_file_count: 20,
		
		chunk_size: '1mb',
		// Resize images on clientside if we can
		resize : {
			width : 200, 
			height : 200, 
			quality : 90,
			crop: true // crop to exact dimensions
		},
		filters : {
			// Maximum file size
			max_file_size : '1000mb',
			// Specify what files to browse for
			mime_types: [
				{title : "Image files", extensions : "jpg,gif,png"},
				{title : "Zip files", extensions : "zip"},
				{title : "Excel files", extensions:"xls,xlsx"}
			]
		},
		// Rename files by clicking on their titles
		rename: true,
		// Sort files
		sortable: true,
		// Enable ability to drag'n'drop files onto the widget (currently only HTML5 supports that)
		dragdrop: true,
		// Views to activate
		views: {
			list: true,
			thumbs: true, // Show thumbs
			active: 'thumbs'
		},
		   flash_swf_url : contextPath + '/lib/plugin/plupload-2.1.2/Moxie.swf',
		silverlight_xap_url : contextPath + '/lib/plugin/plupload-2.1.2/MoxiDe.xap'
	});
	$('.createDate').datetimepicker({
		language:'zh-CN',
		autoclose: 1,
		startView: 2,
		minView: 2,
		todayHighlight: 1,
		todayBtn:  1,
	    format: 'yyyy-mm-dd'
	}).on('changeDate', function(ev){
		/*formatDate(ev.timeStamp)
		console.log(ev);
	    layer.alert('时间改变了。。。。。。'+formatDate(ev.timeStamp));*/
		getScripture();
	});;
	$("#copy").zclip({
		path: contextPath + '/lib/js/ZeroClipboard.swf',
		copy: function(){
			$('.glyphicon-minus').parent().click();//取消编辑事件触发
			var str = $('#previewArea').html().replace(/<br><hr>/g,'\n');
			str = str.replace(/<([a-zA-Z]+)\s*[^><]*>/g,"<$1>");//去掉属性
			str = str.replace(new RegExp("<span([^>]{0,})>", "g"), "");//去掉<span>
			str = str.replace(new RegExp("</span>", "g"), "");//去掉</span>
			return str;
		},
		afterCopy: function(){
//			alert('已成功复制到粘贴板上了~');
			 var $copysuc = $("<div class='copy-tips'><div class='copy-tips-wrap'>☺ 复制成功</div></div>");
             $("body").find(".copy-tips").remove().end().append($copysuc);
             $(".copy-tips").fadeOut(3000);
		}
	});
	if(getCookie('userType') === 'root'){
		$('.login-button button, .zclip').show();
	}else if(getCookie('userType') === 'user'){
		$('.login-button button, .zclip').hide();
	}else{
		location.href = '../login.html';
	}
	//读Cookie
	function getCookie(objName) {//获取指定名称的cookie的值
	    var arrStr = document.cookie.split("; ");
	    for (var i = 0; i < arrStr.length; i++) {
	        var temp = arrStr[i].split("=");
	        if (temp[0] == objName) return unescape(temp[1]);
	    }
	    return "";
	}
	
	//修改经文
	$(document).on('dblclick', '#previewArea span', function(){
		if(getCookie('userType') !== 'root'){
			return false;
		}
		var editable_span_dom = '<textarea type="text" class="form-control">'+ $(this).html() +'</textarea>'+
								'<button type="button" class="btn btn-primary" onclick="modScripture(this)" data-no="'+ $(this).data('no') +'" data-type="'+ $(this).data('type') +'">\
								<span class="glyphicon glyphicon-ok"></span></button>\
								<button type="button" data-no="'+ $(this).data('no') +'" class="btn btn-danger" onclick="cancelOperate(this)">\
								<span class="glyphicon glyphicon-minus"></span></button>';
		$(this).after(editable_span_dom).hide();
	});
	//添加经文
	$('#add_scripture_btn').click(function(){
		$('#add_scripture_modal').modal();
		$("#add_scripture_remind").hide();
	});
	//模态款彻底显示后逻辑处理
	$('#add_scripture_modal').on('shown.bs.modal', function () {
		getNextScriptureDate();
	});
	//模态框中经文类型修改后,实时显示下一个日期
	$('#type').change(function(){
		getNextScriptureDate();
	});
	//搜索条件改变时，自动搜索
	$('#search_form_type').change(function(){
		/**
		 * 当搜索条件-经文类型发生改变时，获取当前最新经文所属的日期
		 * 也就是通过getNextScriptureDate()返回的日期数减一
		 * 日期减一天的逻辑已经在getNextScriptureDate方法中处理了。
		 */
		getNextScriptureDate();
	});
});

function date_ajust(target){
	var create_date = $('.createDate').val();
	if(!create_date) return ;
	
	var create_date_obj = new Date(create_date);
	if($(target).hasClass('date_prev')){
		$('.createDate').val(formatDate(new Date(create_date_obj.setDate(create_date_obj.getDate() - 1))));//减少一天
		getScripture();
	}else{
		$('.createDate').val(formatDate(new Date(create_date_obj.setDate(create_date_obj.getDate() + 1))));//增加一天
		getScripture();
	}
}

function addScripture() {
	$.post(contextPath + '/scriptureAction/addScripture.action', $(
			'#add_scripture_modal form').serialize(), function(result) {
		if (result.success) {
//			$('#reset_btn').click();
			$('#sripture_content, #scripture_url').val('');
			layer.alert(result.msg);
			getNextScriptureDate();
		} else {
			layer.alert(result.msg);
		}
	}, "JSON");
}
/**
 * params[0]:经文编号
 * params[1]:经文内容/url
 * params[2]:修改的内容类型  如果为’url‘修改的则是连接。否则默认修改时圣经内容 
 * 
 */
function modScripture(target){
	var data_obj = $(target).data(), type = data_obj.type, reqParam = {};

	reqParam.scripture_no = data_obj.no;
	if(type == 'url'){
		reqParam.url = $(target).prev().val();
	}else{
		reqParam.scripture_text = $(target).prev().val();
	}
	$.post(contextPath + '/scriptureAction/modScripture.action', reqParam, function(result) {
		if (result.success) {
			layer.alert(result.msg);
			$('#searchBtn').trigger('click');
		} else {
			layer.alert(result.msg);
		}
	}, "JSON");
}
function cancelOperate(target){
//	$spanTarget = $.parseJSON(decodeURIComponent(spanTarget));
	$(target).prevUntil('span').remove().end().remove();//移除操作按钮
	$('#previewArea span[data-no="'+ $(target).data('no') +'"]').show();//回复经文只读状态
	
}
function getScripture() {
	$.post(contextPath + '/scriptureAction/searchScripturesByDate.action', $('#seachForm')
			.serialize(), function(result) {
		if (result.success) {
			var result = result.result, scriptureStr = '', url = '';
			if (result && result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					if(i == 0){
						scriptureStr += $('#search_form_type').find('option:selected').text() + '</br><hr/>';
						scriptureStr += result[i].create_date + '</br><hr/>';
						url = result[i].url ? '<span data-no="'+ result[i].scripture_no +'" data-type="url">' + result[i].url + '</span>' : '';
					}
					if(i == 1){
						scriptureStr += '复习:</br><hr/>';
					}
					scriptureStr += '<span data-no="'+ result[i].scripture_no +'" data-type="scripture">' + 
									result[i].scripture_text + '</span></br><hr/>';
					
				}
				scriptureStr += url;
				$('#previewArea').html(scriptureStr);
				$('.date_ajust_div').show('slow');
			}
		} else {
//			layer.alert(result.msg);
			$('#previewArea').html('<div class="alert alert-danger"> <strong>很抱歉~!！</strong>暂未找到符合查找条件的经文内容(┳＿┳)...</div>');
			$('.date_ajust_div').hide();
		}
	}, "JSON"); 
}
function getNextScriptureDate(){
	var reqParam = {};
	reqParam.type = $('#add_scripture_modal').hasClass('in') ? $('#type').val() : $('#search_form_type').val();//搜索条件类型和模态框中的类型两种情况
	$.post(contextPath + '/scriptureAction/getNextScriptureDate.action', reqParam, function(res) {
		if (res.success) {
//			layer.alert(res.msg);
			if($('#add_scripture_modal').hasClass('in')){//当模态框显示的时候
				$('#scrpture_create_date').text(res.result.next_create_date);
				getPrevScripture();//获取数据库已有的最新的一节经文
				//周日经文添加提示处理
				var next_create_date = new Date(res.result.next_create_date);
				var scripture_type = $('#type').val();
				if(scripture_type == 'C' || scripture_type == 'D' || scripture_type == 'E' || scripture_type == 'F'){
					next_create_date.getDay() == 0 ? $("#add_scripture_remind").show('slow') : $("#add_scripture_remind").hide('slow');
				}else{
					$("#add_scripture_remind").hide('slow');
				}
				//非新约背节  视频链接隐藏
				scripture_type != 'A' ? $('.video_url').hide('slow') : $('.video_url').show('slow');
				
			}else{
//				var next_date = new Date(res.result.next_create_date),
//				current_date = +next_date - 1000*60*60*24; //原时间减去一天
//				$('.createDate').val(formatDate(new Date(current_date)));
				$('.createDate').val(res.result.last_create_date);
				//由于经文类型改变后获取的时候，不能再查询经文接口调用前完成赋值，所以需要将查询经文的接口写在这里。
				getScripture();
			}
			
		} else {//获取最新的经文所属日期失败（数据库还没有经文的情况）
//			layer.alert(res.msg);
			getScripture();
		}
	}, "JSON");
}

function getPrevScripture(){
	var reqParam = {};
	reqParam.type = $('#type').val();
	$.post(contextPath + '/scriptureAction/getPrevScripture.action', reqParam, function(res) {
		if (res.success) {
			$('#prev_scripture_preview').html('【日期】:'+ res.result.create_date + '<br>' + res.result.scripture_text);
		} else {
//			layer.alert(res.msg);
			$('#prev_scripture_preview').html(res.msg);
		}
	}, "JSON");
}