<template>
	<view>
		<swiper :style="{height: swiperHeight + 'px'}" :indicator-dots="indicatorDots" :autoplay="autoplay"
			:interval="interval" :duration="duration" @change="handleChange">
			<swiper-item class="" v-for="(item, index) in appcfgdata.app_guide_images" :key="index">
				<image class="image-size" mode="scaleToFill" :src="item" />
			</swiper-item>
		</swiper>
		<!-- 按钮样式切换 -->
		<template v-if="cur != appcfgdata.app_guide_images.length-1">
			<view class="dots">
				<block v-for="(item,index) in appcfgdata.app_guide_images" :key="index">
					<view class="dot" :class="{'active':  index == cur}"></view>
				</block>
			</view>
		</template>
		<!-- 第三张图使用按钮《立即进入》 -->
		<template v-if="cur == appcfgdata.app_guide_images.length-1">
			<button class="cu-btn footer" @click="handleLaunchApp">立即进入</button>
		</template>
		<!-- 右上角跳过按钮 -->
		<view class="btn-box" v-if="cur != appcfgdata.app_guide_images.length-1" @click="handleLaunchApp"><text class="passbtn">跳过</text></view>
		<!-- #ifdef MP-WEIXIN -->
		<shopro-skip v-show="appcfg.is_jump == 1" :site="1"></shopro-skip>
		<!-- #endif -->
	</view>
</template>

<script>
	import {mapMutations,mapActions,mapState} from 'vuex';
	export default {
		data() {
			return {
				swiperHeight: 0,
				indicatorDots: false,
				autoplay: false,
				interval: 10000,
				duration: 500,
				cur: 0,
				dotsStyles: ''
			};
		},
		computed:{
			...mapState({
				appcfgdata: state => state.init.appcfgData.shopro,
				appcfg: state => state.init.appcfgData
			}),
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync()
			this.swiperHeight = systemInfo.windowHeight
		},
		methods: {
			// 改变底部按钮的样式
			handleChange(event) {
				this.cur = event.detail.current
			},
			//跳过引导页,储存本地值,下次进入直接跳过
			handleLaunchApp() {
				uni.setStorageSync('launchFlag', true);
				uni.redirectTo({
					url: '/pages/index/index'
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
		min-height: 100%;
		height: 100%;
	}

	.guide {
		flex-direction: column;
		flex: 1;
	}

	.flex1 {
		flex: 1;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}


	.title-box {
		padding: 250rpx 0 120rpx 64rpx;
	}

	.guide-title {
		font-size: 48rpx;
		font-weight: bold;
		color: rgba(58, 61, 68, 1);
	}

	.guide-subtitle {
		margin-top: 20rpx;
		font-size: 35rpx;
		color: rgba(131, 136, 146, 1);
		line-height: 50rpx;
	}

	.cu-btn.footer {
		width: 231rpx;
		height: 80rpx;
		text-align: center;
		position: fixed;
		bottom: 116rpx;
		left: 37%;
		font-size: 30rpx;
		color: #FFFFFF;
		background-color: #2B9939;
	}

	.btn-box {
		position: absolute;
		z-index: 999;
		right: 40rpx;
		top: 150rpx;
	}

	.dots {
		display: flex;
		justify-content: center;
		position: absolute;
		z-index: 999;
		height: 151rpx;
		left: 0;
		right: 0;
		bottom: 20rpx;
	}

	.passbtn {
		color: #838892;
		text-align: center;
		border-width: 1rpx;
		// border-color: rgba(0, 0, 0, 0.5);
		border-style: solid;
		border-radius: 30rpx;
		font-size: 28rpx;
		padding-top: 10rpx;
		padding-bottom: 10rpx;
		padding-left: 25rpx;
		padding-right: 25rpx;
	}

	.dot {
		margin: 0 4rpx;
		width: 15rpx;
		height: 15rpx;
		background: #CDD2DD;
		border-radius: 8rpx;
		transition: all .6s;
	}

	.dot.active {
		width: 40rpx;
		background: #838892 !important;
	}

	/* 相对定位 */
	.zqui-rel {
		position: relative;
	}

	.swiper-css {
		width: 750rpx;
	}

	.swiper-item {
		width: 750rpx;
	}
	.image-size{
		width: 100%;
		height: 100%;
	}
</style>
