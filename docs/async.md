```js
require('async').series([
            function (callback) {
                var total = 0;
                for (let i = 0; i <= 1000000; i++) {
                    total += i;
                }
                callback(null, total);
            },
            function (callback) {
                callback(null, 'two');
            }
        ],
        function (err, results) {
            console.log(0);
            console.log(results);
            console.log(2);
            console.log(results[1]);
        });
```