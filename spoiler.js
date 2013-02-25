(function( $ ) {
  var browser = {}
  browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
  browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
  browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
  browser.msie = /msie/.test(navigator.userAgent.toLowerCase());

  var defaults = {
    max: 10,
    partial: 6,
    hintText: 'Click to reveal completely'
  }

  var alertShown = false>>>>>>> Stashed changes

  $.fn.spoilerAlert = function(opts) {
    var maxBlur = opts.max
    var partialBlur = opts.partial
    var hintText = opts.hintText
    opts = $.extend(defaults, opts || {})
    console.log(opts.max)
    if (!alertShown && browser.msie) {
      alert("WARNING, this site contains spoilers!")
      alertShown = true
    }
    return this.each(function() {
      var $spoiler = $(this)
      $spoiler.data('spoiler-state', 'shrouded')

      var animationTimer = null
      var currentBlur = maxBlur

      var cancelTimer = function() {
        if (animationTimer) {
          clearTimeout(animationTimer)
          animationTimer = null
        }
      }

      var applyBlur = function(radius) {
        currentBlur = radius
        if (browser.msie) {
          // do nothing
        } else if (browser.mozilla) {
          var filterValue = radius > 0 ? "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='blur'><feGaussianBlur stdDeviation='" + radius + "' /></filter></svg>#blur\")" : ''
          $spoiler.css('filter', filterValue)
        } else {
          var filterValue = radius > 0 ? 'blur('+radius+'px)' : ''
          $spoiler.css('filter', filterValue)
          $spoiler.css('-webkit-filter', filterValue)
          $spoiler.css('-moz-filter', filterValue)
          $spoiler.css('-o-filter', filterValue)
          $spoiler.css('-ms-filter', filterValue)
        }
      }

      var performBlur = function(targetBlur, direction) {
        cancelTimer()
        if (currentBlur != targetBlur) {
          applyBlur(currentBlur + direction)
          animationTimer = setTimeout(function() { performBlur(targetBlur, direction) }, 10)
        }
      }

      applyBlur(currentBlur)

      $(this).on('mouseover', function(e) {
        $spoiler.attr('title', hintText)
        if ($spoiler.data('spoiler-state') == 'shrouded') performBlur(partialBlur, -1)
      })
      $(this).on('mouseout', function(e) {
        if ($spoiler.data('spoiler-state') == 'shrouded') performBlur(maxBlur, 1)
      })
      $(this).on('click', function(e) {
        $spoiler.data('spoiler-state', $spoiler.data('spoiler-state') == 'shrouded' ? 'revealed' : 'shrouded')
        $spoiler.attr('title', 'spoiler-state' == 'shrouded' ? hintText : '')
        $spoiler.data('spoiler-state') == 'shrouded' ? performBlur(partialBlur, 1) : performBlur(0, -1)
      })
    })

  };
})( jQuery );
