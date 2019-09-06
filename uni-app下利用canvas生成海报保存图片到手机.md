这次的h5小程序项目中，有一个生成海报并分享的需求，因为本人是新手，也是第一次接手到h5小程序的需求，所以在做之前做了一些调研。
做此功能可以有两种方式
1. 创建canvas标签，在canvas上绘制出想要的海报，然后通过`uni.canvasToTempFilePath`方法将canvas画布导出生成指定大小的图片，并保存
2. 将海报样式通过html绘制，然后通过`html2canvas.js`将html绘制成canvas然后`canvas.toDataURL`获取到图片路径，并保存

#### 1.通过canvas标签
html（canvasHeight是根据设备尺寸动态变化的）
```
<view class="canvas-content">
    <canvas canvas-id="myCanvas" id="myCanvas" :style="{width: '100%', height: canvasHeight + 'px'}"></canvas>
</view>
```
script
```
mounted(){
    uni.getSystemInfo({ // 获取到当前设备的一些信息
        success: function(res) {
            this.canvasHeight = res.windowHeight * 0.7 // *0.7是因为给底部分享按钮留位置,可以根据自己的需求更改
            this.scale = res.windowWidth / 375 // 缩放比例
        }
    })
},
methods: {
    drawShareCanvas: function() {
        const vm = this
        uni.showLoading({
            title: '生成中...',
            mask: true
        })
        const ctx = uni.createCanvasContext('myCanvas') // 获取canvas上下文
        // 获取canvas节点并获取相关节点信息
        uni.createSelectorQuery().select('#myCanvas').boundingClientRect(function(rect){

            const canvas_width = rect.width
            const canvas_height = rect.height
            const scale = vm.scale
            const padding = 20 * scale

            ctx.drawImage('/static/img/index/posterBg.png', 0, 0, canvas_width, canvas_height); // 背景图
            // 有一次从这里开始向下都一直绘制不出效果，也一直找不到问题，最后发现scale值为0，所以在绘制的时候一定要确定好绘制的位置，否则会无法展示出如期的效果
    		ctx.drawImage('/static/img/index/avatar.png', padding, padding, 50 * scale, 50 * scale); // 头像
    		ctx.setFontSize(14 * scale);
    		ctx.setFillStyle('rgba(255,255,255,1)');
    		ctx.fillText('胡小宁', padding + (60 * scale), padding + 20); //姓名
    		ctx.fillText('邀请你一起学习', padding + (60 * scale), padding + 40); //标签

    		ctx.setFontSize(24 * scale);
    		ctx.setFillStyle('rgba(0,0,0,1)');
    		ctx.textAlign="center";
    		ctx.fillText('即将开课', canvas_width / 2, padding + 140);

    		ctx.drawImage('/static/img/common/commaleft.png', padding + 10, padding + 156, 26 * scale, 26 * scale); // 左双引号
    		ctx.setFontSize(16 * scale);
    		ctx.setFillStyle('rgba(51,51,51,1)');
    		ctx.textAlign="center";
    		ctx.fillText('二建法规高频易错易混102', canvas_width / 2, padding + 196);
    		ctx.fillText('题详细解析', canvas_width / 2, padding + 216);
    		ctx.drawImage('/static/img/common/commaright.png', canvas_width - 56, padding + 206, 26 * scale, 26 * scale); // 右双引号

    		ctx.drawImage('/static/img/common/shareLogo.png', padding + 10, canvas_height * 0.72, 66 * scale, 40 * scale); // logo
    		ctx.setFontSize(12 * scale);
    		ctx.setFillStyle('rgba(153,153,153,1)');
    		ctx.textAlign = "start";
    		ctx.fillText('长按识别图中', canvas_width / 2, canvas_height * 0.75);
    		ctx.fillText('二维码', canvas_width / 2, canvas_height * 0.78);
    		ctx.fillText('开始围观', canvas_width / 2, canvas_height * 0.81);

    		ctx.rect(canvas_width - (46 * scale + padding + 5), canvas_height * 0.72, 46 * scale, 46 * scale);
    		ctx.fill()


    		ctx.textAlign = "center";
    		ctx.setFontSize(16 * scale);
    		ctx.setFillStyle('rgba(255,255,255,0.7)');
    		ctx.fillText('轻松玩过二建工程法规', canvas_width / 2, canvas_height - 40);
    		ctx.setFontSize(14 * scale);
    		ctx.setFillStyle('rgba(255,255,255,0.4)');
    		ctx.fillText('优路出品，讲解工程法规学习技巧', canvas_width / 2, canvas_height - 20);
    		ctx.stroke();

            setTimeout(function () {
                ctx.draw();  //这里有个需要注意就是，这个方法是在绘制完成之后在调用，不然容易其它被覆盖。
                wx.hideLoading();
			}, 1000)
        }).exec()
        // 这样我们的海报利用canvas就绘制成功了
    }
}
```

#### 2.通过将html转换成canvas
html

```
<view id="share-container" class="container">
    ... // 这里是根据设计图通过html标签的布局
</view>
```
script
```
// 首先我们引入html2canvas.js文件
import html2canvas from '../../static/utils/html2canvas.js' // [官网](http://html2canvas.hertzen.com/)

// v0.4.1
html2canvas(element, {
    onrendered: function(canvas) {
        // 这里可以拿到canvas DOM元素
    }
})

// v0.5.0
html2canvas(element, options).then(canvas => {
    // 这里可以拿到canvas DOM元素
})



// 这里我们用v0.5.0版本
const ele = document.getElementById('shart-content')
html2canvas(ele).then(canvas => {
    const imgUrl = canvas.toDataURL('image/png') // 获取生成的base64图片url

})
```

#### 3.保存图片到本机
这里有两种情况
- 微信小程序保存
- h5页面保存

##### 第一种

```
uni.canvasToTempFilePath({
    x: 0,
    y: 0,
    canvasId: 'myCanvas',
    success: function(res) {
        uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function() {
                console.log('保存成功')
            }
        })
    }
})
```

##### 第二种
h5需要用户长按图片保存
```
uni.previewImage({
	urls: [
		imgUri // 将html2canvas生成图片地址 是一个base64
	],
	longPressActions: {
		itemList: ['发送给朋友', '保存图片', '收藏'],
		success: function(data) {
			console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
		},
		fail: function(err) {
			console.log(err.errMsg);
		}
	}
})
```

### 4.坑
- 通过html2canvas生成的图片模糊，可以在html2canvas options选项中设置scale参数，默认是window.devicePixelRatio
- 网络图片地址绘制不出，设置options选项中设置useCORS设置为true
- border-style:dashed/dotted无效 始终是大实线
