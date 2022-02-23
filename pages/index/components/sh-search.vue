<template>
	<view class="search x-c " :style="{ 'background-color': bgcolor }" :class="{ active: bgcolor }">
		<!-- 样式1 -->
		<view class="search-box styOne x-c shopro-selector-rect"
		@tap="jump('/pages/goods/list', { keywords: detail.name })" v-if="detail.style == 1">
			<text class="cuIcon-search"></text>
			<text class="search-val">{{ detail.name || '搜索' }}</text>
		</view>
		<!-- 样式2 -->
		<view class="search-box x-f pad styTwo shopro-selector-rect"
			@tap="jump('/pages/goods/list', { keywords: detail.name })" v-if="detail.style == 2">
			<text class="cuIcon-search"></text>
			<text class="search-val">{{ detail.name || '搜索' }}</text>
		</view>
	</view>
</template>

<script>
	/**
	 * 自定义之搜索样式卡片
	 * @property {Object} detail - 搜索信息
	 * @property {String} bgcolor - 背景颜色
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
			},
			bgcolor: {
				type: String,
				default: '#FFFFFF'
			}
		},
		computed: {
			
		},
		mounted() {
			 console.log(JSON.stringify(this.detail))

		},
		methods: {
			cc(){
			    // console.log(this.detail)	
			},
			jump(path, params) {
				this.$Router.push({
					path: path,
					params: params
				});
			}
		}
	};
</script>

<style lang="scss">
	.active {
		transition: all linear 0.3s;
	}

	.search {
		height: 100rpx;
		width: 750rpx;
		transition: all linear 0.3s;
	}

	.styOne {
		border-radius: 10rpx;
		background: #fff;
	}

	.styTwo {
		background: rgba($color: #FFFFFF, $alpha: 0.6);
		border-radius: 35rpx;

	}

	.search-box {
		height: 64rpx;
		width: 710rpx;

		.cuIcon-search {
			font-size: 36rpx;
			margin-right: 20rpx;
		}

		.search-val {
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
		}
	}
</style>
