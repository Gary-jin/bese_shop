<template>
	<view>
		<view class="cu-custom " :style="[{ height: CustomBar + 'px' }]">
			<view class="cu-bar " :style="style"
				:class="[bgImage != '' ? 'none-bg text-white bg-img' : '', bgColor,fixed==''?'fixed':'']">
				<view class="action" v-if="isBack"  @tap="BackPage">
					<text class=""
						:class="tabbarFlage ? '' : 'cuIcon-back cu-back text-bold text-lg'"></text>
					<slot name="backText"></slot>
				</view>
				<view class="con">
					<slot name="content"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar
			};
		},
		name: 'cu-custom',
		computed: {
			...mapState({
				templateData: state => state.init.templateData.tabbar,
			}),
			tabbarData() {

				if (this.templateData) {
					return this.templateData[0].content;
				}
			},
			tabbarFlage() {
				if (this.tabbarData) {
					let currPage = this.$Route.path;
					var result = this.tabbarData.list.some(item => {
						// console.log(currPage+"当前路径");
						// console.log(pathed+"判断页面");
						var pathed
						var num = item.path.indexOf("?")
						if (num>-1) {
							pathed = item.path.slice(0, num)
						} else {
							pathed = item.path
						}
						// console.log(pathed+"处理过的判断页面");
						if (pathed == currPage) {

							return true
						}
					})

                    return result
				}
			},
			style() {
				var StatusBar = this.StatusBar;
				var CustomBar = this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style;
			}
		},
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			showBackIcon: {
				type: Boolean,
				default: true
			},
			bgImage: {
				type: String,
				default: ''
			},
			fixed:{
				type: String,
				default: ''
			}
		},
		methods: {
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	};
</script>

<style>
	.con {
		width: calc(100% - 352rpx);
	}

	.cuIcon-back {
		font-size: 36rpx !important;
	}
</style>
