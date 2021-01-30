var app = angular.module("ohm-delivery", []);

app.service('sharedProperties', function () {
        var property = '';

        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
    });
	
app.controller("tracking", function($scope, $http, sharedProperties) {
        $scope.sendData = function() {
            $http.get(`/ohms/${this.trackingId}`)
            .then((result) => {
                
				 //ohmInfo = 'Tracking Id:' + result.trackingId  +  ' Status: ' result.status;
				 //$scope.ohmInfo = 'Tracking Id:' + result.trackingId  +  ' Status: ' result.status;
				  var ohmObject = angular.fromJson(result.data);
				  console.log(ohmObject);
				  $scope.ohmInfo = 'Tracking Id: ' + ohmObject.trackingId + ' Status: ' + ohmObject.status + ' Volts: ' + ohmObject.description.volts + ' Amperes: ' + ohmObject.description.amperes;
			      sharedProperties.setProperty(ohmObject.id);
				  console.log(' ohmObject.id : ' + ohmObject.id);
				  console.log(' sharedProperties.getProperty(): ' + sharedProperties.getProperty());
		 }, (error) => {
               
				this.errorMessage = 'Oops, this website is under construction, please come back later.' ;
				console.log(error); 
            });
        };
    });

	
app.controller("deliveryStatusCont", function($scope, $http, sharedProperties) {
        $scope.sendData = function() {
            $http.get(`/ohms/submitDeliveryStatus/${this.deliveryStatus}/${sharedProperties.getProperty()}/${this.refuseDetail}`)
            .then((result) => {
                
           }, (error) => {
               
				this.errorMessage = 'Oops, this website is under construction, please come back later.' ;
				console.log(error); 
            });
        };
    });