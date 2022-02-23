<template>
	<view>
		<view class="noneData">
			<image :src="$IMG_URL+'/imgs/sudoku/noneData.png'" class="noneIMg"></image>
			<text class="noneText" @click="goHome">领取成功</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			goHome(){
				// this.$tools.routerTo('/pages/index/index')

				uni.redirectTo({
					url: '/pages/index/index' 
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.noneData {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 119rpx;
		border-top: 1px solid #EEEEEE;
	}

	.noneIMg {
		width: 455rpx;
		height: 400rpx;
	}

	.noneText {
		font-size: 26rpx;
		color: #999;
		margin-top: 81rpx;
	}

	.noneText {
		width: 457rpx;
		height: 80rpx;
		background: linear-gradient(105deg, #E8B866 0%, #ECCA84 100%);
		border-radius: 40rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 32rpx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #FFFFFF;
		text-shadow: 0px 1px 0px #CAA058;
	}
</style>
