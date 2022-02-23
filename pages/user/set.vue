<!-- 设置 -->
<template>
	<view class="set-box">
		<view class="BoxBor">
			<view class="list x-bc" @tap="jump('/pages/public/feedback')">
				<view class="title">意见反馈</view>
				<text class="cuIcon-right"></text>
			</view>
			<view class="xian"></view>
			<view class="list x-bc" @tap="jump('/pages/user/address/list')">
				<view class="title">地址管理</view>
				<text class="cuIcon-right"></text>
			</view>
		</view>
		
		<view class="BoxBor">
			<!-- #ifdef MP-WEIXIN -->
				 <view class="list x-bc" @tap="jump('/pages/user/edit-password')">
					<view class="title">修改登录密码</view>
					<text class="cuIcon-right"></text>
				 </view>
				 <view class="xian"></view>
			<!-- #endif -->
			<view class="list x-bc" @tap="jump('/pages/user/paypassword')">
				<view class="title">设置支付密码</view>
				<text class="cuIcon-right"></text>
			</view>
			<view class="xian" v-if="appcfgdata.store.about_us"></view>
			<view class="list x-bc" v-if="appcfgdata.store.about_us" @tap="jump('/pages/public/richtext', { id: appcfgdata.store.about_us })">
				<view class="title">关于我们</view>
				<text class="cuIcon-right"></text>
			</view>
		</view>
		
		<view class="BoxBor">
			<view class="list x-bc" @tap="onVersion">
				<view class="title">当前版本</view>
				<text class="cuIcon-right"></text>
			</view>
			<view class="xian"></view>
			<view class="list x-bc" @tap="outLogin">
				<view class="title">退出登录</view>
				<text class="cuIcon-right"></text>
			</view>			
		</view>
		
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 连续弹窗提醒 -->
		<shopro-notice-modal></shopro-notice-modal>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
	components: {},
	data() {
		return {};
	},
	computed: {
		...mapState({
			initData: state => state.init.initData, //初始化数据
			appcfgdata: state => state.init.appcfgData,
			userInfo: state => state.user.userInfo
		})
	},
	methods: {
		// 路由跳转
		jump(path, parmas) {
			if(path == '/pages/user/paypassword'){
				if(!this.userInfo.mobile && this.userInfo.nickname){
					uni.showToast({
					    title: '请先绑定手机号码',
					    duration: 1500,
						icon:"none"
					});
					setTimeout(()=>{
						this.jump('/pages/user/edit-phone', { fromType: 'bind' })
					},1500)
					return
				}else{
					parmas = {'phone':this.userInfo.mobile}
				}
			}
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 退出登录
		outLogin() {
			this.$store.commit('OUT_LOGIN');
			// #ifdef MP-WEIXIN
			  this.$Router.back()
			// #endif
			// #ifndef MP-WEIXIN
			this.$Router.replace('/pages/public/login');
			// #endif
		},
		// 当前版本
		onVersion() {
			let version = this.initData.info.version;
			this.$tools.toast('当前版本:' + version);
		}
	}
};
</script>

<style lang="scss">
page {
	background: #F5F6F7;
}
.set-box{
	padding: 30rpx;
	.BoxBor{
		box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(231, 231, 231, 0.5);
		margin-bottom: 20rpx;
		border-radius: 20rpx;
		background: #FFFFFF;
		padding: 0 38rpx;
	}
}
.xian{
	height: 1rpx;
	background: #EEEEEE;
}
.list {
	height: 110rpx;
	padding-left: 13rpx;
	// border-bottom: 1rpx solid rgba(#dfdfdf, 0.6);

	.title {
		font-size: 32rpx;
		color: #333333;
	}

	.cuIcon-right {
		font-size: 34rpx;
		color: #333333;
	}
}
</style>
