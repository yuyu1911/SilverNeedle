var SilverNeedle = function(config){
    var win = window,
    doc = document,
    nav = win.navigator,
    ret = {},
    mediaFormats = {
        video : {
            'mpeg4' : 'video/mp4; codecs="mp4v.20.8"',
            'h264' : 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
            'ogg' : 'video/ogg; codecs="theora"',
            'webm' : 'video/webm; codecs="vp8"'
        },
        audio : {
            'wav' : 'audio/wav; codecs="1"',
            'mp3' : 'audio/mpeg',
            'AAC' : 'audio/mp4; codecs="mp4a.40.2"',
            'ogg' : 'audio/ogg; codecs="vorbis"',
            'webM' : 'audio/webm; codecs="vorbis"'
        }
    },
    _testMedia = function(type){
        var ret = false,
        newElement = doc.createElement(type),
        isSupport = !!newElement.canPlayType,
        formatObject = mediaFormats[type],
        testFormat;
        if(isSupport){
            ret = {};
            testFormat = function(format){
                return newElement.canPlayType(format) == 'probably';
            }
            for(var f in formatObject){
                ret[f] = testFormat(formatObject[f]);
            }
        }
        return ret;
    },
    formTests = {
        inputTypes : function(){
            var ret = {},
            types = ['search','number','range','color','tel','url','email','date','month','week','time','datetime','datetime-local'],
            l = types.length,
            input = doc.createElement('input'),
            type;
            while(l--){
                type = types[l];
                input.setAttribute('type',type);
                if(input.type !== type){
                    ret[type] = false;
                }
                else{
                    ret[type] = true;
                }
            }
            return ret;
        },
        inputAttributes : function(){
            var ret = {},
            newInput = doc.createElement('input'),
            atttibutes = ['autocomplete','autofocus','list','placeholder','max',
            'min','multiple','pattern','required','step',
            'form','formAction','formEnctype','formMethod','formNoValidate',
            'formTarget'],
            l = atttibutes.length,
            atttibute;
            while(l--){
                atttibute = atttibutes[l];
                if(atttibute in newInput){
                    ret[atttibute] = true;
                }
                else{
                    ret[atttibute] = false;
                }
            }
            return ret;
        },
        datalist : function(){
            var element = doc.createElement('datalist');
            return !!((typeof HTMLDataListElement != 'undefined' && element instanceof HTMLDataListElement) || element.childNodes.length);
        },
        keygen : function(){
            var element = doc.createElement('keygen');
            return !!((typeof HTMLKeygenElement != 'undefined' && element instanceof HTMLKeygenElement) || element.childNodes.length);
        },
        output : function(){
            var element = doc.createElement('output');
            return typeof HTMLOutputElement != 'undefined' && element instanceof HTMLOutputElement;
        },
        progress : function(){
            var element = doc.createElement('progress');
            return typeof HTMLProgressElement != 'undefined' && element instanceof HTMLProgressElement;
        },
        meter : function(){
            var element = doc.createElement('meter');
            return typeof HTMLMeterElement != 'undefined' && element instanceof HTMLMeterElement;
        }
    },
    otherTests = {
        canvas : function(){
            var newCanvasElement = doc.createElement('canvas'),
            isSupportCanvas = !!newCanvasElement.getContext,
            context2D,
            result = false;
            if(isSupportCanvas){
                context2D = newCanvasElement.getContext('2d');
                result = {
                    support2D : typeof CanvasRenderingContext2D != 'undefined' && context2D instanceof CanvasRenderingContext2D,
                    text : typeof context2D.fillText == 'function'
                }
            }
            return result;
        },
        video : function(){
            return _testMedia('video');
        },
        audio : function(){
            return _testMedia('audio');
        },
        //本地存储
        localStorage : function(){
            try {
                return ('localStorage' in win) && win.localStorage !== null;
            } catch(e) {
                return false;
            }
        },
        sessionstorage : function(){
            try {
                return ('sessionStorage' in win) && win.sessionStorage !== null;
            } catch(e){
                return false;
            }
        },
        webSQLDatabase : function(){
            return !!win.openDatabase;
        },
        indexedDB : function(){
            return 'indexedDB' in win || 'webkitIndexedDB' in win || 'mozIndexedDB' in win || 'moz_indexedDB' in win;
        },
        webWorkers : function(){
            return !!win.Worker;
        },
        //离线web应用
        applicationCache : function(){
            return !!win.applicationCache;
        },
        //地理位置
        geolocation : function(){
            return !!nav.geolocation;
        }
    },
    _aoe = function(a,fns){
        var l = a.length,
        target;
        if(l>0){
            for(var i=0;i<l;i++){
                try{
                    target = a[i];
                    if(!(target in ret)){
                        ret[target] = fns[target].call(null);
                    }
                }catch(e){
                    
                }finally{
                    continue;
                }
            }
        }
    },
    _stab = function(o){
        var formTestsArray = o.form,
        otherTestsArray = o.other;
        _aoe(formTestsArray, formTests);
        _aoe(otherTestsArray, otherTests);
    },
    _stabAll = function(){
        for(var f in formTests){
            ret[f] = formTests[f].call(null);
        }
        for(var o in otherTests){
            ret[o] = otherTests[o].call(null);
        }
    },
    _stabForm = function(){
        for(var f in formTests){
            ret[f] = formTests[f].call(null);
        }
    },
    init = function(){
        if(!config){
            _stabAll();
        }
        else if(config === 'form'){
            _stabForm();
        }
        else{
            _stab(config);
        }
        ret['stab'] = _stab;
    }();
    return ret;
};