﻿cem (Custom Event Manager)
===

message middleware-like

__基于JS的类消息中间件模块__

## 背景

使用YUI2等框架，需要将自定义事件绑定或扩展到对象实体上。

这样一来，在进行模块化编程时，我们会需要关注每个对象上具体有哪些自定义事件（消息）。

另外，这样做会导致所有消息都散落在各个对象中，不便于管理。

同时，这些定义的消息，或者私有，或者公共，不便实现在特定区域公共，对于其他区域私有的需求。

## 功能

* 新增common.cem模块，用于统一管理消息
* 增加域的概念，对于不同的域，可以触发同名消息
* 初始提供全局域，便于消息在全页面中的流转
* 增加消息冒泡，不同域中的消息可以冒泡到全局域中，便于其他模块在全局域中捕获
* 对于已经触发的消息，新增的消息订阅可以即刻执行，不需要等待下次的消息触发