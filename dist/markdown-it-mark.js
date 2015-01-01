/*! markdown-it-mark 0.1.0 https://github.com//markdown-it/markdown-it-mark @license MIT */!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.markdownitMark=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';


// parse sequence of markers,
// "start" should point at a valid marker
function scanDelims(state, start) {
  var pos = start, lastChar, nextChar, count,
      can_open = true,
      can_close = true,
      max = state.posMax,
      marker = state.src.charCodeAt(start);

  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : -1;

  while (pos < max && state.src.charCodeAt(pos) === marker) { pos++; }
  if (pos >= max) { can_open = false; }
  count = pos - start;

  nextChar = pos < max ? state.src.charCodeAt(pos) : -1;

  // check whitespace conditions
  if (nextChar === 0x20 || nextChar === 0x0A) { can_open = false; }
  if (lastChar === 0x20 || lastChar === 0x0A) { can_close = false; }

  return {
    can_open: can_open,
    can_close: can_close,
    delims: count
  };
}

function mark(state, silent) {
  var startCount,
      count,
      tagCount,
      found,
      stack,
      res,
      max = state.posMax,
      start = state.pos,
      marker = state.src.charCodeAt(start);

  if (marker !== 0x3D/* = */) { return false; }
  if (silent) { return false; } // don't run any pairs in validation mode

  res = scanDelims(state, start);
  startCount = res.delims;

  if (!res.can_open) {
    state.pos += startCount;
    // Earlier we checked !silent, but this implementation does not need it
    state.pending += state.src.slice(start, state.pos);
    return true;
  }

  stack = Math.floor(startCount / 2);
  if (stack <= 0) { return false; }
  state.pos = start + startCount;

  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) === marker) {
      res = scanDelims(state, state.pos);
      count = res.delims;
      tagCount = Math.floor(count / 2);
      if (res.can_close) {
        if (tagCount >= stack) {
          state.pos += count - 2;
          found = true;
          break;
        }
        stack -= tagCount;
        state.pos += count;
        continue;
      }

      if (res.can_open) { stack += tagCount; }
      state.pos += count;
      continue;
    }

    state.md.inline.skipToken(state);
  }

  if (!found) {
    // parser failed to find ending tag, so it's not valid emphasis
    state.pos = start;
    return false;
  }

  // found!
  state.posMax = state.pos;
  state.pos = start + 2;

  // Earlier we checked !silent, but this implementation does not need it
  state.push({ type: 'mark_open', level: state.level++ });
  state.md.inline.tokenize(state);
  state.push({ type: 'mark_close', level: --state.level });

  state.pos = state.posMax + 2;
  state.posMax = max;
  return true;
}


function mark_open()  { return '<mark>'; }
function mark_close() { return '</mark>'; }


module.exports = function mark_plugin(md) {
  md.inline.ruler.before('emphasis', 'mark', mark);
  md.renderer.rules.mark_open = mark_open;
  md.renderer.rules.mark_close = mark_close;
};

},{}]},{},[1])(1)
});