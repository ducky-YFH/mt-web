import 'baguettebox.js/dist/baguetteBox.min.css'
import baguetteBox from 'baguettebox.js';
import './index.less'

import { data } from '@/mock/shop.js'
$('.gallery').html(
  data.map(item => 
    `<div class="gallery-item">
      <a href="${item.url}" data-caption="${item.introduce}">
        <img src="${item.url}" alt="">
      </a>
      <p>${item.describe}</p>
    </div>`
  )
)
baguetteBox.run('.gallery');