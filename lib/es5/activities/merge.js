"use strict";
"use strict";
var Activity = require("./activity");
var util = require("util");
var _ = require("lodash");
function Merge() {
  Activity.call(this);
  this.isTrue = true;
  this.isFalse = false;
}
util.inherits(Merge, Activity);
Merge.prototype.run = function(callContext, args) {
  callContext.schedule(args, "_argsGot");
};
Merge.prototype._argsGot = function(callContext, reason, result) {
  if (reason !== Activity.states.complete) {
    callContext.end(reason, result);
    return ;
  }
  var merged;
  var mergedIsObj = false;
  var mergedIsArray = false;
  var $__10 = true;
  var $__11 = false;
  var $__12 = undefined;
  try {
    for (var $__8 = void 0,
        $__7 = (result)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__10 = ($__8 = $__7.next()).done); $__10 = true) {
      var item = $__8.value;
      {
        var isObj = _.isPlainObject(item);
        var isArray = _.isArray(item);
        if (isObj || isArray) {
          if (!merged) {
            merged = isObj ? _.cloneDeep(item) : item.slice(0);
            mergedIsObj = isObj;
            mergedIsArray = isArray;
          } else if (isObj) {
            if (!mergedIsObj) {
              callContext.fail(new Error("Object cannot merged with an array."));
              return ;
            }
            _.extend(merged, item);
          } else {
            if (!mergedIsArray) {
              callContext.fail(new Error("Array cannot merged with an object."));
              return ;
            }
            var $__3 = true;
            var $__4 = false;
            var $__5 = undefined;
            try {
              for (var $__1 = void 0,
                  $__0 = (item)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__3 = ($__1 = $__0.next()).done); $__3 = true) {
                var sub = $__1.value;
                {
                  merged.push(sub);
                }
              }
            } catch ($__6) {
              $__4 = true;
              $__5 = $__6;
            } finally {
              try {
                if (!$__3 && $__0.return != null) {
                  $__0.return();
                }
              } finally {
                if ($__4) {
                  throw $__5;
                }
              }
            }
          }
        } else {
          callContext.fail(new Error("Only objects and arrays could be merged."));
          return ;
        }
      }
    }
  } catch ($__13) {
    $__11 = true;
    $__12 = $__13;
  } finally {
    try {
      if (!$__10 && $__7.return != null) {
        $__7.return();
      }
    } finally {
      if ($__11) {
        throw $__12;
      }
    }
  }
  callContext.complete(merged);
};
module.exports = Merge;
//# sourceMappingURL=data:application/json;base64,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YUFBMEI7QUFDMUIsVUFBb0IsS0FBRyxDQUFDO0FBQ3hCLGdCQUFvQyxDQUFDO0VBQ3ZDLENBQUUsT0FBUTtBQUNSLE1BQUk7QUFDRixTQUFJLE1BQWlCLEdBQUssQ0FBQSxXQUF1QixHQUFLLEtBQUcsQ0FBRztBQUMxRCxrQkFBd0IsQUFBQyxFQUFDLENBQUM7TUFDN0I7QUFBQSxJQUNGLENBQUUsT0FBUTtBQUNSLGVBQXdCO0FBQ3RCLG1CQUF3QjtNQUMxQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsQUF3Q0osWUFBVSxTQUFTLEFBQUMsQ0FBQyxNQUFLLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBRUQsS0FBSyxRQUFRLEVBQUksTUFBSSxDQUFDO0FBQUEiLCJmaWxlIjoiYWN0aXZpdGllcy9tZXJnZS5qcyIsInNvdXJjZVJvb3QiOiJsaWIvZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmxldCBBY3Rpdml0eSA9IHJlcXVpcmUoXCIuL2FjdGl2aXR5XCIpO1xubGV0IHV0aWwgPSByZXF1aXJlKFwidXRpbFwiKTtcbmxldCBfID0gcmVxdWlyZShcImxvZGFzaFwiKTtcblxuZnVuY3Rpb24gTWVyZ2UoKSB7XG4gICAgQWN0aXZpdHkuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuaXNUcnVlID0gdHJ1ZTtcbiAgICB0aGlzLmlzRmFsc2UgPSBmYWxzZTtcbn1cblxudXRpbC5pbmhlcml0cyhNZXJnZSwgQWN0aXZpdHkpO1xuXG5NZXJnZS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKGNhbGxDb250ZXh0LCBhcmdzKSB7XG4gICAgY2FsbENvbnRleHQuc2NoZWR1bGUoYXJncywgXCJfYXJnc0dvdFwiKTtcbn07XG5cbk1lcmdlLnByb3RvdHlwZS5fYXJnc0dvdCA9IGZ1bmN0aW9uIChjYWxsQ29udGV4dCwgcmVhc29uLCByZXN1bHQpIHtcbiAgICBpZiAocmVhc29uICE9PSBBY3Rpdml0eS5zdGF0ZXMuY29tcGxldGUpIHtcbiAgICAgICAgY2FsbENvbnRleHQuZW5kKHJlYXNvbiwgcmVzdWx0KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBtZXJnZWQ7XG4gICAgbGV0IG1lcmdlZElzT2JqID0gZmFsc2U7XG4gICAgbGV0IG1lcmdlZElzQXJyYXkgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpdGVtIG9mIHJlc3VsdCkge1xuICAgICAgICBsZXQgaXNPYmogPSBfLmlzUGxhaW5PYmplY3QoaXRlbSk7XG4gICAgICAgIGxldCBpc0FycmF5ID0gXy5pc0FycmF5KGl0ZW0pO1xuICAgICAgICBpZiAoaXNPYmogfHwgaXNBcnJheSkge1xuICAgICAgICAgICAgaWYgKCFtZXJnZWQpIHtcbiAgICAgICAgICAgICAgICBtZXJnZWQgPSBpc09iaiA/IF8uY2xvbmVEZWVwKGl0ZW0pIDogaXRlbS5zbGljZSgwKTtcbiAgICAgICAgICAgICAgICBtZXJnZWRJc09iaiA9IGlzT2JqO1xuICAgICAgICAgICAgICAgIG1lcmdlZElzQXJyYXkgPSBpc0FycmF5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNPYmopIHtcbiAgICAgICAgICAgICAgICBpZiAoIW1lcmdlZElzT2JqKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxDb250ZXh0LmZhaWwobmV3IEVycm9yKFwiT2JqZWN0IGNhbm5vdCBtZXJnZWQgd2l0aCBhbiBhcnJheS5cIikpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF8uZXh0ZW5kKG1lcmdlZCwgaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIW1lcmdlZElzQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbENvbnRleHQuZmFpbChuZXcgRXJyb3IoXCJBcnJheSBjYW5ub3QgbWVyZ2VkIHdpdGggYW4gb2JqZWN0LlwiKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgc3ViIG9mIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VkLnB1c2goc3ViKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjYWxsQ29udGV4dC5mYWlsKG5ldyBFcnJvcihcIk9ubHkgb2JqZWN0cyBhbmQgYXJyYXlzIGNvdWxkIGJlIG1lcmdlZC5cIikpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhbGxDb250ZXh0LmNvbXBsZXRlKG1lcmdlZCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lcmdlOyJdfQ==