function appendMultiText(container, str, posX, posY, width, fontsize, fontfamily,rsize){
			
			if( arguments.length < 6){
				fontsize = 14;
			}		
			
			if( arguments.length < 7){
				fontfamily = "simsun, arial";
			}
			
			//获取分割后的字符�?
			var strs = splitByLine(str,width,fontsize);
			
			var mulText = container.append("text")
				.attr("x",posX)
				.attr("class","twspan")
				.attr("y",rsize*0.7-0.5*(fontsize*strs.length)+posY)
				.style("font-size",fontsize)
				.style("font-family",fontfamily);
				
			mulText.selectAll("tspan")
				.data(strs)
				.enter()
				.append("tspan")
				.attr("class","spans")
				.attr("x",mulText.attr("x"))
				.attr("dy","1em")
				.style("opacity", function() {return rsize > 70 ? 1 : 0; })
				.attr("rsize",rsize)
				.text(function(d){
					return d;
				});
				
			return mulText;
			
			function splitByLine(str,max,fontsize){
				var curLen = 0;
				var result = [];
				var start = 0, end = 0;
				for(var i=0;i<str.length;i++){
					var code = str.charCodeAt(i);
					var pixelLen = code > 255 ? fontsize : fontsize/2;
					curLen += pixelLen;
					if(curLen > max){
						end = i;
						result.push(str.substring(start,end));
						start = i;
						curLen = pixelLen;
					}
					if( i === str.length - 1 ){
						end = i;
						result.push(str.substring(start,end+1));
					}
				}
				return result;
			}
}