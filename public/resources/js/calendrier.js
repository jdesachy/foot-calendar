var calApp = angular.module('calApp', ['calModule']);

var calModule = angular.module('calModule', []);

calModule.controller('calCtrl', ['$scope', '$http', function($scope, $http){

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
              console.log(response);
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
        console.log("day: " + day + ", user: " + user + ", participate: " + participate);

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
}]);