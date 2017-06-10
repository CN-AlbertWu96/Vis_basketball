CourtChart = function(dataDir, divObject) {

    //d3.select(divObject).childNodes[2].remove();
    
    var courtChart = {}

    var colorScheme = {
        "ball":       "yellow",

        "homeCircle": "red",
        "homeText":   "white",

        "awayCircle": "blue",
        "awayText":   "white",
    }

    var width = divObject.offsetWidth
    var height= divObject.offsetHeight

    var svg = d3.select(divObject)
                .append("svg")
                .attr("width", width)		    //设定宽度
                .attr("height", height);	    //设定高度

    courtChart.startPlay = function(gameID, eventSequence) {
        if (svg.html().search("circle") != -1) { // in play
            return;
        }

        var linearX = d3.scaleLinear()//横X坐标标度尺转换
                        .domain([0, 50])
                        .range([0, width]);
        var linearY = d3.scaleLinear()//纵Y坐标标度尺转换
                        .domain([0, 94])
                        .range([0, height]);
        var linearH = d3.scaleLinear()//高度H坐标标度尺转换
                        .domain([0, 15])
                        .range([3, 9]);				
        var linearT = d3.scaleLinear()//时间T坐标标度尺转换
                        .domain([0, 5000])
                        .range([0, 60000]);	

        var fileName    //fileName = gameID + "_" + eventSequence;
        if (eventSequence < 10)
            fileName = dataDir + "00" + gameID + "_000" + eventSequence + ".json";
        else if (eventSequence < 100)
            fileName = dataDir + "00" + gameID + "_00"  + eventSequence + ".json";
        else
            fileName = dataDir + "00" + gameID + "_0"   + eventSequence + ".json";

        d3.json(fileName, function(error, root) {
            if (error)
                throw error
            var dataOrigin = root.moments;//原始数据
            var datalen = dataOrigin.length;//数据点长度

            var k,m,tmp;
            
            var ballData = [];//球的数据
            var playerData = new Array(10);//球员的数据
            var timeData = [];//计时表顺序
            
            var allto = 0;
            for (k = 0; k < datalen - 1; k++){
                tmp = Math.round((dataOrigin[k][2]- dataOrigin[k+1][2]) * 100);
                timeData.push([dataOrigin[k][2],dataOrigin[k][3],tmp,allto]);
                allto += tmp;
            }
            //[setTime,offensiveTime,duration,delay] 时钟信息,包括,节时间/进攻时间,duration与delay用于d3的过度与延时
            
            var allto = 0;
            for (k = 0; k < datalen - 1; k++){
                ballData.push([dataOrigin[k][5][0][3],dataOrigin[k][5][0][2],dataOrigin[k][5][0][4],
                    timeData[k][2],timeData[k][3] ]    );
            }
            //[b.x.origin,b.y.origin,b.h.origin,duration,delay] 球体移动信息,xyh坐标
            for (m = 0 ; m < 10; m++){
                playerData[m] = [];
                allto = 0;
                for (k = 0; k < datalen - 1; k++){
                    if (typeof(dataOrigin[k+1][5][10]) == "undefined") {
                        dataOrigin[k+1][5] = dataOrigin[k][5];
                    }//数据缺失处理
                    playerData[m].push([dataOrigin[k][5][m+1][3],dataOrigin[k][5][m+1][2],
                        timeData[k][2],timeData[k][3] ]    );
                }
            }
            //[p.x.origin,p.y.origin,duration,delay] 球员移动信息,xy坐标
          

            var visitorPlayer = root.visitor.players;//客队球员信息
            var homePlayer = root.home.players;//主队球员信息
            var playerJersey = new Array(10);
        
            for (m = 0; m < 10; m++){
            
                tmp = findTag(visitorPlayer,homePlayer,dataOrigin[k][5][m+1][1]);
                if (m < 5) {playerJersey[m] = visitorPlayer[tmp].jersey;}
                else {playerJersey[m] = homePlayer[tmp].jersey;}
                if (playerJersey[m].length == 1) {playerJersey[m] = "0" + playerJersey[m];}
                //获取球员球衣号码

            }  

            var players = new Array(10);//players' variable
            var playersJ = new Array(10);//players'jersey variable

            var playerColour;//球员颜色
            var playerJColour;
            var circleRadium = 10;//球员半径
            var delayTime = Math.floor(0);//预先停止时间,即多久后动画开始播放,电脑性能允许可以调成0
            
            var recWidth = width / 12
            var homeRec = svg.append("rect")
                                   .attr("x", width * 3/4)
                                   .attr("y", 191)
                                   .attr("width", recWidth)
                                   .attr("height",12)
                                   .style("fill", colorScheme.homeCircle)

            var homeText = svg.append("text")
                                   .attr("x", width * 3/4 + recWidth + 2)
                                   .attr("y", 201)
                                   .text("Home")
                                   .attr("font-size",12)

            var awayRec = svg.append("rect")
                                   .attr("x", width * 3/4)
                                   .attr("y", 217)
                                   .attr("width",recWidth)
                                   .attr("height",12)
                                   .style("fill", colorScheme.awayCircle)

            var awayText = svg.append("text")
                                   .attr("x", width * 3/4 + recWidth + 2)
                                   .attr("y", 227)
                                   .text("Away")
                                   .attr("font-size",12)

            for (m = 0; m < 10; m++){

                if (m < 5) {playerColour = colorScheme.homeCircle;}
                    else {playerColour = colorScheme.awayCircle;}
                    //主客球员颜色区分

                if (m < 5) {playerJColour = colorScheme.homeText;}
                    else {playerJColour = colorScheme.awayText;}
                    //主客球员颜色区分
    
                players[m] = svg.selectAll(".MyCircle"+ m )
                        .data(playerData[m])
                        .enter()
                        .append("circle")
                        .transition()
                        .delay(function(d,i){
                            return linearT(d[3])+ delayTime + m/2;
                        })					
                        .attr("cx", function(d,i){
                            return linearX(d[0]);
                        })
                        .attr("cy", function(d,i){
                            return linearY(d[1]);
                        })
                        .style("fill",playerColour)
                        .attr("r",circleRadium)
                        .duration(0)
                        .transition()
                        .duration(function(d,i){
                            return linearT(d[2]);
                        })
                        .remove()
                //球员按照playerData中数据移动

                playersJ[m] = svg.selectAll(".MyText" + m )
                    .data(playerData[m])
                    .enter()
                    .append("text")
                    .attr("font-size",12)
                    .attr("fill",playerJColour)
                    .transition()
                    .delay(function(d,i){
                        return linearT(d[3])+ delayTime + m/3;
                    })
                    .attr("x", function(d,i){
                        return (linearX(d[0]) - 1.7 * circleRadium);
                    })
                    .attr("y", function(d,i){
                        return (linearY(d[1])- 0.5 * circleRadium);
                    })
                    .attr("dx",circleRadium)
                    .attr("dy",circleRadium)
                    .text(playerJersey[m])
                    .duration(0)
                    .transition()
                    .duration(function(d,i){
                        return linearT(d[2]);
                    })
                    .remove()
            } 
            
            var ball = svg.selectAll(".MyCircle")
                        .data(ballData)
                        .enter()
                        .append("circle")//创建了若干个circle
                        .transition()
                        .delay(function(d,i){
                            return linearT(d[4]) + delayTime;
                        })//circle达到指定的delay时间才出现
                        .attr("cx", function(d,i){
                            return linearX(d[0]);
                        })
                        .attr("cy", function(d,i){
                            return linearY(d[1]);
                        })
                        .style("fill", colorScheme.ball)
                        .attr("r",function(d,i){
                            return linearH(d[2]);
                        })
                        .duration(0)
                        .transition()
                        .duration(function(d,i){
                            return linearT(d[3]);
                        })
                        .remove()//在下一个circle出现时删去	
                        
                //球按照ballData中数据移动
                        
            var seTime = svg.selectAll(".MyseTime")
                        .data(timeData)
                        .enter()
                        .append("text")
                        .transition()
                        .text(function(d){
                            return Math.floor(d[0]/60) + ':' + Math.floor(d[0] % 60);
                        })
                        .delay(function(d){
                            return linearT(d[3]) + delayTime;
                        })
                        .attr("x", 0)
                        .attr("y", height/2)
                        .attr("dy", "-0.1em")
                        .duration(0)
                        .transition()
                        .duration(function(d,i){
                            return linearT(d[2]);
                        })
                        .remove()
                //节时间的变化
            
            var attTime = svg.selectAll(".MyattTime")
                        .data(timeData)
                        .enter()
                        .append("text")
                        .transition()
                        .text(function(d){
                            var str = d[1] + '';
                            str = parseFloat(str).toFixed(1);
                            return str;
                        })
                        .delay(function(d){
                            return linearT(d[3]) + delayTime;
                        })
                        .attr("x", 0)
                        .attr("y", height/2)
                        .attr("dy", "1em")
                        .duration(0)
                        .transition()
                        .duration(function(d,i){
                            return linearT(d[2]);
                        })
                        .remove()
                //进攻时间的变化

        })
    }

    return courtChart
}


function findTag(v,h,id){
        var i;
        for (i = 0; i < v.length; i++){
            if (v[i].playerid == id) {return i;}
        }
        for (i = 0; i < h.length; i++){
            if (h[i].playerid == id) {return i;}
        }
        return 0;
    }//根据id查找球员tag
