var showLegend = false; //default off

function SetupLegend(d3, d3ContentDiv) {
    var numColumns = 3;
    var elementSize = 30, xOffset = 10, columnWidth = 250;
    var legendWidth = columnWidth * numColumns + 0, legendHeight = 500;
    var u = elementSize * .5;
    var v = u;

    d3.select(d3ContentDiv).select("div.ptN2LegendClass").remove();

    if (!showLegend) return;

    var svg_legend = d3.select(d3ContentDiv).append("div")
        .attr("class", "ptN2LegendClass")
        .style("width", legendWidth + "px")
        .style("height", legendHeight + "px")
        .append("svg:svg")
        .attr("width", legendWidth)
        .attr("height", legendHeight);


    svg_legend.append("rect")
        .attr("class", "background")
        .attr("width", legendWidth)
        .attr("height", legendHeight);

    function CreateElementBorder(g) {
        g.append("rect")
            .attr("x", -u)
            .attr("y", -v)
            .attr("width", elementSize)
            .attr("height", elementSize)
            .style("stroke-width", 2)
            .style("stroke", "white")
            .style("fill", "none");
    }

    function CreateText(g, text) {
        g.append("svg:text")
            .attr("x", u + 5)
            .attr("y", 0)
            .attr("dy", ".35em")
            .attr("font-size", 20)
            .text(text)
            .style("fill", "black");
    }

    //title LEGEND
    {
        var el = svg_legend.append("g").attr("transform", "translate(" + (legendWidth * .5) + "," + (15) + ")");
        el.append("svg:text")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")//.attr("dominant-baseline", "middle")//
            .attr("font-size", 30)
            .attr("text-decoration", "underline")
            .text("LEGEND")
            .style("fill", "black");
    }

    //COLUMN TITLES
    {
        var text = ["Systems & Variables", "N^2 Symbols", n2Diag.showLinearSolverNames? " Linear Solvers" : "Nonlinear Solvers"];
        for (var i = 0; i < text.length; ++i) {
            var el = svg_legend.append("g").attr("transform", "translate(" + (columnWidth * i + xOffset) + "," + (60) + ")");
            el.append("svg:text")
                .attr("dy", ".35em")//.attr("dominant-baseline", "middle")//
                .attr("font-size", 24)
                .attr("text-decoration", "underline")
                .text(text[i])
                .style("fill", "black");
        }
    }

    //COLORS
    {
        var text = ["Group", "Component", "Output Explicit", "Output Implicit", "Collapsed", "Connection"];
        var colors = [N2Style.color.group, N2Style.color.component, N2Style.color.unknownExplicit, N2Style.color.unknownImplicit, N2Style.color.collapsed, N2Style.color.connection];
        text.splice(2, 0, "Input");
        colors.splice(2, 0, N2Style.color.param);
        text.splice(3, 0, "Unconnected Input")
        colors.splice(3, 0, N2Style.color.unconnectedParam)
        for (var i = 0; i < text.length; ++i) {
            var el = svg_legend.append("g").attr("transform", "translate(" + (columnWidth * 0 + xOffset + u) + "," + (80 + 40 * i + v) + ")");
            DrawLegendColor(el, u, v, colors[i], false);
            CreateText(el, text[i]);
        }
    }

    //N2 SYMBOLS
    {
        var text = ["Scalar", "Vector", "Collapsed variables"];
        var colors = [N2Style.color.unknownExplicit, N2Style.color.unknownExplicit, N2Style.color.unknownExplicit];
        var shapeFunctions = [DrawScalar, DrawVector, DrawGroup];
        for (var i = 0; i < text.length; ++i) {
            var el = svg_legend.append("g").attr("transform", "translate(" + (columnWidth * 1 + xOffset + u) + "," + (80 + 40 * i + v) + ")");
            shapeFunctions[i](el, u, v, colors[i], false);
            CreateElementBorder(el);
            CreateText(el, text[i]);
        }
    }

    //SOLVER COLORS
    {
        let i = 0;
        for (let solverName in n2Diag.style.solvers) {
            solver = n2Diag.style.solvers[solverName];
            if ((solver.type == 'linear' && n2Diag.showLinearSolverNames) ||
                (solver.type == 'nonLinear' && ! n2Diag.showLinearSolverNames)) {
                let el = svg_legend.append("g").attr("transform", "translate(" + (columnWidth * 2 + xOffset + u) + "," + (80 + 40 * i + v) + ")");
                DrawLegendColor(el, u, v, solver.style.fill, false);
                CreateText(el, solverName);
                ++i;
            }
        }
    }
}

function DrawLegendColor(g, u, v, color, justUpdate) {
    var shape = justUpdate ? g.select(".colorMid") : g.append("rect").attr("class", "colorMid").style("fill", color);
    return shape.attr("x", -u).attr("y", -v).attr("width", u * 2).attr("height", v * 2)
        .style("stroke-width", 0).style("fill-opacity", 1);
}

function DrawScalar(g, u, v, color, justUpdate) {
    var shape = justUpdate ? g.select(".sMid") : g.append("ellipse").attr("class", "sMid").style("fill", color);
    return shape.attr("rx", u * .6).attr("ry", v * .6);
}

function DrawVector(g, u, v, color, justUpdate) {
    var shape = justUpdate ? g.select(".vMid") : g.append("rect").attr("class", "vMid").style("fill", color);
    return shape.attr("x", -u * .6).attr("y", -v * .6).attr("width", u * 1.2).attr("height", v * 1.2);
}

function DrawGroup(g, u, v, color, justUpdate) {
    DrawBorder(g, u, v, color, justUpdate);
    var shape = justUpdate ? g.select(".gMid") : g.append("rect").attr("class", "gMid").style("fill", color);
    return shape.attr("x", -u * .6).attr("y", -v * .6).attr("width", u * 1.2).attr("height", v * 1.2);
}

function DrawBorder(g, u, v, color, justUpdate) {
    var shape1 = justUpdate ? g.select(".bordR1") : g.append("rect").attr("class", "bordR1").style("fill", color);
    var shape2 = justUpdate ? g.select(".bordR2") : g.append("rect").attr("class", "bordR2").style("fill", color);
    var shape3 = justUpdate ? g.select(".bordR3") : g.append("rect").attr("class", "bordR3").style("fill", color);
    var shape4 = justUpdate ? g.select(".bordR4") : g.append("rect").attr("class", "bordR4").style("fill", color);

    shape1.attr("x", -u).attr("y", -v).attr("width", u * 2).attr("height", v * .2);
    shape2.attr("x", -u).attr("y", -v).attr("width", u * .2).attr("height", v * 2);
    shape3.attr("x", u * .8).attr("y", -v).attr("width", u * .2).attr("height", v * 2);
    shape4.attr("x", -u).attr("y", v * .8).attr("width", u * 2).attr("height", v * .2);
}
