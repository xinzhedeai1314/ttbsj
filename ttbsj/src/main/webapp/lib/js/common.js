'use strict';
var contextPath = '';
//Timstamp 函数， durian请求体用
function makeStamp(d) { // Date d
	var y = d.getFullYear(), M = d.getMonth() + 1, D = d.getDate(), h = d
			.getHours(), m = d.getMinutes(), s = d.getSeconds(), ss = d
			.getMilliseconds(),

	pad = function(x) {
		x = x + '';
		if (x.length === 1) {
			return '0' + x;
		}
		return x;
	};
	return y + pad(M) + pad(D) + pad(h) + pad(m) + pad(s) + pad(ss);
}

/**
 * 
 * @functionName: getParameter
 * @Description: get parameter from URL 
 * @author: Double
 * 
 */
function getParameter(name) {
	var search = location.search;
	if(!search) {
		return false;
	}
	search = search.split('?');
	var data = search[1].split('=');
	if(search[1].indexOf(name) == (-1)) {
	    return '';
	    return;
	}
	if(search[1].indexOf('&') == (-1)) {
	    data = search[1].split('=');
	    return data[1];
	} else {
	   data = search[1].split('&'); 
	    var i;
	    for(i = 0; i <= data.length - 1; i++){
	    	var l_data=data[i].split('=');
	        if(l_data[0] == name) {
	        	return l_data[1];
	        	break;
	        } else {
	        	continue;
	        }
	    }
	}
}

/**
 * 
 * @functionName: setParameter
 * @Description: set parameter to URL 
 * @author: Double
 * 
 */
function setParameter() {
	if (arguments.length >= 1) {
		var url = arguments[0], paramsObj = arguments[1];
		if (paramsObj) {
			var parameter = '';
			for (var x in paramsObj) {
				parameter += x + '=' + paramsObj[x] + '&';
			}
			url += '?' + parameter.substr(0, parameter.length - 1);
		}
		return url;
	} else {
		alert('setParameter : 参数错误, 支持2个参数(url-必填, paramsObj)');
	}
}

/**
 * 
 * @functionName: trim
 * @Description: 由于IE8不支持trim方法，此处自定义 
 * @author: Double
 * 
 */
String.prototype.trim = function() {  
    return this.replace(/(^\s*)|(\s*$)/g, '');  
}

/**
 * 
 * @functionName: setCookie
 * @Description: set cookies 
 * @author: Double
 * 
 */
function setCookie(name, value, expires) { 
	var len= arguments.length; 
	if (len == 2) {
	    var exp = new Date(); 
	    exp.setTime(exp.getTime() + 120*60*1000); 
	    document.cookie = name + '='+ escape (value) + ';expires=' + exp.toGMTString() + ';path=/'; 
	} else if (len == 3) {
		var exp = new Date();
		exp.setDate(exp.getDate() + 1);
		exp.setHours(1, 0, 0, 0);
		document.cookie = name + '='+ escape (value) + ';expires=' + exp.toGMTString() + ';path=/';
	} else {
		alert('SetCookie参数错误!');
	}
   
} 

/**
 * 
 * @functionName: getCookie
 * @Description: get cookies 
 * @author: Double
 * 
 */
function getCookie(name) { 
    var arr,reg=new RegExp('(^| )'+name+'=([^;]*)(;|$)');
 
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]); 
    else 
        return null; 
} 

/**
 * 
 * @functionName: delCookie
 * @Description: delete cookies 
 * @author: Double
 * 
 */
function delCookie(name) { 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval = getCookie(name); 
    if(cval != null) 
        document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ';path=/'; 
}

/**
 * 
 * @functionName: serializeObject
 * @Description: form序列化成object
 * @author: Double
 * @param: form
 */
/*var serializeObject = function() {
	if (arguments.length === 1) {
		var form = arguments[0], o = {};
		$.each(form.serializeArray(), function(index) {
			if (o[this['name']]) {
				o[this['name']] = o[this['name']] + ',' + this['value'].trim();
			} else {
				o[this['name']] = this['value'].trim();
			}
		});
		return o;
	} else {
		alert('serializeObject : 参数错误, 支持1个参数(form)');
	}
};
*/
$.serializeObject = function(form) {//jianghaipeng
	var o = {};
	$.each(form.serializeArray(), function(index) {
		if (o[this['name']]) {
			o[this['name']] = o[this['name']] + "," + this['value'];
		} else {
			o[this['name']] = this['value'];
		}
	});
	return o;

};

