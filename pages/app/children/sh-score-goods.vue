<template>
	<view class="shop-list y-f" @tap="jump('/pages/goods/detail/index', { id: scoreData.id, type: 'score' })">
		<view class="image-box">
			<u-lazy-load class="shop-img" :image="scoreData.image" :loading-img="loadingTmg" :error-img="errorImg" img-mode="aspectFill"></u-lazy-load>
		</view>
		<view class="shop-title one-t">{{ scoreData.title }}</view>
		<view class="num-box x-bc">
			<view class="beans-box x-f">
				{{ scoreData.price }}
			</view>
			<view class="end-cash">已兑换{{ scoreData.sales }}件</view>
		</view>
	</view>
</template>

<script>
/**
 * 积分商品卡片
 * @property {Object} scoreData  - 积分商品信息
 */
export default {
	components: {},
	data() {
		return {
			errorImg: this.$ERROR_IMG,
			loadingTmg: this.$LOAD_IMG
		};
	},
	computed: {},
	props: {
		scoreData: {}
	},
	methods: {
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
.shop-list {
	width: 345upx;
	margin-bottom: 20upx;
	background-color: #fff;
	// padding-bottom: 30rpx;
	.image-box {
		margin-bottom: 20upx;
		width: 345upx;
		height: 345upx;
		border-radius: 20rpx 20rpx 0 0;
		overflow: hidden;
		.shop-img {
			width: 100%;
			height: 100%;
			background: #ccc;
		}
	}

	.shop-title {
		font-size: 32rpx;
		font-weight: 500;
		color: #333333;
		width: 300rpx;
		margin-bottom: 10rpx;
	}

	.num-box {
		width: 100%;
		padding: 0 20rpx;
		flex-wrap: wrap;
	}

	.beans-box {
		font-size: 30rpx;
		font-weight: 400;
		color: #FF1616;
		margin-bottom: 10rpx;

	}

	.end-cash {
		font-size: 22upx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(153, 153, 153, 1);
		margin-bottom: 10rpx;
	}
}
</style>
