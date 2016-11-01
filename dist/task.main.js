// IDEA: REQUIRE modules
/*
var test = require('test');
*/
var Task = require('./../dist/task')({
  initial:function() {
    console.log('what to do?');
  }
});