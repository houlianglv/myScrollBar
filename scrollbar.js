(function($) {
  var executeListeners = function(event, resizeListeners) {
    $.each(resizeListeners, function(index, func) {
      func(event);
    });
  };
  $.fn.addResizeListener = function(callback) {
    if (typeof callback !== 'function') {
      return;
    }
    var $el = this,
      $object, resizeListeners;
    if ($el.css('position') === 'static') {
      $el.css('position', 'relative');
    }
    if ($el.prop('triggerElement') === undefined) {
      $object = $('<iframe></iframe>'),
        resizeListeners = [];
      $object.css({
        display: 'block',
        "z-index": '-1',
        position: 'absolute',
        top: '0',
        left: '0',
        height: '100%',
        width: '100%',
        "pointer-events": 'none'
      });
      $el.prop('triggerElement', $object);
      $el.prop('resizeListeners', resizeListeners);
      resizeListeners.push(callback);
      $object.ready(function() {
        $($object.prop('contentDocument').defaultView).resize(function(event) {
          executeListeners(event, $el.prop('resizeListeners'));
        });
      });
      $el.append($object);
    } else {
      $object = $el.prop('triggerElement');
      resizeListeners = $el.prop('resizeListeners');
      resizeListeners.push(callback);
    }
  };
  $.fn.removeResizeListener = function(func) {
    var $el = this,
      $object, resizeListeners;
    if ($el.prop('triggerElement') === undefined) {
      return;
    } else {
      resizeListeners = $el.prop('resizeListeners');
      newListiners = resizeListeners.filter(function(fn, index, resizeListeners) {
        return fn !== func;
      });
      $el.prop('resizeListeners', newListiners);
    }
  };
}(jQuery));
(function($) {
  var keyMap = {
      //page up
      "33": function(e, $scrollPanel) {
        var scrollPanelHeight = $scrollPanel.height(),
          $bar = $scrollPanel.find('.bar'),
          barHeight = $bar.height(),
          top = $bar.position().top;
        $scrollPanel.scrollTop($scrollPanel.scrollTop() - scrollPanelHeight);
      },
      //page down
      "34": function(e, $scrollPanel) {
        var scrollPanelHeight = $scrollPanel.height(),
          $bar = $scrollPanel.find('.bar'),
          barHeight = $bar.height(),
          top = $bar.position().top;
        $scrollPanel.scrollTop($scrollPanel.scrollTop() + scrollPanelHeight);
      },
      //up
      "38": function(e, $scrollPanel) {
        var scrollPanelHeight = $scrollPanel.height(),
          scrollHeight = $scrollPanel.prop("scrollHeight"),
          step = 0.15 * scrollPanelHeight,
          scrollTop = $scrollPanel.scrollTop();
        $scrollPanel.scrollTop(scrollTop - step);
      },
      //down
      "40": function(e, $scrollPanel) {
        var scrollPanelHeight = $scrollPanel.height(),
          scrollHeight = $scrollPanel.prop("scrollHeight"),
          step = 0.15 * scrollPanelHeight,
          scrollTop = $scrollPanel.scrollTop();
        $scrollPanel.scrollTop(scrollTop + step);
      },
      //left
      "37": function(e, $scrollPanel) {
        var scrollPanelWidth = $scrollPanel.width(),
          scrollWidth = $scrollPanel.prop("scrollWidth"),
          step = 0.15 * scrollPanelWidth,
          scrollLeft = $scrollPanel.scrollLeft();
        $scrollPanel.scrollLeft(scrollLeft - step);
      },
      //right
      "39": function(e, $scrollPanel) {
        var scrollPanelWidth = $scrollPanel.width(),
          scrollWidth = $scrollPanel.prop("scrollWidth"),
          step = 0.15 * scrollPanelWidth,
          scrollLeft = $scrollPanel.scrollLeft();
        $scrollPanel.scrollLeft(scrollLeft + step);
      }
    },
    keydownHandler = function(event) {
      keyMap[event.keyCode] && keyMap[event.keyCode](event, event.data);
      event.preventDefault();
      event.stopPropagation();
    },
    updateScrollBarVisible = function($scrollPanel, CSSOption) {
      if ($scrollPanel.prop('myScrollbarX')) {
        if ($scrollPanel.width() === $scrollPanel.prop('scrollWidth')) {
          CSSOption['XBarVisible'] = false;
        } else {
          CSSOption['XBarVisible'] = true;
        }
      }
      if ($scrollPanel.prop('myScrollbarY')) {
        if ($scrollPanel.height() === $scrollPanel.prop('scrollHeight')) {
          CSSOption['YBarVisible'] = false;
        } else {
          CSSOption['YBarVisible'] = true;
        }
      }
    },
    defaultCSSOption = {
      backgroundColor: "whitesmoke",
      barBackgroundColor: "grey",
      barBorderRadius: "5px",
      width: "10px",
      height: "10px",
      nohoverOpacity: "0",
      hoverOpacity: "0.5"
    };


  var myScrollBarY = function(CSSOption) {
    CSSOption = CSSOption || defaultCSSOption;
    var $scrollPanel = this,
      $scrollbar = $("<div class='scrollbar-Y'></div>"),
      $bar = $("<div class='bar'></div>"),
      $document = $(document),
      resizeHandler, scrollHandler,
      clickBarHandler, dblClickHandler,
      mousewheelHandler, keypressHandler, dragScroll,
      myScrollBar, updateScrollBar;
    $scrollPanel.addClass('scroll-panel');
    if ($scrollPanel.prop('myScrollbarY') === undefined) {
      //event handler
      resizeHandler = function(event) {
        var scrollTop = $scrollPanel.scrollTop(),
          scrollHeight = $scrollPanel.prop('scrollHeight');
        $bar.css({
          top: 100 * scrollTop / scrollHeight + '%',
          height: 100 * $scrollPanel.height() / scrollHeight + '%'
        });
        updateScrollBarVisible($scrollPanel, CSSOption);
      };
      scrollHandler = function(event) {
        var scrollHeight = $scrollPanel.prop("scrollHeight"),
          scrollTop = $scrollPanel.scrollTop();
        $scrollbar.css('top', scrollTop);
        $bar.css('top', 100 * scrollTop / scrollHeight + '%');
        $bar.css('height', 100 * $scrollPanel.height() / scrollHeight + '%');
        if ($scrollPanel.prop('myScrollbarX') !== undefined) {
          var $scrollbarX = $scrollPanel.prop('myScrollbarX');
          $scrollbarX.css('bottom', -$scrollPanel.scrollTop() + 'px');
        }
        updateScrollBarVisible($scrollPanel, CSSOption);
      };
      clickBarHandler = function(event) {
        var pageY = event.pageY,
          scrollPanelTop = $scrollPanel.offset().top,
          scrollHeight = $scrollPanel.prop("scrollHeight"),
          scrollPanelHeight = $scrollPanel.height(),
          barHeight = $bar.height(),
          newTop;
        newTop = scrollHeight * (pageY - scrollPanelTop - barHeight / 2) / scrollPanelHeight;
        $scrollPanel.scrollTop(newTop);
        event.preventDefault();
        event.stopPropagation();
      };
      mousewheelHandler = function(event) {
        var delta = -150 * event.deltaY;
        $scrollPanel.scrollTop($scrollPanel.scrollTop() + delta);
        event.preventDefault();
        event.stopPropagation();
      };
      dragScroll = function($el) {
        $el.on("mousedown", function(e) {
          var oldY = e.clientY,
            isDragging = true,
            $scrollbar = $el.parent(),
            $scrollPanel = $scrollbar.parent();
          $(document).on("mousemove", function(e) {
            if (!isDragging) {
              return;
            }
            if (e.clientY - oldY > 10 || e.clientY - oldY < -10) {
              var newTop = $el.position().top + e.clientY - oldY;
              var diff = $scrollPanel.prop('scrollHeight') * (e.clientY - oldY) / $scrollPanel.height();
              $scrollPanel.scrollTop($scrollPanel.scrollTop() + diff);
              oldY = e.clientY;
            }
            e.preventDefault(); // disable selection
          }).on("mouseup", function(event) {
            isDragging = false;
          });
          e.preventDefault(); // disable selection
        });
      };
      //register event handler
      $scrollPanel.scroll(scrollHandler);
      $scrollbar.click(clickBarHandler);
      $scrollPanel.on('mousewheel', mousewheelHandler);
      dragScroll($bar);
      $scrollPanel.addResizeListener(resizeHandler);
      $scrollPanel.hover(function() {
        $scrollPanel.prop('tabIndex', '1');
        $scrollPanel.focus();
        $scrollPanel.keydown($scrollPanel, keydownHandler);
      }, function() {
        $scrollPanel.off('keydown', keydownHandler);
        $scrollPanel.prop('tabIndex', '-1');
        $scrollPanel.focusout();
      });
      //remove default scrollbar
      $scrollPanel.css("overflowY", "hidden");
      //add our scroll bar
      $scrollbar.append($bar);
      $scrollPanel.append($scrollbar);
      $scrollPanel.prop('myScrollbarY', $scrollbar);
    }
    $scrollbar = $scrollPanel.prop('myScrollbarY');
    $bar = $scrollbar.find('.bar');
    //set initial css of scroll bar
    $scrollbar.css({
      "position": 'absolute',
      "top": '0',
      "right": '0',
      "height": "100%",
      "width": CSSOption["width"],
      "webkitUserSelect": "none",
      "background-color": CSSOption["backgroundColor"],
      "opacity": CSSOption["nohoverOpacity"]
    });
    $bar.css({
      "position": 'absolute',
      "left": '10%',
      "width": '80%',
      "height": 100 * $scrollPanel.height() / $scrollPanel.prop("scrollHeight") + "%",
      "background-color": CSSOption["barBackgroundColor"],
      "border-radius": CSSOption["barBorderRadius"],
      "top": 100 * $scrollPanel.scrollTop() / $scrollPanel.prop("scrollHeight") + "%"
    });
    $scrollPanel.hover(function() {
      if (CSSOption['YBarVisible']) {
        $scrollbar.css('opacity', CSSOption['hoverOpacity']);
      } else {
        $scrollbar.css('opacity', '0');
      }
    }, function() {
      if (CSSOption['YBarVisible']) {
        $scrollbar.css('opacity', CSSOption['nohoverOpacity']);
      } else {
        $scrollbar.css('opacity', '0');
      }
    });
  };
  var myScrollBarX = function(CSSOption) {
    var $scrollPanel = this,
      $scrollbar = $("<div class='scrollbar-X'></div>"),
      $bar = $("<div class='bar'></div>"),
      $document = $(document),
      resizeHandler, scrollHandler,
      clickBarHandler, dblClickHandler,
      mousewheelHandler, keypressHandler, dragScroll,
      myScrollBar;
    $scrollPanel.addClass('scroll-panel');
    if ($scrollPanel.prop('myScrollbarX') === undefined) {
      //event handler
      resizeHandler = function(event) {
        var scrollLeft = $scrollPanel.scrollLeft(),
          scrollWidth = $scrollPanel.prop('scrollWidth');
        $bar.css({
          left: 100 * scrollLeft / scrollWidth + '%',
          width: 100 * $scrollPanel.width() / scrollWidth + '%'
        });
        updateScrollBarVisible($scrollPanel, CSSOption);
      };
      scrollHandler = function(event) {
        var scrollWidth = $scrollPanel.prop("scrollWidth"),
          scrollLeft = $scrollPanel.scrollLeft();
        $scrollbar.css('left', scrollLeft);
        $bar.css('left', 100 * scrollLeft / scrollWidth + '%');
        $bar.css('width', 100 * $scrollPanel.width() / scrollWidth + '%')
        if ($scrollPanel.prop('myScrollbarY') !== undefined) {
          var $scrollbarY = $scrollPanel.prop('myScrollbarY');
          $scrollbarY.css('right', -$scrollPanel.scrollLeft() + 'px');
        }
        updateScrollBarVisible($scrollPanel, CSSOption);
      };
      clickBarHandler = function(event) {
        var pageX = event.pageX,
          scrollPanelLeft = $scrollPanel.offset().left,
          scrollWidth = $scrollPanel.prop("scrollWidth"),
          scrollPanelWidth = $scrollPanel.width(),
          barWidth = $bar.width(),
          newLeft;
        newLeft = scrollWidth * (pageX - scrollPanelLeft - barWidth / 2) / scrollPanelWidth;
        $scrollPanel.scrollLeft(newLeft);
        event.preventDefault();
        event.stopPropagation();
      };
      dragScroll = function($el) {
        $el.on("mousedown", function(e) {
          var oldX = e.clientX,
            isDragging = true,
            $scrollbar = $el.parent(),
            $scrollPanel = $scrollbar.parent();
          $(document).on("mousemove", function(e) {
            if (!isDragging) {
              return;
            }
            if (e.clientX - oldX > 10 || e.clientX - oldX < -10) {
              var newLeft = $el.position().left + e.clientX - oldX;
              var diff = $scrollPanel.prop('scrollWidth') * (e.clientX - oldX) / $scrollPanel.width();
              $scrollPanel.scrollLeft($scrollPanel.scrollLeft() + diff);
              oldX = e.clientX;
            }
            e.preventDefault(); // disable selection
          }).on("mouseup", function(event) {
            isDragging = false;
          });
          e.preventDefault(); // disable selection
        });
      };
      //register event handler
      $scrollPanel.scroll(scrollHandler);
      $scrollbar.click(clickBarHandler);
      dragScroll($bar);
      $scrollPanel.addResizeListener(resizeHandler);
      $scrollPanel.hover(function() {
        $scrollPanel.prop('tabIndex', '1');
        $scrollPanel.focus();
        $scrollPanel.keydown($scrollPanel, keydownHandler);
      }, function() {
        $scrollPanel.off('keydown', keydownHandler);
        $scrollPanel.prop('tabIndex', '-1');
        $scrollPanel.focusout();
      });
      //remove default scrollbar
      $scrollPanel.css("overflowX", "hidden");
      //add our scroll bar
      $scrollbar.append($bar);
      $scrollPanel.append($scrollbar);
      $scrollPanel.prop('myScrollbarX', $scrollbar);
    }
    $scrollbar = $scrollPanel.prop('myScrollbarX');
    $bar = $scrollbar.find('.bar');
    //set initial css of scroll bar
    CSSOption = CSSOption || defaultCSSOption;
    $scrollbar.css({
      "position": 'absolute',
      "bottom": '0',
      "left": '0',
      "width": "100%",
      "height": CSSOption["height"],
      "webkitUserSelect": "none",
      "background-color": CSSOption["backgroundColor"],
      "opacity": CSSOption["nohoverOpacity"]
    });
    $bar.css({
      "position": 'absolute',
      "top": '10%',
      "height": '80%',
      "width": 100 * $scrollPanel.width() / $scrollPanel.prop("scrollWidth") + "%",
      "background-color": CSSOption["barBackgroundColor"],
      "border-radius": CSSOption["barBorderRadius"],
      "left": 100 * $scrollPanel.scrollLeft() / $scrollPanel.prop("scrollWidth") + "%"
    });
    $scrollPanel.hover(function() {
      if (CSSOption['XBarVisible']) {
        $scrollbar.css('opacity', CSSOption['hoverOpacity']);
      } else {
        $scrollbar.css('opacity', '0');
      }
    }, function() {
      if (CSSOption['XBarVisible']) {
        $scrollbar.css('opacity', CSSOption['nohoverOpacity']);
      } else {
        $scrollbar.css('opacity', '0');
      }
    });
  };
  $.fn.myScrollBar = function(CSSOption) {
    myScrollBarY.call(this, CSSOption);
    myScrollBarX.call(this, CSSOption);
  };
}(jQuery));
