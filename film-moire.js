jQuery(document).ready(function($) {

  var img1 = new Image();
  var img2 = new Image();

  var fm = {};

  fm.canvas = $('canvas.canvas')[0]
  var ctx = fm.canvas.getContext('2d');
  fm.canvas.width = $(window).width();
  fm.canvas.height = $(window).height();
  var imgRatio  = fm.canvas.height/fm.canvas.width;

  stripe = function(index, numFrames, bandwidth, img) {

    ctx.save(); // pre clip

    bandwidth = bandwidth || 10;

    ctx.beginPath();

    offset = index * bandwidth

    for (var i = 0; i < fm.canvas.width/(bandwidth); i += numFrames) { //* numFrames

      var x = bandwidth * i + offset;

      ctx.moveTo(x, 0);
      ctx.lineTo(x, fm.canvas.height);
      ctx.lineTo(x + bandwidth, fm.canvas.height);
      ctx.lineTo(x + bandwidth, 0);
      ctx.lineTo(x, 0);

    }

    ctx.clip();

    // now draw shit

    ctx.drawImage(img, 0, 0, fm.canvas.width, fm.canvas.width * imgRatio);

    ctx.restore(); // pre clip
    
  };

  img1.onload = function() {

    stripe(0, 2, 10, this);

  }

  img2.onload = function() {

    stripe(1, 2, 10, this);

  }




  $("#file-select input.file1").change(function(e) {

    var reader = new FileReader(),
        f1 = e.target.files[0];
 
 
    // Closure to capture the file information.
    reader.onload = (function(file) {
 
      return function(e) {
 
        img1.src = e.target.result;
 
      };
 
    })(f1);
  
    // Read in the image file as a data URL.
    reader.readAsDataURL(f1);
  });


  $("#file-select input.file2").change(function(e) {

    var reader = new FileReader(),
        f2 = e.target.files[0];
 
 
    // Closure to capture the file information.
    reader.onload = (function(file) {
 
      return function(e) {
 
        img2.src = e.target.result;
 
      };
 
    })(f2);
  
    // Read in the image file as a data URL.
    reader.readAsDataURL(f2);
  });

  $('.save').click(function(e) {

    var event, format, lnk;
    lnk = document.createElement("a");
    lnk.href = fm.canvas.toDataURL("image/jpeg");
    if (lnk.href.match('image/jpeg')) {
      format = "jpg";
    } else {
      format = "png";
    }
    lnk.download = (new Date()).toISOString().replace(/:/g, "_") + "." + format;
    if (document.createEvent) {
      event = document.createEvent("MouseEvents");
      event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      lnk.dispatchEvent(event);
    } else if (lnk.fireEvent) {
      lnk.fireEvent("onclick");
    }

    return true;

  });

});
