# myScrollBar
Customize the scroll bar of our web pages!

You can use myScrollBar.js to add your custom scroll bar.

For now, this version only supports to document, not all scrollable element. I am enhancing it for all support.

## Dependencies:
jQuery 1.x (for IE support).

jQuery 2.x (cannot support IE < 9).

jquery.mousewhell.min.js. A jQuery plugin for support mousewheel event.

## Usage:
  Example:
```html
  <html>
    <head>
      <meta charset="utf-8">
      <title>My Scroll Bar</title>
    </head>
    <body>
      <div class="yourApp">
        <!--...your stuff here-->
      </div>
      <script type="text/javascript" src="jquery-1.11.2.min.js"></script>
      <script type="text/javascript" src="jquery.mousewheel.min.js"></script>
      <script type="text/javascript" src="myScrollBar.js"></script>
      <script type="text/javascript">
        //CSSOption is a object that specify the css of our scroll bar.
        // you can configure these css attributes via this object:
        // CSSOption = {
        //   width: "20px", //width of our scrollbar
        //   backgroundColor: "black", //color of scroll bar
        //   nohoverOpacity: "0.1", //opacity when focus is not on scrollbar
        //   hoverOpacity: "0.5", //opacity when focus on the scrollbar
        //   hoverWidth: "10px" //width of our scroll bar when focused
        //   barBackgroundColor: "#d1bbff", //color of the bar
        //   barBorderRadius: "5px" //border radius of the bar
        // }
        $(function() {
          $(window).myScrollBar(CSSOption);
        });
      </script>
    </body>
  </html>
```

## Description

You can re-configure the CSS of the scroll bar. Just call .myScrollBar(CSSOption).

It's hard to detect the document height change. You know, if your page's height changes, our scroll bar should also change its height and top attributes.  I did not find a better way than setTimeout func. So in this implementation, I use setTimeout as a workaround to update our scroll bar periodically. 

If your page's height is not enough to overflow, you won't see the scroll bar. But when it begans overflow, our scroll bar would show up.
