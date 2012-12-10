/**
* 工具类
*/

AE.define('common.utils', function(){
    var toString = Object.prototype.toString,
    
    utils = {
        isArray: function(o){
            return toString.call(o) === '[object Array]';
        },
        slice: function(o){
            var slice = Array.prototype.slice;
            return slice.apply(o, slice.call(arguments, 1));
        },
        isBoolean: function(o){
            return toString.call(o) === '[object Boolean]';
        },
        isObject: function(o){
            return toString.call(o) === '[object Object]';
        },
        mix: function(dst, srcs, overwrite){
            var i, len, src, key;
            srcs = this.slice(arguments, 1);
            overwrite = this.isBoolean(srcs[srcs.length - 1]) ? srcs.pop() : false;
            
            for(i = 0, len = srcs.length; i <  len; i++){
                src = srcs[i];
                for(key in src){
                    if(src.hasOwnProperty(key)){
                        if(!dst.hasOwnProperty(key) || overwrite){
                            dst[key] = src[key];
                        }
                    }
                }
            }
        }
    };
    
    return utils;
});
