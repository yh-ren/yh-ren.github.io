                            /*  header nav bar */
$(function(){
  $(window).scroll(function(){
    var winTop = $(window).scrollTop();
    if(winTop >= 10){
      $(".animated-header").addClass("sticky-header");
    }else{
      $(".animated-header").removeClass("sticky-header");
    }
  });
});

                             /* nav-bar scroll */
 $("a[href='#page-top']").click(function() {
   $("html, body").animate({ scrollTop: 0 }, "slow");
   return false;
 });

 $("a[href='#about']").click(function() {
   $("html, body").animate({ scrollTop: 850 }, "slow");
   return false;
 });

 $("a[href='#portfolio']").click(function() {
   $("html, body").animate({ scrollTop: 1300 }, "slow");
   return false;
 });

 $("a[href='#contact']").click(function() {
   $("html, body").animate({ scrollTop: 1700 }, "slow");
   return false;
 });

                              /* skills hover */
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});

                               /* functions */
$(function() {
  projectSlider();
  projectLoad();
});

                             /* project slider */
function projectSlider() {

  $('.project-overview').click(function() {
    $('.project-slider').css('left','-100%')
    $('.project-details').show();
  });

  $('.icon-return').click(function() {
    $('.project-slider').css('left','0%')
    $('.project-details').hide(400);
  });

}

                             /* project load */
function projectLoad() {

  $.ajaxSetup ({ cache: true }); // caches project content pages

  $('.project-unit').click(function() {

    var $this = $(this), // cache this
        newTitle = $this.find('b').text(), // find text in <b> tag
        newFolder = $this.data('folder'), // prints out text in project folders
        spinner = '<div class="loader">Loading...</div>',
        newHTML = '/portfolio/' + newFolder + '.html';

    $('.project-load').html(spinner).load(newHTML);
    $('.project-title').text(newTitle);

  });
}
