<!-- 我的团队 -->
<template>
	<view class="team-wrap">
		<!-- 头部 -->
		<view class="head_box" >
			<view class="use_head_box" style="color: #FFFFFF !important;">  
				<cu-custom :isBack="true">
					<block slot="content" style="color: #FFFFFF; font-size: 36rpx; font-weight: 600;">我的团队</block>
				</cu-custom>
			</view>
			<!-- 我的推荐人 -->
			<view class="people">我的推荐人：{{referrerInfo.referrer || '暂无~'}}</view>
			<!-- 总数量 -->
			<view class="roughlyKk">
				<view class="roughly">
					<view class="rughNumberKk">
						<view class="numberTop">
							{{referrerInfo.today_num}}
						</view>
						<view class="numberbottom">
							今日新增人数
						</view>
					</view>
					<view class="separate"></view>
					<view class="rughNumberKk">
						<view class="numberTop">
							{{referrerInfo.total_num}}
						</view>
						<view class="numberbottom">
							全部人数
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 列表 -->
		<view class="List">
			<!-- 切换栏 -->
			<view class="tableKk">
				<view class="tableOne" v-for="(item,index) in filterList" :key="index" @click="chose(item)">
					<text class="choseText"
						:class="type == item.type ? 'choseTexted' : 'choseTextbe'">{{item.title}}</text>
					<text class="choes" :class="type == item.type ? 'choesed' : 'choesbe'"></text>
				</view>
			</view>

			<view class="listUl">
				<scroll-view scroll-y="true" class="scroll-Y" @scrolltolower="lower">
					<view class="listLI" v-for="(item,key) in teamList" :key="key">
						<image :src="item.avatar" class="listImng"></image>
						<view class="contantKk">
							<view class="header">
								<text class="username one-t">{{item.nickname}}</text>
								<text class="userLevel">{{item.level_text}}</text>
								<!-- <image src="https://dummyimage.com/500x500/ff6a00/fff" mode="" class="userClass"></image> -->
							</view>
							<view class="boderm">
								电话：{{item.mobile}}
							</view>
						</view>
						<view class="time">
							{{ $u.timeFormat(item.createtime , 'yyyy/mm/dd') }}
						</view>
					</view>
					<view class="noneData" v-if="emptyData.show">
						<image :src="emptyData.img" class="noneIMg"></image>
						<text class="noneText">{{emptyData.tip}}</text>
					</view>
					<!-- 垫脚 -->
					<view class="foot-pad"></view>
				</scroll-view>
			</view>
		</view>
		<!-- 底部按钮-->
		<view class="btnKk">
			<view class="btn" @click="invite">
				推荐好友
			</view>
		</view>



	</view>
</template>

<script>
	import shCollapseItem from '../children/sh-collapse-item.vue';
	import {
		mapMutations,
		mapActions,
		mapState
	} from 'vuex';
	export default {
		components: {
			shCollapseItem
		},
		data() {
			return {
				emptyData: {
					show: false,
					img: this.$IMG_URL + '/imgs/empty/empty_goods.png',
					tip: '暂无团队人员',
					path: '',
					pathText: ''
				},
				referrerInfo: {}, //推荐人信息
				filterList: [{
						title: '我的直推',
						type: 1
					},
					{
						title: '二级好友',
						type: 2
					},
					{
						title: '二级以后',
						type: 3
					}
				],
				teamList: [], //团队列表
				currentPage: 1,
				type: 1,
			
			};
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo
			})
		},
		onLoad() {
			this.getTeam();
		},
		methods: {
			...mapActions(['getAgent']),
			//tabs切换
			chose(item) {
				this.type = item.type
				this.currentPage = 1
				this.teamList = []
				this.getTeam()
			},
			lower: function(e) {
				this.currentPage += 1;
				this.getTeam();
			},

			// 团队列表
			getTeam() {
				let that = this;
				that.emptyData.show = false;
				that.$api('api.team', {
					page: that.currentPage,
					type: that.type
				}).then(res => {
					if (res.code === 1) {
						this.referrerInfo = res.data;
						let arr = res.data.list;
						that.teamList = [...that.teamList, ...arr];
						if (!that.teamList.length) {
							that.emptyData.show = true;
						}
					}
				});
			},
			jump(path, parmas) {
				this.$Router.push({
					path: path,
					query: parmas
				});
			},
			invite() {
				this.jump('pages/public/poster/index', {
					posterType: 'user'
				})
			}


		}
	};
</script>

