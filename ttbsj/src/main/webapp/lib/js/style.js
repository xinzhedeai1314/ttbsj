'use strict';

//这里就是登录页面总是闪烁的问题。这里会进行死循环。。。
/*if(window.location.href.indexOf('register.html') < 0){//不过滤注册页面，其他页面不登录用户不能访问，跳转到登录页面
//取cookie
	var userInfo = getCookie('userInfo');
	if (userInfo) {
		userInfo = $.parseJSON(userInfo);
		if (!(userInfo.USR_ID && userInfo.CMP_ID && userInfo.USR_NAME)) {
			window.location.href = '/login.html';
		} else {
			window.userInfo = userInfo;
		}
	} else {
		window.location.href = '/login.html';
	}
	$(".usname").text(userInfo.USR_NAME);
}*/

//对Date的扩展，将 Date 转化为指定格式的String   
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
//例子：   
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt)   
{ //author: meizz   
	if(isNaN(this.getDate()))
	{
		return "";
	}
	
var o = {   
 "M+" : this.getMonth()+1,                 //月份   
 "d+" : this.getDate(),                    //日   
 "h+" : this.getHours(),                   //小时   
 "m+" : this.getMinutes(),                 //分   
 "s+" : this.getSeconds(),                 //秒   
 "q+" : Math.floor((this.getMonth()+3)/3), //季度   
 "S"  : this.getMilliseconds()             //毫秒   
};   
if(/(y+)/.test(fmt))   
 fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
for(var k in o)   
 if(new RegExp("("+ k +")").test(fmt))   
fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
return fmt;   
} 

//当前页面
localStorage.lastRequestPage = window.location.href;

function naviEvent01(menu, menuItemOn) {
	$('.menuCnm li a').mouseover(function() {
		$('.subMenuWrapper').offset({left: 0});
		$('.menuCnm li a').removeClass('on').children('img').remove();
		$(this).addClass('on');
		if (!$(this).children('img').length) {
//			$(this).prepend('<img src="/lib/img/menu/pic_menu.png" />');
		}
		var inx = $(this).parent().index(),
			subMenu = menu[inx].subMenu,
			ul = '<ul>';
		for (var i = 0; i < subMenu.length; i++) {
			ul += '<li><a href=' + subMenu[i].link + '><div class="submenu-' + subMenu[i].link.split('.')[0].split('/')[2] + '"></div><p>' + subMenu[i].title + '</p></a></li>';
		}
		ul += '</ul>';
		if (!$('.subMenuWrapper').prev().hasClass('subMenuEmpty')) {
			$('.subMenuWrapper').before('<div class="subMenuEmpty"></div>');
		}
		$('.subMenu').empty().append(ul);
		$('.subMenuWrapper, .subMenuEmpty').show();
		$('.subMenuWrapper').width(90 * subMenu.length + 10);
		$('.subMenuEmpty').offset({
			left: $(this).offset().left
		});
		var posleft = $(this).offset().left - Math.round(($('.subMenuWrapper').width() - 100) / 2),
		minileft = ($('.menuWrapper').width() - $('.menuCnm').width())/2;
		posleft < minileft ? posleft  = minileft : '';
		(posleft - minileft + $('.subMenuWrapper').width()) > 1300 ? posleft = 1300 - $('.subMenuWrapper').width() + minileft : '';
		$('.subMenuWrapper').offset({
			left: posleft
		});
		
		//鼠标进入页面主体内容部分时二级菜单消失
		$('.contents, .detailContents, .defaultbox').mouseenter(function() {
			$('.subMenuWrapper, .subMenuEmpty').hide();
			$('.menuCnm li a').removeClass('on').children('img').remove();
			if (menuItemOn !== -1) {
				$('.menuCnm li').eq(menuItemOn).children('a').addClass('on')/*.prepend('<img src="/lib/img/menu/pic_menu.png" />')*/;
			}
		});
		//鼠标离开二级菜单时二级菜单消失
		$('.subMenuWrapper').mouseleave(function() {
			$('.subMenuWrapper, .subMenuEmpty').hide();
			$('.menuCnm li a').removeClass('on').children('img').remove();
			if (menuItemOn !== -1) {
				$('.menuCnm li').eq(menuItemOn).children('a').addClass('on')/*.prepend('<img src="/lib/img/menu/pic_menu.png" />')*/;
			}
		});
		//鼠标离开当前菜单项时二级菜单消失
		$('.menuCnm li a').mouseleave(function(e) {
			if (($(this).parent().is(':last-child') && e.pageX > $(this).offset().left + $(this).width()) || ($(this).parent().index() == 1 && e.pageX < $(this).offset().left) || e.pageY < $(this).offset().top) {
				$('.subMenuWrapper, .subMenuEmpty').hide();
				$('.menuCnm li a').removeClass('on').children('img').remove();
				if (menuItemOn !== -1) {
					$('.menuCnm li').eq(menuItemOn).children('a').addClass('on')/*.prepend('<img src="/lib/img/menu/pic_menu.png" />')*/;
				}
			}
		});

	});
}

//datagrid存储数据
window.datagrid = {};
/**
 *
 * @functionName: hideForm
 * @Description: 隐藏表单元素
 * @author: Double
 *
 */
