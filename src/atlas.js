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
    },
    getError: function(response) {
      console.error(response);
    },
    init: function() {
      this.size.w = 960;
      this.size.h = 480;
      this.size.r = 4;

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
        .each(function(d) {
          var width = 160;
          var el = d3.select(this);
          var x = self.util.axes.x.scale(d.lng);
          var y = self.util.axes.y.scale(d.lat);

          var terms = d.what.split(/,\s*/).reverse();
          var offset = 0;
          var lineHeight = 1.2;
          terms.forEach(function(term, i) {
            // text wrap: https://bl.ocks.org/mbostock/7555321
            var text = el.append('text')
              .attr('x', 0)
              .attr('y', offset*lineHeight + 'em')
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
                  .attr('dy', lineCount*lineHeight + 'em')
                  .text(word);
                lineCount++;
              }
            }
            offset += lineCount;
          })
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
