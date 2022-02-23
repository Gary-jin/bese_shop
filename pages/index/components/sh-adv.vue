<template>
	<view class="adv-box mx20 mb20">
		<!-- 模板1-->
		<view class="x-f type0" v-if="detail.style == 1">  
			<image style="width:710rpx;height: 220rpx;" @tap="jump(detail.list[0].path)" :src="detail.list[0].image" mode="widthFix"></image>
		</view>
		<!-- 模板2-->
		<view class="type1 x-bc" v-if="detail.style == 2">
			<image class="type1-img" @tap="jump(detail.list[0].path)" :src="detail.list[0].image" mode="aspectFill"></image>
			<image class="type1-img" @tap="jump(detail.list[1].path)" :src="detail.list[1].image" mode="aspectFill"></image>
		</view>
		<!-- 模板3-->
		<view class="type2 x-bc" v-if="detail.style == 3">
			<image class="type2-img1" @tap="jump(detail.list[0].path)" :src="detail.list[0].image" mode="aspectFill"></image>
			<view class="y-b type2-box">
				<image class="type2-img2 " @tap="jump(detail.list[1].path)" :src="detail.list[1].image" mode="aspectFill" style="border-bottom:1rpx solid #f6f6f6"></image>
				<image class="type2-img2" @tap="jump(detail.list[2].path)" :src="detail.list[2].image" mode="aspectFill"></image>
			</view>
		</view>
		<!-- 模板4-->
		<view class="type3 x-bc" v-if="detail.style == 4">
			<view class="type3-box y-b">
				<image class="type3-img1" @tap="jump(detail.list[0].path)" :src="detail.list[0].image" mode="aspectFill"></image>
				<image class="type3-img1" @tap="jump(detail.list[1].path)" :src="detail.list[1].image" mode="aspectFill"></image>
			</view>
			<image class="type3-img2" @tap="jump(detail.list[2].path)" :src="detail.list[2].image" mode="aspectFill"></image>
		</view>
		<!-- 模板5-->
		<view class="type4 y-f" v-if="detail.style == 5">
			<view class="type4-box x-bc">
				<image class="type4-img1" @tap="jump(detail.list[0].path)" :src="detail.list[0].image" mode="aspectFill"></image>
				<image class="type4-img1" @tap="jump(detail.list[1].path)" :src="detail.list[1].image" mode="aspectFill"></image>
			</view>
			<image class="type4-img2" @tap="jump(detail.list[2].path)" :src="detail.list[2].image" mode="aspectFill"></image>
		</view>
		<!-- 模板6-->
		<view class="type5 y-f" v-if="detail.style == 6">
			<image class="type5-img1" @tap="jump(detail.list[0].path)" :src="detail.list[0].image" mode="aspectFill"></image>
			<view class="type5-box x-bc">
				<image class="type5-img2" @tap="jump(detail.list[1].path)" :src="detail.list[1].image" mode="aspectFill" style="border-bottom:1rpx solid #f6f6f6"></image>
				<image class="type5-img2" @tap="jump(detail.list[2].path)" :src="detail.list[2].image" mode="aspectFill"></image>
			</view>
		</view>
		<!-- 模板7-->
		<view class="type6 y-f" v-if="detail.style == 7">
			<view class="x-bc type6-box1">
				<image class="type6-img1" @tap="jump(detail.list[0].path)" :src="detail.list[0].image" mode="aspectFill"></image>
				<image class="type6-img1" @tap="jump(detail.list[1].path)" :src="detail.list[1].image" mode="aspectFill"></image>
			</view>
			<view class="x-bc type6-box2">
				<image class="type6-img2" @tap="jump(detail.list[2].path)" :src="detail.list[2].image" mode="aspectFill"></image>
				<image class="type6-img2" @tap="jump(detail.list[3].path)" :src="detail.list[3].image" mode="aspectFill"></image>
				<image class="type6-img2" @tap="jump(detail.list[4].path)" :src="detail.list[4].image" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 自定义之广告魔方
 * @property {Object} detail -广告魔方信息
 */
export default {
	components: {},
	data() {
		return {};
	},
	props: {
		detail: {}
	},
	computed: {},
	created() {},
	methods: {
		// 路由跳转
		jump(path) {
			if(path){
				this.$tools.routerTo(path);
			} 
		}
	}
};
</script>

<style lang="scss">
.adv-box {
	background-color: #fff;
	overflow: hidden;
		
	.type0{
		border-radius: 14rpx;
		overflow: hidden;
	}
	.type1 {
		.type1-img {
			width: 49%;
			height: 220rpx;
			border-radius: 14rpx;
			
		}
	}

	.type2 {
		.type2-img1 {
			width: 49%;
			height: 340rpx;
			border-radius: 14rpx;
		}

		.type2-box {
			height: 340rpx;
			width: 49%;
			.type2-img2 {
				border-radius: 14rpx;
				height: 165rpx;
			}
		}
	}

	.type3 {
		.type3-box {
			height: 340rpx;
			width: 49%;
			.type3-img1 {
				border-radius: 14rpx;
				height: 165rpx;
			}
		}

		.type3-img2 {
			width: 49%;
			height: 340rpx;
			border-radius: 14rpx;
		}
	}

	.type4 {
		.type4-box {
			margin-bottom: 15rpx;
			width: 100%;
			.type4-img1 {
				width: 49%;
				height: 170rpx;
				border-radius: 14rpx;
			}
		}

		.type4-img2 {
			width: 100%;
			height: 170rpx;
			border-radius: 14rpx;
		}
	}

	.type5 {
		.type5-img1 {
			width: 100%;
			height: 170rpx;
			border-radius: 14rpx;
			margin-bottom: 15rpx;
		}

		.type5-box {
			width: 100%;
			.type5-img2 {
				width: 49%;
				height: 170rpx;
				border-radius: 14rpx;
			}
		}
	}

	.type6 {
		.type6-box1 {
			width: 100%;
			margin-bottom: 15rpx;
			.type6-img1 {
				width: 49%;
				height: 170rpx;
				border-radius: 14rpx;
			}
		}

		.type6-box2 {
			width: 100%;
			.type6-img2 {
				width: 32%;
				height: 170rpx;
				border-radius: 14rpx;
			}
		}
	}

	image {
		// background-color: #ccc;
	}
}
</style>
