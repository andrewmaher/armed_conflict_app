<style>

.node {
  stroke: #fff;
  stroke-width: 1.5px;
}

.link {
  stroke: #999;
  stroke-opacity: .6;
}

text {
  font: 10px sans-serif;
  pointer-events: none;
}

</style>

<script src="http://d3js.org/d3.v2.js?2.9.1"></script>
<script src="http://d3js.org/d3.v2.js"></script>
<script type="text/javascript">var networkOutputBinding = new Shiny.OutputBinding();
  $.extend(networkOutputBinding, {
    find: function(scope) {
      return $(scope).find('.shiny-network-output');
    },
    renderValue: function(el, data) {

      var w = 800,
          h = 600,
          fill = d3.scale.category20();
      
      //remove the old graph
      var vis = d3.select(el).select("svg");      
      vis.remove();
      
      $(el).html("");
      
      var vis = d3.select(el)
        .append("svg:svg")
          .attr("width", w)
          .attr("height", h)
          .attr("pointer-events", "all")
        .append('svg:g')
          .call(d3.behavior.zoom()
              .scaleExtent([0.1,5])
              .on("zoom", redraw))
        .append('svg:g');

      vis.append('svg:rect')
          .attr('width', w/0.2*5)
          .attr('height', h/0.2*5)
          .attr('fill', 'white');

      function redraw() {
        vis.attr("transform",
            "translate(" + d3.event.translate + ")"
            + " scale(" + d3.event.scale + ")");
      }

      var draw = function(data) {
        //format nodes object
        var nodes = new Array();
        for (var i = 0; i < data.names.length; i++){
          nodes.push({"name": data.names[i]})
        }
        
        var force = d3.layout.force()
            .charge(-1000)
            .linkDistance(30)
            .nodes(nodes)
            .links(data.links)
            .size([w, h])
            .start();

        var link = vis.selectAll(".link")
            .data(force.links())
          .enter().append("svg:line")
            .attr("class", "link");

        var node = vis.selectAll("circle.node")
            .data(force.nodes())
          .enter().append("svg:circle")
            .attr("class", "node")
            .attr("r", 5)
            .call(force.drag);

        var text = vis.selectAll("g")
            .data(force.nodes())
              .enter().append("svg:g");
      
        text.append("svg:text")
            .attr("x", 9)
            .attr("y", ".31em")
            .text(function(d) { return d.name; });

        vis.style("opacity", 1e-6)
          .transition()
            .duration(1000)
            .style("opacity", 1);

        force.on("tick", function() {
          link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });
      
          text.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")";});
          node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")";});
        });
      };
      draw(data);
    }
  });
  Shiny.outputBindings.register(networkOutputBinding, 'trestletech.networkbinding');
  
</script>