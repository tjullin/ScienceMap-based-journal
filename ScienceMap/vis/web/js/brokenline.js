/**
 * Created by llin on 2015/12/27.
 */
function draw_brokenline ( group ,dataset,  color , data , cx , cy , r , width )
{
    var linePath = d3.svg.line();
    var PI = Math.acos(-1.0);
    var points = new Array();
    var angle = 2.0*PI/data.length;
    for ( var i = 0 ; i < data.length ; i++ )
    {
        var tr = r-2;
        var tx = cx + tr*Math.cos( angle*i);
        var ty = cy + tr*Math.sin( angle*i);
        points.push( [tx,ty] );
    }
    points.push( points[0] );
    group.append("path")
        .attr("d", linePath(points))
        .attr("stroke" , color )
        .attr("stroke-width", width )
        .attr("fill","none");
    points = [];
    for ( var i = 0 ; i < data.length ; i++ )
    {
        var tr = data[i]/50*r;
        var tx = cx + tr*Math.cos( angle*i);
        var ty = cy + tr*Math.sin( angle*i);
        dataset.push([cx,cy,tr,angle*i]);
        points.push( [tx,ty] );
    }
    points.push( points[0] );
    group.selectAll("path")
            .transition()
            .duration(1000)
            .attr("d", linePath(points));
}

function rotate_broken_line ( group, dataset, a , dd ){
    var linePath = d3.svg.line();
    var points = new Array();
    for ( var i = 0 ; i < dataset.length ; i++ )
    {
        var tr = dataset[i][2];
        dataset[i][3] += a;
        var tx = dataset[i][0] + tr*Math.cos( dataset[i][3] );
        var ty = dataset[i][1] + tr*Math.sin( dataset[i][3] );
        points.push( [tx,ty]);
    }
    points.push(points[0]);
    group.selectAll("path")
        .transition()
        .duration(a*dd)
        .attr("d",linePath(points));
}

function rotate_brokens ( a , dd )
{
    rotate_broken_line ( mag1, mag1_angle, a , dd );
    rotate_broken_line ( tmm, tmm_angle, a , dd );
    rotate_broken_line ( mag2, mag2_angle, a , dd );
}

function draw_tvcg ( color , data , cx , cy , r , width){
    draw_brokenline(mag1,mag1_angle,color,data,cx,cy,r , width);
}

function draw_tmm ( color, data , cx , cy , r , width ){
    draw_brokenline(tmm,tmm_angle,color,data,cx,cy,r ,width);
}

function draw_tkde ( color , data , cx , cy , r ,width ){
    draw_brokenline(mag2,mag2_angle, color,data,cx,cy,r,width);
}

//获取网页中的svg图，并且创建三种杂志各自的分区
var svg = d3.select("body").select("svg");

var mag1 = svg.append("g")
    .attr("class","tvcg");

var tmm = svg.append("g")
    .attr("class","tmm");

var mag2 = svg.append("g")
    .attr("class","tkde");

var window =  svg.append("g")
    .attr("class","window");

var mag1_angle = new Array();

var tmm_angle = new Array();

var mag2_angle = new Array();


var window_rotate = svg.append("g")
    .attr("class","window_rotate");

var window_connect = svg.append("g")
    .attr("class","window_connect");

var window_text = svg.append("g")
    .attr("class","window_text");

var window_temp = svg.append("g")
    .attr("class","window_temp");

var window_rotate_set = new Array();
var window_connect_set = new Array();
var window_connect_info = new Array();
var window_text_set = new Array();
var window_temp_set = new Array();

function clear ( )
{
    if ( pid1 != -1 )
        clearInterval ( pid1 );
    if ( pid2 != -1 )
        clearInterval ( pid2 );
    if ( pid3 != -1 )
        clearInterval ( pid3 );
    pid1 = pid2 = pid3 =  -1;
    window_rotate_set = [];
    window_connect_set = [];
    window_connect_info = [];
    window_text_set = [];
    window_temp_set = [];
    window_rotate.selectAll("path").remove();
    window_connect.selectAll("path").remove();
    window_text.selectAll("text").remove();
    window_temp.selectAll("path").remove();
}

var ccx = 1400, ccy = 300, cr = 150;
var pid1,pid2,pid3;

function myclick( name,cnt,color){
    clear();
    d3.json( name , function (error , names ) {
        var size = names.length;
        var segment = 5;
        var PI = Math.acos(-1);
        var angle = 2.0 * PI / size;
        for (var i = 0; i < names.length; i++) {
            window_rotate_set.push([ccx, ccy, cr, angle * i]);
            var index1 = i;
            var index2 = (i + 1) % names.length;
            window_connect_info.push([index1, index2]);
            draw_text(window_text, window_text_set, names[i]["keyword"], ccx, ccy, angle * i, cr + 10);
        }
        console.log(window_connect_info.length);
        draw_dash(window_rotate, window_rotate_set);
        window_connect_set = make_connect_def (window_connect_set, window_rotate_set, window_connect_info, 5);
        draw_dash(window_connect, window_connect_set);
        var data = new Array();
        for ( var i = 0 ; i < names.length ; i++ ){
            var value = names[i]["value"];
            if ( value/cnt*100 > 47 ) value = 47;
            data.push ( value );
        }
        draw_brokenline(window_temp,window_temp_set,color, data, ccx, ccy, cr, "6px");
        function rotate_window(){
            rotate_dash_by ( window_rotate , window_connect , window_connect_set , window_rotate_set , window_connect_info , angle , 1000);
        }
        //pid1 = setInterval ( rotate_window , 2000 );
        function rotate_text1(){
            rotate_text_by( window_text , window_text_set , angle , 1000 );
        }
        //pid2 = setInterval ( rotate_text1 , 2000 );
        function rotate_line (){
            rotate_broken_line( window_temp , window_temp_set , angle , 1000 );
        }
        //pid3 = setInterval (  rotate_line , 2000 );
    });
}

function myMouseover ( group  ){
    group.selectAll("path")
        .attr("stroke-width" , 15 )
        .attr("stroke" , "#ADFF2F");
}

function myMouseout ( group , color , width ){
    group.selectAll("path")
        .attr("stroke-width" , width )
        .attr("stroke" , color );
}

//实现点击事件的函数
mag1.on( "click" , function(){
    myclick( "../data/tvcg.json",161,"#CDCD00");
});

tmm.on( "click" , function(){
   myclick( "../data/tmm.json",185,"#87CEFA");
});

mag2.on ( "click" , function(){
   myclick( "../data/tkde.json",139 , "#8B1A1A");
});

mag1.on ( "mouseover" , function(){
    myMouseover ( mag1 );
});

tmm.on ( "mouseover" , function(){
    myMouseover ( tmm );
});

mag2.on ( "mouseover" , function(){
    myMouseover ( mag2 );
});

mag1.on ( "mouseout" , function(){
   myMouseout ( mag1 ,"#CDCD00" , "12px" );
});

tmm.on ( "mouseout" , function(){
    myMouseout ( tmm ,"#87CEFA" , "7px" );
});

mag2.on ( "mouseout" , function(){
    myMouseout( mag2 ,"#8B1A1A" , "3px" );
})
