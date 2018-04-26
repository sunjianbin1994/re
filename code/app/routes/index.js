var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');

//连接数据库
mongoose.connect('mongodb://127.0.0.1/school',function(err){
	if(err){
		throw err;
	}else{
		console.log('数据库连接成功...');
	}
});

//定义骨架
var userSchema=new mongoose.Schema({
	username: String,
	password: String,
	name: String,
	role: String,
	department: String,
	flag: Number,
	sortnum: Number
});
//定义日志骨架
var logSchema=new mongoose.Schema({
	username: String,
	optime: Date,
	content: String,
	result: String,
	ip: String
});

//创建模型
var userModel=mongoose.model('user',userSchema,'user');
var logModel=mongoose.model('log',logSchema,'log');

//保存新增用户数据的路由
router.post('/save_add.html',function(req,res){
	//接收数据
	var username=req.body.username;
	var password=req.body.password;
	var name=req.body.name;
	var role=req.body.role;
	var department=req.body.department;
	var sortnum=parseInt(req.body.sortnum); //接收的为字符串需转换为number格式
	var flag=parseInt(req.body.flag); //同上
	
	//向数据库写入数据
	var user=new userModel();
	user.username=username;
	user.password=password;
	user.name=name;
	user.role=role;
	user.department=department;
	user.sortnum=sortnum;
	user.flag=flag;
	user.save(function(err){
		if(err){
			res.send({"errcode":1014,"msg":"数据添加失败"});
		}else{
			addLog(req.cookies.loginuser,'添加了一个用户： '+username,'成功',req.ip);
			res.send({"errcode":0,"msg":"数据添加成功"});
		}
	});
});

//显示所有用户数据的路由
router.get('/showAll.html',function(req,res){
	userModel.find().exec(function(err,data){
		res.send(data);
	});
});

//ID查询某一条数据
router.get('/showOne.html',function(req,res){
	//接收客户端传的ID
	var id=req.query.id;
	
	//根据ID查询数据
	userModel.findById(id).exec(function(err,data){
		res.send(data);
	});
});

//显示数据分页的路由
router.get('/showPage.html',function(req,res){
	//步骤准备好三大条件
	var pagesize=3; // 设置每页显示多少条数据
	var page=req.query.page || 1; // 如果没有传参数则设置默认值，默认当前在第1页
	
	userModel.find().exec(function(err,data){
		var pagecount= Math.ceil(data.length / pagesize); //计算得出一共分多少页
		var start=(page-1)*pagesize; //利用条件1和条件2计算得到当前页应当从哪里开始提取哪些数据
		userModel.find().skip(start).limit(pagesize).exec(function(err,data){
			data.push(pagecount); //走私,携带总页数与数据一起发送
			res.send(data);
		});
	});
});


//按条件查询数据的路由
router.post('/search.html',function(req,res){
	//获取查询条件
	var department=req.body.department;
	var role=req.body.role;
	var username=req.body.username;
	
	//构造查询条件
	var obj={};
	if(department !== '全部'){
		obj.department=department; 
	}
	if(role !=='全部'){
		obj.role=role; 
	}
	if(username.length > 0){
		obj.username=new RegExp(username);  //如果设置了用户名，就要进行模糊查询 ,正则表达式的另一种写法
	}
	
	//去数据库获取数据
	userModel.find(obj).exec(function(err,data){
		res.send(data);
	});
});


//删除用户数据的路由
router.post('/user_del.html',function(req,res){
	//接收数据
	var ids=req.body.ids;
	ids=ids.split(','); //将接收到的多个ID字符串转换成为数组

	//查找数据
	userModel.find({"_id":{$in:ids} }).exec(function(err,data){
		var arr=[]; //定义一个数组用于保存Promise实例
		
		for(var i in data){
			arr.push(new Promise(function(resolve,reject){
				var username=data[i].username;
				data[i].remove(function(err){
					if(err){
						reject(username+'删除失败!');
					}else{
						resolve(username+'删除成功!');
					}
				});
			}));
		}
		
		//统一写删除日志
		Promise.all(arr).then(function(datas){
			var str=datas.join('***');
			addLog(req.cookies.loginuser,'删除操作：'+str,'成功',req.ip);
			res.send('1');
		});
	});
});


