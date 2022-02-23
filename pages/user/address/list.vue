<!-- 地址列表 -->
<template>
	<view class="page_box">
		<view class="head_box"></view>
		<view class="activeBox" v-if="from == 'marketingActivity'">*请{{addressList.length!=0?'选择':'添加'}}地址领取奖品*</view>
		<view class="content_box content_box1"  v-if="from == 'marketingActivity'">
			<view class="address-list" v-for="address in addressList" :key="address.id" >
				<view class="top x-f">
					<text class="name">{{ address.consignee }}</text>
					<text class="phone">{{ address.phone }}</text>
					<text class="tag" v-if="address.is_default === '1'">默认</text>
				</view>
				<view class="fenBox">
					<view class="detail">{{ address.province_name }}{{ address.city_name }}{{ address.area_name }}{{ address.address }}</view>
					<image class="fenXian" :src="$IMG_URL+ '/imgs/fenXian.png'" mode="widthFix"></image>
					<image class="fenImg" :src="$IMG_URL+ '/imgs/bianji.png' " mode="widthFix" @tap.stop="jump('/pages/user/address/edit', { id: address.id })"></image>
				</view>
				<button class="cu-btn round sm set-btn2" @tap="useAddress(address)">选择</button>
			</view>
		</view>
		<view class="content_box" v-else>
			<view class="address-list" v-for="address in addressList" :key="address.id" @tap="useAddress(address)">
				<view class="top x-f">
					<text class="name">{{ address.consignee }}</text>
					<text class="phone">{{ address.phone }}</text>
					<text class="tag" v-if="address.is_default === '1'">默认</text>
				</view>
				<view class="fenBox">
					<view class="detail">{{ address.province_name }}{{ address.city_name }}{{ address.area_name }}{{ address.address }}</view>
					<image class="fenXian" :src="$IMG_URL+ '/imgs/fenXian.png'" mode="widthFix"></image>
					<image class="fenImg" :src="$IMG_URL+ '/imgs/bianji.png' " mode="widthFix" @tap.stop="jump('/pages/user/address/edit', { id: address.id })"></image>
				</view>
			</view>
		</view>
		<view class="foot_box x-ac">
			<button class="cu-btn sync-wxaddress" @tap="getWXaddress" v-if="platform == 'wxMiniProgram' || platform == 'wxOfficialAccount'">
				<!-- <text class="cuIcon-weixin"></text> -->
				获取微信地址
			</button>
			<button class="cu-btn add-btn" @tap="jump('/pages/user/address/edit', { id: 0, from: from })">添加新地址</button>
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
export default {
	components: {},
	data() {
		return {
			addressList: [],
			from: '',
			platform: uni.getStorageSync('platform'),
			activePath :''
		};
	},
	computed: {},
	onLoad() {
		console.log('address',this.$Route)
		if (this.$Route.query.from) {
			this.from = this.$Route.query.from;
		}
	},
	onShow() {
		this.init();
	},
	methods: {
		init() {
			return Promise.all([this.getAddressList()]);
		},
		useAddress(address) {
			if(this.$Route.query.from == 'marketingActivity'){
				this.marketingActivity(address.id)
			} else {
				let pages = getCurrentPages();

				// #ifdef MP-WEIXIN || APP-PLUS
				let currPage = pages[pages.length - 1].$vm;
				let prevPage = pages[pages.length - 2].$vm; //上一个页面
				// #endif

				// #ifdef H5
				let currPage = pages[pages.length - 1];
				let prevPage = pages[pages.length - 2]; //上一个页面
				// #endif
				prevPage.address = address;

				uni.navigateBack({
					delta: 1
				});
			}
			
		},
		marketingActivity(address_id){
			let that = this
			that.$api('api.userAddrInfoSubmit', {
				address_id: address_id,
				id: that.$Route.query.prizeId
			}).then(res => {
				if(res.code == 1){
					that.$Router.push({  
						path:'/pages/activity/marketing/succeed'
					});
				}
			})
		},
		// 获取微信收货地址
		async getWXaddress() {
			// #ifdef MP-WEIXIN || MP-TOUTIAO || MP-QQ
			let status = await this.getSetting();
			if (status === 2) {
				this.openSetting();
				return;
			}
			// #endif

			this.openWXaddress();
		},
		openWXaddress() {
			// #ifdef MP-WEIXIN
			uni.chooseAddress({
				success: res => {
					let data = JSON.stringify(res);
					this.jump('/pages/user/address/edit', { addressData: data });
				},
				fail: err => {}
			});
			// #endif
			// #ifdef H5
			this.$wxsdk.openAddress(res => {
				let data = JSON.stringify(res);
				this.jump('/pages/user/address/edit', { addressData: data });
			});
			// #endif
		},
		getSetting: function() {
			return new Promise((resolve, reject) => {
				uni.getSetting({
					success: res => {
						if (res.authSetting['scope.address'] === undefined) {
							resolve(0);
							return;
						}
						if (res.authSetting['scope.address']) {
							resolve(1);
						} else {
							resolve(2);
						}
					}
				});
			});
		},
		openSetting: function() {
			uni.openSetting({
				success: res => {
					if (res.authSetting && res.authSetting['scope.address']) {
						this.openWXaddress();
					}
				},
				fail: err => {}
			});
		},
		// 路由跳转
		jump(path, parmas) {
			console.log(path);
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		getAddressList() {
			this.$api('address.list').then(res => {
				if (res.code === 1) {
					this.addressList = res.data;
				}
			});
		}
	}
};
</script>

<style lang="scss">
	.content_box{
		padding: 30rpx 30rpx 0 30rpx;
	}
	.content_box1{
		padding: 0 30rpx !important;
	}
.address-list {
	padding: 30rpx;
	position: relative;
	background: #fff;
	margin-bottom: 20rpx;
	border-radius: 20rpx;
	.name {
		font-size: 34rpx;
		font-weight: bold;
		color: #333333;
	}
	.phone {
		margin-left: 20rpx;
		font-size: 30rpx;
		font-weight: 400;
		color: #909399;
	}

	.tag {
		background: rgba(233, 191, 113, 0.2);
		border-radius: 6rpx;
		padding: 0 16rpx;
		line-height: 38rpx;
		color: #a8700d;
		font-size: 22rpx;
	}

	.detail {
		width: 543rpx;
		font-size: 32rpx;
		font-weight: 400;
		color: #656667;
		line-height: 40rpx;
	}

	.set-btn {
		background: none;
		position: absolute;
		font-size: 26rpx;
		color: #a8700d;
		top: 40rpx;
		right: 20rpx;
	}
	.set-btn1 {
		background: none;
		position: absolute;
		font-size: 26rpx;
		color: #a8700d;
		top: 30rpx;
		right: 20rpx;
	}
	.set-btn2 {
		background: none;
		position: absolute;
		font-size: 26rpx;
		color: red;
		border: 2rpx red solid;
		top: 20rpx;
		right: 20rpx;
	}
	.fenBox{
		display: flex;
		align-items: flex-start;
		margin-top: 20rpx;
		.fenXian{
			width: 6rpx;
			height: 46rpx;
		}
		.fenImg{
			width: 34rpx;
			height: 35rpx;
			margin-left: 30rpx;
		}
	}
}

.foot_box {
	padding: 20rpx;
	background: #FFFFFF;
	.sync-wxaddress {
		width: 328rpx;
		height: 90rpx;
		color: #07B906;
		border: 1px #07B906 solid;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 0.07);
		border-radius: 45rpx;
		font-weight: bold;
		.cuIcon-weixin {
			color: #1ea907;
			margin-right: 10rpx;
			font-size: 40rpx;
		}
	}
	.add-btn {
		height: 90rpx;
		width: 331rpx;
		color: #FFFFFF;
		background: linear-gradient(180deg, #FF4800 0%, #FF2400 100%);
		// border: 1rpx solid rgba(238, 238, 238, 1);
		border-radius: 45rpx;
		font-weight: bold;
	}
}

.activeBox{
	padding: 20rpx 40rpx;
    color: red;
}
</style>
