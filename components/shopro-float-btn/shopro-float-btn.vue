<template>
	<view v-if="floatList && floatList.length" class="shopro-float-btn">
		<view :class="{ 'btn-mark': showBtnList }" cathctouchmove @tap="hideBtnModal"></view>
		<button class="cu-btn wechat-btn" @tap="onBtn">
			<image class="wechat_img" :src="floatList.length == 1 ? floatList[0].btnimage : floatData.image" mode="widthFix"></image>
		</button>
		<view :class="showBtnList ? 'float--active' : 'float-list-box'">
			<view class="btn-img-box" style="margin-top: 43rpx;"  v-for="item in floatList" :key="item.btnimage">
			<!-- #ifdef MP-WEIXIN -->
				<button class="server btn-item " :plain="true" hover-class="none" type="default" open-type="contact" bindcontact="handleContact" v-if="item.path == '/pages/public/kefu/index'">
					<image class="btn-img" :src="item.btnimage" mode="aspectFill"></image>
					<!-- <view class="btn-name1">{{ item.name }}</view> -->
					<view v-if='item.name.length == 2' class="btn-name1 btn-name2">{{ item.name }}</view>
					<view v-if='item.name.length == 3' class="btn-name1 btn-name3">{{ item.name }}</view>
					<view v-if='item.name.length == 4' class="btn-name1 btn-name4">{{ item.name }}</view>
				</button>
				<view class="btn-item" v-else @tap="onBtnItem(item)">
					<image class="btn-img" :src="item.btnimage" mode="aspectFill"></image>
					<view v-if='item.name.length == 2' class="btn-name btn-name2">{{ item.name }}</view>
					<view v-if='item.name.length == 3' class="btn-name btn-name3">{{ item.name }}</view>
					<view v-if='item.name.length == 4' class="btn-name btn-name4">{{ item.name }}</view>
				</view>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<view class="btn-item" @tap="onBtnItem(item)">
					<image class="btn-img" :src="item.btnimage" mode="aspectFill"></image>
					<view class="btn-name">{{ item.name }}</view>
				</view>
				<!-- #endif -->
			</view>
			<view class="activeSj"></view>
		</view>
		<view class="cu-modal" :class="{ show: showModal }" cathctouchmove @tap="hideModal" v-if="showModal">
			<view class="cu-dialog" @tap.stop style="background: none;overflow: visible;">
				<view class="img-box">
					<view class="img-wrap"><image class="modal-img" :src="modalImg" mode="widthFix" @tap="saveImage(modalImg)"></image></view>
					<text class="cuIcon-roundclose" @tap="hideModal"></text>
				</view>
			</view>
		</view>
		
		<view class="hideCanvasView" v-if="showModal">
			<canvas class="hideCanvas" canvas-id="goods_poster" :style="{ width: (poster.width || 1) + 'px', height: (poster.height || 1) + 'px' }"></canvas>
		</view>
		
	</view>
</template>

<script>
/**
 * 悬浮按钮，悬浮菜单。全局通用，数据为vuex初始化导入。
 * @property {Array} floatList - 悬浮按钮菜单数据列表
 */
