<template>
	<!-- 轮播 -->
	<view class="banner-swiper-box mb10" v-if="detail.list">
		<!-- 样式1 -->
		<swiper class="banner-carousel bannerOne shopro-selector-rect" circular @animationfinish="ationfinish" @transition="swiperAction" @change="swiperChange" :autoplay="true" v-if="detail.style == 1">
			<swiper-item v-for="(item, index) in detail.list" :key="index" class="carousel-item " @tap="jump(item.path)">
				<image class="swiper-image " :src="item.image" mode="widthFix" lazy-load></image>
			</swiper-item>
		</swiper>
		<view class="banner-swiper-dots">
			<text :class="swiperCurrent === index ? 'banner-dot-active' : 'banner-dot'" v-for="(dot, index) in detail.list.length" :key="index"></text>
		</view>
		<!-- 样式2 -->
		<view class="bannertoBgc" :style="{ 'background-color': bgcolor }" :class="{ active: bgcolor }"  v-if="detail.style == 2"></view>
		<swiper class="banner-carousel shopro-selector-rect bannerTwo" circular @animationfinish="ationfinish" @transition="swiperAction" @change="swiperChange" :autoplay="true" v-if="detail.style == 2">
			<swiper-item v-for="(item, index) in detail.list" :key="index" class="carousel-item " @tap="jump(item.path)">
				<image class="swiper-image " :src="item.image" mode="widthFix" lazy-load></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
/**
 * 自定义之轮播卡片
 * @property {Object} detail - 轮播信息
 */
export default {
	components: {},
	data() {
		return {
			swiperCurrent: 0, //轮播下标
			webviewId: 0,
			routerTo: this.$tools.routerTo,
			itemMoveDistance: 0,
			swiperCurrent: 0,
			circularGradient: [],
			num: 1
		};
	},
	props: {
		detail: {
			type: Object,
			default: null
		},
		bgcolor: {
			type: String,
			default: '#FFFFFF'
		}
	},
	computed: {},
	created() {
		
		this.initBgColor();
		
		// #ifdef MP-WEIXIN
		// this.countGradientColor(this.num)
		// #endif 
	},
	methods: {
		// 滑动中
		swiperAction(e) {
			// #ifdef MP-WEIXIN
				// this.countGradientColor(this.num)
				// this.num += 1
			// #endif 
		},
		// 停止
		ationfinish(e){
			// #ifdef MP-WEIXIN
			// this.num = 1;
			// this.initBgColor()
			// #endif 
		},
		countGradientColor(num) {
			let that = this;
			const list_copy = that.detail.list;
			
			let conentIndex = this.swiperCurrent
			if(this.swiperCurrent + 1 == list_copy.length) {
				conentIndex = 0;
			} else {
				conentIndex+=1
			}

			let gL = that.gradient(list_copy[this.swiperCurrent]['bgcolor'], list_copy[conentIndex]['bgcolor'], num)
			this.$emit('getbgcolor', gL);
			console.log(gL)

		},
		rgbToHex(r, g, b) {
			var hex = ((r << 16) | (g << 8) | b).toString(16);
			return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex;
		},
		// hex to rgb
		hexToRgb(hex) {
			var rgb = [];
			for (var i = 1; i < 7; i += 2) {
				rgb.push(parseInt("0x" + hex.slice(i, i + 2)));
			}
			return rgb;
		},
		// 计算渐变过渡色
		gradient(startColor, endColor, step) {
			// 将 hex 转换为rgb
			var sColor = this.hexToRgb(startColor);
			var	eColor = this.hexToRgb(endColor);

			// 计算R\G\B每一步的差值
			var rStep = (eColor[0] - sColor[0]) / step
			var	gStep = (eColor[1] - sColor[1]) / step
			var	bStep = (eColor[2] - sColor[2]) / step

			// var gradientColorArr = [];
			var gradientColorArr = '';
			for (var i = 0; i < step; i++) {
				// 计算每一步的hex值
				gradientColorArr = this.rgbToHex(parseInt(rStep * i + sColor[0]), parseInt(gStep * i + sColor[1]), parseInt(bStep * i + sColor[2]))
			}
			
			if( step== 1){
				return this.detail.list[this.swiperCurrent].bgcolor;
			} else {
				return gradientColorArr;
			}
		},

		// 轮播切换
		swiperChange(e) {
			this.swiperCurrent = e.detail.current;
			this.initBgColor();
		},
		// 初始化背景颜色，轮播图没滚动前
		initBgColor() {
			let bgcolor = this.detail.list[this.swiperCurrent].bgcolor;
			this.$emit('getbgcolor', bgcolor);
		},
		// 路由跳转
		jump(path, parmas) {
			if(path){
				this.$tools.routerTo(path);
				// this.$Router.push({
				// 	path: path,
				// 	query: parmas
				// });
			} 
		}
	}
};
</script>

<style lang="scss">
.hide-canvas {
	position: fixed !important;
	top: -99999upx;
	left: -99999upx;
	z-index: -99999;
}

// 轮播
.banner-swiper-box {
	background: #fff;
	// height: 350rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;
}
.bannertoBgc{
	position: absolute;
	top: 0;
	left: -15;
	width: 810rpx;
	height: 185rpx;
	border-bottom-left-radius: 100rpx;
	border-bottom-right-radius: 100rpx;
}
.bannerOne{
	width: 750rpx;
	height: 350rpx;
}
.bannerTwo{
	width: 690rpx;
	height: 320rpx;
	border-radius: 10rpx;
	overflow: hidden;
}

.banner-swiper-box,
.banner-carousel {
	
	position: relative;

	.carousel-item {
		width: 100%;
		height: 100%;
		// padding: 0 28upx;
		overflow: hidden;
	}

	.swiper-image {
		width: 100%;
		height: 100%;
		// border-radius: 10upx;
		// background: #ccc;
	}
}

.banner-swiper-dots {
	display: flex;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	bottom: 20rpx;
	z-index: 66;

	.banner-dot {
		width: 14rpx;
		height: 14rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.banner-dot-active {
		width: 14rpx;
		height: 14rpx;
		background: #a8700d;
		border-radius: 50%;
		margin-right: 10rpx;
	}
}
</style>