jQuery.fn.hideForm = function() {
	if (!$(this).find('.textMark').length) {
		$(this).find('input:visible, select:visible, textarea:visible, button:visible, img.ui-datepicker-trigger, ul.picList li a:eq(0), .icon:visible').addClass('formMark');
		$(this).find('.pagination').find('input:visible, select:visible, textarea:visible, button:visible').removeClass('formMark');
		$(this).find('.fileupload').find('input:visible, select:visible, textarea:visible, button:visible').removeClass('formMark');
		$(this).find('.suggest').addClass('formMark').find('input:visible').removeClass('formMark');
		$(this).find('.combox').addClass('formMark').find('input:visible').removeClass('formMark');
//		$(this).find('.textbox.spinner').addClass('formMark').find('input:visible').removeClass('formMark');
		$(this).find('button.btnEdit, button.btnBack').removeClass('formMark');
		
		$(this).find('input[type="text"].formMark').each(function() {
			$(this).after('<p class="textMark">' + $(this).val() + '</p>');
		});
		$(this).find('select.formMark').each(function() {
			$(this).after('<p class="textMark" value="' + $(this).val() + '">' + $(this).find('option:selected').text() + '</p>');
		});
		$(this).find('textarea.formMark').each(function() {
			$(this).after('<pre class="textMark">' + $(this).val() + '</pre>');
		});
		$(this).find('.suggest.formMark').each(function() {
			$(this).after('<p class="textMark">' + $(this).find('input').val() + '</p>');
		});
		$(this).find('.combox.formMark').each(function() {
			$(this).after('<p class="textMark">' + $(this).children('input').val() + '</p>');
		});
//		$(this).find('.textbox.spinner.formMark').each(function() {
//			$(this).after('<p class="textMark">' + $(this).children('input.textbox-value').val() + '</p>');
//		});
	} else {
		$(this).find('input.formMark').each(function() {
			$(this).val($(this).next().text());
		});
		$(this).find('select.formMark').each(function() {
			$(this).val($(this).next().attr('value'));
		});
		$(this).find('textarea.formMark').each(function() {
			$(this).val($(this).next().text());
		});
		$(this).find('.suggest.formMark').each(function() {
			$(this).find('input').val($(this).next().text());
		});
		$(this).find('.combox.formMark').each(function() {
			$(this).find('ul li button').click();
			combox[$(this).attr('comboxindex')].setSelection($(this).next().text());
		});
//		$(this).find('.textbox.spinner.formMark').each(function() {
//			$(this).prev().timespinner('setValue', $(this).next().text());
//		});
		$(this).find('.textMark').show();
		//datagrid 恢复数据
		$(this).find('.datagrid').each(function(i, datagrid) {
			var id = $(datagrid).find('.datagrid-view').children('table').attr('id');
			$('#' + id).datagrid('loadData', window.datagrid[id]);
			$(datagrid).hideForm();
		});
	}
	$(this).find('.formMark').hide().end().find('button.btnEdit, button.btnBack').show();
	//隐藏datagrid的checkbox列
	$(this).find('.datagrid').each(function(i, datagrid) {
		var id = $(datagrid).find('.datagrid-view').children('table').attr('id');
		$('#' + id).datagrid('hideColumn', 'ck');
	});
}

/**
 *
 * @functionName: showForm
 * @Description: 显示表单元素
 * @author: Double
 *
 */
jQuery.fn.showForm = function() {
	$(this).find('.textMark').hide();
	$(this).find('.formMark').show();
	$(this).find('button.btnEdit, button.btnBack').hide();

	$(this).find('.idField').next().show();
	$(this).find('.idField').next().next('img').hide();
	$(this).find('.idField').hide();
	
	//datagrid 存储数据
	$(this).find('.datagrid').each(function(i, datagrid) {
		var id = $(datagrid).find('.datagrid-view').children('table').attr('id');
		window.datagrid[id] = $('#' + id).datagrid('getData');
		$('#' + id).datagrid('showColumn', 'ck');  //显示datagrid的checkbox列
	});
	
}

/**
 *
 * @functionName: initForm
 * @Description: 显示表单元素
 * @author: Double
 *
 */
jQuery.fn.initForm = function() {
	$(this).find('.textMark').remove();
	$(this).find('.formMark').show();
	$(this).find('.formMark').removeClass('formMark');
	$(this).find('button.btnEdit').hide();

	$.each($(this).find('form'), function(index, form) {
		form.reset();
		$(form).find('.combox .bui-tag-follow ul li button').click();
	});
	$(this).find('ul.picList').empty();
}

/**
 *
 * @functionName: dragDialog
 * @Description: 对dialog进行拖拽
 * @author: Double
 *
 */
jQuery.fn.dragDialog = function() {
	var _IsMove = 0,
		_MouseLeft = 0,
		_MouseTop = 0;
	return $(this).bind('mousemove', function(e) {
		if (_IsMove == 1) {
			$(this).parent().offset({
				top: e.pageY - _MouseTop,
				left: e.pageX - _MouseLeft
			});
		}
	}).bind('mousedown', function(e) {
		_IsMove = 1;
		var offset = $(this).offset();
		_MouseLeft = e.pageX - offset.left;
		_MouseTop = e.pageY - offset.top;
	}).bind('mouseup', function() {
		_IsMove = 0;
	}).bind('mouseout', function() {
		_IsMove = 0;
	});
}

/**
 *
 * @functionName: setDialogCenter
 * @Description: 使dialog居中
 * @author: Double
 *
 */
jQuery.fn.setDialogCenter = function() {
	var heightWindow = $(window).height(),
		popup = $(this).find('.aplPopupWrapper'),
		marginTop = (heightWindow - popup.height()) / 2,
		heightBody = $(document.body).height();
	marginTop = marginTop > 10 ? marginTop : 10;
	marginTop = marginTop + $(document).scrollTop();
	popup.css('margin', 0);
	popup.css('top', marginTop);
	popup.css('left', ($(window).width() - popup.width()) / 2 + $(window).scrollLeft());
//	popup.css('margin-top', marginTop);
	//	popup.css('margin-left', 0);
	var heightPopup = marginTop + popup.height() + 10,
		height = heightBody < heightWindow ? heightWindow : heightBody;
	$(this).css({
		height: height < heightPopup ? heightPopup : height
	});
}

/**
 *
 * @functionName: showDialog
 * @Description: 弹出dialog
 * @author: Double
 *
 */
jQuery.fn.showDialog = function() {
	//dialog中的plupload plugin
	if ($(this).find('.fileupload').length) {
		$(this).find('.fileupload').fileUpload();
	}
	$(this).show();
	//隐藏验证红框
	$(this).find('form').hideAllValidation();
	if (!$(this).hasClass('noHideForm')) {
		$(this).hideForm(); //dialog show之后隐藏表单元素
	} else {
		$(this).find('button.btnEdit').hide();
	}
	//设置弹窗中的表单元素Fit
	$(this).find('form').setFormFit();
	//设置弹窗位置居中
	$(this).setDialogCenter();
}

/**
 *
 * @functionName: closeDialog
 * @Description: 关闭dialog
 * @author: Double
 *
 */
jQuery.fn.closeDialog = function() {
	$(this).initForm();
	$(this).hide();

	//关闭上传文件弹框后，删除上传队列里的文件
	if ($(this).find('.fileupload').length) {
		$(this).find('.fileupload').fileUpload('clearFiles');
	}
}

