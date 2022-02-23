<!-- 优惠劵详情 -->
<template>
	<view class="pageBox">
		<view class="head_box">
			<cu-custom-new :isBack="true" :fixed="'false'" style="color: #FFFFFF;">
				<block slot="backText" >优惠券详情</block>
				<block slot="content"></block>
			</cu-custom-new>
		</view>
		

		<scroll-view class="scroll-box scrollBox" scroll-y="true"  @scrolltolower="loadMore" @scroll="onScroll" >
			<view class="couponCore">
				<view class="TopBox">
					<view class="title">{{couponDetail.name}}</view>
					<view class="time">有效期：{{ tools.timestamp(startTime) }} - {{ tools.timestamp(endTime) }}</view>
				</view>
				<view class="centerBox">
					<view class="title">{{ couponDetail.amount }}</view>
					<view class="manjain">满{{ couponDetail.enough }}元可用</view>
					<button class="cu-btn cBtn" :class="btnStataus == 'no_use' || !btnStataus ? 'use-btn' : 'fail-btn'" @tap="goScroll">
						{{ btnStatusText[btnStataus] || '立即领取' }}
					</button>
				</view>
				<view class="botBox">
					<scroll-view scroll-top="0" scroll-y="true" class="ruleCore scroll-Y" >
						<view class="title">使用规则</view>
						<view class="rule">{{ couponDetail.description }}</view>
					</scroll-view>
				</view>
			</view>
			<view class="coupon-goods" v-if="couponGoods.length">
				<view class="coupon-goods-title x-f" id="couponGoods">适用商品</view>
				<view class="goods-list" v-for="goods in couponGoods" :key="goods.id"><shopro-mini-card :detail="goods"></shopro-mini-card></view>
			</view>
		</scroll-view>		
		
		<view class="foot_box"></view>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
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
			couponDetail: {},
			tools: this.$tools,
			couponGoods: [],
			scrollId: '',
			nowTime: new Date().getTime(),
			options: {},
			btnStatusText: {
				no_use: '立即使用',
				used: '已使用',
				expired: '已失效',
				no_can_use: '暂不可用'
			},
			btnStataus: '',
			startTime:'',
			endTime:''
		};
	},
	computed: {},
	onLoad() {
		this.options = this.$Route.query;
		this.getCouponDetail();
		this.getCouponGoods();
	},
	methods: {
		// 领取优惠劵
		getCoupon() {
			let that = this;
			that.$api('coupons.get', {
				id: that.$Route.query.id
			}).then(res => {
				if (res.code === 1) {
					that.$tools.toast(res.msg);
					this.options.userCouponId = res.data.id;
					that.getCouponDetail();
				}
			});
		},
		// 优惠券详情
		getCouponDetail() {
			let that = this;
			that.$api('coupons.detail', {
				id: that.$Route.query.id,
				user_coupons_id: that.options.userCouponId
			}).then(res => {
				if (res.code === 1) {
					that.couponDetail = res.data;
					that.startTime = res.data.usetime.start
					that.endTime = res.data.usetime.end
					if (res.data.status_code) {
						this.btnStataus = res.data.status_code;
					}
				}
			});
		},
		// 适用商品
		getCouponGoods() {
			let that = this;
			that.$api('coupons.goods', {
				id: that.$Route.query.id
			}).then(res => {
				if (res.code === 1) {
					that.couponGoods = res.data.data;
				}
			});
		},
		onScroll(e) {
			console.log(e)
			this.scrollId = '';
		},
		loadMore(e){
			console.log("more")
			
		},
		goScroll() {
			if (!this.options.userCouponId) {
				this.getCoupon();
			} else {
				if (this.couponDetail.goods_ids === '0' && this.btnStataus == 'no_use') {
					this.$Router.push({
						path: '/pages/goods/list'
					});
				}
				this.scrollId = 'couponGoods';
			}
		}
	}
};
</script>

