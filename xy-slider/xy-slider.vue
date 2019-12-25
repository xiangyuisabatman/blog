<template name="canvas-slider">
	<view class="slider-container">
		<text class="time">2019.12.08</text>
		<text class="title">{{name}}</text>
		
		<view class="content" id="content">
			<view class="ruler-title">
				<view class="ruler-parameter">
					<div id='rulerTitle' class="rulerTitle" @click="fucminus">-</div>
					<div id='ruler-num' class="ruler-num" style="font: bold 24px/50px 微软雅黑;">{{numNode || 0}} {{unit}}</div>
					<div id='ruler-unit' class="ruler-unit" @click="fucplus">+</div>
				</view>
			</view>
			<view class="ruler-contain">
				<div class='ruler' id='ruler' @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd" :style="{height: '100%', position: 'absolute', top: 0, left: left + 'px'}">
					<canvas id='rulerCanvas' canvas-id="rulerCanvas" :style="{width: (Math.ceil((maxNum - minNum) / cellNum) * 100 + clientWidth * 0.6) + 'px', height: '80px'}"></canvas>
				</div>
			</view>
			
			<view class="ruler-img">
				<canvas id='pinPic' canvas-id="pinPic" style="width:4px;height: 60px;"></canvas>
			</view>
			
		</view>
		
		<view class="btns">
			<button class="cancel-button" @click="handleCancel">取消</button>
			<button class="save-button" @click="saveBtn">保存</button>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'canvas-slider',
		data() {
			return {
				left: 10,
				numNode: 0,
				maxNum: 400,
				minNum: 0,
				initNum: 0,
				name: '',
				unit: '',
				decimalWei: 0,
				cellNum: 10,
				clientWidth: 375,
				touch: {
					startX:0,
					startY:0
				},
				rulerNode: {},
				record: [],
				n: 0
			};
		},
		mounted() {
			
		},
		methods: {
			init(params) {
				setTimeout(() => {
					this.Ruler('content', params)
				},300)
				
			},
			canvasIdErrorCallback: function (e) {
				console.error(e.detail.errMsg)
			},
			sliderChange() {},
			Ruler: function (id, paraObj) {
				const that = this
				this.clientWidth = uni.getSystemInfoSync().windowWidth;
				this.maxNum = paraObj.maxNum || 300.0; //最大数值
				this.minNum = paraObj.minNum || 30.0; //最小数字
				this.cellNum = paraObj.cellNum || 10; //一个大刻度的数值区间
				this.minNum = parseInt(this.minNum / this.cellNum) * this.cellNum;
				this.record = [];
				if ((this.maxNum - this.minNum) % this.cellNum != 0) {
					this.maxNum = this.minNum + this.cellNum * parseInt((this.maxNum - this.minNum) / this.cellNum + 1);
				}
				this.name = paraObj.name;
				this.unit = paraObj.unit;
				this.initNum = paraObj.initNum;
				this.nowData = this.initNum || this.minNum || 30.0;
				this.decimalWei = paraObj.decimalWei;
				uni.createSelectorQuery().in(this).select('#ruler').boundingClientRect((rect) => {
					that.rulerNode = rect
					//做出标尺的html结构
					this.rulerStructure(id); //传入id值
				}).exec()
				
			},
			rulerStructure: function (id) {
				//设定标尺的初始位置
				this.rulerNode.left = -(this.initNum - this.minNum) / this.cellNum * 100;
				this.left = -(this.initNum - this.minNum) / this.cellNum * 100;
				
				this.numNode = this.initNum || this.minNum
				
				
				this.Canvas = uni.createCanvasContext('rulerCanvas', this)
				
				//画出标尺的静态
				setTimeout(() => {
					this.drawRuler();
				}, 300)
		
				this.drawPin('pinPic');
			},
			drawPin: function (id) {
				uni.createSelectorQuery().in(this).select('#pinPic').boundingClientRect((rect) => {
					let pinCanvas = uni.createCanvasContext(id, this);
					//画三角形
					pinCanvas.beginPath();
					pinCanvas.moveTo(3 - 0.5, 0);
					pinCanvas.lineTo(3 - 0.5, 50);
					pinCanvas.setStrokeStyle("#FF4789")//中间标线颜色
					pinCanvas.setLineWidth(3)
					pinCanvas.stroke();
					pinCanvas.draw()
					pinCanvas.closePath();
				}).exec()
			},
			drawRuler: function () {
				var that = this;
				//画整数的刻度
				for (var i = 0; i <= Math.ceil((that.maxNum - that.minNum) / (that.cellNum / 2)); i++) {
					that.Canvas.beginPath(); //起始一条路径，或重置当前路径
					that.Canvas.moveTo(that.clientWidth * 0.6 / 2 + 50 * i - 0.5, 0); //把路径移动到画布中的指定点，不创建线条
					that.Canvas.lineTo(that.clientWidth * 0.6 / 2 + 50 * i - 0.5, 40);
					that.Canvas.setStrokeStyle("#eee")
					that.Canvas.stroke(); //绘制已定义的路径
					that.Canvas.closePath(); //创建从当前点回到起始点的路径
					that.Canvas.font = "12px Arial";
					that.Canvas.setStrokeStyle("#333")
					//绘制标签下面的数字
					if (i <= ((that.maxNum - that.minNum) / that.cellNum)) {
						that.Canvas.strokeText(that.decimal(that.minNum + that.cellNum * i, that.decimalWei), that.clientWidth * 0.6 / 2 + 100 * i - 8, 66);
					}
				}
		
		
				//画小数的刻度
				for (var j = 0; j <= Math.ceil((that.maxNum - that.minNum) / that.cellNum) * 100 / 10; j++) {
					if (j % 5 != 0) {
						that.Canvas.beginPath();
						that.Canvas.moveTo(that.clientWidth * 0.6 / 2 + 10 * j - 0.5, 0);
						that.Canvas.lineTo(that.clientWidth * 0.6 / 2 + 10 * j - 0.5, 20);
						that.Canvas.setStrokeStyle("#eee")
						that.Canvas.stroke();
						that.Canvas.closePath();
					}
				}
				that.Canvas.draw()
				
			},
			handleTouchStart: function(e) {
				const that = this
				e.preventDefault();
				clearInterval(that.timer);
				clearInterval(that.partTime);
				that.record = [];
				that.touch.startX = e.changedTouches[0].clientX;
				that.touch.startY = e.changedTouches[0].clientY;
				that.moveNum = parseInt(that.rulerNode.left);
				that.n = 0
			},
			handleTouchMove: function(e) {
				const that = this
				
				let moveX = e.changedTouches[0].clientX;
				let moveY = e.changedTouches[0].clientY;
				let transX = moveX - this.touch.startX;
				let transY = moveY - this.touch.startY;
				let isScrolling = Math.abs(transX) < Math.abs(transY) ? 1 : 0; //isScrolling为1时，表示纵向滑动，0为横向滑动
				if (isScrolling == 1) {
					e.preventDefault();
				} else {
					var leftNum = -Math.round(this.moveNum + transX) / (100 / that.cellNum) + that.minNum;
					var moveDis = this.moveNum + transX;
					if (moveDis >= 0) {
						moveDis = 0;
						leftNum = that.minNum;
					} else if (moveDis <= -(Math.ceil((that.maxNum - that.minNum) / that.cellNum) * 100)) {
						moveDis = -(Math.ceil((that.maxNum - that.minNum) / that.cellNum) * 100);
						leftNum = that.maxNum;
					}
					that.nowData = that.decimal(leftNum, that.decimalWei);
					that.numNode = that.nowData; 
					// that.rulerNode.left = moveDis;
					that.left = moveDis;
					that.n++;
					var moveTime = new Date().getTime();
					that.record[that.n] = [];
					that.record[that.n].push(moveTime);
					that.record[that.n].push(moveDis);
				}
			},
			handleTouchEnd: function(e) {
				const that = this
				if (that.record.length > 4) {
					var speed = (that.record[that.record.length - 1][1] - that.record[that.record.length - 4][1]) / (that.record[that.record.length - 1][0] - that.record[that.record.length - 4][0]) * 1000;
					clearInterval(that.timer);
					that.timer = setInterval(function () {
						if (Math.abs(speed) > 100) {
							speed = speed > 0 ? speed - 30 : speed + 30;
							var speedX = parseInt(that.left) + (speed / 50);
							if (speedX >= 0) {
								speedX = 0;
							} else if (speedX <= -(Math.ceil((that.maxNum - that.minNum) / that.cellNum) * 100)) {
								speedX = -(Math.ceil((that.maxNum - that.minNum) / that.cellNum) * 100);
							}
							// that.left = speedX;
							that.rulerNode.left = speedX;
							var speedNum = -Math.round(speedX) / (100 / that.cellNum) + that.minNum;
							that.nowData = that.decimal(speedNum, that.decimalWei);
							that.numNode = that.nowData;
							
						} else {
							clearInterval(that.timer);
							var numM = parseFloat(that.rulerNode.left);
							var numStep = parseInt(numM / 10);
							if (numM - numStep * 10 > -5) {
								that.movePart(numM, numStep * 10, 10, that.rulerNode, "left");
							} else {
								that.movePart(numM, (numStep - 1) * 10, 10, that.rulerNode, "left");
							}
						}
					}, 20);
				} else {
					var numM = parseFloat(that.rulerNode.left);
					var numStep = parseInt(numM / 10);
					if (numM - numStep * 10 > -5) {
						that.movePart(numM, numStep * 10, 10, that.rulerNode, "left");
					} else {						
						that.movePart(numM, (numStep - 1) * 10, 10, that.rulerNode, "left");
					}
				}
			},
			fucplus: function(){
				const that = this
				clearInterval(that.timer);
				clearInterval(that.partTime);
				var numM = parseFloat(that.rulerNode.left);							
				var numStep =parseInt(numM / 10)-1;		
				if((-numStep)<=that.maxNum){
					that.movePart(numM, numStep * 10, 10, that.rulerNode, "left");
				}
			},
			fucminus: function() {
				const that = this
				clearInterval(that.timer);
				clearInterval(that.partTime);
				var numM = parseFloat(that.rulerNode.left);
				var numStep =parseInt(numM / 10)+1;
				if((-numStep)>=that.minNum){
					that.movePart(numM, numStep * 10, 10, that.rulerNode, "left");
				}	
			},
			decimal: function (num, decimalNum) {
				var xsd = num.toString().split(".");
				if (decimalNum == 1) {
					if (xsd.length == 1) {
						num = num.toString() + ".0";
						return num;
					}
					if (xsd.length > 1) {
						if (xsd[1].substring(0, decimalNum) == "0") {
							num = Math.round(num).toString() + ".0";
							return num;
						} else {
							num = Math.round(num * 10) / 10;
							var xsd0 = num.toString().split(".");
							if (xsd0.length == 1) {
								num = num + ".0";
							}
							return num;
						}
					}
				} else if (decimalNum == 2) {
					if (xsd.length == 1) {
						num = num.toString() + ".00";
						return num;
					}
					if (xsd.length > 1) {
						if (xsd[1].substring(0, decimalNum) == "0") {
							num = Math.round(num).toString() + ".00";
							return num;
						} else {
							num = Math.round(num * 100) / 100;
							var xsd0 = num.toString().split(".");
							if (xsd0.length == 1) {
								num = num + ".00";
							}
							return num;
						}
					}
				} else {
					return Math.round(num);
				}
			},
			movePart: function (start, end, stepNum, obj, attr, fn) {
				var that = this;
				clearInterval(this.partTime);
				if (end != start) {
					var step = (end - start) / stepNum;
					this.partTime = setInterval(function () {
						start += step;
						if (start <= end && step < 0) {
							clearInterval(that.partTime);
							start = end;
							if (fn) {
								fn();
							}
						} else if (start >= end && step > 0) {
							clearInterval(that.partTime);
							start = end;
							if (fn) {
								fn();
							}
						}
						that[attr] = start;
						that.rulerNode[attr] = start
						var leftNum = -Math.round(start) / (100 / that.cellNum) + that.minNum;
						that.nowData = that.decimal(leftNum, that.decimalWei);
						that.numNode = that.nowData;
						
					}, 20)
				}
		
			},
			saveBtn() {
				
			},
			handleCancel() {
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.slider-container {
	height: 586rpx;
	padding: 60rpx 0rpx;
	background-color: #FFFFFF;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #ff4789;
	line-height: 60rpx;
	.time {
		font-size: 30rpx;
	}
	.title {
		font-size: 24rpx;
	}
	.content {
		width: 100%;
		height: 200px;
		position: relative;
		.ruler-title {
			width: 100%;
			height: 35%;
			position: relative;
			overflow: hidden;
			.ruler-parameter {
				width: 430rpx;
				text-align: center;
				box-sizing: border-box;
				margin: 0 auto;
				.rulerTitle {
					color: #ff4789;
					float: left;
					font-weight: bold;
					font-size: 24px;
					line-height: 60px;
				}
				.ruler-num {
					color:#FF4789;
					display:inline-block;
				}
				.ruler-unit {
					color:#FF4789;
					font-weight:bold;
					line-height: 60px;
					font-size: 24px;
					float:right;
				}
			}
		}
		
		.ruler-contain {
			width: 100%;
			height: 55%;
			position: absolute;
			top: 35%;
			left: 20%;
			overflow: hidden;
		}
		
		.ruler-img {
			width: 4px;
			height: 60px;
			margin: 0 auto;
			position: relative;
			z-index: 999;
			// background-color: #23cdb7;
		}
	}
	.btns {
		width: 100%;
		padding: 10rpx 0rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		button {
			width: 240rpx;
			height: 68rpx;
			color: #FFFFFF;
			line-height: 68rpx;
			font-size: 32rpx;
			border-radius: 16rpx;
		}
		.cancel-button {
			background-color: #adadad;
		}
		.save-button {
			background-color: #ff4789;
		}
	}
}
</style>
