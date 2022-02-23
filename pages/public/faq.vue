<!-- 常见问题 -->
<template>
	<view class="faq-box">
		<view class="faqBox" v-if="faqList.length">
			<image class="faqImg" :src="$IMG_URL+'/imgs/seckill/faq.png'" mode="widthFix"></image>
		</view>
		<view class="problemBox">
			<view class="titletop">
				常见问题解答
			</view>
			<view class="problem-item" v-for="(item, index) in faqList" :key="item.id" @tap="onProblem(index)">
				<view class="x-bc title-box">
					<view class="x-f">
						<view class="lg text-gray cuIcon-title tag-box2"></view>
						<view class="title one-t">{{ item.title }}</view>
					</view>
					<text class="cuIcon-unfold " :class="{ 'cuicon-active': item.checked }"></text>
				</view>
				<view class="detail" v-if="item.checked">{{ item.content }}</view>
			</view>
		</view>
		
		 <!-- 更多 -->
		<u-loadmore v-if="faqList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 连续弹窗提醒 -->
		<shopro-notice-modal></shopro-notice-modal>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			faqList: [],
			loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
			currentPage: 1,
			lastPage: 1
		};
	},
	computed: {},
	onLoad() {
		this.getFaqList();
	},
	onReachBottom() {
		if (this.currentPage < this.lastPage) {
			this.currentPage += 1;
			this.getFaqList();
		}
	},
	methods: {
		onProblem(index) {
			if (this.faqList[index].checked) {
				this.$set(this.faqList[index], 'checked', false);
			} else {
				this.$set(this.faqList[index], 'checked', true);
			}
		},
		// 常见问题列表、
		getFaqList() {
			let that = this;
			that.loadStatus = 'loading';
			that.$api('faq.list', {
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					res.data.data.forEach((faq, index) => {
						faq.indexNum = (index + 1).toString().padStart(2, '0');
					});
					that.faqList = [...that.faqList, ...res.data.data];
					that.lastPage = res.data.last_page;
					if (that.currentPage < res.data.last_page) {
						that.loadStatus = 'loadmore';
					} else {
						that.loadStatus = 'nomore';
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #fff;
}
.faq-box {
	background: #fff;
	.faqBox{
		width: 100%;
		height: 320rpx;
		.faqImg{
			width: 100%;
			height: 100%;
		}
	}
	.problemBox{
		border-radius: 64rpx 64rpx 0rpx 0rpx;
		position: relative;
		top: -82rpx;
		background: #FFFFFF;
		padding: 0 20rpx;
		overflow: hidden;
		.titletop{
			font-size: 32rpx;
			font-weight: bold;
			color: #303133;
			margin-top: 40rpx;
			text-align: center;
		}
	}
	.problem-item:last-child{
		border: none;
	}
	.problem-item {
		border-bottom: 1rpx solid rgba(#dfdfdf, 0.5);
		
		.title-box {
			height: 98rpx;
			.title{
				width: 590rpx;
			}
		}
		.detail {
			width: 631rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(102, 102, 102, 1);
			line-height: 48rpx;
			padding-left: 40rpx;
			padding-bottom: 40rpx;
		}
		.tag-box {
			margin-right: 20rpx;
			width: 39rpx;
			height: 34rpx;
			background: rgba(233, 191, 113, 1);
			border-radius: 6rpx;
			position: relative;
			z-index: 6;
			.serial {
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(168, 112, 13, 1);
				line-height: 24rpx;
			}
			.triangle {
				position: absolute;
				z-index: 5;
				width: 10rpx;
				height: 10rpx;
				background: rgba(233, 191, 113, 1);
				transform: rotate(45deg);
				bottom: -4rpx;
			}
		}
		.tag-box2{
			color: #FF6226;
			margin-right: 33rpx;
		}
		.detail-box {
			flex: 1;
			.title {
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}
		}

		.cuIcon-unfold {
			transition: all ease-in-out 0.2s;
		}
		.cuicon-active {
			transform: rotate(180deg);
			transition: all ease-in-out 0.2s;
		}
	}
}
</style>
