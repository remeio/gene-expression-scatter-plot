var keys = [];
var datas = new Array();
datas[0] = new Array();
var details = new Array();
details[0] = new Array();
var correlationCoefficient = 0;
function getJsonFiles() {
  /*Get the string format of g1, g2, info, determine whether they are JSON objects, continue if they are, and output the error code if they are not.*/
	var jsonstr1 = document.getElementById("gene1Preview").innerHTML;
	var jsonstr2 = document.getElementById("gene2Preview").innerHTML;
	var jsonstr3 = document.getElementById("infoPreview").innerHTML;
	if(jsonstr1 == "" || jsonstr2 == ""|| jsonstr3 == "") {//MEAN: NOT GET STRINGS; SO: NOT PASS; OUTPUT: ERROR CODE;
		if (jsonstr1 == "") {
			errorCode(101);
		}
		if (jsonstr2 == "") {
			errorCode(102);
		}
		if (jsonstr3 == "") {
			errorCode(103);
		}
	}
	else {//MEAN: GET STRINGS; SO: CHECK JSON
		var check1 = isJSON(jsonstr1);
		var check2 = isJSON(jsonstr2);
		var check3 = isJSON(jsonstr3);
		if (check1 && check2 && check3) {//MEAN: ARE JSON; SO: PASS
			var gene1 = eval('(' + jsonstr1 + ')');
			var gene2 = eval('(' + jsonstr2 + ')');
			var info = eval('(' + jsonstr3 + ')');
			
			var sumOfSquareOfX = 0;//get R
			var sumOfSquareOfY = 0;
			var sumOfXTimesY = 0;
			var averageX = 0;
			var averageY = 0;
			var squareOfAverageX = 0;
			var squareOfAverageY = 0;
			var averageXTimesAverageY = 0;
			
			var doN = 0;//get count
			var infoN = 0;
			var g1N = 0;
			var g2N = 0;
			for(var attr in gene1) {
        g1N++;
			}
			for(var attr in gene2) {
        g2N++;
			}
			 
			for (var attr in info) {
				var tempStr = "R0" + attr + "XX";
				var g1 = gene1[tempStr];
				var g2 = gene2[tempStr];
				if (g1 != undefined && g2!=undefined) {//MEAN: CHECK DO OR NOT; 
					var judgeTemp = beFound(info[attr].tissue, keys);
					if (judgeTemp == -1) {
						keys.push(info[attr].tissue);
						judgeTemp = beFound(info[attr].tissue, keys);
						datas[judgeTemp] = new Array();
						details[judgeTemp] = new Array();
					}
					datas[judgeTemp].push(g1);
					datas[judgeTemp].push(g2);
					details[judgeTemp].push(info[attr].detail);
					
					sumOfSquareOfX += g1 * g1;	//get R;
					sumOfSquareOfY += g2 * g2;
					sumOfXTimesY += g1 * g2;
					averageX += g1;
					averageY += g2;
					doN++;
				}
				infoN++;
			}
			
			averageX /= doN;
			averageY /= doN;
			squareOfAverageX = averageX * averageX;
			squareOfAverageY = averageY * averageY;
			averageXTimesAverageY = averageX * averageY;
			correlationCoefficient = Math.abs((sumOfXTimesY - doN * averageXTimesAverageY) / (Math.sqrt((sumOfSquareOfX - doN * squareOfAverageX) * (sumOfSquareOfY - doN * squareOfAverageY))));
			document.getElementById('loss').innerHTML = "Gene1 utilization: " + Math.round(doN / g1N * 100.0)  + "%  " +  doN + "/" + g1N + "<br>Gene2 utilization: " + Math.round(doN / g2N * 100.0) + "%  " +  doN + "/" + g2N +"<br>Information utilization: " + Math.round(doN / infoN * 100.0) + "%  " +  doN + "/" + infoN;
			document.getElementById('coefficient').innerHTML = "Correlation Coefficient: " + correlationCoefficient;
			console.log("Correlation Coefficient: " + correlationCoefficient);
			alert("Gene1 utilization: " + Math.round(doN / g1N * 100.0)  + "%  " +  doN + "/" + g1N + "\nGene2 utilization: " + Math.round(doN / g2N * 100.0) + "%  " +  doN + "/" + g2N +"\nInformation utilization: " + Math.round(doN / infoN * 100.0) + "%  " +  doN + "/" + infoN);
			console.log("Gene1 utilization: " + Math.round(doN / g1N * 100.0)  + "%  " +  doN + "/" + g1N + "\nGene2 utilization: " + Math.round(doN / g2N * 100.0) + "%  " +  doN + "/" + g2N +"\nInformation utilization: " + Math.round(doN / infoN * 100.0) + "%  " +  doN + "/" + infoN);
			/*for (var i = 0; i < keys.length; i++) {
				for (var j = 0; j < datas[i].length; j = j + 2) {
					console.log(keys[i] + " " + datas[i][j] + ", " + datas[i][j + 1] + " " + details[i][j / 2]);
				} 
			}*/
			
		}
		else {//MEAN: NOT JSON ALL; SO: NOT PASS; OUTPUT: ERRORCODE;
			if (!check1) {
				errorCode(104);
			}
			if (!check2) {
				errorCode(105);
			}if (!check3) {
				errorCode(106);
			}	
		}
	}			
}

function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }

        } catch(e) {
            console.log('error：'+str+'!!!'+e);
            return false;
        }
    }
    console.log('It is not a string!')
}

function beFound(key, keys) {
	for (var i = 0; i < keys.length; i++) {
		if (key == keys[i]) {
			return i;
		}
	}
	return -1;
}

function getKeys() {
	return this.keys;
}
function getDatas() {
	return this.datas;
}
function getDetatils() {
	return this.details;
}
function getCorrelationCoefficient(){
  return this.correlationCoefficient;
}
function displayFace() {
	alert(" : ) No cross, no crown.");
}