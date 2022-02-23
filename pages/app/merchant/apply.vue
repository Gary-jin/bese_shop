<!-- 门店入驻 -->
<template>
	<view class=" ">
		<!-- 标题栏 -->
		<view class="head-box">
		</view>
		<!-- 表单 -->
		<view class="apply-form ">
			<view class="conFrome">
				<view class="conUi">
					<view class="conLi flex align-center haveBoder">
						<view class="titleLeft">
							您的姓名
						</view>
						<view class="flex-sub">
							<input class="inp" type="text"
								placeholder-style="color:#C1C1C1; line-height: 44rpx; font-size:32rpx;"
								placeholder="请输入姓名" v-model="model.realname" />
						</view>
					</view>

					<view class="conLi flex align-center">
						<view class="titleLeft">
							手机号码
						</view>
						<view class="flex-sub">
							<input class="inp" type="number" maxlength="11"
								placeholder-style="color:#C1C1C1; line-height: 44rpx; font-size:32rpx;"
								placeholder="请输入手机号码" v-model="model.phone" />
						</view>
					</view>
				</view>




				<view class="conUi">
					<view class="conLi flex align-center haveBoder">
						<view class="titleLeft">
							门店名称
						</view>
						<view class="flex-sub">
							<input class="inp" type="text"
								placeholder-style="color:#C1C1C1; line-height: 44rpx; font-size:32rpx;"
								placeholder="请输入门店名称" v-model="model.name" />
						</view>
					</view>

					<view class="conLitow flex ">
						<view class="titleLeft">
							门店图片
						</view>
						<view class="flex-sub">
							<view class="img-box">
								<view class="preview-box" v-for="(item, index) in model.images" :key="index">
									<image class="preview-img" :src="item" mode="aspectFill"></image>
									<text class="cuIcon-close" @tap="DelImg(index,'shop')"></text>
								</view>
								<view class="choose-img x-c" @tap="onChooseImg('shop')" v-if="model.images.length < 1">
									<image :src="$IMG_URL+'/imgs/user/choseImg.png'" mode=""></image>
								</view>
							</view>
						</view>
					</view>
				</view>



				<view class="conUi">
					<view class="conLi flex align-center haveBoder" @click="onSelect('time','animationDataOne')">
						<view class="titleLeft">
							营业时间
						</view>
						<view class="flex-sub">
							<input class="inp" type="text"
								placeholder-style="color:#C1C1C1;  line-height: 44rpx; font-size:32rpx;"
								placeholder="请选择营业时间" disabled v-model="model.openhours" />
						</view>
						<image class="selet" :animation="animationDataOne" :src="$IMG_URL+'/imgs/user/selet.png'"></image>
					</view>

					<view class="conLi flex align-center" @click="onSelect('week','animationDataOne')">
						<view class="titleLeft">
							营业天数
						</view>
						<view class="flex-sub">
							<input class="inp" type="text"
								placeholder-style="color:#C1C1C1; line-height: 44rpx; font-size:32rpx;"
								placeholder="请选择营业天数" disabled v-model="model.weeks" />
						</view>
						<image class="selet" :animation="animationDataTwo" :src="$IMG_URL+'/imgs/user/selet.png'"
							mode=""></image>
					</view>
				</view>


				<view class="conUi">
					<view class="conLi flex align-center haveBoder" @click="pickerShow = true">
						<view class="titleLeft">
							所在地区
						</view>
						<view class="flex-sub">
							<input class="inp" type="text"
								placeholder-style="color:#C1C1C1; line-height: 44rpx; font-size:32rpx;"
								placeholder="所在地区" disabled v-model="model.area" />
						</view>
						<image class="selet" :animation="animationDataThree" :src="$IMG_URL+'/imgs/user/selet.png'"
							mode=""></image>
					</view>

					<view class="conLi flex align-center" @click="chooseLocation">
						<view class="titleLeft">
							详细地址
						</view>
						<view class="flex-sub">
							<input class="inp" type="text"
								placeholder-style="color:#C1C1C1; line-height: 44rpx; font-size:32rpx;"
								placeholder="点击获取详细地址" disabled v-model="model.address" />
						</view>
						<image class="atinon" :src="$IMG_URL+'/imgs/user/atinon.png'" mode=""></image>
					</view>
				</view>


				<view class="conUi">
					<view class="conLithree flex ">
						<view class="titleLeft">
							营业执照
						</view>
						<view class="flex-sub">
							<view class="img-box">
								<view class="preview-box" v-for="(item, index) in model.business_license" :key="index">
									<image class="preview-img" :src="item" mode="aspectFill"></image>
									<text class="cuIcon-close" @tap="DelImg(index,'buse')"></text>
								</view>
								<view class="choose-img x-c" @tap="onChooseImg('buse')"
									v-if="model.business_license.length < 1">
									<image :src="$IMG_URL+'/imgs/user/choseImg.png'" mode=""></image>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="agreement x-c">
					<!-- <u-checkbox v-model="model.agreement" activeColor="#FA470B" shape="circle"></u-checkbox> -->
					<image class="nodeImg"  @click="onAgreement()" v-if="model.agreement"  :src="$IMG_URL+'/imgs/user/roundsele.png'" mode=""></image>
					<view class="nodeChose"  @click="onAgreement()" v-else></view>
					<view class="agreement-text" @tap="jump('/pages/public/richtext', { id: protocolId })">
						勾选代表同意申请<text>分销商协议</text></view>
				</view>
				<view class="x-c">
					<button class="cu-btn save-btn" @tap="onSubmit" :disabled="isFormEnd">
						<text v-if="isFormEnd" class="cuIcon-loading2 cuIconfont-spin"></text>
						确认提交
					</button>
				</view>
			</view>
		</view>
		<u-select :mode="selectMode" :list="selectList" v-model="selectShow" @confirm="selectConfirm"></u-select>
		<u-picker mode="region" v-model="pickerShow" @confirm="regionConfirm"></u-picker>
		<view class="cu-modal bottom-modal" :class="{ show: showWeeksModal }" @tap="hideWeekModal">
			<view class="cu-dialog" @tap.stop>
				<view class="cu-bar bg-white">
					<view class="action text-blue" @tap="hideWeekModal">取消</view>
					<view class="action text-green" @tap="saveWeekModal">确定</view>
				</view>
				<view class="grid col-3 padding-sm">
					<view v-for="(item, index) in weekcheckbox" class="padding-xs" :key="index">
						<button class="cu-btn orange mini block" :class="item.checked ? 'bg-green' : 'line-green'"
							@tap="onSelectWeek(index)">{{ item.name }}</button>
					</view>
				</view>
			</view>
		</view>
		<!-- 权限验证 -->
		<view class="auth-box cu-modal" :class="{ show: showNotice }">
			<view class="notice-box cu-dialog">
				<view class="img-wrap">
					<image class="notice-img" :src="authNotice.img" mode=""></image>
				</view>
				<view class="notice-title">{{ authNotice.title }}</view>
				<view class="notice-detail">{{ authNotice.detail }}</view>
				<button class="cu-btn notice-btn" @tap="onAuthBtn(authNotice.btnPath)">{{ authNotice.btnText }}</button>
				<button class="cu-btn back-btn" @tap="$Router.back()">返回</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		API_URL
	} from '@/env.js';
	// #ifdef APP-PLUS
	import permision from '@/common/permission.js';
	// #endif
	var animation
	export default {
		components: {},
		data() {
			return {
				upLoadUrl: API_URL,
				showNotice: false,
				protocolId: 0,
				showWeeksModal: false,
				isFormEnd: false,
				weekcheckbox: [{
						value: '1',
						name: '周一',
						checked: false
					},

					{
						value: '2',
						name: '周二',
						checked: false
					},
					{
						value: '3',
						name: '周三',
						checked: false
					},
					{
						value: '4',
						name: '周四',
						checked: false
					},
					{
						value: '5',
						name: '周五',
						checked: false
					},
					{
						value: '6',
						name: '周六',
						checked: false
					},
					{
						value: '7',
						name: '周日',
						checked: false
					}
				],
				authNotice: {
					//权限提示内容
					// img: this.$IMG_URL + '/imgs/commission/auth_check.png',
					// title: '正在审核中！',
					// detail: '请耐心等候',
					// btnText: '知道了'
				},
				// 表单
				errorType: ['message'],
				pickerShow: false,
				selectShow: false,
				selectMode: 'mutil-column', // single-column, mutil-column, mutil-column-auto
				selectType: '',
				selectList: [],
				labelStyle: {
					'font-size': '28rpx',
					'font-weight': '500',
					color: '#333'
				},
				placeholderStyle: 'font-size: 28rpx;color:#c4c4c4;',
				model: {
					name: '', //门店名称
					phone: '', //手机号
					realname: '', //真实姓名
					openhours: '', //营业时间
					openweeks: '', //营业周期
					weeks: '',
					area: '',
					area_id: '', //行政区域ID
					address: '', //门店地址
					latitude: '', //纬度
					longitude: '', //京都
					images: [], //门店图片
					business_license: [], //营业执照图片
					images_original: [],
					fileImages: [],
					agreement: false
				},
				rules: {
					name: [{
						required: true,
						message: '请输入门店名称',
						trigger: ['change', 'blur']
					}],
					realname: [{
						required: true,
						message: '请输入真实姓名',
						trigger: ['change', 'blur']
					}],
					phone: [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur']
						},
						{
							validator: (rule, value, callback) => {
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change', 'blur']
						}
					],
					openhours: [{
						required: true,
						message: '请选择营业时间',
						trigger: ['change', 'blur']
					}],
					weeks: [{
						required: true,
						message: '请选择营业天数',
						trigger: ['change', 'blur']
					}],
					area: [{
						required: true,
						message: '请选择所在地区',
						trigger: ['change', 'blur']
					}],
					address: [{
						required: true,
						message: '请输入详细地址',
						trigger: ['change', 'blur']
					}],

				},
				animationDataOne: '',
				animationDataTwo: '',
				animationDataThree: '',
			};
		},
		computed: {
			selectWorkerTime() {
				let mArr = [];
				for (let i = 0; i <= 24; i++) {
					let t = String(i).padStart(2, '0');
					mArr.push({
						value: `${t}:00`,
						label: `${t}:00`
					}, {
						value: `${t}:30`,
						label: `${t}:30`
					});
				}
				mArr.pop();
				return [mArr, mArr];
			}
		},
		onLoad() {
			this.getStoreInfo();
			animation = uni.createAnimation({
				timingFunction: 'ease'
			})
			this.animationDataOne = animation
			this.animationDataTwo = animation
			this.animationDataThree = animation
			this.animation = animation
		},
		watch:{
			selectShow(e){
				if(e){
					this.animation.rotate(180).step()
					this.animationDataOne = this.animation.export()
				}else{
					this.animation.rotate(0).step()
					this.animationDataOne = this.animation.export()
				}
			},
			showWeeksModal(e){
				if(e){
					this.animation.rotate(180).step()
					this.animationDataTwo = this.animation.export()
				}else{
					this.animation.rotate(0).step()
					this.animationDataTwo = this.animation.export()
				}
			},
			pickerShow(e){
				if(e){
					this.animation.rotate(180).step()
					this.animationDataThree = this.animation.export()
				}else{
					this.animation.rotate(0).step()
					this.animationDataThree = this.animation.export()
				e}
			}
			
		},
		onReady() {
		},
		methods: {
			// 选择星期
			saveWeekModal() {
				this.showWeeksModal = false;
				let arr = [];
				let arr2 = [];
				this.weekcheckbox.forEach(item => {
					if (item.checked) {
						arr.push(item.value);
						arr2.push(item.name);
					}
				});
				this.model.openweeks = arr.join(',');
				this.model.weeks = arr2.join(',');
			},
			hideWeekModal() {
				this.showWeeksModal = false;
			},
			onSelectWeek(index) {
				this.weekcheckbox[index].checked = !this.weekcheckbox[index].checked;
			},

			// 弹窗按钮
			onAuthBtn(path) {
				if (path) {
					this.$Router.push({
						path: path
					});
				}
				this.showNotice = false;
			},

			// 上传图片成功
			uploadSuccess(e, type) {
				switch (type) {
					case 'storeImg':
						this.model.images = [];
						e.forEach(item => {
							this.model.images.push(item.response.data.url);
						});
						break;
					default:
						return;
				}
			},

			// 移除图片
			uploadRemove(index, type) {
				switch (type) {
					case 'storeImg':
						this.model.images.splice(index, 1);
						break;
					default:
						return;
				}
			},
			// app权限判断
			async checkPermission() {
				let status = permision.isIOS ? await permision.requestIOS('location') : await permision.requestAndroid(
					['android.permission.ACCESS_FINE_LOCATION']);
				return status;
			},

			// 地址选择
			async chooseLocation() {
				// #ifdef APP-PLUS
				let status = await this.checkPermission();
				if (status !== 1) {
					uni.showModal({
						content: '需要定位权限',
						confirmText: '设置',
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					});
					return;
				}
				// #endif
				uni.chooseLocation({
					success: res => {
						this.model.address = res.address;
						this.model.latitude = res.latitude;
						this.model.longitude = res.longitude;
					},
					fail: err => {
						console.log(err);
					}
				});
			},

			onSelect(type,animat) {
				this.selectType = type;
				switch (type) {
					case 'time':
						this.selectShow = true;
						this.selectMode = 'mutil-column';
						this.selectList = this.selectWorkerTime;
						break;
					case 'week':
						this.showWeeksModal = true;
						break;
					default:
						return;
				}
			},

			// 选择时间
			selectConfirm(e) {
				switch (this.selectType) {
					case 'time':
						this.model.openhours = '';
						e.map((val, index) => {
							this.model.openhours += this.model.openhours == '' ? val.label : ' - ' + val.label;
						});
						break;
					default:
						return;
				}
			},

			// 选择地区回调
			regionConfirm(e) {
				this.model.area = e.province.label + '-' + e.city.label + '-' + e.area.label;
				this.model.area_id = e.area.value;
			},

			// 勾选同意
			onAgreement(e) {
				this.model.agreement = !this.model.agreement;
			},

			// 门店详情
			getStoreInfo() {
				let that = this;
				that.$api('store.shopInfo').then(res => {
					if (res.code === 1) {
						res.data.apply && this.authStatus(res.data.apply,res.msg);
						this.protocolId = res.data.config.protocol;
					}
				});
			},

			// 初始化model
			initModel() {
				// 构建星期
				let weeksArr = this.model.openweeks.split(',');
				let weekTextArr = [];
				this.weekcheckbox.forEach(item => {
					if (weeksArr.includes(item.value)) {
						weekTextArr.push(item.name);
						item.checked = true;
					}
				});
				this.model.weeks = weekTextArr.join(',');
				// 构建省市区
				if (this.model.province_name) {
					this.model.area = `${this.model.province_name}-${this.model.city_name}-${this.model.area_name}`;
				}
				if (this.model.images) {
					this.model.images.forEach(item => {
						this.model.fileImages.push({
							url: item
						});
					});
				}
				// 协议
				this.$set(this.model, 'agreement', false);
			},

			// 状态鉴权
			authStatus(data,msg) {
				switch (String(data.status)) {
					case '0':
						this.showNotice = true;
						this.model = {
							...this.model,
							...data
						};
						this.initModel();
						this.authNotice = {
							img: this.$IMG_URL + '/imgs/commission/auth_check.png',
							title: '正在审核中',
							detail: msg,
							btnText: '修改信息',
							btnPath: ''
						};
						break;
					case '-1':
						this.showNotice = true;
						this.model = {
							...this.model,
							...data
						};
						this.initModel();
						this.authNotice = {
							img: this.$IMG_URL + '/imgs/commission/auth_reject.png',
							title: '您的申请已被驳回！',
							detail: data.msg,
							btnText: '重新申请',
							btnPath: ''
						};
						break;
					case '1':
						this.showNotice = false;
						break;

					default:
				}
			},

			// 申请门店
			applyStore() {
				let that = this;
				this.isFormEnd = false;
				that.$api('store.apply', that.model).then(res => {
					this.isFormEnd = true;
					if (res.code === 1) {
						//  #ifdef MP-WEIXIN
						this.$store.dispatch('getMessageIds', 'storeApply');
						//  #endif
						uni.showToast({
							title: res.msg,
							success: () => {
								that.$Router.back();
							}
						});
					}
				});
			},

			// 提交
			onSubmit() {
				let that = this;
				if (!this.model.agreement) {
					this.$u.toast('请勾选协议');
					return;
				} else {
					if (this.model.realname == '') {
						this.$u.toast('请输入您的姓名');
						return;
					}
					if (this.model.phone == '') {
						this.$u.toast('请输入您的号码');
						return;
					}
					if (this.model.name == '') {
						this.$u.toast('请输入门店名称');
						return;
					}
					if (this.model.images.length < 1) {
						this.$u.toast('请上传门店图片');
						return;
					}
					if (this.model.openhours == '') {
						this.$u.toast('请选择营业时间');
						return;
					}
					if (this.model.weeks == '') {
						this.$u.toast('请选择营业天数');
						return;
					}
					if (this.model.area == '') {
						this.$u.toast('请选择所在地区');
						return;
					}
					if (this.model.address == '') {
						this.$u.toast('请选择详细地址');
						return;
					}
					if (this.model.business_license.length < 1) {
						this.$u.toast('请上传营业执照');
						return;
					}
				}
				this.applyStore()
			},
			jump(path, parmas) {
				this.$Router.push({
					path: path,
					query: parmas
				});
			},
			// 选择图片
			async onChooseImg(type) {
				let that = this;
				// #ifdef APP-VUE
				// #endif
				that.$tools.chooseImage(1).then(res => {
					res.forEach(img => {
						that.$tools.uploadImage('index/upload', img).then(res => {
							if (type == 'shop') {
								this.model.images.push(res.full_url);
							} else {
								this.model.business_license.push(res.full_url);
							}
							this.isFormEnd = false
						});
					});
				});
			},
			DelImg(index, type) {
				uni.showModal({
					title: '删除照片',
					content: '确定要删除这张照片么？',
					cancelText: '取消',
					confirmText: '删除',
					success: res => {
						if (res.confirm) {
							if (type == 'shop') {
								this.model.images.splice(index, 1);
							} else {
								this.model.business_license.splice(index, 1);
							}
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	// .apply-commission-wrap {
	.head-box {
		background: url($IMG_URL+'/imgs/user/sh_shop_apply_head.png') no-repeat;
		background-size: 100% auto;
		width: 750rpx;
		height: 339rpx;
	}

	// }

	// 表单
	.apply-form {
		width: 750rpx;
		position: relative;

		.conFrome {
			padding: 0rpx 30rpx;
			position: absolute;
			left: 0;
			top: -94rpx;
		}

		.conUi {
			background: #FFFFFF;
			box-shadow: 0px 2rpx 4rpx 0px rgba(231, 231, 231, 0.5);
			border-radius: 18rpx;
			padding: 0rpx 30rpx;
			margin-bottom: 20rpx;

			//设置字体颜色为红色
			.conLi {
				height: 120rpx;

				.titleLeft {
					width: 170rpx;
					font-size: 32rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: bold;
					color: #333333;
					line-height: 44rpx;
				}

			}

			.conLitow {
				height: 204rpx;

				.titleLeft {
					margin-top: 38rpx;
					width: 170rpx;
					font-size: 32rrpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: bold;
					color: #333333;
					line-height: 44rrpx;
				}
			}

			.conLithree {
				height: 241rpx;

				.titleLeft {
					margin-top: 38rpx;
					width: 170rpx;
					font-size: 32rrpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: bold;
					color: #333333;
					line-height: 44rrpx;
				}
			}

			.haveBoder {
				border-bottom: 1px solid #EEEEEE;
			}

		}

		.agreement {
			margin-top: 73rpx;
			margin-bottom: 74rpx;
			padding-top: 1px;

			.agreement-text {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #505050;
				line-height: 40rpx;

				text {
					text-decoration: underline;
					color: #FA470B;
				}
			}
		}

		.save-btn {
			width: 686rpx;
			height: 90rpx;
			background: linear-gradient(180deg, #FF4800 0%, #FF2400 100%);
			border-radius: 45rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 45rpx;
			text-shadow: 0px 1rpx 0px #CA2600;
			margin-bottom: 55rpx;
		}
	}

	.auth-box {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: fixed;
		z-index: 99;

		.notice-box {
			position: fixed;
			z-index: 1111;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background-color: #fff;
			top: 50%;
			left: 50%;
			width: 612rpx;
			min-height: 658rpx;
			background: #ffffff;
			padding: 30rpx;
			border-radius: 20rpx;
			transform: translate(-50%, -50%);

			.img-wrap {
				margin-top: 50rpx;
				.notice-img {
					width: 410rpx;
					height: 300rpx;
				}
			}

			.notice-title {
				font-size: 32rpx;
				color: #656667;
				margin-bottom: 20rpx;
			}

			.notice-detail {
				font-size: 28rpx;
				font-weight: 400;
				color: #999999;
				line-height: 36rpx;
				margin-bottom: 50rpx;
			}

			.notice-btn {
				width: 468rpx;
				height: 88rpx;
				background: linear-gradient(180deg, #FF4800 0%, #FF2400 100%);
				border-radius: 44rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #ffffff;
				margin-bottom: 45rpx;
			}

			.back-btn {
				width: 492rpx;
				height: 70rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #FF3B00;
				background: none;
			}
		}
	}


	.img-box {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 20rpx;

		.choose-img,
		.preview-box {
			width: 160rpx;
			height: 160rpx;
			border-radius: 10rpx;
			background: rgba(249, 250, 251, 1);
			// border: 1rpx solid rgba(223, 223, 223, 1);
			margin-right: 25rpx;
			margin-bottom: 25rpx;
			position: relative;

			&:nth-child(5n) {
				margin-right: 0;
			}

			.cuIcon-cameraadd {
				font-size: 50rpx;
				color: #dfdfdf;
			}

			image {
				width: 100%;
				height: 100%;
			}

			.cuIcon-close {
				background: linear-gradient(90deg, rgba(216, 159, 100, 1), rgba(235, 193, 150, 1));
				border-radius: 50%;
				width: 40rpx;
				line-height: 40rpx;
				color: #fff;
				text-align: center;
				position: absolute;
				top: -10rpx;
				right: -10rpx;
			}
		}
	}

	.selet {
		width: 34rpx;
		height: 24rpx;
	}

	.atinon {
		width: 25rpx;
		height: 28rpx;
	}

	.nodeChose{
		width: 36rpx;
		height: 36rpx;
		border: 2rpx solid #CFD2D4;
		margin-right: 12rpx;
		border-radius: 50%;
	}
	.nodeImg{
		width: 36rpx;
		height: 36rpx;
		margin-right: 12rpx;
	}
</style>
