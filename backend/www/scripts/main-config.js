require.config({
  //appDir: "backend/scripts/",
  //baseUrl: "./",
  //baseUrl: "scripts",//"backend/scripts/",
  paths: {

    "recording": "modules/recording",
    "replay": "modules/replay",
    "auth": "modules/auth",

    "liveMap.status": "shared/livemap_status",
    "liveMap.popcorn": "shared/livemap_popcorn",

    // Libraries
    "socket.io": "shared/lib/socket.io-0.9.6",
    "popcorn": "shared/lib/popcorn-complete-1.3",
    "jquery": "lib/jquery-1.8.0",
    "underscore": "lib/underscore-1.3.3",
    "backbone": "lib/backbone-0.9.2",

    // When optimizing with r.js, include almond shim
    "almond": "lib/almond-0.1.3"
  },
  shim: {
    // Shim the shared front-end logic because the code hosted on PBS.com is
    // not Require.js-compatible
    "liveMap.status": {
      deps: ["jquery"],
      exports: "liveMap"
    },
    "liveMap.popcorn": {
      deps: ["jquery", "popcorn"],
      exports: "liveMap"
    },
    "jst": {
      exports: "JST"
    },
    "jquery": {
      exports: "jQuery"
    },
    "underscore": {
      exports: "_"
    },
    "backbone": {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    "socket.io": {
      exports: "io"
    },
    "popcorn": {
      exports: "Popcorn"
    }
  },
  // The directory path to save the output
  //dir: "backend/www/scripts",
  name: "app",
  include: "almond",
  insertRequire: ["app"],
  out: "require.js"
});

require(["app"], function(app) {
    if (typeof console !== "undefined") {
        console.log("Loading in development mode...");
    }
});
