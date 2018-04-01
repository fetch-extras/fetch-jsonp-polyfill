require('../libs/index.js');

var URL = 'http://jsfiddle.net/echo/jsonp/';

test('test jsonp fetch', () => {
    fetch(URL, {
        //method: "JSONP"
    }).then(res => {
        console.log(res);
        expect(res.json()).toBe(3);
    });
})

// test('test jsonp callbackName', () => {
//     fetch(URL, {
//         method: "JSONP",
//         callbackName: "hello_fetch_jsonp"
//     }).then(res => {
//         console.log(res);
//         expect(res.json()).toBe(3);
//     });
// })