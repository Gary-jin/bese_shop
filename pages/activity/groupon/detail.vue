<!-- 拼团详情 -->
<template>
	<view class="" style="margin-bottom: 130rpx;">    
		<view class="head_box">
			<view class="goods-card" v-if="grouponDetail.id">
				<sh-activity-card
					:cardId="grouponDetail.goods_id"
					:title="grouponDetail.goods.title"
					:subtitle="grouponDetail.goods.subtitle"
					:img="grouponDetail.goods.image"
					:price="grouponDetail.goods.groupon_price || grouponDetail.goods.price"
					:originalPrice="grouponDetail.goods.original_price"
				>
					<block slot="sell">     
						<view class="x-f">
							<view class="sell-box">
								<text class="cuIcon-hotfill"></text>
								<text class="sell-num">已拼{{ grouponDetail.goods.sales }}件</text>
							</view>
							<text class="group-num">{{ grouponDetail.num }}人团</text>
						</view>
					</block>
				</sh-activity-card>
			</view>
		</view>
		<!-- 样式一 -->
		<view class="content_box" v-if="grouponDetail.team_model == 0">
			<view class="y-bc group-box">
				<!-- 拼团成功 -->
				<view v-if="grouponDetail.status === 'finish' || grouponDetail.status === 'finish-fictitious'">
					<view class="tip-box x-f" v-if="grouponDetail.my.is_success == 1">
						<text class="cuIcon-roundcheckfill"></text>
						<text>恭喜您~拼团成功！</text>
					</view>
					<view class="tip-box x-f" v-else>
						<text class="cuIcon-roundclosefill"></text>
						<text>对不起~您来晚了，该团已满</text>
					</view>
				</view>

				<!--  拼团失败-->
				<view v-if="grouponDetail.status === 'invalid'">
					<view class="tip-box x-f" v-if="grouponDetail.my">
						<text class="cuIcon-roundclosefill"></text>
						<text>对不起~拼团已过期！已全额退款</text>
					</view>
					<view class="tip-box x-f" v-else>
						<text class="cuIcon-roundclosefill"></text>
						<text>对不起~拼团已过期！您来晚了~</text>
					</view>
				</view>
				<!-- 拼团中 -->
				<view class="title-box x-f" v-if="grouponDetail.status === 'ing'">
					<view class="title-text">
						待成团，还差
						<text class="group-num">{{ grouponDetail.num - grouponDetail.current_num }}</text>
						人拼团成功
					</view>
					<view class="count-down x-f" v-if="time">
						<text class="count-down-tip">倒计时</text>
						<view class="time-box x-f">
							<view class="count-text">{{grouponDetail.status === 'ing' ? time.h || '00' :'00' }}</view>
							:
							<view class="count-text">{{grouponDetail.status === 'ing' ? time.m || '00' :'00' }}</view>
							:
							<view class="count-text">{{grouponDetail.status === 'ing' ? time.s || '00' :'00' }}</view>
						</view>
					</view>
				</view>
				<view class="group-people x-f">
					<view class="img-box" v-for="(team, index) in grouponDetail.groupon_log" :key="index">
						<view class="tag" v-if="index == 0">团长</view>
						<image class="avatar" :class="{ leader: index == 0 }" :src="team.user_avatar" mode="aspectFill"></image>
					</view>
					<view class="img-box" v-for="(base,index) in surplusNum" :key="index"><image class="avatar"  :src="$IMG_URL + '/imgs/groupon/base_groupon.png'" mode="aspectFill"></image></view>
				</view>
				<view class="btn-box x-c">
					<!-- 拼团中 -->
					<view v-if="grouponDetail.status === 'ing'">
						<button class="cu-btn btn1" v-if="grouponDetail.my" @tap="onInvite">邀请好友参团</button>
						<button class="cu-btn btn1" v-else @tap="onJoin">立即参团</button>
					</view>
					<!-- 拼团成功/失败-->
					<view v-if="grouponDetail.status === 'finish' || grouponDetail.status === 'finish-fictitious' || grouponDetail.status === 'invalid'">
						<button class="cu-btn btn2" v-if="grouponDetail.my.is_success == 1" @tap.stop="jump('/pages/order/detail', { id: grouponDetail.my.order_id })">查看订单</button>
						<button class="cu-btn btn1" v-else @tap="jump('/pages/goods/detail/index', { id: grouponDetail.goods_id })">我要开团</button>
					</view>
				</view>
			</view>
			<view v-if="activity && activity.richtext_id" class="groupon-play x-bc" @tap="jump('/pages/public/richtext', { id: activity.richtext_id })">
				<text class="title">玩法</text>
				<view class="x-f">
					<view class="description one-t">{{ activity.richtext_title || '开团/参团·邀请好友·人满发货（不满退款' }}</view>
					<text class="cuIcon-right"></text>
				</view>
			</view>
		</view>
		
		<!-- 样式二 -->
		<view class="gdBox" v-if="grouponDetail.team_model == 1">
			<view class="gdTop">
				<view class="gdTit">参与拼团人数</view>
				<view class="gdTime">
					<view class="timeX"></view>
					<view class="timeBox x-c">
						剩余
						<view class="timeBB x-c">
							<view class="count-text">{{grouponDetail.status === 'ing' ? time.h || '00' :'00' }}</view>
							<view class="fuhao">:</view>
							<view class="count-text">{{grouponDetail.status === 'ing' ? time.m || '00' :'00' }}</view>
							<view class="fuhao">:</view>
							<view class="count-text">{{grouponDetail.status === 'ing' ? time.s || '00' :'00' }}</view>
						</view>
						结束
					</view>
					<view class="timeX"></view>
				</view>
				<!-- 进行中  ing -->
				<view class="gdText" v-if="grouponDetail.status === 'ing'">
					仅剩 <text class="TTit">{{ grouponDetail.num - grouponDetail.current_num }}人</text> 拼团成功，赶快行动起来吧
				</view>
				<!-- 成功  finish=已成团,finish-fictitious=虚拟成团 -->
				<view class="gdText" v-if="grouponDetail.status === 'finish' || grouponDetail.status === 'finish-fictitious' ">
					 {{grouponDetail.my.is_success == 1 ? '此单拼团成功，请查看您的订单列表':'您未拼中商品，请再接再厉'}}
				</view>
				<!-- 过期  invalid -->
				<view class="gdText" v-if="grouponDetail.status === 'invalid'">
					此单拼团已过期
				</view>
			</view>
			
			<view class="gdCenter x-bc" v-for="(team, index) in grouponDetail.groupon_log" :key="index">
				<view class="cenL">
					<view class="ImgBox">
						<image class="cenImg" :src="team.user_avatar" mode="aspectFill"></image>
						<image class="xye" v-if="team.is_success == 1" :src="$IMG_URL + '/imgs/xye.png' " mode="aspectFill"></image>
					</view>
					<view class="">
						<view class="cenName">
							<text class="one-t username">{{team.user_nickname}}</text>
							<image v-if="index == 0" class="tz" :src="$IMG_URL + '/imgs/tz.png' " mode="aspectFill"></image>
						</view>
						<view class="cenTime">{{$u.timeFormat(team.createtime , 'yyyy/mm/dd hh:MM:ss')}}</view>
					</view>
				</view>
				<view class="stateN" v-if="grouponDetail.status === 'ing'">拼团中</view>
				<view :class="team.is_success == 1 ? 'stateN':'stateNn'" v-else>{{team.is_success == 1 ? '拼团成功':'未拼中商品'}}</view>
			</view>
			
			<view class="gdBtn x-c" v-if="grouponDetail.status === 'ing' ">
				<button class="cu-btn btnYao" @tap="onInvite" v-if="grouponDetail.my">邀请好友</button>
				<button class="cu-btn btnYao" @tap="onJoin" v-else>立即参团</button>
			</view>
			
			<view class="gdBtn x-c" v-if="grouponDetail.status === 'finish' || grouponDetail.status === 'finish-fictitious' || grouponDetail.status === 'invalid'">
				<button class="cu-btn btnYao" v-if="grouponDetail.my.is_success == 1" @tap.stop="jump('/pages/order/detail', { id: grouponDetail.my.order_id })">查看订单</button>
				<button class="cu-btn btnYao" v-else @tap="jump('/pages/goods/detail/index', { id: grouponDetail.goods_id })">我要开团</button>
			</view>
		</view>
		
		
		<view class="foot_box"></view>
		<!-- 邀请好友 -->
		<shopro-share v-model="showShare" v-if="grouponDetail.goods" :goodsInfo="grouponDetail" :posterType="'groupon'"></shopro-share>
		<!-- sku -->
		<shopro-sku
			v-model="showSku"
			v-if="grouponDetail.goods"
			:grouponId="grouponDetail.id" 
			:goodsInfo="grouponDetail.goods"
			:buyType="'buy'"
			:grouponBuyType="'groupon'"
		></shopro-sku>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 连续弹窗提醒 -->
		<shopro-notice-modal></shopro-notice-modal>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
