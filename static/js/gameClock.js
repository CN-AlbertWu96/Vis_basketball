var width = 1900; //1400, 1900
			var height = 800; //600, 700
			var radius = 3;	
			var marginLeft = 100;
			var marginRight = 30;
			var marginTop = 40;
			var marginBottom = 30;
			var homebackgroundColor = d3.rgb(152,152,152); //"#989898"
			var awaybackgroundColor = homebackgroundColor.brighter(1);
			var symbolSize = 300;
			var areas = 6;
			var letterSize = "15px";
			var quaterLineStrokeWidth = 3;
			var symbolStrokeColor = "black";
			var symbolStrokeSize = 2;
		
			// Total SVG
			var svg = d3.select("body")
						.append("svg")
						.attr("width", width)
						.attr("height", height)		
			
			// Home team background Color
			function homeBackgroundColor() {
				for (var i = 0; i < areas ; i++) {
						svg.append("rect")
						.attr("width", width - marginLeft - marginRight)
						.attr("height", ((height - marginTop - marginBottom)/12)+2)
						.attr("fill", homebackgroundColor.brighter(0.24*i))
						.attr("transform", "translate(" + marginLeft + "," + (marginTop + (((height/2)-marginTop)/6)*i) + ")");
				}
			}
			// Away team background Color
			function awayBackgroundColor() {
				for (var i = 0; i < areas ; i++) {
						svg.append("rect")
						.attr("width", width - marginLeft - marginRight)
						.attr("height", ((height - marginTop - marginBottom)/12)+2)
						.attr("fill", awaybackgroundColor.darker(0.24*i))
						.attr("transform", "translate(" + marginLeft + "," + ((height/2) + ((height/2 - marginBottom)/6)*i) + ")");
				}
			}
			
			// Text label for the x-axis
			function textLabel() {
				svg.append("text")      
	        		.attr("x", width/2 )
	        		.attr("y",  height - 5)
	        		.attr("font-family", "sans-serif")
	        		.attr("font-size", "12px")
	        		.style("text-anchor", "middle")
	        		.text("Time");
			}

			// Text label for the Y-axis
			function distLabel() {
				svg.append("text")      
	        		.attr("x", 40 )
	        		.attr("y",  height/2)
	        		.attr("font-family", "sans-serif")
	        		.attr("font-size", "12px")
	        		.style("text-anchor", "middle")
	        		.text("Dist.(Ft)");
	        }
			
			//Home Team Label for the Y-axis
			function homeTeamLabel() {
				svg.append("text")      
	        		.attr("x", 40 )
	        		.attr("y",  height/4)
	        		.attr("font-family", "sans-serif")
	        		.attr("font-size", "12px")
	        		.style("text-anchor", "middle")
	        		.text("Home");
        	}

        	//Away Team Label for the Y-axis
			function awayTeamLabel() {
				svg.append("text")      
	        		.attr("x", 40 )
	        		.attr("y",  height/2 + height/4)
	        		.attr("font-family", "sans-serif")
	        		.attr("font-size", "12px")
	        		.style("text-anchor", "middle")
	        		.text("Away");
			}

			// Home team's scale for Y-axis
			var yScale_Home = d3.scaleLinear()
								.domain([0, 30])
								.rangeRound([ height/2, marginTop ]);
			
			// Home team's Y-Axis				  
			var yAxis_Home = d3.axisLeft()
							  .scale(yScale_Home)
							  .ticks(6);
			
				svg.append("g")
					.call(yAxis_Home)
					.attr("class", "axis")
					.attr("transform", "translate(" + marginLeft + ",0)");
			
			// Away team's scale for Y-axis					
			var yScale_Away = d3.scaleLinear()
								.domain([0, 30])
								.rangeRound([ height/2, height - marginBottom]);					
			
			// Away team's Y-Axis
			var yAxis_Away = d3.axisLeft()
							  .scale(yScale_Away)
							  .ticks(6);
			
				svg.append("g")
					.attr("class", "axis")
					.attr("transform", "translate(" + marginLeft + ",0)")
					.call(yAxis_Away);
			
			// Home team's scale for X-axis
			var xScale_Home = d3.scaleLinear()
								.domain([0, 720])
								.rangeRound([marginLeft, width - marginRight]);
			
			// Home team's X-axis
			var xAxis_Home = d3.axisBottom()
							  .scale(xScale_Home)
							  .ticks(0);
							  
				/*svg.append("g")
					.attr("class", "axis")
					.attr("transform", "translate(0," + height/2  + ")")
					.attr("stroke-width", 10)
					.call(xAxis_Home)*/
				
			// Home Team 1st Quarter Scale
			var xScale_Home_1st = d3.scaleLinear()
									.domain([0, 720])
									.rangeRound([marginLeft, xScale_Home(720/4)])

			// Home Team 2nd Quarter Scale
			var xScale_Home_2nd = d3.scaleLinear()
									.domain([0, 720])
									.rangeRound([xScale_Home(720/4), xScale_Home((720/4)*2) ])
			
			// Home Team 3rd Quarter Scale
			var xScale_Home_3rd = d3.scaleLinear()
									.domain([0, 720])
									.rangeRound([xScale_Home((720/4)*2), xScale_Home((720/4)*3) ])

			// Home Team 4th Quarter Scale
			var xScale_Home_4th = d3.scaleLinear()
									.domain([0, 720])
									.rangeRound([xScale_Home((720/4)*3), xScale_Home((720/4)*4) ])

			// Away team's scale for X-axis
			var xScale_Away = d3.scaleLinear()
								.domain([0, 720])
								.rangeRound([marginLeft, width - marginRight]);
			
			// Away team's X-axis
			var xAxis_Away = d3.axisBottom()
							  .scale(xScale_Away)
							  .ticks(0);
			
				/*svg.append("g")
					.attr("class", "axis")
					.attr("transform", "translate(0," + height/2  + ")")
					.call(xAxis_Away)
					.attr("stroke-width", 10)*/

			// Away team 1st quarter scale
			var xScale_Away_1st = d3.scaleLinear()
								.domain([0, 720])
								.rangeRound([marginLeft, xScale_Away(720/4)]);

			// Away team 2nd quarter scale
			var xScale_Away_2nd = d3.scaleLinear()
								.domain([0, 720])
								.rangeRound([xScale_Away(720/4), xScale_Away((720/4)*2)]);

			// Away team 3rd quarter scale
			var xScale_Away_3rd = d3.scaleLinear()
								.domain([0, 720])
								.rangeRound([xScale_Away((720/4)*2), xScale_Away((720/4)*3)]);

			// Away team 4th quarter scale
			var xScale_Away_4th = d3.scaleLinear()
								.domain([0, 720])
								.rangeRound([xScale_Away((720/4)*3), xScale_Away((720/4)*4)]);

			// X-Axis line for both teams
			function xAxis(){
				svg.append("line")
							.attr("x1", xScale_Home(0))
							.attr("y1", (height/2))
							.attr("x2", xScale_Home(720))
							.attr("y2", (height/2))
							.style("stroke", "yellow" )
							.style("stroke-width", 5);
					
			}

			// Distance Line for Home Team
			function appendDistanceLineHome() {
				
				for (var i = 1; i < areas ; i++) {
						svg.append("line")
							.attr("x1", xScale_Home(0))
							.attr("y1", ( marginTop + (((height/2)-marginTop)/6)*i))
							.attr("x2", xScale_Home(720))
							.attr("y2", ( marginTop + (((height/2)-marginTop)/6)*i))
							.style("stroke", "black" )
							.style("stroke-width", 1)
							.style("stroke-dasharray", ("5, 5"));
					}
			}

			// Distance Line for Away Team
			function appendDistanceLineAway() {
				
				for (var i = 1; i < areas+1 ; i++) {
						svg.append("line")
							.attr("x1", xScale_Away(0))
							.attr("y1", ((height/2) + ((height/2 - marginBottom)/6)*i))
							.attr("x2", xScale_Away(720))
							.attr("y2", ((height/2) + ((height/2 - marginBottom)/6)*i))
							.style("stroke", "black" )
							.style("stroke-width", 1)
							.style("stroke-dasharray", ("5, 5"));
					}
			}


			// Home Quarter Line
			function appendHomeQuarterLine() {
				
				for (var i = 1; i <=3 ; i++) {
					svg.append("line")
						.attr("x1", xScale_Home((720/4)*i))
						.attr("y1", height/2)
						.attr("x2", xScale_Home((720/4)*i))
						.attr("y2", marginTop)
						.style("stroke", "black")
						.style("stroke-width", quaterLineStrokeWidth)
						
				}
			}

			// Away Quarter Line
			function appendAwayQuarterLine() {
				
				for (var i = 1; i <=3 ; i++) {
					svg.append("line")
						.attr("x1", xScale_Away((720/4)*i))
						.attr("y1", height/2)
						.attr("x2", xScale_Away((720/4)*i))
						.attr("y2", height - marginBottom)
						.style("stroke", "black")
						.attr("stroke-width", quaterLineStrokeWidth)
						
				}
			}

			// Append Scores of Home Team
			function appendScoresHome(data){
				svg.selectAll(".points")
     				.data(data)
    				.enter()
    				.append("text")
    				.filter(function(d) { return d.TEAM == 1; })
    				.text(function(d) {
    					if (d.EVENT == 1.1 || d.EVENT == 2.1) {return "1";}
    					if (d.EVENT == 1.2 || d.EVENT == 2.2) {return "2";}
    					if (d.EVENT == 1.3 || d.EVENT == 2.3) {return "3";}
    					if (d.EVENT == 3) {return "O";}
    					if (d.EVENT == 4) {return "D";}
    				})
    				.attr("x", function(d) {
    					if (d.PERIOD == 1) {
	    					if (d.EVENT == 1.1 || d.EVENT == 1.2 || d.EVENT == 1.3 ||
	    						d.EVENT == 2.1 || d.EVENT == 2.2 || d.EVENT == 2.3 )
	    						 {return xScale_Home_1st(d.TIME) - 4;}
	    					if (d.EVENT == 3) {return xScale_Home_1st(d.TIME) - 5.5;}
	    					if (d.EVENT == 4) {return xScale_Home_1st(d.TIME) - 4.5;}
    					}
    					if (d.PERIOD == 2) {
	    					if (d.EVENT == 1.1 || d.EVENT == 1.2 || d.EVENT == 1.3 ||
	    						d.EVENT == 2.1 || d.EVENT == 2.2 || d.EVENT == 2.3 )
	    						 {return xScale_Home_2nd(d.TIME) - 4;}
	    					if (d.EVENT == 3) {return xScale_Home_2nd(d.TIME) - 5.5;}
	    					if (d.EVENT == 4) {return xScale_Home_2nd(d.TIME) - 4.5;}
    					}
    					if (d.PERIOD == 3) {
	    					if (d.EVENT == 1.1 || d.EVENT == 1.2 || d.EVENT == 1.3 ||
	    						d.EVENT == 2.1 || d.EVENT == 2.2 || d.EVENT == 2.3)
	    						 {return xScale_Home_3rd(d.TIME) - 4;}
	    					if (d.EVENT == 3) {return xScale_Home_3rd(d.TIME) - 5.5;}
	    					if (d.EVENT == 4) {return xScale_Home_3rd(d.TIME) - 4.5;}
    					}
    					if (d.PERIOD == 4) {
	    					if (d.EVENT == 1.1 || d.EVENT == 1.2 || d.EVENT == 1.3 ||
	    						d.EVENT == 2.1 || d.EVENT == 2.2 || d.EVENT == 2.3 )
	    						 {return xScale_Home_4th(d.TIME) - 4;}
	    					if (d.EVENT == 3) {return xScale_Home_4th(d.TIME) - 5.5;}
	    					if (d.EVENT == 4) {return xScale_Home_4th(d.TIME) - 4.5;}
    					}

    				})
        			.attr("y",  function(d) {
        				if (d.EVENT == 1.1 || d.EVENT == 1.2 || d.EVENT == 1.3 || 
        					d.EVENT == 2.1 || d.EVENT == 2.2 || d.EVENT == 2.3) {return yScale_Home(d.DISTANCE) + 4;}
        				if (d.EVENT == 3 || d.EVENT == 4) {return yScale_Home(d.DISTANCE) + 5;}
        			})
        			.attr("font-family", "sans-serif")
        			.attr("font-size", letterSize)
        			.attr("fill", function(d) {
        				if (d.EVENT == 1.1 || d.EVENT == 1.2 || d.EVENT == 1.3 || d.EVENT == 3 || d.EVENT == 4) {return "white";}
        				if (d.EVENT == 2.1 || d.EVENT == 2.2 || d.EVENT == 2.3) {return "black";}
        			})
        			.append("title")
      				.text(function(d){
      					return "Action: " + d.DESCRIPTION;
      				})
        	}
        	
        	// Append Scores of Away Team
			function appendScoresAway(data){
				svg.selectAll(".points")
     				.data(data)
    				.enter()
    				.append("text")
    				.filter(function(d) { return d.TEAM == 2; })
    				.text(function(d) {
    					if (d.EVENT == 1.1 || d.EVENT == 2.1) {return "1";}
    					if (d.EVENT == 1.2 || d.EVENT == 2.2) {return "2";}
    					if (d.EVENT == 1.3 || d.EVENT == 2.3) {return "3";}
    					if (d.EVENT == 3) {return "O";}
    					if (d.EVENT == 4) {return "D";}
    				})
    				.attr("x", function(d) {
    					if (d.PERIOD == 1) {
	    					if (d.EVENT == 1.1 || d.EVENT == 1.2 || d.EVENT == 1.3 ||
	    						d.EVENT == 2.1 || d.EVENT == 2.2 || d.EVENT == 2.3 ) {return xScale_Away_1st(d.TIME) - 4;}
	    					if (d.EVENT == 3) {return xScale_Away_1st(d.TIME) - 5.5;}
	    					if (d.EVENT == 4) {return xScale_Away_1st(d.TIME) - 4.5;}
    					}
    					if (d.PERIOD == 2) {
	    					if (d.EVENT == 1.1 || d.EVENT == 1.2 || d.EVENT == 1.3 ||
	    						d.EVENT == 2.1 || d.EVENT == 2.2 || d.EVENT == 2.3) {return xScale_Away_2nd(d.TIME) - 4;}
	    					if (d.EVENT == 3) {return xScale_Away_2nd(d.TIME) - 5.5;}
	    					if (d.EVENT == 4) {return xScale_Away_2nd(d.TIME) - 4.5;}
    					}
    					if (d.PERIOD == 3) {
	    					if (d.EVENT == 1.1 || d.EVENT == 1.2 || d.EVENT == 1.3 ||
	    						d.EVENT == 2.1 || d.EVENT == 2.2 || d.EVENT == 2.3) {return xScale_Away_3rd(d.TIME) - 4;}
	    					if (d.EVENT == 3) {return xScale_Away_3rd(d.TIME) - 5.5;}
	    					if (d.EVENT == 4) {return xScale_Away_3rd(d.TIME) - 4.5;}
    					}
    					if (d.PERIOD == 4) {
	    					if (d.EVENT == 1.1 || d.EVENT == 1.2 || d.EVENT == 1.3 ||
	    						d.EVENT == 2.1 || d.EVENT == 2.2 || d.EVENT == 2.3) {return xScale_Away_4th(d.TIME) - 4;}
	    					if (d.EVENT == 3) {return xScale_Away_4th(d.TIME) - 5.5;}
	    					if (d.EVENT == 4) {return xScale_Away_4th(d.TIME) - 4.5;}
    					}
    					
    				})
        			.attr("y",  function(d) {
        				if (d.EVENT == 1.1 || d.EVENT == 1.2 || d.EVENT == 1.3 || 
        					d.EVENT == 2.1 || d.EVENT == 2.2 || d.EVENT == 2.3) {return yScale_Away(d.DISTANCE) + 4;}
        				if (d.EVENT == 3 || d.EVENT == 4) {return yScale_Away(d.DISTANCE) + 5;}
        			})
        			.attr("font-family", "sans-serif")
        			.attr("font-size", letterSize)
        			.attr("fill", function(d){
        				if (d.EVENT == 1.1 || d.EVENT == 1.2 || d.EVENT == 1.3 || d.EVENT == 3 || d.EVENT == 4) {return "white";}
        				if (d.EVENT == 2.1 || d.EVENT == 2.2 || d.EVENT == 2.3) {return "black";}
        			})
        			.append("title")
      				.text(function(d){
      					return "Action: " + d.DESCRIPTION;
      				})
        	}
        	
			
			// Draw Symbols for Home Team
			function drawSymbolsHome(data) {

				var a = svg.selectAll(".points")
     				.data(data)
    				.enter()
    				.append("path")
    				.filter(function(d) { return d.TEAM == 1; })
      				.attr("class", "point")
      				.attr("fill", function(d) { 
      					if (d.EVENT == 1.1 || d.EVENT == 1.2 || 
      						d.EVENT == 1.3 || d.EVENT == 3 ||
      						d.EVENT == 4 || d.EVENT == 6 || 
      						d.EVENT == 8 || d.EVENT == 9) { 
							return "green"; 
						} else { 
							return "red";
						}
      				})
      				.attr("transform", function(d) { 
      						
      						if (d.PERIOD == 1) {
	      						if (d.EVENT == 4) {
	      							return "translate(" + xScale_Home_1st(d.TIME) + "," + yScale_Home(d.DISTANCE) + ") rotate(-180)"; 
	      						} else if (d.EVENT == 5) {
	      							return "translate(" + xScale_Home_1st(d.TIME) + "," + yScale_Home(d.DISTANCE) + ") rotate(-45)"; 
	      						} else {
	      							return "translate(" + xScale_Home_1st(d.TIME) + "," + yScale_Home(d.DISTANCE) + ")"; 
	      						}
	      					}
	      					
	      					if (d.PERIOD == 2) {
	      						if (d.EVENT == 4) {
	      							return "translate(" + xScale_Home_2nd(d.TIME) + "," + yScale_Home(d.DISTANCE) + ") rotate(-180)"; 
	      						} else if (d.EVENT == 5) {
	      							return "translate(" + xScale_Home_2nd(d.TIME) + "," + yScale_Home(d.DISTANCE) + ") rotate(-45)"; 
	      						} else {
	      							return "translate(" + xScale_Home_2nd(d.TIME) + "," + yScale_Home(d.DISTANCE) + ")"; 
	      						}
	      					}
							
							if (d.PERIOD == 3) {
	      						if (d.EVENT == 4) {
	      							return "translate(" + xScale_Home_3rd(d.TIME) + "," + yScale_Home(d.DISTANCE) + ") rotate(-180)"; 
	      						} else if (d.EVENT == 5) {
	      							return "translate(" + xScale_Home_3rd(d.TIME) + "," + yScale_Home(d.DISTANCE) + ") rotate(-45)"; 
	      						} else {
	      							return "translate(" + xScale_Home_3rd(d.TIME) + "," + yScale_Home(d.DISTANCE) + ")"; 
	      						}
	      					}

	      					if (d.PERIOD == 4) {
	      						if (d.EVENT == 4) {
	      							return "translate(" + xScale_Home_4th(d.TIME) + "," + yScale_Home(d.DISTANCE) + ") rotate(-180)"; 
	      						} else if (d.EVENT == 5) {
	      							return "translate(" + xScale_Home_4th(d.TIME) + "," + yScale_Home(d.DISTANCE) + ") rotate(-45)"; 
	      						} else {
	      							return "translate(" + xScale_Home_4th(d.TIME) + "," + yScale_Home(d.DISTANCE) + ")"; 
	      						}
	      					}
      				})
      				.attr("d", d3.symbol()
      					.size(symbolSize)
      					.type(function(d) {
      						if (d.EVENT == 1.1 || d.EVENT == 1.2 || d.EVENT == 1.3 ) {return d3.symbolCircle;}
      						if (d.EVENT == 2.1 || d.EVENT == 2.2 || d.EVENT == 2.3) {return d3.symbolSquare;}
      						if (d.EVENT == 3 || d.EVENT == 4) {return d3.symbolTriangle;}
      						if (d.EVENT == 5 || d.EVENT == 6) {return d3.symbolCross;}
      						if (d.EVENT == 7) {return d3.symbolDiamond;}
      						if (d.EVENT == 8) {return d3.symbolWye;}
      						if (d.EVENT == 9) {return d3.symbolStar;}
      					}))
      				.attr("stroke", symbolStrokeColor)
      				.attr("stroke-width", symbolStrokeSize)
      				.append("title")
      				.text(function(d){ return "Action: " + d.DESCRIPTION; })

			}

			// Draw Symbols for Away Team
			function drawSymbolsAway(data) {
				
				svg.selectAll(".points")
     				.data(data)
    				.enter()
    				.append("path")
    				.filter(function(d) { return d.TEAM == 2; })
      				.attr("class", "point")
      				.attr("fill", function(d){ 
      					if (d.EVENT == 1.1 || d.EVENT == 1.2 ||
      						d.EVENT == 1.3 || d.EVENT == 3 ||
      						d.EVENT == 4 || d.EVENT == 6 ||
      						d.EVENT == 8 || d.EVENT == 9) {
      						return "green"; 
      					} else {
      						return "red";
      					}
      				})
      				.attr("transform", function(d) { 
      						if (d.PERIOD == 1) {
	      						if (d.EVENT == 4) {
	      							return "translate(" + xScale_Away_1st(d.TIME) + "," + yScale_Away(d.DISTANCE) + ") rotate(-180)"; 
	      						} else if (d.EVENT == 5) {
	      							return "translate(" + xScale_Away_1st(d.TIME) + "," + yScale_Away(d.DISTANCE) + ") rotate(-45)"; 
	      						} else {
	      							return "translate(" + xScale_Away_1st(d.TIME) + "," + yScale_Away(d.DISTANCE) + ")"; 
	      						}
	      					} 
	      					
	      					if (d.PERIOD == 2) {
	      						if (d.EVENT == 4) {
	      							return "translate(" + xScale_Away_2nd(d.TIME) + "," + yScale_Away(d.DISTANCE) + ") rotate(-180)"; 
	      						} else if (d.EVENT == 5) {
	      							return "translate(" + xScale_Away_2nd(d.TIME) + "," + yScale_Away(d.DISTANCE) + ") rotate(-45)"; 
	      						} else {
	      							return "translate(" + xScale_Away_2nd(d.TIME) + "," + yScale_Away(d.DISTANCE) + ")"; 
	      						}
	      					} 
							
							if (d.PERIOD == 3) {
	      						if (d.EVENT == 4) {
	      							return "translate(" + xScale_Away_3rd(d.TIME) + "," + yScale_Away(d.DISTANCE) + ") rotate(-180)"; 
	      						} else if (d.EVENT == 5) {
	      							return "translate(" + xScale_Away_3rd(d.TIME) + "," + yScale_Away(d.DISTANCE) + ") rotate(-45)"; 
	      						} else {
	      							return "translate(" + xScale_Away_3rd(d.TIME) + "," + yScale_Away(d.DISTANCE) + ")"; 
	      						}
	      					} 

	      					if (d.PERIOD == 4) {
	      						if (d.EVENT == 4) {
	      							return "translate(" + xScale_Away_4th(d.TIME) + "," + yScale_Away(d.DISTANCE) + ") rotate(-180)"; 
	      						} else if (d.EVENT == 5) {
	      							return "translate(" + xScale_Away_4th(d.TIME) + "," + yScale_Away(d.DISTANCE) + ") rotate(-45)"; 
	      						} else {
	      							return "translate(" + xScale_Away_4th(d.TIME) + "," + yScale_Away(d.DISTANCE) + ")"; 
	      						}
	      					}
      				})
      				.attr("d", d3.symbol()
      					.size(symbolSize)
      					.type(function(d){ 
      						if (d.EVENT == 1.1 || d.EVENT == 1.2 || d.EVENT == 1.3 ) {return d3.symbolCircle;}
      						if (d.EVENT == 2.1 || d.EVENT == 2.2 || d.EVENT == 2.3) {return d3.symbolSquare;}
      						if (d.EVENT == 3 || d.EVENT == 4) {return d3.symbolTriangle;}
      						if (d.EVENT == 5 || d.EVENT == 6) {return d3.symbolCross;}
      						if (d.EVENT == 7) {return d3.symbolDiamond;}
      						if (d.EVENT == 8) {return d3.symbolWye;}
      						if (d.EVENT == 9) {return d3.symbolStar;}
      					}))
      				.attr("stroke", symbolStrokeColor)
      				.attr("stroke-width", symbolStrokeSize)
      				.append("title")
      				.text(function(d){
      					return "Action: " + d.DESCRIPTION;
      				})
      		}

			// Draw line for Home Team
			function drawLineHome (data){
			
				// Home team line connects x-axis to data points	
				svg.selectAll(".points")
     				.data(data)
    				.enter()
					.append("line")
					.filter(function(d) { return d.TEAM == 1; })
					.attr("x1", function(d) {
						if (d.PERIOD == 1) {return xScale_Home_1st(d.TIME);} 
						if (d.PERIOD == 2) {return xScale_Home_2nd(d.TIME);}
						if (d.PERIOD == 3) {return xScale_Home_3rd(d.TIME);}
						if (d.PERIOD == 4) {return xScale_Home_4th(d.TIME);}
					})
					.attr("y1", yScale_Home(0))
					.attr("x2", function(d) {
						if (d.PERIOD == 1) {return xScale_Home_1st(d.TIME);} 
						if (d.PERIOD == 2) {return xScale_Home_2nd(d.TIME);}
						if (d.PERIOD == 3) {return xScale_Home_3rd(d.TIME);}
						if (d.PERIOD == 4) {return xScale_Home_4th(d.TIME);}
					})
					.attr("y2", function(d) {
						return yScale_Home(d.DISTANCE)+10;
					})
					.style("stroke", function(d) {
						if (d.EVENT == 1.1 || d.EVENT == 1.2 ||
							d.EVENT == 1.3|| d.EVENT == 3 || 
							d.EVENT == 4 || d.EVENT == 6 || 
							d.EVENT == 8 || d.EVENT == 9) {
      						return "green"; 
      					} else {
      						return "red";
      					}
					})
					.style("stroke-width", 1);
				}

			// Draw Line for Away Team
			function drawLineAway(data) {
				// Away team line connects to x-axis to data points
				svg.selectAll(".points")
     				.data(data)
    				.enter()
					.append("line")
					.filter(function(d) { return d.TEAM == 2; })
					.attr("x1", function(d) {
						if (d.PERIOD == 1) {return xScale_Away_1st(d.TIME);}
						if (d.PERIOD == 2) {return xScale_Away_2nd(d.TIME);}
						if (d.PERIOD == 3) {return xScale_Away_3rd(d.TIME);}
						if (d.PERIOD == 4) {return xScale_Away_4th(d.TIME);}
					})
					.attr("y1", yScale_Away(0))
					.attr("x2", function(d) {
						if (d.PERIOD == 1) {return xScale_Away_1st(d.TIME);} 
						if (d.PERIOD == 2) {return xScale_Away_2nd(d.TIME);}
						if (d.PERIOD == 3) {return xScale_Away_3rd(d.TIME);}
						if (d.PERIOD == 4) {return xScale_Away_4th(d.TIME);}
					})
					.attr("y2", function(d) {
						return yScale_Away(d.DISTANCE)-10;
					})
					.style("stroke", function(d) {
						if (d.EVENT == 1.1 || d.EVENT == 1.2 ||
							d.EVENT == 1.3 || d.EVENT == 3 || 
							d.EVENT == 4 || d.EVENT == 6 || 
							d.EVENT == 8 || d.EVENT == 9) {
      						return "green"; 
      					} else {
      						return "red";
      					}
					})
					.style("stroke-width", 1);
			}
			
			function legend() {
				
				var data = ["1.1", "1.2", "1.3", "2.1", "2.2", "2.3", "3", "4", "5", "6", "7", "8", "9"]

				var legend = svg.append("g")
								.attr("class", "legend")
								.attr("transform", "translate(" + 0 + "," + 11 +")") // marginLeft
								.selectAll("g")
								.data(data)
								.enter()
								.append("g");

				
				legend.append("path")
					.attr("transform", function (d, i) { 
						if ( d==1.1 || d==1.2 || d==1.3 || d==2.1 || d==2.2 || d==2.3 || d==3) {
							return "translate(" + xScale_Home(i*50) + "," + 5 +")"
							//return "translate(" + (i * 120)  + "," + 5 + ")" 
						} 
						if (d == 4) {
							return "translate(" + (xScale_Home(i*52)+15) + "," + 5 + ") rotate(-180)";
						}
						if (d == 5) {
							return "translate(" + xScale_Home(i*55) + "," + 5 + ") rotate(-45)";
						}
						if (d == 6) {
							return "translate(" + xScale_Home(i*55) + "," + 5 + ")";
						}
						if (d == 7) {
							return "translate(" + xScale_Home(i*55) + "," + 5 + ")";
						}
						if (d == 8) {
							return "translate(" + xScale_Home(i*55) + "," + 5 + ")";
						}
						if (d == 9) {
							return "translate(" + xScale_Home(i*55) + "," + 5 + ")";
						}

						/*	
						else if (d == 4) {
							return "translate(" + (50 + (i * 120))  + "," + 5 + ") rotate(-180) ";
						} else if (d == 5) {
							return "translate(" + (100 + (i * 120))  + "," + 5 + ") rotate(-45)";
						} else {
							return "translate(" + (100 + (i * 120))  + "," + 5 + ")";
						}
						*/
					})
					.attr("d", d3.symbol()
      					.size(symbolSize)
      					.type(function(d){ 
      						if (d == 1.1 || d == 1.2 || d == 1.3 ) {return d3.symbolCircle;}
      						if (d == 2.1 || d == 2.2 || d == 2.3) {return d3.symbolSquare;}
      						if (d == 3 || d == 4) {return d3.symbolTriangle;}
      						if (d == 5 || d == 6) {return d3.symbolCross;}
      						if (d == 7) {return d3.symbolDiamond;}
      						if (d == 8) {return d3.symbolWye;}
      						if (d == 9) {return d3.symbolStar;}
      				}))

				
      			legend.append("text")
      				.attr("transform", function (d, i) { 
						if ( d == 1.1 || d == 1.2 || d == 1.3 || d == 2.1 || d == 2.2 || d == 2.3 || d ==3 ) {
							return "translate(" + (xScale_Home(i * 50)+15)  + "," + 10 + ")"  //12 * 120
						} 
						if ( d == 4 ) {
							return "translate(" + (15 + xScale_Home(i * 52) + 15)  + "," + 10 + ")" // 65 * 120
						} 
						if (d == 5) {
							return "translate(" + (15 + xScale_Home(i * 55))  + "," + 10 + ")"; // 115 * 120
						}
						if (d == 6) {
							return "translate(" + (15 + xScale_Home(i * 55))  + "," + 10 + ")"; // 115 * 120
						}
						if (d == 7) {
							return "translate(" + (15 + xScale_Home(i * 55))  + "," + 10 + ")"; // 115 * 120
						}
						if (d == 8) {
							return "translate(" + (15 + xScale_Home(i * 55))  + "," + 10 + ")"; // 115 * 120
						}
						if (d == 9) {
							return "translate(" + (15 + xScale_Home(i * 55))  + "," + 10 + ")"; // 115 * 120
						}


					})
					.text(function(d){
						if (d == 1.1) {return "Make 1pt"}
						if (d == 1.2) {return "Make 2pt"}
						if (d == 1.3) {return "Make 3pt"}
						if (d == 2.1) {return "Miss 1pt"}
						if (d == 2.2) {return "Miss 2pt"}
						if (d == 2.3) {return "Miss 3pt"}
						if (d == 3) {return "Offensive Rebound"}
						if (d == 4) {return "Defensive Rebound"}
						if (d == 5) {return "Turnover"}
						if (d == 6) {return "Foul Drawn"}
						if (d == 7) {return "Foul"}
						if (d == 8) {return "Block"}
						if (d == 9) {return "Assist"}
					})
					.attr("font-family", "sans-serif")
	        		.attr("font-size", "15px")
	        	
			}

			d3.csv("static/data/gameClock.csv", drawSymbolsHome);
			d3.csv("static/data/gameClock.csv", drawSymbolsAway);
			d3.csv("static/data/gameClock.csv", drawLineHome);
			d3.csv("static/data/gameClock.csv", drawLineAway);
			distLabel();
			homeTeamLabel();
			awayTeamLabel();
			textLabel();
			homeBackgroundColor();
			awayBackgroundColor();
			appendHomeQuarterLine();
			appendAwayQuarterLine();
			appendDistanceLineHome();
			appendDistanceLineAway();
			xAxis();
			legend();
			d3.csv("static/data/gameClock.csv", appendScoresHome);
			d3.csv("static/data/gameClock.csv", appendScoresAway);
