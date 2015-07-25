
var express = require('express');
var http = require('http');
var app = express();
var path  = require("path");

app.get('/TakeIt', function(req, res, next){
  res.render('index.html');
});

app.listen(8333);
 
