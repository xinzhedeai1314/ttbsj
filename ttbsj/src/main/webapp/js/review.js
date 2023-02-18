//全局更改combobox不可编辑属性
$.extend($.fn.combobox.defaults, {
	editable: false,
});
$(function() {
	$('.header').load("header.html");
	$('.footer').load("footer.html");
	$('#confirmBtn').click(function() {
		addScripture();
	});
	$('#searchBtn').click(function() {
		getScripture();
	});
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
	
	$('#volume_id').combobox({//圣经所有卷列表
	    textField: 'volume_name',
	    valueField: 'volume_id',
	    url : contextPath + '/scriptureAction/getVolumeChapterVerse.action?type=volume',
	    loadFilter : function(data) {
			var result = data.result || [];
        	return result;
		},
		onSelect:function(data){ 
			var url = contextPath + '/scriptureAction/getVolumeChapterVerse.action?type=chapter&volume_id=' + data.volume_id; 
			$('#chapter_no').combobox('clear').combobox('reload', url);; //清除原来的数据重新载入数据
		}
	});
	$('#chapter_no').combobox({//圣经某卷下章列表
	    textField: 'chapter_no',
	    valueField: 'chapter_no',
	    loadFilter : function(data) {
			var result = data.result || [];
        	return result;
		},
		onSelect:function(data){ 
			var volume_id = $('#volume_id').combobox('getValue');
			var url = contextPath + 
					 '/scriptureAction/getVolumeChapterVerse.action?type=verse_from&volume_id=' +
					 volume_id + '&chapter_no=' + data.chapter_no;
			$('#verse_no_from').combobox('clear').combobox('reload', url);; //清除原来的数据重新载入数据
		}
	});
	$('#verse_no_from').combobox({//圣经某卷下节(起始)列表
	    textField: 'verse_no_from',
	    valueField: 'verse_no_from',
	    loadFilter : function(data) {
			var result = data.result || [];
        	return result;
		},
		onSelect:function(data){ 
			var volume_id = $('#volume_id').combobox('getValue'),
			chapter_no = $('#chapter_no').combobox('getValue');
			var url = contextPath + 
					 '/scriptureAction/getVolumeChapterVerse.action?type=verse_to&volume_id=' +
					 volume_id + '&chapter_no=' + chapter_no + '&verse_no_from=' + data.verse_no_from;
			$('#verse_no_to').combobox('clear').combobox('reload', url);; //清除原来的数据重新载入数据
		}
	});
	$('#verse_no_to').combobox({//圣经某卷下节(结束)列表
	    textField: 'verse_no_to',
	    valueField: 'verse_no_to',
	    loadFilter : function(data) {
			var result = data.result || [];
        	return result;
		},
		onSelect:function(data){ 
			var volume_id = $('#volume_id').combobox('getValue'),
			chapter_no = $('#chapter_no').combobox('getValue');
			var url = contextPath + 
			 '/scriptureAction/getVolumeChapterVerse.action?type=verse_from_by_to&volume_id=' +
			 volume_id + '&chapter_no=' + chapter_no + '&verse_no_to=' + data.verse_no_to;
			$('#verse_no_from').combobox('reload', url);; //清除原来的数据重新载入数据
		}
	});
	
});


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
function getScripture() {
	$.post(contextPath + '/scriptureAction/getScriptureByBible.action', $('#seachForm')
			.serialize(), function(result) {
		if (result.success) {
			var result = result.result, scriptureStr = '', url = '';
			if (result && result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					if(i == 0){
						scriptureStr += result[i].volume_name + '<br><hr>';
						scriptureStr += '复习:<br><hr>';
						scriptureStr += '【'+ result[i].chapter_no + ':' + result[i].verse_no + '-' + result[result.length -1].verse_no + '】<br><hr>';
					}
					scriptureStr += result[i].verse_no + result[i].lection + '<br><hr>';
				}
				console.log(scriptureStr);
				$('#previewArea').html(scriptureStr);
			}
		} else {
//			layer.alert(result.msg);
			$('#previewArea').html('<div class="alert alert-danger"> <strong>很抱歉~!！</strong>暂未找到符合查找条件的经文内容(┳＿┳)...</div>');
		}
	}, "JSON");
}
