//add dragScroll to $. make scrollbar draggable.
(function($) {
  $.fn.dragScroll = function(opt, mdfunc, mmfunc, mufunc) {
    var $el = this,
      $window = $(window),
      documentHeight = $(document).height();
    return $el.on("mousedown", function(e) {
      var $drag = $(this).addClass('draggable');
      var z_idx = $drag.css('z-index'),
        oldY = e.clientY,
        windowScrollY = $window.scrollTop();
      $(document).on("mousemove", function(e) {
        if (e.clientY - oldY > 30 || e.clientY - oldY < -30) {
          var newTop = $drag.position().top + e.clientY - oldY;
          newTop = newTop < 0 ? 0 : newTop;
          newTop = newTop + $drag.outerHeight() > $window.height() ? $window.height() - $drag.outerHeight() : newTop;
          $('.draggable').css("top", newTop + "px");
          //console.log(newTop);
          var diff = documentHeight * (e.clientY - oldY) / $window.height();
          $window.scrollTop($window.scrollTop() + diff);
          oldY = e.clientY;
        }
        e.preventDefault(); // disable selection
      }).on("mouseup", function(event) {
        $drag.removeClass('draggable').css('z-index', z_idx);
        $(document).off("mousemove");
        $(document).off("mouseup");
      });
      e.preventDefault(); // disable selection
    });
  };
})(jQuery);

