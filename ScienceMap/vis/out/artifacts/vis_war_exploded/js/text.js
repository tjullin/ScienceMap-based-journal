/**
 * Created by llin on 2015/12/27.
 */

function draw_char ( group , dataset , ch, x , y , angle , r )
{
    console.log("hello")
    dataset.push ( [angle,r] );
    group.append("text")
        .attr("fill" ,"red")
        .attr("font-size","11px")
        .attr("text-anchor","middle")
        .attr("rotate", ""+(angle/(2*Math.acos(-1))*360) )
        .attr("x" , x )
        .attr("y" , y )
        .attr("dx", r*Math.cos(angle))
        .attr("dy", r*Math.sin(angle))
        .text(ch);
}

//绘制文本
function draw_text ( group , dataset , name , x , y , angle , r )
{
    var dd = 12;//每个字所占的空间
    var start = 0;
    var end = name.length-1;
    for ( var i = start ; i <= end ; i++ )
        draw_char ( group, dataset , name.substr(i,1) , x , y , angle , dd*i+r );
}

function rotate_text_by ( group , dataset , a , dd ){
    for ( var i = 0 ; i < text_angle.length ; i++ )
        dataset[i][0] += a;
    group.selectAll("text")
        .data( dataset )
        .transition()
        .ease("liner")
        .duration(dd*a)
        .attr("rotate" , function(d){
            return (d[0]/(2*Math.acos(-1))*360)
        } )
        .attr("dx" , function(d){
            return d[1]*Math.cos(d[0])
        })
        .attr("dy" , function(d){
            return d[1]*Math.sin(d[0])}
        );
}

//将全部的文本旋转一定的角度
function rotate_text_with ( a ,dd ){
    for ( var i = 0 ; i < text_angle.length ; i++ )
        text_angle[i][0] += a;
    rotate_text.selectAll("text")
                .data( text_angle )
                .transition()
                .ease("liner")
                .duration(dd*a)
                .attr("rotate" , function(d){
                    return (d[0]/(2*Math.acos(-1))*360)
                } )
                .attr("dx" , function(d){
                    return d[1]*Math.cos(d[0])
                })
                .attr("dy" , function(d){
                    return d[1]*Math.sin(d[0])}
                );
}

function rotate_text_by ( group , dataset , a , dd ){
    for ( var i = 0 ; i < dataset.length ; i++ )
        dataset[i][0] += a;
    group.selectAll("text")
        .data( dataset )
        .transition()
        .ease("linear")
        .duration(dd*a)
        .attr("rotate" , function(d){
            return (d[0]/(2*Math.acos(-1))*360)
        } )
        .attr("dx" , function(d){
            return d[1]*Math.cos(d[0])
        })
        .attr("dy" , function(d){
            return d[1]*Math.sin(d[0])}
        );
}

function draw_char_def ( ch , x , y , angle , r ){
    text_angle.push ( [angle,r] );
    rotate_text.append("text")
        .attr("fill" ,"red")
        .attr("font-size","11px")
        .attr("font","serif")
        .attr("text-anchor","middle")
        .attr("rotate", ""+(angle/(2*Math.acos(-1))*360) )
        .attr("x" , x )
        .attr("y" , y )
        .attr("dx", r*Math.cos(angle))
        .attr("dy", r*Math.sin(angle))
        .text(ch);
}

function draw_text_def ( name , x , y , angle , r  ){
    var dd = 13;//每个字所占的空间
    var start = 0;
    var end = name.length-1;
    for ( var i = start ; i <= end ; i++ )
        draw_char_def ( name.substr(i,1) , x , y , angle , dd*i+r );
}

//获取svg图
var svg = d3.select("body").select("svg");

//存放旋转字的群
var rotate_text = svg.append("g")
                       .attr("class","rotate_text");

var text_angle = new Array();
