jQuery(document).ready(function($) {

  var fm = {

    init: function() {

      fm.numImages = 2;
      fm.imgIndex = 0;
      fm.canvas = $('canvas.canvas')[0]
      fm.ctx = fm.canvas.getContext('2d');
      fm.canvas.width = $(window).width();
      fm.canvas.height = $(window).height();
      fm.imgRatio  = fm.canvas.height/fm.canvas.width;

      newImg(0);

    }

  };

  var stripe = function(index, numFrames, bandwidth, img) {

    fm.ctx.save(); // pre clip

    bandwidth = bandwidth || 10;

    fm.ctx.beginPath();

    offset = index * bandwidth

    for (var i = 0; i < fm.canvas.width/(bandwidth); i += numFrames) { //* numFrames

      var x = bandwidth * i + offset;

      fm.ctx.moveTo(x, 0);
      fm.ctx.lineTo(x, fm.canvas.height);
      fm.ctx.lineTo(x + bandwidth, fm.canvas.height);
      fm.ctx.lineTo(x + bandwidth, 0);
      fm.ctx.lineTo(x, 0);

    }

    fm.ctx.clip();

    // now draw shit

    fm.ctx.drawImage(img, 0, 0, fm.canvas.width, fm.canvas.width * fm.imgRatio);

    fm.ctx.restore(); // pre clip
    
  };

  var newImg = function(index) {

    var img = new Image();
 
    img.onload = function() {
 
      stripe(index, fm.numImages, 10, this);
 
    }

    // disable old listener
    $("#file-select input.file").off('change');

    $("#file-select input.file").change(function(e) {
 
      var reader = new FileReader(),
          f = e.target.files[0];
  
      // Closure to capture the file information.
      reader.onload = (function(file) {
  
        return function(e) {
  
          img.src = e.target.result;
  
        };
  
      })(f);
    
      // Read in the image file as a data URL.
      reader.readAsDataURL(f);

      fm.imgIndex += 1;
      if (fm.imgIndex == fm.numImages) fm.imgIndex = 0;
      newImg(fm.imgIndex);

    });

  }


  fm.init();


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
