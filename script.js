let mainApp = angular.module('mainApp', []);

mainApp.run(($rootScope) => {
	$rootScope.eng = [
		"Form", //0
		"Adresses", //1
		"Graph", //2
		"Choose class", //3
		"Enter number of hosts in each subnet (power of 2 minus 2)", //4
		"Enter number of subnets (power of 2)", //5
		"Enter netmask (by pattern: 255.255.255.255)", //6
		"Subnet address", //7
		"Subnet range", //8
		"Broadcast", //9
        "Subnet" //10
    ];

	$rootScope.pl = [
        "Formularz", //0
        "Adresacja", //1
        "Graf", //2
        "Wybierz klasę", //3
        "Wpisz liczbę hostów w każdej podsieci (potęga liczby 2 odjąć 2)", //4
        "Wpisz liczbę podsieci (potęga liczby 2)", //5
        "Wprowadź maskę sieci (wg. wzoru: 255.255.255.255)", //6
        "Adres podsieci", //7
        "Zakres adresów", //8
        "Adres rozgłoszeniowy", //9
        "Podsieć" //10
    ];

	$rootScope.initLang = () => {
		if (!sessionStorage['lang']) {
			sessionStorage.setItem('lang', 'eng');
		} else if (sessionStorage.getItem('lang') == 'eng') {
			$rootScope.lang = $rootScope.eng;
		} else if (sessionStorage.getItem('lang') == 'pl') {
			$rootScope.lang = $rootScope.pl;
		}
	};

	$rootScope.changeLang = (langChoose) => {
		sessionStorage.setItem('lang', langChoose);
		$rootScope.lang = langChoose == 'eng' ? $rootScope.lang = $rootScope.eng : $rootScope.lang = $rootScope.pl;
	};
});

mainApp.controller('mainAppCon', ($rootScope, $scope) => {
	$rootScope.initLang();
	
});

