# fetch-jsonp-polyfill

JSONP is NOT supported in standard Fetch API.If you are sleepy for such a problem, please use this Polyfill.

## Installation
You can install with npm.
```
npm install fetch-jsonp-polyfill --save-dev
```

## Notice
He can be compatible with almost all current jsonp polyfills, including[https://github.com/github/fetch](https://github.com/github/fetch) [https://github.com/matthew-andrews/isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) [https://github.com/bitinn/node-fetch](https://github.com/bitinn/node-fetch) and many more.

Please note that they must be imported after them.

```
require('isomorphic-fetch');
require('fetch-jsonp-polyfill');
```


## Usage
You don't need to make any changes, just modify the `method:'GET'` to `method:'JSONP'`.
In this way, I didn't modify any native code.
```
var URL = 'http://jsfiddle.net/echo/jsonp/';

fetch(URL, {
    method: "JSONP"
})
.then(res => res.json())
.then(data => {
    console.log(data);
})
.catch(err => {
    console.log(err);
});
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