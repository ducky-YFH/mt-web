import './index.less'

import { data } from '@/mock/product'
$('.product-row').html(
  data.map(item => 
    `<div class="product-col">
      <img src="${item.url}" alt="">
      <div class="product-col-content">
        <h1>${item.name}</h1>
        <div class="icons">
          <a href="/product/detail.html?id=${item.id}" class="iconfont icon-lookup">
            <span class="look">查看</span>
          </a>
        </div>
      </div>
    </div>`
  )
);