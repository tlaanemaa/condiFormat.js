// This is a jQuery plugin that allows adding conditional formatting to anything with ease.
// It runs async to avoid blocking the main thread of the browser for too long (async parameters can be adjusted)
// The function that is added is called 'condiFormat' and it takes one optional parameter: options (see below for possible option values)

// A closure to wrap this whole thing into a 'module'
(function($){
  'use strict';
  var hexToRgb;

  // A function to apply conditional formatting
  $.fn.condiFormat = function(options) {
    // Default option values
    if(options === undefined) options = {};
    if(options.highColor === undefined) options.highColor = '#4CAF50'; // Color of the highest value
    if(options.midColor === undefined) options.midColor = '#FFEB3B'; // Color of the middle value
    if(options.lowColor === undefined) options.lowColor = '#F44336'; // Color of the lowest value
    if(options.midPoint === undefined) options.midPoint = 0.5; // Value representing where the middle value will be at (percentage)
    if(options.opacity === undefined) options.opacity = 1;  // Opacity of the background-color that will be set
    if(options.invertColorAt === undefined) options.invertColorAt = 400;  // Color code sums (red + green + blue) under this value will have their text color convered to white
    if(options.readBatchSize === undefined) options.readBatchSize = 2000; // Items to read in one batch before allowing browser to take control for a bit
    if(options.colorBatchSize === undefined) options.colorBatchSize = 200; // Items colored in one batch before allowing browser to take control for a bit
    if(options.transitionSpeed === undefined) options.transitionSpeed = 0;  // Conditional formatting color transition speed (0 = disabled)
    // options.callback allows passing a function that will be called once the coloring is finished. It has no default value

    // Get the elements from 'this'
    var elems = this;

    // Parse colors
    options.highColor = hexToRgb(options.highColor);
    options.midColor = hexToRgb(options.midColor);
    options.lowColor = hexToRgb(options.lowColor);

    // Set up variables for later use
    var maxVal, minVal, i, findBounds, setColor, elemLen, transitionCss;
    elemLen = elems.length;
    if(options.transitionSpeed > 0) transitionCss = {'transition': 'background-color ' + options.transitionSpeed + 'ms ease, color ' + options.transitionSpeed + 'ms ease'};

    // Create function to find min and max values (async)
    findBounds = function() {
      var curVal, j;
      // Loop allows checking more than 1 value per call and thus make it faster
      for(j = 0; j < options.readBatchSize; j++) {
        curVal = $(elems[i]).text().trim();
        if(curVal !== ''){
          curVal = Number(curVal);
          if(!isNaN(curVal) && isFinite(curVal)) {
            if(maxVal === undefined || curVal > maxVal) maxVal = curVal;
            if(minVal === undefined || curVal < minVal) minVal = curVal;
          }
        }
        i = i + 1;
        if(i >= elemLen) break;
      }
      if(i < elemLen) {
        setTimeout(findBounds, 1);
      } else {
        if(maxVal === undefined || minVal === undefined) {
          if(options.callback !== undefined) setTimeout(options.callback.bind(elems), 1);
          return;
        }
        i = 0;
        setTimeout(setColor, 1);
      }
    };

    // Create function to color the elements
    setColor = function(){
      var out, el, curVal, pnt, j;
      // Loop allows checking more than 1 value per call and thus make it faster
      for(j = 0; j < options.colorBatchSize; j++) {
        out = {};
        el = $(elems[i]);
        if(options.transitionSpeed > 0) el.css(transitionCss);
        curVal = el.text();
        if(curVal.trim() !== '') {
          curVal = Number(curVal);
          if(!isNaN(curVal) && isFinite(curVal)) {
            if(maxVal - minVal !== 0) {
              curVal = (curVal - minVal) / (maxVal - minVal);
            } else {
              curVal = 1;
            }
            if(curVal <= options.midPoint) {
              pnt = curVal / options.midPoint;
              out.r = (pnt * (options.midColor.r - options.lowColor.r)) + options.lowColor.r;
              out.g = (pnt * (options.midColor.g - options.lowColor.g)) + options.lowColor.g;
              out.b = (pnt * (options.midColor.b - options.lowColor.b)) + options.lowColor.b;
            } else {
              pnt = (curVal - options.midPoint) / (1 - options.midPoint);
              out.r = (pnt * (options.highColor.r - options.midColor.r)) + options.midColor.r;
              out.g = (pnt * (options.highColor.g - options.midColor.g)) + options.midColor.g;
              out.b = (pnt * (options.highColor.b - options.midColor.b)) + options.midColor.b;
            }
            el.css({'background-color': 'rgba(' + Math.round(out.r) + ', ' + Math.round(out.g) + ', ' + Math.round(out.b) + ', ' + options.opacity + ')'});
            if(out.r + out.g + out.b < options.invertColorAt) el.css({'color': '#FFFFFF'});
          }
        }
        i = i + 1;
        if(i >= elemLen) break;
      }
      if(i < elemLen) {
        setTimeout(setColor, 1);
      } else if(options.callback !== undefined){
        setTimeout(options.callback.bind(elems), 1);
      }
    };

    // Start the created functions
    i = 0;
    setTimeout(findBounds, 1);

    // Return 'this' to allow for jQuery chaining
    return this;
  };

  // Small function to convert from hex to rgb
  hexToRgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  };

})(jQuery);
