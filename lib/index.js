;
(function () {
    'use strict'

    var isBrowser = new Function("try {return this===window}catch(e){ return false}");
    if (!isBrowser() || !window.fetch) return;

    fetchPolyfill();

    ////////////////////////////////////////////////////////////////////////////
    //
    //  fetch polyfill func
    //
    ////////////////////////////////////////////////////////////////////////////
    function fetchPolyfill() {
        var fetchBak = window.fetch;

        window.fetch = function (reqOrUrl, options) {
            var method = getValFromOpt(options, 'method', '');

            if (method.toLowerCase() == 'jsonp') {
                return jsonp(reqOrUrl, options);
            } else {
                return fetchBak.apply(window, arguments);
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    //  jsonp func
    //
    ////////////////////////////////////////////////////////////////////////////
    function jsonp(reqOrUrl, options) {
        if (!reqOrUrl) {
            new Error("1 argument required, but only 0 present");
            return null;
        }

        return new Promise(function (resolve, reject) {
            // create cache data
            var id = generateId();
            var timeout = getValFromOpt(options, 'callback', 8000) << 0;
            var callback = getValFromOpt(options, 'callback') || getValFromOpt(options, 'cb') || 'callback';
            var callbackName = getValFromOpt(options, 'callbackName', id);
            var tid = setTimeout(function () { destroy(', it is timeout'); }, timeout);

            // generate url
            var url = typeof reqOrUrl === 'object' ? reqOrUrl.url : reqOrUrl + '';
            url += (url.indexOf('?') > 0 ? '&' : '?').replace('?&', '?');
            url += callback + '=' + callbackName;

            // create script tag
            var head = document.getElementsByTagName('head')[0] || document.head;
            var script = document.createElement('script');
            script.src = url;
            script.onerror = destroy;
            head.appendChild(script);

            window[callbackName] = function (res) {
                resolve(new Response(res, url));
                destroy();
            }

            // destroy func
            function destroy(msg) {
                try {
                    deleteFromWin(callbackName);
                    script.parentNode.removeChild(script);
                    clearTimeout(tid);
                } catch (e) { }

                msg = msg || '';
                reject(new Error('JSONP request to ' + url + msg));
            }
        })
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    //  Response
    //
    ////////////////////////////////////////////////////////////////////////////
    function Response(res, url) {
        this.ok = true;
        this.status = 200;
        this.type = 'default';
        this.url = url || '';
        this.statusText = 'OK';
        this.bodyUsed = false;
        this._bodyText = res;
    }

    Response.prototype = {
        text: function () {
            this.bodyUsed = true;
            return Promise.resolve(this._bodyText);
        },

        json: function () {
            this.bodyUsed = true;
            return Promise.resolve(toJson(this._bodyText));
        },

        clone: function () {
            return new Response(this._bodyText, url);
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    //  generate Id
    //
    ////////////////////////////////////////////////////////////////////////////
    var index = 0;
    function generateId() {
        return 'jsonpcallback_' + ~~(Math.random() * Math.pow(10, 7)) + '_' + (++index);
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    //  delete window custom props
    //
    ////////////////////////////////////////////////////////////////////////////
    function deleteFromWin(key) {
        try {
            delete window[key];
        } catch (e) { window[key] = undefined }
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    //  get value from options 
    //
    ////////////////////////////////////////////////////////////////////////////
    function getValFromOpt(options, key, defaultVal) {
        defaultVal = defaultVal !== undefined ? defaultVal : null;
        if (options && typeof options === 'object') return options[key] !== undefined ? options[key] : defaultVal;
        return defaultVal;
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    //  convert to json data
    //
    ////////////////////////////////////////////////////////////////////////////
    function toJson(res) {
        if (typeof ref === 'string') {
            try {
                return JSON.parse(res);
            } catch (e) {
                return eval('(' + res + ')');
            } finally {
                return res;
            }
        } else {
            return res;
        }
    }

})()