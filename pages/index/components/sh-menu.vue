<template>
	<view class="">
		<view class="menu-category-box pa20 mx20 mb20" v-if="carousel.length" :style="detail.list.length <= menu ? `height:200rpx` : `height:360rpx`">
			<swiper class="swiper" @change="onSwiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item v-for="(itemList, index) in carousel" :key="index" >
					<view class="menu-tab-box">
						<!-- #ifdef MP-WEIXIN -->
						<view class="tab-list y-f" :style="{ width: 690 / menu + 'rpx' }" v-for="item in itemList" :key="item.name" @tap="routerTo(item.path)">
							<image class="tab-img shopro-selector-circular" :style="{ width: imgW + 'rpx', height: imgW + 'rpx' }" :src="item.image"></image>
							<text class="shopro-selector-rect">{{ item.name }}</text>
						</view>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<view class="tab-list y-f" :style="{ width: 670 / menu + 'rpx' }" v-for="item in itemList" :key="item.name" @tap="routerTo(item.path)">
							<image class="tab-img shopro-selector-circular" :style="{ width: imgW + 'rpx', height: imgW + 'rpx' }" :src="item.image"></image>
							<text class="shopro-selector-rect">{{ item.name }}</text>
						</view>
						<!-- #endif -->						
					</view>
				</swiper-item>
			</swiper>
			
			<view class="menu-category-dots" v-if="carousel.length > 1">
				<text :class="categoryCurrent === index ? 'category-dot-active' : 'category-dot'" v-for="(dot, index) in carousel.length" :key="index"></text>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 自定义之分类导航
 * @property {Object} detail - 分类导航信息
 * @property {Number} menu - 单行数量
 * @property {Number} imgW  - 图片宽度
 */
export default {
	components: {},
	data() {
		return {
			categoryCurrent: 0, //分类轮播下标
			indicatorDots: false,
			autoplay: false,
			interval: 3000,
			duration: 1000
		};
	},
	props: {
		detail: {
			type: Object,
			default: null
		},
		menu: {
			default: 5
		},
		imgW: {
			type: Number,
			default: 88
		}
	},
	computed: {
		carousel() {
			if (this.detail.list) {
				let data = this.sortData(this.detail.list, this.menu * 2);
				return data;
			}
		}
	},
	created() {},
	methods: {
		// 数据分层
		sortData(oArr, length) {
			let arr = [];
			let minArr = [];
			oArr.forEach(c => {
				if (minArr.length === length) {
					minArr = [];
				}
				if (minArr.length === 0) {
					arr.push(minArr);
				}
				minArr.push(c);
			});

			return arr;
		},
		// 轮播
		onSwiper(e) {
			this.categoryCurrent = e.detail.current;
		},
		// 路由跳转
		routerTo(path) {
			if(path){
				this.$tools.routerTo(path);
			} 
		}
	}
};
</script>

<style lang="scss">
// 产品分类
.swiper{
	height: 100%;
}
.menu-category-box {
	padding: 30rpx 0 0 0;
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;
}
.menu-category-box,
.menu-swiper-box {
	position: relative;
	background: #fff;
	.menu-swiper-item {
		background: #fff;
		height: 100%;
		width: 100%;
	}
	.menu-tab-box {
		display: flex;
		flex-wrap: wrap;
		.tab-list {
			font-size: 22rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			padding-bottom: 30rpx;

			.tab-img {
				border-radius: 25rpx;
				margin-bottom: 10rpx;
			}
		}
	}

	.menu-category-dots {
		display: flex;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 15rpx;

		.category-dot {
			width: 40rpx;
			height: 3rpx;
			background: #eeeeee;
			margin-right: 10rpx;
		}

		.category-dot-active {
			width: 40rpx;
			height: 3rpx;
			background: #a8700d;
			margin-right: 10rpx;
		}
	}
}
</style>
