(function(){
	var Util=(function(){
		var prefix='html5_reader_';//防止各storage互相覆盖
		//获取storage
		var storageGetter=function(key){
			return localStorage.getItem(prefix+key);
		}
		//设置storage
		var storageSetter=function(key,val){
			return localStorage.setItem(prefix+key,val);
		}
		//数据解密
		var getJSONP=function(url,callback){
			return $.jsonp({
				url:url,
				cache:true,
				callback:'duokan_fiction_chapter',							
				success:function(result){//数据处理成功时处理的代码									
					var data=$.base64.decode(result);
					var json=decodeURIComponent(escape(data));
					callback(json);
				}
			});
		}
		//暴露方法
		return {
			StorageGetter:storageGetter,
			StorageSetter:storageSetter,
			getJSONP:getJSONP
		}
	})();
	var Dom={
		top_nav:$("#top-nav"),//顶部返回书架、
		footer_nav:$("#footer-nav"),//底部目录、
		font_bk_container:$(".font-bk-container"),//子导航条部分
		fontsize_bk_switch:$("#fontsize_inner"),//整个字体部分：字体图标、字体
		fontsize_bk:$("#fontsize_bk"),//字体图标		
	};
	var Win = $(window);
	var Doc = $(document);
	var fictionContainer=$("#fiction_container");//文章内容
	var readerModel,readerUI;
	var initialSize = Util.StorageGetter("font-size");
	initialSize = parseInt(initialSize);
	if(!initialSize){
		initialSize = 14;
	}
	fictionContainer.css("font-size",initialSize);
	var initialBgColor = Util.StorageGetter("background-color");
	fictionContainer.css("background-color",initialBgColor);
	function main(){
		//todo 整个项目的入口函数
		readerModel=ReaderModel();
		readerUI = ReaderBaseFrame(fictionContainer);
		readerModel.init(function(data){
			readerUI(data);
		});

		EventHandler();		
	}
	function ReaderModel(){
	    //实现和阅读器相关的数据交互的方法
		var chapter_id;
		var chapters=[];
		var init=function(UIcallback){
			getFictionInfo(function(){
				getCurChapterContent(chapter_id,function(data){
					UIcallback&&UIcallback(data);
				});
			});
		}
		//获取小说信息
		var getFictionInfo=function(callback){
			console.log(callback);
			$.get('data/chapter.json',function(data){
				//获得章节信息之后的回调
				chapter_id=Util.StorageGetter("lastRead_chapter");
				console.log(chapter_id);
				// console.log(data.chapters[1].chapter_id);
				if(chapter_id==null){
					chapter_id=data.chapters[1].chapter_id;
				}							
				for (var i=0;i<data.chapters.length;i++) {
					chapters.push({"chapter_id":data.chapters[i].chapter_id,"title":data.chapters[i].title});
				}
				callback&&callback();
			},'json');		
		}
		//获取当前章节的内容
		var getCurChapterContent = function(chapter_id,callback){
			console.log(chapter_id);
			$.get('data/data'+chapter_id+'.json',function(data){
				//判断服务器状态
				if(data.result == 0){//为0时，服务器状态成功
					var url = data.jsonp;
					Util.getJSONP(url,function(data){
						callback&&callback(data);
					});
				}
			},'json');
		}
		//获取上节章节内容
		var prevChapter = function(UIcallback){
			chapter_id = parseInt(chapter_id,10);
			if(chapter_id==0){
				return;
			}
			chapter_id-=1;
			getCurChapterContent(chapter_id,UIcallback);
			Util.StorageSetter("lastRead_chapter",chapter_id);
		}
		//获取下节章节内容
		var  nextChapter = function(UIcallback){
			chapter_id = parseInt(chapter_id,10);
			if(chapter_id == chapter_id.length-1){
				return;
			}
			chapter_id+=1;
			getCurChapterContent(chapter_id,UIcallback);
			Util.StorageSetter("lastRead_chapter",chapter_id);
		}
		return{
			init:init,
			prevChapter:prevChapter,
			nextChapter:nextChapter
		}
	}
	function ReaderBaseFrame(container){
		//渲染基本的UI结构
			function parseChapterData(jsonData){
					// console.log(jsonData);
				var jsonObj=JSON.parse(jsonData);
				console.log(jsonObj);
				var html="<h4>"+jsonObj.t+"</h4>";
				for (var i=0;i<jsonObj.p.length;i++) {
					html+="<p>"+jsonObj.p[i]+"</p>";
				}
				return html;
			}		
			return function(data){
				container.html(parseChapterData(data));
			}	
		}
	function EventHandler(){
		$("#action-mid").click(function(){
			if (Dom.top_nav.css("display") == "none") {
				Dom.top_nav.show();
				Dom.footer_nav.show();
			}else{
				Dom.top_nav.hide();
				Dom.footer_nav.hide();
				Dom.font_bk_container.hide();
				Dom.fontsize_bk.removeClass("current");
			}
		});
		Win.scroll(function(){
			Dom.top_nav.hide();
			Dom.footer_nav.hide();
			Dom.font_bk_container.hide();
			Dom.fontsize_bk.removeClass("current");
		});
		//白天、夜间交互模式
		$(".day").click(function(){
			$(".day").hide();
		    $(".night").show();
			fictionContainer.css("background-color","#0f1410");
		});
		$(".night").click(function(){
			$(".day").show();
		    $(".night").hide();
			fictionContainer.css("background-color","#f7eee5");
		})
        Dom.fontsize_bk_switch.click(function(){
			//todo 触发字体大小切换事件
			if(Dom.font_bk_container.css("display")=="none"){
				Dom.font_bk_container.show();
				Dom.fontsize_bk.addClass("current");
			}else{
				Dom.font_bk_container.hide();
				Dom.fontsize_bk.removeClass("current");
			}
		});
		$("#large-font").click(function(){
			if(initialSize>20){
				return;
			}
			initialSize+=1;
			fictionContainer.css("font-size",initialSize);
			Util.StorageSetter("font-size",initialSize);
		});
		$("#small-font").click(
			function(){
				if(initialSize<12){
					return;
				}
				initialSize-=1;
				fictionContainer.css("font-size",initialSize);
				Util.StorageSetter("font-size",initialSize);
			}
		);
		//上一章，下一章翻页
		$("#prev_button").click(function(){
		//获得章节的翻页数据->把数据进行渲染
			readerModel.prevChapter(function(data){
				readerUI(data);
			});
		});
		$("#next_button").click(function(){
		//获得章节的翻页数据->
			readerModel.nextChapter(function(data){
				readerUI(data);
			});
		});
		//获得背景颜色
		$(".bj-color").click(function(){
			var bgColor=$(this).css("background-color");
			fictionContainer.css("background-color",bgColor);
			Util.StorageSetter("background-color",bgColor);
		});
	}
	main();
})();