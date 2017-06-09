Vue.component('count', {
  mixins: [mixinCount],
});
Vue.component('region', {
  mixins: [mixinRegion],
});
Vue.component('world', {
  mixins: [mixinWorld],
});

var app = new Vue({
  el: '#app',
  data: {
    circledDigits: ['⓪','①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩'],
    common: CommonData,
    raw: [],
    interaction: {
      type: 'multiple-choice',
      class: 'selected',
      options: [
        {
          name: 'country',
          translation: '國家'
        },
        {
          name: 'state',
          translation: '政權'
        },
        {
          name: 'nation',
          translation: '民族'
        },
        {
          name: 'place',
          translation: '地方'
        }
      ],
      selection: -1,
      done: false
    },
    counts: [
      {
        id: 'country',
        name: 'country',
        condition: function(str) {
          return /country/.test(str);
        }
      },
      {
        id: 'state',
        name: 'state',
        condition: function(str) {
          return /state/.test(str);
        }
      },
      {
        id: 'nation',
        name: 'nation',
        condition: function(str) {
          return /nation/.test(str);
        }
      },
      {
        id: 'place',
        name: 'place及其他',
        condition: function(str) {
          return /place|island|territor(y|ies)|democrac(y|ies)|government/.test(str);
        }
      },
    ],
    regions: [
      {
        id: 'europe',
        name: '歐洲'
      },
      {
        id: 'asia',
        name: '亞洲'
      },
      {
        id: 'nam',
        name: '北美洲'
      },
      {
        id: 'africa',
        name: '非洲'
      },
      {
        id: 'pacific',
        name: '太平洋區域'
      },
      {
        id: 'sam',
        name: '中美洲及南美洲'
      }
    ],
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
        job: '設計開發',
        people: ['游知澔'],
      },
    ],
    conclusion: {
      title: '結論：建國尚未成功',
      description: '在沃草，我們持續以各種方式，**努力降低理解複雜議題的門檻**。像《釋憲748號》這樣的資訊新聞需要許多人力整理資料、設計、製作，如果你喜歡沃草的內容，請別忘了[支持我們](https://watchout.tw/#support)！',
    },
    debug: false,
  },
  computed: {
    classes: function() {
      return [this.interaction.done ? 'interaction-done' : 'interaction-ongoing'];
    },
    interactionSelectedOption: function() {
      return this.interaction.selection > -1 ? this.interaction.options[this.interaction.selection].name : '　　';
    },
    interactionSelectedOptionTranslation: function() {
      return this.interaction.selection > -1 ? this.interaction.options[this.interaction.selection].translation : '　　';
    }
  },
  created: function() {
    Vue.http.get('./src/data.json').then(this.getSuccess, this.getError);
  },
  methods: {
    getSuccess: function(response) {
      this.raw = response.body;
    },
    getError: function(response) {
      console.error(response);
    },
    interactionSelectOption: function(event, selectionIndex) {
      if(!this.interaction.done) {
        this.interaction.selection = selectionIndex;
      }
    },
    interactionSubmit: function(event) {
      if(!this.interaction.done && this.interaction.selection > -1)
        this.interaction.done = true;
    },
    markdown: marked,
  },
});
