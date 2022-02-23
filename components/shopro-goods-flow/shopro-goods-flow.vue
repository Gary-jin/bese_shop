<template>
	<view>
		<maramlee-waterfalls-flow ref="fallsFlow" :list="list" :imageSrcKey="imageSrcKey" :single="false" :imageStyle="{'border-radius': '10rpx;'}"  @wapper-Lick="goGoodDetail" >
			<view v-for="(item, index) of list" :key="index" slot="slot{{index}}" >
				<view class="cnt">
					<image v-if="item.activity" class="tag-img" :src="tagPath[item.activity.type]" mode=""></image>
					<view class="title more-t">{{ item.title }}</view>
					<view class="price-box">
						<view class="flex x-bc align-end">
							<view class="current">{{ item.activity_type === 'groupon' ? item.groupon_price : item.price }}</view>
							<view class="sales">销量{{ item.sales }}件</view>
						</view>
					</view>
				</view>
			 </view>
		</maramlee-waterfalls-flow>
	</view>
</template>

<script>
/**
 * 商品列表卡片
 * @property {Boolean} isTag - 是否显示商品标签，显示类别根据商品活动属性
 */
export default {
	components: {},
	data() {
		return {
			tagPath: {
				groupon: this.$IMG_URL + '/imgs/groupon_tag.png',
				seckill: this.$IMG_URL + '/imgs/seckill_tag.png'
			}
		};
	},
	props: {
		list: { type: Array, required: true },
		// 图片 src 的键名
		imageSrcKey: { type: String, default: "image_url" },
	},
	computed: {
	
	},
	mounted() {
		let that =this;
		uni.$on('refreshFlow',function(data){
			that.$refs.fallsFlow.refresh();
		})
	},
	methods: {
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		goGoodDetail(val){
			this.jump('/pages/goods/detail/index', { id: val.id })
		}
	}
};
</script>

<style lang="scss">


	
		.tag-img {
			position: absolute;
			left: 0;
			top: 0;
			z-index: 2;
			width: 80rpx;
			height: 40rpx;
			border-radius: 12rpx 0 0 0;
		}

		

	

	.title {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 36rpx;
		height: 72rpx;
		margin: 20rpx 20rpx 10rpx;
	}

	.price-box {
		padding: 10rpx 20rpx 0;
		width: 344rpx;
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
	}

</style>
