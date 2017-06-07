var mixinRegion = {
  data: function() {
    return {
      el: {},
      size: {},
      rows: [],
      score: 0,
    }
  },
  props: ['raw', 'region', 'debug'],
  watch: {
    size: function(now) {
      console.log(this.size, now);
    },
    raw: function(now) {
      var self = this;
      this.rows = this.raw.filter(function(row) {
        return row.region == self.region.id;
      });
      this.draw();
    },
    debug: function(now) {
      this.el.container.classed('debug', now);
    }
  },
  mounted: function() {
    this.size.w = 320;
    this.size.h = 320;
    this.size.lineHeight = 1.25;

    this.el.container = d3.select(this.$el).select('.draw');
    this.el.root = this.el.container.append('svg')
      .classed('debug', this.debug)
      .attr('viewBox', [0, 0, this.size.w, this.size.h].join(' '));
  },
  methods: {
    draw: function() {
      var quotes = this.el.root.selectAll('g.quote').data(this.rows);
      quotes.exit().remove();
      quotes.enter().append('g').merge(quotes)
        .attr('class', 'quote')
        .makeLabel({
          maxWidth: 8,
          padding: {
            x: 0.5,
            y: 0.25,
          },
          lineHeight: this.size.lineHeight,
        })
        .tightlyPack({
          max: {
            x: this.size.w - 16,
            y: this.size
          },
          margin: {
            x: 4,
            y: 4,
          }
        });

      this.score = (this.rows.length > 0 ?
        Math.round(this.el.root.selectAll('g.quote.yes').size() / this.rows.length * 100) :
        0
      );
    },
  },
  template: `
  <div class="region">
    <div class="name">{{ region.name }}</div>
    <div class="score"><span class="value">{{ score }}</span><span class="unit">%</span></div>
    <div class="draw"></div>
  </div>
  `
};

d3.selection.prototype.tightlyPack = function(options) {
  var nodes = this.nodes();
  var maxY = 0;
  var next = {
    x: 0,
    y: 0,
  }
  nodes.sort(function(a, b) {
    return a.getBBox().height - b.getBBox().height;
  })
  nodes.forEach(function(node) {
    var box = node.getBBox();
    var el = d3.select(node);
    if(next.x + box.width > options.max.x) {
      next.x = 0;
      next.y += maxY + options.margin.y;
    }
    el.attr('transform', 'translate(' + [next.x, next.y].join(',') + ')');
    next.x += box.width + options.margin.x;
    maxY = Math.max(maxY, box.height);
  })
  return this;
}
