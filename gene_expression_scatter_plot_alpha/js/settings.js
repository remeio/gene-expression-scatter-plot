function get_difference(temp) {
	var displayStr = "Ensure that they have same substring.";
	var gene1Str = document.getElementById("input_g1").value;
	var gene2Str = document.getElementById("input_g2").value;
	var inforStr = document.getElementById("input_infor").value;
	var tissueStr = document.getElementById("input_tissue").value;
	var detailStr = document.getElementById("input_detail").value;
	var minStr = gene1Str.length < gene2Str.length ? gene1Str : gene2Str;
	if (minStr == gene1Str) {
		minStr = gene1Str.length < inforStr.length ? gene1Str : inforStr;
	}
	else {
		minStr = gene2Str.length < inforStr.length ? gene2Str : inforStr;
	}
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
				displayPreAndNow (adjustG1Left, adjustG1Right, adjustG2Left, adjustG2Right, adjustInforLeft, adjustInforRight, tissueStr, detailStr, judgeMinOfMax, temp);
				break findMinOfMaxLoop;
			}
		}	
	}
}

function set_difference_back_end(adjustG1Left, adjustG1Right, adjustG2Left, adjustG2Right, adjustInforLeft, adjustInforRight, tissueStr, detailStr, judgeMinOfMax) {
	attrGene2Fun = "var temp = attr.replace('" + adjustG1Left + "', ''); tempStrG2 = '" + adjustG2Left + "'+ temp.replace('" + adjustG1Right + "', '') + '" + adjustG2Right + "';";
	attrInformationFun = "temp = attr.replace('" + adjustG1Left + "', ''); tempStrInfo = '" + adjustInforLeft + "'+ temp.replace('" + adjustG1Right + "', '') + '" + adjustInforRight+ "';";
	attrTissueAndAttrDetailFun = "tempStrTissue = '" + tissueStr + "'; tempStrDetail = '" + detailStr + "';";
}
function isClickedSet() {
	if (document.getElementById("setting").innerHTML == "Settings(off)") {
		$("#settings").show();
		window.scrollTo(0,document.body.scrollHeight);
		document.getElementById("setting").innerHTML = "Settings(on)";
	}
	else {
		$("#settings").hide();
		document.getElementById("setting").innerHTML = "Settings(off)";
	}
}
function makeSure(temp) {
	if (confirm("Are you sure?") == true) {
		get_difference(temp);
	}
}
function displayPreAndNow (adjustG1Left, adjustG1Right, adjustG2Left, adjustG2Right, adjustInforLeft, adjustInforRight, tissueStr, detailStr, judgeMinOfMax, temp) {
	
	displayStr = "Preview:<br><br>{ \"" + adjustG1Left.fontcolor("red") + judgeMinOfMax.fontcolor("blue") + adjustG1Right.fontcolor("red") + "\": 1.00, --- }<br>";
	displayStr = displayStr + "{ \"" + adjustG2Left.fontcolor("red") + judgeMinOfMax.fontcolor("blue") + adjustG2Right.fontcolor("red") + "\": 1.00, --- }<br>";
	displayStr = displayStr + "{ \"" + adjustInforLeft.fontcolor("red") + judgeMinOfMax.fontcolor("blue") + adjustInforRight.fontcolor("red") + "\": {\"" 
				+ tissueStr.fontcolor("green") + "\": \"root\", " + detailStr.fontcolor("green") + "\": something }, --- }<br><br>";
	if (temp == -1) {
		document.getElementById("preview_diff0").innerHTML = displayStr.replace("Preview", "Current");
		set_difference_back_end(adjustG1Left, adjustG1Right, adjustG2Left, adjustG2Right, adjustInforLeft, adjustInforRight, tissueStr, detailStr, judgeMinOfMax);
	}
	displayStr = displayStr + "Tips:<br><br>The largest substring is " + judgeMinOfMax.fontcolor("blue") + " for gene1, gene2 and information.";
	document.getElementById("preview_diff").innerHTML = displayStr;
}