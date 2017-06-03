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
	
	/*
	myData.forEach(
		function(d){
			d.attrArray.sort(
				function(a,b){
					if(yFlag)
						return Math.abs(b.diff) - Math.abs(a.diff);
					else return Math.abs(b.val) - Math.abs(a.val);
				});
	});
	*/
		
	drawGraph(xFlag,yFlag,gameFilter,viewFlag);
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
				  .attr("src","logos/" + d + "_logo.svg")
				  .attr("name","teamLogo")
				  .attr("width", 0)
				  .attr("height", 0);				
			}
			else {
				d3.select("#teamLogos").insert("img")
				  .attr("src","logos/" + d + "_logo.svg")
				  .attr("name","teamLogo")
				  .attr("width", 30)
				  .attr("height", 30);
			}
		}
	);
}