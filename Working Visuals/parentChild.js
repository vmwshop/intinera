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
//Set to an array: objects have a name parameter and if a node is connected to other nodes
//we put the parget to what it is connected to
var nodes = [
      { name: "Parent"},
      { name: "child1"},
      { name: "child2", target: [0]},
      { name: "child3", target: [0]},
      { name: "child4", target: [1]},
      { name: "child5", target: [0, 1, 2, 3]}
];

//take the information from the array and separate it so we ahvea  separete link
//object that d3 expects to see. they have source and target elements
var links = [];

for (var i = 0; i< nodes.length; i++) {
      if (nodes[i].target !== undefined) {
            for (var x = 0; x< nodes[i].target.length; x++ ) {
                  links.push({
                        source: nodes[i],
                        target: nodes[nodes[i].target[x]]
                  })
            }
      }
}

//sets the screen area
var myChart = d3.select('#chart')
		.append('svg')
		.attr('width', w)
		.attr('height', h)

//sets up force layout
var force = d3.layout.force()
	.nodes(nodes) //pass along the nodes above
	.links([]) //creating them dynamically so pass an empty array
	.gravity(0.3)
	.charge(-1000)
	.size([w, h]) //width and height of chart

//information about the links + draw them
var link = myChart.selectAll('line') 
	.data(links).enter().append('line') 
	.attr('stroke', palette.gray)

//draw the nodes
var node = myChart.selectAll('circle')
	.data(nodes).enter()
	.append('g')
	.call(force.drag); //calls the force elements

node.append('circle')
	.attr('cx', function(d) { return d.x; })
	.attr('cy', function(d) { return d.y; })
	.attr('r', circleWidth )
	.attr('fill', function(d, i) {
		if (i>0) { return palette.pink }
		else { return palette.blue }
	})

//svg text element. identifies i[0] as the parent, bigger, text element
node.append('text')
	.text(function(d) { return d.name})
	.attr('font-family', 'Roboto Slab')
	.attr('fill', function(d, i) {
		if (i>0) { return palette.mediumgray}
		else { return palette.yellowgreen}
	})
	.attr('x', function(d, i) {
		if (i>0) { return circleWidth + 4 }
		else { return circleWidth -15 }
	})
	.attr('y', function(d, i) {
		if (i>0) { return circleWidth }
		else { return 8 }
	})
	.attr('text-anchor', function(d, i) {
		if (i>0) { return 'beginning' }
		else { return 'end'}
	})
	.attr('font-size',  function(d, i) {
		if (i>0) { return '1em' }
		else { return '1.8em'}
	})

force.on('tick', function(e) {
	node.attr('transform', function(d, i) {
		return 'translate('+ d.x +', '+ d.y +')';
	})

	link //makes the linkes visible & animated. 
		.attr('x1', function(d) { return d.source.x })
		.attr('y1', function(d) { return d.source.y })
		.attr('x2', function(d) { return d.target.x })
		.attr('y2', function(d) { return d.target.y })
})


force.start();