<style lang="scss">
	// 重写
	.cu-custom .cu-bar {
		color: #ffffff !important;
	}

	// 头部卡片
	.head_box {

		background: url($IMG_URL+'/imgs/group/bgc.png') no-repeat;
		background-size: 100% auto;
		// height: 308rpx;
		padding-bottom: 138rpx;
		position: relative;
		.people {
			width: 100%;
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 33rpx;
			text-align: center;
		}

		.roughlyKk {
			position: absolute;
			left: 0;
			bottom: -89rpx;
			width: 100%;
			height: 193rpx;
			padding: 0rpx 30rpx;

			.roughly {
				height: 193rpx;
				width: 100%;
				background-color: #FFFFFF;
				border-radius: 20rpx;
				padding: 26rpx 83rpx 29rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.separate {
					width: 1rpx;
					height: 60rpx;
					background: #D8D8D8;
				}

				.rughNumberKk {
					display: flex;
					align-items: center;
					flex-direction: column;

					.numberTop {
						font-size: 70rpx;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #FF2900;
						line-height: 98rpx;
					}

					.numberbottom {
						font-size: 30rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #333333;
						line-height: 42rpx;
					}
				}
			}

		}

	}

	// 列表
	.List {
		margin: 118rpx 30rpx 0rpx;
		height: 907rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.tableKk {
			height: 110rpx;
			width: 100%;
			padding: 0rpx 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #EEEEEE;
			;

			.tableOne {
				display: flex;
				flex-direction: column;
				align-items: center;

				.choseText {
					font-size: 30rpx;
				}

				.choseTexted {
					font-weight: bold;
					color: #FF2900;
				}

				.choseTextbe {
					font-weight: 400;
					color: #9DA0A5;
				}

				.choes {
					width: 140rpx;
					height: 10rpx;
					border-radius: 5rpx;
				}

				.choesed {
					background: linear-gradient(221deg, #FD7D1A 0%, #FA470B 100%);
					opacity: 0.2;
					position: relative;
					top: -10rpx;
				}

				.choesbe {
					background: #fff;
				}
			}
		}

		.listUl {
			width: 100%;
			flex: 1;
			overflow: hidden;

			.foot-pad {
				height: 131rpx;
			}

			.scroll-Y {
				height: 100%;
				width: 100%;
			}

			.listLI {
				display: flex;
				align-items: center;
				padding: 40rpx 30rpx 0 40rpx;
			}

			.listImng {
				width: 96rpx;
				height: 96rpx;
				background: #D8D8D8;
				margin-right: 16rpx;
				border-radius: 50%;
			}

			.time {
				font-size: 28rpx;
				color: #909399;
			}

			.contantKk {
				flex: 1;

				.header {
					display: flex;
					align-items: center;

					.username {
						max-width: 150rpx;
						font-size: 32rpx;
						font-weight: bold;
						color: #333333;
					}

					.userLevel {
						margin-left: 20rpx;
						font-size: 22rpx;
						background: url($IMG_URL+'/imgs/group/teamIcon.png') no-repeat;
						box-sizing: 100% 100%;
						height: 42rpx;
						line-height: 42rpx;
						padding: 0 10rpx;
						border-radius: 4px;
						overflow: hidden;
						color: #A5700F;
						text-shadow: 0rpx 4rpx 2rpx #FFE79F;
					}

					.userClass {
						width: 58rpx;
						height: 30rpx;
						background: #FFFFFF;
						margin-left: 16rpx;
						// border-radius: 20px;
					}
				}

				.boderm {
					height: 33rpx;
					font-size: 28rpx;
					color: #909399;
					margin-top: 10rpx;
				}
			}
		}
	}

	// 底部按钮
	.btnKk {
		width: 100%;
		height: 131rpx;
		background: #ffffff;
		position: fixed;
		bottom: 0;
		left: 0;
		padding: 21rpx 32rpx;
		// border-top: 1rpx solid #EBEBEB;

		.btn {
			width: 686rpx;
			height: 90rpx;
			background: linear-gradient(180deg, #FF4800 0%, #FF2400 100%);
			border-radius: 45rpx;
			font-size: 32rpx;
			font-weight: bold;
			color: #FFFFFF;
			line-height: 90rpx;
			text-align: center;
		}
	}

	// 没有数据
	.noneData {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 80rpx;
	}

	.noneIMg {
		width: 540rpx;
		height: 290rpx;
	}

	.noneText {
		font-size: 26rpx;
		color: #999;
		margin-top: 81rpx;
	}
</style>
