<template>
	<view class="popup-box" >
		<view v-for="(p, index) in newPopupList" :key="index" v-if="p.style == 2">
			<view class="cu-modal" :class="{ show: showModal && popupCurrent === index }" cathctouchmove @tap="hideModal(p)">
				<view class="cu-dialog" @tap.stop="changePopup(p.path)" style="background: none;overflow: visible;">
					<view class="img-box">
						<image class="modal-img" :src="p.image" mode="widthFix"></image>
						<text class="cuIcon-roundclose" @tap.stop="hideModal(p)"></text>
					</view>
				</view>
			</view>
		</view>
		<view v-for="(p, index) in newPopupList" :key="index" v-if="p.style == 1 && fPopShow == newPopupList[0].path + 'yes' ">
			<view class="cu-modal" :class="{ show: showModal && popupCurrent === index }" cathctouchmove @tap="hideModal(p)">
				<view class="cu-dialog" @tap.stop="changePopup(p.path)" style="background: none;overflow: visible;">
					<view class="img-box">
						<image class="modal-img" :src="p.image" mode="widthFix"></image>
						<text class="cuIcon-roundclose" @tap.stop="hideModal(p)"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 广告模态框。连续弹窗和只弹一次。
 * @property {Object} newPopupList  - vuex 初始化传过来的数据
 */
import { mapMutations, mapActions, mapState } from 'vuex';
let timer = null;
export default {
	name: 'shoproNoticeModal',
	components: {},
	data() {
		return {
			popupCurrent: 0,
			showModal: true, 
			deltaT:0,
			fPopShow: uni.getStorageSync('fPop') , //是否是今天第一次 
		};
	},
	props: {},
	computed: {
		...mapState({
			templateData: state => state.init.templateData.popup,
			showLoginTip: state => state.user.showLoginTip,
			forceOauth: state => state.user.forceOauth  // 小程序对否登录。  true未登录
		}),
		popupData() {
			if (this.templateData) {
				return this.templateData[0].content;
			}
		},
		currentPath() {
			let pages = getCurrentPages();
			let currPage = null;
			if (pages.length) {
				currPage = pages[pages.length - 1].route;
			}
			return '/' + currPage;
		},
		newPopupList() {
			if (this.popupData) {
				let arr = this.popupData.list.filter(item => {
					return item.page.includes(this.currentPath);
				});
				return arr;
			}
		},
		nowPath(){
			if (this.popupData) {
				let arr = this.popupData.list.filter(item => {
					return item.page.includes(this.currentPath);
				});
				return arr;
			}
		},
	},
	created() {
		this.init()
	},
	methods: {
		init(){
			if (!this.forceOauth && this.newPopupList.length!=0) {
				let xx = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24*60*60*1000-1).getTime() //今天23:59:59的时间戳
				if (uni.getStorageSync('weeHours')){
					// 如果有
					this.isDay()
				} else {
					uni.setStorageSync('weeHours',xx)
					let that = this;
					setTimeout(()=>{
						that.isDay()
					},200)
				}					
			}			
		},
		//是否是当天
		isDay(){
			let nn = new Date().getTime() //现在的时间戳
			let xx = uni.getStorageSync('weeHours')
			this.deltaT = nn - xx 	// 今天凌晨到现在的时间戳
			console.log(this.deltaT,'weeHours',this.$u.timeFormat(xx , 'yyyy/mm/dd'),this.nowPath[0]['path'])
			
			if (this.deltaT < 0 ){ //今天
				// console.log( 'fPop', uni.getStorageSync(this.nowPath[0]['path']))
				if(uni.getStorageSync(this.nowPath[0]['path']) == this.nowPath[0]['path'] +'no' ){  // 不再是首次
					this.fPopShow = this.nowPath[0]['path'] + 'no'
				} else { //首次
					this.fPopShow = this.nowPath[0]['path'] + 'yes'
					uni.setStorageSync(this.nowPath[0]['path'],this.nowPath[0]['path'] + 'no')
				}
			} else { //明天
				let that = this;
				uni.removeStorageSync('weeHours')
				
				that.popupData.list.forEach(item => {
					uni.removeStorageSync(item.path)
					// console.log(item.path,uni.getStorageSync(item.path))
				})
				
				setTimeout(()=>{
					that.init()
				},300)
			}
			
			// console.log('fPopShow',this.fPopShow)
		},
		hideModal(p) {
			clearTimeout(timer);
			this.showModal = false;
			if (p.style == 2) {
				this.$store.commit('delPopup', this.currentPath);
			}
			
			timer = setTimeout(() => {
				this.popupCurrent += 1;
				this.showModal = true;
			}, 500);
			
			// uni.setStorageSync('homePpo',false)
		},
		changePopup(path) {
			this.$tools.routerTo(path, null);
		}
	}
};
</script>

<style lang="scss">
.modal-img {
	width: 610rpx;
}

.cu-modal {
	z-index: 10000;
}

.img-box {
	position: relative;

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
