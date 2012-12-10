/**
* 自定义事件管理
*/
AE.define('common.cem', ['core', 'lang'], function(core, lang){
    var CEM, ctor,
        // 全局域
        cem,
        // 域事件管理器
        domain = {},
        
        _config = {
            name: '', // domain 名称
            obj: null, // 需扩展CEM的对象
            bubble: true // 冒泡，默认冒泡
        };
        
    ctor = function(config){        
        var name = config.name,
            obj = config.obj,
            bubble = config.bubble;
        
        this.domainType = 'unnamed';
        // 命名域
        if(name){
            this.name = name;
            this.domainType = 'named';
        }
        // 冒泡
        this._bubble = bubble;
        // 初始化
        this._ranCE = {};
        // 将CEM扩展到对象
        if(obj){
            this._context = obj;
            core.mix(obj, this);
            core.mix(obj, CEM.prototype);
        }
    };
    CEM = core.extend(core.Base, {
        _izer: ctor,
        // 触发事件
        _trigger: function(e, args, bubble){
            // 合成事件对象
            if (lang.isString(e)) {
                e = {type: e};
            }
            e.target = e.target || this._context || this;
            // 触发事件
            this._fire(e, args);
            // 事件冒泡
            bubble = bubble || true;
            if((bubble || this._bubble) && this !== cem){
                cem.trigger(e, args, false);
            }
            // 已发生事件
            this._ranCE[e.type] = [e.target, args];
        },
        trigger: function(e, args, bubble){
            var i, len, _type;
            // 多事件触发
            if(!lang.isArray(e)){
                type = [e];
            }
            // 触发事件
            for(i = 0, len = type.length; i < len; i++){
                _type = type[i];
                this._trigger.apply(this, arguments);
            }
        },
        _instant: function(type, listener, data){
            var e = {type: type},
                o = this._ranCE[type];
            if(o !== undefined){
                e.target = o[0];
                if (data) {
                    e.data = data;
                }
                listener.call(o[0], e, o[1]);
            }
        },
        // 订阅事件
        subscribe: function(type, listener, data, instant){
            if(lang.isBoolean(Array.prototype.slice.call(arguments).pop())){
                instant = data;
                data = undefined;
            }
            this.on(type, data, listener);
            // 已发生事件，即刻执行订阅
            if(instant){
                this._instant(type, listener, data);
            }
        },
        // 订阅事件，仅一次
        subscribeOnce: function(type, listener, data, instant){
            // 已发生事件，即刻执行订阅
            if(instant){
                this._instant(type, listener, data);
            } else {
                this.once(type, data, listener);
            }
        },
        // 解除事件
        unbind: function(type){
            var events = this._events;
            this.unsubscribeAll(type);
            delete events[type];
        },
        // 解除事件订阅
        unsubscribe: function(type, listener){
            this.detach(type, listener);
        },
        // 解除事件订阅，针对某一事件，解除所有订阅
        unsubscribeAll: function(type){
            var events = this._events,
                listeners = events[type],
                i, len;
            for (i = 0, len = listeners.length; i < len; ++i) {
                this.unsubscribe(type, listeners[i]);
            }
        }
    }, _config);
    
    // 全局域
    if(cem === undefined){
        cem = new CEM({
            bubble: false
        });
        core.mix(cem, {
            // 创建或获取域
            // 未名域，name为空
            // 给定obj，扩展对象方法
            domain: function(name, obj, bubble){
                if(arguments.length < 3){
                    if(lang.isBoolean(name)){
                        bubble = name;
                        name = '';
                        obj = null;
                    }
                    if(lang.isObject(name)){
                        obj = name;
                        bubble = obj;
                        name = '';
                    }
                }
                
                var _cem;
                if(name){ // 未名域，不托管
                    _cem = domain[name];
                }
                if(_cem === undefined){
                    _cem = new CEM({
                        name: name,
                        obj: obj,
                        bubble: bubble || true
                    });
                }
                if(name){ // 未名域，不托管
                    domain[name] = _cem;
                }
                return _cem;
            },
            // domain type
            domainType: 'global'
        }, true);
    }
    
    return cem;
});
