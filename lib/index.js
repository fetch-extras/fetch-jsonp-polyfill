;
(function () {
    'use strict';

    const fetchBak = window.fetch
    let index = 0

    window.fetch = function (reqOrUrl, options) {
        const method = getValFromOpt(options, 'method', '')

        if (method.toLowerCase() == 'jsonp') {
            return jsonp(reqOrUrl, options)
        } else {
            return fetchBak.apply(window, arguments)
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    //  jsonp func
    //
    ////////////////////////////////////////////////////////////////////////////
    function jsonp(reqOrUrl, options) {
        if (!reqOrUrl) {
            printfError("1 argument required, but only 0 present")
            return null
        }

        return new Promise((resolve, reject) => {
            // create cache data
            const id = generateId()
            const timeout = getValFromOpt(options, 'callback', 8000) << 0
            const callback = getValFromOpt(options, 'callback') || getValFromOpt(options, 'cb') || 'callback'
            const callbackName = getValFromOpt(options, 'callbackName', id)
            const tid = setTimeout(()=>{destroy(', it is timeout')}, timeout)

            // generate url
            let url = typeof reqOrUrl === 'object' ? reqOrUrl.url : reqOrUrl + ''
            url += (url.indexOf('?') > 0 ? '&' : '?').replace('?&', '?')
            url += callback + '=' + callbackName

            // create script tag
            const head = document.getElementsByTagName('head')[0] || document.head
            const script = document.createElement('script')
            script.src = url
            script.onerror = destroy
            head.appendChild(script)

            window[callbackName] = (res) => {
                resolve(new Response(res, url))
                destroy()
            }

            // destroy func
            function destroy(msg) {
                try {
                    deleteFromWin(callbackName)
                    script.parentNode.removeChild(script)
                    clearTimeout(tid)
                } catch (e) { }

                reject(new Error(`JSONP request to ${url}${msg || ''}`))
            }
        })
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    //  Response
    //
    ////////////////////////////////////////////////////////////////////////////
    function Response(res, url) {
        this.ok = true
        this.status = 200
        this.type = 'default'
        this.url = url || ''
        this.statusText = 'OK'
        this.bodyUsed = false
        this._bodyText = res
    }

    Response.prototype = {
        text: function () {
            this.bodyUsed = true
            return Promise.resolve(this._bodyText)
        },

        json: function () {
            this.bodyUsed = true
            return Promise.resolve(toJson(this._bodyText))
        },

        clone: function () {
            return new Response(this._bodyText, url)
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    //  generate Id
    //
    ////////////////////////////////////////////////////////////////////////////
    function generateId() {
        return `jsonpcallback_${~~(Math.random() * Math.pow(10, 7))}_${++index}`
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    //  delete window custom props
    //
    ////////////////////////////////////////////////////////////////////////////
    function deleteFromWin(key) {
        try {
            delete window[key]
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
                return JSON.parse(res)
            } catch (e) {
                return eval(`(${res})`)
            } finally {
                return res
            }
        } else {
            return res
        }
    }

    function printfError() {
        window.console && console.error.apply(console, arguments)
    }

})();