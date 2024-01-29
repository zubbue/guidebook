// 声明 docsify 插件
var myDocsifyPlugin = function(hook, vm) {
	
	// 钩子函数：解析之前执行
	hook.beforeEach(function(content) {
		try{
			// 功能 1，替换全局变量 
			content = content.replace(/\$\{sa.top.version\}/g, window.saTokenTopVersion);
			
			// 添加 [toc] 标记
			content = content.replace(/\[\[toc\]\]/g, '<div class="toc-box"></div>');
			
		}catch(e){
			// 
		}
		return content;
	});
	
	// 钩子函数：每次路由切换时，解析内容之后执行 
	hook.afterEach(function(html) {
		
		// 功能 2，文章底部添加仓库地址  
		var url = 'https://gitee.com/dromara/sa-token/tree/dev/sa-token-doc/' + vm.route.file;
		var url2 = 'https://github.com/dromara/sa-token/tree/dev/sa-token-doc/' + vm.route.file;
		var footer = [
			'<br/><br/><br/><br/><br/><br/><br/><hr/>',
			'<footer>',
			'<span>发现错误？ 您可以在 <a href="' + url + '" target="_blank">Gitee</a> 或 <a href="' + url2 +
			'" target="_blank">GitHub</a> 帮助我们完善此页文档！</span>',
			'或 <a href="#/more/join-group">加入讨论群</a> 交流反馈',
			'</footer>'
		].join('');
		return html + footer;
	});
	
	// 钩子函数：每次路由切换时数据全部加载完成后调用，没有参数。
	hook.doneEach(function() {
		
		// 功能3，给代码盒子，添加行数样式 
		$('pre code').each(function(){
			var lines = $(this).text().split('\n').length;
			var $numbering = $('<ul/>').addClass('code-line-box');
			$(this)
				.addClass('has-numbering')
				.parent()
				.append($numbering);
			for(i=1;i<=lines;i++){
				$numbering.append($('<li/>').text(i));
			}
		});
		
		// 功能4，添加 toc 目录 
		var dStr = "";
		$('#main h2, #main h3, #main h4, #main h5, #main h6').each(function() {
			$('.toc-box').append('<li class="toc-' + this.localName + '">' + this.innerHTML + '</li>');
		});
		
		// 功能5，统计赞助人数
		if($('.zanzhu-count').length && $('.zanzhu-box table').length) {
			$('.zanzhu-count').html($('.zanzhu-box table tr').length);
		}
		
		// 功能6：标题下面的广告 
		if(vm.route.path !== '/' && $(window).width() >= 800) {
			var ad = `<p class="top-ad-box">
				<span class="ad-tips">推广信息：</span>
				<span class="ad-tips ad-close">关闭</span>
				<a href="http://sa-pro.dev33.cn?from=satop" target="_blank">
					<img src="https://oss.dev33.cn/sa-token/ad/sa-sso-pro-x.png" />
				</a>
			</p>`;
				
			// 没有下划线就先补个下划线
			// if($('#main h1').next().prop('tagName') !== 'HR') {
			// 	$('#main h1').after('<hr/>');
			// }
			
			// 如果一周内用户点击过关闭广告，则不再展现
			let allowJg = 1000 * 60 * 60 * 24 * 7;
			// allowJg = 1000 * 10;
			try{
				const closeAdTime = localStorage.closeAdTime;
				if(closeAdTime) {
					// 点击广告关闭的时间，和当前时间的差距
					const closeAdJg = new Date().getTime() - parseInt(closeAdTime);
					
					// 差距小于七天，不再展示 
					if(closeAdJg < allowJg) {
						console.log('not show ad ...');
						return;
					}
				}
			}catch(e){
				console.error(e);
			}
			
			
			// 添加广告
			$('#main h1').after(ad);
			// 添加关闭事件
			$('.top-ad-box .ad-close').click(function(){
				console.log('关闭广告');
				// $('.top-ad-box').slideUp(); // 折叠收起
				$(".top-ad-box").fadeOut(1000); // 淡出效果
				layer.msg('一周内不再展现此信息')
				localStorage.closeAdTime = new Date().getTime();
			})
		}
		
	});
	
	// 钩子函数：初始化并第一次加载完成数据后调用，没有参数。
	hook.ready(function() {
		// 将搜索框转移到右上角 
		document.querySelector(".sear-box").innerHTML = '';
		document.querySelector(".sear-box").append(document.querySelector(".search"));
		document.querySelector(".search input").placeholder = '搜索…';
		
		// 点击input时，展开 
		$('.sear-box input').click(function() {
			if($('.search input').val() != '') {
				$('.results-panel').addClass('show');
			}
		});
		// 失去焦点时，收缩 
		$('.sear-box input').blur(function() {
			setTimeout(function() {
				$('.results-panel').removeClass('show');
			}, 200);
		})
		// 选择一项时，收缩 
		$('.sear-box').on('click', '.matching-post', function() {
			console.log('click……');
			// $('.search input').val('');
			$('.results-panel').removeClass('show');
		});
		
		// 点击按钮，加载图片
		$(document).on('click', '.show-img', function(){
			var src = $(this).attr('img-src');
			var img = '<img class="show-to-img" src="' + src + '" />';
			$(this).after(img);
			$(this).remove();
		})
		
		// 点击按钮，加载图片
		$(document).on('click', '.show-to-img', function(){
			open(this.src);
		})
		
	});
	
}