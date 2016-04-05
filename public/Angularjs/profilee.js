/**
 * Created by aneri on 18-03-2016.
 */
var suggesteduserss=angular.module('suggesteduserss',[]);
suggesteduserss.controller('suggesteduserss',function($scope,$http) {
    console.log("hello");

    $http({
        method: "get",
        url: '/getFeed',
    }).then(function (res) {
        //alert(res.data.tweets);
        $scope.searching = false;
        $scope.iamfollowinghide=true;
        $scope.myfollowers=true;
        $scope.locationhide = true;
        $scope.tweets = res.data.followerstweets;
        console.log($scope.tweets);
        $scope.userssuggested = res.data.userssuggested;
        console.log($scope.userssuggested);
        $scope.iamfollowing=res.data.cntiamfollowing;
        $scope.followingme = res.data.cntfollowingme;
        $scope.tweetsmine = res.data.mitweets;
        $scope.counttweet = res.data.tweetcount;
        $scope.searchtags = true;
        $scope.searching = false;
        $scope.profile=false;
        $scope.followersss=res.data.followerss;
        $scope.iamfollowinggg=res.data.iamfollowingg;
        console.log("hey" + $scope.iamfollowinggg[0].full_name);
        console.log("hey" + $scope.followersss);


        console.log("inside");
    });
    $scope.info = function () {

        $http({
            method: "POST",
            url: '/justtoinfo',
            data: {}
        }).success(function (data) {
            console.log("hey");
            $scope.locationhide = false;
            $scope.profile=true;

        })
            .error(function (error) {

            });


    };
    $scope.search = function () {

        $http({
            method: "POST",
            url: '/search',
            data: {
                "searchtag": $scope.searchtag
            }
        }).success(function (data) {
            console.log("BC");
            $scope.tweeet = data;
            console.log("tag");

            $scope.searchtags = false;
            $scope.searching = true;

        })
            .error(function (error) {

            });


    };

})