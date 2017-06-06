var mixinRegion = {
  data: function() {
    return {
      rows: []
    }
  },
  props: ['raw', 'region', 'debug'],
  watch: {
    raw: function(now) {
      var self = this;
      this.rows = this.raw.filter(function(row) {
        return row.region == self.region.id;
      }).map(function(row) {
        return row;
      })
    }
  },
  mounted: function() {
  },
  methods: {
    draw: function() {

    },
  },
  template: `
  <div class="region">
    <div class="name">{{ region.name }}</div>
  </div>
  `
};