/**
 * 
 * @functionName: downloadByForm
 * @Description: form表单下载文件
 * @author: Double
 * @param: url, paramsObj, button
 */
function downloadByForm() {
	if (arguments.length === 3) {
		var url = arguments[0], paramsObj = arguments[1], button = arguments[2],
		orgText = $(button).text();
		$(button).text('下载中...');
		$(button).addClass('btnDisabled');
		$(button).attr('disabled', true);
		
		setTimeout("$('" + button + "').text('" + orgText + "'); $('" + button + "').removeClass('btnDisabled'); $('" + button + "').attr('disabled', false);", 2000);
		
		var form = $('<form>');
	    form.attr('style', 'display:none');
	    form.attr('target', '');
	    form.attr('method', 'post');
	    form.attr('action', url);
	    
	    $('body').append(form);
	    for (var x in paramsObj) {
	    	var input = $('<input>'); 
	        input.attr('type', 'hidden'); 
	        input.attr('name', x); 
	        input.attr('value', paramsObj[x]); 
	        form.append(input);
	    }
	    form.submit();
	} else {
		alert('downloadByForm : 参数错误, 支持3个参数(url, paramsObj, button)');
	}
}

/**
 * 
 * @functionName: formatDate
 * @Description: 格式化Date对象
 * @author: Double
 * @param: date, symbol-选填
 */
function formatDate() {  
	if (arguments.length > 0 && arguments.length < 3) {
		var date = arguments[0], symbol = (arguments[1] ? arguments[1] : '-'),
		year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
		month = month < 10 ? '0' + month : month;
		day = day < 10 ? '0' + day : day;
		return year + symbol +  month + symbol + day;
	} else {
		alert('formatDate : 参数错误, 支持2个参数(date, symbol-选填)');
	}
}

/**
 * 
 * @functionName: objToStr
 * @Description: 将JSON转换为String, 作为参数传进函数
 * @author: Double
 * @param: obj
 */
function objToStr(obj) {
	if (arguments.length === 1) {
		return JSON.stringify(obj).replace(/ /g, '&nbsp;');
	} else {
		alert('objToStr : 参数错误, 支持1个参数(obj)');
	}
}

/*
 //easyUI下datagrid的跨页选择
function crossPageChecked() {
	if(arguments.length === 4) {
		var checkedRows = arguments[0], data = arguments[1], idField = arguments[2], option = arguments[3], 
		checkedRowsStr = checkedRows.join();
		switch(option) {
		case 'check' : {
			if(checkedRows.indexOf(data[idField]) === -1) {
				checkedRows.push(data[idField]);
			}
		} 
		break;
		case 'uncheck' : {
			if(checkedRows.indexOf(data[idField]) !== -1) {
				checkedRows.splice(checkedRows.indexOf(data[idField]), 1);
			}	
		} 
		break;
		case 'checkall' : {
			for(var x in data) {
				if(data[x][idField]) {
					if(checkedRows.indexOf(data[x][idField]) === -1) {
						checkedRows.push(data[x][idField]);
					}	
				}
			}
		} 
		break;
		case 'uncheckall' : {
			for(var x in data) {
				if(data[x][idField]) {
					if(checkedRows.indexOf(data[x][idField]) !== -1) {
						checkedRows.splice(checkedRows.indexOf(data[x][idField]), 1);
					}	
				}
			}
		} 
		break;
		}
		return checkedRows;
	} else {
		alert('参数错误: easyUI Datagrid CrossPage crossPageChecked');
		return [];
	}
}

function addCrossPageToOptions() {
	if(arguments.length === 1) {
		var options = arguments[0];
		options.onCheck = function(rowIndex, rowData) {
			checkedRows = crossPageChecked(checkedRows, rowData, $(this).datagrid('options').idField, 'check');
		};
	    options.onUncheck = function(rowIndex, rowData) {
	    	checkedRows = crossPageChecked(checkedRows, rowData, $(this).datagrid('options').idField, 'uncheck');
	    };
	    options.onCheckAll = function(rows) {
	    	checkedRows = crossPageChecked(checkedRows, rows, $(this).datagrid('options').idField, 'checkall');
	    }
	    options.onUncheckAll = function(rows) {
	    	checkedRows = crossPageChecked(checkedRows, rows, $(this).datagrid('options').idField, 'uncheckall');
	    };
		return options;
	} else {
		alert('参数错误: easyUI Datagrid CrossPage addCrossPageToOption');
		return [];
	}
}
*/

