<template>
	<view class="comment-box">
		<view class="commentB">
			<view class="head x-bc">
				<view class="x-f">
					<image class="avatar" :src="comment.user ? comment.user.avatar : $IMG_URL+'/imgs/base_avatar.png'" mode="aspectFill"></image>
					<view class="x-f star-box">
						<view>
							<view class="user-name one-t">{{ comment.user ? comment.user.nickname : '***' }}</view>
							<view style="margin-left: 20rpx;" class="x-f">
								<!-- <text class="cuIcon-favorfill star-active" v-for="s in comment.level" :key="s"></text>
								<text class="cuIcon-favorfill" v-for="z in 5 - comment.level" :key="z"></text> -->
								<image class="xxBox" :src="$IMG_URL + '/imgs/detail/x.png'" v-for="s in comment.level" :key="s" mode="widthFix"></image>
								<image class="xxBox" :src="$IMG_URL + '/imgs/detail/xx.png'" v-for="z in 5 - comment.level" :key="z" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</view>
				<text class="time">{{ tools.timestamp(comment.createtime,'.') }}</text>
			</view>
			<view class="detail">{{ comment.content }}</view>
			<view class="img-box">
				<view class="mask"></view>
				<scroll-view class="nav" enable-back-to-top scroll-x scroll-with-animation :scroll-left="scrollLeft">
					<image
						v-for="(img, index) in comment.images"
						:key="index"
						@tap="imgSelect(index)"
						@tap.stop="tools.previewImage(comment.images, index)"
						class="comment-img"
						:src="img"
						mode="aspectFill"
					></image>
				</scroll-view>
			</view>			
		</view>
	</view>
</template>

<script>
/**
 * 评论信息卡片
 * @property {Object} comment  - 评论信息
 */
export default {
	components: {},
	data() {
		return {
			scrollLeft: 0,
			tools: this.$tools
		};
	},
	props: {
		comment: {}
	},
	computed: {},
	methods: {
		imgSelect(current) {
			this.scrollLeft = current * 60;
		}
	}
};
</script>

<style lang="scss">
.comment-box {
	padding: 0 30rpx;
	background: #fff;
	.commentB{
		border-top: 1rpx solid #eee;
		padding: 20rpx 0;
	}
	.head {
		margin-bottom: 20rpx;

		.avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			background: #ccc;
		}

		.user-name {
			font-size: 28rpx;
			width: 140rpx;
			margin: 0 20rpx;
			font-weight: bold;
			color: #333333;
		}

		.star-box {
			.cuIcon-favorfill {
				font-size: 30rpx;
				color: #dedede;
			}

			.star-active {
				color: #ffba00;
			}
		}

		.time {
			font-size: 28rpx;
			color: #909399;
		}
		.xxBox{
			width: 25rpx;
			height: 25rpx;
			margin-right: 10rpx;
		}
	}

	.detail {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		line-height: 42rpx;
	}

	.img-box {
		margin-top: 30rpx;
		position: relative;

		.mask {
			background: linear-gradient(270deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%);
			width: 100rpx;
			height: 100%;
			position: absolute;
			z-index: 8;
			right: 0;
		}

		.comment-img {
			width: 166rpx;
			height: 166rpx;
			background: #ccc;
			margin-right: 19rpx;
			margin-bottom: 19rpx;
			border-radius: 15rpx;
			overflow: hidden;
		}
	}
}
</style>
