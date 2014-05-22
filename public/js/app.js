

var MyApp = angular.module('MyApp', ['ngRoute','ui.bootstrap']);

MyApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/features', {templateUrl: 'partials/features.html', controller: 'FeaturesCtrl'});
    $routeProvider.when('/mylist', {templateUrl: 'partials/myList.html', controller: 'MyListCtrl'});
    $routeProvider.otherwise({redirectTo: '/features'})
}]);


MyApp.controller('MyListCtrl',['$scope', function($scope) {

    $scope.entryfield = '';

    $scope.collection = {};
    $scope.sortedList = [];

    $scope.handleSubmit = function() {
        var val = document.getElementById('entryfield').value;
        var item = $scope.collection[val];

        if (item) {
            $scope.collection[val]++;
        } else {
            $scope.collection[val] = 1;
        }

        $scope.sortedList = [];

        for (var i in $scope.collection) {
            $scope.sortedList.push( {key:i, val:$scope.collection[i]} );
        }
    }

}]);


/**
 * ChuckNorrisCtrl (get a random chuck norris joke)
 */
MyApp.controller('FeaturesCtrl', ['$scope','$http', '$interval', function($scope, $http, $interval) {

    $scope.animationPromise = null;

    $scope.getAnimateButtonText = function() {
        return $scope.animationPromise == null ? "animate": "pause";
    };

    $scope.performAnimationFunction = function() {
        if ($scope.animationPromise == null) {
            $scope.startAnimate();
        } else {
            $scope.pauseAnimation();
        }
    };

    $scope.frame = {
        x:0,
        y:0,
        size:128,
        getXPos: function() {
            return -1 * this.x * this.size;
        },
        getYPos: function() {
            return -1 * this.y * this.size;
        }
    };

    $scope.getJoke = function() {
        $http.get('/joke/chuckNorris').success(function(data) {
            $scope.data = data;
        });
    };

    $scope.startAnimate = function() {
        $scope.animationPromise = $interval(function() {
            $scope.animateSprite();
        },40);
    };

    $scope.pauseAnimation = function() {
        $interval.cancel($scope.animationPromise);
        $scope.animationPromise = null;
    };

    $scope.animateSprite = function() {

        if ( ($scope.frame.x < 7 && $scope.frame.y < 4)
            || ($scope.frame.x < 4 && $scope.frame.y == 4) ) {
            $scope.frame.x++;
        } else {
            $scope.frame.x = 0;

            if ($scope.frame.y < 5) {
                $scope.frame.y++;
            } else {
                $scope.frame.y = 0;
                $scope.frame.x = 1;
            }
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