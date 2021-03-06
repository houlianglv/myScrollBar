# myScrollBar
Customize the scroll bar of our web pages!

For now, myScrollBar.js is for window scroll bar.

scrollbar.js is for scrollable div element. You can see demo in [this demo page](http://houlianglv.github.io/myscrollbar/demo.html). But still not perfect in IE(<9). You will see some side effects.

Next step would be the intergration of window scroll bar and div scroll bar, to provide an universial interface.

## Dependencies:
jQuery 1.x (for IE support).

jQuery 2.x (cannot support IE < 9).

jquery.mousewhell.min.js. A jQuery plugin for support mousewheel event.

## Usage:

### Example for window scroll bar:
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
          $(window).windowScrollBar(CSSOption);
        });
      </script>
    </body>
  </html>
```
### Example for div scroll bar:
```html
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Scroll Bar</title>
      <link rel="stylesheet" type="text/css" href="test.css">
    </head>
    <body style="height:2000px">
      <div class="outer" style="position: relative; overflow:auto; height: 400px; width:600px;">
        <img src="azusa.jpg" style="position: relative;">
      </div>
      <script type="text/javascript" src="jquery-1.11.2.min.js"></script>
      <script type="text/javascript" src="jquery.mousewheel.min.js"></script>
      <script type="text/javascript" src="scrollbar.js"></script>
      <script type="text/javascript">
        $(function(){
          $('.outer').myScrollBar();
        });
      </script>
    </body>
  </html>
```

## Description

You can re-configure the CSS of the scroll bar. Just call .myScrollBar(CSSOption).

It's hard to detect the document height change. You know, if your page's height changes, our scroll bar should also change its height and top attributes.  I did not find a better way than setTimeout func. So in this implementation, I use setTimeout as a workaround to update our scroll bar periodically. 

If your page's height is not enough to overflow, you won't see the scroll bar. But when it begans overflow, our scroll bar would show up.
