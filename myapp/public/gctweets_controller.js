angular.module("mainModule", [])
    .controller("mainController", function($scope, $http, jsonFilter) {

        var logResult = function(str, data, status, headers, config) {
            return str + "\n\n" +
                "data: " + '\n\n' + data + "\n\n" +
                "status: " + status + "\n\n" +
                "headers: " + jsonFilter(headers()) + "\n\n" +
                "config: " + jsonFilter(config);
        };
        var mapMarkers = [];
        var places = {};

        /************************************************
         *  FUNCTION: getAddressGeoCode
         *  Plot Tweet Locations on the Map!!
         *************************************************/
        function getAddressGeoCode(addressStr) {
            //If the parameter is an empty string, just return
            if (!addressStr.trim()) {
                console.log(addressStr);
                return;
            }

            //Use Google API to get location and mark it on the map.
            geocoder.geocode({ 'address': addressStr }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    window.map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: window.map,
                        position: results[0].geometry.location,
                        title: addressStr
                    });
                    mapMarkers.push(marker);
                } else {
                    alert("Geocode was not successful for the following reason: {" + addressStr + "}\n" + status);
                }
            });
        }

        /************************************************
         *  FUNCTION: searchTweets
         *************************************************/
        $scope.searchTweets = function() {

            $scope.getSearchTweetResults = '';
            $scope.getRawSearchTweetResults;

            var params = {
                term: $scope.searchTermParam
            };

            var config = {
                params: params
            };

            //Clear all existing map markers
            if (mapMarkers.length > 1) {
                for (var i = 0; i < mapMarkers.length; i++) {
                    mapMarkers[i].setMap(null);
                }
            }

            //REST GET Call to the Node.JS server which will in turn call
            //the MarkLogic database javascript api.
            $http.get("/search", config)
                .success(function(data, status, headers, config) {
                    // The $http service automatically converts the response to a
                    // JavaScript object whenever it sees that it looks 
                    // like a JSON string.
                    var tweetCnt = 0;
                    data.forEach(function(document) {

                        console.log(document);
                        $scope.getSearchTweetResults += "Tweet: " + document.tweet + '\n';
                        $scope.getSearchTweetResults += "Friend Count: " + document.tweet.user.friends_count + '\n';
                        $scope.getSearchTweetResults += "Screen Name: " + document.tweet.user.screen_name + '\n';
                        $scope.getSearchTweetResults += "Name: " + document.tweet.user.name + '\n';
                        $scope.getSearchTweetResults += "Location: " + document.tweet.user.location + '\n';
                        $scope.getSearchTweetResults += '\n---------------------------------\n\n';
                        places[document.tweet.user.location] = document.tweet.user.location;
                        tweetCnt++;
                    });

                    var place;
                    for (place in places) {
                        console.log(place);
                        if ($scope.checkboxModel.value1) {
                            getAddressGeoCode(place);
                        }
                    }

                    $scope.getSearchTweetResults = "Num Tweets Returned: " + tweetCnt + '\n\n' + $scope.getSearchTweetResults
                    $scope.getRawSearchTweetResults = jsonFilter(data);
                    window.global = jsonFilter(data);
                })

            .error(function(data, status, headers, config) {
                $scope.getSearchTweetResults = logResult("GET ERROR", data, status, headers, config);
            });
        };
    });