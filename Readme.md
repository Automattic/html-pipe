
# html-pipe

  Pluggable HTML Pipeline

## Installation

  Install with [component(1)](http://component.io):

    $ component install automattic/html-pipe

## Example

```html
<p>this is a <span style="font-size: 18pt">wonderful</span> example of our html <em>pipeline!</em><p>
```

```js
var p = document.getElementsByTagName('p')[0];

var out = htmlpipe(p)
  .pipe(sanitize)
  .pipe(highlight)
  .run()

// unwrap spans with inline styles
function sanitize(el) {
  if ('SPAN' == el.nodeName && el.getAttribute('style')) {
    return false;
  }
}

// turn em's into mark's
function highlight(el) {
  if ('EM' == el.nodeName) {
    var mark = document.createElement('mark');
    mark.innerHTML = el.innerHTML;
    return mark;
  }
}

console.log(out.innerHTML);
// this is a wonderful example of our html <mark>pipeline!</mark>
```

## API

### HTMLPipe(el)

  Initialize the pipeline with `el`.

### htmlpipe#pipe(fn)

  Add a transform to the pipeline. The pipeline changes it's action
  based on the return value of `fn`. Here's a list of possible values:

  - `undefined`: skip the transform and move to the next one
  - `null`: remove the node from the transform. skip remaining transforms for the node.
  - `false`: unwrap the node, so it's contents are at the same level as the original node. skip remaining transforms on unwrapped node, moving on to the first child.
  - `element`: replace the current node with a new node. pass the new element through the rest of the transforms
  - `string` or `number`: replace the current node with a textnode containing the string or number. pass the textnode through the rest of the transforms

  Check out the tests to see each of these transforms in action.

### htmlpipe#run()

  Run the pipeline, returning the transformed `el`.

## Testing

```js
npm install component-test
make test
```

## License

  The MIT License (MIT)

  Copyright (c) 2014 <copyright holders>

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
