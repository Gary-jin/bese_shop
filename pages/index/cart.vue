<!-- 购物车 -->
<template>
	<view class="page_box">
		<view class="use_head_box" style="background-color: #ffffff">
				<cu-custom bgColor="" :isBack="true">
					<block slot="content">购物车</block>
				</cu-custom>
		</view>
		<view class="head_box" v-if="cartList.length">
			<view class="safety-box x-f" v-if="false">
				<text class="cuIcon-safe"></text>
				<text>无忧退换，让你的购物体验简单省心</text>
			</view>
			<view class="tip-box x-f" v-if="false">
				<text class="tag">全场满额减</text>
				再购154.10元立享每满400元减20元 >
			</view>
			<view class="tool-box x-bc bg-white">
				<view class="count-box">
					共{{ cartList.length }}件商品
				</view>
				<button class="cu-btn set-btn" @tap="onSet">{{ isTool ? '完成' : '编辑' }}</button>
			</view>
		</view>
		<view class="content_box">
			<checkbox-group class="block" v-if="cartList.length">
				<view class="collect-list x-start" v-for="(g, index) in cartList" :key="index">
					<view class="x-c" style="height: 200rpx;" @tap="onSel(index, g.checked)">
						<checkbox :checked="g.checked" :class="{ checked: g.checked }" class="goods-radio round color_ff2900">
						</checkbox>
					</view>
					<view class="goods-wrap">
						<view class="lose-box"
							v-if="g.cart_type === 'invalid' || (g.cart_type === 'activity' && !isActivityPay)">
							<text v-if="g.cart_type === 'invalid'" class="iconfont icon-yishixiao"></text>
							<view v-if="g.cart_type === 'activity' && !isActivityPay" class="invalid-tips x-c">
								活动商品,仅支持单独购买</view>
						</view>
						<shopro-mini-card :detail="g.goods" :sku="g.sku_price" :type="'sku'"
							:orderType="g.activity_type">
							<block slot="goodsBottom">
								<view class="x-bc price-box">
									<view class="priceKk">
										<text class="pricefuhao">￥</text>
										<text class="price">{{ g.sku_price.price }}</text>
									</view>
									<view class="num-step">
										<uni-number-box @change="onChangeNum($event, g, index)" :value="g.goods_num"
											:step="1" :min="0"></uni-number-box>
									</view>
								</view>
							</block>
						</shopro-mini-card>
					</view>
				</view>
			</checkbox-group>
			<view class="empty-box x-c" v-else>
				<shopro-empty :emptyData="emptyData"></shopro-empty>
			</view>
		</view>
		<view class="foot_box " v-if="cartList.length">
			<view class="tools-box x-bc">
				<label class="check-all x-f" @tap="onAllSel">
					<radio :checked="allSel" :class="{ checked: allSel }" class="check-all-radio color_ff2900"></radio>
					<text>全选</text>
					<!-- <text>（{{ totalCount.totalNum }}）</text> -->
				</label>
				<view class="x-f">
					<view class="priceKk"  v-if="!isTool">
						<text class="pricefuhao">￥</text>
						<text class="price">{{ totalCount.totalPrice.toFixed(2) }}</text>
					</view>
					<button class="cu-btn pay-btn" :disabled="!isSel"  v-show="!isTool"
						@tap="onPay">结算（{{ totalCount.totalNum }}）</button>
					<button class="cu-btn del-btn" v-show="isTool" @tap="goodsDelete">删除</button>
				</view>
			</view>
		</view>
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
	import {
		mapMutations,
		mapActions,
		mapState,
		mapGetters
	} from 'vuex';
	let timer = null;
	export default {
		components: {},
		data() {
			return {
				isTool: false,
				emptyData: {
					img: this.$IMG_URL + '/imgs/empty/emptyCart.png',
					tip: '购物车空空如也,快去逛逛吧~'
				}
			};
		},
		computed: {
			...mapState({
				cartList: ({
					cart
				}) => cart.cartList,
				allSel: ({
					cart
				}) => cart.allSelected,
			}),
			...mapGetters(['totalCount', 'isSel', 'isActivityPay'])
		},
		onLoad() {
			this.getCartList();
		},
		methods: {
			...mapActions(['getCartList', 'changeCartList']),
			// 更改商品数
			async onChangeNum(e, g, index) {
				if (g.goods_num !== e) {
					uni.showLoading({
						mask: true
					});
					this.$set(this.cartList[index], 'goods_num', +e);
					await this.changeCartList({
						ids: [g.id],
						goodsNum: e,
						art: 'change'
					});
					await uni.hideLoading();
				}
			},
			// 路由跳转
			jump(path, parmas) {
				this.$Router.push({
					path: path,
					query: parmas
				});
			},
			// 单选
			onSel(index, flag) {
				let that = this;
				that.$store.commit('selectItem', {
					index,
					flag
				});
			},
			// 功能切换
			onSet() {
				this.isTool = !this.isTool;
			},
			// 全选
			onAllSel() {
				let that = this;
				that.$store.commit('changeAllSellect'); //按钮切换全选。
				that.$store.commit('getAllSellectCartList', that.allSel); //列表全选
			},
			// 结算
			onPay() {
				let that = this;
				let {
					cartList
				} = this;
				if (this.isSel) {
					let confirmcartList = [];
					this.cartList.forEach(item => {
						if (item.checked) {
							confirmcartList.push({
								goods_id: item.goods_id,
								goods_num: item.goods_num,
								sku_price_id: item.sku_price_id,
								goods_price: item.sku_price.price
							});
						}
					});
					that.jump('/pages/order/confirm', {
						goodsList: JSON.stringify(confirmcartList),
						from: 'cart'
					});
				}
			},
			// 删除
			goodsDelete() {
				let that = this;
				let {
					cartList
				} = this;
				let selectedIdsArray = [];
				cartList.map(item => {
					if (item.checked) {
						selectedIdsArray.push(item.id);
					}
				});
				this.changeCartList({
					ids: selectedIdsArray,
					art: 'delete'
				});
			}
		}
	};
