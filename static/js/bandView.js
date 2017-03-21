
function barStack(seriesData,tmpArray,xFlag,yFlag) {
	var l = seriesData.length;
	
	while (l--) {
		var posBase = 0; // positive base
		var negBase = 0; // negative base

		for(var j=0;j<seriesData[l].attrArray.length;++j){ //内层循环是指标
			var tmpObject = {};
			
			tmpObject.xLabel = xFlag ? seriesData[l].score : seriesData[l].x;
									
			if(showAttr[(seriesData[l].attrArray)[j].attrIndex]==0){
				tmpObject.y0 = tmpObject.y = tmpObject.size = 0;
			}
			
			else{
				tmpObject.y = yFlag ? (seriesData[l].attrArray)[j].diff : (seriesData[l].attrArray)[j].val;
					
				tmpObject.size = Math.abs(tmpObject.y);
				if (tmpObject.y < 0) {
					tmpObject.y0 = negBase
					negBase -= tmpObject.size
				} 
				else {
					tmpObject.y0 = posBase = posBase + tmpObject.size
				}
			}
			
			tmpArray[(seriesData[l].attrArray)[j].attrIndex].push(tmpObject);
		}		
	}
	
	//tmpArray.xExtent = [Math.min.apply(Math,tmpArray[0].map(function(o){return o.x;}))-1,Math.max.apply(Math,tmpArray[0].map(function(o){return o.x;}))+1];
	
	tmpArray.xExtent = Array.apply(null, {length: seriesData.length}).map(Number.call, Number);
	
	tmpArray.yExtent = d3.extent(
		d3.merge(
			d3.merge(
				tmpArray.map(function(e) { 
					return e.map(function(f) { return [Math.min(-f.y0,f.y0-f.size),Math.max(f.y0,-(f.y0-f.size))]; }) 
				})
			)
		)
	);
}

function drawArea(tmpArray,shiftXArray){
		for(var j=0;j<tmpArray.length;++j){
			shiftXArray[j]=new Array(2*(tmpArray[0].length));
			for(var k=0;k<2*tmpArray[0].length;++k){
				shiftXArray[j][k]={};
			}
		}
		for(var j=0;j<tmpArray.length;++j){
			for(var k=0;k<tmpArray[0].length;++k){
				shiftXArray[j][2*k].x = x(k);   
				shiftXArray[j][2*k].y0 = tmpArray[j][k].y0;
				shiftXArray[j][2*k].size = tmpArray[j][k].size;
				shiftXArray[j][2*k+1].x = x(k) + x.bandwidth();
				shiftXArray[j][2*k+1].y0 = tmpArray[j][k].y0;
				shiftXArray[j][2*k+1].size = tmpArray[j][k].size;
			}
		}
		return shiftXArray;
	};

var myData = [];	

var showAttr = [];

function syncLoad(filename) {
    var data;
    $.ajax({
        type: "GET",
        url: filename,
        dataType: "text",
        async: false,
        success: function(text) {
            data = d3.csvParse(text);		  
		    //console.log(data);
		  
		    myData = [];
		  
		    for(var i=0;i<data.length;++i){
			    var myDataObject = new Object();
			    myDataObject.x = Number(data[i].x);
			    myDataObject.score = Number(data[i].score);
			  
			    myDataObject.attrArray = new Array();
					for(var j=2; j<data.columns.length; j+=2){
					var tmpObject = {};
					tmpObject.attr = data.columns[j];
					
					tmpObject.val = Number(data[i][tmpObject.attr]);
					tmpObject.diff = Number(data[i][tmpObject.attr]) - Number(data[i][data.columns[j+1]]);
					
					tmpObject.attrIndex = j/2 - 1; //can we get rid of this?
										
					myDataObject.attrArray.push(tmpObject);
			    }
				myData.push(myDataObject);
		    }
		  
		    showAttr = new Array(myData[0].attrArray.length).fill(1); //Originally, show all attributes
		  
		    myData.sort(function(a,b){
		        return b.x-a.x;
		    });
		  
		    myData.forEach(
		        function(d){
			        d.attrArray.sort(
				        function(a,b){
					        return Math.abs(b.val)-Math.abs(a.val);
				        });
		    });
        }
    });
}

	syncLoad("static/data/bandView.csv");

	var tmp=new Array(myData[0].attrArray.length);

	var h = 500;
	var w = 500;
	var margin = 20;
	var color = d3.scaleOrdinal(d3.schemeCategory20);

	var x = d3.scaleBand()
			    .rangeRound([margin, w - margin])
			    .padding(0.5);
			
	var y = d3.scaleLinear().range([h - margin, margin]);

	
