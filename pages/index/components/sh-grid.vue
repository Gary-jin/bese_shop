<template>
	<view class="sh-grid-box mx20 mb20">
		<view class="tool-item" v-for="(menu, index) in detail.list" :key="index">
			<!-- #ifdef MP-WEIXIN -->
			<button class="server  y-f" :plain="true" hover-class="none" type="default" open-type="contact"
				bindcontact="handleContact" v-if="menu.path == '/pages/public/kefu/index'">
				<image class="tool-img" :src="menu.image" mode="aspectFill"></image>
				<text class="item-title">{{ menu.name }}</text>
			</button>
			<view class="y-f tool-cancant" v-else @tap="jump(menu)">
				<image class="tool-img" :src="menu.image" mode="aspectFill"></image>
				<text class="item-title">{{ menu.name }}</text>
			</view>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<view class="y-f tool-cancant" @tap="jump(menu)">
				<image class="tool-img" :src="menu.image" mode="aspectFill"></image>
				<text class="item-title">{{ menu.name }}</text>
			</view>
			<!-- #endif -->


		</view>
	</view>
</template>

<script>
	/**
	 * 自定义之宫格列表
	 * @property {Object} detail  - 宫格信息
	 */
	export default {
		components: {},
		data() {
			return {
				routerTo: this.$tools.routerTo
			};
		},
		computed: {},
		props: {
			detail: {
				type: Object,
				default: null
			}
		},
		methods: {
			jump(data) {
				console.log(JSON.stringify(data));
				if (data.path) {
					this.$tools.routerTo(data.path);
				}
			}
		}
	};
</script>

<style lang="scss">
	// 宫格
	.sh-grid-box {
		background: #fff;
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 40rpx;
		border-radius: 20rpx;
		overflow: hidden;

		.tool-item {
			width: (710rpx/4);
			padding-top: 40rpx;

			.y-f {
				width: 100%;
			}

			.tool-img {
				width: 44rpx;
				height: 44rpx;
				// background: #ccc;
			}

			.item-title {
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
				line-height: 24rpx;
				padding-top: 30rpx;
			}
		}
	}

	.server {
		background: none;
		border: none !important;
		line-height: 1;
		padding: 0;
	}
</style>
