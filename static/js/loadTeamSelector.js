var teams = ["ATL","BKN","BOS","CHA","CHI","CLE","DAL","DEN","DET","GSW","HOU","IND","LAC","LAL","MEM","MIA","MIL","MIN","NOP","NYK","OKC","ORL","PHI","PHX","POR","SAC","SAS","TOR","UTA","WAS"];

function LoadTeamSelector(){
	teams.forEach(
		function(d){
			$('#teamSelector').append($('<option>', {value:d, text: d, selected:(d=="LAC")}));
		}
	);
	
	d3.select("#teamInfo").insert("img")
				  .attr("src","logos/" + $('#teamSelector').val() + "_logo.svg")
				  .attr("width", 80)
				  .attr("height",80);
}

function ChangeTeam(sel)
{
	$('#teamInfo').html("");
	
	d3.select("#teamInfo").insert("img")
				  .attr("src","logos/" + $('#teamSelector').val() + "_logo.svg")
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