function drawGraph(xFlag, yFlag)
{
	for(var j=0;j<tmp.length;++j){
		tmp[j]=new Array();
	}
	
	barStack(myData,tmp,xFlag,yFlag);
	
	var shiftXArray=new Array(tmp.length);

	x.domain(tmp.xExtent);
	y.domain(tmp.yExtent);
	
	var xAxis = d3.axisBottom(x).tickFormat(function(d) { return tmp[0][d].xLabel; });
	var yAxis = d3.axisLeft(y).ticks(5);
	
	d3.select("svg").remove();
	
	svg = d3.select("body")
		.append("svg")
		.attr("height", h)
		.attr("width", w)
			
	var areaPath = d3.area()
					.curve(d3.curveMonotoneX)
					.x(function(d){return d.x})
					.y0(function(d){return y(d.y0)})
					.y1(function(d){return y(d.y0-d.size)});
	
	drawArea(tmp,shiftXArray);
	
	
	svg.selectAll("path")
		.data(shiftXArray)
		.enter()
		.append("path")
		.style("fill", function(d,i) { return color(i) })
		.style("opacity", 0.7) //透明度
		.attr("d",function(d,i){return areaPath(shiftXArray[i])});		
		
		
	svg.selectAll(".series")
		.data(tmp)
		.enter()
		.append("g")
		.classed("series", true)
		.style("fill", function(d,i) { return color(i) })
		.style("opacity", 0.8) //透明度
			.selectAll("rect")
			.data(Object)
			.enter()
			.append("rect")
				.attr("x", function(d,i) { return x(i); })
				.attr("y", function(d) { return y(d.y0); })
				.attr("height", function(d) { return y(0) - y(d.size); })
				.attr("width", x.bandwidth())
				.on("mouseover", function() { tooltip.style("display", null); })
				.on("mouseout", function() { tooltip.style("display", "none"); })
				.on("mousemove", function(d) {
					var xPosition = d3.mouse(this)[0] - 35;
					var yPosition = d3.mouse(this)[1] - 5;
					tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
					tooltip.select("text").text(d.y);
			});

	svg.append("g")
		.attr("class", "axis x")
		.attr("transform", "translate(0," + h/2 + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "axis y")
		.attr("transform", "translate(" + (w - margin)/2 + ",0)")
		.call(yAxis);
	
	svg.selectAll(".colorRect")
		.data(showAttr)
		.enter()
		.append("rect")
		.style("fill", function(d,i){ return color(i); })
		.style("opacity", function(d){ return (d)? 0.8 : 0.4; })
			.attr("x", 0)
			.attr("y", function(d,i) { return 20*i; })
			.attr("height", 20)
			.attr("width", 30)
			.on("click",function(d,i){
				changeShowAttr(i);
			});
		
	// Here we add tooltips 
	// Prep the tooltip bits, initial display is hidden

	var tooltip = svg.append("g")
	  .attr("class", "tooltip")
	  .style("display", "none");
		
	tooltip.append("rect")
	  .attr("width", 30)
	  .attr("height", 20)
	  .attr("fill", "white")
	  .style("opacity", 0.5);

	tooltip.append("text")
	  .attr("x", 15)
	  .attr("dy", "1.2em")
	  .style("text-anchor", "middle")
	  .attr("font-size", "12px")
	  .attr("font-weight", "bold");
	  
}

drawGraph(0,0);

var xFlag = 0;//if xFlag=0, present xAxis as +/-; if xFlag=1, present xAxis as total points
	 
function changeX(){
	xFlag = 1 - xFlag;
	myData.sort(function(a,b){
		if(xFlag)
		     return b.score - a.score;
		else return b.x - a.x;
	});
		
	drawGraph(xFlag,yFlag);
}

var yFlag = 0;//if yFlag=0, present yAxis as value; if yFlag=1, present xAxis as +/-

function changeY(){
	yFlag = 1 - yFlag;
	
	myData.forEach(
		function(d){
			d.attrArray.sort(
				function(a,b){
					if(yFlag)
						return Math.abs(b.diff) - Math.abs(a.diff);
					else return Math.abs(b.val) - Math.abs(a.val);
				});
	});
		
	drawGraph(xFlag,yFlag);
}

function changeShowAttr(i){
	showAttr[i] = 1 - showAttr[i];
	drawGraph(xFlag,yFlag);
}
