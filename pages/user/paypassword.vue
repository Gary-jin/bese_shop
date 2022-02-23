<!-- 修改手机号 -->
<template>
	<view class="bank-wrap">
		<view class="telpahon">
			当前手机号为：{{phone}}
		</view>
	
		<view class="form-box">
			<label>
				<view class="form-item flex align-center justify-between">
					<view class="item-title">支付密码</view>
					<input class="item-input flex-sub" type="number" v-model="password" placeholder="请输入6位数字密码" placeholder-class="pl-input" maxlength="6"/>
				</view>
			</label>  
			<label>
				<view class="form-item flex align-center justify-between">
					<view class="item-title">确认密码</view>
					<input class="item-input flex-sub" type="number" v-model="newpass" placeholder="请确认6位数字密码" placeholder-class="pl-input" maxlength="6"/>
				</view>
			</label>
			<view class="form-item flex align-center justify-between">
				<label>
					<view class="x-f">
						<view class="item-title">验证码</view>
						<input class="item-input flex-sub" type="text" v-model="code.value" placeholder="请输入验证码" placeholder-class="pl-input" />
					</view>
				</label>
				<button class="cu-btn code-btn" :disabled="code.status" @tap.stop="getCode">{{ code.text }}</button>
			</view>
		</view>

		<view class="btn-box flex align-center justify-center"><button class="cu-btn confirem-btn" @tap="editChangemobile">提交</button></view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			code: {
				text: '获取验证码',
				status: false,
				value: ''
			},
			phone: '',
			password:"",
			newpass:""
		};
	},
	computed: {},
	onLoad() {
		this.phone = this.$Route.query.phone;
	},
	methods: {
		//修改手机号
		editChangemobile() {
			let that = this;
			if(that.password !== that.newpass){
				uni.showToast({
				    title: '两次密码输入不一致',
				    duration: 2000,
					icon:'none'
				});
			}else{
			that.$api('api.resetpaypwd', {
				pwd: that.password,
				repwd:that.newpass,
				captcha: that.code.value
			}).then(res => {
				if (res.code === 1) {
					that.$tools.toast('修改支付成功');
					setTimeout(() => {
						that.$Router.back();
					}, 500);
				}
			});
			}
		},

		// 获取短信
		getCode() {
			let that = this;
			that.code.status = true;
			let countdown = 60;
			that.$api('sms.send', {
				mobile: that.phone,
				event: 'resetpaypwd'
			}).then(res => {
				if (res.code === 1) {
					uni.showToast({
					    title: res.msg,
					    duration: 2000,
						icon:'none'
					});
					that.code.text = countdown + '秒';
					that.code.status = true;
					let timer = setInterval(() => {
						if (countdown > 0) {
							that.code.text = countdown - 1 + '秒';
							countdown--;
						} else {
							clearInterval(timer);
							that.code.text = '获取验证码';
							that.code.status = false;
						}
					}, 1000);
				} else {
					that.code.status = false;
				}
			});
		}
	}
};
</script>

<style lang="scss">
	.telpahon{
		padding:40rpx 30rpx ;
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #848383;
	}
.form-box {
	background: #fff;
	.form-item {
		height: 103rpx;
		border-bottom: 1rpx solid #eee;
		padding: 0 25rpx;
		position: relative;
		.item-title {
			// color: #333;
			// font-size: 28rpx;
			// font-weight: 600;
			width: 128rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
			line-height: 44rpx;
		}
		.item-input {
			font-size: 28rpx;
			color: #333;
			padding-left: 20rpx;
			width: 300rpx;
		}
		.pl-input {
			color: #999;
		}
		.code-btn {
			background: none;
			font-size: 30rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FF2900;
			line-height: 44rpx;
			padding-left:40rpx ;
			border-left: 1px solid #EEEEEE;
			// font-size: 28rpx;
			// color: #a8700d;
			// position: absolute;
			// top: 50%;
			// padding: 0;
			// transform: translateY(-50%);
			// right: 30rpx;
		}
	}
}
.notice {
	color: #999;
	font-size: 24rpx;
	padding: 0 25rpx;
	height: 90rpx;
}
.btn-box {
	margin-top: 60rpx;
	.confirem-btn {
		width: 686rpx;
		height: 90rpx;
		background: linear-gradient(180deg, #FF4800 0%, #FF2400 100%);
		border-radius: 11rpx;
		font-size: 32rpx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #FFFFFF;
		line-height: 45rpx;
		text-shadow: 0px 1px 0px #CA2600;
	}
}
</style>
