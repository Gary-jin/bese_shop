<template>
	<view class="">
		<!-- 规格 -->
		<view class="cu-modal sku-modal  bottom-modal" style="z-index: 999;" :class="{ show: showModal }" @tap="hideModal">
			<view class="cu-dialog" @tap.stop style="background: none;">
				<view class="shop-modal page_box" style="height:500rpx">
					<text class="cuIcon-roundclosefill" @tap="hideModal"></text>
					<!-- 商品信息 -->
					<view class="top x-f modal-head__box">
						<image class="shop-img" :src="goodsInfo.image" mode="aspectFill"></image>
						<view class="y-bc goods-box">
							<view class="goods-title more-t">{{ goodsInfo.title }}</view>
							<view class="x-bc goods-bottom">
								<view class="price-box x-f">
									<view v-if="goodsType === 'score'">{{ goodsInfo.price }}</view>
									<view v-else>￥{{ goodsInfo.price }}</view>
								</view>
								<text class="stock">库存{{ goodsInfo.stock }}件</text>
							</view>
						</view>
					</view>
					<!-- 选择规格 -->
					<view class="content_box">
						<view class="buy-num-box x-bc">
							<view class="num-title">购买数量</view>
							<view class="num-step">
								<uni-number-box
									@change="changeNum"
									:step="1"
									:min="0"
									:max="goodsInfo.carge"
									:value="goodsNum"
								></uni-number-box>
							</view>
						</view>
					</view>
					<view class="btn-box foot_box x-bc" ><button class="cu-btn  seckill-btn" @tap="confirm">确认</button></view>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 多规格组件
 * @property {Object} goodsInfo - 商品数据
 * @property {Boolean} value = showModal - 显隐
 */
import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue';
export default {
	name: 'shoproSku',
	components: {
		uniNumberBox
	},
	data() {
		return {
			goodsNum: 1,
		};
	},
	props: {
		goodsInfo: {},
		showModal: {
			type: Boolean,
			default: false
		}
	},
	created() {
	},
	mounted() {
	},
	computed: {

	},

	methods: {
		hideModal() {
			this.$emit('setShowModal', false);
		},
		// 数量
		changeNum(e) {
			this.goodsNum = +e;
		},
		confirm(){
			this.$emit('gobuy', this.goodsNum);
		}
	}
};
</script>

<style lang="scss">
.size-box {
	line-height: 82rpx;
	background: #fff;
	padding: 0 20rpx;
	margin: 20rpx 0;
	font-size: 28rpx;

	.title {
		color: #999;
		margin-right: 20rpx;
	}

	.cuIcon-right {
		color: #bfbfbf;
		font-size: 36rpx;
	}
}

// 规格
.shop-modal {
	width: 750upx;
	height: 950rpx;
	background: rgba(255, 255, 255, 1);
	border-radius: 30rpx 30rpx 0 0 !important;
	padding: 60upx 20upx 30rpx;

	.cuIcon-roundclosefill {
		font-size: 34rpx;
		color: #e0e0e0;
		position: absolute;
		top: 20rpx;
		right: 20rpx;
	}

	.top {
		margin-bottom: 50upx;

		.shop-img {
			width: 160upx;
			height: 160upx;
			border-radius: 6upx;
			margin-right: 30upx;
			background: #ccc;
		}

		.goods-box {
			height: 160upx;
			width: 490rpx;
			align-items: flex-start;

			.goods-title {
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				line-height: 42rpx;
				text-align: left;
			}

			.goods-bottom {
				width: 100%;
			}

			.price-box {
				font-size: 36upx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #e1212b;

				.unit {
					font-size: 24upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #e1212b;
				}
			}

			.stock {
				font-size: 26rpx;
				color: #999;
			}
		}
	}

	.select-box {
		margin-bottom: 25upx;

		.type-title {
			font-size: 26upx;
			font-family: PingFang SC;
			font-weight: 400;
			margin-bottom: 20upx;
		}
		.tag-box {
			flex-wrap: wrap;
		}
		.tag {
			line-height: 62rpx;
			background: rgba(#ddd, 0.8);
			border-radius: 31rpx;
			font-size: 28upx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #999;
			padding: 0 30upx;
			margin-bottom: 20rpx;
			margin-right: 10rpx;
		}

		.tag-active {
			background: linear-gradient(180deg, #FF4800 0%, #FF2400 100%);
			color: rgba(#fff, 0.9);
		}

		.tag-disabled {
			background: #f5f5f5;
		}
	}

	.buy-num-box {
		.num-title {
			font-size: 26upx;
			font-family: PingFang SC;
			font-weight: 400;
			margin-bottom: 20upx;
		}
	}
}

.btn-box {
	height: 100rpx;

	.cu-btn {
		width: 340rpx;
		height: 70rpx;
		border-radius: 35rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.9);
		padding: 0;
	}

	.cart-btn {
		background: linear-gradient(90deg, rgba(103, 104, 105, 1), rgba(82, 82, 82, 1));
		box-shadow: 0px 2rpx 5rpx 0px rgba(102, 103, 104, 0.46);
	}

	.buy-btn {
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
	}
	.seckill-btn {
		width: 710rpx;
		height: 70rpx;
		background: linear-gradient(180deg, #FF4800 0%, #FF2400 100%);
		box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		border-radius: 35rpx;
		padding: 0;
	}
}
</style>
