<template>
	<view class="bodyBox">
		<view class="bodyBoxCore">
			<!--  -->
			<view class="coreBox">
				<view class="itemBox itemBoxB">
					<view class="itemTit">商品名称</view>
					<view class="itemRig">
						<input type="text" v-model="dicData.title" placeholder-class="plInput" placeholder="请输入名称" />
					</view>
				</view>
				<view class="itemBox">
					<view class="itemTit">所属分类</view>
					<view class="itemRig">
						<!-- <input type="text" value="" placeholder-class="plInput" placeholder="请选择商品分类" /> -->
						<picker @change="bindChangeClase" :value="claseIndex" :range="claseText">
							<text>{{claseText[claseIndex]}}</text>
						</picker>
						<u-icon name="arrow-right" color="#C1C1C1" size="28"></u-icon>
					</view>
				</view>
			</view>
			<!--  -->
			<view class="coreBox coreBoxTop">
				<view class="itemBox itemBoxB">
					<view class="itemTit">宝贝价格</view>
					<view class="itemRig">
						<input class="cred" type="number" v-model="dicData.price" placeholder-class="plInput" placeholder="请输入宝贝价格" />
						<text class="" style="color: #333333;">元</text>
					</view>
				</view>
			</view>
			<!--  -->
			<view class="coreBox coreBoxTop">
				<view class="itemBox itemBoxB">
					<view class="itemTit">填写运费</view>
					<view class="itemRig">
						<input type="number" v-model="dicData.express_fee" placeholder-class="plInput" placeholder="请填写运费（0元为包邮）" />
					</view>
				</view>
				<view class="itemBox">
					<view class="itemTit">配送方式</view>
					<view class="itemRig">
						<u-radio-group v-model="dicData.dispatch_type" @change="radioGroupChange">
							<u-radio 
								v-for="(item, index) in psList" :key="index" 
								:name="item.id"
								:disabled="item.disabled"
								active-color="#FB530E"
							>
								{{item.name}}
							</u-radio>
						</u-radio-group>
					</view>
				</view>
			</view>
			<!--  -->
			<view class="coreBox coreBoxTop">
				<view class="itemBox itemBoxB">
					<view class="itemTit">限购数量</view>
					<view class="itemRig">
						<input type="number" v-model="dicData.limit_buy" placeholder-class="plInput" placeholder="当前每次限购1，0为不限购" />
					</view>
				</view>
				<view class="itemBox">
					<view class="itemTit">库存数量</view>
					<view class="itemRig">
						<input type="number" v-model="dicData.stock" placeholder-class="plInput" placeholder="请输入库存数量" />
					</view>
				</view>
			</view>
			<!--  -->
			<!-- <view class="coreBox coreBoxTop">
				<view class="itemBox">
					<view class="itemTit">商品地址</view>
					<view class="itemRig">
						<input type="text" v-model="address" placeholder-class="plInput" placeholder="请填写地址" />
						<u-icon @click="chooseLocation" name="map-fill" color="#C1C1C1" size="28"></u-icon>
					</view>
				</view>
			</view> -->
			<view class="coreBox coreBoxTop">
				<view class="itemBox">
					<view class="itemTit">商品地址</view>
					<view class="itemRig">
						<text class="cityBox one-t" @tap="selCity">{{area_text}}</text>
					</view>
				</view>
			</view>
			<!--  -->
			<view class="coreBox coreBoxTop">
				<view class="itemBox">
					<view class="itemTit">是否全新</view>
					<view class="itemRig">
						<u-radio-group v-model="dicData.is_new" @change="radioGroupChange2">
							<u-radio 
								v-for="(item, index) in isList" :key="index" 
								:name="item.id"
								:disabled="item.disabled"
								active-color="#FB530E"
							>
								{{item.name}}
							</u-radio>
						</u-radio-group>
					</view>
				</view>
			</view>
			<!--  -->
			<view class="coreBox coreBoxTop">
				<view class="itemBox1">
					<textarea v-model="dicData.description" placeholder-style="color:#C1C1C1"  placeholder="描述一下您要卖的宝贝吧~"/>
				</view>
				<view class="img-box">
					<view class="preview-box" v-for="(item, index) in imgList" :key="index">
						<image class="preview-img" :src="item" mode="aspectFill"></image>
						<text class="cuIcon-close" @tap="DelImg(index)"></text>
					</view>
					<view class="choose-img x-c" @tap="onChooseImg" v-if="imgList.length < 9">
						<image class="preview-img" :src="$IMG_URL + '/imgs/trueque/upimg.png' " mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<!--  -->
			<view class="coreBox coreBox2">
				<button class="cu-btn btnYao" @tap="onJoin">{{type?'确认编辑':'确认发布'}}</button>
			</view>
			<!--  -->
			<shopro-picker ref="shoproCityPicker" :pickerValueDefault="cityPickerValueDefault" @onCancel="onCancel" @onConfirm="onConfirm"></shopro-picker>
		</view>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>
