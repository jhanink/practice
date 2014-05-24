

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
        var text = document.getElementById('entryfield').value;
        var item = $scope.collection[text];

        if (item) {
            $scope.collection[text]++;
        } else {
            $scope.collection[text] = 1;
        }

        $scope.sortedList = [];

        for (var i in $scope.collection) {
            $scope.sortedList.push( {text:i, count:$scope.collection[i]} );
        }
    }

}]);


/**
 * FeaturesCtrl
 */
MyApp.controller('FeaturesCtrl', ['$scope','$http', '$interval', function($scope, $http, $interval) {

    $scope.animation = {
        performAnimation: function() {
            if (this.animationPromise == null) {
                this.startAnimation();
            } else {
                this.pauseAnimation();
            }
        },
        startAnimation: function() {
            this.animationPromise = $interval(function() {
                $scope.animation.animateSprite();
            },this.getAnimationSpeed());
        },
        pauseAnimation: function() {
            $interval.cancel(this.animationPromise);
            this.animationPromise = null;
        },
        restartAnimation: function() {
            this.pauseAnimation();
            this.startAnimation();
        },
        animateSprite: function() {
            if ( (this.frame.x < 7 && this.frame.y < 4)
                || (this.frame.x < 4 && this.frame.y == 4) ) {
                this.frame.x++;
            } else {
                this.frame.x = 0;

                if (this.frame.y < 5) {
                    this.frame.y++;
                } else {
                    this.frame.y = 0;
                    this.frame.x = 1;
                }
            }
        },
        animationPromise:null,
        getAnimationButtonText: function() {
            return this.animationPromise == null ? "Animate": "Pause";
        },
        getAnimationSpeed: function() {
            if (!this.animationSpeed || this.animationSpeed.trim() == "") {
                return 40;
            } else {
                return this.animationSpeed;
            }
        },
        frame: {
            x:0,
            y:0,
            size:128,
            getXPos: function() {
                return -1 * this.x * this.size;
            },
            getYPos: function() {
                return -1 * this.y * this.size;
            }
        },
        animationSpeed: null
    };


    $scope.getJoke = function() {
        $http.get('/joke/chuckNorris').success(function(data) {
            $scope.data = data;
        });
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