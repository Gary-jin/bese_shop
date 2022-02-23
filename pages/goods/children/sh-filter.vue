<template>
	<view class="filter-box">
		<view class="mask cu-modal" :class="{ show: showSel }" style="z-index: 8;" @tap="hideModal"></view>
		<view class="mask cu-modal" :class="{ show: showIcon }" style="z-index: 8;" @tap="hideModal"></view>
		<view class="navbar">
			<view class="sel-box flex flex-direction" v-show="showSel">
				<view class="sel-item" @tap="onSel(0)" :class="{ 'sel-active': defaultOrder === 0 && filterIndex === 0 }">综合推荐</view>
				<view class="sel-item" @tap="onSel(1)" :class="{ 'sel-active': defaultOrder === 1 && filterIndex === 0 }">扩展自定义排序</view>
			</view>
			<view class="sel-box sel-box2 flex flex-direction" v-show="showIcon">
				<view class="sel-item" @tap="iconSel(1)" ><text :class="{ 'sel-active': iconNum ==  1}" class="iconf lg text-gray cuIcon-list"></text></view>
				<view class="sel-item" @tap="iconSel(2)" ><text :class="{ 'sel-active': iconNum ==  2}" class="iconf lg text-gray cuIcon-album"></text></view>
				<view class="sel-item" @tap="iconSel(3)" ><text :class="{ 'sel-active': iconNum ==  3}" class="iconf lg text-gray cuIcon-apps"></text></view>
				<view class="sel-item" @tap="iconSel(4)" ><text :class="{ 'sel-active': iconNum ==  4}" class="iconf lg text-gray cuIcon-cascades"></text></view>
			</view>
			<view class="nav-item y-f" :class="{ current: filterIndex === 0 }" @tap="tabClick(0)">
				<view class="title-box flex align-center">
					<text class="filter-title">{{ defaultOrder === 1 ? '自定义' : '综合推荐' }}</text>
					<view class="p-box"><text :class="{ active: filterIndex === 0 }" class="yticon cuIcon-fold xia"></text></view>
				</view>
				<view class="line" :class="{ 'line-active': filterIndex === 0 }"></view>
			</view>
			<view class="nav-item y-f" :class="{ current: filterIndex === 1 }" @tap="tabClick(1)">
				<view class="title-box x-f"><text class="filter-title">销量</text></view>
				<view class="line" :class="{ 'line-active': filterIndex === 1 }"></view>
			</view>
			<view class="nav-item y-f" :class="{ current: filterIndex === 2 }" @tap="tabClick(2)">
				<view class="title-box x-f">
					<text class="filter-title">价格</text>
					<view class="p-box">
						<text :class="{ active: priceOrder === 1 && filterIndex === 2 }" class="yticon cuIcon-fold"></text>
						<text :class="{ active: priceOrder === 2 && filterIndex === 2 }" class="yticon cuIcon-fold xia"></text>
					</view>
				</view>
				<view class="line" :class="{ 'line-active': filterIndex === 2 }"></view>
			</view>
			<view class="nav-item y-f" :class="{ current: filterIndex === 3 }" @tap="tabClick(3)">
				<view class="title-box"><text class="filter-title">新品优先</text></view>
				<view class="line" :class="{ 'line-active': filterIndex === 3 }"></view>
			</view>
			<view class="nav-item y-f iconSty" @tap="iconTab()">
				<text class="iconf lg text-gray cuIcon-list " v-if="iconNum == 1"></text>
				<text class="iconf lg text-gray cuIcon-album " v-if="iconNum == 2"></text>
				<text class="iconf lg text-gray cuIcon-apps " v-if="iconNum == 3"></text>
				<text class="iconf lg text-gray cuIcon-cascades " v-if="iconNum == 4"></text>

			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 商品筛选组件
	 * 
	 */
