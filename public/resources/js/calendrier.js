var calApp = angular.module('calApp', ['calModule']);

var calModule = angular.module('calModule', []);

calModule.controller('calCtrl', ['$scope', '$http', function($scope, $http){

    $scope.now = new Date();
    $scope.popupRatingClass= "popup-close";
    $scope.popupTeamClass= "popup-close";
    $scope.days = [];
    $scope.users = [];
    $scope.userCreation = "";

    var callBackoffice = function(day){
        var action = "";
        if(day){
            action = "/calendar/"+day;
        }else{
            action = "/";
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
            action = "/calendar/" + day + "/adduser/" + user; 
        }else{
            action = "/calendar/" + day + "/removeuser/" + user;
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
                url: "/user/"+$scope.userCreation,
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
                url: "/deleteuser/"+user,
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
    
    $scope.openRatingPopup = function(day){
        if(day){
            $scope.popupRatingClass = "popup popup-open";
            $scope.evaluateDay = day;
            $http({
                method: 'GET',
                url: "/vote/" + day,
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

    $scope.team1 = [];
    $scope.team2 = [];
    $scope.openTeamPopup = function(day){
        if(day){
            $scope.popupTeamClass = "popup popup-open";
            $http({
                method: 'GET',
                url: "/team/" + day,
                headers: {'Content-Type': 'application/json'}
              }).then(function successCallback(response) {
                    $scope.team1 = response.data.team1;
                    $scope.team2 = response.data.team2;
                    return 1;
              }, function errorCallback(response) {
                  return 0;
              }); 
        }
    }

    $scope.closeTeamPopup = function(){
        $scope.popupTeamClass = "popup popup-close";
        $scope.team1 = [];
        $scope.team2 = [];
    }

    $scope.closeRatingPopup = function(){
        $scope.popupRatingClass = "popup popup-close";
        $scope.evaluateDay = "";
        $scope.allowUsers = [];
        $scope.ratings = [];
        $scope.ratingUser="";
    }

    $scope.sendNote = function(){
        $http({
            method: 'POST',
            url: "/vote/"+$scope.evaluateDay+"/user/"+$scope.ratingUser,
            data: {
                rating: $scope.ratings
            },
            headers: {'Content-Type': 'application/json'}
        }).then(function successCallback(response) {
            $scope.closeRatingPopup();
            angular.forEach(response.data.result, function(value, key){
                angular.forEach($scope.users, function(v, k){
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