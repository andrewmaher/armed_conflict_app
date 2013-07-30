<style>

path.link {
  fill: none;
  stroke: #666;
  stroke-width: 1.5px;
}

marker#opposing {
  fill: red;
}

path.link.opposing {
  stroke: red;
}

marker#supportive {
  fill: green;
}

path.link.supportive {
  stroke: green;
  stroke-dasharray: 0,2 1;
  opacity: 0.75;
}

marker#opposingdirected {
  fill: red;
}

path.link.opposingdirected {
  stroke: red;
  stroke-dasharray: 0,2 1;
  opacity: 0.35;
}


circle {
  fill: #ccc;
  stroke: #333;
  stroke-width: 1.5px;
}

text {
  font: 10px sans-serif;
  pointer-events: none;
}

text.shadow {
  stroke: #fff;
  stroke-width: 3px;
  stroke-opacity: .8;
}

</style>

<script type="text/javascript" src="http://mbostock.github.com/d3/d3.js?1.29.1"></script>
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
              .scaleExtent([0.2,5])
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
      
        var links = data.links;
      
        var nodes = {};

        // Compute the distinct nodes from the links.
        links.forEach(function(link) {
          link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
          link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
        });
      
        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([w, h])
            .linkDistance(function(x) { return x.distance; })
            .charge(-300)
            .on("tick", tick)
            .start();

        // Per-type markers, as they don't inherit styles.
        vis.append("svg:defs").selectAll("marker")
            .data(["supportive","opposingdirected"])
          .enter().append("svg:marker")
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
          .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        var path = vis.append("svg:g").selectAll("path")
            .data(force.links())
          .enter().append("svg:path")
            .attr("class", function(d) { return "link " + d.type; })
            .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

        var circle = vis.append("svg:g").selectAll("circle")
            .data(force.nodes())
          .enter().append("svg:circle")
            .attr("r", 6)
            .call(force.drag);

        var text = vis.append("svg:g").selectAll("g")
            .data(force.nodes())
          .enter().append("svg:g");

        // A copy of the text with a thick white stroke for legibility.
        text.append("svg:text")
            .attr("x", 8)
            .attr("y", ".31em")
            .attr("class", "shadow")
            .text(function(d) { return d.name; });

        text.append("svg:text")
            .attr("x", 8)
            .attr("y", ".31em")
            .text(function(d) { return d.name; });

        // Use elliptical arc path segments to doubly-encode directionality.
        function tick() {
          path.attr("d", function(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
          });

          circle.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          });

          text.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          });
        };
      };
      draw(data);
    }
  });
  Shiny.outputBindings.register(networkOutputBinding, 'trestletech.networkbinding');
  
</script>