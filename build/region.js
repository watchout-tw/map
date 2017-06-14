var mixinRegion = {
  data: function () {
    return {
      el: {},
      size: {
        w: 320,
        h: 320,
        lineHeight: 1.25
      },
      rows: [],
      score: 0
    };
  },
  props: ['raw', 'region', 'debug'],
  computed: {
    viewBox: function () {
      return [0, 0, this.size.w, this.size.h].join(' ');
    }
  },
  watch: {
    raw: function (now) {
      var self = this;
      this.rows = this.raw.filter(function (row) {
        return row.region == self.region.name;
      });
      this.draw();
    }
  },
  mounted: function () {
    this.el.container = d3.select(this.$el).select('.draw');
    this.el.root = this.el.container.select('svg');
  },
  methods: {
    draw: function () {
      var quotes = this.el.root.selectAll('g.quote').data(this.rows);
      quotes.exit().remove();
      quotes.enter().append('g').merge(quotes).attr('class', 'quote').makeLabel({
        maxWidth: 8,
        padding: {
          x: 0.5,
          y: 0.25
        },
        lineHeight: this.size.lineHeight
      }).tightlyPack({
        max: {
          x: this.size.w - 16,
          y: this.size
        },
        margin: {
          x: 4,
          y: 4
        }
      });

      this.score = this.rows.length > 0 ? Math.round(this.el.root.selectAll('g.quote.yes').size() / this.rows.length * 100) : 0;

      var height = 0;
      this.el.root.selectAll('g.quote').each(function (d) {
        var box = this.getBBox();
        var translate = /translate\(([\d.]+)\,([\d.]+)\)/.exec(this.getAttribute('transform'));
        var y = parseFloat(translate[2]);
        height = Math.max(height, Math.ceil(y + box.height));
      });
      this.size.h = height;
    }
  },
  template: '<div class="region"><div class="name">{{ region.translation }}</div><div class="score"><span class="value">{{ score }}</span><span class="unit">%</span></div><div class="draw" :class="{ debug: debug }"><svg :viewBox="viewBox"></svg></div></div>'
};

d3.selection.prototype.tightlyPack = function (options) {
  var nodes = this.nodes();
  var maxY = 0;
  var next = {
    x: 0,
    y: 0
  };
  nodes.sort(function (a, b) {
    return a.getBBox().height - b.getBBox().height;
  });
  nodes.forEach(function (node) {
    var box = node.getBBox();
    var el = d3.select(node);
    if (next.x + box.width > options.max.x) {
      next.x = 0;
      next.y += maxY + options.margin.y;
    }
    el.attr('transform', 'translate(' + [next.x, next.y].join(',') + ')');
    next.x += box.width + options.margin.x;
    maxY = Math.max(maxY, box.height);
  });
  return this;
};
