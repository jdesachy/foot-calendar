var calApp = angular.module('calApp', ['calModule']);

var calModule = angular.module('calModule', []);

calModule.controller('calCtrl', ['$scope', '$http', function($scope, $http){

    $scope.now = new Date();
    $scope.popupClass= "popup-close";
    $scope.days = [];
    $scope.users = [];
    $scope.userCreation = "";

    var callBackoffice = function(day){
        var action = "";
        if(day){
            action = "http://localhost:8080/calendar/"+day;
        }else{
            action = "http://localhost:8080";
        }
        $http({
            method: 'GET',
            url: action,
            headers: {'Content-Type': 'application/json'}
          }).then(function successCallback(response) {
              $scope.days = response.data.calendar;
              $scope.users = response.data.users;
              return 1;
          }, function errorCallback(response) {
              return 0;
          }); 
    }
    callBackoffice();

    $scope.loadCal = function(day){
        callBackoffice(day);
    }

    $scope.update = function(startDay, day, user, participate){
        var action = "";
        if(!participate){
            action = "http://localhost:8080/calendar/" + day + "/adduser/" + user; 
        }else{
            action = "http://localhost:8080/calendar/" + day + "/removeuser/" + user;
        }
        
        $http({
            method: 'POST',
            url: action,
            data: {
                start: startDay
            },
            headers: {'Content-Type': 'application/json'}
          }).then(function successCallback(response) {
              $scope.days = response.data.calendar;
              $scope.users = response.data.users;
              return 1;
          }, function errorCallback(response) {
              return 0;
          }); 
    }

    $scope.createUser = function(startDay){
        if($scope.userCreation != ""){
            $http({
                method: 'POST',
                url: "http://localhost:8080/user/"+$scope.userCreation,
                data: {
                    start: startDay
                },
                headers: {'Content-Type': 'application/json'}
              }).then(function successCallback(response) {
                $scope.userCreation = "";
                  $scope.days = response.data.calendar;
                  $scope.users = response.data.users;
                  return 1;
              }, function errorCallback(response) {
                  return 0;
              }); 
        }
    }

    $scope.deleteUser = function(startDay, user){
        if(user != ""){
            $http({
                method: 'POST',
                url: "http://localhost:8080/deleteuser/"+user,
                data: {
                    start: startDay
                },
                headers: {'Content-Type': 'application/json'}
              }).then(function successCallback(response) {
                  $scope.days = response.data.calendar;
                  $scope.users = response.data.users;
                  return 1;
              }, function errorCallback(response) {
                  return 0;
              }); 
        }
    }
    $scope.evaluateDay = "";
    $scope.allowUsers = [];
    $scope.ratings = [];
    $scope.ratingUser="";
    
    $scope.openPopup = function(day){
        if(day){
            $scope.popupClass = "popup popup-open";
            $scope.evaluateDay = day;
            $http({
                method: 'GET',
                url: "http://localhost:8080/vote/" + day,
                headers: {'Content-Type': 'application/json'}
              }).then(function successCallback(response) {
                    $scope.allowUsers = response.data.users;
                    var players = [];
                    players = response.data.players;
                    for(let p of players){
                        $scope.ratings.push({"name": p, "note": 10});
                    }
                    return 1;
              }, function errorCallback(response) {
                  return 0;
              }); 
        }
    }

    $scope.closePopup = function(){
        $scope.popupClass = "popup popup-close";
        $scope.evaluateDay = "";
        $scope.allowUsers = [];
        $scope.ratings = [];
        $scope.ratingUser="";
    }

    $scope.sendNote = function(){
        $http({
            method: 'POST',
            url: "http://localhost:8080/vote/"+$scope.evaluateDay+"/user/"+$scope.ratingUser,
            data: {
                rating: $scope.ratings
            },
            headers: {'Content-Type': 'application/json'}
        }).then(function successCallback(response) {
            $scope.closePopup();
            angular.forEach(response.data.result, function(value, key){
                angular.forEach($scope.users, function(v, k){
                    console.log("value: " + v.name +"#"+v.avg+", key: " + k);
                    if(v.name==value.name){
                        v.avg=value.avg;
                    }
                });
                
            });
            return 1;
        }, function errorCallback(response) {
            console.log(response);
            return 0;
        }); 
    }
}]);