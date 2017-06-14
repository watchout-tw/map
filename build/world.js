var mixinWorld = {
  data: function () {
    return {
      el: {},
      size: {},
      util: {},
      rows: []
    };
  },
  props: ['raw', 'debug'],
  watch: {
    raw: function (now) {
      var self = this;
      this.rows = now.map(function (row) {
        var pos = self.util.projection([row.lng, row.lat]);
        return Object.assign(row, {
          x: pos[0],
          y: pos[1]
        });
      });
      if (this.rows.length > 0) {
        this.draw();
        this.group();
        this.spread();
      }
    },
    debug: function (now) {
      this.el.container.classed('debug', now);
    }
  },
  mounted: function () {
    this.size.w = 960;
    this.size.h = 500;
    this.size.r = 4;
    this.size.lineHeight = 1.25;

    this.util.offset = { x: 0, y: 64 };
    this.util.projection = d3.geoMercator().scale(this.size.w / (2 * Math.PI)).translate([this.size.w / 2, this.size.h / 2 + this.util.offset.y]);

    this.el.container = d3.select(this.$el).select('.draw').classed('debug', this.debug);
    this.el.root = this.el.container.append('svg').attr('viewBox', [0, 0, this.size.w, this.size.h].join(' '));
  },
  methods: {
    draw: function () {
      // draw quotes
      var quotes = this.el.root.selectAll('g.quote').data(this.rows);
      quotes.exit().remove();
      quotes.enter().append('g').merge(quotes).attr('class', 'quote').makeLabel({
        maxWidth: 8,
        padding: {
          x: 0.5,
          y: 0.25
        },
        lineHeight: this.size.lineHeight
      }).saveSize().centerCenter();

      // draw center point of quotes
      var circles = this.el.root.selectAll('circle.center').data(this.rows);
      circles.exit().remove();
      circles.enter().append('circle').merge(circles).attr('class', 'center').attr('cx', d => d.x).attr('cy', d => d.y).attr('r', 2);
    },
    group: function () {
      var adjacency = [];
      var rectangles = this.el.root.selectAll('g.quote').nodes();
      for (var i = 0; i < rectangles.length; i++) {
        var nodes = [];
        var r1 = rectangles[i].getBoundingClientRect();
        for (var j = 0; j < rectangles.length; j++) {
          if (i != j) {
            var r2 = rectangles[j].getBoundingClientRect();
            if (areIntersecting(r1, r2)) {
              nodes.push(j);
            }
          }
        }
        adjacency.push(nodes);
      }

      var groups = [];
      var visited = {};
      for (var i = 0; i < adjacency.length; i++) {
        if (adjacency.hasOwnProperty(i) && !visited[i]) {
          var group = bfs(i, adjacency, visited);
          group.sort(function (a, b) {
            return a - b;
          });
          groups.push(group);
        }
      }
    },
    spread: function () {
      var self = this;
      var simulation = d3.forceSimulation();
      simulation.force('collide', d3.forceCollide().radius(function (d) {
        return (d.width + d.height) * 0.125;
      }));
      simulation.nodes(this.rows);
      simulation.on('tick', function () {
        self.el.root.selectAll('g.quote').centerCenter();
        self.el.root.selectAll('circle.center').attr('cx', d => d.x).attr('cy', d => d.y);
      });
    },
    markdown: marked
  },
  template: '<div class="atlas atlas-world"><div class="draw"></div><figcaption><a class="a-text" href="https://s-media-cache-ak0.pinimg.com/originals/a4/dc/b3/a4dcb30b0ba3b5e26cc5b6788b98c625.jpg" target="_blank">Image Source</a></figcaption></div>'
};

Array.prototype.union = function (other) {
  return [...new Set([...this, ...other])];
};
function areIntersecting(a, b) {
  return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom;
}
// https://stackoverflow.com/questions/21900713/finding-all-connected-components-of-an-undirected-graph
function bfs(v, adjacency, visited) {
  var q = [];
  var current_group = [];
  var i, len, adjV, nextVertex;
  q.push(v);
  visited[v] = true;
  while (q.length > 0) {
    v = q.shift();
    current_group.push(v);
    // Go through adjacency list of vertex v, and push any unvisite vertex onto the queue.
    // This is more efficient than our earlier approach of going through an edge list.
    adjV = adjacency[v];
    for (i = 0, len = adjV.length; i < len; i += 1) {
      nextVertex = adjV[i];
      if (!visited[nextVertex]) {
        q.push(nextVertex);
        visited[nextVertex] = true;
      }
    }
  }
  return current_group;
}
d3.selection.prototype.centerCenter = function () {
  this.each(function (d) {
    var box = this.getBBox();
    var top = d.y - box.height / 2;
    var left = d.x - box.width / 2;
    d3.select(this).attr('transform', 'translate(' + [left, top].join(',') + ')');
  });
  return this;
};
d3.selection.prototype.makeLabel = function (options) {
  this.each(function (d) {
    var root = d3.select(this).classed('yes', /country|state|nation/.test(d.what + d.what_in_english));
    var el = root.append('a') // where all the content actually go
    .attr('xlink:href', d.link).attr('target', '_blank');

    var rem = parseInt(root.style('font-size'));

    var offset = {
      x: options.padding.x,
      y: options.padding.y + 1 / options.lineHeight - 0.1 // put first line of text right below anchor point
    };

    var terms = d.what.split(/,\s*/).reverse();
    terms.forEach(function (term, i) {
      // text wrap: https://bl.ocks.org/mbostock/7555321
      var text = el.append('text').attr('x', offset.x * rem).attr('y', offset.y * options.lineHeight * rem);
      var words = term.split(/\s+/);
      var lineCount = 1;
      var line = [];
      var tspan = text.append('tspan').attr('x', offset.x * rem).attr('dy', 0);
      while (words.length > 0) {
        var word = words.shift();
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > options.maxWidth * rem) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text.append('tspan').attr('x', offset.x * rem).attr('dy', options.lineHeight * rem).text(word);
          lineCount++;
        }
      }
      offset.y += lineCount;
      if (i < terms.length - 1) {
        el.append('text').attr('class', 'and').attr('x', offset.x * rem).attr('dy', offset.y * options.lineHeight * rem).text('還有');
      }
      offset.y += 1;
    });

    var box = el.node().getBBox(); // getBoundingClientRect() perhaps?
    el.insert('rect', ':first-child').attr('x', 0).attr('y', 0).attr('width', box.width + options.padding.x * rem * 2).attr('height', box.height + options.padding.y * rem * 2);
  });
  return this;
};
d3.selection.prototype.saveSize = function () {
  this.each(function (d) {
    var box = this.getBBox();
    d.width = box.width;
    d.height = box.height;
  });
  return this;
};