<script>
	import {mapState} from 'vuex';
	// #ifdef APP-PLUS
	import permision from '@/common/permission.js';
	// #endif
	export default {
		computed: {
			...mapState({
				initData: state => state.init.initData
			})
		},
		components:{
		},
		data() {
			return {
				psList: [
					{
						id:'express',
						name: '快递配送',
						disabled: false
					},
					{	
						id: 'selfetch',
						name: '上门自提',
						disabled: false
					}
				],
				isList: [
					{
						id:1,
						name: '是',
						disabled: false
					},
					{	
						id:0,
						name: '否',
						disabled: false
					}
				],
				psvalue:1,
				isvalue:0,
				desvalue:'',
				imgList:[],
				imgListStr:[],
				
				clase:[], //分类数组
				claseText:[],//分类数组文字
				claseIndex:0,
				claseVal:'',
				
				address:'',
				cityPickerValueDefault: [0, 0, 0], //城市
				dicData:{
					 id:'', //商品id，编辑时必填
					 type:'', //操作类型，1添加，2编辑
					 title:'', //商品标题
					 category_ids:'',//分类id
					 description:'',//描述
					 images:'',//图片，多张用逗号分隔
					 price:'',//价格
					 dispatch_type:'express',//发货方式:express=物流快递,selfetch=用户自提
					 limit_buy:'',//限购数量
					 stock:'',//库存
					 express_fee:'',//运费
					 is_new: 1 ,//是否全新0否，1是
					 district:'',//地址id
				},
				area_text:'点击选择所在地区', //省市县文字
				type:'',
				path:''
			};
		},
		onLoad(option) {
			console.log(option);
			this.getstr()
			if(option.id){
				uni.setNavigationBarTitle({
					title: '编辑'
				});	
				this.getData(option.id)
				this.type = option.id
				this.path = option.path
			}else{
				uni.setNavigationBarTitle({
					title: '商品发布'
				});				
			}
			
		},
		methods: {
			// 编辑初始化数据
			getData(id){
				let that = this;
				that.$api('api.sCyDetail', {id}).then(res => {
					if(res.code == 1){
						console.log(data);
						let data = res.data
						that.dicData.id = data.id
						that.dicData.title = data.title   
						that.dicData.category_ids = Number(data.category_ids)
						
						// 分类索引
						if(that.clase.length>0){
							that.clase.forEach((item,index)=>{
								if(item.id == data.category_ids){
									that.claseIndex = index
								}
							})							
						} else {
							that.claseIndex = 0
						}
						
						that.dicData.description = data.description
						that.imgList = data.images
						that.dicData.price = data.price
						that.dicData.dispatch_type = data.dispatch_type
						that.dicData.limit_buy = data.limit_buy
						that.dicData.stock = data.stock
						that.dicData.express_fee = data.express_fee
						that.dicData.is_new = data.is_new
						that.dicData.district = data.district
						that.area_text = data.province_name+'-'+data.city_name+'-'+data.district_name
					}
				});
			},
			// 配送方式
			radioGroupChange(e){
				this.dicData.dispatch_type = e
				console.log('dispatch_type',this.dicData.dispatch_type);
			},
			radioGroupChange2(e){
				this.dicData.is_new = e
				console.log('is_new',this.dicData.is_new);
			},
			// bindTextAreaBlur: function (e) {
			// 	console.log(this.value)
			// },
			//所属分类
			bindChangeClase(e){
				this.claseIndex  = e.target.value
				this.dicData.category_ids = this.clase[this.claseIndex].id
				console.log(this.claseIndex,this.dicData.category_ids);
			},
			// 打开地址选择
			selCity() {
				this.$refs.shoproCityPicker.show();
			},
			onConfirm(e) {
				console.log(e);
				this.dicData.district = e.cityCode;
				this.area_text = e.label;
			},
			onCancel(e) {
				console.log(e);
				this.dicData.district = e.cityCode;
				this.area_text = e.label;
			},
			// 发布
			onJoin(){
				let that = this;
				
				if(!that.dicData.title){
					that.$tools.toast('请填写商品名称');
					return
				}
				if(!that.dicData.price){
					that.$tools.toast('请填写宝贝价格');
					return
				}
				
				if(!that.dicData.express_fee){
					that.$tools.toast('请填写填写运费');
					return
				}
				if(!that.dicData.limit_buy){
					that.$tools.toast('请填写限购数量');
					return
				}
				if(!that.dicData.stock){
					that.$tools.toast('请填写库存数量');
					return
				}
				if(that.area_text =='点击选择所在地区'){
					that.$tools.toast('请选择所在地区');
					return
				}
				if(!that.dicData.description){
					that.$tools.toast('请填写您的宝贝描述');
					return
				}
				if(that.imgList.length == 0){
					that.$tools.toast('请选择图片');
					return
				}
				
				
				
				
				//操作类型，1添加，2编辑
				that.dicData.type = that.type ? 2:1 ;
				//图片，多张用逗号分隔
				let imgL = '';
				that.imgList.forEach((item)=>{
					imgL += item+','
				})
				that.dicData.images = imgL.slice(0,imgL.length-1)
				// end
				that.$api('api.sCyGoodsPost', that.dicData).then(res => {
					
					that.$tools.toast(res.msg)
					if(that.type){
						uni.$emit('myOrderTrueque')
					}
					if(that.path =='list'){
						uni.$emit('myOrderTrueque')
						uni.$emit('myOrderTruequeList')
						
					}
					setTimeout(()=>{
						uni.navigateBack({
							delta: 1
						});
					},1000)
				});
			},
			// 获取分类
			getstr(){
				let that = this;
				that.$api('api.sCyGoodsList', {category_id: that.initData.secondhand_category_id}).then(res => {
					if (res.code === 1) {
						that.clase = res.data.categories
						if(that.clase.length>0){
							that.dicData.category_ids = that.clase[that.claseIndex].id
							console.log('category_ids',that.dicData.category_ids);
							that.clase.forEach((item)=>{
								that.claseText.push(item.name)
							})
						}
					}
				});
			},
			DelImg(index) {
				uni.showModal({
					title: '删除照片',
					content: '确定要删除这张照片么？',
					cancelText: '取消',
					confirmText: '删除',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(index, 1);
							this.imgListStr.splice(index, 1);
						}
					}
				});
			},
			// 选择图片
			async onChooseImg() {
				let that = this;
				that.$tools.chooseImage(9).then(res => {
					res.forEach(img => {
						that.$tools.uploadImage('index/upload', img).then(res => {
							that.imgList.push(res.full_url);
							that.imgListStr.push(res.url);
						});
					});
				});
			},
			// 地图选择地址
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
						console.log(res);
						this.address = res.address
					},
					fail: err => {
						console.log(err);
					}
				});
			},
			// app权限判断
			async checkPermission() {
				let status = permision.isIOS ? await permision.requestIOS('location') : await permision.requestAndroid(['android.permission.ACCESS_FINE_LOCATION']);
				return status;
			},
		}
	};