/**
 *
 * @functionName: $alert
 * @Description: 提示框
 * @author: Double
 * @param: info, callback, title
 */
function $alert(info, callback, title) {
	if (!$('.alertWrapper').length) {
		var heightWindow = $(window).height(),
			heightBody = $(document.body).height(),
			appendHtml = '' +
			'<div class="confirmWrapper alertWrapper" style="height: ' + (heightBody < heightWindow ? heightWindow : heightBody) + 'px">' +
				'<div class="aplConfirmWrapper">' +
					'<div class="aplConfirmTitle">' +
						'<div class="aplConfirmTitleFont">' + (title ? title : '提示') + '</div>' +
						'<div class="aplConfirmXbtn"><a title="关闭"></a></div>' +
					'</div>' +
					'<p class="aplConfirmContent">' + info + '</p>' +
					'<div class="aplConfirmBtnbox">' +
						'<button class="btnPrimary aplConfirmOk">确认</button>' +
					'</div>' +
				'</div>' +
			'</div>';
		$('.scrollToTop').before(appendHtml);
		$('.aplConfirmWrapper').css('margin-top', (heightWindow - $('.aplConfirmWrapper').height()) / 2 + $(document).scrollTop());
		if ($(document).scrollLeft()) {
			$('.aplConfirmWrapper').css('margin-left', ($(window).width() - $('.aplConfirmWrapper').width()) / 2 + $(document).scrollLeft());
		}
		//$('.aplConfirmWrapper .aplConfirmBtnbox .aplConfirmOk').focus();
		$('.aplConfirmTitle').dragDialog(); //alert拖拽效果
		if (callback) {
			$('.alertWrapper .aplConfirmOk, .alertWrapper .aplConfirmXbtn').click(function() {
				callback();
			});
		}
	}
}

/**
 *
 * @functionName: $confirm
 * @Description: 提示框
 * @author: Double
 * @param: info, callback, title
 */
function $confirm(info, callback, title) {
	var yesText = '确认', noText = '取消', yesHandler, noHandler;
	if (callback instanceof Function) {
		yesHandler = callback;
	} else {
		yesText = callback.yesText ? callback.yesText : yesText;
		noText = callback.noText ? callback.noText : noText;
		yesHandler = callback.yesHandler;
		noHandler = callback.noHandler;
	}
	var heightWindow = $(window).height(),
		heightBody = $(document.body).height(),
		appendHtml = '' +
		'<div class="confirmWrapper" style="height: ' + (heightBody < heightWindow ? heightWindow : heightBody) + 'px">' +
			'<div class="aplConfirmWrapper">' +
				'<div class="aplConfirmTitle">' +
					'<div class="aplConfirmTitleFont">' + (title ? title : '提示') + '</div>' +
					'<div class="aplConfirmXbtn"><a title="关闭"></a></div>' +
				'</div>' +
				'<p class="aplConfirmContent">' + info + '</p>' +
				'<div class="aplConfirmBtnbox">' +
					'<button class="btnPrimary aplConfirmOk">' + yesText + '</button>' +
					'<button class="btnPrimary aplConfirmCancel">' + noText + '</button>' +
				'</div>' +
			'</div>' +
		'</div>';
	$('.scrollToTop').before(appendHtml);
	$('.aplConfirmWrapper').css('margin-top', (heightWindow - $('.aplConfirmWrapper').height()) / 2 + $(document).scrollTop());
	//$('.aplConfirmWrapper .aplConfirmBtnbox .aplConfirmOk').focus();
	$('.aplConfirmTitle').dragDialog(); //confirm拖拽效果
	if (yesHandler) {
		$('.confirmWrapper .aplConfirmOk').click(function() {
			yesHandler();
		});
	}
	if (noHandler) {
		$('.confirmWrapper .aplConfirmCancel, .confirmWrapper .aplConfirmXbtn').click(function() {
			noHandler();
		});
	}
}

/**
*
* @functionName: $dialog
* @Description: 有内容的弹框
* @author: Dai
* @param: {title:''},{id:''}, {width:''}, {height:}, {content:''}, {buttons : [ +{text: '', handler: function(){}} ]}
*/
function $dialog(title, id, width, height, content, buttons) {
	var yesText = '确认', noText = '取消', yesHandler, noHandler;
	var yesButton = $('<button class="btnPrimary aplDialogOk">' + yesText + '</button>');
	var noButton = $('<button class="btnPrimary btnCancel">' + noText + '</button>');
	var newButtonFirst = $('<button class="btnPrimary newButtonFirst"></button>');
	var newButtonSecond = $('<button class="btnPrimary newButtonSecond"></button>');
	var heightWindow = $(window).height();
	var appendHtml = '' +
		'<div class="popupWrapper noHideForm myDialog" id="'+ id.id + '">' +
			'<div class="aplPopupWrapper" style="height: ' + (height.height ? height.height + 'px' : 'auto') + ';width: ' + (width.width ? width.width : '743') + 'px">' +
				'<div class="aplPopupTitle">' +
					'<div class="aplPopupTitleFont">' + (title.title ? title.title : '详细信息') + '</div>' +
					'<div class="aplPopupXbtn"><a title="关闭"><img src="/lib/img/btn/btn_popupX.png" alt="关闭"/></a></div>' +
				'</div>' +
				(content.content ? content.content : '') +
				'<div class="btnbox">' +
				'</div>' +
			'</div>' +
		'</div>';
	if (id.id) {
		$('.scrollToTop').before(appendHtml);
		$('#' + id.id + ' .btnbox button').remove();
		if (buttons) {
			var myButtons = buttons.buttons;
			if (myButtons.length == 2) {
				$('#' + id.id + ' .btnbox').append(newButtonFirst);
				$('#' + id.id + ' .btnbox').append(newButtonSecond);
				if (myButtons[0].text) {
					$('#' + id.id + ' .newButtonFirst').text(myButtons[0].text);
				} else {
					$('#' + id.id + ' .newButtonFirst').text('确认');
				}
				if (myButtons[1].text) {
					$('#' + id.id + ' .newButtonSecond').text(myButtons[1].text);
				} else {
					$('#' + id.id + ' .newButtonSecond').text('取消');
				}
				if (myButtons[0].handler) {
					yesHandler = myButtons[0].handler;
				}
				if (myButtons[1].handler) {
					noHandler = myButtons[1].handler;
				}
			} else if (myButtons.length == 1) {
				$('#' + id.id + ' .btnbox').append(newButtonFirst);
				$('#' + id.id + ' .btnbox').append(noButton);
				if (myButtons[0].text) {
					$('#' + id.id + ' .newButtonFirst').text(myButtons[0].text);
				} else {
					$('#' + id.id + ' .newButtonFirst').text('确认');
				}
				if (myButtons[0].handler) {
					yesHandler = myButtons[0].handler;
				}
			} else {
				$('#' + id.id + ' .btnbox').append(yesButton);
			}
		}
		$('.aplPopupWrapper').css('margin-top', (heightWindow - $('.aplPopupWrapper').height()) / 2 + $(document).scrollTop());
		$('.aplPopupTitle').dragDialog(); //alert拖拽效果
		$('#' + id.id).showDialog();
	} else {
		$alert('请给dialog设置id值,以便使用,谢谢合作');
	}
	
	if (yesHandler) {
		$('.newButtonFirst').click(function() {
			yesHandler();
		});
	} else {
		$('.newButtonFirst').click(function() {
			$(this).parents('.popupWrapper').remove();
		});
	}
	if (noHandler) {
		$('.newButtonSecond').click(function() {
			noHandler();
		});
	} else {
		$('.newButtonSecond').click(function() {
			$(this).parents('.popupWrapper').remove();
		});
	}
}