import shActivityCard from '../children/sh-activity-card.vue';
export default {
	components: {
		shActivityCard
	},
	data() {
		return {
			time: 0,
			grouponDetail: {},
			showShare: false,
			showSku: false,
			activity: {},
			surplusNum: 0, //剩余拼团人数、
			timer: null,
		};
	},
	computed: {},
	onLoad() {
		this.getGrouponDetail();
	},
	onPullDownRefresh() {
		this.getGrouponDetail();
	},
	onUnload(){
		clearInterval(this.timer);
	},
	methods: {
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 倒计时
		countDown(t) {
			let _self = this;
			_self.timer = setInterval(() => {
				if (t > 0) {
					_self.time = _self.$tools.formatToHours(t);
					t--;
				} else {
					clearInterval(_self.timer);
					_self.time = false;
				}
			}, 1000);
		},
		// 拼团详情
		getGrouponDetail() {
			let that = this;
			that.$api('goods.grouponDetail', {
				id: that.$Route.query.id
			}).then(res => {
				uni.stopPullDownRefresh();
				that.grouponDetail = res.data;
				that.activity = res.data.goods.activity;
				if (that.activity) {
					that.activity.richtext_id = parseInt(that.activity.richtext_id);
				}
				that.surplusNum = res.data.num - res.data.current_num;
				let newTime = new Date().getTime();
				let endTime = res.data.expiretime * 1000;
				let t = endTime - newTime;
				that.countDown(t / 1000);
				that.setShareInfo({
					query: {
						url: 'groupon-' + that.$Route.query.id
					},
					title: that.grouponDetail.goods.title,
					image: that.grouponDetail.goods.image
				});
			});
		},
		// 邀请
		onInvite() {
			this.showShare = true;
		},
		// 立即参团
		onJoin() {
			this.showSku = true;
		}
	}
};
</script>

