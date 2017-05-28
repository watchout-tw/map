var mixinAtlas = {
  data: function() {
    return {
      el: {},
      size: {},
      util: {},
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
    },
    getError: function(response) {
      console.error(response);
    },
    draw: function() {

    },
    markdown: marked,
  },
  template: `
  <div class="atlas atlas-world">
    <div v-for="row in rows">{{ row.what }} {{ row.lat }} {{ row.lng }}</div>
  </div>
  `,
}
