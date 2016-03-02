/**
 * Created by llin on 2015/12/27.
 */
function draw_background ( vertex , cx , cy , r )
{
    var size = vertex.length;//用来构造背景的项目的规模
    var segment = 5;//每个旋转虚线分多少段
    var PI = Math.acos(-1);
    var angle = 2.0*PI/size;
    for ( var i = 0 ; i < vertex.length ; i++ ) {
        add_rotate_dash(cx, cy, r, angle * i);
        var index1 = i;
        var index2 = (i+1)%vertex.length;
        add_connect_dash ( index1 , index2 );
        draw_text_def ( vertex[i] , cx , cy , angle*i , r+10 );
    }
    draw_net();
}

function rotate_background ( a,dd )
{
    rotate_net(a,dd );
    rotate_text_with(a,dd );
}