/**
 *
 * @functionName: createVerticalTable
 * @Description: 在dialog中创建用于显示数据的垂直表格
 * @author: Double
 * @param: options
 */
jQuery.fn.createVerticalTable = function(options) {
	var data = options.data;
	if (data.errCd === 0) {
		var columns = options.columns,
			result = data.result,
			rows = result.rows,
			colgroup = '',
			thead = '',
			visibleRows = '',
			leftoverRows = '',
			visibleRowsCount = 10;
		for (var i = 0; i < columns.length; i++) {
			colgroup += '<col width="' + columns[i].width + '"/>';
			thead += '<th>' + columns[i].title + '</th>';
		}

		for (var i = 0; i < rows.length && i < visibleRowsCount; i++) {
			visibleRows += '<tr>';
			for (var j = 0; j < columns.length; j++) {
				visibleRows += '<td>' + rows[i][columns[j].field] + '</td>'
			}
			visibleRows += '</tr>';
		}

		for (var i = visibleRowsCount; i < rows.length; i++) {
			leftoverRows += '<tr>';
			for (var j = 0; j < columns.length; j++) {
				leftoverRows += '<td>' + rows[i][columns[j].field] + '</td>'
			}
			leftoverRows += '</tr>';
		}
		if ($(this).prev().hasClass('popupVerticalTableTh')) {
			$(this).prev().remove();
		}
		//		$(this).before('<table class="popupVerticalTable" summary="垂直表格标题"><colgroup>' + colgroup + '</colgroup><thead><tr>' + thead + '</tr></thead></table>');
		$(this).addClass('popupVerticalTable');
		$(this).html('<colgroup>' + colgroup + '</colgroup><thead><tr>' + thead + '</tr></thead><tbody>' + visibleRows + '</tbody>');
		if (rows.length > visibleRowsCount) {
			/*var scrollWidth = getScrollWidth(), relativeScrollWidth = scrollWidth * columns[0].width / $(this).prev('table.popupVerticalTableTh').find('thead th:eq(0)').width();
			
			$(this).css({'margin': '0', 'width': '100%'});
			$(this).wrap('<div style="margin: 0 auto; width: 95%; overflow-y: scroll; height: ' + $(this).height() + 'px;"></div>');
			
			var theadTable = $(this).parent().prev('table.popupVerticalTableTh');
			theadTable.css({'margin': '0', 'width': $(this).width()});
			theadTable.wrap('<div style="margin: 0 auto; width: 95%; background-color: #fafafa; border-style: solid; border-color: #cacaca; border-width: 0px;"></div>');
			
//			theadTable.css({'margin': '0', 'width': $(this).width()}).wrap('<div style="margin: 0 auto; width: 95%; background-color: #fafafa; border-style: solid; border-color: #cacaca; border-width: 1px 1px 1px 0px;"></div>');
			
//			theadTable.find('tr th').css('border-width', '0 0 0 1px');
*/
			$(this).css({
				'margin': '0',
				'width': '100%'
			});
			$(this).wrap('<div class="popupVerticalTableScroll"></div>');
			$(this).find('tbody').append(leftoverRows);
			$(this).find('thead tr:first-child th').css('border-top-width', '0');
			$(this).find('tbody tr:last-child td').css('border-bottom-width', '0');
		}
	}
}

/**
 *
 * @functionName: setFormFit
 * @Description: 设置表单元素Fit
 * @author: Double
 *
 */
jQuery.fn.setFormFit = function() {
	$.each($(this).find('input.inputFit:visible, textarea.textareaFit:visible'), function(i, element) {
		var width = 0;
		$.each($(element).parents('table').find('tbody tr:visible'), function(i, tr) {
			var lastElement = $(tr).children('td:last-child:visible').children('*:first-child:visible');
			if ((lastElement.is('input') || lastElement.is('select') || lastElement.is('textarea')) && !lastElement.hasClass('inputFit') && !lastElement.hasClass('textareaFit')) {
				var widthTemp = $(tr).outerWidth() - $(tr).children('td:last-child').outerWidth() - $(tr).children('th:first-child').outerWidth() + lastElement.outerWidth();
				width < widthTemp ? width = widthTemp : '';
			}
		});
		$(element).outerWidth(width);
	});
}

/**
 *
 * @functionName: soManyButtons
 * @Description: 页面上有很多按钮
 * @author: Double
 *
 */
