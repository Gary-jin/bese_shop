<template>
	<view class="mb20">
		<view class="sh-userinfo-box" :style="{ backgroundColor: detail.color }">
			<image class="user-bg" :src="detail.image" mode=""></image>
			<view class="head-wrap">
				<view class="head-nav">
					<view class="use_head_box">
						<cu-custom bgColor="" :isBack="true">
							<block slot="content"><text class="nav-title">我的</text></block>
						</cu-custom>
					</view>
				</view>
				<view class="user-head x-bc">
					<view class="x-f">
						<!-- 微信小程序 -->
						<view class="info-box">
							<view class="head-img-wrap">
								<image class="head-img" @tap.stop="jump('/pages/user/info')"
									:src="userInfo.avatar || $IMG_URL + '/imgs/base_avatar.png'" mode="aspectFill">
								</image>
								<block v-if="platform !== 'H5'">
									<button v-if="platform === 'wxMiniProgram'" open-type="getUserInfo"
										@getuserinfo="refreshWechatUser" class="cu-btn refresh-btn x-c">
										<text class="cuIcon-refresh" :class="{ 'refresh-rotate': isRefresh }"></text>
									</button>
									<button v-if="platform === 'wxOfficialAccount'" @tap="refreshWechatUser"
										class="cu-btn refresh-btn x-c">
										<text class="cuIcon-refresh" :class="{ 'refresh-rotate': isRefresh }"></text>
									</button>
								</block>
							</view>
							<view class="head-userinfo">
								<text @tap.stop="jump('/pages/user/info')"
									class="user-name one-t">{{ userInfo.nickname || '请登录~' }}</text>
								<view class="tag-box " >
									<view class="grade-tag" v-if="userInfo.dealer">
										<text class="tag-title">{{userInfo.dealer}}</text>
									</view>
									<view class="grade-tag" v-if="userInfo.channel">
										<text class="tag-title">{{userInfo.channel}}</text>
									</view>
									
									<view class="grade-tag" v-if="userInfo.agent">
										<text class="tag-title">{{userInfo.agent}}</text>
									</view>
									
									<view class="grade-tag" v-if="userInfo.shareholder">
										<text class="tag-title">{{userInfo.shareholder}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="x-f">
						<button class="cu-btn code-btn" v-if="userInfo.avatar"
							@tap="jump('/pages/public/poster/index', { posterType: 'user' })">
							<text class="cuIcon-qr_code"></text>
						</button>
						<button v-if="userInfo.is_store" @tap="goStore" class="cu-btn merchant-btn">切换商家版</button>
					</view>
				</view>
				<!-- 资产卡片 -->
				<view class="assetCart">
					<view class="assetes" @tap="jump('/pages/user/wallet/index')">
						<view class="assetNumber">
							<text class="num">{{ userInfo.money || '0' }}</text>
							<text class="unit">元</text>
						</view>
						<view class="assetTitle">账户余额</view>
					</view>
					<view class="assetes" @tap="jump('/pages/user/wallet/score-balance')">
						<view class="assetNumber">
							<text class="num">{{ userInfo.score || '0' }}</text>
							<text class="unit">个</text>
						</view>
						<view class="assetTitle">积分</view>
					</view>

					<view class="assetes" @tap="jump('/pages/app/coupon/list',{id:1})">
						<view class="assetNumber">
							<text class="num">{{ userInfo.coupons_num || '0' }}</text>
							<text class="unit">张</text>
						</view>
						<view class="assetTitle">优惠劵</view>
					</view>

				</view>
				<!-- 我的钱包 -->
				<view class="walletKk">
					<view class="walletConent">
						<view class="walletBlack" @tap="jump('/pages/user/wallet/index')">
							<text>我的钱包</text>
							<button class="cu-btn pay-btn">查看</button>
						</view>
						<image :src="$IMG_URL + '/imgs/user/userbgc.png'" mode="widthFix" class="bgc"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 绑定手机 -->
		<view class="binding" v-if="!userInfo.mobile && userInfo.nickname">
			<view class="notice-box x-bc pad">
				<view class="notice-detail one-t">点击绑定手机号，确保账户安全</view>
				<button class="bindPhone cu-btn" type="default" open-type="getPhoneNumber"
					@getphonenumber="decryptPhoneNumber">去绑定</button>
			</view>
		</view>
		<!-- 绑定微信 -->
		<view class="binding" v-if="false">
			<view class="notice-box x-bc pad" @tap="jump('/pages/user/edit-phone', { fromType: 'bind' })">
				<view class="notice-detail one-t">绑定微信用户！</view>
				<button class="bindPhone cu-btn">去绑定</button>
			</view>
		</view>
		<!-- 经销商 -->
		<view class="dealerBox" v-if="userInfo.team_banner"  @tap="jump('/pages/user/dealer/index')">
			<image class="dealerImg" :src="userInfo.team_banner" mode="widthFix"></image>
		</view>
		
	</view>
</template>

<script>
	/**
	 * 自定义之个人信息
	 * @property {Object} detail - 个人信息
	 */
	import {
		mapMutations,
		mapActions,
		mapState
	} from 'vuex';
	import Wechat from './../../../common/wechat/wechat';
	export default {
		components: {},
		data() {
			return {
				platform: uni.getStorageSync('platform'), //当前平台。
				isRefresh: false //更新
			};
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo  || {}
			})
		},
		props: {
			detail: {
				type: Object,
				default: null
			}
		},
		methods: {
			...mapActions(['getUserInfo']),
			decryptPhoneNumber(e) {
				// console.log(e)
				let that = this;
				uni.checkSession({
					success(res) {
						that.bandPhoneNumber(e);
					},
					fail() {
						uni.login({
							success: (res) => {
								if (res.errMsg == 'login:ok') {
									new Wechat().getWxMiniProgramSessionKey();
									setTimeout(() => {
										that.bandPhoneNumber(e);
									}, 500)
								}
							}
						})
					}
				})
			},
			bandPhoneNumber(e) {
				let that = this;
				let params = {
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv,
					session_key: uni.getStorageSync('session_key')
				}
				that.$api('api.gitPhone', params).then(res => {
					if (res.code == 1) {
						//  #ifdef MP-WEIXIN
						that.getUserInfo();
						that.$tools.toast('绑定成功~');
						//  #endif
						//  #ifndef MP-WEIXIN
						that.jump('/pages/user/edit-phone', {
							fromType: 'bind',
							phoneNumber: res.data.phoneNumber
						});
						//  #endif
					} else {
						that.$tools.toast('请稍后再试~');
					}
				})
			},
			jump(path, query) {
				this.$Router.push({
					path: path,
					query: query
				});
			},
			// 跳转门店
			goStore() {
				if (this.userInfo.store_id) {
					uni.setStorageSync('storeId', this.userInfo.store_id);
					this.jump('/pages/app/merchant/index', {
						storeId: this.userInfo.store_id
					});
				} else {
					if (uni.getStorageSync('storeId')) {
						this.jump('/pages/app/merchant/index');
					} else {
						this.jump('/pages/app/merchant/list');
					}
				}
				//  #ifdef MP-WEIXIN
				this.$store.dispatch('getMessageIds', 'store');
				//  #endif
			},
			// 跳转客服
			onService() {
				this.$Router.push('/pages/public/kefu/index');
			},
			// 更新信息
			onRefresh() {
				const that = this;
				that.isRefresh = true;
				setTimeout(() => {
					that.isRefresh = false;
				}, 200);
			},
			refreshWechatUser(e) {
				this.onRefresh();
				if (this.platform === 'wxOfficialAccount') {
					let wechat = new Wechat();
					wechat.login();
				} else if (this.platform === 'wxMiniProgram') {
					this.$store.commit('FORCE_OAUTH', true);
				}
			}
		}
	};
