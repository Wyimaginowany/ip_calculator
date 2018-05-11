let mainApp = angular.module('mainApp', ['ngMask']);

mainApp.controller('mainAppCon', ($scope, $http)=>{
	//$scope.langTab = null;
	
	//$scope.initializer = (()=>{
	//	$http.get('language.json')
	//		.then(function(res){
	//			$scope.lanTab = res.data;                
	//		});
	//	
	//	if(localStorage.getItem("langSetup")===null){
	//		localStorage.setItem("langSetup", "eng");
	//	} else {
	//		if(localStorage.getItem("langSetup")=="eng"){
	//			$scope.lanTab = $scope.language.eng;
	//		} else if(localStorage.getItem("langSetup")=="pl"){
	//			$scope.lanTab = $scope.language.pl;
	//		}
	//	}
	//})()
	
	$scope.eng = [
		"Form", //0
		"Adresses", //1
		"Graph", //2
		"Choose class", //3
		"Enter number of hosts in each subnet (power of 2 minus 2)", //4
		"Enter number of subnets (power of 2)", //5
		"Enter netmask" //6
	];
	
	$scope.pl = [
		"Formularz", //0
		"Adresacja", //1
		"Graf", //2
		"Wybierz klasę", //3
		"Wpisz liczbę hostów w każdej podsieci (potęga liczby 2 odjąć 2)", //4
		"Wpisz liczbę podsieci (potęga liczby 2)", //5
		"Wprowadź maskę sieci" //6
	];
	
	$scope.statusMenu = false;
	$scope.showMenu = ()=>{
		if($scope.statusMenu==false){
			$scope.setMarginMenu = {"margin-right":"0%"};
			$scope.statusMenu=true;
		} else {
			let mobile = window.matchMedia("screen and (max-width: 650px)");
			if (mobile.matches) {
				$scope.setMarginMenu = {"margin-right":"-90%"};
				$scope.statusMenu=false;
			} else {
				$scope.setMarginMenu = {"margin-right":"-54%"};
				$scope.statusMenu=false;
			}
		}
	};
	
	$scope.switchMenuForm = ()=>{
		$scope.srcSubPage = "form.html";
	};

	$scope.switchMenuAdresses = ()=>{
		$scope.srcSubPage = "adresses.html";
	};
	
	$scope.switchMenuGraph = ()=>{
		$scope.srcSubPage = "graph.html";
	};
	
	$scope.classChange = ()=>{
		if($scope.classForm == null){
			$scope.hostsFormD = true;
			$scope.subnetsFormD = true;
			$scope.maskFormD = true;
		} else if($scope.classForm == 'a'){
			$scope.hostsFormD = false;
			$scope.hostsFormMax = 16777214;
			$scope.subnetsFormD = false;
			$scope.subnetsFormMax = 4194304;
			$scope.maskFormD = false;
		} else if($scope.classForm == 'b'){
			$scope.hostsFormD = false;
			$scope.hostsFormMax = 65534;
			$scope.subnetsFormD = false;
			$scope.subnetsFormMax = 16384;
			$scope.maskFormD = false;
		} else if($scope.classForm == 'c'){
			$scope.hostsFormD = false;
			$scope.hostsFormMax = 254;
			$scope.subnetsFormD = false;
			$scope.subnetsFormMax = 64;
			$scope.maskFormD = false;
		}
	};
	
	$scope.subnetsChange = ()=>{
		if($scope.subnetsForm && ($scope.subnetsForm & ($scope.subnetsForm - 1))===0){
			$scope.hostsForm = ((+$scope.hostsFormMax+2)/$scope.subnetsForm)-2;
			$scope.subnetsFormError = {'box-shadow' : '0px 2px 4px 1px rgba(0,0,0,0.44)'};
		} else {
			$scope.subnetsFormError = {'box-shadow' : '0px 2px 4px 1px #f00'};
		}
	};
	
	$scope.hostsChange = ()=>{
		if((+$scope.hostsForm+2) && ((+$scope.hostsForm+2) & ((+$scope.hostsForm+2) - 1))===0){
			$scope.subnetsForm = ((+$scope.hostsFormMax+2)/(+$scope.hostsForm+2));
			$scope.hostsFormError = {'box-shadow' : '0px 2px 4px 1px rgba(0,0,0,0.44)'};
		} else {
			$scope.hostsFormError = {'box-shadow' : '0px 2px 4px 1px #f00'};
		}
	};
	
	$scope.maskChange = ()=>{
		let mask = $scope.maskForm;
		let maskTemp = "";
		let maskTab = [];
		let flag = 0;
		
		for(let i = 0; i<mask.length; i++){
			if(mask[i]!="."){
				maskTemp = maskTemp+mask[i];
			} else {
				flag++;
				maskTab[flag].push(maskTemp);
				maskTemp = "";
			}
		}
		console.log(maskTab);
	};
});
