	var Tree = function(wiese){
	
		$('#saveTree').click(function(){
			getInput();
		});
		
		$('#posButton').click(function(){
			getLocation();
		});
		
		$('#cancelButton').click(function(){
			wiese.show();
		});
		
		$('#timeStampButton').click(function(){
			getCurrentTimeStamp();
		});
		
		document.getElementById("selectedObstArt").addEventListener("change",function(){
			setOptions();
		});
		
		document.getElementById("tempStart").addEventListener("change",function(){
			setCelsius(this);
		});
		
		document.getElementById("tempEnd").addEventListener("change",function(){
			setCelsius(this);
		});
		
		
		
		
			
		function initOptions(){
			var e = document.getElementById("selectedObstArt");
			e.selectedIndex = 0;
		}
		
		
		function setOptions(){
		var e = document.getElementById("selectedObstArt");
			
		var e2= document.getElementById("selectedSortname");
		
		if(e.selectedIndex == 0){
			while(e2.firstChild){
				e2.removeChild(e2.firstChild);
			}
			var option1 = document.createElement("option");
			var option2 = document.createElement("option");
			var option3 = document.createElement("option");
			var option4 = document.createElement("option");
			
			option1.text = "Apfel1";
			option2.text = "Apfel2";
			option3.text = "Apfel3";
			option4.text = "Apfel4";
			
			e2.add(option1);
			e2.add(option2);
			e2.add(option3);
			e2.add(option4);
		 }
		
		if(e.selectedIndex == 1){
			while(e2.firstChild){
				e2.removeChild(e2.firstChild);
			}
			var option1 = document.createElement("option");
			var option2 = document.createElement("option");
			var option3 = document.createElement("option");
			var option4 = document.createElement("option");
			
			option1.text = "Birne1";
			option2.text = "Birne2";
			option3.text = "Birne3";
			option4.text = "Birne4";
			
			e2.add(option1);
			e2.add(option2);
			e2.add(option3);
			e2.add(option4);
		 }
		
		if(e.selectedIndex == 2){
			while(e2.firstChild){
				e2.removeChild(e2.firstChild);
			}
			var option1 = document.createElement("option");
			var option2 = document.createElement("option");
			var option3 = document.createElement("option");
			var option4 = document.createElement("option");
			
			option1.text = "Pflaume1";
			option2.text = "Pflaume2";
			option3.text = "Pflaume3";
			option4.text = "Pflaume4";
			
			e2.add(option1);
			e2.add(option2);
			e2.add(option3);
			e2.add(option4);
		 }
		 
		 if(e.selectedIndex == 3){
			while(e2.firstChild){
				e2.removeChild(e2.firstChild);
			}
			var option1 = document.createElement("option");
			var option2 = document.createElement("option");
			var option3 = document.createElement("option");
			var option4 = document.createElement("option");
			
			option1.text = "Nuss1";
			option2.text = "Nuss2";
			option3.text = "Nuss3";
			option4.text = "Nuss4";
			
			e2.add(option1);
			e2.add(option2);
			e2.add(option3);
			e2.add(option4);
		 }
		}
		
		
		function Tree(obstArt,sortName,lon,lat,ploid,date,crownState,plateState,logState,dmgState,verbissState,adjustedState,crownHeight,timeStamp,begin,end,bloomLevel,tempStart,tempEnd,cropState){
		//Baum ID
			this.obstArt = obstArt;
			this.sortName = sortName;
			//this.position = position;
			this.lon = lon;
			this.lat = lat;
			this.ploid = ploid;
			this.date = date;
		//Pflegezustand
			this.crownState = crownState;
			this.plateState = plateState;
			this.logState = logState;
			this.dmgState = dmgState;
			this.verbissState = verbissState;
			this.adjustedState = adjustedState;
			this.crownHeight = crownHeight;
			this.timeStamp = timeStamp;
		//Blüte und Ertrag
			this.begin = begin;
			this.end = end;
			this.bloomLevel = bloomLevel;
			this.tempStart = tempStart;
			this.tempEnd = tempEnd;
			this.cropState = cropState;
		}
		
		function getInput(){
		
		var obstArt = document.getElementById("selectedObstArt");
		var type = obstArt.options[obstArt.selectedIndex].text;
		
		var sortName = document.getElementById("selectedSortname");
		var sortType = sortName.options[sortName.selectedIndex].text;
		
		var position = document.getElementById("userPosition").value; //!
		var lon = position.split(",")[0];
		var lat = position.split(",")[1];
	
		var ploidBox = document.getElementById("selectedPloid");
		var ploid = ploidBox.options[ploidBox.selectedIndex].text;
		
		var date = document.getElementById("selectedDate").value;
		
		var crownState = document.getElementById("kroneInfo").value;
	
		var plateState = document.getElementById("baumscheibeInfo").value;
	
		var logState = document.getElementById("stammInfo").value;
		var dmgState = document.getElementById("schadInfo").value;
	
		var se = document.getElementById("selectedVerbiss");
		var verbissState = se.options[se.selectedIndex].text;

		var sb = document.getElementById("selectedBeseitigt");
		var adjustedState = sb.options[sb.selectedIndex].text;
		
		var crownHeight = document.getElementById("heightInfo").value;
		var timeStamp = document.getElementById("timeInfo").value;
		
		var begin = document.getElementById("begin").value;
		var end = document.getElementById("end").value;
		
		var bloomLevel = document.getElementById("bloomLevel").value;
		
		var tempStart = document.getElementById("tempStart").value; 
		var tempEnd =  document.getElementById("tempEnd").value;
		
		var cropState = document.getElementById("cropInfo").value;
		
		var myTree = new Tree(type,sortType,lon,lat,ploid,date,crownState,plateState,logState,dmgState,verbissState,adjustedState,crownHeight,timeStamp,begin,end,bloomLevel,tempStart,tempEnd,cropState);
		
		saveTree(myTree);
		
		}
		
		function getPosition(position){
			var longi = position.coords.longitude;
			var lat = position.coords.latitude;
			
			var e = document.getElementById("userPosition");
			e.value = longi + "," + lat;
			
			
		}
		
		function getLocation(){
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(getPosition);		
			}
			else{
			
			}
		}
		
		function getCurrentTimeStamp(){
			var e = document.getElementById("timeInfo");
			e.value = Date();
		}
		
		function setCurrentDate(){
		
			var e  = document.getElementById("kroneInfo");
			var e2 = document.getElementById("baumscheibeInfo");
			var e3 = document.getElementById("stammInfo");
			var e4 = document.getElementById("selectedDate");
			
			var d = new Date();
			var day = d.getDate();
			var month = d.getMonth();
			var year = d.getFullYear();

			e.value = day + "." + month + "." + year;
			e2.value = day + "." + month + "." + year;
			e3.value = day + "." + month + "." + year;
			e4.value = year;

		}
		
		function setCelsius(element){
			element.value = element.value + "°C";
		}
		
		function saveTree(myTree){
		var treeObject = {
			tree:myTree
		}
			new DB().getWiesenDB().child(wiese.name).child("trees").push(myTree, function(err){
  				if(err){
  					alert("Fehler" + err);
  				}else{
					wiese.show();
  				}
  			});
		}
		
		
		setCurrentDate();
		initOptions();
		setOptions();
		
		}