/*********************************************************************************************************************************************************/
/* 待取用方法  */

/**
 * 
 * @functionName: JSONArrayToList
 * @Description: JSON数组转换为字符串
 * @author: Double
 * @param: array
 */
function JSONArrayToList() {
	if (arguments.length === 1) {
		var array = arguments[0], list = '[';
		for(var i=0; i<array.length; i++) {
			list += JSON.stringify(array[i]);
			if(i < array.length - 1) {
				list += ',';
			}
		}
		list += ']';
		return list;
	} else {
		alert('JSONArrayToList : 参数错误, 支持1个参数(array)');
	}
}

/**
 * 
 * @functionName: TableToJSONArray
 * @Description: 表格转换为JSON数组
 * @author: Double
 * 
 */
function TableToJSONArray(table, start, end, keyArr) {
	var list = new Array();
	var trs = $('#' + table + ' tbody').find('tr');
	for(var i = 0; i < trs.length; i++) {
		var keyCount = 0;
		var trObj = new Object();
		var tds = $(trs[i]).children();
		for(var j = start; j <= end && j < tds.length; j++) {
			var items = tds.eq(j).children();
			if(items != null && items.length > 0) {
				for(var q = 0; q < items.length; q++) {
					trObj[keyArr[keyCount]] = items.eq(q).val();
					keyCount++;
				}
			} else {
				trObj[keyArr[keyCount]] = tds.eq(j).text();
				keyCount++;
			}
		}
		list[i] = trObj;
	}
	return list;
}

/**
 * 
 * @functionName: showViewPage
 * @Description: input、select、textarea转成span、pre，隐藏按钮
 * @author: Double
 * @param: firstcall 首次加载时为true
 * @param: region #id .class tagname
 * 
 */
function showViewPage(region, firstcall) {
	if(region != null && typeof(region) == 'string') {
		if(firstcall) {
			$(region + ' input:visible, ' + region + ' .fileview input').each(function() {
				$(this).before('<span class="viewtag">' + $(this).val() + '</span>');
				$(this).hide();
			});
			$(region + ' select:visible, ' + region + ' .fileview select').each(function() {
				$(this).before('<span class="viewtag">' + $(this).find('option:selected').text() + '</span>');
				$(this).hide();
			});
			$(region + ' textarea:visible, ' + region + ' .fileview textarea').each(function() {
				$(this).before('<pre class="viewtag" style="white-space: pre-wrap; word-wrap: break-word;">' + $(this).val() + '</pre>');
				$(this).hide();
			});
			$(region + ' .comboxview:visible').each(function() {
				$(this).before('<span class="viewtag">' + $(this).find('input').val() + '</span>');
				$(this).hide();
			});
			$(region + ' .gridview button:visible, ' + region + ' .gridview form table:visible, ' + region + ' .gridview .bui-grid:visible .bui-grid-checkBox-container').addClass('showview').hide();
		} else {
			$('.viewtag').next().hide();
			$('.viewtag').show();
			$('.showview').hide();
			$(region + ' .fileview iframe').each(function() {
				$(this)[0].contentWindow.$('.batch-pic ul li a div.delete-pic').parent().hide();
			});
		}
		$(region + ' .fileview button').hide();
	} else {
		alert('参数错误');
	}
}

/**
 * 
 * @functionName: showModifyPage
 * @Description: span、pre转成input、select、textarea，显示被隐藏按钮
 * @author: Double
 * 
 */
function showModifyPage() {
	//将viewtag的text重新赋给input、textarea等的value
	$('.viewtag').each(function() {
		/*if($(this).next('.comboxview').length > 0) { //comboxview重新赋值
			$(this).next('.comboxview').find('.bui-combox .bui-simple-list ul li').remove();
			var packingArr = $(this).text().split(';');
			for(var i = 0; i < packingArr.length && packingArr[i] != ''; i++) {
				$(this).next('.comboxview').find('.bui-combox .bui-simple-list ul').append('<li class="bui-list-item">' + packingArr[i] + '<button type="button">×</button></li>');
			}
		} else {}*/
		 
		if($(this).next().is('select')) {
			var options = $(this).next().children();
			for(var i = 0; i < options.length; i++) {
				if($(options).eq(i).text() == $(this).text()) {
					$(this).next().val($(options).eq(i).val());
					break;
				}
			}
		} else {
			$(this).next().val($(this).text());
		}
	
	});
	$('.viewtag').next().show();
	$('.viewtag').hide();
	$('.showview, .fileview button').show();
	$('.fileview iframe').each(function() {
		$(this)[0].contentWindow.$('.batch-pic ul li a div.delete-pic').parent().show();
	});
}

