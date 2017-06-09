function parseTime(time, period) {
    var minute, second
    if (typeof time == "string") { // to support two override versions
        minute = (period - 1) * 12 + 12 - parseInt(time) - 1
        second = 60 - parseInt(time.substring( time.indexOf(':') + 1))
        if (second == 60) {
            minute += 1
            second = 0
        }
    } else {
        minute = time
        second = 0
    }

    return new Date(2017, 0, 0, 0, minute, second);
}

GameClock = function(divObject) {
    var width =  divObject.offsetWidth;
    var height = divObject.offsetHeight;

    var clock = {};
    var margin = {left: 30, right: 30, top: 10, bottom: 30};
    var areas = 6; //Shows six colors on the background
    var quarters = 4; //Number of Quarters
    var maxdistance = 30; // Max Distance
    var yAxis_ticks = 6;
    var symbolSize = (width + height)/20;
    var symbolStrokeColor = "black";
    var symbolStrokeSize = 0.5;
    var lineStrokewidth = (width+height)/1000;
    var data

    var colorScheme = {
        "background": d3.color("lightblue"),
        "badEvent": d3.color("orange"),
        "goodEvent": d3.color("green"),
    }

    var homebackgroundColor = colorScheme.background; //Background Color for Home Team
    var awaybackgroundColor = colorScheme.background.brighter(0.24*(areas-1)); //Background Color for Away Team

    // Main SVG
    var svg = d3.select(divObject)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    width -= margin.left + margin.right;
    height -= margin.top + margin.bottom;

    // X-Scale for both teams
    var xScale = d3.scaleTime()
                   .domain([parseTime("12:00", 1), parseTime("00:00", 4)])
                   .rangeRound([0, width])

    // Home Team Y Scale & Axis
    var yScale_Home = d3.scaleLinear()
                        .domain([0, maxdistance])
                        .rangeRound([ height/2, 0]);

    var yAxis_Home = d3.axisLeft()
                      .scale(yScale_Home)
                      .ticks(yAxis_ticks);

    // Away Team Y Scale & Axis
    var yScale_Away = d3.scaleLinear()
                        .domain([0, maxdistance])
                        .rangeRound([ height/2, height]);

    var yAxis_Away = d3.axisLeft()
                      .scale(yScale_Away)
                      .ticks(yAxis_ticks);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .call(yAxis_Home)

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .call(yAxis_Away)

    // Symbol Function
    function symbol(event){
        if (event == "1"  || event == "3" ) {return d3.symbolCircle;}
        if (event == "2") { return d3.symbolSquare; }
        if (event == "4") { return d3.symbolTriangle; }
        if (event == "5") { return d3.symbolCross; }
        if (event == "6") { return d3.symbolDiamond; }
    }	

    function filter_draw(team, description, event, time){
        return description != "NA" &&  (event== 1
            || event== 3 || event== 2 || event== 4
            || event== 5 || event== 6) && (time >= begin) && (time <= end); 
    }

    // Color Coding
    function colorcode(event){
        if (event == "1" || event == "3" || event == "4") {
            return colorScheme.goodEvent;
        } else { 
            return colorScheme.badEvent;
        }
    }

    // Home Team Background Color
    function homeBackgroundColor() {
        var homeBackgroundsvg = svg.append("g")
                                   .attr("class", "home_background_color")
                                   .attr("transform", "translate(" + 0 + "," + 0 + ")")

        for (var i = 0; i < areas ; i++) {
            homeBackgroundsvg.append("rect")
                             .attr("width", width)
                             .attr("height", (height/2)/areas)
                             .attr("fill", homebackgroundColor.brighter(0.24*i))
                             .attr("x", 0)
                             .attr("y", ((height/2)/areas)*i);
        }
    }

    // Away Team Background Color
    function awayBackgroundColor() {
        var awayBackgroundsvg = svg.append("g")
                                    .attr("class", "away_background_color")
                                    .attr("transform", "translate(" + 0 + "," + height/2 + ")")

        for (var i = 0; i < areas ; i++) {
            awayBackgroundsvg.append("rect")
                             .attr("width", width)
                             .attr("height", (height/2)/areas)
                             .attr("fill", awaybackgroundColor.darker(0.24*i))
                             .attr("x", 0)
                             .attr("y", ((height/2)/areas)*i);
        }
    }

    // Quarter Line
    function quarterLine(){
        for (var i = 1; i < quarters; i++) {
            svg.append("line")
                .attr("x1", ((width/quarters)*i))
                .attr("y1", 0)
                .attr("x2", ((width/quarters)*i))
                .attr("y2", height)
                .style("stroke", "white")
                .style("stroke-width", 6);
        }
    }

    // Middle Line
    function middleLine(){
        svg.append("line")
            .attr("x1", 0)
            .attr("y1", (height/2))
            .attr("x2", width)
            .attr("y2", (height/2))
            .style("stroke", "gray")
            .style("stroke-width", 2);
    }

    // Legend
    function legend(){
        data = ["1", "2", "4", "5", "6"]
        text = ["Make", "Miss", "Rebound", "Foul Drawn", "Foul"]
        // Legend for Symbols
        svg.selectAll(".points")
                .data(data)
                .enter()
                .append("path")
                .attr("class", "legend")
                .attr("fill", "black")
                .attr("transform", function(d, i){
                        return "translate(" + (i * (width/6) + 70) + ","
                                + (-margin.top+20) + ")"
                    })
                .attr("d", d3.symbol().size((width + height)/10)
                          .type(function(d){ return symbol(d) }));
        // Legend for text
        svg.selectAll(".points")
            .data(text)
            .enter()
            .append("text")
            .attr("class", "text")
            .attr("x", function(d,i){
                return ((i * (width/6)) + 80);
            })
            .attr("y", function(d,i){
                return (-margin.top+25);
            })
            .text(function(d){
                return d;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "15px")
            .attr("fill", "black")

    }

    clock.setData = function(rawData) {
        data = rawData
    }

    //Draw Function
    clock.draw = function (start_time, end_time) {
        begin = parseTime(start_time)
        end   = parseTime(end_time)

        var xScale_draw = d3.scaleTime()
                        .domain([begin, end])
                        .rangeRound([ 0 , width ]);
        var DURATION = 500

        function appendSymbols(team) {
            var key, yScale
            if (team == "home") {
                key = "HOMEDESCRIPTION"
                yScale = yScale_Home
            } else {
                key = "VISITORDESCRIPTION"
                yScale = yScale_Away
            }
            var pointUpdate = svg.selectAll("." + team + "-point")
                .data(data.filter(function(d) { 
                    return filter_draw(team, d[key], d.EVENTMSGTYPE,
                        parseTime(d.PCTIMESTRING, d.PERIOD))
                }) , function(d) {
                    return d.EVENTNUM
                })

            var enterPoint = pointUpdate.enter()
                    .append("path")
                    .attr("class", team + "-point")
                    .attr("transform", function(d){
                        return "translate(" + xScale_draw(parseTime(d.PCTIMESTRING, d.PERIOD)) + ","
                                + yScale(0) + ")"
                    })
                    .attr("d", d3.symbol().size(symbolSize)
                          .type(function(d){ return symbol(d.EVENTMSGTYPE) }))
                    .attr("fill", function(d) { 
                        return colorcode(d.EVENTMSGTYPE)
                    })
                    .attr("stroke", symbolStrokeColor)
                    .attr("stroke-width", symbolStrokeSize)

            enterPoint.append("title")
                      .text(function(d){
                          return "Action: " + d[key];
                      })

            enterPoint.on("click",function(d,i){
                          console.log(d['GAME_ID'],d['EVENTNUM']);
                          courtChart.startPlay(d['GAME_ID'],d['EVENTNUM']); 
                      })

            enterPoint.merge(pointUpdate)
                    .transition()
                    .duration(DURATION)
                    .attr("transform", function(d){
                        d.lastX = xScale_draw(parseTime(d.PCTIMESTRING,
                                    d.PERIOD))
                        return "translate(" + d.lastX + ","
                                + yScale(d.DISTANCE) + ")"
                    })

            exitPoint = pointUpdate.exit()
                         .transition()
                         .duration(DURATION)
                         .attr("transform", function(d){
                             return "translate(" + d.lastX + ","
                                     + yScale(0) + ")"
                         })
                         .attr("fill", "none")
                         .attr("stroke-width", 0)
                         .remove()
        }

        function appendDistanceLine(team) {
            var key, yScale
            if (team == "home") {
                key = "HOMEDESCRIPTION"
                yScale = yScale_Home
            } else {
                key = "VISITORDESCRIPTION"
                yScale = yScale_Away
            }
            var lineUpdate = svg.selectAll("." + team + "-line")
                .data(data.filter(function(d) { 
                    return filter_draw(team, d[key], d.EVENTMSGTYPE,
                        parseTime(d.PCTIMESTRING, d.PERIOD))
                }) , function(d) {
                    return d.EVENTNUM
                })

            var enterLine = lineUpdate.enter()
                    .append("line")
                    .attr("class", team + "-line")
                    .style("stroke", function(d) {
                        return colorcode(d.EVENTMSGTYPE)
                    })
                    .style("stroke-width", lineStrokewidth)
                    .attr("x1", function(d) {
                        return xScale_draw(parseTime(d.PCTIMESTRING, d.PERIOD));
                    })
                    .attr("x2", function(d) {
                        return xScale_draw(parseTime(d.PCTIMESTRING, d.PERIOD));
                    })
                    .attr("y1", yScale(0))
                    .attr("y2", yScale(0))

            enterLine.merge(lineUpdate)
                    .transition()
                    .duration(DURATION)
                    .attr("x1", function(d) {
                        return xScale_draw(parseTime(d.PCTIMESTRING, d.PERIOD));
                    })
                    .attr("x2", function(d) {
                        return xScale_draw(parseTime(d.PCTIMESTRING, d.PERIOD));
                    })
                    .attr("y1", yScale(0))
                    .attr("y2", function(d) {
                        return yScale(d.DISTANCE);
                    })

            exitLine = lineUpdate.exit()
                       .transition()
                       .duration(DURATION)
                       .attr("y2", yScale(0))
                       .remove()
        }

        appendSymbols("home")
        appendSymbols("away")
        appendDistanceLine("home")
        appendDistanceLine("away")
    }

    homeBackgroundColor();
    awayBackgroundColor();
    middleLine();
    legend();

    return clock;
}

