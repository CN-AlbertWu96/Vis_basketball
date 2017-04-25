function max(a, b) { return a < b ? b : a }
function min(a, b) { return a < b ? a : b }

var GAME_TIME = 48

Parser = function() {
    var parser = {}
    var data = {}
    var margin = []
    var players = {}
    var homeName, visitorName

    parser.setData = function(source) {
        data = source
        return parser
    }

    function extractPlayer() {
        var startup = [[{}, {}, {}, {}], [{}, {}, {}, {}]]
        var blacklist = [[{}, {}, {}, {}], [{}, {}, {}, {}]]
        // get home and visitor
        for (var i  = 0; i < data.length && (!homeName || !visitorName); i++) {
            row = data[i]
            if (row.EVENTMSGTYPE == "1")
                if (row.HOMEDESCRIPTION != "NA")
                    homeName = row.PLAYER1_TEAM_NICKNAME
                else if (row.VISITORDESCRIPTION != "NA")
                    visitorName = row.PLAYER1_TEAM_NICKNAME
        }
        console.log(homeName, visitorName)

        // extract player and startup on each period
        for (var i = 0; i < data.length; i++) {
            row = data[i]
            if (row.EVENTMSGTYPE == "18") continue // !! TRASH EVENT !!
            for (var j = 1; j <= 3; j++) {
                ID =   "PLAYER" + j + "_ID"
                NAME = "PLAYER" + j + "_NAME"
                TEAM = "PLAYER" + j + "_TEAM_NICKNAME"
                row[ID] = row[ID].trim()

                if (row[NAME] != "NA" && !(row[ID] in players)) {
                    var tmp = { full: row[NAME],
                        team: row[TEAM],
                        name: row[NAME].substring(row[NAME].lastIndexOf(' ')+1),
                        isHome: row[TEAM] == homeName,
                        action: []
                    }

                    for (var k = 0; k < GAME_TIME; k++)
                        tmp.action[k] = []

                    //console.log(i, row[ID], tmp.name, tmp.team, tmp.start)
                    players[row[ID]] = tmp
                }

                if (row[NAME] != "NA") {
                    // extract startup on every period
                    k = (row[TEAM] == homeName ? 0 : 1)
                    if (Object.keys(startup[k][row.PERIOD-1]).length < 5
                            && !(row[NAME] in startup[k][row.PERIOD-1])
                            && !(row[NAME] in blacklist[k][row.PERIOD-1])) {
                        if (row.EVENTMSGTYPE == "8" && j == 2) {// substitute
                            blacklist[k][row.PERIOD-1][row[NAME]] = true
                            continue
                        }
                        startup[k][row.PERIOD-1][row[NAME]] = true
                        players[row[ID]].action[(row.PERIOD - 1) * 12]
                                        .push({type:"up"})
                    }
                }
            }
        }

        console.log("start up", startup)
    }


    // !! SCORE ONLY
    function extractAction() {
        var lastScore = [0, 0]
        var lastMin = 0
        for (var i = 0; i < data.length; i++) {
            row = data[i]

            // extract team score xx : xx
            if (row.SCORE != "NA") {
                row.SCORE = [parseInt(row.SCORE),
                    parseInt(row.SCORE.substring(row.SCORE.indexOf('-')+1))]
            }
            // extract time
            var minute = (row.PERIOD-1) * 12 + 12 -
                                        parseInt(row.PCTIMESTRING) - 1
            var second = 60 - parseInt(row.PCTIMESTRING.substring(
                                  row.PCTIMESTRING.indexOf(':') + 1))
            if (second == 60) {
                minute += 1
                second = 0
            }

            // score (including free throw)
            if (row.SCORE != "NA" && row.EVENTMSGTYPE != "12"
                    && row.EVENTMSGTYPE != "13" ) { 
                var add

                if (players[row.PLAYER1_ID].isHome)
                    add = row.SCORE[1] - lastScore[1]
                else
                    add = row.SCORE[0] - lastScore[0]

                players[row.PLAYER1_ID].action[minute].push({
                    type: "score", time: [minute, second], add: add
                })

                //console.log(players[row.PLAYER1_ID].name, minute, add)
            }

            // substitute
            if (row.EVENTMSGTYPE == "8") {
                players[row.PLAYER1_ID].action[minute].push({
                    type: "down", time: [minute, second]
                })
                players[row.PLAYER2_ID].action[minute].push({
                    type: "up", time: [minute, second]
                })
            }

            if (row.SCORE != "NA") {
                for(; lastMin < minute; lastMin++) {
                    if (lastMin == 0)
                        margin[0] = 0
                    else
                        margin[lastMin] = margin[lastMin-1]
                }
                margin[minute] = +row.SCOREMARGIN
                if (!margin[minute])
                    margin[minute] = 0

                lastMin = minute + 1
                lastScore[0] = row.SCORE[0]
                lastScore[1] = row.SCORE[1]
            }
        }
        margin.splice(GAME_TIME - 1, 1)


    }

    parser.parse = function() {
        extractPlayer()
        extractAction()
        return parser
    }

    parser.output = function() {
        var home = [], visitor = []
        for (var id in players) {
            pl = players[id]
            if (pl.isHome)
                home.push(pl)
            else
                visitor.push(pl)
        }
        return {home: home, visitor: visitor, margin: margin}
    }

    return parser
}

