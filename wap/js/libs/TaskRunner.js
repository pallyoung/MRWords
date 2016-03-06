
(function (){
  "use strict"
  function TaskRunner(tasks){
    this.tasks = tasks ||[];
    this.status = 0;
    this.indicator = [];
  }
  TaskRunner.prototype = {
    _taskFinished:function(cb){
      this.indicator.pop();
      if(this.indicator.length == 0){
        cb();
      }
    },
    run:function(){
      var tasks = this.tasks;
      var result = null;
      var self = this;
      return new Promise(function(resolve,reject){
        if(tasks.length===0){
          resolve();
          return ;
        }
        for(var i = 0;i<tasks.length;i++){
          self.indicator.push(true);
           try{
              result = tasks[i].call();
           }catch(e){
            console.log(e);
           }
          if(result&& (result instanceof Promise ||typeof result.then==="function") ){
            result.then(function(){
              self._taskFinished(resolve);
            });
          }else{
            self._taskFinished(resolve);
          }
        }
      });
    },
    addTask:function(task){
      this.tasks.push(task);
    }
  }
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return TaskRunner;
    });
  } else if (typeof exports !== 'undefined') {
    exports.TaskRunner = TaskRunner;
  } else {
    window.TaskRunner = TaskRunner;
  }
})()