</script>

<style lang="scss">
	.sh-userinfo-box {
		position: relative;
		height: calc(var(--status-bar-height) + 430rpx);

		.user-bg {
			width: 100%;
			height: calc(var(--status-bar-height) + 430rpx);
		}

		.head-wrap {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			width: 100%;
			height: 100%;
			z-index: 9;
			top: 0;

			.nav-title {
				font-size: 38rpx;
				font-family: PingFang SC;
				font-weight: 600;
				color: #fff;
				position: relative;
			}
		}

		.user-head {
			width: 100%;
			padding-top: 15rpx;

			.info-box {
				display: flex;
				padding-left: 30rpx;

				.head-img-wrap {
					position: relative;

					.refresh-btn {
						position: absolute;
						padding: 0;
						background: none;
						width: 34rpx;
						height: 34rpx;
						border-radius: 50%;
						background: #c9912c;
						top: 0;
						right: 20rpx;

						.cuIcon-refresh {
							color: #fff;
							font-size: 24rpx;
						}

						.refresh-rotate {
							transform: rotate(360deg);
							transition: all 0.2s;
						}
					}
				}

				.head-userinfo {
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					
				}

				.head-img {
					border: 4rpx solid rgba(255, 255, 255, 0.78);
					width: 74rpx;
					height: 74rpx;
					border-radius: 50%;
					background: #ccc;
					margin-right: 25rpx;
					overflow: hidden;
				}
				.user-name {
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #fff;
					// line-height: 30rpx;
					width: 180rpx;
				}
			}

			.tag-box {
				margin-top: 3rpx;
				.grade-tag {
					display: inline-block;
					align-items: center;
					margin-right: 10rpx;
					padding: 5rpx 10rpx;
					border-radius: 21rpx;
					background: linear-gradient(to bottom, #75675B 0, #301501 100%);
					font-size: 20rpx;
					color: #FFE3BE;
					font-weight: 500;
				}
			}

			.code-btn {
				background: none;

				.cuIcon-qr_code {
					font-size: 50rpx;
					color: #fff;
				}
			}

			.merchant-btn {
				padding: 0;
				width: 160rpx;
				height: 46rpx;
				background: rgba(255, 255, 255, 1);
				border-radius: 23rpx 0px 0px 23rpx;
				font-size: 20rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(168, 112, 13, 1);
				white-space: nowrap;
			}
		}

		.wallet {
			font-size: 20rpx;
			padding-left: 140rpx;

			.money {
				margin-right: 40rpx;
			}
		}
	}

	// 资产卡片
	.assetCart {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0rpx 82rpx;
		margin-top: 32rpx;

		.assetes {
			display: flex;
			align-items: center;
			flex-direction: column;

			.assetNumber {
				display: flex;
				align-items: flex-end;

				.num {
					font-size: 38rpx;
					font-family: DINAlternate-Bold, DINAlternate;
					font-weight: bold;
					color: #FFFFFF;
					line-height: 45rpx;
				}

				.unit {
					font-size: 20rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 28rpx;
				}
			}

			.assetTitle {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 33rpx;
				margin-top: 5rpx;
			}
		}
	}

	// 我的钱包
	.walletKk {
		width: 100%;
		height: 90rpx;
		position: absolute;
		left: 0;
		bottom: 0;

		.walletConent {
			position: relative;
			width: 100%;
			height: 100%;
			padding: 0rpx 30rpx;
			overflow: hidden;

			.walletBlack {
				width: 100%;
				height: 100%;
				background: linear-gradient(109deg, #4B443C 0%, #17130E 100%);
				border-top-left-radius: 18rpx;
				border-top-right-radius: 18rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0rpx 38rpx;

				text {
					font-size: 32rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #FFFFFF;
					line-height: 45rpx;
				}

				.pay-btn {
					width: 117rpx;
					height: 52rpx;
					background: linear-gradient(108deg, #FFE7CF 0%, #FFD3A9 100%);
					box-shadow: 0px 2px 6px 0px rgba(211, 136, 62, 0.53);
					border-radius: 35rpx;
					padding: 0;
					margin-left: 14rpx;
					font-size: 28rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #B67538;
					line-height: 40rpx;
				}
			}

			.bgc {
				width: 750rpx;
				position: absolute;
				left: 0;
				bottom: -23rpx;
			}
		}
	}

	// 绑定微信公众号
	.binding {
		padding: 21rpx 20rpx 0rpx;
		width: 750rpx;
	}

	.notice-box {
		width: 100%;
		height: 74rpx;
		background: #FFF9F3;
		border: 2px solid rgba(255, 228, 200, 1);
		// border-image: linear-gradient(180deg, rgba(255, 228, 200, 1), rgba(255, 215, 175, 1)) 2 2;
		border-radius: 13rpx;

		.notice-detail {
			font-size: 26rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #98521A;
			line-height: 37rpx;
		}

		.bindPhone {
			// width: 135rpx;
			// height: 52rpx;
			// background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			// border-radius: 26rpx;
			// padding: 0;
			// font-size: 26rpx;
			// font-family: PingFang SC;
			// font-weight: 500;
			// color: rgba(255, 255, 255, 1);
			background-color: #FFF9F3;
			font-size: 26rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #98521A;
			line-height: 37rpx;
			text-decoration: underline;
		}
	}
	
	.dealerBox{
		padding: 21rpx 20rpx 0rpx;
		width: 750rpx;
		.dealerImg{
			width: 100%;
			border-radius: 20rpx;
			overflow: hidden;
			display: block;
		}
	}
</style>