jQuery.fn.soManyButtons = function() {
//	$(this).children('button:visible').addClass('btnSmall');
	$(this).css({textAlign: 'center', width: '100%'}).after('<div class="button-hover-title"></div>');
	var next, prev;
	$(this).children('button:visible').each(function(i, button) {
		$(button).removeClass('btnPrimary').addClass('btnImg').addClass('btnImg-' + button.id).attr('text', $(button).text()).text('').mouseenter(function() {
			$(this).stop(true).animate({width: 65, backgroundSize: 65}, 'fast', function() {
				var buttonHoverTitle = $(this).parent().next();
				buttonHoverTitle.html('<p style="left: ' + ($(this).offset().left - buttonHoverTitle.offset().left - 2) + 'px;">' + $(this).attr('text') + '</p>');
//				buttonHoverTitle.children('p').fadeIn();
			});
			$(this).removeClass('btnImg-' + button.id).addClass('btnImgHover-' + button.id);
			var nexts = $(this).nextAll();
			for (var i=0; i<nexts.length; i++) {
				if ($(nexts[i]).is(':visible')) {
					$(nexts[i]).stop(true).animate({width: 55, backgroundSize: 55}, 'fast');
					$(nexts[i]).removeClass('btnImg-' + nexts[i].id).addClass('btnImgSib-' + nexts[i].id);
					next = nexts[i];
					break;
				}
			}
			var prevs = $(this).prevAll();
			for (var i=0; i<prevs.length; i++) {
				if ($(prevs[i]).is(':visible')) {
					$(prevs[i]).stop(true).animate({width: 55, backgroundSize: 55}, 'fast');
					$(prevs[i]).removeClass('btnImg-' + prevs[i].id).addClass('btnImgSib-' + prevs[i].id);
					prev = prevs[i];
					break;
				}
			}
		}).mouseleave(function() {
			$(this).animate({width: 50, backgroundSize: 50});
			$(this).removeClass('btnImgHover-' + button.id).addClass('btnImg-' + button.id);
			$(this).parent().next().html('');
			if (next) {
				$('.btnImgSib-' + next.id).animate({width: 50, backgroundSize: 50});
				$('.btnImgSib-' + next.id).removeClass('btnImgSib-' + next.id).addClass('btnImg-' + next.id);
			}
			if (prev) {
				$('.btnImgSib-' + prev.id).animate({width: 50, backgroundSize: 50});
				$('.btnImgSib-' + prev.id).removeClass('btnImgSib-' + prev.id).addClass('btnImg-' + prev.id);
			}
		});
	});
	$('body').on('mouseenter', 'table', function() {
		$('.button-hover-title').html('');
	});
}

/**
*
* @functionName: callMask
* @Description: 呼叫遮罩层
* @author: Double
*
*/
function callMask() {
	$('body').append('<div class="popupWrapper" style="display: block;"><div class="mask-info"><div class="mask-img"></div><p>努力处理中...</p></div></div>');
}

/**
*
* @functionName: removeMask
* @Description: 踢走遮罩层
* @author: Double
*
*/
function removeMask() {
	$('body').css('overflow', 'auto').find('.popupWrapper').remove();
}

/**
 *
 * @functionName: fillWindow
 * @Description: 当窗口没被填充满时，填充窗口
 * @author: Double
 *
 */
function fillWindow() {
//	var bodyHeight = $('body').height(),
//		contentsHeight = $('.contents').height(),
//		acticleHeight = $('.contents .acticle').outerHeight();
	var height = $(window).height() - 170;
	if (height >= 570) {
		$('.gray-bg').css('min-height', height);
	}
	//	var bodyHeight = $('body').height(), windowHeight = $(window).height(), contentsHeight = $('.contents').height(), acticleHeight = $('.contents .acticle').outerHeight();
	//	if (bodyHeight < windowHeight) {
	//		$('.contents').height(contentsHeight + windowHeight - bodyHeight);
	//	} else if (bodyHeight > windowHeight) {
	//		if (contentsHeight > acticleHeight) {
	//			var height = contentsHeight - bodyHeight + windowHeight;
	//			height = height < acticleHeight ? acticleHeight : height;
	//			$('.contents').height(height);
	//		}
	//	}
}

/**
 *
 * @functionName: feedback
 * @Description: 问题反馈
 * @author: Double
 *
 */
