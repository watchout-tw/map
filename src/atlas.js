var mixinAtlas = {
  data: function() {
    return {
      el: {},
      size: {},
      util: {
        axes: {
          x: {},
          y: {},
        },
      },
      rows: []
    }
  },
  computed: {
  },
  created: function() {
    Vue.http.get('./src/data.json').then(this.getSuccess, this.getError);
  },
  methods: {
    getSuccess: function(response) {
      this.rows = response.body;
      this.init();
      this.draw();
      this.group();
    },
    getError: function(response) {
      console.error(response);
    },
    init: function() {
      this.size.w = 960;
      this.size.h = 480;
      this.size.r = 4;
      this.size.lineHeight = 1.2;

      this.el.container = d3.select(this.$el).select('.draw');
      this.util.axes.x.scale = d3.scaleLinear()
        .domain([-180, 180])
        .range([0, this.size.w]);
      this.util.axes.y.scale = d3.scaleLinear()
        .domain([-90, 90])
        .range([this.size.h, 0]);
    },
    draw: function() {
      var self = this;

      this.el.root = this.el.container.append('svg')
        .attr('viewBox', [0, 0, this.size.w, this.size.h].join(' '));

      this.el.quotes = this.el.root.selectAll('g.quote').data(this.rows);
      this.el.quotes.exit().remove();
      this.el.quotes.enter().append('g').merge(this.el.quotes)
        .attr('class', 'quote')
        .attr('transform', function(d) { return 'translate(' + [self.util.axes.x.scale(d.lng), self.util.axes.y.scale(d.lat)].join(',') + ')'; })
        .each(function(d, i, array) {
          var width = 160;
          var el = d3.select(this);
          var x = self.util.axes.x.scale(d.lng);
          var y = self.util.axes.y.scale(d.lat);

          var terms = d.what.split(/,\s*/).reverse();
          var offset = 0;
          terms.forEach(function(term, i) {
            // text wrap: https://bl.ocks.org/mbostock/7555321
            var text = el.append('text')
              .attr('x', 0)
              .attr('dy', offset*self.size.lineHeight + 'em')
            var words = term.split(/\s+/);
            var lineCount = 1;
            var line = [];
            var tspan = text.append('tspan')
              .attr('x', 0)
              .attr('y', 0);
            while(words.length > 0) {
              var word = words.shift();
              line.push(word);
              tspan.text(line.join(' '));
              if(tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(' '));
                line = [word];
                tspan = text.append('tspan')
                  .attr('x', 0)
                  .attr('y', 0)
                  .attr('dy', lineCount*self.size.lineHeight + 'em')
                  .text(word);
                lineCount++;
              }
            }
            offset += lineCount;
          })

          var box = this.getBBox(); // getBoundingClientRect() perhaps?
          el.insert('rect', ':first-child')
            .attr('x', -box.width/2)
            .attr('y', '-1em')
            .attr('width', box.width)
            .attr('height', box.height)
            .attr('fill', 'yellow')
            .attr('opacity', 0.25)
        })
    },
    group: function() {
      var adjacency = [];
      var rectangles = this.el.root.selectAll('g.quote').nodes();
      for(var i = 0; i < rectangles.length; i++) {
        var nodes = [];
        var r1 = rectangles[i].getBoundingClientRect();
        for(var j = 0; j < rectangles.length; j++) {
          if(i != j) {
            var r2 = rectangles[j].getBoundingClientRect();
            if(areIntersecting(r1, r2)) {
              nodes.push(j);
            }
          }
        }
        adjacency.push(nodes);
      }

      var groups = [];
      var visited = {};
      for(var i = 0; i < adjacency.length; i++) {
        if(adjacency.hasOwnProperty(i) && !visited[i]) {
          var group = bfs(i, adjacency, visited);
          group.sort(function(a, b) { return a - b; });
          groups.push(group);
        }
      }
      console.log(groups);
    },
    markdown: marked,
  },
  template: `
  <div class="atlas atlas-world">
    <div class="draw"></div>
  </div>
  `,
}

function areIntersecting(a, b) {
  return (
    a.left <= b.right &&
    b.left <= a.right &&
    a.top <= b.bottom &&
    b.top <= a.bottom
  )
}
Array.prototype.union = function(other) {
  return [...new Set([...this, ...other])];
}
// https://stackoverflow.com/questions/21900713/finding-all-connected-components-of-an-undirected-graph
var bfs = function(v, adjacency, visited) {
  var q = [];
  var current_group = [];
  var i, len, adjV, nextVertex;
  q.push(v);
  visited[v] = true;
  while(q.length > 0) {
    v = q.shift();
    current_group.push(v);
    // Go through adjacency list of vertex v, and push any unvisite vertex onto the queue.
    // This is more efficient than our earlier approach of going through an edge list.
    adjV = adjacency[v];
    for(i = 0, len = adjV.length; i < len; i += 1) {
      nextVertex = adjV[i];
      if(!visited[nextVertex]) {
        q.push(nextVertex);
        visited[nextVertex] = true;
      }
    }
  }
  return current_group;
};
