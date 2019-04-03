// JavaScript Document
var reader;
if (FileReader) {
	reader = new FileReader();
	var objFile1 = document.getElementById("gene1");
	var objFile2 = document.getElementById("gene2");
	var objFile3 = document.getElementById("info");
	
    objFile1.onchange = function () {
		var file = objFile1.files[0];
		reader.readAsText(file, 'utf-8');
		reader.onload = function () {
			document.getElementById('gene1Preview').innerHTML = reader.result;
		}
	}
	
	objFile2.onchange = function () {
		var file = objFile2.files[0];
		reader.readAsText(file, 'utf-8');
		reader.onload = function () {
			document.getElementById('gene2Preview').innerHTML = reader.result;
		}
	} 	
	
	objFile3.onchange = function () {
		var file = objFile3.files[0];
		reader.readAsText(file, 'utf-8');
		reader.onload = function () {
				document.getElementById('infoPreview').innerHTML = reader.result;
			}
	} 
}
else {
	errorCode(100);
}
     