/*function feedback() {
	$('body').append('<a title="问题反馈" class="feedback-icon"></a>');
	$('body').append('' +
	'<div class="feedback-body">' +
		'<div class="feedback-title">' +
			'问题反馈' +
			'<i class="icon icon-remove" title="关闭"></i>' +
		'</div>' +
		'<div class="feedback-content">' +
			'<form>' +
				'<p><i>*</i>反馈内容(必填)</p>' +
				'<p>' +
					'<textarea rows="5" placeholder="欢迎提出您在使用过程中遇到的问题和宝贵意见(400字以内),感谢您的支持。" maxlength="400"></textarea>' +
					'<span class="count">还可以输入400个字符</span>' +
				'</p>' +
				'<div id="container"><p><button class="file" id="feedback-pickfile" type="button">添加附件</button><span>添加小于500K的文档/图片,最多3个</span></p></div>' +
				'<div class="filelist"></div>' +
				'<p>姓名</p>' +
				'<p><input type="text" name="submit_nm" value="" placeholder="请留下您的姓名" maxlength="15" /></p>' +
				'<p>联系邮箱</p>' +
				'<p><input type="text" name="submit_email" value="" placeholder="请留下您的联系邮箱,以便我们及时回复您" maxlength="30" /></p>' +
				'<p class="response"><input type="checkbox" name="need_reply_yn" id="need_reply_yn" /><label for="need_reply_yn"> 请及时回复我</label></p>' +
			'</form>' +
			'<div class="tip"></div>' +
			'<p><button class="submit">提交</button></p>' +
		'</div>' +
	'</div>' +
	'<div class="feedback-success">' +
		'<div class="feedback-title">' +
			'问题反馈' +
			'<i class="icon icon-remove" title="关闭"></i>' +
		'</div>' +
		'<div class="feedback-content"><p>提交成功,感谢您的反馈。</p></div>' +
		'<div class="feedback-foot"><span>5秒后自动关闭</span></div>' +
	'</div>');
	//点击客服小人
	$('.feedback-icon').click(function() {
		$('.feedback-body').show();
		if ($('.feedback-body').width() === 0) {
			var height = 430, navi = getNavigator();
			if (navi === 'Firefox') {
				height = 480;
			}
			$('.feedback-body').animate({height: height, width: 320, opacity: 1});
		} else {
			$('.feedback-body').animate({height: 0, width: 0, opacity: 0});
		}
	});
	//弹窗关闭按钮
	$('.feedback-body .feedback-title .icon-remove').click(function() {
		$('.feedback-body').animate({height: 0, width: 0, opacity: 0});
	});
	//success弹窗关闭按钮
	$('.feedback-success .feedback-title .icon-remove').click(function() {
		$('.feedback-success').animate({height: 0, width: 0, opacity: 0});
	});
	//反馈内容字符个数提示
	$('.feedback-body .feedback-content textarea').keyup(function() {
		$('.feedback-body .feedback-content .count').text('还可以输入' + (400 - $(this).val().length) + '个字符');
	});
	//反馈内容
	$('.feedback-body .feedback-content textarea').blur(function() {
		if (!$('.feedback-body .feedback-content textarea').val().trim().length) {
			$('.feedback-body .feedback-content .tip').empty().append('<p class="content-error">请填写反馈内容。</p>');
		} else {
			$('.feedback-body .feedback-content .tip').empty();
		}
	});
	//联系邮箱
	$('.feedback-body .feedback-content input[type="text"]:eq(1)').blur(function() {
		if (/^((\w)+(\.\w+)*@(\w)+((\.\w+)+))*$/.test($(this).val().trim()) === false) {
			$('.feedback-body .feedback-content .tip').empty().append('<p class="mail-error">请填写正确的邮箱，以便我们能联系到您。</p>');
		} else {
			$('.feedback-body .feedback-content .tip').empty();
		}
	});
	//文件列表删除按钮
	$('.feedback-body .feedback-content .filelist').on('click', '.icon-remove-circle', function() {
		$(this).parent().remove();
	});
	//提交按钮
	$('.feedback-body .feedback-content button.submit').click(function() {
		if (!$('.feedback-body .feedback-content .tip').children('.content-error, .mail-error').length) {
			$('.feedback-body .feedback-content textarea').blur();
			if (!$('.feedback-body .feedback-content .tip').children().length) {
				var file_ids = [];
				$('.feedback-body .feedback-content .filelist p').each(function(i, file) {
					file_ids.push($(file).attr('id'));
				});
				var files = JSON.stringify([{module_cd: '/suggestion/', file_ids: file_ids}]);
				$(this).attr('disabled', true);
				$.get("http://ipinfo.io", function(response) {
    				$.post(contextPath + '/v1/api/system/suggestion/add-suggestion.json', {
    					page_url: window.location.pathname,
						sug_content: $('.feedback-body .feedback-content textarea').val(),
						submit_nm: $('.feedback-body .feedback-content input[name="submit_nm"]').val(),
						submit_email: $('.feedback-body .feedback-content input[name="submit_email"]').val(),
						need_reply_yn: $('.feedback-body .feedback-content input[name="need_reply_yn"]').is(':checked') ? 'Y' : 'N',
						submit_brower: navigator.userAgent,
						submit_ip: response.ip,
						sug_type: 'BUG',
						submit_host_info: getOS() + ',' + getNavigator(),
						files: files
					}, function(data) {
						$('.feedback-body .feedback-content button.submit').attr('disabled', false);
						if (data.errCd === 0) {
							var result = data.result;
							if (result) {
								if (result.success) {
									$('.feedback-body .feedback-content form')[0].reset();
									$('.feedback-body .feedback-content .filelist').empty();
									$('.feedback-body .feedback-title .icon-remove').click();
									$('.feedback-success .feedback-foot span').text('5秒后自动关闭');
									$('.feedback-success').show();
									$('.feedback-success').animate({height: 140, width: 300, opacity: 1});
									var timeCnt = 5, closeSuccessInterval = setInterval(function() {
										if (timeCnt === 1) {
											clearInterval(closeSuccessInterval);
											$('.feedback-success').animate({height: 0, width: 0, opacity: 0});
										} else {
											timeCnt--;
											$('.feedback-success .feedback-foot span').text(timeCnt + '秒后自动关闭');
										}
									}, 1000);
								} else {
									$('.feedback-body .feedback-content .tip').empty().append('<p class="request-error">' + result.msg + '</p>');
								}
							}
						} else {
							$('.feedback-body .feedback-content .tip').empty().append('<p class="request-error">' + data.errMsg + '</p>');
						}
					});
				}, 'jsonp');
			}
		} else {
			$('.feedback-body .feedback-content .tip p').css({'font-weight': 'bold'});
			setTimeout(function (){
				$('.feedback-body .feedback-content .tip p').css({'font-weight': 'normal'});
			}, 1000);
		}
	});
	//pluploader实例
	var uploader = new plupload.Uploader({
		browse_button: 'feedback-pickfile',
		container: 'container',
		url: contextPath + '/v1/api/common/upload-files.form',
		multipart_params: {
			module_cd: '/suggestion/'
		},
		filters: {
			max_file_size: '500kb',
			mime_types: [{
				title: 'pictures',
				extensions: 'jpg,jpeg,gif,png'
			}, {
				title: 'files',
				extensions: 'zip,rar,txt,xls,xlsx'
			}]
		},
		flash_swf_url: '/lib/plugin/plupload-2.1.2/Moxie.swf',// Flash settings
		silverlight_xap_url: '/lib/plugin/plupload-2.1.2/Moxie.xap',// Silverlight settings
		init: {
			Init: function(up) {
				var navi = getNavigator();
				if(navi === 'IE 8.0' || navi === 'IE 9.0') {
					$('#container').find('.moxie-shim').css({width: 67, height: 25, top: 0});
				}
			},
			FilesAdded: function(up, files) {
				$('.feedback-body .feedback-content .tip').empty();
				var count = 3 - $('.feedback-body .feedback-content .filelist').children().length;
				for (var i=0; i<count && i<files.length; i++) {
					var file = files[i], name = file.name;
					if (name.length > 30) {
						name = name.substr(0, 12) + '...' + name.substr(name.length - 15, 15);
					}
					$('.feedback-body .feedback-content .filelist').append('<p title="' + file.name + '" id="' + file.id + '">' + name + ' (' + plupload.formatSize(file.size) + ')<i class="icon icon-remove-circle" title="删除"></i></p>');
				}
				$.each(files.slice(count), function(i, file) {
					uploader.removeFile(file);
				});
				up.start();
			},
			Error: function(up, err) {
				$('.feedback-body .feedback-content .tip').empty().append('<p class="file-error">Error #' + err.code + ': ' + err.message + '</p>');
			}
		}
	});
	uploader.init();
}*/

