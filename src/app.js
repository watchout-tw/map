var app = new Vue({
  el: '#app',
  methods: {
    markdown: marked,
  },
  data: {
    common: CommonData,
    title: '啊不是很有國際觀',
    description: '世界各地的人，說著不同的語言，讀著不同的報導，過著不同的生活。我們對他們了解多少？他們又是如何認識、看待台灣的？',
    pages: [
      {
        id: '748',
        title: '同志結婚會滅國？醒醒吧，你沒有____',
      }
    ]
  }
})
