/**
 *String Utility Tool
 *gwStringUtility.js
 *@NApiVersion 2.x
 */
define(['N/format'], function (format) {
  //字串補0
  function padding(str, length) {
    return (Array(length).join('0') + str).slice(-length)
  }

  function test1(str, length) {
    return (Array(length).join('0') + str).slice(-length)
  }

  function trim(str) {
    if (typeof str === 'undefined' || str == null || str.length == 0 || !str) {
      str = ''
    }
    
    if (typeof str === 'string') str = str.trim()
    return str
  }

  function trimOrAppendBlank(str) {
    if (typeof str === 'undefined' || str == null || str.length == 0 || !str) {
      str = ' '
    } else {
      if (typeof str === 'string') str = str.trim()
    }
    return str
  }

  function convertToFloat(str) {
    if (typeof str === 'undefined' || str == null || str.length == 0 || !str || ((typeof str === 'string') && !str.trim())) {
      str = '0'
    } else {
      if (typeof str === 'string') str = str.trim()
      else str.toString()
    }
    return parseFloat(str)
  }

  function convertToInt(str) {
    if (typeof str === 'undefined' || str == null || str.length == 0) {
      str = '0'
    } else {
      if (typeof str === 'string') str = str.trim()
      else str.toString()
    }
    return parseInt(str)
  }

  //中文字長度檢查
  function checkByteLength(str) {
    // returns the byte length of an utf8 string
    var s = str.length
    for (var i = str.length - 1; i >= 0; i--) {
      var code = str.charCodeAt(i)
      if (code > 0x7f && code <= 0x7ff) s++
      else if (code > 0x7ff && code <= 0xffff) s += 2
      if (code >= 0xdc00 && code <= 0xdfff) i-- //trail surrogate
    }
    return s
  }

  return {
    trim: trim,
    checkByteLength: checkByteLength,
    convertToFloat: convertToFloat,
    convertToInt: convertToInt,
    trimOrAppendBlank: trimOrAppendBlank,
    padding: padding,
    test1: test1,
  }
})