$(function() {
	
	var menu=$("<ul class='nav'>"
			+"<li class='dropList'>"+"<a href='/waybill/basic-info.html'>"+"<span class='ion-th-info'>"+"</span>"+"基本信息"+"</a>"+"</li>"
			+"<li class='dropList'>"+"<a href='/waybill/user.html'>"+"<span class='ion-th-user'>"+"</span>"+"客户管理"+"</a>"+"</li>"
			+"<li class='dropList'>"+"<a href='/waybill/waybills.html'>"+"<span class='ion-th-waybill'>"+"</span>"+"运单管理"+"</a>"+"</li>"+"</ul>");
	var userMenu=$("<ul class='nav'>"
			+"<li class='dropList'>"+"<a href='/waybill/user-basic-info.html'>"+"<span class='ion-th-info'>"+"</span>"+"基本信息"+"</a>"+"</li>"
			+"<li class='dropList'>"+"<a href='/waybill/waybills.html'>"+"<span class='ion-th-waybill'>"+"</span>"+"运单管理"+"</a>"+"</li>"+"</ul>");


	$(".nav-default").append(menu);
	//$(".nav-default").append(usermenu);
	//创建上导航
	var header=$("<div class='header'>"+"<ul class='navbar-right'>"+"<li>"+"你好，欢迎回来：" +"<a class='usname' href='/waybill/basic-info.html'>"+"</a>"+"</li>"
			+"<li>"+"<i>"+"|"+"</i>"+"</li>"
			+"<li>"+"<a href='/v1/api/user/logout.form' class='icon-off' title='退出'>"+"  安全退出"+"</a>"+"</li>"
			+"</ul>"+"</div>");
	var userHeader=$("<div class='header'>"+"<ul class='navbar-right'>"+"<li>"+"你好，欢迎回来：" +"<a class='usname' href='/waybill/user-basic-info.html'>"+"</a>"+"</li>"
			+"<li>"+"<i>"+"|"+"</i>"+"</li>"
			+"<li>"+"<a href='/v1/api/user/logout.form' class='icon-off' title='退出'>"+"  安全退出"+"</a>"+"</li>"
			+"</ul>"+"</div>");
	$(".head").append(header);
	//$(".usname").text(userInfo.USR_NAME);
	/*if(window.location.href.indexOf('register.html') < 0){//不过滤注册页面，其他页面不登录用户不能访问，跳转到登录页面
		//取cookie
			var userInfo = getCookie('userInfo');
			if (userInfo) {
				userInfo = $.parseJSON(userInfo);
				if (!(userInfo.USR_ID && userInfo.CMP_ID && userInfo.USR_NAME)) {
					window.location.href = '/login.html';
				} else {
					window.userInfo = userInfo;
					$(".usname").text(userInfo.USR_NAME);
				}
			} else {
				window.location.href = '/login.html';
			}
		}*/
	//获取路径
	var nowFlag=$(".current-mod ul li:last-child").text();
	var nownum=$(".nav-default a").length;
	for(var i=0;i<nownum;i++){
		if($(".nav-default a").eq(i).text()==nowFlag){
			$(".nav-default a").eq(i).css({'color':'red'});
		}
	}
	
	/*var width = document.documentElement.clientWidth-20 
	$(".gray-bg").css({'width':width}); 
	$(".table-body").css({'width':width - 195}); 
	$(".acticle").css({'width':width - 195});*/
	//浏览器显示空间大小发生变化时
	/*window.onresize=function(){  
		var width = document.documentElement.clientWidth-20 
		$(".gray-bg").css({'width':width}); 
		$(".table-body").css({'width':width - 195}); 
		$(".acticle").css({'width':width - 195}); 
    } */
		
	/*//设置menu
	var menu = localStorage.menu;
	if (menu) {
		menu = $.parseJSON(localStorage.menu);
	} else {
		window.location.href = '/login.html';
	}
	
	//设置页面title
	if (!$('.acticleTitle').text()) {
		if ($('.location span:last-child').text()) {
			$('.acticleTitle').text($('.location span:last-child').text());
		}
	}
	$('.leftTitle').text($('.location span:eq(0)').text());
	
	//代理公司logo
	menu.unshift({title : '&nbsp;&nbsp;威海睿博软件'});
	//设置上侧主菜单
	for (var x in menu) {
		var titleMenu = menu[x].title;
		if (titleMenu) {
			if (x == 0) {
				$('.menuCnm ul').append('<li class="logo" title="点击跳转到官网">' + titleMenu + '</li>');
			} else {
				$('.menuCnm ul').append('<li><a>' + titleMenu + '</a></li>');
			}
			if ($('.location span:eq(0)').text() === titleMenu) {
				$('.menuCnm ul li:last-child a').addClass('on').prepend('<img src="/lib/img/menu/pic_menu.png" />');
				//设置左侧子菜单
				if (menu[x].subMenu) {
					for (var y in menu[x].subMenu) {
						var titleSubmenu = menu[x].subMenu[y].title;
						if (titleSubmenu) {
							if ($('.location span:eq(1)').text() === titleSubmenu) {
								$('.leftMenu ul').append('<li><a class="on">' + titleSubmenu + '</a></li>');
							} else {
								$('.leftMenu ul').append('<li><a href="' + menu[x].subMenu[y].link + '">' + titleSubmenu + '</a></li>');
							}
						}
					}
				}
			}
		}
	}

	if (menu.length > 2) {
		var menuWidth = $('.menuCnm').width(),
		cnt = menu.length,
		itemWidth = Math.round((menuWidth - 150) / (cnt - 1)),
		lastWidth = menuWidth - itemWidth * (cnt - 2) - 150;
		$('.menuCnm ul li:not(.logo)').width(itemWidth);
		$('.menuCnm ul li:last-child').width(lastWidth);
	}
	
	var menuItemOn = $('.menuCnm li a.on').parent().index();
	naviEvent01(menu, menuItemOn);
	
	//点击公司logo跳转到公司官网
	$(document).on('click', '.menuCnm ul li.logo', function() {
		window.open('http://www.nssoftware.com.cn/');
	});*/
	
	//页面加载完成后，重置所有表单
	$.each($('form'), function(index, form) {
		form.reset();
		//设置普通页面的表单元素Fit
		$(form).setFormFit();
	});

	//为查询条件表单searchForm定义验证
	$('.searchForm input').attr('maxlength', 30);
	//所有表单不能输入特殊字符
	$('form').on('keyup', 'input, textarea', function(e) {
		//禁止字符  ':222, ;:186, ^:54
		if (e.keyCode == 222 || e.keyCode == 186 || e.keyCode == 54) {
			$(this).val($(this).val().replace(/[';^]/g, ''));
		}
	}).on('blur', 'input, textarea', function(e) {
		var newValue = $(this).val().trim();
		newValue = newValue.replace(/[\s]{2,}/, ' ');
		$(this).val(newValue);
	});

	//page footer
	if ($('body').find('.wrapper').length) {
		$('body').append('<div class="footerWrapper">' +
			'<div class="footer">' +
				'<p class="footerLogo">' +
					'<img src="/lib/img/pic/pic_footer_color.png" alt="footer logo" />' +
				'</p>' +
				'<p class="footerFont">' +
					'威海睿博软件有限公司 TEL:0631-5970779 &nbsp;FAX:0631-5970778<br />Copyright NS Soft Co.,Ltd. &nbsp;All rights reserved. &nbsp;Since 2013' +
				'</p>' +
			'</div>' +
		'</div>');
	}

	//填充窗口
	fillWindow();

	//logo link
//	$('.defaultbox .logo a').attr('href', '/index.html').attr('title', '点击进入网站首页');

	//mypage link
	/*$('.defaultbox').html('<div class="navi"></div>');
	$('.defaultbox .navi').html('<a title="个人中心" href="#" class="mypage">' + userInfo.user_id + '</a>' + 
								'&nbsp;&nbsp;|&nbsp;&nbsp;    <a title="安全登出" href="' + contextPath + '/v1/api/user/logout.form" class="logout">安全退出</a>');
	*/
	
	//窗口调整大小后重新fill
	$(window).resize(function() {
		fillWindow();
	});
	
	//feedback 问题反馈
	//feedback();
	
	//scroll to top
	$('body').append('<a title="回到顶部" class="scrollToTop"></a>');
	$(window).scroll(function() {
		if ($(this).scrollTop() > 100) {
			$('.scrollToTop').fadeIn();
		} else {
			$('.scrollToTop').fadeOut();
		}
		//datagrid滚动显示
		var datagrid = $('.acticle .datagrid:eq(0)'), searchBtns = datagrid.prevAll('.searchBtns:eq(0)'), 
		scrollSwitch = datagrid.find('.datagrid-view').next().find('.scrollSwitch');
		if(scrollSwitch.length && (scrollSwitch.switchbutton('options').checked)) { 
			if ($(this).scrollTop() >= searchBtns.offset().top) {
				var otherHeight = $('.footerWrapper').height() + parseInt($('.contents .acticle').css('padding-bottom')) + searchBtns.height() + 8;
				if (searchBtns.next().hasClass('button-hover-title')) {
					otherHeight += searchBtns.next().height() - 8;
				}
				$('#' + datagrid.find('.datagrid-view').children('table').attr('id')).datagrid('resize', {height: $(this).height() - otherHeight});
			} else {
				$('#' + datagrid.find('.datagrid-view').children('table').attr('id')).datagrid('resize', {height: 'auto'});
			}
		}
	});
	$('.scrollToTop').click(function() {
		$('html, body').animate({
			scrollTop: 0
		}, 200);
	});

	//iframe for download
	$('body').append('<iframe frameborder="0" height="0" name="downloadFrame"></iframe>');

	//在查询表单的输入框中点击回车，触发查询事件
	$('.searchForm input').keypress(function(e) {
		if (e.keyCode === 13) {
			$(e.target).parents('form').prev('.searchBtns').find('button:eq(0)').click();
			return false;
		}
	});

	//dialog拖拽效果
	$('.aplPopupTitle').dragDialog();

	//关闭dialog
	$(document).on('click', '.aplPopupXbtn', function() {
		$(this).parents('.popupWrapper').closeDialog();
	});

	//编辑按钮
	$(document).on('click', '.btnEdit', function() {
		if ($(this).parents('.popupWrapper').length) {
			$(this).parents('.popupWrapper').showForm();
			$(this).parents('.popupWrapper').setDialogCenter();
		} else {
			$(this).parents('.acticle').showForm();
			
		}
		//隐藏验证红框
		$(this).find('form').hideAllValidation();
	});

	//取消按钮
	$(document).on('click', '.btnCancel', function() {
		if ($(this).parents('.popupWrapper').length) {
			if ($(this).parents('.popupWrapper').hasClass('noHideForm')) {
				$(this).parents('.popupWrapper').closeDialog();
			} else {
				$(this).parents('.popupWrapper').hideForm();
				$(this).parents('.popupWrapper').setDialogCenter();
			}
		} else {
			$(this).parents('.acticle').hideForm();
		}
	});

	//关闭alert confirm弹窗
	$(document).on('click', '.aplConfirmCancel, .aplConfirmXbtn, .aplConfirmOk', function() {
		$(this).parents('.confirmWrapper').remove();
	});
	
	//关闭dialog弹窗
	$(document).on('click', '.aplDialogOk', function() {
		$(this).parents('.popupWrapper').remove();
	});
	
	//checkbox点击选中框和内容都能选中
	/*$(document).on('click', '.checkbox-label label', function() {
		var checkbox = $(this).parent().children('input[type="checkbox"]');
		if (!checkbox.is(':disabled')) {
			if (checkbox.is(':checked')) {
				checkbox.prop('checked', false);
			} else {
				checkbox.prop('checked', true);
			}
			checkbox.change();
		}
	});*/
	
	//便利贴
//	if ($('body .wrapper .contents').length) {
//		$('body .wrapper').append('<div id="sticky" class="sticky" style="left: ' + ($('.leftMenuWrapper').offset().left + 5) + 'px;">'
//				+ '<div class="sticky-title">'
//					+ '<input type="text" value=""/>'
//					+ '<span class="icons"><i class="icon icon-white icon-plus" title="粘一个"></i><i class="icon icon-white icon-minus" title="撕掉"></i></span>'
//					+ '</div>'
//				+ '<textarea></textarea>'
//			+ '</div>');
//		$('#sticky').draggable({ 
//			handle: $('#sticky .sticky-title')
//		}); 
//		$('.sticky .sticky-title input').val('便利贴');
//		$('.sticky .sticky-title input').click(function() {
//			$(this).focus();
//		}); 
//	}
	
	//日程安排
//	$('body').append('<div class="schedule" title="日程安排" onclick="window.open(\'\/sample\/schedule.html\')"></div>');
	
});