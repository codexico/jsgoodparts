// funcao para facilitar inclusao de metodos
Function.prototype.method = function (name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
    }
};

Number.method('integer', function (  ) {
    return Math[this < 0 ? 'ceiling' : 'floor'](this);
});

String.method('trim', function (  ) {
    return this.replace(/^\s+|\s+$/g, '');
});

// This is the deentityify method. It calls the string
// replace method, looking for substrings that start
// with '&' and end with ';'. If the characters in
// between are in the entity table, then replace the
// entity with the character from the table.
String.method('deentityify', function () {
    var entity = {
        quot: '"',
        lt:   '<',
        gt:   '>'
    };
    return function () {
        return this.replace(/&([^&;]+);/g,
        function (a, b) {
            var r = entity[b];
            return typeof r === 'string' ? r : a;
        }
    );
    };
}());

// Return the string.entityify method, which
// returns the result of calling the replace method.
// Its replaceValue function returns the result of
// looking a character up in an object. This use of
// an object usually outperforms switch statements.
String.method('entityify', function () {
    var character = {
        '<' : '&lt;',
        '>' : '&gt;',
        '&' : '&amp;',
        '"' : '&quot;'
    };
    return function () {
        return this.replace(/[<>&"]/g, function (c) {
            return character[c];
        });
    };
}());

//curry eh uma forma de chamar uma funcao com argumentos pre-definidos
Function.method('curry', function () {
    var slice = Array.prototype.slice,
    args = slice.apply(arguments),
    that = this;
    return function () {
        return that.apply(null, args.concat(slice.apply(arguments)));
    };
});




var isNumber = function (value) {
    return typeof value === 'number' && isFinite(value);
};

//diferencia obketos e arrays de null
var isObjectOrArray = function (value) {
    return value && typeof value === 'object';
};

var isArray = function (value) {
    // lembrar que arguments nao eh array e retorna false
    return Object.prototype.toString.apply(value) === '[object Array]';
};

var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
// exemplo de uso do parse_url
//var result = parse_url.exec("http://www.ora.com:80/goodparts?q&asdf=qer#!fragment");
//var names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
//for (var i = 0; i < names.length; i += 1) {
//    console.log(names[i] + " : ", result[i]);
//}
var parse_number = /^-?\d+(?:\.\d*)?(?:e[+\-]?\d+)?$/i;

var sortNumbersAndStrings = function (a, b) {
    if (a === b) {
        return 0;
    }
    if (typeof a === typeof b) {
        if (a < b) {
            return -1;
        } else {
            return 1;
        }
    }
    if (typeof a < typeof b) {
        return -1;
    } else {
        return 1;
    }
};
// exemplo:
//var m = ['aa', 'bb', 'a', 4, 8, 15, 16, 23, 42];
//m.sort(sortNumbersAndStrings);

// sortArrayOfObjectsBy takes a member name string and returns
// a comparison function that can be used to sort an
// array of objects that contain that member.
var sortArrayOfObjectsBy = function (name) {
    return function (o, p) {
        var a, b;
        if (typeof o === 'object' && typeof p === 'object' && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
                return 0;
            }
            if (typeof a === typeof b) {
                if (a < b) {
                    return -1;
                } else {
                    return 1;
                }
            }
            if (typeof a < typeof b) {
                return -1;
            } else {
                return 1;
            }
        } else {
            throw {
                name: 'Error',
                message: 'Expected an object when sorting by ' + name
            };
        }
    };
};
// exemplo:
//var s = [
//    {first: 'Joe',   last: 'Besser'},
//    {first: 'Moe',   last: 'Howard'},
//    {first: 'Joe',   last: 'DeRita'},
//    {first: 'Shemp', last: 'Howard'},
//    {first: 'Larry', last: 'Fine'},
//    {first: 'Curly', last: 'Howard'}
//];
//s.sort(sortArrayOfObjectsBy('first'));

// sortArrayOfObjectsByTwoKeys takes a member name string and an
// optional minor comparison function and returns
// a comparison function that can be used to sort an
// array of objects that contain that member. The
// minor comparison function is used to break ties
// when the o[name] and p[name] are equal.
var sortArrayOfObjectsByTwoKeys = function (name, minor) {
    return function (o, p) {
        var a, b;
        if (o && p && typeof o === 'object' && typeof p === 'object') {
            a = o[name];
            b = p[name];
            if (a === b) {
                return typeof minor === 'function' ? minor(o, p) : 0;
            }
            if (typeof a === typeof b) {
                if (a < b) {
                    return -1;
                } else {
                    return 1;
                }
            }
            if (typeof a < typeof b) {
                return -1;
            } else {
                return 1;
            }
        } else {
            throw {
                name: 'Error',
                message: 'Expected an object when sorting by ' + name
            };
        }
    };
};
//exemplo:
//s.sort(sortArrayOfObjectsByTwoKeys('last', sortArrayOfObjectsByTwoKeys('first')));
