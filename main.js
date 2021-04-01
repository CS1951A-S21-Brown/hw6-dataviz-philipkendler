// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) + 150, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;


let svg = d3.select('#graph1')
    .append("svg")
    .attr('width', graph_1_width)
    .attr('height', graph_1_height)
    .append("g")
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

let countRef = svg.append("g");


d3.csv('../data/football.csv').then(function(data) {
    data = cleanData1(data);
    let count_1975 = 0;
    let count_1985 = 0;
    let count_1995 = 0;
    let count_2005 = 0;
    let count_2015 = 0;
    for (let i = 0; i < data.length; i++){
        if(data[i]['date'] == 1975) { 
            count_1975 += 1;
        }
        else if (data[i]['date'] == 1985) { 
            count_1985 +=1;
        }
        else if (data[i]['date'] == 1995) { 
            count_1995 +=1;
        }
        else if (data[i]['date'] == 2005) { 
            count_2005 +=1;
        }
        else if (data[i]['date'] == 2015) { 
            count_2015 +=1;
        }
    }
    var games_by_year = [{'year': '1975', 'count': count_1975}, {'year': '1985', 'count': count_1985}, {'year': '1995', 'count': count_1995}, {'year': '2005', 'count': count_2005}, {'year': '2015', 'count': count_2015}];
    data = games_by_year;
    let x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d['count']})])
        .range([0, graph_1_width - margin.left - margin.right]);
   
    let y = d3.scaleBand()
        .domain(data.map(d => d['year']))
        .range([0, graph_1_height - margin.top - margin.bottom])
        .padding(0.1);  

    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10)); 
    
    let bars = svg.selectAll("rect").data(data);

    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d['year'] }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 5));
    
    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d['year'])})
        .attr("x", x(0))
        .attr("y", function(d) { return  y(d['year'])})
        .attr("width", function(d) { return  x(d['count'])})
        .attr("height", y.bandwidth());
    
        let counts = countRef.selectAll("text").data(data);

    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) { return  x(d['count'])+ 10})
        .attr("y", function(d) { return  y(d['year']) + 10}) 
        .style("text-anchor", "start")
        .text(function(d) { return d['count']});


    svg.append("text")
        .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
        ${(graph_1_height - margin.top - margin.bottom) + 30})`)     
        .style("text-anchor", "middle")
        .text("Games Played");

    svg.append("text")
        .attr("transform", `translate(-80, ${(graph_1_height - margin.top - margin.bottom) / 2})`)
        .style("text-anchor", "middle")
        .text("Year");

    svg.append("text")
        .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-20})`)
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Number Of International Football Games Played");
});

// graph 2 starts here 

let svg2 = d3.select('#graph2')
    .append("svg")
    .attr('width', graph_2_width)
    .attr('height', graph_2_height)
    .append("g")
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// tooltip
let tooltip = d3.select("#graph2")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

d3.csv('../data/football.csv').then(function(data) {
    data = cleanData2(data);
    let min_games = 100;
    data = data.filter(d => d.games >= min_games);
    data = data.slice(0, 10);
    let x2 = d3.scaleLinear()
        .range([0, graph_2_width - margin.left - margin.right])
        .domain([d3.min(data, function(d) {return d.percentage}) -.03, d3.max(data, function(d) {return d.percentage})]);
    svg2.append("g")
        .attr("transform", `translate(0, ${graph_2_height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(x2));

    let y2 = d3.scaleLinear()
        .range([0, graph_2_height - margin.top - margin.bottom])
        .domain([d3.max(data, d => d['games']) + 100, 100]);

    svg2.append("g")
        .call(d3.axisLeft(y2));

    svg2.append("text")
        .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2},
        ${(graph_2_height - margin.top - margin.bottom) + 30})`)       
        .style("text-anchor", "middle")
        .text("Winning Percentage");

    svg2.append("text")
        .attr("transform", `translate(-80, ${(graph_2_height - margin.top - margin.bottom) / 2})`)       // HINT: Place this at the center left edge of the graph
        .style("text-anchor", "middle")
        .text("Games Played");

    svg2.append("text")
        .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2}, ${-20})`)
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Highest International Winning Percentage (minimum 100 games)");


    let dots = svg2.selectAll("dot").data(data);

    let color2 = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d['games'] }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 10));

    dots.enter()
        .append("circle")
        .attr("cx", function (d) { return x2(d.percentage); })
        .attr("cy", function (d) { return y2(d.games); })
        .attr("r", 4)
        .style("fill", function(d) { return color2(d['games']) })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
    });

    // graph 3 starts here

let svg3 = d3.select('#graph3')
    .append("svg")
    .attr('width', graph_3_width)
    .attr('height', graph_3_height)
    .append("g")
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

let x3 = d3.scaleLinear()
    .range([0, graph_3_width - margin.left - margin.right]);

let y3 = d3.scaleBand()
    .range([0, graph_3_height - margin.top - margin.bottom])
    .padding(0.1); 

let countRef3 = svg3.append("g");
let y_axis_label3 = svg3.append("g");

svg3.append("text")
    .attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2},
    ${(graph_3_height - margin.top - margin.bottom) + 30})`)
    .style("text-anchor", "middle")
    .text("Score");

