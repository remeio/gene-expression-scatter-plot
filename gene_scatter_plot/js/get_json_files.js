var keys = [];
var datas = new Array();
datas[0] = new Array();
var details = new Array();
details[0] = new Array();
var correlationCoefficient = 0;
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
           str1 = "others";
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
			document.getElementById('coefficient').innerHTML = getR();
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
function getR () {
      var str = "";
      for (var i = 0; i < keys.length; i++) {
        var sumOfSquareOfX = 0;//get R
        var sumOfSquareOfY = 0;
        var sumOfXTimesY = 0;
        var averageX = 0;
        var averageY = 0;
        var squareOfAverageX = 0;
        var squareOfAverageY = 0;
        var averageXTimesAverageY = 0;
        for (var j = 0; j < datas[i].length; j = j + 2) {
          var g1 = datas[i][j];
          var g2 = datas[i][j + 1];
          sumOfSquareOfX += g1 * g1;	//get R;
					sumOfSquareOfY += g2 * g2;
					sumOfXTimesY += g1 * g2;
					averageX += g1;
					averageY += g2;
        }
        var doN = datas[i].length;
        averageX /= doN;
        averageY /= doN;
        squareOfAverageX = averageX * averageX;
        squareOfAverageY = averageY * averageY;
        averageXTimesAverageY = averageX * averageY;
        correlationCoefficient = Math.abs((sumOfXTimesY - doN * averageXTimesAverageY) / (Math.sqrt((sumOfSquareOfX - doN * squareOfAverageX) * (sumOfSquareOfY - doN * squareOfAverageY))));
        str = str + "<tr><td>" + keys[i] + "</td><td>" + correlationCoefficient.toFixed(5) + "</td></tr>";
      }
      return str;
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