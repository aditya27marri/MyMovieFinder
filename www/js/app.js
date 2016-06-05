var App = angular.module('App',["ionic"]);

App.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/"); // this will send any non-valid url back to "/'
        $stateProvider
            // route for the home page
            .state('home', {
                url: "/",
                templateUrl : 'templates/home.html',
                controller  : 'AppCtrl'
            })

            // route for the movie page
            .state('movie', {
                url: "/movie/:name",
                templateUrl : 'templates/movie.html',
                controller  : 'MovieCtrl'
            })
            .state("otherwise", { url : '/'})

    });

App.service("getMovieName",["$http","$log",getMovieName]);
App.service("getMovie",["$http","$log",getMovie]);
App.service("nextMovieName",["$http","$log",nextMovieName]);

App.controller("AppCtrl", ["$scope","getMovieName","nextMovieName","$log",AppCtrl]);
App.controller("MovieCtrl", ["$scope","getMovie","$log","$stateParams",MovieCtrl]);


function AppCtrl($scope,getMovieName,nextMovieName,$log){
    console.log('appctrl');
    $scope.val={};
    $scope.search=function(){
      $scope.currentPage = 1
        $scope.searchRes=[];
         var word=$scope.val.searchText;
        if(word!=undefined){
            $scope.myVar = false;
            getMovieName.getList($scope,word);            
        }
    }
    
    $scope.next=function(){
        $scope.searchRes=[];
         var word=$scope.val.searchText;
        if(word!=undefined){
            $scope.myVar = true;
        nextMovieName.getNext($scope,word);            
        }
    }
    $scope.prev=function(){
        $scope.searchRes=[];
         var word=$scope.val.searchText;
        console.log("cup"+ $scope.currentPage);
        if(word!=undefined && $scope.currentPage>=1){
        console.log("cup in"+ $scope.currentPage);
        nextMovieName.getPrev($scope,word);            
        }
    }
}

function getMovieName($http,$log){
    this.getList=function($scope,word){
        var page=$scope.currentPage;
        $http.get("http://www.omdbapi.com/?s="+word+"&page="+page)
            .success(function(result){
            if(result.totalResults>10){
                $scope.pagShow=true;
            }else{
                                $scope.pagShow=false;
            }
            $scope.searchRes=result.Search;
            $log.info(JSON.stringify(result.Search));
        });
    };
}

function nextMovieName($http,$log){
    this.getNext=function($scope,word){
        var page=$scope.currentPage+1;
        $scope.currentPage=page;
        $http.get("http://www.omdbapi.com/?s="+word+"&page="+page)
            .success(function(result){
             if(result.totalResults<10){
                $scope.pagShow=false;
            }
            $scope.searchRes=result.Search;
            $log.info(JSON.stringify(result.Search));
        });
    };
    this.getPrev=function($scope,word){
        var page=$scope.currentPage-1;
        console.log("c"+page+"p"+$scope.currentPage);
        $scope.currentPage=page;
        if( $scope.currentPage!=1){
            $scope.myVar = true;
        }else{
            $scope.myVar = false;            
        }
        $http.get("http://www.omdbapi.com/?s="+word+"&page="+page)
            .success(function(result){
             if(result.totalResults<10){
                $scope.pagShow=false;
            }
            $scope.searchRes=result.Search;
            $log.info(JSON.stringify(result.Search));
        });
    };        
}

function MovieCtrl($scope,getMovie,$log,$stateParams){
    console.log('MovieCtrl');
    var title=$stateParams.name;
        console.log("title param:"+title);
        if(title!=undefined){
        getMovie.getMovieInfo($scope,title);            
        }        
}

function getMovie($http,$log){
    this.getMovieInfo=function($scope,title){
        $http.get("http://www.omdbapi.com/?i="+title+"&plot=full")
            .success(function(result){
            $scope.sr=result;
            $log.info(JSON.stringify(result.Search));
        });
    };
}