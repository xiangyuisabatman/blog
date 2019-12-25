# blog

1. [利用canvas生成海报保存图片到手机](https://github.com/xiangyuisabatman/blog/blob/master/uni-app%E4%B8%8B%E5%88%A9%E7%94%A8canvas%E7%94%9F%E6%88%90%E6%B5%B7%E6%8A%A5%E4%BF%9D%E5%AD%98%E5%9B%BE%E7%89%87%E5%88%B0%E6%89%8B%E6%9C%BA.md)
2. [记一次因options预检请求发现的新问题](https://github.com/xiangyuisabatman/blog/blob/master/%E8%AE%B0%E4%B8%80%E6%AC%A1%E5%9B%A0options%E9%A2%84%E6%A3%80%E8%AF%B7%E6%B1%82%E5%8F%91%E7%8E%B0%E7%9A%84%E6%96%B0%E9%97%AE%E9%A2%98.md)
3. [微信小程序基于canvas标尺滑动选择器]

用法:
```
<xy-slider ref="slider"></xy-slider>
import xySlider from '@/mycomponents/xy-slider/xy-slider.vue'
this.$refs.slider.init(
	{
		maxNum:"200", // 最大数值
		minNum:"0", // 最小数值
		initNum:170, // 初始数值
		decimalWei:"1", // 保留几位有效小数；默认为零
		cellNum:"10", // 两个大刻度的数值区间
		name: '身高', // 名称
		unit: 'cm' // 单位
	}
)
```

