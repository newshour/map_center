(function() {
  this.JST || (this.JST = {});
  this.JST["templates/ltm_featured_clips"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        var i, item, page, pages, _i, _j, _len, _len1;
      
        if (this.set.length >= 1) {
          __out.push('\n\t');
          pages = [];
          __out.push('\n\t');
          _(this.set).each_slice(this.per_page, function(group) {
            return pages.push(group);
          });
          __out.push('\n\t');
          for (i = _i = 0, _len = pages.length; _i < _len; i = ++_i) {
            page = pages[i];
            __out.push('\n\t\t<div class="feature_page ');
            if (i === 0) {
              __out.push(__sanitize('selected'));
            }
            __out.push('" data-page-num="');
            __out.push(__sanitize(i + 1));
            __out.push('" ');
            if (i !== 0) {
              __out.push('style="display: none"');
            }
            __out.push('>\n\t\t');
            for (_j = 0, _len1 = page.length; _j < _len1; _j++) {
              item = page[_j];
              __out.push('\n\t\t\t<div class="item" data-content-id="');
              __out.push(__sanitize(item.id));
              __out.push('">\n\t\t\t\t<img src="');
              __out.push(__sanitize(item.thumb));
              __out.push('" />\n\t\t\t\t<span class="title"><div>');
              __out.push(__sanitize(item.title));
              __out.push('</div></span>\n\t\t\t</div>\n\t\t');
            }
            __out.push('\n\t\t</div>\n\t');
          }
          __out.push('\n');
        } else {
          __out.push('\n\t<p> This state currently has no content available</p>\n');
        }
      
        __out.push('\t\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
