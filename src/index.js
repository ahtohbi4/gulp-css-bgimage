'use strict';

var through = require('through2');

/**
 * @param {object} config
 * @param {string} config.method - It can be one of two values: 'bgImageCutter' or
 * 'bgImageCutterInvertor'
 */
module.exports = function(config) {
    var methods = {
        bgImageCutter: function (str) {
            return str.replace(/background(?:-image)?[\s]*:.*url\([^\)]*\)[^;\}]*[;\}]/ig, '');
        },
        bgImageCutterInvertor: function (str) {
            return str.replace(/(?:(\{)[^\}]*(background(?:-image)?[\s]*:.*url\([^\)]*\)[^;\}]*[;\}])[^\}]*(\})|(\{)[^\}]*(\}))/ig, '$1$2$3$4$5');
        }
    };

    return through.obj(function (file, enc, callback) {
        if (file.isBuffer()) {
            try {
                file.contents = new Buffer(methods[config.method].call(this, file.contents.toString('utf-8')));
            } catch (err) {
                console.log('Error ', err.name, ': ', err.message, '\n', err.stack);
            }
        }

        this.push(file);

        callback();
    })
};
