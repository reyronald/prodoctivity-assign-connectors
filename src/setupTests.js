const NODE_TYPE = Object.freeze({
  ELEMENT_NODE: 1
});
window.Element.prototype.closest =
  window.Element.prototype.closest ||
  function(selectors) {
    // https://dom.spec.whatwg.org/#dom-element-closest
    let el = this;
    while (el && el.nodeType === NODE_TYPE.ELEMENT_NODE) {
      if (el.matches(selectors)) {
        return el;
      }
      el = el.parentNode;
    }
    return null;
  };
