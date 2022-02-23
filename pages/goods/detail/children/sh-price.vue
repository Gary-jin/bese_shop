<template>
	<view>
		<!-- 正常商品 -->
		<view class="normal-price-box" v-if="type !== 'score' && !detail.activity">
			<view class="shopro-selector-rect">
				<text class="unit">￥</text>
				<text class="price">{{ detail.price }}</text>
			</view>
			<view class="price-bottom-box">
				<view class="x-bc shopro-selector-rect">
					<view class="original-price">原价:￥{{ detail.original_price }}</view>
					<view class="sold">已售数量：{{ detail.sales }}件</view>
				</view>
				<view class="express"></view>
			</view>
		</view>
		<!-- 积分商品 -->
		<view class="score-price-card" v-if="type === 'score'">
			<view class="x-f">
				<image class="score-img" :src="$IMG_URL + '/imgs/score.png'" mode=""></image>
				<text class="price">{{ detail.price }}</text>
			</view>
			<view class="price-bottom-box">
				<view class="x-bc">
					<view class="original-price">价值:￥{{ detail.original_price }}</view>
					<view class="sold">已兑换：{{ detail.sales }}件</view>
				</view>
			</view>
		</view>
		<!-- 团购商品 -->
		<view class="grouponBox" v-if="detail.activity && detail.activity.type === 'groupon'">
			<view class="grouponTop ">
				<view class="grouponTopL">
					<view class="team_num">{{ detail.activity.rules.team_num }}人团购价：</view>
					<view class="price">{{ detail.activity_type === 'groupon' ? detail.groupon_price : detail.price }}</view>
				</view>
				<view class="grouponTopR">
					<view class="ponTopR">原价格：</view>
					<view class="price">{{ detail.original_price }}</view>
				</view>
			</view>
			<view class="grouponBot x-bc">
				<view class="pinNum">已拼数量：{{ detail.sales }}件</view>
		
				<view class="TimeBox x-f" v-if="activityRules.status === 'end'">
					<view class="pinTime">已结束</view>
				</view>
				<view class="TimeBox x-f" v-else>
					<view class="pinTime" v-if="activityRules.status === 'waiting'">距开始：</view>
					<view class="pinTime" v-if="activityRules.status === 'ing'">距结束：</view>
					<view class="pinTt">{{ activityRules.countDownTime.h || '00' }}</view>
					<text class="mmh">:</text>
					<view class="pinTt">{{ activityRules.countDownTime.m || '00' }}</view>
					<text class="mmh">:</text>
					<view class="pinTt">{{ activityRules.countDownTime.s || '00' }}</view>
				</view>
		
			</view>
		</view>
		<!-- 秒杀商品 -->
			<view class="eckillBox"  v-if="detail.activity && detail.activity.type === 'seckill'">
				<view class="grouponTop" :class="activityRules.status !== 'end' ? 'seckill-bg' : 'seckilled-bg'">
					<view class="grouponTopL">
						<view class="team_num">秒杀价：</view>
						<view class="price">{{ detail.price }}</view>
					</view>
					<view class="grouponTopR">
						<view class="ponTopR">原价格：</view>
						<view class="price">{{ detail.original_price }}</view>
					</view>
				</view>
				<view class="grouponBot x-bc">
					<view class="pinNum x-f">
						<view style="margin-right: 7rpx;" v-if="detail.stock > 0">剩{{ detail.stock }}件</view>
						<view style="margin-right: 7rpx;" v-else>已售完</view>
						<view class="progressBox cu-progress round sm striped" :class="percentage>10?'active':''">
							<view class="progressBg" :style="[{ width: loading ? getProgress(detail.sales, detail.stock) : ''}]"></view>
						</view>
					</view>
					
					<view class="TimeBox x-f" v-if="activityRules.status === 'end'">
						<view class="pinTime">已结束</view>
					</view>
					<view class="TimeBox x-f" v-else>
						<view class="pinTime" v-if="activityRules.status === 'waiting'">距开始：</view>
						<view class="pinTime" v-if="activityRules.status === 'ing'">距结束：</view>
						<view class="pinTt">{{ activityRules.countDownTime.h || '00' }}</view>
						<text class="mmh">:</text>
						<view class="pinTt">{{ activityRules.countDownTime.m || '00' }}</view>
						<text class="mmh">:</text>
						<view class="pinTt">{{ activityRules.countDownTime.s || '00' }}</view>
					</view>
					
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
/**
 * 商品详情价格卡片
 * @property {Object} detail - 商品详情
 * @property {String} type - 商品分类
 */
