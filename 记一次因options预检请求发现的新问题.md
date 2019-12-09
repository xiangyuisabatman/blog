### 起因

这是一次因为小程序兼容h5发生的事情，当小程序开发完成后，打包运行在浏览器中，出现了options预检请求跨域问题。（ok，这问题之前工作遇到过，抛给后端处理就可）

- 我：我这边h5请求接口报了跨域问题，你那边处理一下跨域
- 后端： 好（过了一会儿），好了你试一下
- 我：还是不行啊，你那边处理一下OPTIONS请求，在发起真实请求前会发起一个OPTIONS请求检查是否允许跨域。
- 后端：好，我看看（过了一天），我这里该加的都加了，而且我自己建了个vue项目，用axios请求我的接口是可以访问的，你试试设置一下请求头`content-Type: application/x-www-form-urlencoded`
- 我加了后试一下还是不行，并问后端要了他的代码看了起来，为什么他可以我不可以，而且他为什么没有OPTIONS请求呢，一样都是post请求。

### 什么是OPTIONS请求

在CORS中，可以使用OPTIONS方法发起一个预检请求，以检测实际请求是否可以被服务器所接受。预检请求报文中的`Access-Control-Request-Method`首部字段告知服务器实际请求所使用的HTTP方法；`Access-Control-Request-Headers`首部字段告知服务器实际请求所携带的自定义首部字段。服务器基于从预检请求获得的信息来判断，是否接受接下来的实际请求。

### 什么时候会发起OPTIONS请求

OPTIONS请求是浏览器自动发起的。满足以下两个条件，浏览器才会使用OPTIONS预请求：
1. 以GET、HEAD、获取POST以外的方法发起请求。或者使用POST，但请求数据为`application/x-www-form-urlencoded`，`multipart/form-data`或者`text/plain`以外的数据类型.比如说,用POST发送数据类型为`application/xml`或者`text/xml`的XML数据的请求。
2. 使用了自定义请求头


### 问题所在

这时候想起来了，实际上在请求接口时会加上时间戳的一个自定义请求头，所以我虽然把`content-Type`改为`application/x-www-form-urlencoded`，但是因为有自定义请求头，还是会发起一个OPTIONS请求。

于是我把后端给的代码上加了一个自定义请求头，这样也报跨域问题了。这样就知道了还是那边跨域问题没有处理掉。

### 总结

之前，只是知道OPTIONS请求是一个跨域预检请求，并不知道跟content-type和自定义请求头还有关系。
