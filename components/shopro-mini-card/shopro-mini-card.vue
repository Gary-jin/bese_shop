<template>
	<view class="">
		<view class="goods-box x-start" v-if="!type" @tap="jump('/pages/goods/detail/index', { id: detail.id })">
			<!-- <image class="goods-img" :src="detail.image" mode="aspectFill"></image> -->
			<u-lazy-load class="goods-img" :image="detail.image" :loading-img="loadingTmg" :error-img="errorImg">
			</u-lazy-load>
			<view class="y-start">
				<view class="goods-title more-t">{{ detail.title }}</view>
				<slot name="tipTag"></slot>
				<view class="size-tip">{{ detail.goods_sku_text ? detail.goods_sku_text : '' }}</view>
				<slot name="goodsBottom">
					<view class="price">￥{{ detail.price }}</view>
				</slot>
			</view>
		</view>
		<view class="goods-box x-start" v-if="type === 'sku'"
			@tap="jump('/pages/goods/detail/index', { id: detail.id })">
			<view class="order-goods__tag">
				<image v-if="orderType" class="tag-img" :src="orderStatus[orderType]" mode=""></image>
			</view>
			<u-lazy-load class="goods-img" :image="detail.image" :loading-img="loadingTmg" :error-img="errorImg">
			</u-lazy-load>
			<view class="y-start">
				<view class="goods-title more-t">{{ detail.title }}</view>
				<slot name="tipTag"></slot>
				<view class="size-tip">{{ sku.goods_sku_text ? sku.goods_sku_text : '' }}</view>
				<slot name="goodsBottom">
					<view class="priceKk">
						<text class="pricefuhao">￥</text>
						<text class="price">{{ detail.price }}</text>
					</view>
				</slot>
			</view>
		</view>
		<view class="favoriteBox" v-if="type === 'favorite'">
			<view class="goods-box x-start">
				<u-lazy-load class="goods-img" :image="detail.goods.image" :loading-img="loadingTmg"
					:error-img="errorImg"></u-lazy-load>
				<view class="y-start" @tap="jump('/pages/goods/detail/index', { id: detail.goods.id })">
					<view class="goods-title more-t">{{ detail.goods.title }}</view>
					<slot name="tipTag"></slot>
					<!-- <view class="sub-tip more-t">{{ detail.goods.subtitle }}</view> -->
					<slot name="goodsBottom">
						<view class="price">
							<text class="price1 zprice">{{ detail.goods.price }}</text>
							<text class="price1 original_price">{{ detail.goods.original_price }}</text>
						</view>
					</slot>
				</view>
			</view>
			<view class="lose-box" v-if="detail.favorite_type === 'invalid'">
				<text class="iconfont icon-yishixiao"></text>
			</view>
		</view>
		<view class="favoriteBox" v-if="type === 'trueque'">
			<view class="goods-box x-start">
				<u-lazy-load class="goods-img" :image="detail.goods.image" :loading-img="loadingTmg"
					:error-img="errorImg"></u-lazy-load>
				<view class="y-start" @tap="jump('/pages/trueque/listDetail', { id: detail.goods.id })">
					<view class="goods-title more-t">{{ detail.goods.title }}</view>
					<slot name="tipTag"></slot>
					<slot name="goodsBottom">
						<view class="price">
							<text class="price1 zprice">{{ detail.goods.price }}</text>
						</view>
					</slot>
				</view>
			</view>
			<view class="lose-box" v-if="detail.favorite_type === 'invalid'">
				<text class="iconfont icon-yishixiao"></text>
			</view>
		</view>
		<view class="goods-box x-start" v-if="type === 'truequeConfirm'"
			@tap="jump('/pages/goods/detail/index', { id: detail.id })">
			<u-lazy-load class="goods-img" :image="detail.image" :loading-img="loadingTmg" :error-img="errorImg">
			</u-lazy-load>
			<view class="y-start">
				<view class="goods-title more-t">{{ detail.title }}</view>
				<slot name="tipTag"></slot>
				<slot name="goodsBottom">
					<view class="priceKk">
						<text class="pricefuhao">￥</text>
						<text class="price">{{ detail.price }}</text>
					</view>
				</slot>
			</view>
		</view>
		<view class="goods-box x-start" v-if="type === 'order'">
			<view class="orderImgBox">
				<view class="order-goods__tag">
					<image v-if="detail.activity_type" class="tag-img" :src="orderStatus[detail.activity_type]" mode="">
					</image>
					<image v-if="orderType === 'score'" class="tag-img" :src="orderStatus[orderType]" mode=""></image>
				</view>
				<u-lazy-load class="goods-img1" :image="detail.goods_image || ''" :loading-img="loadingTmg"
					:error-img="errorImg" img-mode="widthFix"></u-lazy-load>
			</view>
			<view class="y-start order-right">
				<view class="goods-title1 more-t">{{ detail.goods_title || '' }}</view>
				<view class="order-tip">
					<text class="order-num">数量:{{ detail.goods_num || 0 }};{{ detail.goods_sku_text ? detail.goods_sku_text : '' }}</text>
					<text class="order-price">{{ detail.goods_price || 0 }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 商品小卡片
	 * @property {Object} detail - 卡片数据
	 * @property {Object} sku - 多规格卡片数据
	 * @property {String} type - 卡片种类。sku,favorite,order,其他。
	 */
	export default {
		name: 'shoproMiniCard',
		components: {},
		data() {
			return {
				routerTo: this.$Router,
				orderStatus: {
					seckill: this.$IMG_URL + '/imgs/seckill_tag.png',
					groupon: this.$IMG_URL + '/imgs/groupon_tag.png',
					score: this.$IMG_URL + '/imgs/score_tag.png'
				},
				errorImg: this.$ERROR_IMG,
				loadingTmg: this.$LOAD_IMG
			};
		},
		props: {
			detail: {},
			sku: {},
			type: '',
			orderType: ''
		},
		computed: {},
		created() {},
		methods: {
			// 路由跳转
			jump(path, parmas) {
				this.$Router.push({
					path: path,
					query: parmas
				});
			}
		}
	};
</script>

<style lang="scss">
	.goods-box {
		position: relative;

		.goods-img {
			height: 180rpx;
			width: 180rpx;
			// background-color: #ccc;
			margin-right: 15rpx;
			overflow: hidden;
			border-radius: 15rpx;
		}

		.order-goods__tag {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 5;

			.tag-img {
				width: 60rpx;
				height: 30rpx;
			}
		}
		.goods-title {
			font-size: 28rpx;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			width: 450rpx;
			line-height: 40rpx;
			margin-bottom: 10rpx;
		}
	
		.size-tip {
			line-height: 40rpx;
			// background: #f4f4f4;
			// padding: 0 16rpx;
			font-size: 24rpx;
			color: #666;
		}

		.sub-tip { 
			width: 480rpx;
			line-height: 40rpx;
			// background: #F6F2EA;
			font-size: 24rpx;
			color: #a8700d;
			margin: 10rpx 0;
		}

		// .priceKk {
		// 	display: flex;
		// 	align-items: center;
		// 	justify-content: center;
		
		// 	.pricefuhao {
		// 		font-size: 22rpx;
		// 		font-family: PingFangSC-Medium, PingFang SC;
		// 		font-weight: 500;
		// 		color: #FF2900 !important;
		// 		line-height: 30rpx;
		// 	}
		
		// 	.price {
		// 		font-size: 40rpx;
		// 		font-family: DINAlternate-Bold, DINAlternate;
		// 		font-weight: bold;
		// 		color: #FF2900;
		// 		line-height: 47rpx;
		// 		letter-spacing: 1px;
		// 	}
		// }
	}

	// order
	.goods-box {
		.orderImgBox{
			height: 190rpx;
			width: 190rpx;
			overflow: hidden;
			margin-right: 20rpx;
			border-radius: 15rpx;
			.tag-img{
				border-radius: 15rpx 0 0 0;
				display: block;
			}
		}
		.goods-img1 {
			height: 190rpx;
			width: 190rpx;
			border-radius: 15rpx;
			overflow: hidden;
		}
		.order-right {
			height: 190rpx;
			.goods-title1 {
				font-size: 32rpx;
				font-weight: bold;
				color: #303133;
				width: 420rpx;
			}
		}
		.order-tip {
			font-size: 30rpx;
			width: 420rpx;
			margin-top: 50rpx;
			display: flex;
			justify-content: space-between;
			.order-num {
				color: #909399;
			}
			.order-price{
				font-size: 32rpx;
				color: #333333;
			}
			.order-price::before{
				content: '￥';
				font-size: 22rpx;
			}
		}

		.order-goods {
			width: 420rpx;

			.status-btn {
				background: none;
				height: 32rpx;
				border: 1rpx solid rgba(207, 169, 114, 1);
				border-radius: 15rpx;
				font-size: 20rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(168, 112, 13, 1);
				padding: 0 10rpx;
				margin-left: 20rpx;
				background: rgba(233, 183, 102, 0.16);
			}

			.order-price {
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 600;
				color: rgba(51, 51, 51, 1);
			}
		}
	}

	.favoriteBox {
		position: relative;
		background: #ffffff;

		.lose-box {
			position: absolute;
			top: 0;
			z-index: 10;
			width: 100%;
			height: 100%;
			background-color: rgba(#fff, 0.8);

			.icon-yishixiao {
				position: absolute;
				bottom: 20rpx;
				right: 80rpx;
				font-size: 140rpx;
				line-height: 140rpx;
				color: #dbdbdb;
				transform: rotate(-30deg);
			}
		}

		.x-start {
			align-items: center;

			.goods-img {
				margin: 25rpx;
				border-radius: 15rpx;
				overflow: hidden;
			}

			.y-start {
				.goods-title {
					width: 390rpx;
					font-weight: 600;
					color: #303133;
					font-size: 32rpx;
					margin-bottom: 56rpx;
				}

				.price {
					.price1::before {
						content: '￥';
						font-size: 24rpx;
					}

					.zprice {
						font-size: 40rpx;
						font-weight: bold;
						color: #FF2900;
					}

					.original_price {
						font-size: 24rpx;
						font-weight: 400;
						color: #BBB2B2;
						margin-left: 20rpx;
						text-decoration: line-through;
					}
				}
			}
		}
	}
</style>
