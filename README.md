# myScrollBar
Customize the scroll bar of our web pages!
You can use myScrollBar.js to add your custom scroll bar.

Dependencies:
jquery 1.x (for IE support).
jquery 2.x (cannot support IE < 9).
jquery.mousewhell.min.js. For support mousewheel event.

Usage:
  Example:
  "<html>
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
  </html>"
