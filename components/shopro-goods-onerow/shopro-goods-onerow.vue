<template>
	<view class="goods-box x-f" v-if="detail" @tap="jump('/pages/goods/detail/index', { id: detail.id })">
		<view class="img-box">
			<image v-if="isTag && detail.activity" class="tag-img" :src="tagPath[detail.activity.type]" mode=""></image>
			<!-- <image class="img" :src="detail.image" lazy-load mode="aspectFill"></image> -->
			<u-lazy-load :image="detail.image" :loading-img="loadingTmg" :error-img="errorImg" img-mode="widthFix"></u-lazy-load>
		</view>
		<view class="price-box">
			<view class="title more-t"><text v-show="false" class="new">上新</text>{{ detail.title }}</view>
			<view class="flex x-bc align-end">
				<view class="current">{{ detail.activity_type === 'groupon' ? detail.groupon_price : detail.price }}</view>
				<view class="sales">销量{{ detail.sales }}件</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 商品列表卡片
 * @property {Boolean} isTag - 是否显示商品标签，显示类别根据商品活动属性
 * @property {Object} detail - 商品详情数据
 */
export default {
	components: {},
	data() {
		return {
			tagPath: {
				groupon: this.$IMG_URL + '/imgs/groupon_tag.png',
				seckill: this.$IMG_URL + '/imgs/seckill_tag.png'
			},
			errorImg: this.$ERROR_IMG,
			loadingTmg: this.$LOAD_IMG
		};
	},
	props: {
		isTag: {
			type: [Boolean, String],
			default: false
		},
		detail: {
			type: Object,
			default: null
		}
	},
	computed: {},
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
	width: 710rpx;
	height: 216rpx;
	background: #fff;
	padding:0 20rpx;
	border-radius: 20rpx;
	overflow: hidden;
	.img-box {
		width: 178rpx;
		height: 178rpx;
		overflow: hidden;
		border-radius: 12rpx;
		box-shadow: 0px 5px 6px 0px rgba(170, 170, 170, 0.27);
		margin-right: 20rpx;
		overflow: hidden;
		position: relative;
		.tag-img {
			position: absolute;
			left: 0;
			top: 0;
			z-index: 2;
			width: 80rpx;
			height: 40rpx;
		}
		.img {
			width: 100%;
			height: 100%;
			background-color: #FFFFFF;
		}
	}

	



	.price-box {
		width: 470rpx;
		.title {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			line-height: 36rpx;
			height: 72rpx;
			margin-bottom: 66rpx ;
			.new{
				background: red;
				color: #FFFFFF;
				border-radius: 8rpx;
				padding:0 8rpx;
				margin-right: 6rpx;
			}
		}
		.sales {
			font-size: 20rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			line-height: 20rpx;
			margin-bottom: 20rpx;
		}
		.current {
			font-size: 32rpx;
			font-weight: bold;
			color: rgba(225, 33, 43, 1);
			line-height: 30rpx;
			margin-bottom: 20rpx;
			&:before {
				content: '￥';
				font-size: 24rpx;
			}
		}

		.original {
			font-size: 22rpx;
			font-weight: 400;
			text-decoration: line-through;
			color: rgba(153, 153, 153, 1);
			margin-left: 14rpx;
			line-height: 22rpx;
			margin-bottom: 10rpx;
			&:before {
				content: '￥';
				font-size: 20rpx;
			}
		}

		.tag-box {
			.discount {
				line-height: 28rpx;
				border: 1rpx solid rgba(225, 33, 43, 1);
				border-radius: 8rpx;
				font-size: 18rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(225, 33, 43, 1);
				padding: 0 8rpx;
				margin-right: 10rpx;
			}
		}
	}
}
</style>
