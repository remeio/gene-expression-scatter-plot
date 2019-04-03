function draw() {
  document.getElementById('main').innerHTML = '';
  $("#end").show();
  $("#test1").show();
	var keys = getKeys();
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
            //document.getElementById('detail').innerHTML = tempX + ", " + tempY;
            return getDetail(keys, datas, details, tempX, tempY);
        });
        chart.tooltip.keyFormatter(function(d, i) {
            return d;
        });
        chart.xAxis.tickFormat(d3.format('.05f'));
        chart.yAxis.tickFormat(d3.format('.05f'));
        var dataset = getData(keys, datas, details);
        d3.select('#test1 svg')
            .datum(nv.log(dataset))
            .call(chart)
        nv.utils.windowResize(chart.update);
        
        chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
        //controls.dispatch.on
        return chart;
    });
	
	 function getData(keys, datas, details) { //# groups,# points per group
        var data = [],
            shapes = ['square'],
            random = d3.random.normal();

        for (i = 0; i < keys.length; i++) {
            data.push({
                key: keys[i],
                values: []
            });

            for (j = 0; j < datas[i].length; j = j + 2) {
                data[i].values.push({
                    x: datas[i][j],
                    y: datas[i][j + 1],
                });
            }
        }
        return data;
    }
    
   function getDetail(keys, datas, details, tempX, tempY) {
      for (var i = 0; i < keys.length; i++) {
        for (var j = 0; j < datas[i].length; j = j + 2) {
          if (datas[i][j].toFixed(5) == tempX && datas[i][j + 1].toFixed(5) == tempY) {
            var tempDetail = "(" + datas[i][j] + ", " + datas[i][j + 1] + ")<br>" + details[i][j / 2];
            var finalDetail = "";
            for (var k = 0; k < tempDetail.length; k++) {
              finalDetail = finalDetail + tempDetail.charAt(k);
              if ((k % 100 == 0 && k != 0)/* || tempDetail.charAt(k) == ';' || tempDetail.charAt(k) == ','*/) {
                finalDetail = finalDetail + "<br>-";
              }
            }
            console.log(finalDetail);
            return finalDetail;
          }
        }
      }
      return "Detail: not found";
    }
}
//	var keys = [1,2,3];
//	var datas = [[1,2],
//				[2,7,8,9],
//				[2,5,11,9,12,8]];
//	var details = [[111],[211,212],[311,312,313]];
	


   