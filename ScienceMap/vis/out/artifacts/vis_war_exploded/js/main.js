/**
 * Created by llin on 2015/12/28.
 */
function rotate() {
    rotate_background(0.01,3000);
}
var cx = 550;
var cy = 550 ;
var r = 350;
var size;
d3.json("../data/names.json" , function(error,names){
    draw_background(names,cx,cy,r);
    size = names.length;
    var angle = 2*Math.acos(-1)/size;
    d3.json("../data/tmm.json", function (error, data) {
        var out = new Array();
        for (var i = 0; i < size; i++)
            out.push(49);
        for (var i = 0; i < data.length; i++) {
            var key = data[i]["keyword"];
            var value = data[i]["value"];
            var x = names.indexOf(key);
            if ( x == -1 ) continue;
            out[x] = value / 185 * 100;
            if (out[x] > 48)
                out[x] = 48;
            out[x] = 50 - out[x];
        }
        draw_tmm("#87CEFA", out, cx, cy, r, "7px");
    });
    d3.json("../data/tvcg.json", function (error, data) {
        var out = new Array();
        for (var i = 0; i < size; i++)
            out.push(49);
        for (var i = 0; i < data.length; i++) {
            var key = data[i]["keyword"];
            var value = data[i]["value"];
            var x = names.indexOf(key);
            if ( x == -1 ) continue;
            out[x] = value / 161 * 100;
            if (out[x] > 48)
                out[x] = 48;
            out[x] = 50 - out[x];
        }
        function draw0 ()
        {
            draw_tvcg("#CDCD00", out, cx, cy, r, "12px");
        }
        setTimeout ( draw0 , 500 );
    });

    d3.json("../data/tkde.json", function (error, data) {
        //console.log("TKDE : " + data.length);
        var out = new Array();
        for (var i = 0; i < size; i++)
            out.push(49);
        for (var i = 0; i < data.length; i++) {
            var key = data[i]["keyword"];
            var value = data[i]["value"];
            var x = names.indexOf(key);
            if ( x == -1 ) continue;
            out[x] = value / 139 * 100;
            if (out[x] > 48)
                out[x] = 48;
            out[x] = 50 - out[x];//所有图聚合时逆向
        }
        function draw1()
        {
            draw_tkde("#8B1A1A", out, cx, cy, r, "3px"  );
        }
        setTimeout( draw1 , 1000 );
    });
    function rotate ()
    {
        rotate_background(angle,3000);
        rotate_brokens(angle,3000);
    }
    //setInterval( rotate , 2000 );
});