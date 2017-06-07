var mixinCount = {
  data: function() {
    return {
      el: {},
      size: {},
      rows: [],
    }
  },
  props: ['raw', 'count', 'debug'],
  computed: {
    score: function() {
      return this.rows.length;
    }
  },
  watch: {
    raw: function(now) {
      var self = this;
      this.rows = now.filter(function(row) {
        return self.count.condition(row.what + row.what_in_english);
      })
    }
  },
  template: `
  <div class="count">
    <div class="score">{{ score }}</div>
    <div class="name">{{ count.name }}</div>
  </div>
  `
};
