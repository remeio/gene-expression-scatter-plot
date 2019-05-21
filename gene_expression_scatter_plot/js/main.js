var tissues = [];
var datas = new Array();
datas[0] = new Array();
var details = new Array();
details[0] = new Array();
var groups = new Array();
var attrMatchs = new Array();
var tissueMatchs = new Array();
var detailMatchs = new Array();
var lastLineCorrelationCoefficient = "";
var numForChangingTheOrderByTissue = 0;
var numForChangingTheOrderByCoefficient = 0;
var numForChangingTheOrderByNumber = 0;
var numForChangingTheOrderByP = 0;
var executeAdjustOfBasicModel = "";
var strTissueSettings = "Tissue";
function startRun() {
    makeFileToString();
    displaySettingsPreviewOfBasicModel();
    addTheDefaultMatchToArray();
    keepPreview();
    showMatchs();
    $("#id_main_output_scatter").hide();
    $("#id_main_output_tooltips").hide();
    $("#id_main_output").hide();
    $("#id_main_settings").hide();
}
function clickTheSubmit() {
    $("#id_main_output_scatter").show();
    $("#id_main_output_tooltips").show();
    $("#id_main_input").hide();
    $("#id_main_output").show();
    $("#id_main_settings_settings").hide();
    $("#id_main_settings").hide();
    window.scrollTo(document.body.scrollHeight, 0);
    makeStringIntoJson();
    drawScatterPlot();
}
function makeFileToString() {
    var reader;
    if (FileReader) {
        reader = new FileReader();
        var objFile1 = document.getElementById("id_main_input_upload_gene1");
        var objFile2 = document.getElementById("id_main_input_upload_gene2");
        var objFile3 = document.getElementById("id_main_input_upload_information");
        objFile1.onchange = function () {
            var file = objFile1.files[0];
            reader.readAsText(file, 'utf-8');
            reader.onload = function () {
                document.getElementById('id_main_input_preview_gene1').innerHTML = reader.result;
            }
        }
        objFile2.onchange = function () {
            var file = objFile2.files[0];
            reader.readAsText(file, 'utf-8');
            reader.onload = function () {
                document.getElementById('id_main_input_preview_gene2').innerHTML = reader.result;
            }
        }
        objFile3.onchange = function () {
            var file = objFile3.files[0];
            reader.readAsText(file, 'utf-8');
            reader.onload = function () {
                    document.getElementById('id_main_input_preview_information').innerHTML = reader.result;
            }
        }
    }
    else {
        errorCode(100);
    }
}
function makeStringIntoJson() {
    var strGene1 = document.getElementById("id_main_input_preview_gene1").innerHTML;
    var strGene2 = document.getElementById("id_main_input_preview_gene2").innerHTML;
    var strInformation = document.getElementById("id_main_input_preview_information").innerHTML;
    if(strGene1 != "" && strGene2 != "") {
        var isJsonGene1 = isJson(strGene1);
        var isJsonGene2 = isJson(strGene2);
        var isJsonInformation = isJson(strInformation);
        if (isJsonGene1 && isJsonGene2) {
            var jsonGene1 = eval('(' + strGene1 + ')');
            var jsonGene2 = eval('(' + strGene2 + ')');
            if (isJsonInformation) {
                var jsonInformation = eval('(' + strInformation + ')');
            }
            else {
                errorCode(106);
                var jsonInformation = null;
            }
            var testOrder1 = !isGene1OrGene2Json(strGene1);
            var testOrder2 = !isGene1OrGene2Json(strGene2);
            if (testOrder1 || testOrder2) {
                errorCode(108);
            }
            else {
                makeJsonIntoArray(jsonGene1, jsonGene2, jsonInformation, isJsonInformation);
            }
        }
        else {
            if (!isJsonGene1) {
                errorCode(104);
            }
            if (!isJsonGene2) {
                errorCode(105);
            }
            if (!isJsonInformation) {
                errorCode(106);
            }
        }
    }
    else {
        if (strGene1 == "") {
            errorCode(101);
        }
        if (strGene2 == "") {
            errorCode(102);
        }
        if (strInformation == "") {
            errorCode(103);
        }
    }
}
function makeJsonIntoArray(jsonGene1, jsonGene2, jsonInformation, isJsonInformation) {
    var numberOfExecuted = 0;
    var numberOfExecutedInfor = 0;
    var numberOfGene1 = 0;
    var numberOfGene2 = 0;
    var numberOfInformation = 0;
    for (var attrGene1 in jsonGene1) {
        var attrGene2 = "";
        var attrInformation = "";
        var attrTissue = "";
        var attrDetail = "";
        for (var i = 0; i < attrMatchs.length; i++) {
            var attrTemp = attrGene1.replace(attrMatchs[i][0], "");
            attTemp = attrTemp.replace(attrMatchs[i][1], "");
            var gene2Temp = attrMatchs[i][2] + attTemp + attrMatchs[i][3];
            if (jsonGene2[gene2Temp] != undefined) {
                attrGene2 = gene2Temp;
                break;
            }
        }
        for (var i = 0; i < attrMatchs.length; i++) {
            var attrTemp = attrGene1.replace(attrMatchs[i][0], "");
            attTemp = attrTemp.replace(attrMatchs[i][1], "");
            var inforTemp = attrMatchs[i][4] + attTemp + attrMatchs[i][5];
            if (isJsonInformation && jsonInformation[inforTemp] != undefined) {
                attrInformation = inforTemp;
                break;
            }
        }
        var numGene1 = jsonGene1[attrGene1];
        var numGene2 = jsonGene2[attrGene2];
        if ( !isNaN(numGene1) && !isNaN(numGene2)) {
            var strTissue = "";
            var strDetail = "";
            if (jsonInformation == null || jsonInformation[attrInformation] == undefined) {
               strTissue = "unknown";
               strDetail = "The information of gene1, gene2 can't be found.";
            }
            else {
                numberOfExecutedInfor++;
                strTissue = "undefined";
                strDetail = "The information of gene1, gene2 can be found, but the tissue and detail can't be used."
                for (var i = 0; i < tissueMatchs.length; i++) {
                    var tissueTemp = tissueMatchs[i];
                    if (jsonInformation[attrInformation][tissueTemp] != undefined) {
                        strTissue = jsonInformation[attrInformation][tissueTemp];
                        var wordChar = tissueTemp.charAt(0) + "";
                        strTissueSettings = wordChar.toUpperCase() + tissueTemp.substring(1);
                        break;
                    }
                }
                for (var i = 0; i < detailMatchs.length; i++) {
                    var detailTemp = detailMatchs[i];
                    if (jsonInformation[attrInformation][detailTemp] != undefined) {
                        strDetail = jsonInformation[attrInformation][detailTemp];
                        break;
                    }
                }
            }
            var index = indexOfTissues(strTissue, tissues);
            if (index == -1) {
                tissues.push(strTissue);
                index = indexOfTissues(strTissue, tissues);
                datas[index] = new Array();
                details[index] = new Array();
            }
            datas[index].push(numGene1);
            datas[index].push(numGene2);
            details[index].push(strDetail);
            numberOfExecuted++;
        }
        numberOfGene1++;
    }
    for(var attrGene2 in jsonGene2) {
        numberOfGene2++;
    }
    for(var attrInformation in jsonInformation) {
        numberOfInformation++;
    }
    setAndDisplayUtilization(numberOfExecuted, numberOfExecutedInfor, numberOfGene1, numberOfGene2, numberOfInformation, isJsonInformation);
    lastLineCorrelationCoefficient = getCorrelationCoefficientAndSetGroups();
    sortByColumn(2);
}
function setAndDisplayUtilization (numberOfExecuted, numberOfExecutedInfor, numberOfGene1, numberOfGene2, numberOfInformation, isJsonInformation) {
    document.getElementById("id_main_output_utilization").innerHTML =
        "Gene1 utilization: " +
        Math.round(numberOfExecuted / numberOfGene1 * 100.0)  + "%  " +
        numberOfExecuted + "/" + numberOfGene1 +
        "<br>Gene2 utilization: " +
        Math.round(numberOfExecuted / numberOfGene2 * 100.0) + "%  " +
        numberOfExecuted + "/" + numberOfGene2;
    if (isJsonInformation) {
        document.getElementById("id_main_output_utilization").innerHTML =
            document.getElementById("id_main_output_utilization").innerHTML +
            "<br>Information utilization: " +
            Math.round(numberOfExecutedInfor / numberOfInformation * 100.0) + "%  " +
            numberOfExecutedInfor + "/" + numberOfInformation;
    }
}
function sortByColumn(numForChangingTheOrderByColumn) {
    var str = "";
    for (var i = 0; i < groups.length - 1; i++) {
        for (var j = i + 1; j < groups.length; j++) {
            if (groups[j][numForChangingTheOrderByColumn - 1] > groups[i][numForChangingTheOrderByColumn - 1]) {
                var temp1 = groups[i][0];
                var temp2 = groups[i][1];
                var temp3 = groups[i][2];
                var temp4 = groups[i][3];
                var temp5 = groups[i][4];
                groups[i][0] = groups[j][0];
                groups[i][1] = groups[j][1];
                groups[i][2] = groups[j][2];
                groups[i][3] = groups[j][3];
                groups[i][4] = groups[j][4];
                groups[j][0] = temp1;
                groups[j][1] = temp2;
                groups[j][2] = temp3;
                groups[j][3] = temp4;
                groups[j][4] = temp5;
            }
        }
    }
    switch (numForChangingTheOrderByColumn) {
        case 1:
        if (numForChangingTheOrderByTissue % 2 == 0) {
            for (var i = 0; i < groups.length; i++) {
                str = str + "<tr><td>" + groups[i][0] + "</td><td>" + groups[i][1].toFixed(5) + groups[i][4] + "</td><td>" + groups[i][2] + "</td><td>" + makeNumberToStringAndExponential(groups[i][3]) + "</td></tr>";
            }
        }
        else {
            for (var i = groups.length - 1; i >= 0; i--) {
                str = str + "<tr><td>" + groups[i][0] + "</td><td>" + groups[i][1].toFixed(5) + groups[i][4] + "</td><td>" + groups[i][2] + "</td><td>" + makeNumberToStringAndExponential(groups[i][3]) + "</td></tr>";
            }
        }
        numForChangingTheOrderByTissue++;
        break;
        case 2:
        if (numForChangingTheOrderByCoefficient % 2 == 0) {
            for (var i = 0; i < groups.length; i++) {
                str = str + "<tr><td>" + groups[i][0] + "</td><td>" + groups[i][1].toFixed(5) + groups[i][4] + "</td><td>" + groups[i][2] + "</td><td>" + makeNumberToStringAndExponential(groups[i][3]) + "</td></tr>";
            }
        }
        else {
            for (var i = groups.length - 1; i >= 0; i--) {
                str = str + "<tr><td>" + groups[i][0] + "</td><td>" + groups[i][1].toFixed(5) + groups[i][4] + "</td><td>" + groups[i][2] + "</td><td>" + makeNumberToStringAndExponential(groups[i][3]) + "</td></tr>";
            }
        }
        numForChangingTheOrderByCoefficient++;
        break;
        case 3:
        if (numForChangingTheOrderByNumber % 2 == 0) {
            for (var i = 0; i < groups.length; i++) {
                str = str + "<tr><td>" + groups[i][0] + "</td><td>" + groups[i][1].toFixed(5) + groups[i][4] + "</td><td>" + groups[i][2] + "</td><td>" + makeNumberToStringAndExponential(groups[i][3]) + "</td></tr>";
            }
        }
        else {
            for (var i = groups.length - 1; i >= 0; i--) {
                str = str + "<tr><td>" + groups[i][0] + "</td><td>" + groups[i][1].toFixed(5) + groups[i][4] + "</td><td>" + groups[i][2] + "</td><td>" + makeNumberToStringAndExponential(groups[i][3]) + "</td></tr>";
            }
        }
        numForChangingTheOrderByNumber++;
        break;
        case 4:
        if (numForChangingTheOrderByP % 2 == 0) {
            for (var i = 0; i < groups.length; i++) {
                str = str + "<tr><td>" + groups[i][0] + "</td><td>" + groups[i][1].toFixed(5) + groups[i][4] + "</td><td>" + groups[i][2] + "</td><td>" + makeNumberToStringAndExponential(groups[i][3]) + "</td></tr>";
            }
        }
        else {
            for (var i = groups.length - 1; i >= 0; i--) {
                str = str + "<tr><td>" + groups[i][0] + "</td><td>" + groups[i][1].toFixed(5) + groups[i][4] + "</td><td>" + groups[i][2] + "</td><td>" + makeNumberToStringAndExponential(groups[i][3]) + "</td></tr>";
            }
        }
        numForChangingTheOrderByP++;
        break;
    }
    str = "<tr><th><p onclick='sortByColumn(1);'>" + strTissueSettings + "</p></th><th><p onclick='sortByColumn(2);'>Correlation Coefficient</p></th><th><p onclick='sortByColumn(3);'>Number</p></th><th style='width: 200px;'><p onclick='sortByColumn(4);'>P Value (one-tail)</p></th></tr>" +
        str + lastLineCorrelationCoefficient;
    document.getElementById("id_main_output_table").innerHTML = str;
}
function drawScatterPlot() {
    var tissues = getTissues();
    var datas = getDatas();
    var details = getDetatils();
    var tempX = 0;
    var tempY = 0;
    var chart;
    nv.addGraph(function() {
        chart = nv.models.scatterChart()
            .showDistX(true)
            .showDistY(true)
            .duration(300)
            .color(d3.scale.category10().range());
        chart.dispatch.on('renderEnd', function(){
            console.log('render complete');
        });
        chart.tooltip.headerFormatter(function(d, i) {
            tempX = chart.xAxis.tickFormat()(d, i);
            return ;
        });
        chart.tooltip.valueFormatter(function(d, i) {
            tempY = chart.yAxis.tickFormat()(d, i);
            return getDetail(tissues, datas, details, tempX, tempY);
        });
        chart.tooltip.keyFormatter(function(d, i) {
            return d;
        });
        chart.xAxis.tickFormat(d3.format('.05f'));
        chart.yAxis.tickFormat(d3.format('.05f'));
        var dataset = getData(tissues, datas, details);
        d3.select('#id_main_output_scatter svg')
            .datum(nv.log(dataset))
            .call(chart)
        nv.utils.windowResize(chart.update);
        chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
        return chart;
    });
    function getData(tissues, datas, details) {
        var data = [],
            shapes = ['square'],
            random = d3.random.normal();

        for (i = 0; i < tissues.length; i++) {
            data.push({
                key: tissues[i],
                values: []
            });

            for (j = 0; j < datas[i].length; j = j + 2) {
                data[i].values.push({
                    x: datas[i][j],
                    y: datas[i][j + 1],
                });
            }
            data[i].values.push({
                    x: 0,
                    y: 0,
            });
        }
        return data;
    }
   function getDetail(tissues, datas, details, tempX, tempY) {
      for (var i = 0; i < datas.length; i++) {
        for (var j = 0; j < datas[i].length; j = j + 2) {
          if (datas[i][j].toFixed(5) == tempX && datas[i][j + 1].toFixed(5) == tempY) {
            var index = indexOfGroups(tissues[i], groups);
            var preDetail = "<p class='tooltips_left' style='text-align: left; overflow: auto; '>";
            var tempDetail = strTissueSettings + ": " + tissues[i] + "<br>(" + datas[i][j] + ", " + datas[i][j + 1] + ")<br><br>Correlation Coefficient: " + groups[index][1].toFixed(5) +
                groups[index][4] + "<br>Number: " + groups[index][2] + "<br>P Value (one-tail): " + makeNumberToStringAndExponential(groups[index][3]) + "<br><br>" +details[i][j / 2];
            tempDetail = preDetail + tempDetail + "<br>";
            document.getElementById("id_main_output_tooltips_detail").innerHTML = tempDetail + "</p>";
            return "(" + datas[i][j] + ", " + datas[i][j + 1] + ")";
          }
        }
      }
      return "";
    }
}
function clickTheSettings() {
    if (document.getElementById("id_main_settings_settings").innerHTML == "Settings") {
        $("#id_main_settings").show();
        window.scrollTo(0,document.body.scrollHeight);
        document.getElementById("id_main_settings_settings").innerHTML = "Settings&#9660";
    }
    else {
        $("#id_main_settings").hide();
        document.getElementById("id_main_settings_settings").innerHTML = "Settings";
    }
}
function displaySettingsPreviewOfBasicModel() {
    var tempError = "Invalid Format"
    var gene1Str = document.getElementById("id_main_settings_modelbasic_input_gene1").value;
    var gene2Str = document.getElementById("id_main_settings_modelbasic_input_gene2").value;
    var inforStr = document.getElementById("id_main_settings_modelbasic_input_information").value;
    var tissueStr = document.getElementById("id_main_settings_modelbasic_input_tissue").value;
    var detailStr = document.getElementById("id_main_settings_modelbasic_input_detail").value;
    var minStr = gene1Str.length < gene2Str.length ? gene1Str : gene2Str;
    if (minStr == gene1Str) {
        minStr = gene1Str.length < inforStr.length ? gene1Str : inforStr;
    }
    else {
        minStr = gene2Str.length < inforStr.length ? gene2Str : inforStr;
    }
    document.getElementById("id_main_settings_modelbasic_output_gene1left").value = tempError;
    document.getElementById("id_main_settings_modelbasic_output_gene1key").value = tempError;
    document.getElementById("id_main_settings_modelbasic_output_gene1right").value = tempError;
    document.getElementById("id_main_settings_modelbasic_output_gene2left").value = tempError;
    document.getElementById("id_main_settings_modelbasic_output_gene2key").value = tempError;
    document.getElementById("id_main_settings_modelbasic_output_gene2right").value = tempError;
    document.getElementById("id_main_settings_modelbasic_output_informationleft").value = tempError;
    document.getElementById("id_main_settings_modelbasic_output_informationkey").value = tempError;
    document.getElementById("id_main_settings_modelbasic_output_informationright").value = tempError;
    findMinOfMaxLoop: for (var j = minStr.length; j >= 1; j--) {
        for (var i = 0; i + j <= minStr.length; i++) {
            var judgeMinOfMax = minStr.substring(i, j + i);
            if (gene1Str.indexOf(judgeMinOfMax) != -1 && gene2Str.indexOf(judgeMinOfMax) != -1 && inforStr.indexOf(judgeMinOfMax) != -1) {
                var adjustG1Left = gene1Str.substring(0, gene1Str.indexOf(judgeMinOfMax));
                var adjustG1Right = gene1Str.substring(gene1Str.indexOf(judgeMinOfMax) + judgeMinOfMax.length);
                var adjustG2Left = gene2Str.substring(0, gene2Str.indexOf(judgeMinOfMax));
                var adjustG2Right = gene2Str.substring(gene2Str.indexOf(judgeMinOfMax) + judgeMinOfMax.length);
                var adjustInforLeft = inforStr.substring(0, inforStr.indexOf(judgeMinOfMax));
                var adjustInforRight = inforStr.substring(inforStr.indexOf(judgeMinOfMax) + judgeMinOfMax.length);
                document.getElementById("id_main_settings_modelbasic_output_gene1left").value = adjustG1Left;
                document.getElementById("id_main_settings_modelbasic_output_gene1key").value = judgeMinOfMax;
                document.getElementById("id_main_settings_modelbasic_output_gene1right").value = adjustG1Right;
                document.getElementById("id_main_settings_modelbasic_output_gene2left").value = adjustG2Left;
                document.getElementById("id_main_settings_modelbasic_output_gene2key").value = judgeMinOfMax;
                document.getElementById("id_main_settings_modelbasic_output_gene2right").value = adjustG2Right;
                document.getElementById("id_main_settings_modelbasic_output_informationleft").value = adjustInforLeft;
                document.getElementById("id_main_settings_modelbasic_output_informationkey").value = judgeMinOfMax;
                document.getElementById("id_main_settings_modelbasic_output_informationright").value = adjustInforRight;
                break findMinOfMaxLoop;
            }
        }
    }
}
function keepKey(idOfKey) {
    var strOfKey = document.getElementById(idOfKey).value;
    document.getElementById("id_main_settings_modelbasic_output_gene1key").value = strOfKey;
    document.getElementById("id_main_settings_modelbasic_output_gene2key").value = strOfKey;
    document.getElementById("id_main_settings_modelbasic_output_informationkey").value = strOfKey;
    keepPreview();
}
function keepPreview() {
    var adjustG1Left = document.getElementById("id_main_settings_modelbasic_output_gene1left").value;
    var adjustG1Right = document.getElementById("id_main_settings_modelbasic_output_gene1right").value;
    var adjustG2Left = document.getElementById("id_main_settings_modelbasic_output_gene2left").value;
    var adjustG2Right = document.getElementById("id_main_settings_modelbasic_output_gene2right").value;
    var adjustInforLeft = document.getElementById("id_main_settings_modelbasic_output_informationleft").value;
    var adjustInforRight = document.getElementById("id_main_settings_modelbasic_output_informationright").value;
    var judgeMinOfMax = document.getElementById("id_main_settings_modelbasic_output_gene1key").value;
    var tissueStr = document.getElementById("id_main_settings_modelbasic_input_tissue").value;
    var detailStr = document.getElementById("id_main_settings_modelbasic_input_detail").value;
    displayStr = "<br>{ \"" + adjustG1Left.fontcolor("red") + judgeMinOfMax.fontcolor("blue") + adjustG1Right.fontcolor("red") + "\": 1.00, --- }<br>" +
                    "{ \"" + adjustG2Left.fontcolor("red") + judgeMinOfMax.fontcolor("blue") + adjustG2Right.fontcolor("red") + "\": 1.00, --- }<br>" +
                    "{ \"" + adjustInforLeft.fontcolor("red") + judgeMinOfMax.fontcolor("blue") + adjustInforRight.fontcolor("red") + "\": {\"" +
                    tissueStr.fontcolor("green") + "\": \"root\", " + detailStr.fontcolor("green") + "\": something }, --- }";
    document.getElementById("id_main_settings_modelbasic_preview").innerHTML = displayStr;
}
function clickTheAddOfBasicModel() {
    addTheMatchToArray();
    showMatchs();
}
function addTheDefaultMatchToArray() {
    var len = attrMatchs.length;
    attrMatchs[len] = new Array();
    attrMatchs[len].push("");
    attrMatchs[len].push("");
    attrMatchs[len].push("");
    attrMatchs[len].push("");
    attrMatchs[len].push("");
    attrMatchs[len].push("");

    len++;
    attrMatchs[len] = new Array();
    attrMatchs[len].push("R0");
    attrMatchs[len].push("XX");
    attrMatchs[len].push("R0");
    attrMatchs[len].push("XX");
    attrMatchs[len].push("");
    attrMatchs[len].push("");
    
    len++;
    attrMatchs[len] = new Array();
    attrMatchs[len].push("R0");
    attrMatchs[len].push("XXX");
    attrMatchs[len].push("R0");
    attrMatchs[len].push("XXX");
    attrMatchs[len].push("");
    attrMatchs[len].push("");
    
    tissueMatchs.push("tissue");
    tissueMatchs.push("category");
    detailMatchs.push("detail");
}
function addTheMatchToArray() {
    var adjustG1Left = document.getElementById("id_main_settings_modelbasic_output_gene1left").value;
    var adjustG1Right = document.getElementById("id_main_settings_modelbasic_output_gene1right").value;
    var adjustG2Left = document.getElementById("id_main_settings_modelbasic_output_gene2left").value;
    var adjustG2Right = document.getElementById("id_main_settings_modelbasic_output_gene2right").value;
    var adjustInforLeft = document.getElementById("id_main_settings_modelbasic_output_informationleft").value;
    var adjustInforRight = document.getElementById("id_main_settings_modelbasic_output_informationright").value;
    var tissue = document.getElementById("id_main_settings_modelbasic_input_tissue").value;
    var detail = document.getElementById("id_main_settings_modelbasic_input_detail").value;
    var len;
    var existTheAttr = isExistInAttrMatchs(adjustG1Left, adjustG1Right, adjustG2Left, adjustG2Right, adjustInforLeft, adjustInforRight);
    var existTheTissue = isExistInTissueMatchs(tissue);
    var existTheDetail = isExistInDetailMatchs(detail);
    if (!existTheAttr) {
        len = attrMatchs.length;
        attrMatchs[len] = new Array();
        attrMatchs[len].push(adjustG1Left);
        attrMatchs[len].push(adjustG1Right);
        attrMatchs[len].push(adjustG2Left);
        attrMatchs[len].push(adjustG2Right);
        attrMatchs[len].push(adjustInforLeft);
        attrMatchs[len].push(adjustInforRight);
    }
    if (!existTheTissue) {
        tissueMatchs.push(tissue);
    }
    if (!existTheDetail) {
        detailMatchs.push(detail);
    }
    if (existTheAttr && existTheTissue && existTheDetail) {
        errorCode(107);
    }
    else {
        document.getElementById("id_main_settings_modelbasic_lastsaved").innerHTML = "<i>Last added: " + getTime() + "</i>";
    }
}
function showMatchs() {
    var num = 1;
    var str = "";
    var strThen = "";
    var strEnd = "";
    var strKey = "<i>_key_</i>";
    var strTable = "<caption><b>Acceptable Samples</b></caption><tr><th>No</th><th>Gene1</th><th>Gene2</th><th>Information</th><th>Attribute1</th><th>Attribute2</th></tr>";
    for (var i = 0; i < attrMatchs.length; i++) {
        str =  "</td><td>" + attrMatchs[i][0].fontcolor("red") + strKey.fontcolor("blue") + attrMatchs[i][1].fontcolor("red") + "</td><td>" +
        attrMatchs[i][2].fontcolor("red") + strKey.fontcolor("blue") + attrMatchs[i][3].fontcolor("red") + "</td><td>" +
        attrMatchs[i][4].fontcolor("red") + strKey .fontcolor("blue")+ attrMatchs[i][5].fontcolor("red") + "</td>";
        for (var j = 0; j < tissueMatchs.length; j++) {
            strThen = str + "<td>" + tissueMatchs[j].fontcolor("green") + "</td>"
            for (var k = 0; k < detailMatchs.length; k++) {
                strEnd = strEnd + "<tr><td>" + num + strThen + "<td>" + detailMatchs[k].fontcolor("green") + "</td></tr>";
                num++;
            }
        }
    }
    strEnd = strTable + strEnd;
    document.getElementById("id_main_settings_modelbasic_attr_table").innerHTML = strEnd;
    
}
function isExistInAttrMatchs(adjustG1Left, adjustG1Right, adjustG2Left, adjustG2Right, adjustInforLeft, adjustInforRight) {
    for (var i = 0; i < attrMatchs.length; i++) {
        if (attrMatchs[i][0] == adjustG1Left && attrMatchs[i][1] == adjustG1Right && attrMatchs[i][2] == adjustG2Left &&
            attrMatchs[i][3] == adjustG2Right && attrMatchs[i][4] == adjustInforLeft && attrMatchs[i][5] == adjustInforRight){ 
            return true;
        }
    }
    return false;
}
function isExistInTissueMatchs(tissue) {
    for (var i = 0; i < tissueMatchs.length; i++) {
        if (tissueMatchs[i] == tissue) {
            return true;
        }
    }
    return false;
}
function isExistInDetailMatchs(detail) {
    for (var i = 0; i < detailMatchs.length; i++) {
        if (detailMatchs[i] == detail) {
            return true;
        }
    }
    return false;
}
function getCorrelationCoefficientAndSetGroups () {
    var tail = 1;
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
    for (var i = 0; i < datas.length; i++) {
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
        correlationCoefficient = (sumOfXTimesY - doN * averageXTimesAverageY) / (Math.sqrt((sumOfSquareOfX - doN * squareOfAverageX) * (sumOfSquareOfY - doN * squareOfAverageY)));
        var sign = " (+)";
        if (correlationCoefficient < 0) {
            sign = " (-)";
        }
        if (isNaN(correlationCoefficient)) {
            correlationCoefficient = 0;
            sign = " (NaN)";
        }
        var pValue = correlationCoefficientToPValue(correlationCoefficient, doN, 1);
        groups[i] = new Array(tissues[i], Math.abs(correlationCoefficient), doN, pValue, sign);
    }
    averageX1 /= allN;
    averageY1 /= allN;
    squareOfAverageX1 = averageX1 * averageX1;
    squareOfAverageY1 = averageY1 * averageY1;
    averageXTimesAverageY1 = averageX1 * averageY1;
    correlationCoefficient1 = (sumOfXTimesY1 - allN * averageXTimesAverageY1) / (Math.sqrt((sumOfSquareOfX1 - allN * squareOfAverageX1) * (sumOfSquareOfY1 - allN * squareOfAverageY1)));
    sign = " (+)";
    if (correlationCoefficient1 < 0) {
        sign = " (-)";
    }
    if (isNaN(correlationCoefficient1)) {
        correlationCoefficient1 = 0;
        sign = " (NaN)";
    }
    var pTemp = correlationCoefficientToPValue(correlationCoefficient1, allN, 1);
    return "<tr><td><b>total</b></td><td><b>" + correlationCoefficient1.toFixed(5) + sign + "</b></td><td><b>" + allN + "</b></td><td><b>" + makeNumberToStringAndExponential(pTemp) + "<b></td></tr>";
}
function getTissues() {
    return this.tissues;
}
function getDatas() {
    return this.datas;
}
function getDetatils() {
    return this.details;
}