/**
 * 
 * @functionName: showViewPageModified
 * @Description: dialog显示view视图的临时解决办法
 * @author: Double
 * 
 */
function showViewPageModified() {
	$('.viewtag').each(function() {
		if($(this).next().is('select')) {
			$(this).text($(this).next().find('option:selected').text());
		} else {
			$(this).text($(this).next().val());
		}
	});
	$('.viewtag').next().hide();
	$('.viewtag').show();
}

/**
 * 
 * @functionName: removeViewTag
 * @Description: 移除view视图的tag
 * @author: Double
 * 
 */
function removeViewTag() {
	showModifyPage();
	$('.viewtag').remove();
	$('.showview').removeClass('showview');
}

/**
 * 
 * @functionName: printViewPage
 * @Description: 打印页面view显示方式
 * @author: Double
 * @param: pageWidth 被调宽的页面传入此参数，否则不传
 * 
 */
function printViewPage(pageWidth) {
	var changeWidthFlag = false; 
	if(pageWidth != null && pageWidth != '' && parseInt(pageWidth) != 'NaN') {
		pageWidth = parseInt(pageWidth);
		changeWidthFlag = true; 
	}
	//打印前
	$('.page-header').hide();
	$('.demo-container').css({'border' : '0', 'padding' : '0'});
	$('.demo-container button:visible').addClass('printtag').hide();
	if(changeWidthFlag) {
		$('.buttonBox, .searchResult').css('width', '1000px');
		$('.bui-grid-header, .bui-grid-body').css({'width' : '998px'});
		$('.bui-grid-body').css({'overflow-x' : 'hidden'});
	}
	window.print();
	//打印后
	$('.page-header').show();
	$('.demo-container').css({'border' : '1px solid #ddd', 'padding' : '10px'});
	$('.printtag').show().removeClass('printtag');
	if(changeWidthFlag) {
		$('.buttonBox, .searchResult').css('width', pageWidth + 'px');
		$('.bui-grid-header, .bui-grid-body').css({'width' : (pageWidth - 2) + 'px'});
		$('.bui-grid-body').css({'overflow-x' : 'auto'});
	}
}

/**
 * 
 * @functionName: printDialog
 * @Description: 打印Dialog内容
 * @author: Double
 * @param: dialog 需打印的dialog名称
 * 
 */
function printDialog(dialog) {
	dialog.close();
	$('.bui-dialog:not(.bui-message):visible').addClass('printDialog').removeClass('bui-dialog');
	$('.printDialog').css({'visibility': 'visible', 'left': '0px', 'top': '0px'});
	$('.printDialog .bui-stdmod-header, .printDialog .bui-stdmod-footer, .printDialog .bui-ext-close, .demo-container .buttonBox, .demo-container .searchBox, .demo-container .searchResult').hide();
	$('.printDialog .bui-stdmod-body button:visible').addClass('printButtonView').hide();
	printViewPage();
	$('.printDialog .bui-stdmod-body .printButtonView').show().removeClass('printButtonView');
	$('.printDialog .bui-stdmod-header, .printDialog .bui-stdmod-footer, .printDialog .bui-ext-close, .demo-container .buttonBox, .demo-container .searchBox, .demo-container .searchResult').show();
	$('.printDialog').css({'visibility': 'visible', 'left': '268.5px', 'top': '238.5px'});
	$('.printDialog').addClass('bui-dialog').removeClass('printDialog');
	dialog.show();
}

/**
 * 
 * @functionName: Translate
 * @Description: 翻译数字
 * @author: zhangsong
 * @param: 数字(string类型)
 * 
 */
