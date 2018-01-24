angular.module('openITCOCKPIT')
    .controller('SystemdowntimesAddContainerdowntimeController', function($scope, $http){

        $scope.init = true;
        $scope.errors = null;

        $scope.Downtime = {
            is_recurring: false,
            is_inherit: false
        };

        $scope.post = {
            params: {
                'angular': true
            },
            Systemdowntime: {
                is_recurring: 0,
                inherit_downtime: 0,
                weekdays: {},
                day_of_month: null,
                from_date: null,
                from_time: null,
                to_date: null,
                to_time: null,
                duration: null,
                downtimetype: 'container',
                downtimetype_id: 0,
                objecttype_id: 4,       //1 << 2
                object_id: {},
                comment: null
            }
        };

        $scope.loadRefillData = function(){
            $http.get("/angular/downtime_host.json", {
                params: {
                    'angular': true
                }
            }).then(function(result){
                $scope.post.Systemdowntime.downtimetype_id = result.data.preselectedDowntimetype;
            });
            $http.get("/angular/getDowntimeData.json", {
                params: {
                    'angular': true
                }
            }).then(function(result){
                $scope.post.Systemdowntime.from_date = result.data.refill.from_date;
                $scope.post.Systemdowntime.from_time = result.data.refill.from_time;
                $scope.post.Systemdowntime.to_date = result.data.refill.to_date;
                $scope.post.Systemdowntime.to_time = result.data.refill.to_time;
                $scope.post.Systemdowntime.comment = result.data.refill.comment;
                $scope.post.Systemdowntime.duration = result.data.refill.duration;
                $scope.errors = null;
            }, function errorCallback(result){
                if(result.data.hasOwnProperty('error')){
                    $scope.errors = result.data.error;
                }
            });
        };

        $scope.loadRefillData();

        $scope.saveNewContainerDowntime = function(){
            if($scope.containerIds){
                $scope.post.Systemdowntime.object_id = $scope.containerIds;
            }
            if($scope.post.Systemdowntime.is_recurring){
                $scope.post.Systemdowntime.to_time = null;
                $scope.post.Systemdowntime.to_date = null;
                $scope.post.Systemdowntime.from_date = null;
            }

            $http.post("/systemdowntimes/addContainerdowntime.json?angular=true", $scope.post).then(
                function(result){
                    $scope.errors = null;
                    if($scope.post.Systemdowntime.is_recurring){
                        window.location.href = '/systemdowntimes';
                    }else{
                        window.location.href = '/downtimes/host';
                    }
                },
                function errorCallback(result){
                    console.error(result.data);
                    if(result.data.hasOwnProperty('error')){
                        $scope.errors = result.data.error;
                    }
                }
            );
        };

        $scope.loadContainers = function(){
            $http.get("/containers/loadContainersForAngular.json", {
                params: {
                    'angular': true
                }
            }).then(function(result){
                $scope.containers = result.data.containers;
                $scope.errors = null;
            }, function errorCallback(result){
                console.error(result);
                if(result.data.hasOwnProperty('error')){
                    $scope.errors = result.data.error;
                }
            });
        };

        $scope.loadContainers();

        $scope.$watch('Downtime.is_recurring', function(){
            if($scope.Downtime.is_recurring === true){
                $scope.post.Systemdowntime.is_recurring = 1;
                if($scope.errors && $scope.errors['from_time']){
                    delete $scope.errors['from_time'];
                }
            }
            if($scope.Downtime.is_recurring === false){
                $scope.post.Systemdowntime.is_recurring = 0;
            }
        });

        $scope.$watch('Downtime.is_inherit', function(){
            if($scope.Downtime.is_inherit === true){
                $scope.post.Systemdowntime.inherit_downtime = 1;
            }
            if($scope.Downtime.is_inherit === false){
                $scope.post.Systemdowntime.inherit_downtime = 0;
            }
        });

    });
