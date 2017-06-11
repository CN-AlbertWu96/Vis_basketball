function changeView(){
	viewFlag = 1 - viewFlag;
	drawGraph(xFlag,yFlag,gameFilter,viewFlag);
}

function changeX(){
	xFlag = 1 - xFlag;
	myData.sort(function(a,b){
		if(xFlag)
		     return a.x - b.x;
		else return Date.parse(a.time) - Date.parse(b.time);
	});
		
	drawGraph(xFlag,yFlag,gameFilter,viewFlag);
}


function changeY(){
	yFlag = 1 - yFlag;
	
	if(!yFlag)	
	myData.forEach(
		function(d){
			d.attrArray.sort(
				function(a,b){
					return Math.abs(a.attrIndex) - Math.abs(b.attrIndex);
				});
	});

	else {
		initOrder(myData);
		ordering(myData);
	}
		
	drawGraph(xFlag,yFlag,gameFilter,viewFlag);
}

function initOrder(myData){
	liaoTao = new Array(17);
	
	for(var i=0;i<17;++i){
		liaoTao[i] = new Array(82);
	}
	
	renXuan = new Array(17);
	for(var i=0;i<17;++i){
		renXuan[i] = myData[0].attrArray[i].attr;
		liaoTao[i][0] = myData[0].attrArray[i].diff;
	}
	for(var i=1;i<82;++i){
		for(var j=0;j<17;++j){
			for(var k=0;k<17;k++){
				if(myData[i].attrArray[j].attr==renXuan[k]){
					liaoTao[k][i]=myData[i].attrArray[j].diff;
					break;
				}
			}
		}
		
	}
	meme = new Array(17);
	for(var i=0;i<17;i++)meme[i]=i;
	div(liaoTao, meme, 0,16,0);
	
	
	tmpMyData = myData[0].attrArray.slice();
	for(var i=0;i<17;i++){		
		tmpMyData[i] = myData[0].attrArray[meme[i]];
	}
	myData[0].attrArray = tmpMyData;
}

function div(liaoTao, meme, l, r, d)
{
	if(l>=r)return;
	if(d>81)return;
	var i=l,j=r;
	while(i<=j)
	{
		while(i<=j && liaoTao[meme[i]][d]>=0)i++;
		while(j>=i && liaoTao[meme[j]][d]<0)j--;
		if(i<j){
			var tmp=meme[i];
			meme[i]=meme[j];
			meme[j]=tmp;
		}
	}
	
	div(liaoTao, meme, l,i-1,d+1);
	div(liaoTao, meme, i,r,d+1);
}

function ordering(myData){
	var mid=17;
	for(i=0;i<17;++i)
	{
		if(myData[0].attrArray[i].diff<0)
		{
			mid=i;
			break;
		}
	}
	
	for(i=0;i<mid/2;++i){
		tmp = myData[0].attrArray[i];
		myData[0].attrArray[i] = myData[0].attrArray[mid-1-i];
		myData[0].attrArray[mid-1-i] = tmp;
	}
	
	for(i=1;i<82;++i){
		pos = [];
		neg = [];
	
		for(j=mid-1;j>=0;--j){
			for(k=0;k<17;++k){
				if(myData[i-1].attrArray[j].attr == myData[i].attrArray[k].attr){
					if(myData[i].attrArray[k].diff<0){
						neg.push(myData[i].attrArray[k]);
					}
					else pos.push(myData[i].attrArray[k]);
					break;
				}
			}
		}
		
		
		for(j=mid;j<17;++j){
			for(k=0;k<17;++k){
				if(myData[i-1].attrArray[j].attr == myData[i].attrArray[k].attr){
					if(myData[i].attrArray[k].diff<0){
						neg.push(myData[i].attrArray[k]);
					}
					else pos.push(myData[i].attrArray[k]);
					break;
				}
			}
		}
		mid=pos.length;
		myData[i].attrArray = pos.reverse().concat(neg);	
	}
}

function changeShowAttr(i){
	showAttr.showOrNot[i] = 1 - showAttr.showOrNot[i];
	drawGraph(xFlag,yFlag,gameFilter,viewFlag);
}

function FilterHomeAway(status){
	switch(status){
		case "All": 
			gameFilter.homeOrAway = -1; //all
			break;
		case "Home": 
			gameFilter.homeOrAway = 1; //home
			break;
		case "Away":
			gameFilter.homeOrAway = 0; //away
	}
	
	drawGraph(xFlag,yFlag,gameFilter,viewFlag);
}

