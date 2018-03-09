# slide-event
滑动手势动画插件

## Description

在某一 dom 上绑定滑动手势事件，包括上下左右滑动和滑动中的事件监听。

## Installation

~~~
npm i 
~~~

## Demo

### mac 

```
$ python -m SimpleHTTPServer 8080
```

在浏览器里打开 `http://localhost:8080/example/`

## Usage

~~~
import SlideEvent from 'slide-event';

const slideEvent =  new SlideEvent('domId');

slideEvent.onSlideLeft = () => {
  console.log('slide left');
}

slideEvent.onMove = (x, y) => {
  console.log('Sliding distance: x=>' + x + '; y=>' + y);
};
~~~

## API

~~~
new SlideEvent(domId:string, option:object);
~~~

### option

* distance：默认80，px，最小滑动事件阀值；
* spacingTime：默认1000，毫秒，滑动的有效时间，超时无效；
* preventDefault：默认 false，阻止事件冒泡；
* invalidBorderRange：默认 0.05，滑动无效的边框范围比例，为了防止移动端从边框滑动时会拉起手机自带的菜单。

