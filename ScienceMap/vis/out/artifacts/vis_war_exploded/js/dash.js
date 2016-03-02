/**
* Created by llin on 2015/12/27.
*/

//生成绘制虚线需要的点集
function make_points(data) {
    var sx = data[0];
    var sy = data[1];
    var r = data[2];
    var a = data[3];
    var linePath = d3.svg.line();
    var d = 5;
    var dx = d * Math.cos(a);
    var dy = d * Math.sin(a);
    var points = new Array();
    for (var i = 0; d * i <= r; i++)
        points.push([sx + dx * i, sy + dy * i]);
    return points;
}

//绘制虚线的函数
function draw_dash(group, dash_set) {
    var linePath = d3.svg.line();
    for (var i = 0; i < dash_set.length; i++) {
        var points = make_points(dash_set[i]);
        for (var j = 1; j < points.length; j += 2) {
            group.append("path")
                .attr("d", linePath([points[j - 1], points[j]]))
                .attr("stroke", "black")
                .attr("fill", "none")
                .attr("stroke-width", "3px");
        }
    }
}

//利用dash_set2对dash_set1所支配的虚线进行number段的分段连接
function make_connect (  dash_set1 , dash_set2 , number ){
    connect_dash_set = [];
    var linePath = d3.svg.line();
    var part = dash_set1[0][2]/number;
    for ( var i = 0 ; i < dash_set2.length ; i++ ){
        for ( var j = 1 ; j <= number ; j++ ) {
            var u = dash_set2[i][0];
            var v = dash_set2[i][1];
            var sa = dash_set1[u][3];
            var sx = dash_set1[u][0]+part*j*Math.cos(sa);
            var sy = dash_set1[u][1]+part*j*Math.sin(sa);
            var ea = dash_set1[v][3];
            var ex = dash_set1[v][0]+part*j*Math.cos(ea);
            var ey = dash_set1[v][1]+part*j*Math.sin(ea);
            var r = Math.sqrt(Math.pow(ey - sy, 2) + Math.pow(ex - sx, 2));
            var a = Math.atan2(ey - sy, ex - sx);
            connect_dash_set.push ( [sx,sy,r,a]);
        }
    }
}

function make_connect_def ( group, dash_set1 , dash_set2 , number ){
    group = [];
    var linePath = d3.svg.line();
    var part = dash_set1[0][2]/number;
    for ( var i = 0 ; i < dash_set2.length ; i++ ){
        for ( var j = 1 ; j <= number ; j++ ) {
            var u = dash_set2[i][0];
            var v = dash_set2[i][1];
            var sa = dash_set1[u][3];
            var sx = dash_set1[u][0]+part*j*Math.cos(sa);
            var sy = dash_set1[u][1]+part*j*Math.sin(sa);
            var ea = dash_set1[v][3];
            var ex = dash_set1[v][0]+part*j*Math.cos(ea);
            var ey = dash_set1[v][1]+part*j*Math.sin(ea);
            var r = Math.sqrt(Math.pow(ey - sy, 2) + Math.pow(ex - sx, 2));
            var a = Math.atan2(ey - sy, ex - sx);
            group.push ( [sx,sy,r,a]);
        }
    }
    return group;
}


//添加能够旋转的虚线
function add_rotate_dash(sx, sy, r, a) {
    rotate_dash_set.push([sx, sy, r, a]);
}

//添加仅用于连接的虚线,参数是连接index1和index2的rotate虚线
function add_connect_dash ( index1 , index2  ){
    connect_info.push([index1,index2]);
}


//将所有的旋转虚线旋转a角度
function rotate_dash_with(a ,dd) {
    var data = new Array();
    var data1 = new Array();
    for (var i = 0; i < rotate_dash_set.length; i++) {
        rotate_dash_set[i][3] += a;
        var points = make_points(rotate_dash_set[i]);
        for (var j = 1; j < points.length; j += 2)
            data.push([points[j - 1], points[j]]);
    }
    if( connect_info.length > 0 ){
        make_connect ( rotate_dash_set , connect_info , 5 );
        for ( var i = 0 ; i < connect_dash_set.length ; i++ ){
            var points = make_points(connect_dash_set[i]);
            for ( var j = 1 ; j < points.length; j += 2 )
                data1.push([points[j-1],points[j]]);
        }
    }
    var linePath = d3.svg.line();
    rotate_dash.selectAll("path")
        .data(data)
        .transition()
        .ease("linear")
        .duration(dd*a)
        .attr("d", function (d) {
            return linePath(d)
        });
    connect_dash.selectAll("path")
        .data(data1)
        .transition()
        .ease("linear")
        .duration(dd*a)
        .attr("d",function(d){
           return linePath(d);
        });
}

function rotate_dash_by ( group1 , group2, dataset , dataset2 , info , a , dd ){
    var data = new Array();
    var data1 = new Array();
    for (var i = 0; i < dataset2.length; i++) {
        dataset2[i][3] += a;
        var points = make_points(dataset2[i]);
        for (var j = 1; j < points.length; j += 2)
            data.push([points[j - 1], points[j]]);
    }
    if( info.length > 0 ){
        dataset= make_connect_def ( dataset , dataset2 , info , 5);
        for ( var i = 0 ; i < dataset.length ; i++ ){
            var points = make_points(dataset[i]);
            for ( var j = 1 ; j < points.length; j += 2 )
                data1.push([points[j-1],points[j]]);
        }
    }
    var linePath = d3.svg.line();
    group1.selectAll("path")
        .data(data)
        .transition()
        .ease("linear")
        .duration(dd*a)
        .attr("d", function (d) {
            return linePath(d)
        });
    group2.selectAll("path")
        .data(data1)
        .transition()
        .ease("linear")
        .duration(dd*a)
        .attr("d",function(d){
            return linePath(d);
        });
}

//绘制出能够旋转的虚线
function draw_rotate() {
    draw_dash(rotate_dash, rotate_dash_set);
}

//绘制出一张网图
function draw_net (){
    draw_dash ( rotate_dash , rotate_dash_set );
    make_connect ( rotate_dash_set , connect_info , 5 );
    draw_dash ( connect_dash , connect_dash_set );
}

//让网图进行旋转
function rotate_net ( a ,dd ){
    rotate_dash_with ( a ,dd);
}

//获取html中svg
var svg = d3.select("body").select("svg");


//rotate_dash的group和set
var rotate_dash = svg.append("g")
    .attr("class", "rotate_dash");
var rotate_dash_set = new Array();

//connect_dash的group,set和info
var connect_dash = svg.append("g")
    .attr("class" , "connect_dash");

var connect_dash_set = new Array();
var connect_info = new Array();

var rotate_duration  = 3000;