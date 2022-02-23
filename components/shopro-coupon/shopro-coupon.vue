<template>
	<view class="" v-if="couponData">
		<!-- 未领取，已领取 -->
		<view class="coupon-wrap" v-if="state !== 3 && state !== 2 && type !=='noList'">
			<view class="ban banleft"></view>
			<view class="ban banrighr"></view>
			<!-- x-bc -->
			<view class="coupon-item ">
				<view class="coupon-left">
					<view class="sum-box">
						<view class="sum-box-concat">
							<text class="unit">￥</text>
							<text class="sum">{{ couponData.integer }}</text>
							<text class="sumdian">{{ couponData.decimals }}</text>
						</view>
					</view>
				</view>
				<view class="coupon-right">
					<view class="ucnconcat">
						<view class="uncTop">
							<text class="sub">{{ couponData.name }}</text>
						</view>
						<view class="uncBotom">
							<view class="unccontant comtop">
								<view class="notice">满{{ couponData.enough }}元可用</view>
								<view class="noticetime">{{ tools.timestamp(couponData.usetime.start) }}-{{ tools.timestamp(couponData.usetime.end) }}</view>
								
							</view>
							<view class="unccontant">
								<button class="cu-btn get-btn" v-if="state === 0" @tap.stop="getCoupon">立即领取</button>
								<button class="cu-btn get-btn" v-if="state === 1">去使用</button>
							    <view class="surplus-num" >仅剩{{ couponData.stock }}张</view>
							</view>

						</view>

					</view>
				</view>
				<!-- <view class="coupon-left y-start ">
					<view class="sum-box">
						<text class="unit">￥</text>
						<text class=" sum">{{ couponData.amount }}</text>
						<text class="sub">{{ couponData.name }}</text>
					</view>
					<view class="notice">满{{ couponData.enough }}元可用</view>
					<view class="notice">有效期：{{ tools.timestamp(couponData.usetime.start) }} 至 {{ tools.timestamp(couponData.usetime.end) }}</view>
				</view> -->
				<!-- <view class="coupon-right y-f">
					<button class="cu-btn get-btn" v-if="state === 0" @tap.stop="getCoupon">立即领取</button>
					<button class="cu-btn get-btn" v-if="state === 1">去使用</button>
					<button class="cu-btn get-btn" v-if="state === 2">查看详情</button>
					<view class="surplus-num" v-if="state === 0">仅剩{{ couponData.stock }}张</view>
				</view> -->
			</view>
		</view>
		
		<view class="noListCouponWrap" v-if="state !== 3 && state !== 2 && type ==='noList'">
			<view class="wrapBox">
				<view class="wrapBox1">
					<view class="pic mb">{{ couponData.enough }}</view>
					<view class="manj">满{{ couponData.enough }}元可用</view>
				</view>
				<view class="wrapBox1">
					<view class="name one-t mb">{{ couponData.name }}</view>
					<button class="cu-btn get-btn" v-if="state === 0" @tap.stop="getCoupon">立即领取</button>
					<button class="cu-btn get-btn" v-if="state === 1">去使用</button>
					<button class="cu-btn get-btn" v-if="state === 2">查看详情</button>
				</view>
			</view>
		</view>
		
		<!-- 失效 -->
		<view class="close-wrap" v-if="state === 3 || state === 2">
			<view class="ban banleft"></view>
			<view class="ban banrighr"></view>
			<image :src="$IMG_URL+'/imgs/user/usafter.png'" class="noData" v-if="state === 2"></image>
			<!-- x-bc -->
			<view class="coupon-item ">
				<view class="coupon-left">
					<view class="sum-box">
						<view class="sum-box-concat">
							<text class="unit">￥</text>
							<text class="sum">{{ couponData.integer }}</text>
							<text class="sumdian">{{ couponData.decimals }}</text>
						</view>
						
					</view>
				</view>
				<view class="coupon-right">
					<view class="ucnconcat">
						<view class="uncTop">
							<text class="sub">{{ couponData.name }}</text>
						</view>
						<view class="uncBotom">
							<view class="unccontant">
								<view class="notice">满{{ couponData.enough }}元可用</view>
							</view>
							<view class="unccontant">
								<view class="noticetime">{{ tools.timestamp(couponData.usetime.start ,'.') }}-{{ tools.timestamp(couponData.usetime.end ,'.') }}</view>
							</view>
			               <image :src="$IMG_URL+'/imgs/user/nohave.png'" class="noData"  v-if="state === 3"></image>
						</view>
			
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 优惠券
	 * @property {Number} state - 0:立即领取，1：去使用，2：查看详情，3：已失效。
	 * @property {Object} couponData - 优惠劵数据。
	 */
	export default {
		name: 'shoproCoupon',
		components: {},
		data() {
			return {
				tools: this.$tools
			};
		},
		props: {
			state: 0, //0:立即领取，1：去使用，2：查看详情，3：已失效。
			couponData: {},
			type:'' //   noList  非优惠券列表
		},
		computed: {},
		methods: {
			getCoupon() {
				let that = this;
				that.$api('coupons.get', {
					id: that.couponData.id
				}).then(res => {
					if (res.code === 1) {
						that.$tools.toast(res.msg);
						// that.couponData.stock -= 1;  //无效
						uni.$emit('couponsUpdate')
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	// 未领取，已领取
	.coupon-wrap {
		position: relative;
		border-radius: 18rpx;
		height: 238rpx;
		background-color: #FFFFFF;
		box-shadow: 0px 2px 4px 0px rgba(231, 231, 231, 0.5);
		margin-right: 0rpx !important;
		.ban{
			position: absolute;
			height: 56rpx;
			width: 56rpx;
			border-radius: 50%;
			background-color: #F5F6F7;
		}
		.banleft{
			top: 91rpx;
			left: -35rpx;
		}
		.banrighr{
			top: 91rpx;
			right: -35rpx;
		}

		.coupon-item {
			width: 100%;
			height: 238rpx;
			display: flex;
			align-items: center;

			.coupon-left {
				height: 100%;
				width: 201rpx;
				// background: linear-gradient(221deg, #FD7D1A 0%, #FA470B 100%);
				// opacity: 0.08 !important;
				background-color: rgba($color: #FD7D1A, $alpha: 0.08);

				.sum-box {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					height: 100%;
					margin-left: 5rpx;
				}
				.sum-box-concat{
					display: flex;
					align-items: flex-end;
					justify-content: center;
				}

				.unit {
					font-size: 20rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					color: #FE411C;
					line-height: 65rpx;
					z-index: 2;
				}

				.sum {
					font-size: 65rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #FE411C;
					line-height: 86rpx;
				}
				.sumdian{
					font-size: 28rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					color: #FE411C;
					line-height: 60rpx;
				}
			}

			.coupon-right {
				height: 100%;
				flex: 1;
				padding: 20rpx 30rpx;

				.uncTop {
					border-bottom: 1rpx solid #EEEEEE;
					padding-bottom: 20rpx;

					.sub {
						font-size: 28rpx;
						font-weight: 400;
						color: #333333;
					}
				}
				.uncBotom {
					padding: 20rpx 0rpx;
					height: 154rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.comtop{
						align-items: flex-start !important;
					}
					.unccontant {
						height: 100%;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: space-between;

						.notice {
							font-size: 30rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #333333;
							line-height: 42rpx;
							letter-spacing: 1px;
						}
						.get-btn {
							width: 156rpx;
							height: 54rpx;
							background: linear-gradient(180deg, #FF4800 0%, #FF2400 100%);
							border-radius: 31rpx;
							font-size: 26rpx;
							font-family: PingFangSC-Semibold, PingFang SC;
							font-weight: 600;
							color: #FFFFFF;
							line-height: 37rpx;
						}
						.noticetime{
							font-size: 26rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #909399;
							line-height: 37rpx;
							white-space:nowrap;
						}
						.surplus-num {
							font-size: 26rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #FE411C;
							line-height: 37rpx;
						}
					}
				}

			}
		}
	}

	// 失效
	.close-wrap {
	position: relative;
	border-radius: 18rpx;
	height: 238rpx;
	background-color: #FFFFFF;
	box-shadow: 0px 2px 4px 0px rgba(231, 231, 231, 0.5);
	margin-right: 0rpx !important;
	.noData{
		height: 139rpx !important;
		width: 145rpx !important;
		bottom: 0rpx !important;
		right: 10rpx !important;
		position: absolute !important;
	}
	.ban{
		position: absolute;
		height: 56rpx;
		width: 56rpx;
		border-radius: 50%;
		background-color: #F5F6F7;
	}
	.banleft{
		top: 91rpx;
		left: -35rpx;
	}
	.banrighr{
		top: 91rpx;
		right: -35rpx;
	}
	
	.coupon-item {
		width: 100%;
		height: 238rpx;
		display: flex;
		align-items: center;
	
		.coupon-left {
			height: 100%;
			width: 201rpx;
			// background: linear-gradient(221deg, #FD7D1A 0%, #FA470B 100%);
			// opacity: 0.08 !important;
			background-color: rgba($color: #DADADA, $alpha: 0.08);
	
			.sum-box {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 100%;
				color: #919090;
				margin-left: 5rpx;
			}
			.sum-box-concat{
				display: flex;
				align-items: flex-end;
				justify-content: center;
			}
	
			.unit {
				font-size: 20rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				line-height: 65rpx;
				z-index: 2;
			}
	
			.sum {
				font-size: 65rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				line-height: 86rpx;
			}
			.sumdian{
				font-size: 28rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				line-height: 60rpx;
			}
		}
	
		.coupon-right {
			height: 100%;
			flex: 1;
			padding: 20rpx 30rpx;
	
			.uncTop {
				border-bottom: 1rpx solid #EEEEEE;
				padding-bottom: 20rpx;
	
				.sub {
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #969696;
					line-height: 40rpx;
				}
			}
			.uncBotom {
				padding: 20rpx 0rpx;
				height: 154rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				position: relative;
				.unccontant {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
	
					.notice {
						font-size: 30rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #969696;
						line-height: 42rpx;
						letter-spacing: 1px;
					}
					.noticetime{
						font-size: 26rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
					     color: #B1B3B6;
						line-height: 37rpx;
					}
					
					
				}
			}
	
		}
	}
	}
	.cu-btn{
		padding: 0rpx !important;
	}
	
	.noListCouponWrap{
		width: 690rpx;
		height: 218rpx;
		background: url($IMG_URL+'/imgs/yhqnew.png') no-repeat;
		background-size: 100% 100%;
		.wrapBox{
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 67rpx;
			.wrapBox1{
				.pic{
					font-size: 46rpx;
					font-weight: bold;
					color: #FE411C;
				}
				.pic::before{
					content: '￥';
					font-size: 32rpx;
					font-weight: bold;
					color: #FE411C;
				}
				.manj{
					font-size: 30rpx;
					font-weight: 400;
					color: #FE411C;
				}
				.mb {
					margin-bottom: 10rpx;
				}
				.name{
					width: 203rpx;
					font-size: 48rpx;
					font-weight: bold;
					color: #FFFFFF;
					text-align: center;
				}
				.get-btn{
					width: 200rpx;
					height: 60rpx;
					background: linear-gradient(270deg, #FFE0A4 0%, #FFF8ED 49%, #FFE0A4 100%);
					border-radius: 30rpx;
					// padding: 0;
					font-size: 32rpx;
					font-weight: bold;
					color: #ED251C;
				}
			}
		}
	}
</style>
