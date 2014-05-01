/**
 * Module Dependencies
 */

var domify = require('domify');
var assert = require('assert');
var htmlpipe = require('html-pipe');

/**
 * HTML
 */

function id(el) {
  return el.nodeType == 3 ? el.nodeValue : el.nodeName;
}

/**
 * Tests
 */

describe('html-pipe', function() {
  
  it('should ignore nodes', function() {
    var dom = domify('hi <strong>there</strong> automattic!');
    var values = ['hi ', 'STRONG', 'there', ' automattic!'];
    
    dom = htmlpipe(dom)
      .pipe(ignore)
      .pipe(test)
      .run()

    function ignore(el) {
      return;
    }

    function test(el) {
      var val = values.shift()
      assert(val == id(el), val + ' does not equal: ' + id(el));
    }
  })

  it('should transform nodes', function() {
    var dom = domify('hi <strong>th<em>er</em>e</strong> automattic!');
    var values = ['hi ', 'th', 'EM', 'er', 'e', ' automattic!'];
    var transformCalls = 7;
    var testCalls = 6;
    
    dom = htmlpipe(dom)
      .pipe(transform)
      .pipe(test)
      .run()

    assert(!transformCalls);
    assert(!testCalls);

    function transform(el) {
      transformCalls--;
      if ('STRONG' == el.nodeName) return false;
    }

    function test(el) {
      testCalls--;
      var val = values.shift();
      assert(val == id(el), val + ' does not equal: ' + id(el));
    }
  })

  it('should transform nodes even when empty', function() {
    var dom = domify('hi <strong></strong> automattic!');
    var values = ['hi ', ' automattic!'];
    var transformCalls = 3;
    var testCalls = 2;
    
    dom = htmlpipe(dom)
      .pipe(transform)
      .pipe(test)
      .run()

    assert(!transformCalls);
    assert(!testCalls);

    function transform(el) {
      transformCalls--;
      if ('STRONG' == el.nodeName) return false;
    }

    function test(el) {
      testCalls--;
      var val = values.shift();
      assert(val == id(el), val + ' does not equal: ' + id(el));
    }
  })

  it('should remove nodes', function() {
    var dom = domify('hi <strong>th<em>er</em>e</strong> automattic!');
    var values = ['hi ', ' automattic!'];
    var transformCalls = 3;
    var testCalls = 2;
    
    dom = htmlpipe(dom)
      .pipe(transform)
      .pipe(test)
      .run()

    assert(!transformCalls);
    assert(!testCalls);

    function transform(el) {
      transformCalls--;
      if ('STRONG' == el.nodeName) return null;
    }

    function test(el) {
      testCalls--;
      var val = values.shift();
      assert(val == id(el), val + ' does not equal: ' + id(el));
    }
  })

  it('should remove nodes even when empty', function() {
    var dom = domify('hi <strong></strong> automattic!');
    var values = ['hi ', ' automattic!'];
    var transformCalls = 3;
    var testCalls = 2;
    
    dom = htmlpipe(dom)
      .pipe(transform)
      .pipe(test)
      .run()

    assert(!transformCalls);
    assert(!testCalls);

    function transform(el) {
      transformCalls--;
      if ('STRONG' == el.nodeName) return null;
    }

    function test(el) {
      testCalls--;
      var val = values.shift();
      assert(val == id(el), val + ' does not equal: ' + id(el));
    }
  })

  it('should replace nodes', function() {
    var dom = domify('hi <strong>th<em>er</em>e</strong> automattic!');
    var values = ['hi ', 'U', 'th', 'EM', 'er', 'e', ' automattic!'];
    var transformCalls = 7;
    var testCalls = 7;
    
    dom = htmlpipe(dom)
      .pipe(transform)
      .pipe(test)
      .run()

    assert(!transformCalls);
    assert(!testCalls);

    function transform(el) {
      transformCalls--;
      if ('STRONG' == el.nodeName) {
        var u = document.createElement('u');
        u.innerHTML = el.innerHTML;
        return u;
      }
    }

    function test(el) {
      testCalls--;
      var val = values.shift();
      assert(val == id(el), val + ' does not equal: ' + id(el));
    }
  })

  it('should replace nodes when replacement is empty', function() {
    var dom = domify('hi <strong>th<em>er</em>e</strong> automattic!');
    var values = ['hi ', 'U', ' automattic!'];
    var transformCalls = 3;
    var testCalls = 3;
    
    dom = htmlpipe(dom)
      .pipe(transform)
      .pipe(test)
      .run()

    assert(!transformCalls);
    assert(!testCalls);

    function transform(el) {
      transformCalls--;
      if ('STRONG' == el.nodeName) {
        var u = document.createElement('u');
        return u;
      }
    }

    function test(el) {
      testCalls--;
      var val = values.shift();
      assert(val == id(el), val + ' does not equal: ' + id(el));
    }
  })

  it('should replace elements with strings', function() {
    var dom = domify('hi <strong>th<em>er</em>e</strong> automattic!');
    var values = ['hi ', 'awesome ', ' automattic!'];
    var transformCalls = 3;
    var testCalls = 3;
    
    dom = htmlpipe(dom)
      .pipe(transform)
      .pipe(test)
      .run()

    assert(!transformCalls);
    assert(!testCalls);

    function transform(el) {
      transformCalls--;
      if ('STRONG' == el.nodeName) return 'awesome ';
    }

    function test(el) {
      testCalls--;
      var val = values.shift();
      assert(val == id(el), val + ' does not equal: ' + id(el));
    }
  })

  it('should replace textnodes with elements', function() {
    var dom = domify('hi <strong>th<em>er</em>e</strong> automattic!');
    var values = ['hi ', 'STRONG', 'th', 'EM', 'er', 'e', 'U', ' automattic!'];
    var transformCalls = 8;
    var testCalls = 8;
    
    dom = htmlpipe(dom)
      .pipe(transform)
      .pipe(test)
      .run()

    assert(!transformCalls);
    assert(!testCalls);

    function transform(el) {
      transformCalls--;
      if (' automattic!' == el.nodeValue && 'U' !== el.parentNode.nodeName) {
        var u = document.createElement('u');
        u.innerText = el.nodeValue;
        return u;
      }
    }

    function test(el) {
      testCalls--;
      var val = values.shift();
      assert(val == id(el), val + ' does not equal: ' + id(el));
    }
  })

  it('should replace elements with a document fragment', function() {
    var dom = domify('hi <strong>th<em>er</em>e</strong> automattic!');
    var values = ['hi ', 'B', 'awes', 'U', 'ome', ' automattic!'];
    var transformCalls = 6;
    var testCalls = 6;
    
    dom = htmlpipe(dom)
      .pipe(transform)
      .pipe(test)
      .run()

    assert(!transformCalls, 'number of transform calls is wrong');
    assert(!testCalls, 'number of test calls is wrong');

    function transform(el) {
      transformCalls--;
      if ('STRONG' == el.nodeName) {
        var el = domify('<b>awes</b><u>ome</u>');
        return el;
      }
    }

    function test(el) {
      testCalls--;
      var val = values.shift();
      assert(val == id(el), val + ' does not equal: ' + id(el));
    }
  })

  it('should remove first children', function() {
    var dom = domify('<meta>hi <strong>th<em>er</em>e</strong> automattic!');
    var values = ['hi ', 'STRONG', 'th', 'EM', 'er', 'e', ' automattic!'];
    var transformCalls = 8;
    var testCalls = 7;
    
    dom = htmlpipe(dom)
      .pipe(transform)
      .pipe(test)
      .run()

    assert(!transformCalls, 'number of transform calls is wrong');
    assert(!testCalls, 'number of test calls is wrong');

    function transform(el) {
      transformCalls--;
      if ('META' == el.nodeName) return null;
    }

    function test(el) {
      testCalls--;
      var val = values.shift();
      assert(val == id(el), val + ' does not equal: ' + id(el));
    }
  })
});
