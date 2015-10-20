var express = require('express'),
  cors = require('cors'),
  mongoskin = require('mongoskin'),
  bodyParser = require('body-parser'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  db_uri = process.env.PROD_MONGODB || 'mongodb://@localhost:27017/test',
  port = process.env.PORT || 3000;

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/favicon.ico'));

 var db = mongoskin.db(db_uri, {safe:true})

 var corsOptions = {
   origin: 'http://sdellis.com'
 };

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.param('collectionName', function(req, res, next, collectionName){
  req.collection = db.collection(collectionName)
  return next()
})

app.get('/', cors(), function(req, res, next) {
  //res.send('please select a collection, e.g., /collections/messages')
  res.sendfile('/interface.html');
  path = req.params[0] ? req.params[0] : 'index.html';
  res.sendfile(path, {root: './public/'});
})

app.get('/collections/:collectionName', cors(), function(req, res, next) {
  req.collection.find({} ,{limit: 10, sort: {'_id': -1}}).toArray(function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})

app.post('/collections/:collectionName', cors(), function(req, res, next) {
  // if an @id is supplied use the post-prefix string as the _id and add it to the manifest
  if (typeof req.body["@id"] !== 'undefined') {
    var arr = req.body["@id"].split("/");
    var _id = arr[arr.length-1];
    req.body["_id"] = _id;
  }
  req.collection.insert(req.body, {}, function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})

app.get('/collections/:collectionName/:id', cors(), function(req, res, next) {
  req.collection.findById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send(result)
  })
})

app.put('/collections/:collectionName/:id', cors(), function(req, res, next) {
  req.collection.updateById(req.params.id, {$set: req.body}, {safe: true, multi: false}, function(e, result){
    if (e) return next(e)
    res.send((result === 1) ? {msg:'success'} : {msg: 'error'})
  })
})

app.delete('/collections/:collectionName/:id', cors(), function(req, res, next) {
  req.collection.removeById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send((result === 1)?{msg: 'success'} : {msg: 'error'})
  })
})

app.listen(port, function(){
  console.log('Express server listening on port ' + port)
})
