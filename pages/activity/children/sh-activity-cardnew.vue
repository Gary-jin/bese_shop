<template>
	<view class="activityBox">
		<view class="activity-goods-box x-bc" @tap="jump('/pages/goods/detail/index', { id: cardId })">
			<view class="img-box">
				<slot name="tag"></slot>
				<u-lazy-load img-mode="widthFix" class="goods-img" :image="img" :loading-img="loadingTmg"
					:error-img="errorImg"></u-lazy-load>
			</view>
			<view class="goods-right">
				<view class="title one-t">{{ title }}</view>
				<view class="preBox">
					<view class="originalBox">
						<view class="original">
							<view class="origTit1">原价</view>
							<view class="origTit">{{ originalPrice }}</view>
						</view>
						<view class="depreciate">
							<view class="origTit1">直降</view>
							<view class="origTit">{{ originalPrice - price }}</view>
						</view>
					</view>
				</view>
				<view class="currentBox" :class="colorstyle">{{ price }}</view>
				<slot name="btn"></slot>
			</view>
		</view>
	</view>

</template>

<script>
	/**
	 * 页面级功能组件。活动小商品卡片
	 * @property {Number} cardId  - 商品ID
	 * @property {String} img  - 商品图片
	 * @property {String} title  - 商品标题
	 * @property {String} subtitle  - 商品副标题
	 * @property {String} price  - 商品价格
	 * @property {String} originalPrice  - 商品原价
	 */
	export default {
		name: 'shoproActivityCard',
		components: {},
		data() {
			return {
				errorImg: this.$ERROR_IMG,
				loadingTmg: this.$LOAD_IMG
			};
		},
		props: {
			cardId: 0,
			img: '',
			title: '',
			subtitle: '',
			price: '',
			originalPrice: '',
			colorstyle: ''
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
	.activityBox {
		padding: 20rpx 20rpx 0 20rpx;

		.activity-goods-box {
			background: #FFFFFF;
			border-radius: 20rpx;

			.img-box {
				margin: 20rpx;
				width: 220rpx;
				height: 220rpx;
				overflow: hidden;
				position: relative;
				border-radius: 15rpx;

				.goods-img {
					width: 220rpx;
					height: 220rpx;
					// background-color: #ccc;
				}
			}

			.goods-right {
				width: 434rpx;
				min-height: 220rpx;
				align-items: flex-start;
				position: relative;
				margin-right: 10rpx;

				.title {
					width: 430rpx;
					font-size: 32rpx;
					font-weight: 600;
					color: #333333;
				}

				.tip {
					font-size: 22rpx;
					color: #a8700d;
					width: 410rpx;
				}

				.price-box {
					.current {
						font-size: 28rpx;
						font-weight: 500;
						color: rgba(225, 33, 43, 1);
					}

					.original {
						font-size: 22rpx;
						font-weight: 400;
						text-decoration: line-through;
						color: rgba(153, 153, 153, 1);
						margin-left: 14rpx;
					}
				}

				.preBox {
					width: 434rpx;
					height: 108rpx;
					background: url($IMG_URL+'/imgs/seckill/bg.png') no-repeat;
					background-size: 100% 108rpx;
					position: relative;
					top: 43rpx;
					.originalBox {
						width: 100%;
						height: 100%;
						display: flex;

						.original {
							width: 30%;
							font-size: 22rpx;
							font-weight: 400;
							color: #A59B9B;
							text-align: center;

							.origTit1 {
								margin-top: 20rpx;
							}

							.origTit {
								text-decoration: line-through;
							}
						}

						.depreciate {
							width: 112rpx;
							height: 101rpx;
							background: url($IMG_URL+'/imgs/seckill/icon.png') no-repeat;
							background-size: 100% 100%;
							font-weight: 400;
							font-size: 22rpx;
							color: #ffffff;
							display: flex;
							align-items: center;
							justify-content: center;
							flex-direction: column;
							position: relative;
							top: -32rpx;
							left: 35rpx;

							.origTit1 {
								font-size: 18rpx;
								margin-top: 24rpx;
							}
						}
					}

				}

				.currentBox {
					font-size: 38rpx;
					font-weight: bold;
					background: none !important;
				}

				.btn-nostart,
				.btn-end {
					color: #A8A8A8;
				}

				.btn-ing {
					color: #FF2900;
					margin-top: 20rpx;
				}

				.currentBox::before {
					content: '￥';
					font-size: 24rpx;
				}
			}
		}
	}
</style>
