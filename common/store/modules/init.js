// 初始化数据模块
import Vue from 'vue'
import api from '@/common/request/index'
import store from '@/common/store'
import Router from '@/common/router';
import {
	INIT_DATA,
	PAGE_ROUTES,
	CART_NUM,
	TEMPLATE_DATA,
	APPCFG
} from '../types.js'
const state = {
	initData: {},
	appcfgData: {},
	routes: [],
	addons: uni.getStorageSync('addons') ? uni.getStorageSync('addons') : [], //插件列表
	templateData: uni.getStorageSync('templateData') ? uni.getStorageSync('templateData') : {},
	hasTemplate: true, //是否有初始化数据
	noNetwork: false ,//是否有网络
}

const actions = { 
	getAppInit({
		commit
	}, options) {
		uni.setStorageSync('mode', 'product');
		return new Promise((resolve, reject) => {
			api('init').then(res => {
				commit('INIT_DATA', res.data);
				uni.setStorageSync('sysInfo', res.data.info);
				uni.setStorageSync('shareInfo', res.data.share);
				uni.setStorageSync('addons', res.data.addons);
				uni.setStorageSync('chat', res.data.chat);
				commit('noNetwork', false);
				resolve(res)
			}).catch(e => {
				commit('noNetwork', true);
				reject(e)
			})
		})
	},
	// 同步前端路由
	getRoutes({
		commit
	}) {
		return new Promise((resolve, reject) => {
			// api('dev.asyncLink', {
			// 	data: ROUTES
			// }).then(res => {
			// 	commit('PAGE_ROUTES', res.data);
			// 	resolve(res)
			// }).catch(e => {
			// 	reject(e)
			// })
		})
	},
	// 模板信息
	getTemplate({
		commit
	}, options = {}) {
		var params = {};
		return new Promise((resolve, reject) => {
			//请求预览商城模板
			if (options.query && options.query.shop_id) {
				params.shop_id = options.query.shop_id;
			}
			if (options.query && options.query.custom_id) {
				Router.replace({
					path: '/pages/index/view',
					query: {
						id: options.query.custom_id,
					}
				});
			}
			
			api('api.appCfg').then(res => {
				// console.log(JSON.stringify(res) + "cfg信息")
				
				if(res.code == 1){
					commit('APPCFG', res.data);
					uni.setStorageSync('loading_image', res.data.shopro.loading_image);
					let shopro = res.data.shopro
					// params.version = shopro.auditVersion
					// #ifdef H5
						params.version = 'release'
					// #endif
					// #ifdef MP-WEIXIN 
					  	params.version = __wxConfig.envVersion
					// #endif
					// #ifdef APP-PLUS
						params.version = plus.runtime.version
					// #endif
					Vue.prototype.$LOAD_IMG = res.data.shopro.lazyImgLoading;
					Vue.prototype.$ERROR_IMG = res.data.shopro.lazyImgAfter;
					api('template', params).then(res => {
						uni.setStorageSync('templateData', res.data);
						commit('TEMPLATE_DATA', res.data)
						if (res.code == 0) {
							commit('hasTemplate', false);
						}
						commit('noNetwork', false);
						resolve(res)
					}).catch(e => {
						commit('noNetwork', true);
						reject(e)
					
					})
				}
			})
			
			
		})
	},
}

const mutations = {
	[PAGE_ROUTES](state, data) {
		state.routes = data
	},
	[INIT_DATA](state, data) {
		state.initData = data
	},
	[APPCFG](state, data) {
		state.appcfgData = data
	},
	[TEMPLATE_DATA](state, data) {
		state.templateData = data
	},
	hasTemplate(state, data) {
		state.hasTemplate = data
	},
	noNetwork(state, data) {
		state.noNetwork = data
	},
	// 弹窗一次的话，关闭的时候删除数据。
	delPopup(state, path) {
		uni.removeStorageSync('templateData');
		let templateData = state.templateData
		templateData.popup[0].content.list.forEach(item => {
			if (item.page.includes(path)) {
				let index = item.page.indexOf(path);
				item.page.splice(index, 1)
			}
		})
		uni.setStorageSync('templateData', templateData);
		state.templateData = templateData;
	}
}

const getters = {

}

export default {
	state,
	mutations,
	actions,
	getters
}
