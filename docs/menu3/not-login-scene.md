# NotLoginException 场景值

本篇介绍如何根据`NotLoginException`异常的场景值，来定制化处理未登录的逻辑 <br/>
应用场景举例：未登录、被顶下线、被踢下线等场景需要不同方式来处理 


## 何为场景值
在前面的章节中，我们了解到，在会话未登录的情况下尝试获取`loginId`会使框架抛出`NotLoginException`异常，而同为未登录异常却有五种抛出场景的区分 

| 场景值   | 对应常量  |  含义说明                         |
|---   	  |---        |---                            |
| -1      | NotLoginException.NOT_TOKEN  	| 未能从请求中读取到有效 token         |
| -2      | NotLoginException.INVALID_TOKEN	| 已读取到 token，但是 token 无效  |
| -3      | NotLoginException.TOKEN_TIMEOUT	| 已读取到 token，但是 token 已经过期  |
| -4      | NotLoginException.BE_REPLACED	| 已读取到 token，但是 token 已被顶下线  |
| -5      | NotLoginException.KICK_OUT		| 已读取到 token，但是 token 已被踢下线  |
| -6      | NotLoginException.TOKEN_FREEZE	| 已读取到 token，但是 token 已被冻结  |
| -7      | NotLoginException.NO_PREFIX		| 未按照指定前缀提交 token		  |



那么，如何获取场景值呢？废话少说直接上代码：


``` java
// 全局异常拦截（拦截项目中的NotLoginException异常）
@ExceptionHandler(NotLoginException.class)
public SaResult handlerNotLoginException(NotLoginException nle)
		throws Exception {

	// 打印堆栈，以供调试
	nle.printStackTrace(); 
	
	// 判断场景值，定制化异常信息 
	String message = "";
	if(nle.getType().equals(NotLoginException.NOT_TOKEN)) {
		message = "未能读取到有效 token";
	}
	else if(nle.getType().equals(NotLoginException.INVALID_TOKEN)) {
		message = "token 无效";
	}
	else if(nle.getType().equals(NotLoginException.TOKEN_TIMEOUT)) {
		message = "token 已过期";
	}
	else if(nle.getType().equals(NotLoginException.BE_REPLACED)) {
		message = "token 已被顶下线";
	}
	else if(nle.getType().equals(NotLoginException.KICK_OUT)) {
		message = "token 已被踢下线";
	}
	else if(nle.getType().equals(NotLoginException.TOKEN_FREEZE)) {
		message = "token 已被冻结";
	}
	else if(nle.getType().equals(NotLoginException.NO_PREFIX)) {
		message = "未按照指定前缀提交 token";
	}
	else {
		message = "当前会话未登录";
	}
	
	// 返回给前端
	return SaResult.error(message);
}
```

<br/>
注意：以上代码并非处理逻辑的最佳方式，只为以最简单的代码演示出场景值的获取与应用，大家可以根据自己的项目需求来定制化处理

