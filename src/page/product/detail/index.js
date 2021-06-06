import './index.less'

const data = [
  { id: 1, url: require('@/assets/img/tea1.jpg'), name: '蜜桃麻薯乌龙', introduce: '蜜桃味的乌龙茶你喝过吗？水蜜桃的香甜融合乌龙茶汤的醇厚，以口感丰富的手作牛奶麻薯打底，甜蜜就在此刻。' },
  { id: 2, url: require('@/assets/img/tea2.jpg'), name: '宝藏旺仔牛奶茶', introduce: '原香红茶的醇厚，注入香浓清甜的旺仔牛奶，Q弹的五彩小芋圆打底，再加上甜甜的奶油堆顶，撒上脆脆的燕麦坚果...' },
  { id: 3, url: require('@/assets/img/tea3.jpg'), name: '小萄气', introduce: '一颗颗完整的多汁葡萄果肉，茶香四溢的乌龙茶汤注入醇醇奶香，满满黑砖堆顶，给你丰富的味蕾感受。' },
  { id: 4, url: require('@/assets/img/tea3.jpg'), name: '荔枝桂花酿', introduce: '清甜多汁的荔枝果肉，软糯、Q弹的五彩小芋圆，浓浓的桂花香，注入香醇可口的酒酿，每一口都会唇齿留香...' },
  { id: 5, url: require('@/assets/img/tea3.jpg'), name: '桂花酒酿奶茶', introduce: '香醇的酒酿味道，五彩缤纷的小芋圆，还有香气馥郁的桂花，再注入四季春茶和牛奶，冬日里的迷人小可爱非它莫属啦~' },
]

class Detail {
  constructor() {
    this.id = $.utils.getUrlArg('id');
    this.current = data.find(item => item.id == this.id);
  }
  render() {
    $('.detail-container-title').text(this.current.name);
    $('.detail-container-content .center img').attr('src', this.current.url);
    $('.detail-container-content .center p').text(this.current.introduce);  
  }
  control() {
    $('.btn').bind('click', e => {
      const currentIndex = data.findIndex(item => item.id == this.current.id);
      const btnName = $(e.currentTarget).text();
      
      btnName == '上一组' && (this.current = currentIndex === 0 ? data[data.length - 1] : data[currentIndex - 1]);
      btnName == '下一组' && (this.current = currentIndex === data.length - 1 ? data[0] : data[currentIndex + 1]);
      
      this.render();
    })
  }
  init() {
    this.render();
    this.control();
  }
}

new Detail().init();