mainApp.controller('formAppCon', ($rootScope, $scope) => {
	$rootScope.initLang();
	
	$scope.classChange = () => {
		$scope.hostsForm = "";
		$scope.subnetsForm = "";
		$scope.maskForm = "";
		
		if ($scope.classForm == null) {
			$scope.hostsFormD = true;
			$scope.subnetsFormD = true;
			$scope.maskFormD = true;
		} else if ($scope.classForm == 'a') {
			$scope.hostsFormD = false;
			$scope.hostsFormMax = 16777214;
			$scope.subnetsFormD = false;
			$scope.subnetsFormMax = 4194304;
			$scope.maskFormD = false;
		} else if ($scope.classForm == 'b') {
			$scope.hostsFormD = false;
			$scope.hostsFormMax = 65534;
			$scope.subnetsFormD = false;
			$scope.subnetsFormMax = 16384;
			$scope.maskFormD = false;
		} else if ($scope.classForm == 'c') {
			$scope.hostsFormD = false;
			$scope.hostsFormMax = 254;
			$scope.subnetsFormD = false;
			$scope.subnetsFormMax = 64;
			$scope.maskFormD = false;
		}

		toStorage();
	};

	$scope.subnetsChange = () => {
		if ($scope.subnetsForm && ($scope.subnetsForm & ($scope.subnetsForm - 1)) === 0) {
			$scope.hostsForm = ((+$scope.hostsFormMax + 2) / $scope.subnetsForm) - 2;
			$scope.subnetsFormError = {
				'box-shadow': '0px 2px 4px 1px rgba(0,0,0,0.44)'
			};
		} else {
			$scope.subnetsFormError = {
				'box-shadow': '0px 2px 4px 1px #f00'
			};
		}
		generateMask();
		toStorage();
	};

	$scope.hostsChange = () => {
		if ((+$scope.hostsForm + 2) && ((+$scope.hostsForm + 2) & ((+$scope.hostsForm + 2) - 1)) === 0) {
			$scope.subnetsForm = ((+$scope.hostsFormMax + 2) / (+$scope.hostsForm + 2));
			$scope.hostsFormError = {
				'box-shadow': '0px 2px 4px 1px rgba(0,0,0,0.44)'
			};
		} else {
			$scope.hostsFormError = {
				'box-shadow': '0px 2px 4px 1px #f00'
			};
		}
		generateMask();
		toStorage();
	};

	$scope.maskChange = () => {
		let mask = $scope.maskForm;
		let maskTab = [];
		let maskTabBin = [];

		let maskTabBinTemp = "";
		let maskTemp = "";

		let flag = null;
		let flag_next = false;


		for (let i = 0; i < mask.length; i++) {
			if (mask[i] != ".") {
				maskTemp = maskTemp + mask[i];
				if (i == mask.length - 1) {
					maskTab.push(maskTemp);
					maskTabBinTemp = (+maskTemp).toString(2);
					while (maskTabBinTemp.length < 8) {
						maskTabBinTemp = maskTabBinTemp + "0";
					}
					maskTabBin.push(maskTabBinTemp);

					maskTabBinTemp = "";
					maskTemp = "";
				}
			} else {
				maskTab.push(maskTemp);
				maskTabBinTemp = (+maskTemp).toString(2);
				while (maskTabBinTemp.length < 8) {
					maskTabBinTemp = maskTabBinTemp + "0";
				}
				maskTabBin.push(maskTabBinTemp);

				maskTabBinTemp = "";
				maskTemp = "";
			}
		}

		String.prototype.replaceAll = function (str1, str2, ignore) {
			return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
		}

		let maskTabBinA = maskTabBin.join();
		maskTabBinA = maskTabBinA.replaceAll(",", "");


		for (let i = 0; i < maskTabBinA.length; i++) {
			if (maskTabBinA[i] == 1 && i == 0) {
				flag = 1;
				$scope.maskFormError = {
					'box-shadow': '0px 2px 4px 1px rgba(0,0,0,0.44)'
				};
				continue;
			} else if (maskTabBinA[i] == 0 && i == 0) {
				flag = 0;
				$scope.maskFormError = {
					'box-shadow': '0px 2px 4px 1px rgba(0,0,0,0.44)'
				};
				continue;
			} else if (maskTabBinA[i] == 1 && flag == 1) {
				$scope.maskFormError = {
					'box-shadow': '0px 2px 4px 1px rgba(0,0,0,0.44)'
				};
				continue;
			} else if (maskTabBinA[i] == 0 && flag == 0) {
				$scope.maskFormError = {
					'box-shadow': '0px 2px 4px 1px rgba(0,0,0,0.44)'
				};
				continue;
			} else if (maskTabBinA[i] == 1 && flag == 0 && flag_next == false) {
				flag_next = true;
				flag = 1;
				$scope.maskFormError = {
					'box-shadow': '0px 2px 4px 1px rgba(0,0,0,0.44)'
				};
				continue;
			} else if (maskTabBinA[i] == 0 && flag == 1 && flag_next == false) {
				flag_next = true;
				flag = 0;
				$scope.maskFormError = {
					'box-shadow': '0px 2px 4px 1px rgba(0,0,0,0.44)'
				};
				continue;
			} else {
				$scope.maskFormError = {
					'box-shadow': '0px 2px 4px 1px #f00'
				};
				break;
			}
		}

		let hostsCount = 0;
		let subnetsCount = 0;
		let subnetsCountA = 0;
		let class_i = 0;

		if ($scope.classForm == 'a') {
			class_i = 8;
		} else if ($scope.classForm == 'b') {
			class_i = 16;
		} else if ($scope.classForm == 'c') {
			class_i = 24;
		}

		for (let i = class_i; i < maskTabBinA.length; i++) {
			if (maskTabBinA[i] == 1) {
				subnetsCount++;
			} else {
				hostsCount++;
			}
		}

		for (let i = 0; i < maskTabBinA.length; i++) {
			if (maskTabBinA[i] == 1) {
				subnetsCountA++;
			} else {
				break;
			}
		}

		if (class_i > subnetsCountA) {
			$scope.maskFormError = {
				'box-shadow': '0px 2px 4px 1px #f00'
			};
		} else {
			$scope.maskFormError = {
				'box-shadow': '0px 2px 4px 1px rgba(0,0,0,0.44)'
			};
		}

		hostsCount = Math.pow(2, hostsCount) - 2;
		subnetsCount = Math.pow(2, subnetsCount);

		$scope.hostsForm = hostsCount;
		$scope.subnetsForm = subnetsCount;

		toStorage();
	};

	function generateMask() {
		let class_i = 0;

		if ($scope.classForm == 'a') {
			class_i = 8;
		} else if ($scope.classForm == 'b') {
			class_i = 16;
		} else if ($scope.classForm == 'c') {
			class_i = 24;
		}

		let hostsCount = +$scope.hostsForm + +2;
		hostsCount = Math.log2(hostsCount);
		let subnetsCount = +Math.log2($scope.subnetsForm) + +class_i;

		let maskTabBinA = "";

		for (let i = 0; i < subnetsCount; i++) {
			maskTabBinA += "1";
		}

		for (let i = 0; i < hostsCount; i++) {
			maskTabBinA += "0";
		}

		let temp_oct = "";
		let mask = "";

		for (let i = 0; i < 8; i++) {
			temp_oct += maskTabBinA[i];
		}
		mask += parseInt(+temp_oct, 2) + ".";
		temp_oct = "";

		for (let i = 8; i < 16; i++) {
			temp_oct += maskTabBinA[i];
		}
		mask += parseInt(+temp_oct, 2) + ".";
		temp_oct = "";

		for (let i = 16; i < 24; i++) {
			temp_oct += maskTabBinA[i];
		}
		mask += parseInt(+temp_oct, 2) + ".";
		temp_oct = "";

		for (let i = 24; i < 32; i++) {
			temp_oct += maskTabBinA[i];
		}
		mask += parseInt(+temp_oct, 2);
		temp_oct = "";

		$scope.maskForm = mask;
	}

	function toStorage() {
		let dataForStorage = [];
		dataForStorage.push($scope.classForm);
		dataForStorage.push($scope.hostsForm);
		dataForStorage.push($scope.subnetsForm);
		dataForStorage.push($scope.maskForm);
		$rootScope.dataStorage = dataForStorage;
	}
});

