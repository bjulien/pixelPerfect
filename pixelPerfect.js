(function() {
  'use strict';

  var PixelPerfect = function() {
    var optionsLayout = {
      display: true,
      text: "Drop Image",
      zone: document.querySelector('body'),
      move: 10
    };

    return {
      // initialisation
      init: function() {
        this.layout();
        this.moveKeyboard();
        this.getMove();
      },

      // set box
      layout: function() {
        // container div
        var thumbnails = document.createElement('div');
        thumbnails.setAttribute('id', 'thumbnails');
        thumbnails.innerHTML = optionsLayout.text;

        // input options
        var inputOptions = document.createElement('input');
        inputOptions.setAttribute('type', 'text');
        inputOptions.setAttribute('class', 'pixelMove');

        optionsLayout.zone.appendChild(thumbnails);
        optionsLayout.zone.appendChild(inputOptions);
        optionsLayout.zone.appendChild( document.createTextNode("move" + optionsLayout.move) );

        thumbnails.insertAdjacentHTML('afterBegin', '<img src="" />');
      },

      getMove: function() {
        var img = document.querySelector('#thumbnails img');

        // change value for move
        document.querySelector('.pixelMove').addEventListener('change', function() {
          optionsLayout.move = (document.querySelector('.pixelMove') !== null) ? document.querySelector('.pixelMove').value : optionsLayout.move;
        }, false);

        // on drag, move img
        img.addEventListener('mousedown', function(e) {
          var initialized = {
              x : img.offsetLeft - e.pageX,
              y : img.offsetTop - e.pageY
          };

          var setPosition = function(e) {
            img.style.top  = ( initialized.y + e.pageY ) + 'px';
            img.style.left = ( initialized.x + e.pageX ) + 'px';
          };

          document.addEventListener('mousemove', setPosition, false);
          document.addEventListener('mouseup', function() {
            document.removeEventListener('mousemove', setPosition, false);
          }, false);

        });
      },

      // press keyboard to move
      moveKeyboard: function() {
        var img = document.querySelector('#thumbnails img');
        var positionLeft = parseInt(img.offsetLeft, 10);
        var positionTop = parseInt(img.offsetTop, 10);

        optionsLayout.zone.addEventListener('keydown', function(e) {

          if ( e.keyCode == 40) {
            positionTop += parseInt( optionsLayout.move, 10 );
          }
          if ( e.keyCode == 38) {
            positionTop -= parseInt( optionsLayout.move, 10 );
          }
          if ( e.keyCode == 37) {
            positionLeft -= parseInt( optionsLayout.move, 10 );
          }
          if ( e.keyCode == 39) {
            positionLeft += parseInt( optionsLayout.move, 10 );
          }

          img.style.top  = positionTop + 'px';
          img.style.left = positionLeft + 'px';
        });
      }
    };
  };

  // upload image
  var UploadImage = function() {
    return {
      // initialisation
      init: function() {
        // Setup drag and drop handlers.
        var thumbnails = document.querySelector('#thumbnails');

        thumbnails.addEventListener('dragenter', this.onDragEnter, false);
        thumbnails.addEventListener('dragover', this.onDragOver, false);
        thumbnails.addEventListener('dragleave', this.onDragLeave, false);
        thumbnails.addEventListener('drop', this.onDrop, false);

        this.onDragEnter();
        this.onDragOver();
        this.onDragLeave();
      },

      // drag and drop
      onDragEnter: function(e) {
        e.stopPropagation();
        e.preventDefault();
      },

      onDragOver: function(e) {
        e.stopPropagation();
        e.preventDefault();
      },

      onDragLeave: function(e) {
        e.stopPropagation();
        e.preventDefault();
      },

      onDrop: function(e) {
        e.stopPropagation();
        e.preventDefault();

        var readFileSize = 0;
        var files = e.dataTransfer.files;

        // Loop through list of files user dropped.
        for (var i = 0, file; file = files[i]; i++) {
          readFileSize += file.fileSize;

          // Only process image files.
          var imageType = /image.*/;
          if (!file.type.match(imageType)) {
            continue;
          }

          var reader = new FileReader();

          reader.onerror = function(e) {
             alert('Error code: ' + e.target.error.code);
          };

          // Create a closure to capture the file information.
          reader.onload = (function(aFile) {
            return function(evt) {
              // Generate angle between -30 and 30 degrees.
              var deg = Math.floor(Math.random() * 31);
              deg = Math.floor(Math.random() * 2) ? deg : -deg;

              var data = {
                'name': aFile.name,
                'src': evt.target.result,
                'fileSize': aFile.fileSize,
                'type': aFile.type,
                'rotate': deg
              };

              // Render thumbnail with the file info (data object).
              document.querySelector('#thumbnails img').src = data.src;
            };
          })(file);
          // Read in the image file as a data url.
          reader.readAsDataURL(file);
        }

        return false;
      }
    };
  };

  var pixel = new PixelPerfect();
  var upload = new UploadImage();

  pixel.init();
  upload.init();

})();
