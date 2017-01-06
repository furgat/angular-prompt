angular.module('app', ['ui.bootstrap','cgPrompt']);

angular.module('app').controller('DemoCtrl',function($scope,prompt){

    $scope.options = {
        title: 'Title',
        message: 'Message',
        inputs: [], // {name:string, label:string, type:string, values:[string]}
        buttons: ''
    };

    var processOptions = function(){ 
        var options = angular.copy($scope.options);
        
        options.buttons = _.chain(options.buttons.split(','))
            .filter(function(val){
                return val;
            })
            .map(function(val){
                val = val.trim();
                return {label:val,cancel:val.toLowerCase() === 'cancel',primary:val.toLowerCase() === 'ok'};
            })
            .value();
        
        if (options.buttons.length === 0){
            options.buttons = undefined;
        }
        
        for (var i = options.inputs.length;i--;) {
            if (options.inputs[i].values != undefined) {
                options.inputs[i].values = options.inputs[i].values.split(',');
            }
        }
        
        if (options.inputs.length === 0){
            options.inputs = undefined;
        }
        
        return options;
    };
    
    $scope.addInput = function(){
        $scope.options.inputs.push({name:'Name',label:'Label',type:'text',values:''});
    };
    
    $scope.delInput = function(index){
        $scope.options.inputs.splice(index, 1);
    };

    $scope.getCode = function(){
        var options = processOptions();
        return 'prompt(' + JSON.stringify(options,null,'\t') + ').then(function(result){\n\tconsole.log(result);\n});';        
    };

    $scope.go = function(){
        $scope.results = '';

        var options = processOptions();

        prompt(options).then(function(results){
            console.log(results);
            $scope.results = JSON.stringify(results,null,'\t');
        },function(){
            $scope.results = 'Promise rejected';
        });

    };

});