function FilterWinLoss(status){
	switch(status){
		case "All": 
			gameFilter.winOrLoss = -1; //all
			break;
		case "Wins": 
			gameFilter.winOrLoss = 1; //win
			break;
		case "Losses":
			gameFilter.winOrLoss = 0; //loss
	}
	
	drawGraph(xFlag,yFlag,gameFilter,viewFlag);
}


function BindEventToButtons(){
	$('#viewBtn button').on('click', function(){
		$(this).addClass('active').siblings().removeClass('active');
		changeView();
		
		if(viewFlag == 1 ){
			$('#yAxisSelector').hide();
		}
		else $('#yAxisSelector').show();
	});

	$('#xAxisSelector button').on('click', function(){
		$(this).addClass('active').siblings().removeClass('active');
		changeX();
	});

	$('#yAxisSelector button').on('click', function(){
		$(this).addClass('active').siblings().removeClass('active');
		changeY();
	});

	$('#homeOrAwaySelector button').on('click', function(){
		$(this).addClass('active').siblings().removeClass('active');
		FilterHomeAway($(this).val());
	});

	$('#winOrLossSelector button').on('click', function(){
		$(this).addClass('active').siblings().removeClass('active');
		FilterWinLoss($(this).val());
	});

	$('#teamLogosBtn button').on('click', function(){
		$('#teamLogosBtn button').removeClass('active');
		$(this).addClass('active');
		FilterTeam($(this).val());
	});

	LoadTeamLogos();

	$('#teamLogos img').on('click', function(){
		$('#teamLogosBtn button').removeClass('active');
		FilterTeam($('#teamLogos img').index(this));
	});
}

function FilterTeam(i){
	if(i==-1) {
		gameFilter.opponent.fill(0);
		var teamLogos = document.getElementsByName("teamLogo");
		for(var j=0;j<teamLogos.length;++j)
			teamLogos[j].style.opacity = 0.5;
	}
	
	else if(i==30){
		gameFilter.opponent.fill(1);
		var teamLogos = document.getElementsByName("teamLogo");
		for(var j=0;j<teamLogos.length;++j)
			teamLogos[j].style.opacity = 1;		
	}
	
	else {
		var radios = document.getElementsByName("radioTeam");
		//for(var j=0;j<radios.length;j++) radios[j].active = false;
			
		var teamLogos = document.getElementsByName("teamLogo");
		gameFilter.opponent[i] = 1 - gameFilter.opponent[i];
		teamLogos[i].style.opacity = (gameFilter.opponent[i])? 1: 0.5;
	}
	
	drawGraph(xFlag,yFlag,gameFilter);
}

//var teams = ["ATL","BKN","BOS","CHA","CHI","CLE","DAL","DEN","DET","GSW","HOU","IND","LAC","LAL","MEM","MIA","MIL","MIN","NOP","NYK","OKC","ORL","PHI","PHX","POR","SAC","SAS","TOR","UTA","WAS"];


function LoadTeamLogos(){
	teams.forEach(
		function(d){
			if(d==$('#teamSelector').val()){
				d3.select("#teamLogos").insert("img")
				  .attr("src","static/img/team-logo/" + d + "_logo.svg")
				  .attr("name","teamLogo")
				  .attr("width", 0)
				  .attr("height", 0);				
			}
			else {
				d3.select("#teamLogos").insert("img")
				  .attr("src","static/img/team-logo/" + d + "_logo.svg")
				  .attr("name","teamLogo")
				  .attr("width", 30)
				  .attr("height", 30);
			}
		}
	);
}


var teams = ["ATL","BKN","BOS","CHA","CHI","CLE","DAL","DEN","DET","GSW","HOU","IND","LAC","LAL","MEM","MIA","MIL","MIN","NOP","NYK","OKC","ORL","PHI","PHX","POR","SAC","SAS","TOR","UTA","WAS"];

function LoadTeamSelector(){
	teams.forEach(
		function(d){
			$('#teamSelector').append($('<option>', {value:d, text: d, selected:(d=="LAC")}));
		}
	);
	
	d3.select("#teamInfo").insert("img")
				  .attr("src","static/img/team-logo/" + $('#teamSelector').val() + "_logo.svg")
				  .attr("width", 80)
				  .attr("height",80);
}

