// Athlete home controller
angular.module('manager').controller('athCtrl', function($scope, athletes){
	$scope.homeMessage = "Now on Athlete Page"
	$scope.athletes = athletes.athletes;
	
});


// Controller for adding athletes
angular.module('manager').controller('athCtrl1', function($scope, federations, $http){
	$scope.federations = federations.federations;
	$scope.newAthlete = {};
	$scope.socials = [];
	$scope.countries = [];
	$scope.editorials = [
		{id: 'post1', link: '', title: ''}
	]
	$scope.records = [
		{id: 'record1', year: '', federation: '', show:'', division: '', class: '', place: '', _creator: $scope.user}
	]
	// Social profiles code
	var personalFB = {
		service: 'personal Facebook',
		link: $scope.personalFB
	}
	var publicFB = {
		service: 'public Facebook',
		link: $scope.publicFB
	}
	var twitter = {
		service: 'twitter',
		link: $scope.personalTwitter
	}
	var instagram = {
		service: 'instagram',
		link: $scope.personalInstagram
	}
	var youtube = {
		service: 'youtube',
		link: $scope.personalYoutube
	}
	var gPlus = {
		service: 'google plus',
		link: $scope.personalGooglePlus
	}
	var web1 = {
		service: 'web1',
		link: $scope.personalWebsite1
	}
	var web2 = {
		service: 'web2',
		link: $scope.personalWebsite2
	}
	var addSocial = function(account){
		if(account.link.length) {
			console.log('adding ' + account.service + ' to socials array')
			$scope.socials.push(account);
		}
	}
	

	// Countries
	var primaryCountry = {
		classify: 'primary',
		countryName: $scope.primaryCountry
	}
	var secondaryCountry = {
		classify: 'secondary',
		countryName: $scope.secondaryCountry
	}
	$scope.countries.push(primaryCountry, secondaryCountry);


	// editorial publishings
	$scope.addPost = function(){
		newItemNo = $scope.editorials.length + 1;
		var post = {
			id: 'post' + newItemNo,
			link: '',
			title: ''
		}
		$scope.editorials.push(post)
	}
	// competition records
	$scope.addRecord = function(){
		var newItemNo = $scope.records.length + 1;
		var record = {
			id: 'record' + newItemNo,
			year: '',
			federation: '',
			show:'',
			division: '',
			class: '',
			place: '',
			_creator: $scope.user
		}
		$scope.records.push(record);
	};
	$scope.removeRecord = function(){
		var lastItem = $scope.records.length - 1;
		$scope.records.splice(lastItem);
	};
	$scope.saveRecord = function(record){
		console.log('adding: ' + angular.toJson(record) + 'to records array.');
	};




	
	$scope.newAthlete.countries = $scope.countries;
	$scope.newAthlete.published = $scope.editorials;
	$scope.newAthlete._creator = $scope.user;
	$scope.createAthlete = function(){
		console.log('creating this athlete...');
		addSocial(personalFB); addSocial(publicFB); addSocial(twitter); addSocial(instagram); addSocial(youtube); addSocial(gPlus); addSocial(web1); addSocial(web2); 
		$scope.newAthlete.social = $scope.socials;
		console.log($scope.user);
		console.log($scope.newAthlete);
		// Create this athlete
		$http.post('/ath/new', $scope.newAthlete)
			.success(function(data){
				var athId = data._id;
				// Add this athlete into the records objects
				angular.forEach($scope.records, function(item, key){
					item.athlete = athId; 
					console.log(item);

					$http.post('/record/new', item)
						.success(function(data){
							console.log('successfully created the record as: '  + data);
							// need to now add this record back into the athlete.
							$http.post('/ath/addRecord', data)
								.success(function(data){
									console.log('successfully added record into athlete');
									console.log(data)
								})
								.error(function(data){
									console.log('could not add that record back into athlete');
									console.log(data)
								})
						})
						.error(function(data){
							console.log('did not create the record');
							console.log(data)
						});
				});
				console.log('going to create the above record')
				// Need to now create the records
				
			})
			.error(function(data){
				console.log('could not create the athlete');
				console.log(data);
			})
	}
})