var timer = null;
export default {
	name: 'shPrice',
	components: {},
	data() {
		return {
			loading: false,
			time: {}, //倒计时
			activityRules: {
				startTime: 0,
				endTime: 0,
				status: '',
				countDownTime: 0
			},
			percentage:0
		};
	},
	props: {
		detail: Object,
		type: ''
	},
	created() {
		if (this.detail.activity && this.detail.activity.type) {
			this.doActivityRules();
		}
	},
	destroyed() {
		clearInterval(timer);
	},
	onUnload(){
		clearInterval(timer);
	},
	computed: {},
	methods: {
		// 百分比
		getProgress(sales, stock) {
			let unit = '';
			if (stock + sales > 0) {
				let num = (sales / (sales + stock)) * 100;
				unit = num.toFixed(2) + '%';
				this.percentage = num.toFixed(2)
			} else {
				unit = '0%';
				this.percentage = 0
			}
			return unit;
		},
		// 触发活动规则
		doActivityRules() {
			let that = this;
			switch (that.detail.activity.type) {
				case 'seckill':
				case 'groupon':
					that.activityRules.startTime = that.detail.activity.starttime * 1000;
					that.activityRules.endTime = that.detail.activity.endtime * 1000;
					that.countDown();
					setTimeout(() => {
						that.loading = true;
					}, 500);
					break;
			}
		},
		countDown() {
			let that = this;
			let t = 0;
			if (that.activityRules.endTime < new Date().getTime()) {
				that.activityRules.status = 'end';
				that.$emit('change', JSON.stringify(that.activityRules));
			}
			timer = setInterval(() => {
				let nowTime = new Date().getTime();
				if (nowTime < that.activityRules.startTime) {
					that.activityRules.status = 'waiting';
					t = that.activityRules.startTime - nowTime;
				} else if (nowTime > that.activityRules.endTime) {
					that.activityRules.status = 'end';
					clearInterval(timer);
					return;
				} else {
					that.activityRules.status = 'ing';
					t = that.activityRules.endTime - nowTime;
				}
				that.activityRules.countDownTime = that.$tools.formatToHours(t / 1000);
				t--;
				that.$emit('change', JSON.stringify(that.activityRules));
			}, 1000);
		}
	}
};
</script>

<style lang="scss">
// 正常商品
.normal-price-box {
	padding: 20rpx 30rpx 0;
	// background: url($IMG_URL+'/imgs/price_normal_bg.png') no-repeat;
	// background-size: 100% 100%;
	background: #FFFFFF;
	.unit{
		font-size: 36rpx;
		color: #FE411C;
		font-weight: bold;
	}

	.price {
		font-size: 46rpx;
		color: #FE411C;
		font-weight: bold;
	}

	.price-bottom-box {
		color: #BBB2B2;
		font-weight: 400;
		padding-top: 10rpx;
		.original-price {
			font-size: 32rpx;
			text-decoration: line-through;
		}
		.sold {
			font-size: 30rpx;
			color: #656667;
		}
	}
}

