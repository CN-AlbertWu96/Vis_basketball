function barStack(seriesData,tmpArray,xFlag,yFlag,gameFilter,viewFlag) {
	for(var l=0;l<seriesData.length;++l)
	{
		if(gameFilter.winOrLoss>=0 && gameFilter.winOrLoss!=seriesData[l].winOrLoss) continue;
		if(gameFilter.homeOrAway>=0 && gameFilter.homeOrAway!=seriesData[l].homeOrAway) continue;
		if(gameFilter.opponent[teams.indexOf(seriesData[l].opponent)] == 0) continue;
	
		var posBase = 0; // positive base
		var negBase = 0; // negative base
		
		// <for the view which all bars are same tall> 
		var valuePosSum = 0;
		var valueNegSum = 0;
		
		for(var j=0;j<seriesData[l].attrArray.length;++j){
			if(showAttr.showOrNot[(seriesData[l].attrArray)[j].attrIndex]==1){
				if((seriesData[l].attrArray)[j].val>0) valuePosSum += (seriesData[l].attrArray)[j].val;
				else valueNegSum += (seriesData[l].attrArray)[j].val;
			}
		}
		// </for the view which all bars are same tall> 

		for(var j=0;j<seriesData[l].attrArray.length;++j){ //内层循环是指标
			var tmpObject = {};
			
			tmpObject.xLabel = xFlag ? seriesData[l].x : seriesData[l].time;
									
			if(showAttr.showOrNot[(seriesData[l].attrArray)[j].attrIndex]==0){
				tmpObject.y0 = tmpObject.y = tmpObject.size = 0;
			}
			
			else{
				if(viewFlag) {
					if((seriesData[l].attrArray)[j].val>0)
						tmpObject.y = (seriesData[l].attrArray)[j].val/valuePosSum;
					else tmpObject.y = -(seriesData[l].attrArray)[j].val/valueNegSum;
				}
				
				else{
					tmpObject.y = yFlag ? (seriesData[l].attrArray)[j].diff : (seriesData[l].attrArray)[j].val;
				}
					
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
	
	tmpArray.xExtent = Array.apply(null, {length: tmpArray[0].length}).map(Number.call, Number);
	
	tmpArray.yExtent = d3.extent(
		d3.merge(
			d3.merge(
				tmpArray.map(function(e) { 
					return e.map(function(f) { return [f.y0,f.y0-f.size]; }) 
				})
			)
		)
	);
}

function drawArea(tmpArray,shiftXArray,xScale){
		for(var j=0;j<tmpArray.length;++j){
			shiftXArray[j]=new Array(2*(tmpArray[0].length));
			for(var k=0;k<2*tmpArray[0].length;++k){
				shiftXArray[j][k]={};
			}
		}
		for(var j=0;j<tmpArray.length;++j){
			for(var k=0;k<tmpArray[0].length;++k){
				shiftXArray[j][2*k].x = xScale(k);   
				shiftXArray[j][2*k].y0 = tmpArray[j][k].y0;
				shiftXArray[j][2*k].size = tmpArray[j][k].size;
				shiftXArray[j][2*k+1].x = xScale(k) + xScale.bandwidth();
				shiftXArray[j][2*k+1].y0 = tmpArray[j][k].y0;
				shiftXArray[j][2*k+1].size = tmpArray[j][k].size;
			}
		}
		return shiftXArray;
	};

	
function syncLoad(filename) {
    var data;
    $.ajax({
        type: "GET",
        url: filename,
        dataType: "text",
        async: false,
        success: function(text) {
            data = d3.csvParse(text);	
		  
		    myData = [];
		  
		    for(var i=0;i<data.length;++i){
			    var myDataObject = new Object();
			    myDataObject.x = Number(data[i].x);
			    myDataObject.score = Number(data[i].score);
				
				myDataObject.time = data[i].time;
				
				myDataObject.homeOrAway = Number(data[i].homeOraway);
				myDataObject.winOrLoss = (myDataObject.x > 0)? 1 : 0;
				myDataObject.opponent = data[i].opponent;
			  
			    myDataObject.attrArray = new Array();
					for(var j=5; j<data.columns.length; j+=2){
					var tmpObject = {};
					tmpObject.attr = data.columns[j]; // TODO: seems useless
					
					tmpObject.val = Number(data[i][tmpObject.attr]);
					tmpObject.diff = Number(data[i][tmpObject.attr]) - Number(data[i][data.columns[j+1]]);
										
					tmpObject.attrIndex = (j-1)/2 - 2;
										
					myDataObject.attrArray.push(tmpObject);
			    }
				myData.push(myDataObject);
		    }
		  
		    showAttr.attrNames = new Array(myData[0].attrArray.length);
		    showAttr.showOrNot = new Array(myData[0].attrArray.length).fill(1); //Originally, show all attributes
			showAttr.showOrNot[1]=showAttr.showOrNot[2]=showAttr.showOrNot[4]=showAttr.showOrNot[5]=showAttr.showOrNot[7]=showAttr.showOrNot[8]=showAttr.showOrNot[10]=showAttr.showOrNot[11]=0;
			
			for(var j=0; j<showAttr.attrNames.length; ++j)
				showAttr.attrNames[j] = data.columns[2*j+5];
						  
		    myData.sort(function(a,b){
		        return Date.parse(a.time)-Date.parse(b.time);
		    });
					    
			/*
		    myData.forEach(
		        function(d){
			        d.attrArray.sort(
				        function(a,b){
					        return Math.abs(b.val)-Math.abs(a.val);
				        });
		    });
			*/
        }
    });
}
