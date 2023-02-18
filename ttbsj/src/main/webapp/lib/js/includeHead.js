var jsVersion = '?v=20160111001', cssVersion = '?v=20160111001', cPathInclude = '';

//页面样式表
/*document.write('<link rel="stylesheet" type="text/css" href="/lib/css/default.css' + jsVersion + '" />');*/

//加入公用css
document.write('<link rel="stylesheet" type="text/css" href="'+ cPathInclude +'/lib/css/bootstrap.min.css" />\
		<link rel="stylesheet" type="text/css" href="'+ cPathInclude +'/lib/css/bootstrap-datetimepicker.css" />\
		<link rel="stylesheet" type="text/css" href="'+ cPathInclude +'/lib/css/font-awesome.min.css" />\
		<link type="text/css" href="'+ cPathInclude +'/lib/css/style.css" rel="stylesheet"/>\
		<link type="text/css" href="'+ cPathInclude +'/lib/css/qingganlan.css" rel="stylesheet">');

//easyUI(datagrid, switch)
document.write('<link rel="stylesheet" type="text/css" href="'+ cPathInclude +'/lib/plugin/jquery-easyui-1.4.4/themes/metro/easyui.css" />');

//jQueryUI(datepicker)
/*document.write('<link rel="stylesheet" type="text/css" href="/lib/plugin/jquery-ui-1.11.4.custom/jquery-ui.min.css' + cssVersion + '" />\
				<link rel="stylesheet" type="text/css" href="/lib/css/extend-jQueryUI.css' + cssVersion + '" />\
				<link rel="stylesheet" type="text/css" href="/lib/plugin/jquery-ui-1.11.4.custom/jquery-ui-timepicker-addon.min.css' + cssVersion + '" />');*/

//plupload
document.write('<link rel="stylesheet" type="text/css" href="'+ cPathInclude +'/lib/plugin/plupload-2.1.2/jquery.ui.plupload/css/jquery-ui.min.css" />\
				<link rel="stylesheet" type="text/css" href="'+ cPathInclude +'/lib/plugin/plupload-2.1.2/jquery.ui.plupload/css/jquery.ui.plupload.css" />');

//20150902:添加项目公用js
document.write('<script type="text/javascript" src="'+ cPathInclude +'/lib/js/jquery-1.11.3.js"></script>\
		<script type="text/javascript" src="'+ cPathInclude +'/lib/js/jquery.zclip.js"></script>\
		<script type="text/javascript" src="'+ cPathInclude +'/lib/js/bootstrap.min.js"></script>\
		<script type="text/javascript" src="'+ cPathInclude +'/lib/js/bootstrap-datetimepicker.js"></script>\
		<script type="text/javascript" src="'+ cPathInclude +'/lib/js/bootstrap-datetimepicker.zh-CN.js"></script>\
		<script type="text/javascript" src="'+ cPathInclude +'/lib/js/common.js"></script>');
//easyUI
/*document.write('<script type="text/javascript" src="/lib/plugin/jquery-easyui-1.4.4/jquery.easyui.min.js"></script>\
				<script type="text/javascript" src="/lib/js/extend-easyUI.js"></script>\
				<script type="text/javascript" src="/lib/plugin/jquery-easyui-1.4.4/locale/easyui-lang-zh_CN.js"></script>');*/


//plupload
document.write('<script type="text/javascript" src="'+ cPathInclude +'/lib/plugin/plupload-2.1.2/jquery.ui.plupload/jquery-ui.min.js"></script>\
				<script type="text/javascript" src="'+ cPathInclude +'/lib/plugin/plupload-2.1.2/plupload.full.min.js"></script>\
				<script type="text/javascript" src="'+ cPathInclude +'/lib/plugin/plupload-2.1.2/jquery.ui.plupload/jquery.ui.plupload.min.js"></script>\
				<script type="text/javascript" src="'+ cPathInclude +'/lib/plugin/plupload-2.1.2/i18n/zh_CN.js"></script>');

//layerUI
document.write('<script type="text/javascript" src="'+ cPathInclude +'/lib/js/layer.js"></script>');