Evaluator = function() {
    var eval = {}
    var home, visitor, margin

    eval.setData = function(source) {
        home = source.home
        visitor = source.visitor
        margin = source.margin
        return eval
    }

    function calc(players) {
        var name = []
        var stream = []
        for (var id in players) {
            var pl = players[id]

            contribute = new Array(GAME_TIME)
            for (var i = 0; i < GAME_TIME; i++)
                contribute[i] = {x: i}

            var action = pl.action
            var last = 0
            var ingame = false
            for (var i = 0; i < GAME_TIME; i++) {
                var update = 0
                var up = false
                if (i % 12 == 0)
                    ingame = false

                for (var j = 0; j < action[i].length; j++) {
                    var act = action[i][j]

                    if (act.type == "score") {
                        update += act.add * 3.0
                    } else if (act.type == "up") {
                        up = true
                        ingame = true
                    } else if (act.type == "down") {
                        ingame = false
                    }
                }

                if (ingame)// && !up)
                    if (update)
                        contribute[i].y = last * 0.5 + update
                    else
                        contribute[i].y = max(0.5, last * 0.5)
                else
                    contribute[i].y = 0

                last = contribute[i].y
            }

            name.push(pl.name)
            stream.push(contribute)
        }
        return {info: name, stream: stream}
    }

    eval.evaluate = function() {
        return {up: calc(home), down: calc(visitor), middle: margin}
    }

    return eval
}