</script>

<style lang="scss">
	.head_box {
		.safety-box {
			height: 80rpx;
			font-size: 24rpx;
			padding: 0 30rpx;
			background: #f7f5f6;

			.cuIcon-safe {
				font-size: 32rpx;
				margin-right: 16rpx;
			}
		}

		.tip-box {
			font-size: 26rpx;
			color: #999;
			height: 90rpx;
			padding: 0 30rpx;
			background: #fff;

			.tag {
				border: 1rpx solid rgba(168, 112, 13, 1);
				border-radius: 2rpx;
				padding: 0 10rpx;
				line-height: 40rpx;
				font-size: 26rpx;
				color: #a8700d;
				margin-right: 20rpx;
			}
		}

		.tool-box {
			height: 90rpx;
			padding: 0 20rpx;
			margin-bottom: 30rpx;

			.count-box {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #9DA0A5;
				line-height: 40rpx;
			}

			.set-btn {
				background: none;
				font-size: 30rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #FF2900;
				line-height: 42rpx;
			}
		}
	}

	// 空白页
	.empty-box {
		flex: 1;
		width: 100%;
		height: 100%;
	}

	.collect-list {
		padding: 20rpx;
		margin: 0rpx 30rpx 20rpx 30rpx;
		background: #fff;
		box-shadow: 0px 2px 4px 0px rgba(231, 231, 231, 0.5);
		border-radius: 18rpx;

		/deep/ .goods-title {
			width: 382rpx !important;
			font-size: 32rpx !important;
			font-family: PingFangSC-Semibold, PingFang SC !important;
			font-weight: 600 !important;
			color: #303133 !important;
			line-height: 45rpx !important;
		}

		/deep/ .goods-img {
			height: 190rpx !important;
			width: 190rpx !important;
			border-radius: 15rpx !important;
		}

		// 商品卡片包裹
		.goods-wrap {
			position: relative;

			.lose-box {
				position: absolute;
				z-index: 10;
				width: 100%;
				height: 100%;
				background-color: rgba(#fff, 0.8);

				.icon-yishixiao {
					position: absolute;
					bottom: 0rpx;
					right: 80rpx;
					font-size: 140rpx;
					line-height: 140rpx;
					color: #dbdbdb;
					transform: rotate(-30deg);
				}

				.invalid-tips {
					position: absolute;
					top: 0;
					right: 0;
					left: 0;
					bottom: 0;
					margin: auto;
					width: 400rpx;
					height: 60rpx;
					border-radius: 30rpx;
					color: #fff;
					background-color: rgba(#000, 0.35);
				}
			}
		}

		.tag-box {
			.tag1 {
				line-height: 36rpx;
				padding: 0 8rpx;
				font-size: 18rpx;
				color: rgba(#fff, 0.9);
				background: #f39800;
				display: inline-block;
				box-sizing: border-box;
			}

			.tag2 {
				line-height: 34rpx;
				padding: 0 8rpx;
				font-size: 18rpx;
				color: rgba(#f39800, 0.9);
				background: #fff;
				border-top: 1rpx solid #f39800;
				border-right: 1rpx solid #f39800;
				border-bottom: 1rpx solid #f39800;
				display: inline-block;
				box-sizing: border-box;
			}
		}

		.goods-radio {
			transform: scale(0.7);
			margin-right: 20rpx;
			// background:  #E9B564;
		}

		.price-box {
			width: 382rpx;

			.price {
				color: #e1212b;
			}
		}
	}

	.tools-box {
		height: 100rpx;
		width: 750rpx;
		padding: 0 20rpx;
		background: #fff;

		.check-all {
			font-size: 26rpx;

			.check-all-radio {
				transform: scale(0.7);
				color: #e9b564;
			}
		}
		.pay-btn {
			width: 179rpx;
			height: 75rpx;
			background: linear-gradient(221deg, #FD7D1A 0%, #FA470B 100%);
			box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
			border-radius: 35rpx;
			padding: 0;
			color: rgba(#fff, 0.9);
			margin-left: 14rpx;
		}

		.del-btn {  
			width: 200rpx;
			height: 70rpx;
			background: linear-gradient(90deg, rgba(244, 71, 57, 1) 0%, rgba(255, 102, 0, 1) 100%);
			border-radius: 35rpx;
			padding: 0;
			color: rgba(#fff, 0.9);
		}
	}

	.priceKk {
		display: flex;
		align-items: center;
		justify-content: center;
		.pricefuhao {
			font-size: 22rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FF2900;
			line-height: 30rpx;
		}
		.price {
			font-size: 40rpx;
			font-family: DINAlternate-Bold, DINAlternate;
			font-weight: bold;
			color: #FF2900;
			line-height: 47rpx;
			letter-spacing: 1px;
		}
	}

.pay-btn[disabled]:not([type]) {
   color: #FFFFFF; 
   background-color: linear-gradient(221deg, #FD7D1A 0%, #FA470B 100%) !important;
   opacity:1 !important;
}

</style>
