'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
//support parsing of application/json type post data
app.use(_bodyParser2.default.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    // and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
});
_mongoose2.default.connect('mongodb://localhost/todos');
/*
  Here is where we're going put most of the serve logic
*/
var todoModel = _mongoose2.default.model('todo', {
    todo: String,
    date: {
        type: Date,
        default: Date.now
    }
});

var logError = function logError(error) {
    if (error) throw error;
};
var server = function server() {
    // We do this can send our html and js static files to the browser through the server
    app.use(_express2.default.static('client/public'));
    app.post('/get/all', function (request, response) {
        console.log(request.body.filterVal);
        todoModel.find({ todo: { "$regex": request.body.filterVal, "$options": "i" } }, function (error, todos) {
            //Do your action here..
            logError(error);
            response.send(todos);
        });
    });
    app.get('/save/:todo', function (request, response) {
        var todo = request.params.todo;

        new todoModel({ todo: todo }).save(function (error, savedTodo) {
            logError(error);
            response.send(savedTodo);
        });
    });
    app.get('/remove/:date', function (request, response) {
        var date = request.params.date;

        todoModel.remove({ date: date }, function (error, deletedTodo) {
            logError(error);
            response.send(deletedTodo);
        });
    });

    // 3000 is the port number, this could be any number from  0 to 9999
    app.listen(3000, function () {
        console.log('App listening on port 3000!');
    });
};

exports.default = server;