/**
 *  Shopro全局配置文件
 *  @version 1.2.0
 */


const ENV_BASE_URL = {
	development: 'https://saas.jushicc.com', //开发环境
	production: 'https://saas.jushicc.com', //生产环境   
}
const ENV_API_URL = {
	development: `${ENV_BASE_URL.development}/addons/shopro/`, //开发环境
	production: `${ENV_BASE_URL.production}/addons/shopro/`, //生产环境
}

export const BASE_URL = ENV_BASE_URL[process.env.NODE_ENV || 'development']; //后台根域名
export const API_URL = ENV_API_URL[process.env.NODE_ENV || 'development']; //后台接口域名
export const API_URL_NEW = 'https://saas.jushicc.com/'; //新加接口域名

export const HAS_LIVE = true; //后台是否开通直播权限,根据情况在manifest.json中，开启注释相应组件的引入。
// export const IMG_URL = 'https://jushicc.oss-cn-beijing.aliyuncs.com/miniapp'; //全局网络图片地址变量，css背景图片地址变量在uni.scss  new
export const IMG_URL = 'https://img.jushicc.com/miniapp'; //全局网络图片地址变量，css背景图片地址变量在uni.scss  new

export let  APPID ='1001';    
export const  VERSION ='1.0.7';

// #ifdef H5   
	function GetRequest() {
		var url = window.location.href;
		// var url = 'https://saash5.jushicc.com?shop_id=55&appid=1002';
		var theRequest = new Object();
		if (url.indexOf("?") != -1) {
	        var str = url.substr(1);
	        var strs = str.split("&");
	        for (var i = 0; i < strs.length; i++) {
	            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
	        }
	     }
	     return theRequest;
	}
	var parms_1 = GetRequest();
	if(parms_1['appid']) {
		APPID = parms_1['appid']
	} else {
		APPID = '1001'
	}
	
	console.log('APPID',APPID)
//  #endif

// #ifdef MP-WEIXIN   
// export const  MINISHOPPLUGIN  = requirePlugin('mini-shop-plugin')
//  #endif
// wx8fe800f84dd7d2e4 小店  1001
// wxca4b29b073dab8c5 e客   1002

