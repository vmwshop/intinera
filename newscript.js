var   w = 600,
      h = 600;

var circleWidth = 5;

var palette = {
      "lightgray": "#819090",
      "gray": "#708284",
      "mediumgray": "#536870",
      "darkgray": "#475B62",

      "darkblue": "#0A2933",
      "darkerblue": "#042029",

      "paleryellow": "#FCF4DC",
      "paleyellow": "#EAE3CB",
      "yellow": "#A57706",
      "orange": "#BD3613",
      "red": "#D11C24",
      "pink": "#C61C6F",
      "purple": "#595AB7",
      "blue": "#2176C7",
      "green": "#259286",
      "yellowgreen": "#738A05"
}
var nodes2 = [];

d3.csv("GravesSmall.csv", function(data) {
  data.forEach(function(d){
  	nodes2.push({
  		name: d.artist,
  		target: d.target,
  		house: d.artworkTitle,
  		index: d.index
  	})
  });//end forEach
console.log(nodes2)

var links2 = [];

for (var i = 0; i < nodes2.length; i++) {
	if(nodes2[i].target !== undefined){
          links2.push({
                source: nodes2[i],
                target: nodes2[nodes2[i].target]
          })
            
      }
}


var myChart = d3.select('#chart')
		.append('svg')
		.attr('width', 600)
		.attr('height', 600)

//sets up force layout
var force = d3.layout.force()
	.nodes(nodes2) //pass along the nodes above
	.links([]) //creating them dynamically so pass an empty array
	force.linkDistance(function(link){
		return link.target * 5000;
	})
	.gravity(0.3)
	.charge(-300)
	.size([w, h]) //width and height of chart

//information about the links + draw them

var link = myChart.selectAll('line') 
	.data(links2).enter().append('line') 
	.attr('stroke', palette.pink)

var node = myChart.selectAll('circle')
	.data(nodes2).enter()
	.append('g')
	.call(force.drag) //calls the force elements
	.on('mouseover', function(d){
		d3.select(this).select('text')
		.transition().duration(1000)
		.text(function(d){
			return d.house;
		})
	})
	.on('mouseout', function(d){
		d3.select(this).select('text')
		.transition().duration(1000)
		.text(function(d){
			return d.name;
		})
	})


node.append('circle')
	.attr('cx', function(d) { return d.x; })
	.attr('cy', function(d) { return d.y; })
	.attr('r', circleWidth )
	.attr('fill', function(d) {
		if (d.target==0) { 
			return palette.purple } 
		else if (d.target==1) { 
			return palette.red}
		else if (d.target==2) { 
			return palette.green}
		else if (d.target==3) { 
			return palette.yellow}
		else if (d.target==4) { 
			return palette.orange}
		else if (d.target==5) { 
			return palette.pink}
		else if (d.target==6) { 
			return palette.lightgray} 
		else { return palette.blue}
	})

var padding = 1, // separation between circles
    radius=8;
function collide(alpha) {
  var quadtree = d3.geom.quadtree(graph.nodes);
  return function(d) {
    var rb = 2*radius + padding,
        nx1 = d.x - rb,
        nx2 = d.x + rb,
        ny1 = d.y - rb,
        ny2 = d.y + rb;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y);
          if (l < rb) {
          l = (l - rb) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}


//svg text element. identifies i[0] as the parent, bigger, text element
node.append('text')
	.text(function(d) { return d.name})
	.attr('font-family', 'sans-serif')
	.attr('fill', function(d) {
		if(d.index > 0){
			return palette.yellow
		}
		else{
			return palette.lightgray
		}
	})
	.attr('font-size', function(d) {
		if(d.index > 0){
			return '15px'
		}
		else{
			return '10px'
		}
	})
	

force.on('tick', function(e) {

	node.attr('transform', function(d, i) {
		return 'translate('+ d.x +', '+ d.y +')';
		node.each(collide(0.5))
	})
	//Added 

	link //makes the linkes visible & animated. 
		.attr('x1', function(d) { return d.source.x })
		.attr('y1', function(d) { return d.source.y })
		.attr('x2', function(d) { return d.target.x })
		.attr('y2', function(d) { return d.target.y })


})
force.start();
});