function ChangeTeam(sel)
{
	$('#teamInfo').html("");
	
	d3.select("#teamInfo").insert("img")
				  .attr("src","static/img/team-logo/" + $('#teamSelector').val() + "_logo.svg")
				  .attr("width", 80)
				  .attr("height",80);
	
	$('#fakeContainerForReload').load(document.URL +  ' #buttonContainer');
	
	$(document).ready(function() {
		BindEventToButtons();
	
		gameFilter.winOrLoss = -1
		gameFilter.homeOrAway = -1;
		gameFilter.opponent.fill(1);
		
		gameFilter.opponent[teams.indexOf(sel.value)]=0;
	
		syncLoad("bandViewData/" + sel.value + ".csv");
	
		xFlag=yFlag=viewFlag=0;
	
		drawGraph(xFlag,yFlag,gameFilter,viewFlag);
	});	
}


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

		for(var j=0;j<seriesData[l].attrArray.length;++j){ //ÄÚ²ãÑ­»·ÊÇÖ¸±ê
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
			//showAttr.showOrNot[1]=showAttr.showOrNot[2]=showAttr.showOrNot[4]=showAttr.showOrNot[5]=showAttr.showOrNot[7]=showAttr.showOrNot[8]=showAttr.showOrNot[10]=showAttr.showOrNot[11]=0;
			
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


LoadTeamSelector();

var myData = [];
var tmp = [];	

var showAttr = {};

var teamColors = {"ATL":"#C3D600","BKN":"#000000","BOS":"#008348","CHA":"#1D1160","CHI":"#CE1141","CLE":"#860038","DAL":"#007DC5","DEN":"#4FA8FF","DET":"#ED174C","GSW":"#FDB927","HOU":"#CE1141","IND":"#00275D","LAC":"#006BB6","LAL":"#552582","MEM":"#6189B9","MIA":"#98002E","MIL":"#00471B","MIN":"#005083","NOP":"#002B5C","NYK":"#F58426","OKC":"#007DC3","ORL":"#007DC5","PHI":"#ED174C","PHX":"#E56020","POR":"#000000","SAC":"#724C9F","SAS":"#000000","TOR":"#CE1141","UTA":"#00471B","WAS":"#F5002F"};

var barColors = ["#320D6D","#FFBFB7","#FFD447","#700353","#4C1C00","#CC8B86","#93E1D8","#283D3B","#197278","#0D3B66","#003400"];

syncLoad("static/data/band-view/LAC.csv");

var color = d3.scaleOrdinal(d3.schemeCategory20);
		
function drawGraph(xFlag, yFlag, gameFilter,viewFlag)
{	
	tmp = new Array(myData[0].attrArray.length);

	for(var j=0;j<tmp.length;++j){
		tmp[j]=new Array();
	}
	
	var shiftXArray=new Array();
	
	barStack(myData,tmp,xFlag,yFlag,gameFilter,viewFlag);
	
	var h = 500;
	var w = tmp[0].length * 110 + 115;
	var margin_top = 40;
	var margin_bottom = 20;
	var x = d3.scaleBand()
			  .rangeRound([0, w])
			  .padding(0.4);
			
	var y = d3.scaleLinear().range([h - margin_bottom, margin_top]);

	x.domain(tmp.xExtent);
	y.domain(tmp.yExtent);
	
	var xAxis = d3.axisBottom(x).tickFormat(function(d) { return tmp[0][d].xLabel; });
	var yAxis = d3.axisLeft(y).ticks(5);
	
	d3.selectAll("svg").remove();
	
	svg = d3.select("#graphContainer")
		.insert("svg")
		.attr("height", h)
		.attr("width", w)
		.style("align","center");
		
	attrSvg = d3.select("#attrContainer")
		.insert("svg")
		.attr("height", h)
		.attr("width", w);
			
	var areaPath = d3.area()
					.curve(d3.curveMonotoneX)
					.x(function(d){return d.x})
					.y0(function(d){return y(d.y0)})
					.y1(function(d){return y(d.y0-d.size)});
	
	drawArea(tmp,shiftXArray,x);
	
	
	svg.selectAll("path")
		.data(shiftXArray)
		.enter()
		.append("path")
		.style("fill", function(d,i) { return color(i); })
		.style("opacity", 0.5) //透明度
		.attr("d",function(d,i){return areaPath(shiftXArray[i])});		
	
			
	svg.selectAll(".series")
		.data(tmp)
		.enter()
		.append("g")
		.classed("series", true)
		.style("fill", function(d,i) { return color(i); })
		.style("opacity", 1) //透明度
			.selectAll("rect")
			.data(Object)
			.enter()
			.append("rect")
				.attr("x", function(d,i) { return x(i); })
				.attr("y", function(d) { return y(d.y0); })
				.attr("height", function(d) { return y(0) - y(d.size); })
				.attr("width", x.bandwidth())
				.on("mouseover", function() { tooltip.style("opacity", 1); })
				.on("mouseout", function() { tooltip.style("opacity", 0); })
				.on("mousemove", function(d) {
					var xPosition = d3.mouse(this)[0] - 35;
					var yPosition = d3.mouse(this)[1] - 5;
					tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
					tooltip.select("text").text(function(){return (viewFlag)? d.y.toFixed(2) : d.y;});
				});
	
	// Here we add tooltips 
	// Prep the tooltip bits, initial display is hidden
	var tooltip = svg.append("g")
	  .attr("class", "tooltip")
	  .style("display", null);
	  
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
		 	  
	if(y(0)){
	svg.append("g")
		.attr("class", "axis x")
		.attr("transform", "translate(0, " + y(0) + ")")
		.call(xAxis);
		}

	
	attrSvg.selectAll(".attrRect")
		.data(showAttr.showOrNot)
		.enter()
		.append("rect")
		.style("fill", function(d,i){ return (d)? color(i):"#F0FFFF"; })//.style("opacity", function(d){ return (d)? 0.8 : 0.4; })
			.attr("x", 0)
			.attr("y", function(d,i) { return 20*(i+1); })
			.attr("height", 20)
			.attr("width", 30)
			.on("click",function(d,i){
				changeShowAttr(i);
			});
		
	attrSvg.selectAll(".attrText")
		.data(showAttr.attrNames)
		.enter()
		.append("text")
		.text(function(d) {return d;})
		.attr("x", 35)
		.attr("y", function(d,i) { return 20*(i+1); })
		.attr("dy", "1.2em")
	    .attr("font-size", "12px")
	    .attr("font-weight", "bold");
			
	
	//add gamebar here
	var gamesInGamebar = new Array();
	myData.forEach(
		function(d){
			if(gameFilter.opponent[teams.indexOf(d.opponent)]==1 
			&&(gameFilter.winOrLoss==-1||gameFilter.winOrLoss==d.winOrLoss) 
			&&(gameFilter.homeOrAway==-1||gameFilter.homeOrAway==d.homeOrAway))
			{
				var tmpObject = {};
				if(d.homeOrAway==1) tmpObject.text = "vs " + d.opponent;
				else tmpObject.text = "@ " + d.opponent;
				
				tmpObject.opponent = d.opponent;
				tmpObject.color = teamColors[d.opponent];				
				tmpObject.date = d.time;
								
				gamesInGamebar.push(tmpObject);
			}
		}
	);
	
	var gamebar = svg.selectAll(".gamebar")
		.data(gamesInGamebar)
		.enter()
		.append("text")
		.text(function(d){
			return d.text;
		})
		.attr("x", function(d,i) { return x(i); })
		.attr("y", 20)
		.style("fill", function(d){ return d.color; })
		.on("mouseover", function(){document.body.style.cursor = "pointer";})
		.on("mouseout", function(){document.body.style.cursor = "default";})
		.on("click",function(d,i){
			window.location.href = "gameview/" + d.date + ' - ' + $('#teamSelector').val() + ' vs. ' + d.opponent;
		});
	
}

var gameFilter = {winOrLoss:-1, homeOrAway:-1};
gameFilter.opponent = new Array(30).fill(1);

gameFilter.opponent[teams.indexOf($('#teamSelector').val())]=0;

var viewFlag = 0;

drawGraph(0,0,gameFilter,viewFlag);

var xFlag = 0;//if xFlag=0, present xAxis as time; if xFlag=1, present xAxis as +/-
var yFlag = 0;//if yFlag=0, present yAxis as value; if yFlag=1, present xAxis as +/-

BindEventToButtons();
