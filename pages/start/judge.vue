<template>
	<view class="content">
		<view class="" v-if="templa.image">
			<image class="judeImg" @click="goPath(templa.path)" :src="templa.image" mode="scaleToFill"></image>
		</view>                                                                                  
		<button class="cu-btn round time" @click="checkGuide">跳过&nbsp;{{countTime}}</button>
		<!-- #ifdef MP-WEIXIN -->
		<shopro-skip v-show="appcfgdata.is_jump == 1" :site="0"></shopro-skip>
		<!-- #endif -->
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	export default {
		data(){
			return{
				countTime: 5,
				wdclockTime: null,
				tabPathList:['/pages/index/index','/pages/index/category','/pages/index/cart','/pages/index/user']
			}
		},
		computed:{
			...mapState({
				templa: state => state.init.templateData['start-image']?.[0].content.list[0] ,
				appcfgdata: state => state.init.appcfgData
			}),
		},
		mounted(){
			
			this.wdclockTime =  setInterval(()=>{
				this.countTime -= 1  ;
				if (this.countTime<=0) {
					this.checkGuide();
				}
			},1000);
			let that = this;
			uni.$on('backStart',function(data){
				that.countTime = 5;
				that.wdclockTime =  setInterval(()=>{
					that.countTime -= 1  ;
					if (that.countTime<=0) {
						that.checkGuide();
					}
				},1000);
			})
			
		},
		methods: {
			checkGuide() {
				clearInterval(this.wdclockTime)
				try {
					var launchFlag = uni.getStorageSync('launchFlag');
					if (launchFlag) { //判断本地缓存跳转首页
						uni.redirectTo({
							url: '/pages/index/index'
						});
					} else { //没有缓存进入启动页引导页
						uni.redirectTo({
							url: '/pages/start/start'
						});
					}
				} catch (e) {
					console.log(e.message);
				}
			},
			goPath(path){
				if(!path){return;}
				clearInterval(this.wdclockTime)
				if(path.indexOf('http') == 0){
					//startOpportunity 为了标记返回   是否是启动页跳转
					this.jump(encodeURI(path+'?startOpportunity=true'))
				} else {
					if(path.indexOf("?") != -1){
						let str = path.split('?')
						let xx = str[0]

						let isno =  this.tabPathList.includes(xx)
						if(isno){ //主页面
							uni.redirectTo({
								url: path
							});
						} else {
							uni.redirectTo({
								url: '/pages/index/index'
							});
							setTimeout(()=>{
								this.$tools.routerTo(path);
							},200)
						}
					} else {
						let isno =  this.tabPathList.includes(path)
						if(isno){ //主页面
							uni.redirectTo({
								url: path
							});
						} else {
							uni.redirectTo({
								url: '/pages/index/index'
							});
							setTimeout(()=>{
								this.$tools.routerTo(path);
							},200)
						}
					}
					
				}
			},
			jump(path) {
				if(path){
					this.$tools.routerTo(path);
				} 
			}
		}
	};
</script>
<style scoped lang="scss">
	page {
		min-height: 100%;
		height: 100vh;
	}
	.content{
		width: 100%;
		height: 100vh;
		overflow: hidden;
		.judeImg{
			width: 100%;
			height: 100vh;
		}
		.time{
			position: fixed;
			bottom: 60rpx;
			right: 60rpx;
			color: #999;
			border: 1px #999 solid;
			background: none;
			font-size: 28rpx;
			font-weight: bold;
		}
	}
	
</style>

