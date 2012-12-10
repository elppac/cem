cem
===

message middleware-like

__基于JS的类消息中间件模块__

## 基于YUI2的cem

YUI2的自定义事件，是封装好的对象

对于订阅仅传递事件的type，无法传递事件对象

在cem中，通过调整抛给订阅的参数表——调整args[0]为{target: target}，使得订阅获得target

另外，对于即刻执行订阅，需要参照源码自行实现