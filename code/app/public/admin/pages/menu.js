var str='<nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">\
 <div class="navbar-default sidebar" role="navigation">\
    <div class="sidebar-nav navbar-collapse">\
        <ul class="nav" id="side-menu">\
            <li>\
                <a href="#"><i class="fa fa-bar-chart-o fa-fw"></i> 库存管理<span class="fa arrow"></span></a>\
                <ul class="nav nav-second-level">\
                    <li>\
                        <a href="receiptplanlist.html">进货计划</a>\
                    </li>\
                    <li>\
                        <a href="signlist.html">进货签收</a>\
                    </li>\
                    <li>\
                        <a href="boundin.html">入库管理</a>\
                    </li>\
                    <li>\
                        <a href="boundout.html">出库管理</a>\
                    </li>\
                    <li>\
                        <a href="inventory.html">盘点管理</a>\
                    </li>                               \
                </ul>\
            </li>\
            <li>\
                <a href="#"><i class="fa fa-bar-chart-o fa-fw"></i> 供货管理<span class="fa arrow"></span></a>\
                <ul class="nav nav-second-level">\
                    <li>\
                        <a href="ghsend.html">送货单管理</a>\
                    </li>\
                    <li>\
                        <a href="ghreceive.html">收款单管理</a>\
                    </li>\
                </ul>\
            </li>\
            <li>\
            	<a href="#"><i class="fa fa-wrench fa-fw"></i> 财务管理<span class="fa arrow"></span></a>\
            	<ul class="nav nav-second-level">\
                    <li>\
                        <a href="cwreceive.html">收款管理</a>\
                    </li>\
                    <li>\
                        <a href="cwpay.html">付款管理</a>\
                    </li>\
                </ul>\
            </li>\
            <li>\
                <a href="#"><i class="fa fa-wrench fa-fw"></i> 统计分析<span class="fa arrow"></span></a>\
                <ul class="nav nav-second-level">\
                    <li>\
                        <a href="tjin.html">进货单查询</a>\
                    </li>\
                    <li>\
                        <a href="tjout.html">出库汇总表</a>\
                    </li>\
                    <li>\
                        <a href="tjinsum.html">入库汇总表</a>\
                    </li>\
                    <li>\
                        <a href="tjhasdetail.html">存货明细账</a>\
                    </li>\
                    <li>\
                        <a href="tjshouldpay.html"> 应付货款报告</a>\
                    </li>\
                    <li>\
                        <a href="tjsource.html">食材来源统计</a>\
                    </li>\
                </ul>\
            </li>\
            <li>\
                <a href="#"><i class="fa fa-sitemap fa-fw"></i>基础数据<span class="fa arrow"></span></a>\
                <ul class="nav nav-second-level">\
                    <li>\
                        <a href="unitlist.html">单位管理</a>\
                    </li>\
                    <li>\
                        <a href="supplierlist.html">供应商管理</a>\
                    </li>\
                     <li>\
                        <a href="foodclasslist.html">菜品类别</a>\
                    </li>\
                    <li>\
                        <a href="foodlist.html">菜品管理</a>\
                    </li>\
                </ul>\
            </li>\
            <li>\
                <a href="#"><i class="fa fa-files-o fa-fw"></i> 系统管理<span class="fa arrow"></span></a>\
                <ul class="nav nav-second-level">\
                    <li>\
                        <a href="userlist.html">用户管理</a>\
                    </li>\
                    <li>\
                        <a href="editpassword.html">修改密码</a>\
                    </li>\
                     <li>\
                        <a href="log.html">日志管理</a>\
                    </li>\
                    <li>\
                        <a href="/logout.html">退出系统</a>\
                        </li>\
                    </ul>\
                </li>\
            </ul>\
        </div>\
    </div>\
</nav>';
document.write(str);


/*
 * 封闭一个全局的AJAX方法
 		使用方法:
 			ajax({
 				"url":请求的网址,
 				"type":'get|post',
 				"data":'参数名1=参数值1&参数名2=参数值2',
 				"dataType":'json',
 				"ok":function(data){}
 			});
 		
 		用法:
 			ajax({
 				url: '/showAll.html',
 				type: 'get',
 				dataType:'json',
 				ok:function(data){}
 			});
 */

;(function(){
	window.ajax=function(options){
		options.type=options.type||'get'; //设置默认请求方式为get
		if(options.type=='get' && options.data){ //如果提交方式是get并且有传参数,就需要将参数字符串拼接进url中
			options.url+='?'+options.data;
		}
		
		var ajax=new XMLHttpRequest();
		ajax.open(options.type,options.url);
		if(options.type=='post'){ //如果请求方式为post必须设置请求头
			ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		}
		ajax.onreadystatechange=function(){
			if(ajax.readyState==4 && ajax.status==200){
				var data=ajax.responseText;
				if(options.dataType=='json'){ //如果设置了返回的数据是JSON格式,可以进行自动转换
					data=JSON.parse(data);
				}
				options.ok(data); //回调函数,当有数据时才调起用户设置的函数
			}
		}
		
		if(options.type=='post' && options.data){ //如果是POST方式请求,并且有传参数,必须在.send() 方法中写参数字符串
			ajax.send(options.data);
		}else{
			ajax.send();
		}
		
	}
})();