function errorCode(temp) {
    var code = {
                '100': 'your browser does not support FileReader objects',
                '101': 'lack gene1 file',
                '102': 'lack gene2 file',
                '103': 'lack information file',
                '104': 'invalid json format in gene1 file',
                '105': 'invalid json format in gene2 file',
                '106': 'invalid json format in information file',
                '107': 'sample already exists, no need to add it again',
                '108': 'invalid gene1, gene2, or information uploading order, please upload again by right order'
               }
    alert("Error " + temp + ": " + code[temp]);
}
function isJson(str) {
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
function indexOfTissues(tissue, tissues) {
    for (var i = 0; i < tissues.length; i++) {
        if (tissue == tissues[i]) {
            return i;
        }
    }
    return -1;
}
function indexOfGroups(tissue, groups) {
    for (var i = 0; i < groups.length; i++) {
        if (tissue == groups[i][0]) {
            return i;
        }
    }
}
function getTime() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return formatZero(hour) + ":" + formatZero(minute) + ":" + formatZero(second);
    }
function formatZero(temp){
    if (temp >= 0 && temp <= 9) {
        return 0 + "" + temp;
    }
    else {
        return temp;
    }
}
function correlationCoefficientToPValue(r, n, tail) {
    var degreesOfFreedom = n;
    var t = r * Math.pow((degreesOfFreedom - 2) / (1 - r * r), 0.5);
    t = Math.abs(t);
    if (degreesOfFreedom <= 2) {
        return 0.5 * tail;
    }
    return TtoP(t, degreesOfFreedom) / 2 * tail;
}
function makeNumberToStringAndExponential(temp) {
    var eTemp = temp.toExponential(3);
    var strTemp = eTemp + "";
    var indexOfE = 0;
    var str = "";
    for (var i = 0; i < strTemp.length; i++) {
        if(strTemp.charAt(i) == 'e') {
            indexOfE = i;
            break;
        }
    }
    str = strTemp.substring(0, indexOfE) + "&times;10<sup>" + strTemp.substring(indexOfE + 1) + "</sup>";
    return str;
}
function isGene1OrGene2Json(str) {
    var n = 0;
    for (var i = 0; i < str.length; i++) {
        if (str.charAt(i) == '{') {
            n++;
        }
        if (n > 2) {
            break;
        }
    }
    if (n == 1) {
        return true;
    }
    return false;
}