//修改用户数据的路由
router.post('/save_edit.html',function(req,res){
	//接收客户端传的数据
	var id=req.body.id;
	var username=req.body.username;
	var password=req.body.password;
	var name=req.body.name;
	var role=req.body.role;
	var department=req.body.department;
	var sortnum=parseInt(req.body.sortnum); //接收的为字符串需转换为number格式
	var flag=parseInt(req.body.flag); //同上
	
	//将修改的后的数据保存到数据库中：1.找到要被修改的数据，2.覆盖原有数据
	userModel.findById(id).exec(function(err,data){
		data.username=username;
		data.password=password;
		data.name=name;
		data.role=role;
		data.department=department;
		data.sortnum=sortnum;
		data.flag=flag;
		data.save(function(err){
			if(err){
				res.send({"errcode":1015,"msg":"修改失败"});
			}else{
				addLog(req.cookies.loginuser,'修改了 '+username+'用户信息','成功',req.ip);
				res.send({"errcode":0,"msg":"修改成功"});
			}
		});
		
	});
	
});


//验证用户登陆是否正确的路由
router.post('/checkuser.html',function(req,res){
	//接收用户名和密码数据
	var username=req.body.username;
	var password=req.body.password;
	//构造数据库读取条件
	userModel.find({"username":username,"password":password}).exec(function(err,data){
		if(data.length){
			res.cookie('loginuser',username); //设置cookie用于标识用户身份
			res.send('1'); //如果能找到数据说明用户名和密码是正确的，代表登陆成功
		}else{
			res.send('0'); //如果没找到数据说明用户名和密码是错误的，代表登陆失败
		}
	});
});

//检查用户是否已经登陆的路由
router.get('/checklogin.html',function(req,res){
	//通过cookie来验证用户是否已经登陆
	if(req.cookies.loginuser){
		res.send('1');
	}else{
		res.send('alert("请登陆以后再操作");location.href="login.html";');
	}
});

//注销系统的路由
router.get('/logout.html',function(req,res){
	//清除用户身份标识 cookie
	res.clearCookie('loginuser');
	res.send('<script>alert("退出成功，欢迎下次再来");location.href="/admin/pages/login.html";</script>');
});

//修改密码的路由
router.post('/save_password.html',function(req,res){
	//接收密码数据
	var oldpassword=req.body.oldpassword;
	var newpassword=req.body.newpassword;
	var username=req.cookies.loginuser; //必须要获取到当前登陆的用户名，和密码一起作为查询数据的条件
	
	//修改密码：1.查找数据 2.修改数据
	userModel.find({"username":username,"password":oldpassword}).exec(function(err,data){
		if(err){
			res.send({"errcode":1016,"msg":"数据查询失败"});
		}else{
			if(data.length){
				//修改密码
				data[0].password=newpassword;
				data[0].save(function(err){
					if(err){
						res.send({"errcode":1018,"msg":"密码修改失败"});
					}else{
						addLog(req.cookies.loginuser,'修改了密码','成功',req.ip);
						res.send({"errcode":0,"msg":"密码修改成功"});
					}
				});
			}else{
				addLog(req.cookies.loginuser,'尝试修改密码','失败',req.ip);
				res.send({"errcode":1017,"msg":"旧密码验证不成功"});
			}
		}
	});
});

//显示所有日志数据
router.get('/showLog.html',function(req,res){
	logModel.find().exec(function(err,data){
		res.send(data);
	});
});

//定义一个函数写日志
function addLog(username,content,result,ip){
	var log=new logModel();
	log.username=username;
	log.optime=new Date();
	log.content=content;
	log.result=result;
	log.ip=ip;
	log.save();
}


module.exports = router;
