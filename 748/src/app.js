var app = new Vue({
  el: '#app',
  methods: {
    getSuccess: function(response) {
      var rows = response.body;
      console.log(rows);
    },
    getError: function(response) {
      console.error(response);
    },
    markdown: marked,
  },
  created: function() {
    Vue.http.get('./src/data.json').then(this.getSuccess, this.getError);
  },
  data: {
    common: CommonData,
    header: {
      title: '釋字748號',
      description: '',
    },
    authorship: [
      {
        job: '資料分析',
        people: ['洪國鈞', '游知澔'],
      },
      {
        job: '編輯',
        people: ['洪國鈞'],
      },
      {
        job: '設計開發',
        people: ['游知澔'],
      },
    ],
    conclusion: {
      title: '結論：建國尚未成功',
      description: '在沃草，我們持續以各種方式，**努力降低理解複雜議題的門檻**。像《釋憲748號》這樣的資訊新聞需要許多人力整理資料、設計、製作，如果你喜歡沃草的內容，請別忘了[支持我們](https://watchout.tw/#support)！',
    },
  },
});