<style lang="scss">
.pageBox {
	background: #F5F6F7;
}
.head_box{
	width: 100%;
	height: 324rpx;
	background: url($IMG_URL+'/imgs/coupon/title.png') no-repeat;
	background-size: 100% 100%;
}
.scrollBox{
	position: relative;
	top: -134rpx;
}
.couponCore{
	padding: 0 30rpx;
	.TopBox{
		height: 206rpx;
		background: url($IMG_URL+'/imgs/coupon/top.png') no-repeat;
		background-size: 100% 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.title{
			font-size: 34rpx;
			font-weight: bold;
			color: #333333;
		}
		.time{
			font-size: 28rpx;
			color: #909399;
			margin-top: 20rpx;
		}
	}
	.centerBox{
		height: 333rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #FFF6F2;
		.title{
			font-size: 90rpx;
			font-weight: bold;
			color: #FF2900;
			margin-top: 20rpx;
		}
		.title::before{
			content: "￥";
			font-size: 26rpx;
			font-weight: bold;
			color: #FF2900;
		}
		.manjain{
			font-size: 30rpx;
			color: #333333;
		}
		.cBtn{
			width: 386rpx;
			height: 80rpx;
			margin-top: 30rpx;
			font-size: 30rpx;
			border-radius: 40rpx;
		}
		.use-btn {
			background: linear-gradient(180deg, #FF4800 0%, #FF2400 100%);
			color: rgba(#fff, 0.9);
		}
		.fail-btn {
			background: rgba(245, 245, 245, 1);
			color: rgba(188, 188, 188, 1);
		}
	}
	.botBox{
		height: 465rpx;
		background: url($IMG_URL+'/imgs/coupon/bot.png') no-repeat;
		background-size: 100% 100%;
		.ruleCore{
			padding: 50rpx;
			height: 440rpx;
			font-size: 30rpx;
			.title{
				font-weight: bold;
				color: #333333;
				margin-bottom: 20rpx;
			}
			.rule{
				color: #656667;
			}
		}
	}
}












.coupon-box {
	margin: 100rpx 30rpx 0;
	background: #fff;
	border-radius: 20rpx;
	.top {
		border-radius: 20rpx 20rpx 0 0;
		background-image: radial-gradient(circle at bottom left, #f0c785, #f0c785 16rpx, transparent 17rpx),
			radial-gradient(circle at bottom right, #f0c785, #f0c785 16rpx, transparent 17rpx);
		padding: 110rpx 0 40rpx 0;
		position: relative;
		z-index: 5;
		.coupon-line {
			width: 95%;
			border-bottom: 2rpx dashed #f3ce90;
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			z-index: 6;
		}
		.img-box {
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			background: #fff;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			top: -70rpx;
			.coupon-img {
				width: 100rpx;
				height: 100rpx;
			}
		}
		.title {
			font-size: 40rpx;
			font-weight: bold;
			line-height: 40rpx;
			margin-bottom: 30rpx;
		}
		.tip {
			font-size: 28rpx;
			font-weight: 500;
			margin-bottom: 50rpx;
		}
		.use-btn {
			width: 386rpx;
			height: 80rpx;
			background: linear-gradient(90deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
			border-radius: 40rpx;
			color: rgba(#fff, 0.9);
			margin-bottom: 30rpx;
		}
		.fail-btn {
			width: 386rpx;
			height: 80rpx;
			background: rgba(245, 245, 245, 1);
			border-radius: 40rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(188, 188, 188, 1);
			margin-bottom: 30rpx;
		}
		.time {
			color: #999;
			font-size: 26rpx;
		}
	}
	.bottom {
		border-radius: 0 0 20rpx 20rpx;
		background-image: radial-gradient(circle at top left, #f0c785, #f0c785 16rpx, transparent 17rpx),
			radial-gradient(circle at top right, #f0c785, #f0c785 16rpx, transparent 17rpx);
		padding: 40rpx 30rpx;
		.notice-item {
			border-bottom: 1rpx solid #eeeeee;
			min-height: 90rpx;
			width: 100%;
			.notice-title {
				font-weight: 500;
				font-size: 26rpx;
			}
			.notice-detail {
				font-size: 24rpx;
				color: #666;
				margin-top: 10rpx;
				padding-bottom: 10rpx;
			}
		}
	}
}
// 优惠券商品
.coupon-goods {
	background: #fff;
	margin: 20rpx;
	padding: 20rpx;
	border-radius: 20rpx;
	/deep/.goods-title {
		width: 420rpx;
	}
	.goods-list {
		padding: 20rpx 0;
		border-bottom: 1rpx solid rgba(223, 223, 223, 0.5);
	}
	.coupon-goods-title {
		font-size: 30rpx;
		font-weight: bold;
		height: 80rpx;
	}
}
</style>
