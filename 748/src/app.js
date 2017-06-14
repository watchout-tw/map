function unique(a) {
  var seen = {};
  var out = [];
  var len = a.length;
  var j = 0;
  for(var i = 0; i < len; i++) {
    var item = a[i];
    if(seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }
  return out;
}
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
    date: '2017-06-14 20:00:00',
    interaction: {
      type: 'multiple-choice',
      class: 'selected',
      options: [
        {
          name: 'country'
        },
        {
          name: 'nation'
        },
        {
          name: 'state'
        },
        {
          name: 'place'
        }
      ],
      selection: -1,
      done: false
    },
    tally: {
      country: {
        id: 'country',
        name: 'country',
        condition: function(str) {
          return /country/.test(str);
        }
      },
      state: {
        id: 'state',
        name: 'state',
        condition: function(str) {
          return /state/.test(str);
        }
      },
      nation: {
        id: 'nation',
        name: 'nation',
        condition: function(str) {
          return /nation/.test(str);
        }
      },
      place: {
        id: 'place',
        name: 'place或其他',
        condition: function(str) {
          return /place|island|territor(y|ies)|democrac(y|ies)|government/.test(str);
        }
      },
    },
    regions: {
      europe: {
        name: 'europe',
        translation: '歐洲'
      },
      asia: {
        name: 'asia',
        translation: '亞洲'
      },
      nam: {
        name: 'nam',
        translation: '北美洲'
      },
      africa: {
        name: 'africa',
        translation: '非洲'
      },
      pacific: {
        name: 'pacific',
        translation: '太平洋區域'
      },
      sam: {
        name: 'sam',
        translation: '中美洲及南美洲'
      }
    },
    header: {
      title: '滅國也同志，建國也同志',
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
    question: {
      introduction: '5月24日，大法官釋字第748號解釋出爐，世界各地媒體陸續報導「同性婚姻合法化，台灣將是亞洲第一」。有趣的是，或許是各界對台灣是否為「國家」看法不一，也可能是中國的「善意提醒」，各家媒體對台灣的稱呼並不一致。\n\n**如果你是紐約時報的編輯，這題克漏字，你怎麼選？**',
      go: '選完點這裡',
      conclusion: '一般而言，country、nation、state都會翻譯為國家，但它們背後的意涵其實略有差異：country強調地理、邊境，nation強調民族及文化認同，state則強調政府治理權力的可及範圍。至於place呢？嗯⋯就只是個「地方」。'
    },
    reminder: {
      description: '克漏字沒填好的話，看不到我們精心製作的其他內容喔 😢',
    },
    graphs: {
      tally: {
        title: '台灣：「國家」還是「地方」？',
        description: '世界各國媒體到底如何看台灣呢？在大法官做出保障同性婚姻的憲法解釋後，《沃草》蒐集了<span val="data-tally-total"></span>篇各國媒體的相關報導，發現大約有六成用<span class="country">國家代稱</span>來描述台灣，另外四成的報導則使用<span class="place">地理名詞</span>，或是其他不帶主權意義的<span class="place">中性名詞</span>。'
      },
      regions: {
        title: '世界六大區域怎麼稱呼台灣？',
        description: '按媒體總部所在城市，《沃草》將蒐集到的報導分為六個區域：歐洲、亞洲、非洲、北美洲、中南美洲五個大陸區域及太平洋區域。我們發現太平洋區域及歐洲媒體最願意用<span class="country">國家代稱</span>來描述台灣，而亞洲、北美洲的媒體則是有半數以<span class="place">地方</span>（place）、<span class="place">島嶼</span>（island）、<span class="place">政府</span>（government）、<span class="place">民主政體</span>（democracy）這種不帶主權的<span class="place">中性名詞</span>稱呼台灣。'
      },
      world: {
        title: '從世界看台灣意識、媒體識讀',
        description: '把這次釋憲相關的國際新聞鋪在世界地圖上，可以看出有些區域的覆蓋很密集，有些區域則完全沒有新聞覆蓋。從這張圖，除了可以看見世界如何看待台灣的國家定位，還可以看見「有哪些媒體關注台灣」以及「有哪些媒體關注LGBTQ議題」。'
      }
    },
    conclusion: {
      title: '結論：#醒醒吧你沒有國家',
      description: '從統計上來看，全世界有四成的媒體不願意用**國家**來稱呼台灣，除了所謂的「中國因素」，大家覺得還有什麼原因呢？\n\n有人說台灣現在的**國名**叫做**中華民國**，但是全世界僅有極少數媒體會用**Republic of China**來描述這塊你我共同生活的島嶼。我們又是如何稱呼自己的名字呢？同性婚姻要落實，還需要立法院修法，而修法完成後，台灣就會是亞洲第一個同婚合法的**國家**嗎？台灣是否能成為一個**正常國家**，還需要回答「我們該如何定位自己？」這個問題，由全體台灣人民共同自決。',
    },
    call_for_action: {
      title: '你看到的外媒報導沒出現嗎？',
      description: '由於人力、時間和語言能力的限制，我們目前只能蒐集到<span val="data-tally-total"></span>篇相關報導，你有看到其他的嗎？你可以[來這裡](https://goo.gl/forms/4yv5xHjB8cltdhn73)填寫你所看到的新聞資料，沃草會在確認內容後更新網頁內容，並且將你列為貢獻者之一。\n\n在沃草，我們持續以各種方式，**努力降低理解複雜議題的門檻**。像《<span val="data-title"></span>》這樣的資訊新聞需要許多人力整理資料、設計、製作，如果你喜歡沃草的內容，請別忘了[支持我們](https://watchout.tw/#support)！',
    },
    action: {
      title: '你看到的外媒報導沒出現嗎？',
      description: '由於人力、時間和語言能力的限制，沃草僅能搜集到XXX篇相關報導，你有看到其他的嗎？你可以**來這裡**填寫你所看到的新聞資料，沃草將會持續更新網頁內容。\n\n我們以各種方式，努力降低理解複雜議題的門檻。像《滅國也同志，建國也同志》這樣的資訊新聞需要許多人力整理資料、設計、製作，如果你喜歡沃草的內容，請別忘了支持我們！[支持我們](https://watchout.tw/#support)！',
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
    contributors: function() {
      return unique(this.raw.map(function(row) {
        return row.contributor;
      }));
    }
  },
  watch: {
    raw: function(rows) { // this is a hack
      var self = this;
      $('[val=data-tally-total]').html(rows.length);
      $('[val=data-tally-country]').html(rows.filter(function(row) {
        return self.$data.tally.country.condition(row.what + row.what_in_english);
      }).length)
    },
    'header.title': function() {
      this.updateTitle();
    }
  },
  created: function() {
    Vue.http.get('./src/data.json').then(this.getSuccess, this.getError);
  },
  mounted: function() {
    this.updateTitle();
  },
  methods: {
    getSuccess: function(response) {
      this.raw = response.body;
    },
    getError: function(response) {
      console.error(response);
    },
    updateTitle: function() { // hack
      $('[val=data-title]').html(this.header.title);
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