import { mapState, mapActions, mapMutations } from 'vuex';
export default {
	components: {},
	props: {},
	data() {
		return {
			filterIndex: 0,
			showSel: false, //综合选择
			defaultOrder: 0, //综合
			priceOrder: 0, //价格
			salesOrder: 0, //销量
			newProdcutOrder: 0, //新品优先
			showIcon:false,
			iconNum: 3
		};
	},
	computed: {
		filterData() {
			const data = {
				defaultOrder: this.defaultOrder,
				priceOrder: this.priceOrder,
				salesOrder: this.salesOrder,
				newProdcutOrder: this.newProdcutOrder
			};
			return data;
		}
	},
	onLoad() {},
	methods: {
		//筛选
		tabClick(index) {
			this.filterIndex = index;
			this.showIcon = false
			if (index === 0) {
				this.showSel = !this.showSel;
			} else {
				this.showSel = false;
			}
			if (index === 1) {
				this.salesOrder = 1;
			} else {
				this.salesOrder = 0;
			}
			if (index === 2) {
				this.priceOrder = this.priceOrder === 1 ? 2 : 1;
			} else {
				this.priceOrder = 0;
			}
			if (index === 3) {
				this.newProdcutOrder = 1;
			} else {
				this.newProdcutOrder = 0;
			}
			this.$emit('change', this.filterData);
		},
		onSel(dot) {
			this.defaultOrder = dot;
			this.$emit('change', this.filterData);
			this.showSel = false;
		},
		hideModal() {
			this.showSel = false;
			this.showIcon = false
		},
		iconTab() {
			this.showSel = false
			this.showIcon = !this.showIcon
		},
		iconSel(val) {
			this.iconNum = val
			uni.$emit('goodsListStyle',{val:val})
		}
	}
};
</script>

<style lang="scss">
.sel-box {
	position: absolute;
	width: 750rpx;
	height: 140rpx;
	background: rgba(246, 246, 246, 1);
	border-radius: 0px 0px 20rpx 20rpx;
	z-index: 999;
	left: 50%;
	transform: translateX(-50%);
	bottom: -138rpx;
	transition: all ease-out 0.2s;
	.sel-item {
		color: #333;
		padding: 20rpx 40rpx 0;
		font-size: 24rpx;
		font-weight: 500;
	}
	.sel-active {
		color: #d5a65a;
		font-size: 26rpx;
		font-weight: 600;
	}
}
.sel-box2{
	height: 230rpx !important;
	bottom: -231rpx !important;
	.sel-item{
		.sel-active {
		color: #d5a65a !important;
		font-size: 26rpx;
		font-weight: 600;
		}
	}
}
.filter-box {
	width: 750rpx;
}
.navbar {
	display: flex;
	width: 750rpx;
	height: 95rpx;
	background: #fff;
	border-bottom: 1upx solid #e6e6e6;
	border-top: 1upx solid #e6e6e6;
	position: relative;
	z-index: 999;
	.iconSty{
		flex:0 !important;
		.iconf{
			font-size: 26rpx;
			margin-right: 20rpx;
			color: #000;
		}
	}
	.nav-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-size: 30rpx;
		position: relative;
		.filter-title {
			font-size: 28rpx;
			color: #333;
			font-weight: 600;
		}
		.line {
			width: 110rpx;
			height: 4rpx;
			background: transparent;
			position: absolute;
			bottom: 0;
			z-index: 2;
		}

		.line-active {
			background: rgba(213, 166, 90, 1);
		}

		.p-box {
			display: flex;
			flex-direction: column;

			.yticon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30rpx;
				line-height: 1;
				height: 14rpx;
				margin-left: 6upx;
				font-size: 22upx;
				font-weight: 600;
				color: #c4c4c4;
				padding: 0rpx 4rpx;
			}

			.xia {
				transform: scaleY(-1);
			}
		}
	}
}

.current {
	color: #d5a65a;
}
.active {
	color: #d5a65a !important;
}
</style>
