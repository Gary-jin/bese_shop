import Request from './request'
import apiList from './shopro'
import store from '@/common/store/index.js'
import hex_md5 from "../md5.js" //加密
import {APPID,VERSION,API_URL_NEW} from '@/env' 
import {
	encrypt,
	decrypt,
} from '../encrypt/pkc.js'

let version = VERSION //版本号
let device = ''
let appid = APPID

// #ifdef MP-WEIXIN
device = 'mp'
// #endif
// #ifdef H5
device = 'api'
// #endif
// #ifdef APP-PLUS
device = 'app'
// #endif
export default function api(url, data = {}, showToast = true) {
	const request = new Request();
	let api = getApiObj(url);
	if(api.isnew){
		request.config.baseUrl = API_URL_NEW
	}
	request.interceptor.request((config, cancel) => {
		// 加密 
		let path = ''
		if(api.isnew){
			path = '/'+ api.url
		} else {
			path = "/addons/shopro/" + api.url
		}
		let time = Date.parse(new Date()) / 1000
		let token = uni.getStorageSync('token');
		let randomNum = Math.random().toString(36).substr(2).toUpperCase();;
		let strone = `${appid}${path}${time}${token}${randomNum}${device}${version}`
		let str = strone.toUpperCase()
		config.header.sign = hex_md5(hex_md5(str.toUpperCase()))
		config.header.appid = appid
		config.header.encrypt = '1'
		config.header.time = time
		config.header.random = randomNum
		config.header.device = device
		config.header.version = version
		config.header.token = token

		/* 请求之前拦截器 */
		// if (api.auth) {

		// 	if (!token) {
		// 		store.commit('LOGIN_TIP', true)
		// 		store.commit('OUT_LOGIN');
		// 		// throw ('暂未登录,已阻止此次API请求~');
		// 	}
		// }
		return config
	});

	request.interceptor.response((response) => {
		/* 请求之后拦截器 */
		if (response.data.code === 0) { // 服务端返回的状态码不等于200，则reject()
			if (showToast) {
				uni.showToast({
					title: response.data.msg || '请求出错,稍后重试',
					icon: 'none',
					duration: 1000,
					mask: true
				});
			}

		}

		if (response.data.code === 401) { // 服务端返回的状态码不等于200，则reject()
			uni.removeStorageSync('token');
			store.commit('LOGIN_TIP', true)
		}
		// if (response.config.custom.verification) { // 演示自定义参数的作用
		//   return response.data
		// }


		// 解密
		if (response.data.encrypt == 1 && response.data.data && response.data !== "") {
			let sign_key = response.data.sign.slice(0, 16)
			let iv = "jskey_" + response.data.time
			let decryp = decrypt(sign_key, iv, response.data.data)
			try {
				response.data.data = JSON.parse(decryp);
			} catch (e) {
				response.data.data = decryp;
			}
		}
		return response

	}, (response) => { // 预留可以日志上报
		return response
	})
	return request.request({
		url: api.url,
		data,
		method: api.method
	})

}

function getApiObj(url) {
	let apiArray = url.split(".");
	let api = apiList;
	apiArray.forEach(v => {
		api = api[v];
	});
	return api;
}
