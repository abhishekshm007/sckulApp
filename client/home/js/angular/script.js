'use strict';

var app = angular.module('sckulApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider

    // route for the home page
    .when('/', {
        templateUrl : 'home.html',
    })

    // route for the about page
    .when('/join_us', {
        templateUrl : 'join_us.html',
        controller  : 'JoinUsController'
    })
    .when('/registration_success', {
        templateUrl : 'reg_success.html'
    })

    .otherwise({templateUrl: 'home.html'});
});

app.factory('AppService', function() {
  return {
      url : 'http://localhost:3000/api/'
  };
});

app.directive('eatClick', function() {
    return function(scope, element, attrs) {
        $(element).click(function(event) {
            event.preventDefault();
        });
    }
})


app.controller('JoinUsController', ['$scope', '$http', '$location', 'AppService', function($scope, $http, $location, AppService){
    $scope.school = {};

    $scope.registerSchool = function(){
        var request = $http({
            method: "post",
            url: AppService.url+"Schools",
            data: $scope.school
        });
        alert(JSON.stringify($scope.school));
        request.then(function(res){
            if(res.data.status == 200){
                $location.path('registration_success');
            }else{
                alert(res.data.message);
            }
        }, function(err){
            alert(err.data.error.message);
        });
    }

}]);