function Translate(num) {
	
	var arr1 = new Array("", " THOUSAND", " MILLION", " BILLION");
	var arr2 = new Array("ZERO", "TEN", "TWENTY", "THIRTY", "FORTY", "FIFTY",
			"SIXTY", "SEVENTY", "EIGHTY", "NINETY");
	var arr3 = new Array("ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX",
			"SEVEN", "EIGHT", "NINE");
	var arr4 = new Array("TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN",
			"FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN");
	
	function English(num) {
		var strRet = "";
		if ((num.length == 3) && (num.substr(0, 3) != "000")) {
			if ((num.substr(0, 1) != "0")) {
				strRet += arr3[num.substr(0, 1)] + " HUNDRED";
				if (num.substr(1, 2) != "00")
					strRet += " AND ";
			}
			num = num.substring(1);
		}
		if ((num.length == 2)) {
			if ((num.substr(0, 1) == "0")) {
				num = num.substring(1);
			} else if ((num.substr(0, 1) == "1")) {
				strRet += arr4[num.substr(1, 2)];
			} else {
				strRet += arr2[num.substr(0, 1)];
				if (num.substr(1, 1) != "0")
//					strRet += "-"
				num = num.substring(1);
			}
		}
		if ((num.length == 1) && (num.substr(0, 1) != "0")) {
			strRet += arr3[num.substr(0, 1)];
		}
		return strRet;
	}
	
	var len = num.length, i, j = 0, strRet = "";
	var cols = Math.ceil(len / 3);
	var first = len - cols * 3;
	var strRet = "";
	for (i = first; i < len; i += 3) {
		++j;
		if (i >= 0)
			num3 = num.substring(i, i + 3);
		else
			num3 = num.substring(0, first + 3);
		strEng = English(num3);
		if (strEng != "") {
			if (strRet != "")
				strRet += ",";
			strRet += English(num3) + arr1[cols - j];
		}
	}
	return strRet;
}
/**
 * 
 * @functionName: Translate
 * @Description: 翻译数字的小数部分
 * @author: zhangsong
 * @param: 数字(int)
 * 
 *//*
function TranslatePoint(num) {
	if(num > 0) {
		return ' CENTS ' + Translate(num + '');
	}
	return '';
//	var strRet = " CENTS ",
//	num = Math.floor(num * 100) - Math.floor(num) * 100;
//	if (num > 0) {
//		strRet += arr3[Math.floor(num / 10)] + "";
//		if (num - Math.floor(num / 10) * 10 > 0)
//			strRet += arr3[num - Math.floor(num / 10) * 10];
//		return strRet;
//	}
//	return "";
}*/

/**
 * 
 * @functionName: clone
 * @Description: 重写jQuery.clone方法
 * @author: Double
 * 
 */
(function (original) {
	jQuery.fn.clone = function () {
		var result = original.apply(this, arguments),
		my_textareas = this.find('textarea').add(this.filter('textarea')),
		result_textareas = result.find('textarea').add(result.filter('textarea')),
		my_selects = this.find('select').add(this.filter('select')),
		result_selects = result.find('select').add(result.filter('select'));
		 
		for (var i = 0, l = my_textareas.length; i < l; ++i) $(result_textareas[i]).val($(my_textareas[i]).val());
		for (var i = 0, l = my_selects.length; i < l; ++i) result_selects[i].selectedIndex = my_selects[i].selectedIndex;
		 
		return result;
	};
}) (jQuery.fn.clone);

// 处理键盘事件
//禁止后退键（Backspace）密码或单行、多行文本框除外

