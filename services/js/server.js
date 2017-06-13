import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser'
var app = express();
//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    // and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
});
mongoose.connect('mongodb://0.0.0.0/todos');
/*
  Here is where we're going put most of the serve logic
*/
let todoModel = mongoose.model('todo',{
    todo:String,
    date: {
        type: Date,
        default: Date.now
    }
});

var logError = (error)=>{
     if(error)
        throw error;
}
var server = () => {
    // We do this can send our html and js static files to the browser through the server
    app.use(express.static('client/public'))
    app.post('/get/all',(request,response)=>{
        console.log(request.body.filterVal)
        todoModel.find({todo: {"$regex": request.body.filterVal, "$options": "i"}}, (error,todos)=>{
            //Do your action here..
            logError(error);
            response.send(todos);
        });
        
    })
    app.get('/save/:todo',(request,response)=>{
        let {todo} = request.params
        new todoModel({todo}).save((error,savedTodo)=>{
            logError(error);
            response.send(savedTodo);
        })
    })
    app.get('/remove/:date',(request,response)=>{
        let {date} = request.params
        todoModel.remove({date},(error,deletedTodo)=>{
            logError(error);
            response.send(deletedTodo);
        })
    })

    // 3000 is the port number, this could be any number from  0 to 9999
    app.listen(3000, () => {
        console.log('App listening on port 3000!')
    })
}

export default server;
