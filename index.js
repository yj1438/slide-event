(function (undefined) {
  'use strict';
  /**
   * 合并两个对象
   * @param {any} 目标obj
   * @param {any} 数值来源obj
   * @returns
   */
  function objAssign(obj1, obj2) {
    if (obj1 && obj2
      && Object.prototype.toString(obj1) === '[object Object]'
      && Object.prototype.toString(obj2) === '[object Object]') {
      var key;
      for (key in obj2) {
        if (obj2.hasOwnProperty(key)) {
          obj1[key] = obj2[key];
        }
      }
    }
    return obj1;
  }

  /**
   * 检测当前 slide event dom 是否需要包含 class J-slide-ineffect
   * 有此类的 dom 屏蔽 slide 事件
   * @param {Event} event 事件对象
   */
  function ineffect(event) {
    var ineffectClass = 'J-slide-ineffect';
    if (event.target.classList.contains(ineffectClass)) {
      return true;
    }
    return false;
  }

  var defaultOption = {
    distance: 80,
    spacingTime: 1000,
    preventDefault: true,
    invalidBorderRange: 0.05      // 触控无效的区域比例
  };

  /**
   * 上下左右 slide 事件
   * @param {string|Element} ele 用来绑定的 dom / dom selector
   * @param {object} option 事件配置参数
   * @param {boolean} option.distance 滑动的距离px，默认80
   * @param {boolean} option.spacingTime 滑动的有效时间ms，如果超出这个时间则，
   * @param {boolean} option.preventDefault 是否阻碍默认事件
   * @param {boolean} option.invalidBorderRange 事件无效边框
   */
  var SlideEvt = function (ele, option) {
    if (!ele) {
      throw new Error('Parameter 1 cannot be empty');
    }
    this.ele = typeof ele === 'string' ? document.getElementById(ele) : ele;
    this.option = objAssign(defaultOption, option || {});
    this.width = this.ele.clientWidth;
    this.height = this.ele.clientHeight;
    this.slideData = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      distanceX: 0,
      distanceY: 0,
    };
    this.identifier = null;       // 这个很关键，在移动平台下，多点触控会很大的影响到滑动控制所以需要对哪一次的滑动进行区分
    //
    this.onSlide();
  };

  SlideEvt.prototype.onSlide = function () {
    var self = this;
    var startTime = 0;
    var invalidBorderRange = self.option.invalidBorderRange;
    this.ele.addEventListener('touchstart', function (evt) {
      if (ineffect(evt) || self.identifier !== null) {
        return;
      }
      var x = evt.targetTouches[0].clientX;
      var y = evt.targetTouches[0].clientY;
      typeof self.onTouchStart === 'function' && self.onTouchStart(x, y);
      if (self.option.invalidBorderRange &&
        (x < self.width * invalidBorderRange ||
        x > self.width * (1 - invalidBorderRange) ||
        y < self.height * invalidBorderRange ||
        y > self.height * (1 - invalidBorderRange))) {
        return;
      }
      self.identifier = evt.changedTouches[0].identifier;
      startTime = new Date().getTime();
      self.slideData.startX = x;
      self.slideData.startY = y;
    }, false);
    this.ele.addEventListener('touchmove', function (evt) {
      if (self.option.preventDefault) {
        evt.stopPropagation();
        evt.preventDefault();
      }
      if (ineffect(evt) || evt.changedTouches[0].identifier !== self.identifier) {
        return;
      }
      if (typeof self.onMove === 'function') {
        self.slideData.endX = evt.changedTouches[0].clientX;
        self.slideData.endY = evt.changedTouches[0].clientY;
        self.onMove(self.slideData.endX - self.slideData.startX, self.slideData.endY - self.slideData.startY);
      }
    }, false);
    this.ele.addEventListener('touchend', function (evt) {
      if (ineffect(evt) || evt.changedTouches[0].identifier !== self.identifier) {
        return;
      }
      self.identifier = null;
      self.slideData.endX = evt.changedTouches[0].clientX;
      self.slideData.endY = evt.changedTouches[0].clientY;
      var runX = self.slideData.endX - self.slideData.startX;
      var runY = self.slideData.endY - self.slideData.startY;
      typeof self.onTouchEnd === 'function' && self.onTouchEnd(runX, runY);
      self.slideData.distanceX = Math.abs(runX);
      self.slideData.distanceY = Math.abs(runY);
      // 是否达到有效距离
      if (self.option.distance &&
        self.slideData.distanceX < self.option.distance && self.slideData.distanceY < self.option.distance) {
        return;
      }
      // 是否滑动时间在限定时间内
      if (new Date().getTime() - startTime > self.option.spacingTime) {
        return;
      }
      if (self.slideData.distanceX < self.slideData.distanceY) {
        // 上下划
        if (self.slideData.endY < self.slideData.startY) {
          // 上划
          typeof self.onSlideUp === 'function' && self.onSlideUp();
        } else {
          // 下划
          typeof self.onSlideDown === 'function' && self.onSlideDown();
        }
      } else {
        // 左右划
        if (self.slideData.endX < self.slideData.startX) {
          // 左划
          typeof self.onSlideLeft === 'function' && self.onSlideLeft();
        } else {
          // 右划
          typeof self.onSlideRight === 'function' && self.onSlideRight();
        }
      }
    }, false);
  };

  if (typeof exports !== 'undefined') {
    module.exports = SlideEvt;
  } else if (typeof define === "function") {
    define([], function () {
      return SlideEvt;
    });
  } else {
    window.SlideEvent = SlideEvt;
  }

})();