// 团购商品
.grouponBox{
	width: 750rpx;
	height: 204rpx;
	position: relative;
	top: -25rpx;
	.grouponTop{
		display: flex;
		justify-content: space-between;
		height: 142rpx;
		background: url($IMG_URL+'/imgs/group_price_bg.png') no-repeat;
		background-size: 100% 100%;
		.grouponTopL{
			.team_num{
				font-size: 26rpx;
				font-weight: 400;
				color: #232827;
				margin-left: 55rpx;
				margin-top: 14rpx;
			}
			.price{
				font-size: 62rpx;
				font-weight: 600;
				color: #232827;
				text-shadow: 0rpx 2rpx 0rpx #FFFFFF;
				margin-left: 46rpx;
				margin-top: 6rpx;
			}
		}
		.grouponTopR{
			width: 37%;
			height: 100%;
			.ponTopR{
				font-size: 24rpx;
				font-weight: 400;
				color: #FFFFFF;
				margin-top: 33rpx;
				margin-left: 15rpx;
			}
			.price{
				text-decoration: line-through;
				font-size: 48rpx;
				font-weight: 600;
				color: #FFFFFF;
				text-shadow: 0rpx 2rpx 0rpx #2C1A08;
				margin-top: 6rpx;
			}
		}
	}
	.grouponBot{
		display: flex;
		width: 100%;
		height: 87rpx;
		background: #FEF1E7;
		border-radius: 0rpx 0rpx 22rpx 22rpx;
		.pinNum{
			font-size: 28rpx;
			font-weight: bold;
			color: #FA4A0C;
			margin-left: 30rpx;
		}
		.TimeBox{
			margin-right: 30rpx;
			color: #FA4E0C;
			.pinTime{
				font-size: 28rpx;
				font-weight: bold;
				color: #333333;
			}
			.pinTt{
				color: #FFFFFF;
				background: #FA4E0C;
				padding: 0 10rpx;
				border-radius: 10rpx;
			}
			.mmh{
				width: 20rpx;
				text-align: center;
			}
		}
		
	}
}
.groupon-price-box {
	padding: 20rpx;
	
	.unit,
	.notice {
		font-size: 24rpx;
		color: rgba(#fff, 0.9);
	}
	.notice {
		line-height: 40rpx;
		border: 1rpx solid rgba(255, 255, 255, 1);
		border-radius: 6rpx;
		padding: 0 10rpx;
	}
	.price {
		font-size: 36rpx;
		color: rgba(#fff, 0.9);
		font-weight: bold;
		margin: 0 10rpx;
	}

	.price-bottom-box {
		font-size: 24rpx;
		color: rgba(#fff, 0.9);
		font-weight: 500;
		padding-top: 10rpx;

		.line {
			margin: 0 20rpx;
			display: inline-block;
			width: 3rpx;
			height: 24rpx;
			background-color: #fff;
		}
		.count-down {
			font-size: 24rpx;
			color: rgba(#fff, 0.9);
		}
	}
}
// 积分商品价格卡片
.score-price-card {
	padding: 20rpx 30rpx 0;
	// background: url($IMG_URL+'/imgs/detail/671e3bc4581f0b35791f382e4b5c2a8.png') no-repeat;
	// background-size: 100% 100%;
	background: #FFFFFF;
	width: 750rpx;
	.notice {
		font-size: 24rpx;
		color: #fff;
	}
	.score-img {
		width: 50rpx;
		height: 50rpx;
	}
	.price {
		margin-left:10rpx;
		font-size: 46rpx;
		font-weight: bold;
		color: #FE411C;
	}

	.price-bottom-box {
		color: #BBB2B2;
		font-weight: 400;
		padding-top: 10rpx;
		.original-price {
			font-size: 32rpx;
			text-decoration: line-through;
		}
		.sold {
			font-size: 30rpx;
			color: #656667;
		}
	}
}
// 秒杀商品
.seckill-bg {
	background: url($IMG_URL+'/imgs/price_seckill_bg.png') no-repeat;
	background-size: 100% 100%;
}
.seckilled-bg {
	background: url($IMG_URL+'/imgs/price_seckill_bg.png') no-repeat;
	background-size: 100% 100%;
}
.eckillBox{
	width: 750rpx;
	height: 206rpx;
	position: relative;
	top: -25rpx;
	.grouponTop{
		display: flex;
		justify-content: space-between;
		height: 144rpx;
		.grouponTopL{
			.team_num{
				font-size: 26rpx;
				font-weight: 400;
				color: #FFFFFF;
				margin-left: 55rpx;
				margin-top: 14rpx;
			}
			.price{
				font-size: 62rpx;
				font-weight: 600;
				color: #FFFFFF;
				text-shadow: 0rpx 2rpx 0rpx #CC4E00;
				margin-left: 46rpx;
				margin-top: 6rpx;
			}
		}
		.grouponTopR{
			width: 37%;
			height: 100%;
			.ponTopR{
				font-size: 24rpx;
				font-weight: 400;
				color: #FFFFFF;
				margin-top: 33rpx;
				margin-left: 15rpx;
			}
			.price{
				text-decoration: line-through;
				font-size: 48rpx;
				font-weight: 600;
				color: #FFFFFF;
				text-shadow: 0rpx 2rpx 0rpx #2C1A08;
				margin-top: 6rpx;
			}
		}
	}
	.grouponBot{
		display: flex;
		width: 100%;
		height: 87rpx;
		background: #FEF1E7;
		border-radius: 0rpx 0rpx 22rpx 22rpx;
		.pinNum{
			font-size: 28rpx;
			font-weight: bold;
			color: #FA4A0C;
			margin-left: 30rpx;
			width: 300rpx;
			.progressBox{
				width: 154rpx;
				height: 19rpx;
				.progressBg{
					background-color: #FA470B;
				}
			}
		}
		.TimeBox{
			margin-right: 30rpx;
			color: #FA4E0C;
			.pinTime{
				font-size: 28rpx;
				font-weight: bold;
				color: #333333;
			}
			.pinTt{
				color: #FFFFFF;
				background: #FA4E0C;
				padding: 0 10rpx;
				border-radius: 10rpx;
			}
			.mmh{
				width: 20rpx;
				text-align: center;
			}
		}
	}
}



.seckill-price-box {
	padding: 20rpx;
	// background-color: #C8091E;
	.unit,
	.notice,
	.count-down {
		font-size: 24rpx;
		color: rgba(#fff, 0.9);
	}

	.notice {
		line-height: 40rpx;
		border: 1rpx solid rgba(255, 255, 255, 1);
		border-radius: 6rpx;
		padding: 0 10rpx;
		margin-left: 10rpx;
	}

	.price {
		font-size: 36rpx;
		color: rgba(#fff, 0.9);
		font-weight: bold;
		margin: 0 10rpx;
	}

	.price-bottom-box {
		font-size: 24rpx;
		color: rgba(#fff, 0.9);
		font-weight: 500;
		padding-top: 10rpx;
		.original-price {
			text-decoration: line-through;
		}
		.express {
			.cu-progress {
				width: 100rpx;
				height: 10rpx;
				.progress-item--end {
					background: #7c7c7c;
				}
				.progress-item--noend {
					background: #fff;
				}
			}
			.seckill-progress {
				background: #a1071a;
			}
			.seckilled-progress {
				background: #fff;
			}
			.progress-text {
				color: rgba(#fff, 0.9);
				font-size: 24rpx;
				margin-left: 10rpx;
			}
		}
		.line {
			margin: 0 20rpx;
			display: inline-block;
			width: 3rpx;
			height: 24rpx;
			background-color: #fff;
		}
	}
}
</style>
