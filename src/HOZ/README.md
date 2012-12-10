cem
===

message middleware-like

__基于JS的类消息中间件模块__

## 基于HOZ的cem

HOZ自身提供了ieventable接口，一般的开发，会继承自core.Base

同时，ieventable接口会自行包装事件对象，非常方便于订阅获取target

但是，在解除事件和解除事件所有订阅时，需要调用私有的_events

另外，对于即刻执行订阅，需要参照源码自行实现