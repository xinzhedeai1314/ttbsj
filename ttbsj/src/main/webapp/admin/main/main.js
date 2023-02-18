 var index_tabs, index_tabsMenu;
$(function() {
	index_tabs = $('#index_tabs').tabs({
		tabHeight : 44,
		fit : true,
		border : false,
		onContextMenu : function(e, title) {
			e.preventDefault();
			index_tabsMenu.menu('show', {
				left : e.pageX,
				top : e.pageY
			}).data('tabTitle', title);
		},
		/*onSelect:function(title, index){ 
		   var $currentTab = $(this).tabs("getSelected"); 
		   if($currentTab.find("iframe") && $currentTab.find("iframe").size()){
			  $currentTab.find("iframe").attr("src", $currentTab.find("iframe").attr("src"));
		   }
		}*/
	});

	index_tabsMenu = $('#index_tabsMenu').menu({
		onClick : function(item) {
			var curTabTitle = $(this).data('tabTitle');
			var type = $(item.target).attr('title');
			if (type === 'refresh') {
				var $currentTab = index_tabs.tabs('getTab', curTabTitle);
//				index_tabs.tabs('getTab', curTabTitle).panel('refresh');
				$currentTab.find("iframe").attr("src", $currentTab.find("iframe").attr("src"));
				return;
			}
			if (type === 'close') {
				var t = index_tabs.tabs('getTab', curTabTitle);
				if (t.panel('options').closable) {
					index_tabs.tabs('close', curTabTitle);
				}
				return;
			}
			var allTabs = index_tabs.tabs('tabs');
			var closeTabsTitle = [];
			$.each(allTabs, function() {
				var opt = $(this).panel('options');
				if (opt.closable && opt.title != curTabTitle && type === 'closeOther') {
					closeTabsTitle.push(opt.title);
				} else if (opt.closable && type === 'closeAll') {
					closeTabsTitle.push(opt.title);
				}
			});

			for ( var i = 0; i < closeTabsTitle.length; i++) {
				index_tabs.tabs('close', closeTabsTitle[i]);
			}
		}
	});
	
	$('.sider-nav').on('click', '.sider-nav-s a', function() {
		addTab({
			url : $(this).attr('data-href'),
			title : $(this).text(),
		});
	});
	
    $(document).on('click', '.sider-nav > li', function() {//左侧菜单点击展开事件
        $(this).siblings().removeClass('current').end().addClass('current');
        $('iframe').attr('src', $(this).data('src'));
    });
    
	$(document).on('mouseenter', '.sider-nav-s > li', function() {
		$(this).addClass('pulse').siblings().removeClass('pulse');
	});
	
	$(document).on('click', '.sider-nav-s > li', function() {
		$(this).addClass('active').siblings().removeClass('active');
	});
	var str = [{
		"title": "基本信息",
		"link": "/basic",
		"subMenu": [{
			"menu_id": "86ac3be6-390a-11e7-a2af-74d02b7d5f71",
			"icon": "role",
			"title": "管理员信息",
			"link": "/manage/admin.html"
		},
		{
			"menu_id": "86ac3be6-390a-11e7-a2af-74d02b7d5f71",
			"icon": "role",
			"title": "新人信息管理",
			"link": "/manage/user.html"
		},
		{
			"menu_id": "86ac3be6-390a-11e7-a2af-74d02b7d5f71",
			"icon": "role",
			"title": "播音信息",
			"link": "/manage/voice.html"
		}]
	}];

//	localStorage.setItem('mo2menu', str);
    var menu = str, p = '';
	for (var i = 0; i < menu.length; i++) {
		p += i == 0 ? '<li class="current">' : '<li>'; // 默认设置菜单第一个为展开状态
		p += '<a href="javascript:;">\
				<span class="iconfont sider-nav-icon">&#xe620;</span>\
	 			<span class="sider-nav-title">'+ menu[i].title +'</span>\
		 		<i class="iconfont">&#xe642;</i>\
			</a>';
		if (menu[i].subMenu && menu[i].subMenu.length > 0) {
			p += '<ul class="sider-nav-s">';
			for (var j = 0; j < menu[i].subMenu.length; j++) {
				p += j == 0 ? '<li class="active animated">' : '<li class="animated">'; // 默认设置菜单第一个为激活状态
				p += '<a data-href="..'+ menu[i].subMenu[j].link + '">'+ menu[i].subMenu[j].title + '</a>\
					  </li>';
			}
			p += '</ul>';
		}
		p += '</li>';
	}
	$('.sider-nav').html(p);
	$(window).resize(function() {
		$('.tabs-panels').height($("#pf-page").height() - 46);
		$('.panel-body').height($("#pf-page").height() - 76)
	}).resize();

	var page = 0, pages = ($('.pf-nav').height() / 70) - 1;
	if (pages === 0) {
		$('.pf-nav-prev, .pf-nav-next').hide();
	}
	$(document).on('click', '.pf-nav-prev, .pf-nav-next', function() {
		if ($(this).hasClass('disabled'))
			return;
		if ($(this).hasClass('pf-nav-next')) {
			page ++;
			$('.pf-nav').stop().animate({
				'margin-top' : -70 * page
			}, 200);
			if (page == pages) {
				$(this).addClass('disabled');
				$('.pf-nav-prev').removeClass('disabled');
			} else {
				$('.pf-nav-prev').removeClass('disabled');
			}
		} else {
			page --;
			$('.pf-nav').stop().animate({
				'margin-top' : -70 * page
			}, 200);
			if (page == 0) {
				$(this).addClass('disabled');
				$('.pf-nav-next').removeClass('disabled');
			} else {
				$('.pf-nav-next').removeClass('disabled');
			}
		}
	})

    $(document).on('click', '.toggle-icon', function() { //左侧菜单收起
        $(this).closest("#pf-bd").toggleClass("toggle");
        setTimeout(function(){
        	$(window).resize();
        },300)
    });

    $('.pf-modify-pwd').click(function() {//修改密码
        $('#pf-page').find('iframe').eq(0).attr('src', 'backend/modify_pwd.html')
    });
    
    
    $('#logout').click(function(){//安全退出
    	console.log('安全登出');
    	location.href = "../login.html";
    });
    
	// setTimeout(function(){
	// $('.tabs-panels').height($("#pf-page").height()-46);
	// $('.panel-body').height($("#pf-page").height()-76)
	// }, 200)
    
    

});
function addTab(params) {
	var iframe = '<iframe src="'
			+ params.url
			+ '" frameborder="0" style="border:0;width:100%;height:98%;" scrolling="yes"></iframe>';
	var t = $('#index_tabs');
	var opts = {
		title : params.title,
		closable : true,
		// iconCls : params.iconCls,
		content : iframe,
		border : false,
		fit : true
	};
	if (t.tabs('exists', opts.title)) {
		t.tabs('select', opts.title);
		// parent.$.messager.progress('close');
	} else {
		t.tabs('add', opts);
	}
}