let y_axis_text3 = svg3.append("text")
    .attr("transform", `translate(-120, ${(graph_3_height - margin.top - margin.bottom) / 2})`)
    .style("text-anchor", "middle");

let title3 = svg3.append("text")
    .attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2}, ${-20})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);


function setData(year) {
    d3.csv(`../data/football.csv`).then(function(data) {
        data_year = cleanData3(data, year);
        x3.domain([0, d3.max(data_year, function(d) { return d.score})]);
        y3.domain(data_year.map(d => d['country']));    
        y_axis_label3.call(d3.axisLeft(y3).tickSize(0).tickPadding(10));
        let bars3 = svg3.selectAll("rect").data(data_year);

        let color3 = d3.scaleOrdinal()
            .domain(data_year.map(function(d) { return d['country'] }))
            .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 10));

        bars3.enter()
            .append("rect")
            .merge(bars3)
            .transition()
            .duration(1000)
            .attr("fill", function(d) { return color3(d['country']) })
            .attr("x", x3(0))
            .attr("y", d => y3(d['country']))
            .attr("width", function(d) { return x3(d.score) })
            .attr("height", y3.bandwidth());
    
        let counts3 = countRef3.selectAll("text").data(data_year);

        counts3.enter()
            .append("text")
            .merge(counts3)
            .transition()
            .duration(1000)
            .attr("x", function(d) { return x3(d.score) + 10})
            .attr("y", d => y3(d['country']) + 10)
            .style("text-anchor", "start")
            .text(function(d) {return d.score});

        y_axis_text3.text('Country');
        title3.text(`Top 10 Countries in World Cup ${year}`);
        bars3.exit().remove();
        counts3.exit().remove();
    });
}
setData(2014);


function cleanData1(data) {
    for (let i = 0; i < data.length; i++){
        data[i]['date'] = parseInt(data[i]['date'].substring(0, 4));
    }
    return data;
}

function cleanData2(data) {
    var games_won = {};
    for (let i = 0; i < data.length; i++){
        if (games_won.hasOwnProperty(data[i]['home_team'])) {  
            // winning_percentages add 1 to games for that country
            games_won[data[i]['home_team']][0] += 1;
        }
        else { 
            // winning_percentages append country, set games = 1 and wins = 0
            games_won[data[i]['home_team']] = [1, 0];
        }
        // check if home team won, if they did add add 1 to wins
        if (parseInt(data[i]['home_score']) > parseInt(data[i]['away_score'])) { 
            games_won[data[i]['home_team']][1] += 1;
        }
        if (games_won.hasOwnProperty(data[i]['away_team'])) {
            // winning_percentages add 1 to games for that country
            games_won[data[i]['away_team']][0] += 1;
        }
        else { 
            // winning_percentages append country, set games = 1 and wins = 0
            games_won[data[i]['away_team']] = [1, 0];
        }
        // check if away team won, if they did add add 1 to wins
        if (parseInt(data[i]['away_score']) > parseInt(data[i]['home_score'])) { 
            games_won[data[i]['away_team']][1] += 1;
        }
    }

    var winning_percentages = [];
    for (key in games_won) { 
        winning_percentages.push({'country': key, 'games': games_won[key][0], 'wins': games_won[key][1], 'percentage': (games_won[key][1] / games_won[key][0]).toFixed(2)});
    }
    winning_percentages = winning_percentages.sort(comparator);
    return winning_percentages;
}