Stream = function(width, height) {	
    var width = window.document.getElementById("id1").offsetWidth;
    var height = window.document.getElementById("id1")	.offsetHeight;
    var margin = 40
   
    // INIT
    var svg = d3.select("#stream-svg")
                .attr("width", width)
                .attr("height", height)

    var ySum = [], yMax = 0, ySumMax = [0, 0] // for upper part and lower part
    var allData = [], data = [], info = [], delta = []
    var color = d3.scaleOrdinal()
    var upLen, downLen
    var gap, middle

    var stream = {}

    stream.setData = function(source) {
        upLen = source.up.stream.length
        downLen = source.down.stream.length
        halfLen = 5
        var name = source.up.info.concat(source.down.info)
        for (var i = 0; i < name.length; i++)
            info[i] = {name: name[i]}
        allData = source.up.stream.concat(source.down.stream)
        timeLen = allData[0].length
        delta = source.middle

        // initiation : allocate new array 
        data = new Array(halfLen * 2)
        for (var i = 0; i < halfLen * 2; i++)
            data[i] = new Array(timeLen)
        // initiation : add the attribute raw i ot allData
        for (var i = 0; i < allData.length; i++)
            for (var j = 0; j < timeLen; j++)
                allData[i][j].i = i
        // initiation : pick the on-floor players at time 0
        var lastI = -1
        for (var k = 0; k < halfLen * 2; k++) {
            for (var i = lastI + 1; i < allData.length; i++) {
                if (allData[i][0].y != 0) {
                    data[k][0] = allData[i][0]
                    lastI = i
                    break
                }
            }
        }


        // pick the on-floor players
        for (var j = 1; j < timeLen; j++) {
            var ct = 0
            for (var i = 0; i < allData.length; i++)
                if (allData[i][j].y != 0) {
                    ct++
                }
            //console.log("time", j, ct)

            var added = {}
            // keep on
            for (var k = 0; k < halfLen * 2; k++) {
                var i = data[k][j-1].i
                if (allData[i][j].y != 0) {
                    data[k][j] = allData[i][j]
                    added[i] = true
                }
            }
            // substitute
            for (var k = 0; k < halfLen * 2; k++) {
                if (!data[k][j]) {
                    for (var l = 0; l < allData.length; l++) {
                        if (!(l in added) && allData[l][j].y != 0) {
                            data[k][j] = allData[l][j]
                            added[l] = true
                            break
                        }
                    }
                }
                //console.log(k, info[data[k][j].i].name, added)
            }
        }

        // calc sum for setting the range of scale
        for (var j = 0; j < timeLen; j++) {
            ySum[j] = 0
            var halfSum
            for (var i = 0; i < data.length; i++) {
                ySum[j] += data[i][j].y
                yMax = max(data[i][j].y, yMax)
                if (i == halfLen - 1) {
                    ySumMax[0] = max(ySumMax[0], ySum[j])
                    halfSum = ySum[j]
                } else if (i == data.length - 1) {
                    ySumMax[1] = max(ySumMax[1], ySum[j] - halfSum)
                }
            }
        }

        // sort for render color
        var plStat = []
        for (var i = 0; i < allData.length; i++) {
            var sum = 0
            for (var j = 0; j < timeLen; j++)
                sum += allData[i][j].y
            plStat[i] = {i: i, sum: sum}
        }
        plStat.sort(function(a, b) { return a.sum < b.sum ? 1 : -1 })
        allocatedColor = new Array(allData.length)
        var upCt = 0, downCt = 0
        for (var i_ = 0; i_ < allData.length; i_++) {
            var i = plStat[i_].i
            if (i < upLen)
                allocatedColor[i] = d3.schemeCategory10[upCt++ % 10]
            else
                allocatedColor[i] = d3.schemeCategory10[(19 - downCt++) % 10]
        }
        color.domain(d3.range(allData.length))
             .range(allocatedColor)
        
        return stream
    }

    stream.layout = function (gap_, middle_) {
        gap = gap_, middle = middle_

        console.log(data)

        base = []
        ySumMax[0] += gap * halfLen + middle / 2
        ySumMax[1] += gap * halfLen + middle / 2
        for (var j = 0; j < timeLen; j++) {
            base[j] = ySumMax[1]
        }

        // layout orientation: inside -> outside
        for (var j = 0; j < timeLen; j++) {
            // draw upper part
            data[0][j].y0 = base[j] + middle / 2
            data[0][j].y1 = data[0][j].y0 + data[0][j].y
            gap_ = (data[0][j].y > 0 ? gap : 0)
            for (var i = 1; i < halfLen; i++) {
                if (data[i][j].y != 0) {
                    data[i][j].y0 = data[i-1][j].y1 + gap_
                    gap_ = gap
                    data[i][j].y1 = data[i][j].y0 + data[i][j].y
                } else {
                    data[i][j].y1 = data[i][j].y0 = data[i-1][j].y1
                }
            }

            // draw lower part
            data[halfLen][j].y0 = base[j] - middle / 2
            data[halfLen][j].y1 = data[halfLen][j].y0 - data[halfLen][j].y
            gap_ = (data[halfLen][j].y > 0 ? gap : 0)
            for (var i = halfLen + 1; i < data.length; i++) {
                if (data[i][j].y > 0) {
                    data[i][j].y0 = data[i-1][j].y1 - gap_
                    gap_ = gap
                    data[i][j].y1 = data[i][j].y0 - data[i][j].y
                } else {
                    data[i][j].y1 = data[i][j].y0 = data[i-1][j].y1
                }
            }
        }
        return stream
    }

    stream.fillColor = function() {
        var defs = d3.select("defs")
        var n = data.length, m = timeLen
        var k = 0.2
        //var scale = d3.scaleLog().domain([0.01, yMax]).range([50, 0])
        //var opacityScale = d3.scaleLog().domain([0.5, yMax]).range([1, 1])
        var lightScale = d3.scaleLinear().domain([0, yMax]).range([0.75, 0.4])
        for (var i = 0; i < n; i++) {
            var grad = defs.append("linearGradient")
                           .attr("x1", "0%")
                           .attr("y1", "0%")
                           .attr("x2", "100%")
                           .attr("y2", "0%")
                           .attr("id", "grad" + i)
            var opacity = 0.1
            var acc = 0
            for (var j = 0; j < m; j++) {
                grad.append("stop")
                    .attr("offset", (100.0 * j / (m - 1)) + "%")
                    .style("stop-color", function() {
                        var cl = d3.hsl(d3.color(color(data[i][j].i)))
                        cl.l = lightScale(data[i][j].y)
                        return cl
                    })
                    .style("stop-opacity", function() {
                        return 1
                        now = opacityScale(data[i][j].y)
                        opacity = k * opacity + (1 - k) * now
                    })
            }
        }
        return stream
    }

    stream.draw = function() {
        var xScale = d3.scaleLinear()
                       .domain(d3.extent(data[0],function(d){return d.x}))
                       .range([margin, width - margin])
        var yScale = d3.scaleLinear()
                       .domain([0, ySumMax[0] + ySumMax[1]])
                       .range([height - margin, margin])

        //======== STREAM ========
        var area = d3.area()
                     .x(function(d) { return xScale(d.x) })
                     .y0(function(d) { return yScale(d.y0) })
                     .y1(function(d) { return yScale(d.y1) })
                     .curve(d3.curveBasis)

        path = svg.append("g")
                  .selectAll("path")
                  .data(data).enter()
                  .append("path")
                  .attr("d", function(d, i) { 
                      //console.log(info[i].name, d)
                      return area(d) })
                  .style("fill", function(d, i) { return "url(#grad" + i + ")"})

        //var pre
        //path.on("mousemove", function(d) {
        //        var x = d3.event.layerX
        //        console.log(d3.event.layerX, xScale.invert(x))
        //        var name = info[d[parseInt(xScale.invert(x))].i].name
        //        if (pre)
        //            pre.remove()
        //        pre = svg.append("text")
        //           .attr("x", d3.event.layerX)
        //           .attr("y", d3.event.layerY)
        //           //.attr("text-anchor", "middle")
        //           //.style("fill", "white")
        //           .text(name)
        //    })
        
        //======== LABEL ========
        //for (var i = 0; i < data.length; i++) {
        //    break
        //    var ct = 0
        //    var minHeight = 25, minWidth = 24
        //    for (var j = 0; j < data[0].length; j++) {
        //        if (Math.abs(yScale(data[i][j].y1) - yScale(data[i][j].y0))
        //                                                >= minHeight) {
        //            var k = 1, peak = 0
        //            while (j + k < data[0].length &&
        //                            Math.abs(yScale(data[i][j+k].y1)
        //                            - yScale(data[i][j+k].y0)) >= minHeight) {
        //                if (Math.abs(data[i][j+k].y1 - data[i][j+k].y0) >
        //                    Math.abs(data[i][j+peak].y1-data[i][j+peak].y0))
        //                    peak = k
        //                k++
        //            }
        //            k -= 1

        //            console.log(k)
        //            if (xScale(data[i][j+k].x) - xScale(data[i][j].x)
        //                                            >= minWidth) {
        //                svg.append("text")
        //                   .attr("x", xScale((data[i][j + peak].x)))
        //                   .attr("y", yScale((data[i][j + peak].y0 +
        //                                      data[i][j + peak].y1) / 2))
        //                   .text(info[i].name)
        //                   .attr("dy", function() {
        //                       return i < upLen ? "1.2em": "-0.5em"
        //                   })
        //                   //.attr("dx", "0.3em")
        //                   .attr("fill", "white")
        //                   .style("text-anchor", "middle")
        //            }

        //            j += k
        //        }
        //    }
        //}


        //======== MIDDLE SCORE BAR ========
        var xScaleMid = d3.scaleBand().domain(d3.range(data[0].length))
                                      .range([margin, width - margin])
                                      .padding(0.1)
        absMax = d3.max(delta, function(d) { return Math.abs(d) })
        var yScaleMid = d3.scaleLinear()
                          .domain([-absMax, absMax])
                          .range([yScale(ySumMax[1] - middle/2.5),
                                  yScale(ySumMax[1] + middle/2.5)])
        /*svg.append("line")
           .attr("x1", margin)
           .attr("y1", yScaleMid(0))
           .attr("x2", width - margin)
           .attr("y2", yScaleMid(0))
           .style("stroke", "grey")*/

        svg.append("g")
           .selectAll("rect")
           .data(delta).enter()
           .append("rect")
           .attr("x", function(d, i) { return xScaleMid(i) })
           .attr("y", function(d, i) { return yScaleMid(d > 0 ? d : 0) })
           .attr("width", xScaleMid.bandwidth() )
           .attr("height", function(d) {
               return Math.abs(yScaleMid(d) - yScaleMid(0))
           })
           .style("fill", function(d) {
               return d > 0 ? d3.rgb(255, 175, 101) : d3.rgb(156, 202, 226)
           })
           .append("title")
           .text(function(d, i) { return i+1 + " : 00" + "   " + d })


        //======== BRUSH ========
        svg.append("g")
           .attr("class", "brush")
           .call(d3.brushX()
                   .extent([[0,0], [width, height]])
                   .on("end", brushend))

        function brushend() {
            if (!d3.event.sourceEvent) return
            if (!d3.event.selection) return
            coor = d3.event.selection
            clock.draw(xScale.invert(coor[0]), xScale.invert(coor[1]))
        }
        return stream
    }

    return stream
}


function drawGameView(filename, width, height) {
    d3.csv(filename, function(error, csv) {
        if (error) throw error

        parser = Parser().setData(csv)
                         .parse()

        evaluator = Evaluator().setData(parser.output())

        streamData = evaluator.evaluate()

        stream = Stream(width, height)
        stream.setData(streamData)
              .layout(1, 8)
              .fillColor()
              .draw()

        clock = GameClock(width, 300, csv)
    })
}

drawGameView("static/data/TestData.csv", 1200, 500)
