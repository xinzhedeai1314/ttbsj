(function($) {
    $.selectSuggest = function(target, data, itemSelectFunction) {
    var defaulOption = {
      suggestMaxHeight: '200px',//弹出框最大高度
      itemColor : '#000000',//默认字体颜色
      itemBackgroundColor:'#fff',//默认背景颜色RGB(199,237,204)
      itemOverColor : '#ffffff',//选中字体颜色
      itemOverBackgroundColor : 'rgba(52, 195, 109, 0.7)',//'#337AB7',//选中背景颜色#C9302C
      itemPadding : 3 ,//item间距
      fontSize : 12 ,//默认字体大小
      alwaysShowALL : true //点击input是否展示所有可选项
      };
      var maxFontNumber = 0;//最大字数
      var currentItem;
      var suggestContainerId = target + "-suggest";
      var suggestContainerWidth = $('#' + target).innerWidth();
      var suggestContainerLeft = $('#' + target).offset().left;
      var suggestContainerTop = $('#' + target).offset().top + $('#' + target).outerHeight();
      var originValue = null,newVlue = null;
      var showClickTextFunction = function() {
        var text = $(this).text();
        console.info(text);
        /*$('#' + target).val(text);*/
       /* originValue = $('#content').val();
        newValue = originValue + text;*/
       
       // $('#content').val(newValue);
        currentItem = null;
        $('#' + suggestContainerId).hide();
        $("#dialogInput").val(text);
      //  $("#z-mcro-dialog").hide(500);
      //  $("#dialogInput").val('');
      }
      var suggestContainer;
      if ($('#' + suggestContainerId)[0]) {
        suggestContainer = $('#' + suggestContainerId);
        suggestContainer.empty();
      } else {
        suggestContainer = $('<div></div>'); //创建一个子<div>
      }
      suggestContainer.attr('id', suggestContainerId);
      suggestContainer.attr('tabindex', '0');
      suggestContainer.hide();
      $("#dialogInput").val('');
      var _initItems = function(items) {
        suggestContainer.empty();
          var itemHight=0;
        for (var i = 0; i < items.length; i++) {
            if(items[i].US_NAME > maxFontNumber){
              maxFontNumber = items[i].US_NAME.length;
              }
          var suggestItem = $('<div></div>'); //创建一个子<div>
          suggestItem.attr('id', items[i].US_ID);
          suggestItem.append(items[i].US_NAME);
          suggestItem.css({
            'padding':defaulOption.itemPadding + 'px',
            'white-space':'nowrap',
            'cursor': 'pointer',
            'background-color': defaulOption.itemBackgroundColor,
            'color': defaulOption.itemColor
          });
          suggestItem.bind("mouseover",
          function() {
            $(this).css({
              'background-color': defaulOption.itemOverBackgroundColor,
              'color': defaulOption.itemOverColor
            });
            currentItem = $(this);
          });
          suggestItem.bind("mouseout",
          function() {
            $(this).css({
              'background-color': defaulOption.itemBackgroundColor,
              'color': defaulOption.itemColor
            });
            currentItem = null;
          });
          suggestItem.bind("click", showClickTextFunction);
          suggestItem.bind("click", itemSelectFunction);
          suggestItem.appendTo(suggestContainer);
          //suggestContainer.appendTo(document.body);
          suggestContainer.appendTo("#selectChajian");
        }
      }
      var inputChange = function() {
        var inputValue = $('#' + target).val();
        inputValue = inputValue.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
        var matcher = new RegExp(inputValue, "i");
        return $.grep(data,
        function(value) {
          return matcher.test(value.US_NAME);
        });
      }
      $('#' + target).bind("keyup",
      function() {
        _initItems(inputChange());
      });
      $('#' + target).bind("blur",
      function() {
          if(!$('#' + suggestContainerId).is(":focus")){
             // $('#' + suggestContainerId).hide();
        	  if (currentItem) {
        		  currentItem.trigger("click");
        	  }
          currentItem = null;
          return;
         
          }					   
      });
      
      ShowDiv();
      function ShowDiv(){
    	  if (defaulOption.alwaysShowALL) {
     		 _initItems(data);
     	 } else {
     		 _initItems(inputChange());
     	 }
 	     $('#' + suggestContainerId).removeAttr("style");
 	     var tempWidth = defaulOption.fontSize*maxFontNumber + 2 * defaulOption.itemPadding + 30;
 	     var containerWidth = Math.max(tempWidth, suggestContainerWidth);
 	     var h = this.scrollHeight;
 	     $('#' + suggestContainerId).css({
 	          'border': '1px solid #ccc',
 	          'max-height': '100px',
 	          /* 'top': suggestContainerTop,
 	          'left': suggestContainerLeft,*/
 	          'top': 73,
 	          'left': 6,
 	          'width': 408,
 	          'position': 'absolute',
 	          'font-size': defaulOption.fontSize+'px',
 	          'font-family':'Arial',
 	          'z-index': 99999,
 	          'background-color': '#FFFFFF',
 	          'overflow-y': 'auto',
 	          'overflow-x': 'hidden',
 	          'white-space':'nowrap',
 	          'margin-top': '-3px'
 	     });
 	     $('#' + suggestContainerId).show();
      }
      
      $('#' + target).bind("click",function() {
    	  ShowDiv();
	   });
	   _initItems(data);
	   $('#' + suggestContainerId).bind("blur",function() {
	       $('#' + suggestContainerId).hide();
	       $("#dialogInput").val('');
	   });
    }
	 })(jQuery);