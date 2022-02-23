<!-- 优惠劵列表  -->
<template>
	<view class="page_box">
		<view class="use_head_box" style="background-color: #FFFFFF;">
			<cu-custom bgColor="" :isBack="true">
				<block slot="content" style="font-size: 34rpx;">优惠劵</block>
			</cu-custom>
		</view>
		<view class="head_box">
			<view class="coupon-nav x-f">
				<!-- <view class="nav-item y-f" v-for="nav in couponsState" :key="nav.id" @tap="onNav(nav.id)">
					<view class="item-title">{{ nav.title }}</view>
					<text class="nav-line" :class="{ 'line-active': stateCurrent === nav.id }"></text>
				</view> -->

				<view class=" nav-item y-f tab " :class="stateCurrent == nav.id ? 'chosed' : 'chosebe'"
					v-for="nav in couponsState" :key="nav.id" @tap="onNav(nav.id)">
					<!-- 切换的横杠 -->
					<view class="whippletree" v-if="stateCurrent == nav.id"></view>
					<view class="tableText">{{ nav.title }}</view>
				</view>
			</view>

		</view>
		<view class="content_box">
			<view class="coupon-list" v-for="(c, index) in couponList" :key="index" @tap="toCouponDetail(c)">
				<shopro-coupon :state="stateCurrent" :couponData="c"></shopro-coupon>
			</view>
			<!-- 空白页 -->
			<shopro-empty v-if="isLoadingover" :emptyData="emptyData"></shopro-empty>
		</view>
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
				stateCurrent: 0,
				couponsState: [{
						id: 0,
						title: '领券中心'
					},
					{
						id: 1,
						title: '可使用'
					},
					{
						id: 2,
						title: '已使用'
					},
					{
						id: 3,
						title: '已失效'
					}
				],
				couponList: [],
				emptyData: {
					img: this.$IMG_URL + '/imgs/empty/coupon_none.png',
					tip: '暂无相关记录~'
				},
				isLoadingover: false
			};
		},
		computed: {},
		onLoad(parame) {
			let that = this;
			uni.$on('couponsUpdate', function(data) {
				that.getCouponList()
			})
			if(parame.id){
				that.onNav(parame.id)
			} else {
				that.getCouponList();
			}
		},
		methods: {
			onNav(id) {
				this.stateCurrent = id;
				this.couponList = [];
				this.getCouponList();
			},
			jump(path, parmas) {
				this.$Router.push({
					path: path,
					query: parmas
				});
			},
			getCouponList() {
				let that = this;
				that.$api('coupons.list', {
					type: that.stateCurrent
				}).then(res => {
					if (res.code === 1) {
						res.data.forEach((item)=>{
							item.integer = item.amount.split(".")[0]
							item.decimals = '.'+item.amount.split(".")[1]
							
						})
						that.couponList = res.data;
						if (that.couponList.length) {
							that.isLoadingover = false
						} else {
							that.isLoadingover = true
						}
					}
				});
			},

			//跳转优惠券详情
			toCouponDetail(data) {
				if (data.user_coupons_id) {
					this.jump('/pages/app/coupon/detail', {
						id: data.id,
						userCouponId: data.user_coupons_id
					});
				} else {
					this.jump('/pages/app/coupon/detail', {
						id: data.id
					});
				}
			}
		}
	};
</script>

<style lang="scss">
	.page_box {
		background: #f6f6f6;
	}

	.coupon-nav {
		background: #fff;
		height: 82rpx;
		padding: 0rpx 30rpx;

		.nav-item {
			flex: 1;

			.item-title {
				font-size: 30rpx;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
				line-height: 76rpx;
			}

			.nav-line {
				width: 120rpx;
				height: 4rpx;
				background: #fff;
			}

			.line-active {
				background: rgba(230, 184, 115, 1);
			}
		}
	}

	.coupon-list {
		margin: 20rpx 30rpx;
	}











	.tab {
		text-align: center;
		font-size: 30rpx;
		font-family: PingFangSC-Semibold, PingFang SC;
		position: relative;
		height: 42rpx;
		line-height: 42rpx;
		display: flex;
		flex-direction: column-reverse;
	}

	.chosed {
		font-weight: 600;
		color: #FF2900;
	}

	.chosebe {
		font-weight: 400;
		color: #9DA0A5;
	}

	.whippletree {
		z-index: 1 !important;
		width: 140rpx;
		height: 10rpx;
		background: linear-gradient(221deg, #FD7D1A 0%, #FA470B 100%);
		border-radius: 5rpx;
		opacity: 0.2;
	}

	.tableText {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0rpx;
		text-align: center;
		z-index: 1000000;
	}
</style>