mainApp.controller('adressesAppCon', ($rootScope, $scope) => {
	$rootScope.initLang();
	$scope.addresses=[];
	let addressesTemp = [];
	$rootScope.$watch('dataStorage', ()=>{
		$scope.classForm = $rootScope.dataStorage[0];
		$scope.hostsForm = $rootScope.dataStorage[1];
		$scope.subnetsForm = $rootScope.dataStorage[2];
		$scope.maskForm = $rootScope.dataStorage[3];
		if($scope.classForm!=null && $scope.hostsForm!=null && $scope.subnetsForm!=null && $scope.maskForm!=null){
			if ($scope.classForm == 'a') {
				let prefix = "10.";
				$scope.addresses=[];
				for (let i = 0; i < $scope.subnetsForm; i++) {
					addressesTemp = [];
					addressesTemp.push(prefix + ((256 / $scope.subnetsForm) * i) + ".0.0");
					addressesTemp.push(prefix + ((256 / $scope.subnetsForm) * i) + ".0.1");
					addressesTemp.push(prefix + (((256 / $scope.subnetsForm) * (i + 1)) - 1) + ".255.254");
					addressesTemp.push(prefix + (((256 / $scope.subnetsForm) * (i + 1)) - 1) + ".255.255");
					$scope.addresses.push(addressesTemp);
				}
			} else if ($scope.classForm == 'b') {
				let prefix = "172.16.";
				$scope.addresses=[];
				for (let i = 0; i < $scope.subnetsForm; i++) {
					addressesTemp = [];
					addressesTemp.push(prefix + ((256 / $scope.subnetsForm) * i) + ".0");
					addressesTemp.push(prefix + ((256 / $scope.subnetsForm) * i) + ".1");
					addressesTemp.push(prefix + (((256 / $scope.subnetsForm) * (i + 1)) - 1) + ".254");
					addressesTemp.push(prefix + (((256 / $scope.subnetsForm) * (i + 1)) - 1) + ".255");
					$scope.addresses.push(addressesTemp);
				}
			} else if ($scope.classForm == 'c') {
				let prefix = "192.168.0.";
				$scope.addresses=[];
				for (let i = 0; i < $scope.subnetsForm; i++) {
					addressesTemp = [];
					addressesTemp.push(prefix + ((256 / $scope.subnetsForm) * i));
					addressesTemp.push(prefix + (((256 / $scope.subnetsForm) * i) + 1));
					addressesTemp.push(prefix + (((256 / $scope.subnetsForm) * (i + 1)) - 2));
					addressesTemp.push(prefix + (((256 / $scope.subnetsForm) * (i + 1)) - 1));
					$scope.addresses.push(addressesTemp);
				}
			}
		} else {
			$scope.addresses=[];
		}
	});
});
