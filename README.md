# fetch-jsonp-polyfill

Native fetch api does not support jsonp, which is often very confusing. If you are persistent to use jsonp in fetch, you may wish to use this polyfill

## Installation
You can install with npm.
```
npm install fetch-jsonp-polyfill --save-dev
```

## Notice
It is compatible with almost all mainstream jsonp polyfills libraries. E.g [https://github.com/github/fetch](https://github.com/github/fetch) [https://github.com/matthew-andrews/isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) [https://github.com/bitinn/node-fetch](https://github.com/bitinn/node-fetch)

##### But it is important to note that you must import 'fetch-jsonp-polyfill' after them.

```
require('isomorphic-fetch')
require('fetch-jsonp-polyfill')

or 
import 'whatwg-fetch'
import 'fetch-jsonp-polyfill'
```


## Usage
You don't need to make any changes, just modify the `method:'GET'` to `method:'JSONP'`.
So simple, in fact I have almost no modifications.

```
fetch('http://jsfiddle.net/echo/jsonp/?hello=world', {
    method: "JSONP"
})
.then(res => res.json())
.then(data => {
    console.log(data);
})
.catch(err => {
    console.log(err);
})
```

## Other Options
```
fetch(URL, {
    method: 'JSONP',
    timeout: 5000,
    callback: 'callback',
    callbackName: 'fetchjsonp_callback',
})
```

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_7-8/internet-explorer_7-8_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | 9+ ✔ | Latest ✔ | 6.1+ ✔ |

## License

MIT