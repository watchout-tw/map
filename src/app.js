var app = new Vue({
  el: '#app',
  methods: {
    markdown: marked,
  },
  data: {
    common: CommonData,
    title: '啊不是很有國際觀',
    description: '世界如何看台灣？',
    pages: [
      {
        id: '748',
        title: '釋字748號',
      }
    ]
  }
})
