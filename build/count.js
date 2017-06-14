var mixinCount = {
  data: function () {
    return {
      el: {},
      size: {},
      total: 0,
      rows: []
    };
  },
  props: ['raw', 'count', 'debug'],
  computed: {
    score: function () {
      return Math.round(this.rows.length / this.total * 100);
    }
  },
  watch: {
    raw: function (now) {
      var self = this;
      this.total = now.length;
      this.rows = now.filter(function (row) {
        return self.count.condition(row.what + row.what_in_english);
      });
    }
  },
  template: '<div class="count"><div class="score"><span class="value">{{ score }}</span><span class="unit">%</span></div><div class="fraction">{{ this.total }}\u7BC7\u88E1\u6709{{ this.rows.length }}\u7BC7</div><div class="name">\u7A31\u53F0\u7063\u70BA{{ count.name }}</div></div>'
};
