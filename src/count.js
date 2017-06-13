var mixinCount = {
  data: function() {
    return {
      el: {},
      size: {},
      total: 0,
      rows: [],
    }
  },
  props: ['raw', 'count', 'debug'],
  computed: {
    score: function() {
      return Math.round(this.rows.length / this.total * 100);
    }
  },
  watch: {
    raw: function(now) {
      var self = this;
      this.total = now.length;
      this.rows = now.filter(function(row) {
        return self.count.condition(row.what + row.what_in_english);
      })
    }
  },
  template: `
  <div class="count">
    <div class="score"><span class="value">{{ score }}</span><span class="unit">%</span></div>
    <div class="fraction">{{ this.total }}篇裡有{{ this.rows.length }}篇</div>
    <div class="name">稱台灣為{{ count.name }}</div>
  </div>
  `
};
