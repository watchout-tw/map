var mixinAtlas = {
  data: function() {
    return {
      el: {},
      size: {},
      util: {
        axes: { x: {}, y: {} }
      },
      rows: [],
    }
  },
  props: ['debug'],
  computed: {
  },
  watch: {
    debug: function(now) {
      this.el.root.classed('debug', now);
    }
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
      this.spread();
    },
    getError: function(response) {
      console.error(response);
    },
    init: function() {
      this.size.w = 960;
      this.size.h = 640;
      this.size.r = 4;
      this.size.lineHeight = 1.25;

      this.el.container = d3.select(this.$el).select('.draw');
      this.util.axes.x.scale = d3.scaleLinear()
        .domain([-180, 180])
        .range([0, this.size.w]);
      this.util.axes.y.scale = d3.scaleLinear()
        .domain([-90, 90])
        .range([this.size.h, 0]);

      var self = this;
      this.rows = this.rows.map(function(row) {
        return Object.assign(row, {
          x: self.util.axes.x.scale(row.lng),
          y: self.util.axes.y.scale(row.lat)
        })
      });

      this.el.root = this.el.container.append('svg')
        .classed('debug', this.debug)
        .attr('viewBox', [0, 0, this.size.w, this.size.h].join(' '));
    },
    draw: function() {
      // draw quotes
      var quotes = this.el.root.selectAll('g.quote').data(this.rows);
      quotes.exit().remove();
      quotes.enter().append('g').merge(quotes)
        .attr('class', 'quote')
        .makeLabel({
          maxWidth: 160,
          lineHeight: this.size.lineHeight
        })
        .saveSize()
        .centerCenter()

      // draw center point of quotes
      var circles = this.el.root.selectAll('circle.center').data(this.rows);
      circles.exit().remove();
      circles.enter().append('circle').merge(circles)
        .attr('class', 'center')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 2)
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
    },
    spread: function() {
      var self = this;
      var simulation = d3.forceSimulation();
      simulation.force('collide', d3.forceCollide()
        .radius(function(d) {
          return (d.width + d.height)/3
        })
      );
      simulation.force('center', d3.forceCenter()
        .x(this.size.w/2)
        .y(this.size.h/2)
      );
      simulation.nodes(this.rows);
      simulation.on('tick', function() {
        self.el.root.selectAll('g.quote').centerCenter();
        self.el.root.selectAll('circle.center')
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
      })
    },
    markdown: marked,
  },
  template: `
  <div class="atlas atlas-world">
    <div class="draw"></div>
  </div>
  `,
}

Array.prototype.union = function(other) {
  return [...new Set([...this, ...other])];
}
function areIntersecting(a, b) {
  return (
    a.left <= b.right &&
    b.left <= a.right &&
    a.top <= b.bottom &&
    b.top <= a.bottom
  )
}
// https://stackoverflow.com/questions/21900713/finding-all-connected-components-of-an-undirected-graph
function bfs(v, adjacency, visited) {
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
}
d3.selection.prototype.centerCenter = function() {
  this.each(function(d) {
    var box = this.getBBox();
    var top = d.y - box.height/2;
    var left = d.x - box.width/2;
    d3.select(this)
      .attr('transform', 'translate(' + [left, top].join(',') + ')');
  });
  return this;
}
d3.selection.prototype.makeLabel = function(options) {
  this.each(function(d) {
    var el = d3.select(this);
    var terms = d.what.split(/,\s*/).reverse();
    var offset = 1; // put first line of text right below anchor point
    terms.forEach(function(term) {
      // text wrap: https://bl.ocks.org/mbostock/7555321
      var text = el.append('text')
        .attr('x', 0)
        .attr('y', offset*options.lineHeight + 'em')
      var words = term.split(/\s+/);
      var lineCount = 1;
      var line = [];
      var tspan = text.append('tspan')
        .attr('x', 0)
        .attr('dy', 0);
      while(words.length > 0) {
        var word = words.shift();
        line.push(word);
        tspan.text(line.join(' '));
        if(tspan.node().getComputedTextLength() > options.maxWidth) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text.append('tspan')
            .attr('x', 0)
            .attr('dy', options.lineHeight + 'em')
            .text(word);
          lineCount++;
        }
      }
      offset += lineCount;
    })

    var box = el.node().getBBox(); // getBoundingClientRect() perhaps?
    el.insert('rect', ':first-child')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', box.width)
      .attr('height', box.height)
  })
  return this;
};
d3.selection.prototype.saveSize = function() {
  this.each(function(d) {
    var box = this.getBBox();
    d.width = box.width;
    d.height = box.height;
  });
  return this;
}
