/*!
 * ImgSequence
 * version: 2018.08.26
 * author: dobrapyra
 * url: https://github.com/dobrapyra/ImgSequence
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) { // AMD
    define([], factory);
  } else if (typeof exports === 'object') { // Node, CommonJS-like
    module.exports = factory();
  } else { // Browser globals (root is window)
    root.ImgSequence = factory();
  }
}(this, function() {

  var ImgSequence = function(cfg){ this.init(cfg); };
  Object.assign(ImgSequence.prototype, {

    init: function(cfg) {
      // #region config
      this.el = cfg.el;
      this.src = cfg.src || '';
      this.frames = cfg.frames || 1;
      this.cols = cfg.cols || 1;
      this.w = cfg.width || 1280;
      this.h = cfg.height || 720;
      this.onReady = cfg.onReady || function(){};;
      // #endregion config

      // #region bind this
      this.loadImage = this.loadImage.bind(this);
      this.onImegeReady = this.onImegeReady.bind(this);
      this.createLut = this.createLut.bind(this);
      this.createCanvas = this.createCanvas.bind(this);
      this.setFrame = this.setFrame.bind(this);
      this.drawFrame = this.drawFrame.bind(this);
      // #endregion bind this

      this.image = this.loadImage();
    },

    loadImage: function() {
      var image = new Image();
      image.onload = this.onImegeReady;
      image.src = this.src;
      return image;
    },

    onImegeReady: function() {
      this.rows = Math.ceil( this.frames / this.cols );

      this.frameW = this.image.width / this.cols;
      this.frameH = this.image.height / this.rows;

      this.lut = this.createLut();
      this.canvas = this.createCanvas();
      this.ctx = this.canvas.getContext('2d');

      this.canvas.width = this.w;
      this.canvas.height = this.h;

      this.setFrame(0);

      this.onReady(this);
    },

    createLut: function() {
      var lut = [];

      var i, l = this.frames;
      for(i = 0; i < l; i++) {
        lut[i] = {
          x: ( i % this.cols ) * this.frameW,
          y: Math.floor( i / this.cols ) * this.frameH
        };
      }

      return lut;
    },

    createCanvas: function() {
      var canvas = document.createElement('canvas');
      Object.assign(canvas.style, {
        position: 'relative',
        width: '100%',
        height: 'auto'
      });

      this.el.appendChild(canvas);
      return canvas;
    },

    setFrame: function(frame) {
      this.drawFrame(this.lut[frame]);
    },

    drawFrame: function(frame) {
      this.ctx.drawImage(this.image, frame.x, frame.y, this.frameW, this.frameH, 0, 0, this.w, this.h);
    },

    getTween: function(Tween, fps) {
      var frameObj = {
        frame: 0
      };

      return Tween.fromTo(frameObj, this.frames / fps, {
        frame: 0
      }, {
        frame: this.frames - 1
      });
    }

  });

  return ImgSequence;
}));