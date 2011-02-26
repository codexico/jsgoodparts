/*
 * resumo do livro
 * Javascript: The Good Parts
 * by Douglas Crockford
 * http://www.amazon.com/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742
 */

////////
// p20 - Object Literals
////////
// um novo objeto
var objeto = {};
// ao tentar obter um member inexistente o retorno eh undefined
objeto.status; // undefined
// pode-se definir um retorno padrao com ||
objeto.status || "vazio"; // "vazio"
// mas o member continua undefined
objeto.status; // undefined

// ao tentar obter o valor de um member undefined acontece um erro
objeto.status.inexistente; // TypeError: objeto.status is undefined
// mesmo se nao existir o membro da para evitar o erro com &&
objeto.status && objeto.status.inexistente; // undefined

// definir valor do membro
objeto.status = "estado";
// nao da mais erro
objeto.status.inexistente; // undefined

objeto.status; // "estado"
objeto.status || "vazio"; // "estado"
//
// usar . eh melhor pois eh mais facil de ler
objeto.status; // "estado"
// usar [] se a string for uma palavra reservada
objeto["status"]; // "estado"

////////
// p22 - objetos sao passados por referencia e nao copiados
////////
var a  = {
    x : 10
}
var b = {};
b = a;
b.x; // 10
b.y = "referencia";
a.y; // "referencia"

////////
// p24 - Enumeration
////////
person = {
    "first-name" : "joao",
    "last-name" : "joao",
    under_score : true,
    idade : 33,
    f : function(){}
};
// obter os itens de um objeto
i = 0;
for (item in person) {
    if (typeof person[item] !== 'function') {
        // nao ha garantia na ordem das propertie
        console.log(item + ' : ' + person[item]);
    }
}
// enumerar as properties garante a ordem no for
properties = [
    "first-name",
    "last-name",
    "under_score",
    "idade",
    "f"
];
for (i = 0; i < properties.length; i += 1) {
    alert(properties[i] + ' : ' + person[properties[i]]);
}

////////
// p25 - Variaveis Globais
////////
// variaveis globais causam conflitos, eh melhor deixar a aplicacao toda
// dentro de uma so para evitar conflitos
var MYAPP = {};
MYAPP.person = {
    "first-name" : "my",
    "last-name" : "app"
};

////////
// p28 - Invocation Patterns
////////

// 1) incluir a funcao na criacao do objeto
var myObject = {
    value: 0,
    increment: function (inc) {
        this.value += typeof inc === 'number' ? inc : 1;
    }
};
myObject.increment(2);//2
console.log(myObject.value);

// 2) incluir a funcao depois do objeto ter sido criado
myObject.dobrar = function () {
    var that = this;    // Workaround.
    var helper = function () {
        that.value = that.value + that.value;
    };
    helper(); // Invoke helper as a function.
};

myObject.increment();//3
myObject.dobrar();//6
console.log(myObject.value);

////////
// p32 - Augmenting Types
////////
// funcao para facilitar inclusao de metodos
Function.prototype.method = function (name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
    }
};
////
// alguns metodos uteis
////

// metodo 'integer' para pegar o inteiro de um numero
Number.method('integer', function (  ) {
    return Math[this < 0 ? 'ceiling' : 'floor'](this);
});
alert((-10 / 3).integer(  ));  // −3
// metodo trim para strings
String.method('trim', function (  ) {
    return this.replace(/^\s+|\s+$/g, '');
});
console.log('"' + "   neat   ".trim(  ) + '"');

////////
// p37 - Closure
////////
var myObject = function () {
    var value = 0;

    return {
        increment: function (inc) {
            value += typeof inc === 'number' ? inc : 1;
        },
        getValue: function (  ) {
            return value;
        }
    }
}(); // value agora so eh acessivel atraves de 'getValue'

////////
// p39 - Avoid creating functions in a loop
////////
// BAD EXAMPLE
var add_the_handlers = function (nodes) {
    var i;
    for (i = 0; i < nodes.length; i += 1) {
        nodes[i].onclick = function (e) {
            alert(i);
        }
    }
};
// BETTER EXAMPLE
var add_the_handlers = function (nodes) {
    var helper = function (i) {
        return function (e) {
            alert(i);
        };
    };
    var i;
    for (i = 0; i < nodes.length; i += 1) {
        nodes[i].onclick = helper(i);
    }
};

