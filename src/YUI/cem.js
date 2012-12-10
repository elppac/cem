/**
* 自定义事件管理
*/
AE.define('common.cem', ['common.utils'], function(utils){
    var CE = YAHOO.util.CustomEvent,
        
        isArray = utils.isArray,
        
        CEM, cem,
        
        domain = {};
        
    CEM = function(name, obj, bubble){
        if(arguments.length < 3){
            if(utils.isBoolean(name)){
                bubble = name;
                name = '';
                obj = null;
            }
            if(utils.isObject(name)){
                obj = name;
                bubble = obj;
                name = '';
            }
        }
        
        this.domainType = 'unnamed';
        // 命名域
        if(name){
            this.name = name;
            this.domainType = 'named';
        }
        // 冒泡
        this._bubble = bubble;
        // 初始化
        this._ce = {};
        this._ranCE = {};
        // 将CEM扩展到对象
        if(obj){
            this._context = obj;
            utils.mix(obj, this);
            utils.mix(obj, CEM.prototype);
        }
    };
    
    CEM.prototype = {
        constructor: CEM,
        _getCE: function(type){
            var ce = this._ce[type];
            if(!ce){
                ce = new CE(type);
            }
            this._ce[type] = ce;
            return ce;
        },
        _trigger: function(type, args, bubble){
            var ce = this._getCE(type),
                params, target;
            // target
            target = (args ? args.target : false) || this._context || this;
            target = {target: target};
            // 合成参数
            params = utils.slice(arguments, 1);
            if(params[0].target){
                params.shift();
            }
            params.unshift(target);
            bubble = utils.isBoolean(params[params.length - 1]) ? params.pop() : true;
            // 触发事件
            ce.fire.apply(ce, params);
            // 事件冒泡
            if((bubble || this._bubble) && this !== cem){
                var _params = utils.slice(params);
                _params.unshift(type);
                _params.push(false);
                cem.trigger.apply(cem, _params);
            }
            // 已发生事件
            this._ranCE[type] = params;
        },
        // 触发事件
        trigger: function(type, args, bubble){
            var i, len, _type, args = utils.slice(arguments);
            // 多事件触发
            if(!isArray(type)){
                type = [type];
            }
            // 触发事件
            for(i = 0, len = type.length; i < len; i++){
                _type = type[i];
                args[0] = _type;
                this._trigger.apply(this, args);
            }
        },
        // 即刻执行订阅
        _instant: function(type, listener, data){
            var o = this._ranCE[type],
                target, args = [];
            if(o !== undefined){
                target = o[0];
                args = [type, target];
                if(o[1]){
                    args.push(o[1]);
                }
                if(data){
                    args.push(data);
                }
                listener.apply(o[0], args);
            }
        },
        // 订阅事件
        subscribe: function(type, listener, data, instant){
            var ce = this._getCE(type);
            if(utils.isBoolean(utils.slice(arguments).pop())){
                instant = data;
                data = undefined;
            }
            ce.subscribe(listener, data);
            // 已发生事件，即刻执行订阅
            if(instant){
                this._instant(type, listener, data);
            }
        },
        // 订阅一次
        _once: function(type, listener, data, instant){
            var _self = this,
            wrapper = function(type, target, args, data){
                _self.unsubscribe(type, listener);
                return listener.apply(_self, arguments);
            };
            this.subscribe(type, wrapper, data, instant);
        },
        // 订阅事件，仅一次
        subscribeOnce: function(type, listener, data, instant){
            // 已发生事件，即刻执行订阅
            if(instant){
                this._instant(type, listener, data);
            } else {
                this._once(type, listener, data, instant);
            }
        },
        // 解除事件
        unbind: function(type){
            this.unsubscribeAll(type);
            delete this._getCE(type);
        },
        // 解除事件订阅
        unsubscribe: function(type, listener){
            var ce = this._getCE(type);
            ce.unsubscribe(type, listener);
        },
        // 解除事件订阅，针对某一事件，解除所有订阅
        unsubscribeAll: function(type){
            var ce = this._getCE(type);
            ce.unsubscribeAll(type);
        }
    };
    
    // 全局域
    if(cem === undefined){
        cem = new CEM(false);
        utils.mix(cem, {
            // 创建或获取域
            // 未名域，name为空
            // 给定obj，扩展对象方法
            domain: function(name, obj, bubble){                
                var _cem;
                if(name){ // 未名域，不托管
                    _cem = domain[name];
                }
                if(_cem === undefined){
                    _cem = new CEM(name, obj, bubble);
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