function cleanData3(data, year) { 
    winning_percentgaes = cleanData2(data);
    data = cleanData1(data);
    world_cup_data = data.filter(d => d.tournament == 'FIFA World Cup');
    world_cup_data = world_cup_data.filter(d=> d.date == year);
    var world_cup_wins = {};
    var opponent_games_won = {};
    for (let i = 0; i < data.length; i++){
        if (opponent_games_won.hasOwnProperty(data[i]['home_team'])) {  
            opponent_games_won[data[i]['home_team']][0] += 1;
        }
        else { 
            opponent_games_won[data[i]['home_team']] = [1, 0];
        }
        if (parseInt(data[i]['home_score']) > parseInt(data[i]['away_score'])) { 
            opponent_games_won[data[i]['home_team']][1] += 1;
        }
        if (opponent_games_won.hasOwnProperty(data[i]['away_team'])) {
            opponent_games_won[data[i]['away_team']][0] += 1;
        }
        else { 
            opponent_games_won[data[i]['away_team']] = [1, 0];
        }
    }
    for (let i = 0; i < world_cup_data.length; i++){
        if (!world_cup_wins.hasOwnProperty(world_cup_data[i]['home_team'])) {
            // if home team not in the dictionary, add them and set score to 0
            world_cup_wins[world_cup_data[i]['home_team']] = parseFloat(0);
        }
        if (!world_cup_wins.hasOwnProperty(world_cup_data[i]['away_team'])) {
            // if away team not in the dictionary, add them and set score to 0
            world_cup_wins[world_cup_data[i]['away_team']] = parseFloat(0);
        }
        if (parseInt(world_cup_data[i]['home_score']) > parseInt(world_cup_data[i]['away_score'])) { 
            // if home team won, add 1*opp winning pct to their score
            world_cup_wins[world_cup_data[i]['home_team']] += parseFloat((opponent_games_won[world_cup_data[i]['away_team']][1] / opponent_games_won[world_cup_data[i]['away_team']][0]).toFixed(2));
        }
        else if (parseInt(world_cup_data[i]['home_score']) == parseInt(world_cup_data[i]['away_score'])) { 
            // if they tied, add 1/2* opp winning pct to both scores
            world_cup_wins[world_cup_data[i]['home_team']] += parseFloat(1/2*(opponent_games_won[world_cup_data[i]['away_team']][1] / opponent_games_won[world_cup_data[i]['away_team']][0]).toFixed(2));
            world_cup_wins[world_cup_data[i]['away_team']] += parseFloat(1/2*(opponent_games_won[world_cup_data[i]['home_team']][1] / opponent_games_won[world_cup_data[i]['home_team']][0]).toFixed(2));
        }
        else { 
            // if away team won, add 1*opp winning pct to their score
            world_cup_wins[world_cup_data[i]['away_team']] += parseFloat((opponent_games_won[world_cup_data[i]['home_team']][1] / opponent_games_won[world_cup_data[i]['home_team']][0]).toFixed(2));
        }
    }
    var best_teams = [];
    for (key in world_cup_wins) { 
        best_teams.push({'country': key, 'score': world_cup_wins[key].toFixed(2)});
    }
    
    best_teams = best_teams.sort(comparator1).slice(0, 10);
    return best_teams
} 

function comparator(a,b) {
    return parseFloat(b['percentage']) - parseFloat(a['percentage']);
}
function comparator1(a,b) {
    return parseFloat(b['score']) - parseFloat(a['score']);
}

function mouseover(d) {
    let html = `${d.country}<br/>
            Percentage of games won: ${d.percentage}<br/>
            Games played: ${d.games}`;    
    
    tooltip.html(html)
        .style("left", `${(d3.event.pageX)}px`)
        .style("top", `${(d3.event.pageY) - 75}px`)
        .style("background-color", '#ddd')
        .style("padding", '5px 5px')
        .transition()
        .duration(200)
        .style("opacity", 0.9)
}

function mouseout(d) {
    tooltip
    .style("opacity", 0)
    .style("left", `-500px`)
    .style("top", `-300px`);
}


