(function() {
  var click_handler, initialize, inject_box, is_box_visible, place_guider_note, place_intro_guider_note, root, watch;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  is_box_visible = function(color) {
    var selector;
    selector = "." + color + "box:visible";
    return $(selector).length > 0;
  };

  watch = function(fn, args, timeout) {
    var curr_probe, dfd, probe;
    dfd = new jQuery.Deferred();
    curr_probe = null;
    probe = function() {
      if (fn(args)) {
        dfd.resolve(args);
        return curr_probe = null;
      } else {
        return curr_probe = setTimeout(probe, 5);
      }
    };
    if (timeout) {
      setTimeout(function() {
        curr_probe && clearTimeout(curr_probe);
        return dfd.reject(args);
      }, timeout);
    }
    probe();
    return dfd.promise();
  };

  inject_box = function(color) {
    var box_html;
    box_html = "<div id=\"" + color + "-box\" class='box " + color + "box'></div";
    return $(box_html).appendTo('#canvas');
  };

  click_handler = function(ev) {
    var $target;
    $target = $(ev.target);
    if ($target.is('#red-box')) {
      if (is_box_visible('red')) return;
      return inject_box('red');
    } else if ($target.is('#green-box')) {
      if (is_box_visible('green')) return;
      return inject_box('green');
    }
  };

  place_guider_note = function() {
    var guider_note;
    guider_note = {
      attachTo: "#blue-box",
      buttons: [
        {
          name: "Close",
          onclick: guiders.hideAll
        }
      ],
      description: "Voila!\nThis box appeared because both red and green boxes have appeared on\nour screen. ",
      position: 2,
      title: "Blue Box",
      width: 230
    };
    return guiders.createGuider(guider_note).show();
  };

  place_intro_guider_note = function() {
    var guider_note;
    guider_note = {
      attachTo: "#nav",
      buttons: [
        {
          name: "Close",
          onclick: guiders.hideAll
        }
      ],
      description: "1. Use buttons to inject color boxes below <br/>\n2. If green and red boxes appear on the screen, blue box will appear automatically<br />",
      position: 2,
      title: "Inject Boxes",
      width: 230
    };
    return guiders.createGuider(guider_note).show();
  };

  initialize = function() {
    $('#nav').bind('click', click_handler);
    place_intro_guider_note();
    watch(is_box_visible, 'red').then(function(status) {}, function(status) {
      return alert("" + status + " with failure ....");
    });
    return $.when(watch(is_box_visible, 'green'), watch(is_box_visible, 'red')).then(function() {
      inject_box('blue');
      return place_guider_note();
    });
  };

  $(document).ready(initialize);

}).call(this);
