<template>
	<view class="sh-user-menu-box mx20 mb20">
		<view class="menu-list-box">
			<view class="menu-item " v-for="(nav, index) in detail.list" :key="index">
				<!-- #ifdef MP-WEIXIN -->
				<button class=" server x-bc menu-cancont" :plain="true" hover-class="none" type="default"
					open-type="contact" bindcontact="handleContact" v-if="nav.path == '/pages/public/kefu/index'">
					<view class="x-f">
						<image  v-if="nav.image" class="item-img" :src="nav.image" mode="aspectFill"></image>
						<text class="item-title">{{ nav.name }}</text>
					</view>
					<text class="cuIcon-right item-arrow"></text>
				</button>

				<view class="x-bc menu-cancont" v-else @tap="jump(nav)">
					<view class="x-f">
						<image v-if="nav.image" class="item-img" :src="nav.image" mode=""></image>
						<text class="item-title">{{ nav.name }}</text>
					</view>
					<text class="cuIcon-right item-arrow"></text>
				</view>

				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<view class="x-bc menu-cancont" @tap="jump(nav)">
					<view class="x-f">
						<image v-if="nav.image" class="item-img" :src="nav.image" mode=""></image>
						<text class="item-title">{{ nav.name }}</text>
					</view>
					<text class="cuIcon-right item-arrow"></text>
				</view>
				<!-- #endif -->



			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 自定义之功能列表
	 * @property {Object} detail - 列表信息
	 */
	export default {
		components: {},
		data() {
			return {};
		},
		props: {
			detail: {
				type: Object,
				default: null
			}
		},
		computed: {},
		methods: {
			jump(data) {
				if (data.path) {
					this.$tools.routerTo(data.path);
				}
			}
		}
	};
</script>

<style lang="scss">
	.sh-user-menu-box {
		background: #fff;
		border-radius: 20rpx;
		overflow: hidden;
	}

	// 宫格
	.tools-box {
		background: #fff;
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 40rpx;
		margin-bottom: 20rpx;

		.tool-item {
			width: (750rpx/4);
			padding-top: 40rpx;

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

	// 列表
	.menu-list-box {
		.menu-item {
			height: 100rpx;
			padding: 0 30rpx;
			background: #fff;
			border-bottom: 1rpx solid #f3f3f3;

			.menu-cancont {
				height: 100%;
				width: 100%;
			}

			.item-img {
				width: 44rpx;
				height: 44rpx;
				margin-right: 20rpx;
				// background: #ccc;
			}

			.item-title {
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
				line-height: 24rpx;
			}

			.item-arrow {
				color: rgba(153, 153, 153, 1);
			}
		}
	}

	.server {
		background: none;
		border: none !important;
		line-height: 1;
		padding: 0;

		display: flex;
	}
</style>
