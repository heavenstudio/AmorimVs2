var app = angular.module('app',['ngRoute']);

//creating route
app.config(['$routeProvider',function($routeProvider){
	$routeProvider.
	when('/',{controller:'loginCTRL', templateUrl:'index.html'});
}]);