<style lang="scss">
.head_box {
	background: url($IMG_URL+'/imgs/group_detail_bg.png') no-repeat;
	background-size: 100% 316rpx;
	padding: 100rpx 20rpx 20rpx;
	.goods-card {
		background-color: #fff;
		border-radius: 20rpx;
		.group-num {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			margin-left: 30rpx;
		}
		.sell-box {
			line-height: 32rpx;
			background: rgba(255, 224, 226, 0.3);
			border-radius: 16rpx;
			padding: 0 10rpx;

			.cuIcon-hotfill {
				color: #e1212b;
				font-size: 26rpx;
				margin-right: 10rpx;
			}

			.sell-num {
				font-size: 20rpx;
				color: #f7979c;
			}
		}
		/deep/.activity-goods-box {
			border-bottom: none;
			background: none;
			.goods-right {
				width: 460rpx;
				.title {
					width: 460rpx;
				}
				.tip {
					width: 460rpx;
				}
			}
		}
	}
}
.group-box {
	background: #fff;
	padding: 40rpx 0;
	min-height: 370rpx;
	justify-content: center;
	.tip-box {
		font-size: 28rpx;
		font-weight: bold;
		.cuIcon-roundcheckfill {
			color: #42b111;
			font-size: 34rpx;
			margin-right: 20rpx;
		}
		.cuIcon-roundclosefill {
			color: #d81e06;
			font-size: 34rpx;
			margin-right: 20rpx;
		}
	}
	.title-box {
		font-size: 26rpx;
		font-weight: bold;
		color: #333;
		.group-num {
			color: #f8002c;
		}
		.count-down-tip {
			font-size: 24rpx;
			padding-left: 10rpx;
		}
		.time-box {
			font-size: 18rpx;
			.count-text {
				display: inline-block;
				background-color: #383a46;
				color: #fff;
				font-size: 18rpx;
				border-radius: 2rpx;
				padding: 0 5rpx;
				height: 28rpx;
				text-align: center;
				line-height: 28rpx;
				margin: 0 6rpx;
			}
		}
	}

	.group-people {
		flex-wrap: wrap;
		padding: 50rpx;
		.img-box {
			position: relative;
			margin-right: 34rpx;
			&:nth-child(6n) {
				margin-right: 0;
			}
			.tag {
				position: absolute;
				line-height: 36rpx;
				background: linear-gradient(132deg, rgba(243, 223, 177, 1), rgba(243, 223, 177, 1), rgba(236, 190, 96, 1));
				border-radius: 14rpx;
				padding: 0 10rpx;
				white-space: nowrap;
				font-size: 24rpx;
				color: #784f06;
				z-index: 2;
				top: -20rpx;
				left: 50%;
				transform: translateX(-50%);
			}
			.avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				background: #ccc;
			}
			.leader {
				border: 4rpx solid rgba(237, 195, 108, 1);
			}
		}
	}
	.btn-box {
		width: 750rpx;
		.btn1 {
			width: 690rpx;
			height: 70rpx;
			background: linear-gradient(90deg, rgba(254, 131, 42, 1), rgba(255, 102, 0, 1));
			box-shadow: 0px 7rpx 6rpx 0px rgba(255, 104, 4, 0.22);
			border-radius: 35rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
		}
		.btn2 {
			width: 690rpx;
			height: 70rpx;
			border: 1rpx solid rgba(223, 223, 223, 1);
			border-radius: 35rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
		}
	}
}
.groupon-play {
	height: 94rpx;
	border-top: 1rpx solid rgba(#dfdfdf, 0.5);
	padding: 0 20rpx;
	background: #fff;
	.title {
		font-size: 28rpx;
		color: #999;
	}
	.description {
		font-size: 28rpx;
		text-align: right;
	}
	.cuIcon-right {
		margin-left: 20rpx;
	}
}

.gdBox{
	background: #FFFFFF;
	.gdTop{
		display: flex;
		flex-direction: column;
		align-items: center;
		.gdTit{
			font-size: 39rpx;
			font-weight: bold;
			padding: 40rpx 0;
		}
		.gdTime{
			display: flex;
			align-items: center;
			justify-content: center;
			.timeX{
				width: 122rpx;
				height: 1rpx;
				background: #EEEEEE;
			}
			.timeBox{
				font-size: 28rpx;
				color: #656667;
				margin: 0 32rpx;
				.timeBB{
					margin: 0 18rpx;
					.count-text{
						font-size: 32rpx;
						font-weight: bold;
						color: #FFFFFF;
						padding: 5rpx 10rpx;
						background: #FA4E0C;
						border-radius: 7rpx;
					}
					.fuhao{
						color: #FA490B;
						margin: 0 6rpx;
					}
				}
			}
		}
		.gdText{
			margin-top: 40rpx;
			margin-bottom: 45rpx;
			font-size: 24rpx;
			color: #656667;
			.TTit{
				color: #FF2900;
				margin: 0 10rpx;
			}
		}
	}
	
	.gdCenter{
		padding: 0 30rpx 40rpx 30rpx;
		.cenL{
			display: flex;
			.ImgBox{
				width: 96rpx;
				height: 96rpx;
				margin-right: 16rpx;
				.cenImg{
					width: 96rpx;
					height: 96rpx;
					border-radius: 48rpx;
					overflow: hidden;
				}
				.xye{
					width: 78rpx;
					height: 30rpx;
					position: relative;
					top: -30rpx;
					left: 10rpx;
				}
			}
			.cenName{
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
				display: flex;
				align-items: center;
				margin-top: 5rpx;
				.username{
					max-width: 300rpx;
				}
				.tz{
					width: 58rpx;
					height: 30rpx;
					margin-left: 16rpx;
				}
			}
			.cenTime{
				font-size: 28rpx;
				color: #909399;
				margin-top: 10rpx;
			}
		}
		.stateN{
			font-size: 28rpx;
			font-weight: bold;
			color: #FF2900;
		}
		.stateNn{
			font-size: 28rpx;
			font-weight: bold;
			color: #797A7B;
		}
	}
	
	.gdBtn{
		position: fixed;
		bottom: 0;
		height: 130rpx;
		background: #FFFFFF;
		width: 100%;
		border: 1rpx solid #f2f2f2;
		.btnYao{
			width: 690rpx;
			height: 90rpx;
			background: linear-gradient(180deg, #FF4800 0%, #FF2400 100%);
			border-radius: 45rpx;
			padding: 0;
			color: #FFFFFF;
			font-size: bold;
		}
	}
}
</style>
