import './index.less';
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.green.min.css";
import "owl.carousel";


$(function () {
  $("#slider").owlCarousel({
    items: 1,
    autoPlay: true,
    loop:true,
    paginationNumbers: true,
  });
});