import _app from '@/common/utils/QS-SharePoster/app.js';
import { getSharePoster } from '@/common/utils/QS-SharePoster/QS-SharePoster.js';
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
export default {
	components: {},
	data() {
		return {
			showModal: false,
			showBtnList: false,
			modalImg: '',
			showBtn: false,
			poster: {},
			canvasId: 'goods_poster',
			saveImagePath:''
		};
	},
	props: {},
	computed: {
		...mapState({
			template: state => state.init.templateData['float-button']
		}),
		floatData() {
			if (this.template) {
				return this.template[0].content;
			}
		},
		// 当前页面路径
		currentPath() {
			let pages = getCurrentPages();
			let currPage = null;
			if (pages.length) {
				currPage = pages[pages.length - 1].route;
			}
			return '/' + currPage;
		},
		// 悬浮按钮数据列表
		floatList() {
			if (this.floatData) {
				let arr = this.floatData.list.filter(item => {
					return item.page.includes(this.currentPath);
				});
				return arr;
			}
		}
	},
	created() {
	},
	methods: {
		async shareFc(bgImgUrl) {
			let that = this;
			try {
				// console.log('准备生成:' + new Date());
				const d = await getSharePoster({
					_this: this, //若在组件中使用 必传
					// type: 'goodsPoster',
					backgroundImage: that.$tools.checkImgHttp(bgImgUrl), //接口返回的背景图
					formData: {
						//访问接口获取背景图携带自定义数据
					},
					posterCanvasId: this.canvasId, //canvasId
					delayTimeScale: 20, //延时系数
					drawDelayTime: 500, //draw延时时间
					/* background: {
							width: 1080,
							height: 1920,
							backgroundColor: '#666'
						}, */
					drawArray: ({ bgObj, type, bgScale }) => {
						
						const dx = bgObj.width * 0.3;
						const fontSize = bgObj.width * 0.042;
						const lineHeight = bgObj.height * 0.04;
						//可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
						return new Promise((rs, rj) => {
							rs([
							]);
						});
					},
					setCanvasWH: ({ bgObj, type, bgScale }) => {
						// 为动态设置画布宽高的方法，
						this.poster = bgObj;
					}
				});
				console.log('海报生成成功, 时间:' + new Date() + '， 临时路径: ' + d.poster.tempFilePath);
				this.saveImagePath =  d.poster.tempFilePath
				this.saveImageCan()
			} catch (e) {
				_app.hideLoading();
				_app.showToast(JSON.stringify(e));
				// console.log(JSON.stringify(e));
			}
		},
		hideModal() {
			this.showModal = false;
			this.showBtnList = false;
		},
		hideBtnModal() {
			this.showBtnList = false;
		},
		// 如果悬浮按钮数据为一条，按钮图片为唯一菜单项图片和标题
		onBtnItem(item) {
			if (item.style == 2) {
				this.$tools.routerTo(item.path);
				this.showModal = false;
				this.showBtnList = false;
			} else {
				this.modalImg = item.image;
				this.showModal = true;
				// this.shareFc(item.image)
			}
		},
		// 保存图片
		async saveImage(){
			this.shareFc(this.modalImg)
		},
		async saveImageCan() {
			let that = this;
			let platform = uni.getStorageSync('platform');
			let checkPermission = await that.$tools.checkAppAlbum();
			if (platform === 'wxOfficialAccount') {
				that.$tools.toast('长按图片保存');
			} else if (checkPermission) {
				uni.saveImageToPhotosAlbum({
					filePath: that.saveImagePath,
					success: res => {
						that.$tools.toast('保存成功');
					},
					fail: err => {
						that.$tools.toast('保存失败');
					}
				});
			}
		},
		onBtn() {
			if (this.floatList.length == 1) {
				this.modalImg = this.floatList[0].image;
				this.floatList[0].style == 2 ? this.$tools.routerTo(this.floatList[0].path) : (this.showModal = true);
			} else {
				this.showBtnList = !this.showBtnList;
			}
		}
	}
};
</script>

<style lang="scss">
	.hideCanvasView {
		position: relative;
	}
	
	.hideCanvas {
		position: fixed;
		top: -99999upx;
		left: -99999upx;
		z-index: -99999;
	}
	
.btn-mark {
	z-index: -1;
	position: fixed;
	width: 100%;
	height: 100%;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	background: rgba(#000, 0.4);
}
.cu-modal {
	z-index: 999999;
}
.shopro-float-btn {
	position: fixed;
	bottom: 200rpx;
	right: 54rpx;
	z-index: 888;
	.float--active {
		position: absolute;
		bottom: 90rpx;
		right: -24rpx;
		transform: scale(1);
		transition: all 0.2s linear;
		// width: 222rpx;
		// width: 273rpx;
		border-radius: 15rpx;
		background: #FFFFFF;
		margin-bottom: 50rpx;
	}
	.float-list-box {
		position: absolute;
		bottom: 0;
		left: 10rpx;
		transform: scale(0);
		transform-origin: bottom;
		opacity: 0;
		transition: all 0.2s linear;
	}
	.server{
		    background: none;
		    border: none !important;
		    // line-height: 1;
		    padding: 0;
		.btn-img {
			// background-color: #ccc;
			width: 54rpx;
			height: 54rpx;
		}
	}
	.btn-item {
		margin-bottom: 52rpx;
		display: flex;
		align-items: center;
		.btn-img {
			width: 54rpx;
			height: 54rpx;
			margin-left: 42rpx;
			margin-right: 20rpx;
		}
		.btn-name {
			font-size: 30rpx;
			color: #141414;
			font-weight: 400;
		}
		.btn-name2{width: 110rpx;}
		.btn-name3{width: 140rpx;}
		.btn-name4{width: 160rpx;}
		.btn-name1{
			font-size: 30rpx;
			color: #141414;
			font-weight: 400;
			display: flex;
		}
	}
	.activeSj{
		position: absolute;
		z-index: 2;
		bottom: -14rpx;
		right: 61rpx;
		-webkit-transform: translateX(-50%);
		transform: translateX(-50%);
		width: 28rpx;
		height: 28rpx;
		background: #FFFFFF;
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
		-webkit-transform-origin: center;
		transform-origin: center;
		border-radius: 0 0 10rpx 10rpx;
	}

	.wechat-btn {
		// background: #ccc;
		box-shadow: 0px 0px 20px 4px rgba(199, 199, 199, 0.22);
		border-radius: 50%;
		background: none;
		padding: 0;
		.wechat_img {
			width: 102rpx;
			height: 102rpx;
		}
	}
}

.cu-dialog {
	width: 610rpx;
}
.img-box {
	position: relative;
	.modal-img {
		width: 100%;
	}
	.cuIcon-roundclose {
		position: absolute;
		left: 50%;
		transform: translate(-50%);
		bottom: -80rpx;
		color: #fff;
		font-size: 60rpx;
		z-index: 99;
	}
}
</style>
