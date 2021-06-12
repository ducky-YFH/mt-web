if (!sessionStorage.getItem('hideStatement')) {
  $('.dialog').show();
}

$('.dialog-btn').bind('click', () => {
  sessionStorage.setItem('hideStatement', true)
  $('.dialog').hide();
})