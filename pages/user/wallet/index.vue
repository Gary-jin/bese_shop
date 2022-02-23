<!-- 我的钱包 -->
<template>
	<view class="contant">
		<view class="head_box">
			<cu-custom :isBack="true" bgColor="bgWhite">
				<block slot="backText"></block>
				<block slot="content">我的钱包</block>
			</cu-custom>
			<view class="card-box ">
				<view class="left y-start">
					<text class="title" v-if="appcfgdata.withdraw.withdraw_switch==1">可提现</text>
					<text class="title" v-else>余额</text>
					<text class="money-num">{{ userinfo.money }}</text>
					<button class="cu-btn cash-btn" @tap="onWithdrawals('walte')"
						v-if="appcfgdata.withdraw.withdraw_switch==1">提现</button>
				</view>
				<view class="borromKk">
					<view class="botmOnces" @tap="jump('/pages/user/wallet/bind-bank')">
						<text>绑定银行卡</text>
						<image class="botmim" :src="$IMG_URL+'/imgs/user/bankcard.png'" mode=""></image>
					</view>
					<view class="screen"></view>
					<view class="botmOnces" @tap="onWithdrawals('rules')">
						<text>提现规则</text>
						<image class="botmtm" :src="$IMG_URL+'/imgs/user/amazed.png'" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		<view class="content_box">
			<view class="title">
				收支明细
			</view>
			<view class="tableKk">
				<view class="tableKLi" v-for="(item,index) in tablist" :key="index"
					:class="tabIndex == item.id ? 'bg-white' : 'nochose'" @tap="choseType(item.id)">
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="">
			<!-- 没有数据 -->
			<view class="nodetaKk y-f" v-if="walletList.length == 0">
				<image class="nodeImg" :src="$IMG_URL+'/imgs/empty/empty_groupon.png'" mode="widthFix"></image>
				<text class="nodeT">暂无相关数据~</text>
			</view>
			
			<view class="wallet-list " v-for="item in walletList" :key="item.id">
				<view class="x-bc wallter-Li">
					<view class="liLife">
						<view class="liTitle one-t">
							{{ item.type_name }}{{ item.title ? '-' + item.title : '' }}
						</view>
						<view class="liTime">
							{{ tools.dateFormat('YYYY-mm-dd HH:MM', new Date(item.createtime * 1000)) }}
						</view>
					</view>
					<view class="liNum">
						<text v-if="item.wallet >= 0" class="add">+{{ item.wallet }}</text>
						<text v-else class="minus">{{ item.wallet }}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 更多 -->
		<u-loadmore v-if="walletList.length" height="80rpx" :status="loadStatus" icon-type="flower" color="#ccc" />
		<view class="foot_box"></view>
		<shopro-modal v-model="showModal" style="z-index: 88;">
			<block slot="modalContent">
				<view class="modal-box" v-if="type == 'walte'">
					<view class="modal-head">
						<image class="modal-head-img" :src="$IMG_URL + '/imgs/modal_bg1.png'" mode=""></image>
					</view>
					<view class="inpBox">
						<text class="modal-head-title">提现金额</text>
						<input class="inp" type="number" @input="onInput" v-model="money" placeholder="在此输入提现金额"
						placeholder-class="pl-inp" />
					</view>
					<button class="cu-btn post-btn" @tap="postMoney">提现</button>
				</view>

				<view class="modal-box" v-else>
					<view class="modal-head">
						<image class="modal-head-img" :src="$IMG_URL + '/imgs/modal_bg.png'" mode=""></image>
						<!-- <text class="modal-head-title">提现规则</text> -->
					</view>
					<view class="ruleadd" v-if="appcfgdata.withdraw.withdraw_switch==1">
						{{ rules }}
					</view>
					<button class="cu-btn post-btn" @tap="postMoney">确定</button>
				</view>
			</block>
		</shopro-modal>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex';
	export default {
		components: {},
		data() {
			return {
				showModal: false,
				money: '',
				rules: '',
				tabIndex: 'all',
				tablist: [{
						"name": '全部',
						"id": 'all',
					},
					{
						"name": '收入',
						"id": 'add',
					},
					{
						"name": '支出',
						"id": 'reduce',
					}
				],
				tools: this.$tools,
				isBottom: false,
				walletList: [],
				type: {
					income: '收入',
					withdraw: '提现',
					consume: '消费',
					transfer: '余额互转'
				},
				loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
				currentPage: 1,
				lastPage: 1,
				type: '', //判断是提现还是提现规则
				emptyData: {
					img: this.$IMG_URL + '/imgs/empty/empty_groupon.png',
					tip: '暂无此类拼团商品，更多拼团好货等着你噢~'
				},
			};
		},

		computed: {
			...mapState({
				userinfo: state => state.user.userInfo,
				appcfgdata: state => state.init.appcfgData,
			})
		},
		onLoad() {
			this.getUserInfo();
			this.getWalletLog();
			this.getApplyRules();
		},
		onReachBottom() {
			if (this.currentPage < this.lastPage) {
				this.currentPage += 1;
				this.getWalletLog();
			}
		},
		methods: {
			...mapActions(['getUserInfo']),
			jump(path, parmas) {
				this.$Router.push({
					path: path,
					query: parmas
				});
			},
			// 钱包明细
			getWalletLog() {
				let that = this;
				that.loadStatus = 'loading';
				that.$api('user_wallet_log', {
					wallet_type: 'money',
					page: that.currentPage,
					status: that.tabIndex
				}).then(res => {
					if (res.code === 1) {
						that.walletList = [...that.walletList, ...res.data.data];
						that.lastPage = res.data.last_page;
						if (that.currentPage < res.data.last_page) {
							that.loadStatus = 'loadmore';
						} else {
							that.loadStatus = 'nomore';
						}
					}
				});
			},
			postMoney() {
				if (this.type == 'walte') {
					this.apply();
				}
				this.showModal = false;
			},
			onInput() {
				if (+this.userinfo.money > 0 && +this.userinfo.money < +this.money) {
					setTimeout(() => {
						this.money = this.userinfo.money;
					}, 0);
				}
			},
			// 提现
			apply() {
				let that = this;
				that.$api('user_wallet_apply.apply', {
					money: that.money
				}).then(res => {
					if (res.code === 1) {
						//  #ifdef MP-WEIXIN
						this.$store.dispatch('getMessageIds', 'wallet');
						//  #endif
						this.$tools.toast(res.msg);
						that.getUserInfo();
					}
				});
			},
			choseType(id) {
				this.tabIndex = id
				this.loadStatus = 'loadmore'
				this.currentPage = 1
				this.lastPage = 1
				this.walletList = []
				this.getWalletLog()
			},
			// 提现规则
			getApplyRules() {
				let that = this;
				that.$api('user_wallet_apply.rule').then(res => {
					if (res.code === 1) {
						that.rules = res.data;
					}
				});
			},
			onWithdrawals(type) {
				this.type = type
				if (type == 'walte') {
					if (this.userinfo.money <= 0) {
						this.$tools.toast('暂无可提现余额');
						return
					}
				}
				this.showModal = true;
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}
	.bgWhite{
		background: #FFFFFF;
	}
	// 提现弹窗
	.modal-box {
		background: #fff;
		width: 610rpx;
		margin: 0 auto;
		border-radius: 20rpx;
		overflow: hidden;

		.modal-head-img {
			width: 100%;
			height: 213rpx;
		}

		.ruleadd {
			color: #656667;
			padding: 52rpx 48rpx;
		}

		.inpBox{
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			margin: 73rpx 0;
			.modal-head-title {
				font-size: 30rpx;
				color: #656667;
				margin-left: 56rpx;
				margin-bottom: 15rpx;
			}
			.inp {
				width: 501rpx;
				height: 78rpx;
				border-bottom: 1rpx solid #EEEEEE;
				font-size: 58rpx;
				font-weight: bold;
				color: #333333;
				margin-left: 56rpx;
				text-align: left;
				.pl-inp {
					font-size: 28rpx;
					color: #bd9560;
					text-align: left;
				}
			}
		}

		.radio {
			width: 500rpx;
			padding: 0 50rpx;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(200, 150, 61, 1);
			margin-bottom: 20rpx;

			.radio-inp {
				transform: scale(0.7);
				margin-right: 10rpx;
			}
		}

		.post-btn {
			width: 492rpx;
			height: 70rpx;
			background: linear-gradient(180deg, #FF4800 0%, #FF2400 100%);
			border-radius: 35rpx;
			font-size: 28rpx;
			font-weight: 500;
			color:#FFFFFF;
			padding: 0;
			margin-bottom: 60rpx;
		}
	}

	.head_box {
		width: 750rpx;
		height: 480rpx;
		// background: linear-gradient(125deg, rgba(239, 196, 128, 1) 0%, rgba(248, 220, 165, 1) 100%);
		position: relative;

		.resale-bg {
			width: 750rpx;
			height: 64rpx;
			position: absolute;
			bottom: 0;
		}

		.card-box {
			width: 720rpx;
			height: 361rpx;
			padding: 60rpx 60rpx 60rpx 54rpx;
			background: url($IMG_URL+'/imgs/money_wallet_bg.png') no-repeat;
			background-size: 100% 100%;
			border-radius: 30rpx;
			overflow: hidden;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			// bottom: 30rpx;
			// z-index: 6;

			.left {
				display: flex;
				flex-direction: column;
				width: 100%;
				border-bottom: 1rpx solid rgba(249, 249, 249, 0.2);
				position: relative;
			}

			.cash-btn {
				width: 162rpx;
				height: 69rpx;
				background: linear-gradient(90deg, #FFE143 0%, #FFBF20 100%);
                box-shadow: 0rpx 2rpx 9rpx 0rpx rgba(196, 57, 15, 0.8), 1rpx 1rpx 3rpx 0rpx #FFF4D0 inset;
				border-radius: 38rpx;
				position: absolute;
				top: 15rpx;
				right: 0rpx;
				font-size: 34rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 48rpx;
			}

			.title {
				font-size: 32rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 45rpx;
			}

			.money-num {
				font-size: 66rpx;
				font-family: DINAlternate-Bold, DINAlternate;
				font-weight: bold;
				color: #FFFFFF;
				line-height: 77rpx;
				letter-spacing: 2rpx;
				margin: 13rpx 0rpx 40rpx;
			}

			.add {
				font-size: 22rpx;
				width: 400rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(230, 184, 115, 1);
				line-height: 26rpx;
			}

			.borromKk {
				display: flex;
				align-items: center;
				justify-content: space-around;
				padding-top: 30rpx;
                .screen{
					width: 1rpx;
					height: 50rpx;
					background: #F9F9F9;
					opacity: 0.2;
				}
				.botmOnces {
					display: flex;
					align-items: center;
					color: #FFFFFF;
					image {
						margin-left: 3px;
					}
				}

				.botmim {
					width: 33rpx;
					height: 29rpx;
				}

				.botmtm {
					width: 29rpx;
					height: 29rpx;
				}
			}
		}
	}

	.resale-list {
		height: 96rpx;
		background: #fff;
		padding: 0 30rpx 0 40rpx;
		border-bottom: 1rpx solid #dfdfdf;
		font-size: 28rpx;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);

		.cuicon {
			font-size: 40rpx;
			color: #666;
			margin-right: 30rpx;
		}
	}



	// 记录列表
	.content_box {
		padding: 0rpx 40rpx;
		margin-top: 65rpx;
		.title {
			font-size: 36rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #333333;
			line-height: 50rpx;
			letter-spacing: 1px;
		}

		.tableKk {
			width: 672rpx;
			height: 99rpx;
			background: #F5F6F7;
			border-radius: 10px;
			display: flex;
			align-items: center;
			padding: 12rpx;
			margin-top: 24rpx;

			.tableKLi {
				width: 226rpx;
				height: 75rpx;
				border-radius: 12rpx;
				line-height: 75rpx;
				text-align: center;
			}

			.bg-white {
				font-size: 32rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #333333;
				letter-spacing: 1px;
			}

			.nochose {
				font-size: 32rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #7B7C7D;
				letter-spacing: 1px;
			}
		}

	}


	// 明细列表

	.wallet-list {
		padding: 0rpx 40rpx;
		width: 100%;

		.wallter-Li {
			padding: 30rpx 0rpx;
			border-bottom: 1px solid #EEEEEE;

			.liLife {
				width: 450rpx;

				.liTitle {
					font-size: 32rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: bold;
					color: #333333;
					line-height: 45rpx;
					width: 100%;
				}

				.liTime {
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #909399;
					line-height: 37rpx;
					margin-top: 4rpx;
				}
			}

			.liNum {
				// margin-left: 40rpx;
			}

			.add {
				font-size: 32rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #FA470B;
				line-height: 45rpx;
			}

			.minus {
				font-size: 32rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #04AD4C;
				line-height: 45rpx;
			}
		}
	}

	.nodetaKk {
		width: 100%;
		padding-top: 50rpx;
		.nodeImg{
			width: 348rpx;
			height: 228rpx;
		}
		.nodeT{
			font-size: 26rpx;
			color: #999;
		}
	}
</style>