(function($) {
  var isInitialized = false,
    $scrollbar = $("<div class='scrollbar'></div>"),
    $bar = $("<div class='bar'></div>");
  $.fn.myScrollBar = function(CSSOption) {
    var $window = $(window),
      $document = $(document),
      windowHeight = $window.height(),
      documentHeight = $document.height(),
      oldDocumentHeight = documentHeight,
      resizeHandler, windowScrollHandler,
      clickBarHandler, dblClickHandler,
      mousewheelHandler, keypressHandler, keyMap,
      myScrollBar, updateScrollBar;

    if (!isInitialized) {
      isInitialized = true;
      //event handler
      resizeHandler = function(event) {
        var windowHeight = $window.height(),
          documentHeight = $document.height(),
          newHeight = windowHeight * windowHeight / documentHeight,
          newTop = windowHeight * $window.scrollTop() / documentHeight;
        $bar.css({
          height: newHeight + 'px',
          top: newTop + 'px'
        });
      };
      windowScrollHandler = function(event) {
        var windowHeight = $window.height(),
          documentHeight = $document.height();
        $bar.css('top', 100 * $window.scrollTop() / documentHeight + '%');
      };
      clickBarHandler = function(event) {
        var clickY = event.clientY,
          barTop = parseInt($bar.css("top"), 10),
          barBottom = barTop + parseInt($bar.css("height"), 10),
          barHeight = barBottom - barTop,
          scrollTop = $window.scrollTop(),
          windowHeight = $window.height();
        if (clickY < barTop) {
          if (barTop > barHeight) {
            $window.scrollTop(scrollTop - windowHeight);
          } else {
            $window.scrollTop(0);
          }
        } else if (clickY > barBottom) {
          if (windowHeight - barBottom > barHeight) {
            $window.scrollTop(scrollTop + windowHeight);
          } else {
            $window.scrollTop($document.height() - windowHeight);
          }
        }
        event.preventDefault();
        event.stopPropagation();
      };
      dblClickHandler = function(event) {
        var clickY = event.clientY,
          barTop = parseInt($bar.css("top"), 10),
          barBottom = barTop + parseInt($bar.css("height"), 10),
          barHeight = barBottom - barTop,
          clientHeight = $document.height(),
          windowHeight = $window.height(),
          newTop;

        if (clickY > barHeight * 0.5 && windowHeight - clickY > barHeight * 0.5) {
          newTop = clickY - barHeight * 0.5;
          $window.scrollTop(clientHeight * newTop / windowHeight);
        } else if (clickY <= barHeight * 0.5) {
          $window.scrollTop(0);
        } else {
          $window.scrollTop(clientHeight - windowHeight);
        }
        event.preventDefault();
        event.stopPropagation();
      };
      mousewheelHandler = function(event) {
        var delta, newScrollTop, newTop;
        delta = -150 * event.deltaY;
        $window.scrollTop($window.scrollTop() + delta);
      };
      keyMap = {
        //page up
        33: function(e) {
          var windowHeight = $window.height(),
            barHeight = $bar.outerHeight(),
            top = $bar.position().top;
          if (top > barHeight) {
            $window.scrollTop($window.scrollTop() - windowHeight);
          } else {
            $window.scrollTop(0);
          }
        },
        //page down
        34: function(e) {
          var windowHeight = $window.height(),
            barHeight = $bar.outerHeight(),
            top = $bar.position().top;
          if (top + 2 * barHeight < windowHeight) {
            $window.scrollTop($window.scrollTop() + windowHeight);
          } else {
            $window.scrollTop($document.height() - windowHeight);
          }
        },
        //up
        38: function(e) {
          var windowHeight = $window.height(),
            documentHeight = $document.height(),
            step = 0.15 * windowHeight,
            barStep = windowHeight * step / documentHeight,
            top = $bar.position().top,
            scrollTop = $window.scrollTop();
          if (scrollTop > step) {
            $window.scrollTop(scrollTop - step);
          } else {
            $window.scrollTop(0);
          }
        },
        //down
        40: function(e) {
          var windowHeight = $window.height(),
            documentHeight = $document.height(),
            step = 0.15 * windowHeight,
            barStep = windowHeight * step / documentHeight,
            top = $bar.position().top,
            barHeight = $bar.outerHeight(),
            scrollTop = $window.scrollTop();
          if (scrollTop + step + windowHeight < documentHeight) {
            $window.scrollTop($window.scrollTop() + step);
          } else {
            $window.scrollTop(documentHeight - windowHeight);
          }
        }
      };
      keydownHandler = function(event) {
        keyMap[event.keyCode] && keyMap[event.keyCode](event);
      };
      //a workaround for detecting document height change
      //there is no cross-browser event-based way to listen this change
      //it doese hurt our performance.
      var timer = 0,
        isScrollBarShow;
      updateScrollBar = function() {
        var documentHeight = $document.height();
        if (documentHeight !== oldDocumentHeight) {
          if ($window.height() === documentHeight) {
            $scrollbar.hide();
            isScrollBarShow = false;
          } else if ($window.height() < documentHeight) {
            $bar.css({
              'top': 100 * $window.scrollTop() / documentHeight + '%',
              'height': 100 * $window.height() / documentHeight + '%'
            });
            if (!isScrollBarShow) {
              $scrollbar.show();
              isScrollBarShow = true;
            }
          }
          oldDocumentHeight = documentHeight;
        }
        clearTimeout(timer);
        timer = setTimeout(updateScrollBar, 1000);
      };
      //register event handler
      $window.resize(resizeHandler);
      $window.scroll(windowScrollHandler);
      $scrollbar.click(clickBarHandler);
      $scrollbar.dblclick(dblClickHandler);
      $document.on('mousewheel', mousewheelHandler);
      $document.keydown(keydownHandler);
      $bar.dragScroll();
      //remove default scrollbar
      $('body').css("overflowY", "hidden");
      //add our scroll bar
      $scrollbar.append($bar);
      $('body').append($scrollbar);
      if ($window.height() === $document.height()) {
        $scrollbar.hide();
        isScrollBarShow = false;
      } else {
        isScrollBarShow = true;
      }
      timer = setTimeout(updateScrollBar, 300);
    }
    //set initial css of scroll bar
    CSSOption = CSSOption || {};
    $scrollbar.css({
      "position": 'fixed',
      "top": '0',
      "right": '0',
      "height": "100%",
      "width": CSSOption["width"] || "10px",
      "webkitUserSelect": "none",
      "background-color": CSSOption["backgroundColor"] || "black",
      "opacity": CSSOption["nohoverOpacity"] || "0.1"
    });
    $scrollbar.hover(function() {
      $scrollbar.css({
        "opacity": CSSOption["hoverOpacity"] || '0.5',
        "width": CSSOption["hoverWidth"] || '20px'
      });
      $bar.css({
        "left": '10%',
        "width": '80%'
      });
    }, function() {
      $scrollbar.css({
        "opacity": CSSOption["nohoverOpacity"] || '0.1',
        "width": CSSOption["width"] || '10px'
      });
      $bar.css({
        "left": '10%',
        "width": '80%'
      });
    });
    $bar.css({
      "position": 'absolute',
      "left": '10%',
      "width": '80%',
      "height": 100 * windowHeight / documentHeight + "%",
      "background-color": CSSOption["barBackgroundColor"] || "#d1bbff",
      "border-radius": CSSOption["barBorderRadius"] || "5px",
      "top": $window.height() * $window.scrollTop() / documentHeight + "px"
    });
    setTimeout(function() {
      $bar.css("top", $window.height() * $window.scrollTop() / documentHeight + "px");
    }, 100);
  };
}(jQuery));
