/**
 * Module Dependencies
 */

var iterator = require('dom-iterator');

/**
 * Export `HTMLPipe`
 */

module.exports = HTMLPipe;

/**
 * Initialize `HTMLPipe`
 *
 * @param {Element} el 
 * @return {HTMLPipe}
 * @api public
 */

function HTMLPipe(el) {
  if (!(this instanceof HTMLPipe)) return new HTMLPipe(el);
  this.it = iterator(el.firstChild, el).revisit(false);
  this.pipes = [];
  this.el = el;
}

/**
 * Add a transform to the pipe
 *
 * @param {Function} fn
 * @return {HTMLPipe} self
 * @api public
 */

HTMLPipe.prototype.pipe = function(fn) {
  this.pipes.push(fn);
  return this;
};

/**
 * Run the pipeline
 *
 * @return {HTMLPipe} 
 * @api public
 */

HTMLPipe.prototype.run = function() {
  var pipes = this.pipes;
  var len = pipes.length;
  var next = this.it.node;
  var it = this.it;
  var parent;
  var child;
  var ret;
  var i;

  while (next) {
    parent = next.parentNode;

    for (i = 0; i < len; i++) {
      ret = pipes[i](next);

      // ignore, remove, unwrap, or replace
      // depending on what is returned.
      if (undefined === ret) {
        // ignore and continue with
        // the rest of the transforms
        continue;
      } else if (null === ret) {
        // once we've removed the node,
        // skip over the other transforms
        it.prev();
        parent.removeChild(next);
        break;
      } else if (false == ret) {
        // once we've unwrapped the node,
        // skip over the other transforms
        // and start on the first child
        // that was unwrapped
        it.prev();
        ret = unwrap(next);
        parent.replaceChild(ret, next);
        break;
      } else if ('string' == typeof ret || 'number' == typeof ret) {
        // replace the node with a textnode
        // set the current node to the
        // replacement and continue
        ret = document.createTextNode(ret);
        parent.replaceChild(ret, next);
        it.reset(ret);
        next = ret;
      } else if (1 == ret.nodeType) {
        // replace the node with a textnode
        // set the current node to the
        // replacement and continue
        parent.replaceChild(ret, next);
        it.reset(ret);
        next = ret;
      } else if (11 == ret.nodeType) {
        var child = ret.firstChild;
        parent.replaceChild(ret, next);
        it.reset(child);
        next = child;
      }
    }

    next = it.next();
  }

  // cleanup the split textnodes
  if (this.el.normalize) this.el.normalize();

  return this.el;
};

/**
 * Unwrap an element
 *
 * @param {Element} el 
 * @return {DocumentFragment} frag
 */

function unwrap(el) {
  var frag = document.createDocumentFragment();
  while (el.childNodes.length) {
    frag.appendChild(el.firstChild);
  }
  return frag;
}