</script>
<style lang="scss">
.bodyBox{
	width: 100%;
	height: 340rpx;
	background: url($IMG_URL+'/imgs/trueque/topbg.png') no-repeat;
	background-size: 100% 340rpx;
	position: relative;
	.bodyBoxCore{
		position: absolute;
		top: 0;
		padding: 0 30rpx;
		margin-top: 245rpx;
		width: 100%;
		.coreBoxTop{
			margin-top: 20rpx;
		}
		.coreBox{
			background: #FFFFFF;
			box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(231, 231, 231, 0.5);
			border-radius: 18rpx;
			.itemBoxB{
				border-bottom: 1rpx #EEEEEE solid;
			}
			.itemBox{
				padding: 0 30rpx;
				width: 100%;
				height: 120rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.itemTit{
					font-size: 32rpx;
					font-weight: bold;
					color: #333333;
				}
				.itemRig{
					width: 460rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					input{
						width: 410rpx;
						color: #C1C1C1;
					}
					.cityBox{
						width: 410rpx;
						color: #C1C1C1;
					}
					.cred{
						color: #FF4623 !important;
					}
					picker{
						width: 410rpx;
						color: #C1C1C1;
						font-size: 32rpx;
					}
					.plInput{
						font-size: 32rpx;
						color: #C1C1C1;
					}
					
				}
			}
			.itemBox1{
				padding:30rpx;
				width: 100%;
				textarea{
					width: 100%;
					height: 200rpx;
				}
			}
			.img-box {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				margin-top: 20rpx;
				padding: 0 30rpx;
				.choose-img,
				.preview-box {
					width: 190rpx;
					height: 190rpx;
					margin-right: 25rpx;
					margin-bottom: 25rpx;
					position: relative;
					&:nth-child(3n) {
						margin-right: 0;
					}
					.cuIcon-cameraadd {
						font-size: 50rpx;
						color: #dfdfdf;
					}
					.preview-img {
						width: 100%;
						height: 100%;
						border-radius: 20rpx;
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
			
			
		}
	}
}
.coreBox2{
	margin: 100rpx 0 85rpx 0;
}
.btnYao{
	width: 690rpx;
	height: 90rpx;
	background: linear-gradient(180deg, #FF4800 0%, #FF2400 100%);
	border-radius: 45rpx;
	padding: 0;
	color: #FFFFFF;
	font-size: bold;
}
</style>
