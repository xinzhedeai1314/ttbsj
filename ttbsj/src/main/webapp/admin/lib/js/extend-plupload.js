'use strict';

/**
 * @functionName: fileUpload
 * @Description: 文件上传扩展方法
 * @author: Double
 * @param: options
 */
jQuery.fn.fileUpload = function() {
	if (arguments.length < 2) {
		if (arguments.length === 0) { //init or open
			var previewtag = $(this).attr('previewtag');
			previewtag = previewtag ? previewtag : 'ul.picList';
			if ($(previewtag).length > 1) { //一次指定了多个文件预览区
				alert('指定了多个图片预览区');
			} else {
				var module_cd, module_no, extensions, max_file_size, multi, requestUrl, params, paramsObj = {},
					headtitle, addtext, starttext, fileUploader = $(this), showArea;
				if (!$(previewtag).length) { //无文件预览区
					module_cd = $(this).attr('modulecd');
					module_no = $(this).attr('moduleno');
					extensions = $(this).attr('extensions');
					max_file_size = $(this).attr('size');
					multi = $(this).attr('multi');
					requestUrl = $(this).attr('url');
					params = $(this).attr('params');
					headtitle = $(this).attr('headtitle');
					addtext = $(this).attr('addtext');
					starttext = $(this).attr('starttext');
					showArea = $(this).attr('showArea');
				} else {
					module_cd = $(previewtag).attr('modulecd');
					module_no = $(previewtag).attr('moduleno');
					extensions = $(previewtag).attr('extensions');
					max_file_size = $(previewtag).attr('size');
					multi = $(previewtag).attr('multi');
					requestUrl = $(previewtag).attr('url');
					params = $(previewtag).attr('params');
					headtitle = $(previewtag).attr('headtitle');
					addtext = $(previewtag).attr('addtext');
					starttext = $(previewtag).attr('starttext');
					showArea = $(this).attr('showArea');
					$(this).attr('previewtag', previewtag);
				}
				extensions = extensions ? extensions.replace(/\s/g, '') : extensions;
				extensions = extensions ? extensions : 'jpg,jpeg,png,gif,bmp,tiff,raw,zip';
				max_file_size = max_file_size ? max_file_size : '500kb';
				multi = multi === 'false' ? false : true;
				requestUrl = requestUrl ? requestUrl : '/v1/api/common/upload-files.form';
				if (module_cd) {
					paramsObj.module_cd = module_cd;
				}
				if (module_no) {
					paramsObj.module_no = module_no;
				}
				if (params) {
					$.extend(paramsObj, $.parseJSON(params.replace(/\'/g, '"')));
				}
				var paramsStr = '';
				for (var i in paramsObj) {
					paramsStr += '&' + i + '=' + paramsObj[i];
				}
				if (paramsStr) {
					paramsStr = paramsStr.substr(1, paramsStr.length - 1);
					requestUrl += '?' + paramsStr;
				}
				if (!$(this).find('.plupload_wrapper').length) { //上传控件未定义
					var options_extend = {
						headers: {'access-token': getCookie('access-token')},
						url: contextPath + requestUrl,
						filters: {
							mime_types: [{
								title: 'Image And Zip',
								extensions: extensions
							}],
							max_file_size: max_file_size
						},
						dragdrop: true,
						multi_selection: multi,
						flash_swf_url: 'lib/plugin/plupload-2.1.2/Moxie.swf',
						silverlight_xap_url: 'lib/plugin/plupload-2.1.2/MoxiDe.xap',
						views: {
							thumbs: true,
							list: true,
							active: 'thumbs'
						},
						init: {
							FileUploaded: function(uploader, file, responseObject) {
								var res = $.parseJSON(responseObject.response),
								plupload_header = $('#' + uploader.getOption('container')).parents('.plupload_container').children('.plupload_header'),
								uistate = 'highlight', msg = 'Success';
								
								/*图片上传成功回调业务处理逻辑*/
								if (res.success) {
									var result = res.result;
									if (result) {
										if(result.type == 'image'){//回显图片
											$('.pic_preview_div').html('<img width="45" height="45" style="float:left; margin:0 20px;"\
													data-file_name="'+ result.file_name +'"\
													data-type="'+ result.type +'"\
													data-module="'+ result.module +'"\
													src="'+ contextPath + '/upload' + result.path +'"/>');
										}else{//回显音频
											$('.multiMedia_preview_div').html('<audio controls="controls"\
													data-multiMedia_file_name="'+ result.file_name +'"\
													data-multiMedia_type="'+ result.type +'"\
													data-multiMedia_module="'+ result.module +'"\
													src="'+ contextPath + '/upload' + result.path +'">\
													您的浏览器咱不支持audio标签</audio>');
										}
										
										msg = res.msg;
									}
								} else {
									uistate = 'error';
									msg = res.errMsg;
								}
								
								
								if (uistate === 'error') {
									plupload_header.nextAll('.plupload_content').find('ul.plupload_filelist_content li[id="' + file.id + '"]').addClass('ui-state-error').find('.ui-icon-circle-check').addClass('ui-icon-circle-close').removeClass('ui-icon-circle-check');
								}
								var displayMsg = msg, tooltipId = Math.round(Math.random() * 100000);
								if (displayMsg.length > 110) {
									displayMsg = '<a id="errMsgTooltip' + tooltipId + '">' + displayMsg.substr(0, 110) + '......</a>';
								}
								plupload_header.append('' + 
								'<div class="plupload_message ui-state-' + uistate + '">' +
									'<span class="plupload_message_close ui-icon ui-icon-circle-close" title="关闭"></span>' +
									'<p>' +
										'<span class="ui-icon ui-icon-alert"></span><strong style="word-break: break-all;">' + displayMsg + '</strong><br/>' +
										'<i>文件: ' + file.name + '</i>' +
									'</p>' +
								'</div>');
								if (displayMsg.length > 110) {
									$('#errMsgTooltip' + tooltipId).tooltip({
						                content : '<p style="word-break: break-all; max-height: 100px; overflow-y: auto;">' + msg + '</p>',
						                hideEvent: 'none',
						                onShow : function() {
						                	var t = $(this);
						                    $(this).tooltip('tip').css({
						                    	width: 300,
						                    	color: '#cd0a0a',
						                    	left: t.offset().left + 380,
						                    	backgroundColor: '#fef7f5',
						                        borderColor: '#cd0a0a',
						                        boxShadow: '1px 1px 10px #292929'
						                    });
						                    $(this).tooltip('arrow').css({
						                    	left: t.offset().left - 330
						                    });
					                        t.tooltip('tip').focus().unbind().bind('blur',function(){
					                            t.tooltip('hide');
					                        });
						                }
						            });
								}
								plupload_header.find('.plupload_message_close').click(function() {
									$(this).parent().remove();
								});
							},
							FilesAdded: function(uploader, files) {
								if (!uploader.getOption('multi_selection')) {
									uploader.splice(0, uploader.files.length - 1);
								}
							},
							UploadComplete: function(uploader, files) {
								setTimeout(function() {
									$('#' + uploader.getOption('container')).parents('.plupload_container').find('.plupload_header .ui-state-highlight').remove();
								}, 3000);
							}
						}
					};
					if (navigator.userAgent.indexOf('MSIE 8.0') > 0) { //ie8不支持views属性
						options_extend.views = undefined;
					}
					$(this).plupload(options_extend);
					if (headtitle) {
						$(this).find('.plupload_header .plupload_header_content .plupload_header_title').text(headtitle);
					}
					if (addtext) {
						$(this).find('.plupload_filelist_footer .plupload_add .ui-button-text').text(addtext);
					}
					if (starttext) {
						$(this).find('.plupload_filelist_footer .plupload_start .ui-button-text').text(starttext);
						$(this).find('.plupload_header .plupload_header_content .plupload_header_text').text('将文件添加到上传队列，然后点击”' + starttext + '“按钮。');
					}
				}
			}
		} else { //method
			switch (arguments[0]) {
				case 'clearFiles':
					if (navigator.userAgent.indexOf('MSIE 8.0') < 0 && navigator.userAgent.indexOf('MSIE 9.0') < 0) { //ie8不支持views属性
						var uploader = $(this).plupload('getUploader');
						uploader.splice(0, uploader.files.length);
					}
					$('.plupload_message').remove();
					break;
			}
		}
	} else {
		alert('fileUpload : 参数错误, 支持1个参数(clearFiles)-可选');
	}
};
