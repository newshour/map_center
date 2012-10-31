(function() {
  this.JST || (this.JST = {});
  this.JST["templates/ltm_showcase_panel"] = function(__obj) {
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
      
        if (this.feature) {
          __out.push('\t\n\t<div id="view-port-zone">\n\t\t<div id="video-meta-panel">\n\t\t\t<div class="v_title">');
          __out.push(__sanitize(this.feature.title));
          __out.push('</div>\n\t\t\t<div class="post_details">\n\t\t\t\t<img src="');
          __out.push(__sanitize(this.feature.avatar || 'https://lh3.googleusercontent.com/-rlY3yjlBYLE/AAAAAAAAAAI/AAAAAAAAAAA/YBUwSWMcVJU/s88-c-k/photo.jpg'));
          __out.push('" />\n\t\t\t\t<span class="contributor">');
          __out.push(__sanitize(this.feature.post_name));
          __out.push('</span>\n\t\t\t\t<span class="add_date">');
          __out.push(__sanitize(this.feature.date));
          __out.push('</span>\n\t\t\t</div>\n\t\t\t<div class="post_meta">\n\t\t\t\t<div class="post_location">');
          if (this.feature.city) {
            __out.push(__sanitize(this.feature.city + ', '));
          }
          __out.push(__sanitize(this.feature.state));
          __out.push('</div>\n\t\t\t\t<div class="post_political_aff">');
          __out.push(__sanitize(this.feature.affiliation));
          __out.push('</div>\n\t\t\t\t<div class="post_issues">');
          __out.push(__sanitize(this.feature.issues));
          __out.push('</div>\n\t\t\t</div>\t\n\t\t</div>\n\t\t<div id="video-drop">\n\t\t\t<iframe width="533" height="300" src="');
          __out.push(__sanitize(this.feature.media));
          __out.push('" frameborder="0" allowfullscreen></iframe>\n\t\t</div>\n\t</div>\n');
        } else {
          __out.push('\n\t<div id="view-port-zone">\n\t\t<div id="video-meta-panel">\n\t\t</div>\n\t\t<div id="video-drop">\n\t\t\t<p style="text-align: center; width: 340px; padding: 50px; color: white; margin:0 auto;">Sorry, this media could not be located. Please select another below.</p>\n\t\t</div>\n\t</div>\n');
        }
      
        __out.push('\t\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
