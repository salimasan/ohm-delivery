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


app.controller("tracking", function($scope, $rootScope, $http, sharedProperties ) {
		$scope.reset = function() {
				$rootScope.deliveryReady = false;
				delete $scope.errorMessage;
				delete $scope.ohmInfo;
				delete $scope.reOrderedOhmInfo;	
				delete $scope.reOrderTrackingId
				delete $scope.commentAdded;
		};
		
		$scope.reOrder = function() {
		  $http.get(`/ohms/reOrderSameOhm/${this.trackingId}`)
            .then((result) => {
                
				  if (result.data != '') {
					$scope.reOrderedOhmInfo = angular.fromJson(result.data);
					$scope.reOrderTrackingId = $scope.reOrderedOhmInfo.trackingId;
					delete $scope.errorMessage;
				  } else {
					// No result returned from server  
					this.errorMessage = 'Oops, An error occured while reordering same ohm. Please send an email to support@urbantz.com with your tracking id' ; 
					delete $scope.reOrderedOhmInfo;	
				  }
		 }, (error) => {
                console.log(error);
				this.errorMessage = 'Oops, An error occured while reordering same ohm. Please send an email to support@urbantz.com with your tracking id' ;
				delete $scope.ohmInfo;	
			    $rootScope.deliveryReady = false;
		   });
		};
		
	  
		
		$scope.addComment = function() {
		  
		  // Get commentId elments value and put it in scope
		  var  commentInput = angular.element(document.getElementById("commentId"));      
		  $scope.comment = commentInput.val();

		  $http.get(`/ohms/addComment/${this.trackingId}/${this.comment}`)
            .then((result) => {
                 $scope.commentAdded = true;
				 delete $scope.errorMessage;
		 }, (error) => {
                console.log(error);
				this.errorMessage = 'Oops, An error occured while adding comment. Please send an email to support@urbantz.com with your tracking id' ;
		   });
		};
		
		
		$scope.sendData = function() {
            $http.get(`/ohms/${this.trackingId}`)
            .then((result) => {
                
				  if (result.data != '') {
					$scope.ohmInfo = angular.fromJson(result.data);
					sharedProperties.setProperty($scope.ohmInfo.trackingId);
					$rootScope.deliveryReady = true;
					$rootScope.ohmInfo = $scope.ohmInfo;
					delete $scope.errorMessage;
					delete $scope.reOrderedOhmInfo;	
					delete $scope.reOrderTrackingId
				  } else {
					// No result returnred from server  
					this.errorMessage = 'No delivery found !! Please check your tracking id ' ; 
					delete $scope.ohmInfo;	
					$rootScope.deliveryReady = false;	
				  }
		 }, (error) => {
                console.log(error);
				this.errorMessage = 'Oops, An error occured while fetching your delivery. Please send an email to support@urbantz.com with your tracking id' ;
				delete $scope.ohmInfo;	
			    $rootScope.deliveryReady = false;
		   });
        };
    });

	
app.controller("deliveryStatusCont", function($scope, $rootScope, $http, sharedProperties) {
        $scope.sendData = function() {
            $http.get(`/ohms/submitDeliveryStatus/${this.deliveryStatus}/${sharedProperties.getProperty()}/${this.refuseDetail}`)
            .then((result) => {
                $scope.deliveryStatusSubmittedMessage = true
           }, (error) => {
				$scope.deliveryStatusSubmittedMessage = false;
				console.log(error);
				this.deliveryStatusSubmittedErrorMessage = 'Oops, An error occured while submiting your delivery status. Please send an email to support@urbantz.com with your tracking id' ;
            });
        };
    });