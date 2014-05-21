

var MyApp = angular.module('MyApp', ['ngRoute','ui.bootstrap']);

MyApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/features', {templateUrl: 'partials/features.html', controller: 'FeaturesCtrl'});
    $routeProvider.otherwise({redirectTo: '/features'})
}]);


/**
 * ChuckNorrisCtrl (get a random chuck norris joke)
 */
MyApp.controller('FeaturesCtrl', ['$scope','$http', '$interval', function($scope, $http, $interval) {

    $scope.frame = {
        x:0,
        y:0,
        xMax:7,
        yMax:5,
        xMaxLimit:5,
        size:128,
        xPos:0,
        yPos:0
    };

    $scope.getJoke = function() {
        $http.get('/joke/chuckNorris').success(function(data) {
            $scope.data = data;
        });
    };

    $scope.startAnimate = function() {
        $interval(function() {
            $scope.animateSprite();
        },1200);
    };

    $scope.animateSprite = function() {

        if (($scope.frame.xPos < $scope.frame.xMax) ||
            (($scope.frame.yPos == $scope.frame.yMax-1) && ($scope.frame.xPos < $scope.frame.xMaxLimit))) {
            $scope.frame.xPos++;
            $scope.frame.x -= $scope.frame.size;
        } else {
            $scope.frame.xPos = 0;
            $scope.frame.x = 0;
            if ($scope.frame.yPos < $scope.frame.yMax) {
                $scope.frame.yPos++;
                $scope.frame.y -= $scope.frame.size;
            } else {
                $scope.frame.yPos = 0;
                $scope.frame.y = 0;
            }
        }

        if ($scope.frame.x > -($scope.frame.xMax * $scope.frame.size)) {
            $scope.frame.x -= $scope.frame.size;
        } else {
            $scope.frame.x = 0;
            $scope.frame.y -= $scope.frame.size;
        }

    };

}]);


MyApp.directive('bootstrapButton', function() {
    return {
        link: function(scope, elm, attrs) {
            elm.attr('class', 'btn btn-default btn-sm');
        }
    }
});


MyApp.filter('percentage', function() {
    return function(input) {
        if(input == 1) {
            return 100;
        }
        return (input >0.9999)?99.99:(input*100).toFixed(2);
    };
});


var bindFunction = function(fn, obj) {
    return function() {
        return fn.apply(obj, fn);
    }
};




if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g,'');
    };
}