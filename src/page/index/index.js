import './index.less';
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.green.min.css";
import "owl.carousel";
import '@/common/dialog/index.js'

import "@/common/side-nav/index.less";
import "@/common/dialog/index.less";

// 声明
$('.dialog-body').html(`
  <h1>严正声明</h1>
  <p>“甜乐主益”为甜乐主益股份有限公司（以下简称“我司”），旗下的一个以经营新鲜冰淇淋·茶饮为主的全国饮品连锁品牌。且我司是“甜乐主益”等相关商标的专有权利人。
  近期，我司发现在互联网上出现了假冒“甜乐主益”品牌发布虚假招商信息、借机推销其他品牌等误导相关公众的微信公众号、微博账号、虚假网站等，严重损害了我司的合法权益。对此，我司特作出以下声明：
  1.任何与“甜乐主益”相似或在“甜乐主益”这四个字的基础上添加前后缀的假冒品牌或假借我司之名共同运营的其他品牌均与我司无关。
  2.甜乐主益唯一官方网站：www.tlzy.com及唯一招商加盟热线：400-0808-037。除此之外，我司未曾委托任何其他第三方快招网站、平台及公司对“甜乐主益”品牌进行招商宣传。
  希望广大消费者及加盟商客户提高警惕，理性判断各类消息，谨防上当受骗。对于仿冒者冒用甜乐主益的名义进行虚假招商、借机引流的行为，我司保留追究仿冒者相关法律责任的权利。
  特此声明！</p>
`)

// 轮播图
$("#slider").owlCarousel({
  items: 1, 
  loop:true, 
  autoplay: true, 
  autoPlaySpeed: 5000, 
  autoPlayTimeout: 5000,
  autoplayHoverPause: true
});

// 数据
import { hot } from '@/mock/index.js'
$('.index-card-row').html(
  hot.map(item => 
    `<div class="index-card-col" data-id=${item.id}>
      <div class="index-card-col-content">
        <img src="${item.url}" alt="">
        <div class="name">${item.name}</div>
        <p>
          ${item.introduce.substring(0, 20)}${item.introduce.length > 20 ? '...' : ''}
        </p>
      </div>
    </div>`
  )
)
$('.index-card-col').on('click', function() {
  $(location).attr('href', `/product/detail.html?id=${$(this).data('id')}`);
})