function banBackSpace(e) {
	var ev = e || window.event;// 获取event对象
	var obj = ev.target || ev.srcElement;// 获取事件源
	var t = obj.type || obj.getAttribute('type');// 获取事件源类型
   
   // 获取作为判断条件的事件类型
   var vReadOnly = obj.getAttribute('readonly');
   var vEnabled = obj.getAttribute('enabled');
   // 处理null值情况
   var userAgent = navigator.userAgent.toLowerCase();
   var rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
   var match = rMsie.exec(userAgent);  
   if (match != null) {
    	if(parseInt(match[2]) == 8) //IE 8.0 
    		vReadOnly = (vReadOnly == '') ? null : vReadOnly;
   }
   vReadOnly = (vReadOnly == null) ? false : true;
   vEnabled = (vEnabled == null) ? true : vEnabled;
   
   // 当敲Backspace键时，事件源类型为密码或单行、多行文本的，
   // 并且readonly属性为true或enabled属性为false的，则退格键失效
   var flag1 = (ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea") && (vReadOnly == true || vEnabled != true)) ? true : false;

   // 当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
   var flag2 = (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea") ? true : false;

   // 判断
   if(flag1) {
       return false;
   }
   if(flag2) {
       return false;
   }

}
//禁止后退键
//作用于Firefox、Opera
document.onkeypress = banBackSpace;
//禁止后退键 
//作用于IE、Chrome
document.onkeydown = banBackSpace;
/**
 * 
 * @functionName: Md5
 * @Description: 加密密码
 * @author: jianghaipeng
 * 
 */

//md5 
var hexcase = 0;  
var b64pad  = ""; 
var chrsz   = 8;  

function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

function core_md5(x, len)
{
  
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function core_hmac_md5(key, data)
{
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

function str2binl(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

function binl2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  return str;
}

function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}

/*
 * 
 *@Description 暂时废弃方法
 *
//打印方法，可以传参，传入值：需要打印的div块的id值，传参个数不限
function printDiv() {
	var str = "";
	var id;
	$('body').append('<!--startprint-->\
			<div id="printdiv"></div>\
			<!--endprint-->');
	
	for(var i=0; i<arguments.length; i++){
		$('#' + arguments[i]).clone(true).appendTo("#printdiv");
	}
	
	//获取图片
	$('#printdiv').append('<div id="imgList"></div>')
	var imgList = $('#photoFilePreIframe')[0].contentWindow.$('.batch-pic ul').children(),
	imgList_new = '';
	if(imgList.length > 0) {
		imgList_new += '<ul>';
		for(var i = 0; i < imgList.length; i++) {
			imgList_new += '<li>' + $(imgList[i]).children().eq(1).children().html() + '</li>';
		}
		imgList_new += '</ul>';
	}
	
	$('#printdiv #imgList').append(imgList_new);
	$('#printdiv #imgList li').css({"display": "inline-block","width": "220"});
	$('#printdiv #imgList img').css({"width": "200"});
	$('#printdiv .noprint').remove();
	
	$('#printdiv div[id*="grid"]').each(function() {
		id = $(this).attr("id");
		print_transTable(id);
	});
	
	for(var i=0; i<arguments.length;i++) {
		$('#printdiv #' + arguments[i] + ' form').each(function () {
			id = $(this).attr("id");
			print_transForm(id);
		});
	}
	//调整新产品详情打印预览表格的宽度
	$('#printdiv table').css({"width": "91%"});
	$('#printdiv .bui-grid-header').css({'width' : '90.9%', 'margin-left' : '9px'});
	$('#printdiv .bui-grid-body').css({'width' : '90.9%', 'margin-left' : '9px', 'overflow-x' : 'hidden'});

	//隐藏所有button
	$('#printdiv button').hide();
	
	var test = $('body').children().clone(true);
	
	bdhtml=window.document.body.innerHTML;//获取当前页的html代码 
	sprnstr="<!--startprint-->";//设置打印开始区域 
	eprnstr="<!--endprint-->";//设置打印结束区域 
	prnhtml=bdhtml.substring(bdhtml.indexOf(sprnstr)+18); //从开始代码向后取html 
	prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));//从结束代码向前取html 
	window.document.body.innerHTML=prnhtml;
	window.print();
	
	$('body').html(test);
	$('#printdiv').remove();
}

//传入值：form表格的id
//将所有select,input,textarea类型标签隐藏，换为span标签添加，并修改字体及颜色
function print_transForm(id) {
	//表格字体及颜色调整
	$('#printdiv #'+ id + ' th,td').attr("nowrap","nowrap");//字体自适应
	$('#printdiv #'+ id + ' tr th').css({"font-size": "15px","color": "#000000"});
	$('#printdiv #'+ id + ' tr td').css({"font-size": "15px","color": "#000000"});
	
	$('#printdiv #'+ id +' select').each(function () {
		var temp = $(this).find("option:selected").text();
		$(this).after('<span>'+temp+'</span>');
		$(this).hide();
	});
	$('#printdiv #'+ id +' div.bui-combox').parent().each(function () { //
		var tempid = $(this).attr("id");
		$(this).after('<span>'+$('#'+tempid+' input').val()+'</span>');
		$(this).hide();
	});
	$('#printdiv #'+ id +' input:not([type="hidden"])').each(function () {//将printdiv中的隐藏文本框过滤掉
		var temp = $(this).val();
		$(this).after('<span>'+temp+'</span>');
		$(this).hide();
	});
	$('#printdiv #'+ id +' textarea').each(function () {
		var temp = $(this).val();
		$(this).after('<pre>'+temp+'</pre>');
		$(this).hide();
	});
}

//传入值：gird__ 类型表格的id，去除checkbox列，修改字体及颜色
function print_transTable(id) {
	//去除每行第一列checkbox列表
	$('#printdiv #' + id + ' tr').each(function(){   
	    $(this).children("td:first").attr("style","width: 0;");
	    $(this).children("th:first").attr("style","width: 0;");
	});
	//表格字体及颜色调整
	$('#printdiv #' + id + ' tr th').css({"font-size": "15px","color": "#000000"});
	$('#printdiv #' + id + ' tr td').css({"font-size": "15px","color": "#000000"});
}*/

//计算收藏总数  jianghaipeng
function sum(a, b){
	var n;
	if(a != null){
		if(b != null)
			n = a + b;
		else
			n = a;
	}else{
		if(b != null)
			n = b;
		else
			n = 0;
	}
	return n;
}

//页面回到顶部 jianghaipeng
var scrolltotop={//回到顶部
		setting:{
			startline:100, //起始行
			scrollto:0, //滚动到指定位置
			scrollduration:400, //滚动过渡时间
			fadeduration:[500,100] //淡出淡现消失
		},
		controlHTML:'<img src="'+ contextPath +'/lib/img/images/topback.gif" style="width:54px; height:54px; border:0; " />', //返回顶部按钮
		controlattrs:{offsetx:0,offsety:115},//返回按钮固定位置
		anchorkeyword:"#top",
		state:{
			isvisible:false,
			shouldvisible:false
		},scrollup:function(){
			if(!this.cssfixedsupport){
				this.$control.css({opacity:0});
			}
			var dest=isNaN(this.setting.scrollto)?this.setting.scrollto:parseInt(this.setting.scrollto);
			if(typeof dest=="string"&&jQuery("#"+dest).length==1){
				dest=jQuery("#"+dest).offset().top;
			}else{
				dest=0;
			}
			this.$body.animate({scrollTop:dest},this.setting.scrollduration);
		},keepfixed:function(){
			var $window=jQuery(window);
			var controlx=$window.scrollLeft()+$window.width()-this.$control.width()-this.controlattrs.offsetx;
			var controly=$window.scrollTop()+$window.height()-this.$control.height()-this.controlattrs.offsety;
			this.$control.css({left:controlx+"px",top:controly+"px"});
		},togglecontrol:function(){
			var scrolltop=jQuery(window).scrollTop();
			if(!this.cssfixedsupport){
				this.keepfixed();
			}
			this.state.shouldvisible=(scrolltop>=this.setting.startline)?true:false;
			if(this.state.shouldvisible&&!this.state.isvisible){
				this.$control.stop().animate({opacity:1},this.setting.fadeduration[0]);
				this.state.isvisible=true;
			}else{
				if(this.state.shouldvisible==false&&this.state.isvisible){
					this.$control.stop().animate({opacity:0},this.setting.fadeduration[1]);
					this.state.isvisible=false;
				}
			}
		},init:function(){
			jQuery(document).ready(function($){
				var mainobj=scrolltotop;
				var iebrws=document.all;
				mainobj.cssfixedsupport=!iebrws||iebrws&&document.compatMode=="CSS1Compat"&&window.XMLHttpRequest;
				mainobj.$body=(window.opera)?(document.compatMode=="CSS1Compat"?$("html"):$("body")):$("html,body");
				mainobj.$control=$('<div id="topcontrol">'+mainobj.controlHTML+"</div>").css({position:mainobj.cssfixedsupport?"fixed":"absolute",bottom:mainobj.controlattrs.offsety,right:mainobj.controlattrs.offsetx,opacity:0,cursor:"pointer"}).attr({title:"返回顶部"}).click(function(){mainobj.scrollup();return false;}).appendTo("body");if(document.all&&!window.XMLHttpRequest&&mainobj.$control.text()!=""){mainobj.$control.css({width:mainobj.$control.width()});}mainobj.togglecontrol();
				$('a[href="'+mainobj.anchorkeyword+'"]').click(function(){mainobj.scrollup();return false;});
				$(window).bind("scroll resize",function(e){mainobj.togglecontrol();});
			});
		}
	};
	scrolltotop.init();