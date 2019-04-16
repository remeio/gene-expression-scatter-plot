var keys = [];
var datas = new Array();
datas[0] = new Array();
var details = new Array();
details[0] = new Array();
var arraySort = new Array();
var strAll = "";
var doTemp1 = 0;
var doTemp2 = 0;
var doTemp3 = 0;
function getJsonFiles() {
	var jsonstr1 = document.getElementById("gene1Preview").innerHTML;
	var jsonstr2 = document.getElementById("gene2Preview").innerHTML;
	var jsonstr3 = document.getElementById("infoPreview").innerHTML;
	if(jsonstr1 != "" && jsonstr2 != "") {
		var check1 = isJSON(jsonstr1);
		var check2 = isJSON(jsonstr2);
		var check3 = isJSON(jsonstr3);
		if (check1 && check2) {
			var gene1 = eval('(' + jsonstr1 + ')');
			var gene2 = eval('(' + jsonstr2 + ')');
			if (check3) {
				var info = eval('(' + jsonstr3 + ')');
			}
			else {
				errorCode(106);
				var info = null;
			}  
			var doN = 0;
			var infoN = 0;
			var g1N = 0;
			var g2N = 0;
			for (var attr in gene1) {
        var tempStr = "";
        for (var i = 2; i < attr.length - 2; i++) {
          tempStr = tempStr + attr.charAt(i);
        } 
				var g1 = gene1[attr];
				var g2 = gene2[attr];
				if (g1 != undefined && g2!=undefined) {
				var str1 = "";
				var str2 = "";
        if (info == null || info[tempStr] == undefined) {
           str1 = "unknown";
           str2 = "";
        }
        else {
           str1 = info[tempStr].tissue;
           str2 = info[tempStr].detail;
        }
        var judgeTemp = beFound(str1, keys);
          if (judgeTemp == -1) {
             keys.push(str1);
						judgeTemp = beFound(str1, keys);
						datas[judgeTemp] = new Array();
						details[judgeTemp] = new Array();
          }
          datas[judgeTemp].push(g1);
          datas[judgeTemp].push(g2);
          details[judgeTemp].push(str2);
          doN++;
				}
				g1N++;
			}
			for(var attr in info) {
				infoN++;
			}
			for(var attr in gene2) {
				g2N++;
			}
			document.getElementById('loss').innerHTML = "Gene1 utilization: " + Math.round(doN / g1N * 100.0)  + "%  " +  doN + "/" + g1N + "<br>Gene2 utilization: " + Math.round(doN / g2N * 100.0) + "%  " +  doN + "/" + g2N +"<br>Information utilization: " + Math.round(doN / infoN * 100.0) + "%  " +  doN + "/" + infoN;
			if (!check3) {
				document.getElementById('loss').innerHTML = "Gene1 utilization: " + Math.round(doN / g1N * 100.0)  + "%  " +  doN + "/" + g1N + "<br>Gene2 utilization: " + Math.round(doN / g2N * 100.0) + "%  " +  doN + "/" + g2N;
			}
			strAll = getR ();
			sortBySomething(1);
		}
		else {
			if (!check1) {
				errorCode(104);
			}
			if (!check2) {
				errorCode(105);
			}
			if (!check3) {
				errorCode(106);
			}	
		}
	}
	else {
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
function getR () {
      var str = "";
	  var correlationCoefficient1 = 0;
      var sumOfSquareOfX1 = 0;
      var sumOfSquareOfY1 = 0;
      var sumOfXTimesY1 = 0;
      var averageX1 = 0;
      var averageY1 = 0;
      var squareOfAverageX1 = 0;
      var squareOfAverageY1 = 0;
      var averageXTimesAverageY1 = 0;
	  var allN = 0;
      for (var i = 0; i < keys.length; i++) {
		var correlationCoefficient = 0;
        var sumOfSquareOfX = 0;
        var sumOfSquareOfY = 0;
        var sumOfXTimesY = 0;
        var averageX = 0;
        var averageY = 0;
        var squareOfAverageX = 0;
        var squareOfAverageY = 0;
        var averageXTimesAverageY = 0;
        for (var j = 0; j < datas[i].length; j = j + 2) {
			var x = datas[i][j];
			var y = datas[i][j + 1];
			sumOfSquareOfX += x * x;
			sumOfSquareOfY += y * y;
			sumOfXTimesY += x * y;
			averageX += x;
			averageY += y;
			sumOfSquareOfX1 += x * x;
			sumOfSquareOfY1 += y * y;
			sumOfXTimesY1 += x * y;
			averageX1 += x;
			averageY1 += y;
			allN++;
        }
        var doN = datas[i].length / 2;
        averageX /= doN;
        averageY /= doN;
        squareOfAverageX = averageX * averageX;
        squareOfAverageY = averageY * averageY;
        averageXTimesAverageY = averageX * averageY;
        correlationCoefficient = Math.abs((sumOfXTimesY - doN * averageXTimesAverageY) / (Math.sqrt((sumOfSquareOfX - doN * squareOfAverageX) * (sumOfSquareOfY - doN * squareOfAverageY))));
		arraySort[i] = new Array(keys[i], correlationCoefficient.toFixed(5), doN);
      }
	  averageX1 /= allN;
      averageY1 /= allN;
      squareOfAverageX1 = averageX1 * averageX1;
      squareOfAverageY1 = averageY1 * averageY1;
      averageXTimesAverageY1 = averageX1 * averageY1;
      correlationCoefficient1 = Math.abs((sumOfXTimesY1 - allN * averageXTimesAverageY1) / (Math.sqrt((sumOfSquareOfX1 - allN * squareOfAverageX1) * (sumOfSquareOfY1 - allN * squareOfAverageY1))));
	  return "<tr><td>all</td><td>" + correlationCoefficient1.toFixed(5) + "</td><td>" + allN + "</td></tr>";
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
function sortBySomething(temp) {
	var str = "";
	for (var i = 0; i < arraySort.length - 1; i++) {
				for (var j = i + 1; j < arraySort.length; j++) {
					if (arraySort[j][temp - 1] > arraySort[i][temp - 1]) {
						var temp1 = arraySort[i][0];
						var temp2 = arraySort[i][1];
						var temp3 = arraySort[i][2];
						arraySort[i][0] = arraySort[j][0];
						arraySort[i][1] = arraySort[j][1];
						arraySort[i][2] = arraySort[j][2];
						arraySort[j][0] = temp1;
						arraySort[j][1] = temp2;
						arraySort[j][2] = temp3;	
					}
				}
	}
	switch (temp) {
		case 1:
		if (doTemp1 % 2 == 0) {
			for (var i = 0; i < arraySort.length; i++) {
				str = str + "<tr><td>" + arraySort[i][0] + "</td><td>" + arraySort[i][1] + "</td><td>" + arraySort[i][2] + "</td></tr>";	
			}
		}
		else {
			for (var i = arraySort.length - 1; i >= 0; i--) {
				str = str + "<tr><td>" + arraySort[i][0] + "</td><td>" + arraySort[i][1] + "</td><td>" + arraySort[i][2] + "</td></tr>";	
			}
		}
		doTemp1++;			
		break;
		
		case 2: 
		if (doTemp2 % 2 == 0) {
			for (var i = 0; i < arraySort.length; i++) {
				str = str + "<tr><td>" + arraySort[i][0] + "</td><td>" + arraySort[i][1] + "</td><td>" + arraySort[i][2] + "</td></tr>";	
			}
		}
		else {
			for (var i = arraySort.length - 1; i >= 0; i--) {
				str = str + "<tr><td>" + arraySort[i][0] + "</td><td>" + arraySort[i][1] + "</td><td>" + arraySort[i][2] + "</td></tr>";	
			}
		}
		doTemp2++;	
		break;
			
		case 3:
		if (doTemp3 % 2 == 0) {
			for (var i = 0; i < arraySort.length; i++) {
				str = str + "<tr><td>" + arraySort[i][0] + "</td><td>" + arraySort[i][1] + "</td><td>" + arraySort[i][2] + "</td></tr>";	
			}
		}
		else {
			for (var i = arraySort.length - 1; i >= 0; i--) {
				str = str + "<tr><td>" + arraySort[i][0] + "</td><td>" + arraySort[i][1] + "</td><td>" + arraySort[i][2] + "</td></tr>";	
			}
		}
		doTemp3++;	
		break;
	}
	str = "<tr><td><p onclick='sortBySomething(1);'>Tissue</p></td><td><p onclick='sortBySomething(2);'>Coefficient</p></td><td><p onclick='sortBySomething(3);'>Number</p></td></tr>" + str + strAll;
	document.getElementById('coefficient').innerHTML = str;
}