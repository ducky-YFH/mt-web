import './index.less'

import { data } from '@/mock/product.js'
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