////////
// p40 - Module
////////
String.method('deentityify', function (  ) {
    var entity = {
        quot: '"',
        lt:   '<',
        gt:   '>'
    };
    // Return the deentityify method.
    return function (  ) {
        // This is the deentityify method. It calls the string
        // replace method, looking for substrings that start
        // with '&' and end with ';'. If the characters in
        // between are in the entity table, then replace the
        // entity with the character from the table. It uses
        // a regular expression (Chapter 7).
        return this.replace(/&([^&;]+);/g,
        function (a, b) {
            var r = entity[b];
            return typeof r === 'string' ? r : a;
        }
    );
    };
}());

document.writeln('&lt;&quot;&gt;');
document.writeln('&lt;&quot;&gt;'.deentityify(  ));  // <">
////////
// p43 - Curry
////////
//curry eh uma forma de chamar uma funcao com argumentos pre-definidos
Function.method('curry', function (  ) {
    var slice = Array.prototype.slice,
    args = slice.apply(arguments),
    that = this;
    return function (  ) {
        return that.apply(null, args.concat(slice.apply(arguments)));
    };
});
// arguments nao sao arrays, usar slice eh uma maneira de usar concat
var add = function (a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw {
            name: 'TypeError',
            message: 'add needs numbers'
        }
    }
    return a + b;
}
var add1 = add.curry(1);
alert(add1(6))

////////
// p61 - Array
////////
var is_array = function (value) {
    return Object.prototype.toString.apply(value) === '[object Array]';
};

////////
// p66 - Regex
////////
var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
var url = "http://www.ora.com:80/goodparts?q&asdf=qer#!fragment";
var result = parse_url.exec(url);
var names = ['url', 'scheme', 'slash', 'host', 'port',
    'path', 'query', 'hash'];
var blanks = '       ';
var i;
for (i = 0; i < names.length; i += 1) {
    console.log(names[i] + ' : ' +
        blanks.substring(names[i].length), result[i]);
}

////////
// p80 - Methods
////////
// sort numeros e strings ao mesmo tempo
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
var m = ['aa', 'bb', 'a', 4, 8, 15, 16, 23, 42];
m.sort(sortNumbersAndStrings);

// Function by takes a member name string and returns
// a comparison function that can be used to sort an
// array of objects that contain that member.
var by = function (name) {
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

var s = [
    {first: 'Joe',   last: 'Besser'},
    {first: 'Moe',   last: 'Howard'},
    {first: 'Joe',   last: 'DeRita'},
    {first: 'Shemp', last: 'Howard'},
    {first: 'Larry', last: 'Fine'},
    {first: 'Curly', last: 'Howard'}
];
s.sort(by('first'));


// Function by takes a member name string and an
// optional minor comparison function and returns
// a comparison function that can be used to sort an
// array of objects that contain that member. The
// minor comparison function is used to break ties
// when the o[name] and p[name] are equal.
var byTwoKeys = function (name, minor) {
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

s.sort(byTwoKeys('last', byTwoKeys('first')));

////////
// p86 - Methods - Regex
////////
// Break a simple html text into tags and texts.
// (See string.replace for the entityify method.)

// For each tag or text, produce an array containing
// [0] The full matched tag or text
// [1] The tag name
// [2] The /, if there is one
// [3] The attributes, if any
String.method('entityify', function (  ) {

    var character = {
        '<' : '&lt;',
        '>' : '&gt;',
        '&' : '&amp;',
        '"' : '&quot;'
    };

// Return the string.entityify method, which
// returns the result of calling the replace method.
// Its replaceValue function returns the result of
// looking a character up in an object. This use of
// an object usually outperforms switch statements.

    return function (  ) {
        return this.replace(/[<>&"]/g, function (c) {
            return character[c];
        });
    };
}(  ));
var text = '<html><body bgcolor=linen><p>' +
        'This is <b>bold<\/b>!<\/p><\/body><\/html>';
var tags = /[^<>]+|<(\/?)([A-Za-z]+)([^<>]*)>/g;
var a, i;

while ((a = tags.exec(text))) {
    for (i = 0; i < a.length; i += 1) {
        document.writeln(('// [' + i + '] ' + a[i]).entityify(  ));
    }
    document.writeln(  );
}


////////
// p104 - typeof
////////
// null
my_value === null
// objeto
if (my_value && typeof my_value === 'object') {
    // my_vale eh objeto ou array
}
// number
var isNumber = function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
}
var isArray = function isArray(value) {
    // lembrar que arguments nao eh array e retorna false
    return Object.prototype.toString.apply(value) === '[object Array]';
}


//dica final
// jslint
