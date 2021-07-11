import "./index.less";

$(".tabs > div").on("click", function () {
  const index = $(this).index();

  $(".tabs div").removeClass("tabs-active");
  $(this).addClass("tabs-active");
  
  $('.tabs-content').hide();
  $(`.tabs-${index}`).show();
});
