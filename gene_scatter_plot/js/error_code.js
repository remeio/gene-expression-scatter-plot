// JavaScript Document
function errorCode(temp) {
	var code = {
				'100': 'your browser does not support FileReader objects',
			   	'101': 'lack gene1 file',
				'102': 'lack gene2 file',
				'103': 'lack information file',
			   	'104': 'invalid json format in gene1 file',
				'105': 'invalid json format in gene2 file',
				'106': 'invalid json format in information file'
			   }
	alert("Error " + temp + ": " + code[temp]);
}