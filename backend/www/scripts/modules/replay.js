define([
    "jst",
    "jquery",
    "underscore",
    "backbone"
  ], function(JST, $, _, Backbone) {

    var Replay = Backbone.Model.extend({
        urlRoot: "/recording",
        defaults: {
            // TODO: Infer the type on the backend from the route used
            type: "replay"
        }
    });
    var Replays = Backbone.Collection.extend({
        model: Replay,
        url: function() {
            return "/recording?recordingID=" + this.recordingID;
        }
    });

    var ReplayListItem = Backbone.View.extend({
        tagName: "li",
        className: "replay",
        template: JST["backend/templates/replay-list-item.html"],
        initialize: function() {
            this.$el.data("timestamp", this.model.timeStamp);
            this.model.on("change", _.bind(this.render,this));
            this.model.on("destroy", _.bind(this.remove, this));
        },
        events: {
            "click .delete-replay": "requestDestroy"
        },
        requestDestroy: function() {
            this.model.destroy();
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var ReplayEntry = Backbone.View.extend({
        template: JST["backend/templates/replay-entry.html"],
        initialize: function() {
            this.$el.html(this.template());
        },
        events: {
            "click .add-replay": "requestAdd"
        },
        serialize: function() {
            return {
                timeStamp: Date.parse(this.$("input").val()),
                recordingID: this.collection.recordingID
            };
        },
        requestAdd: function() {
            this.collection.create(this.serialize());
        }
    });

    var ReplayList = Backbone.View.extend({
        className: "replay-list",
        initialize: function() {
            this.collection.on("reset", this.render, this);
            this.collection.on("add", this.add, this);
            this.$listing = $("<ul>");
            this.$el.append(this.$listing);
            this.$el.append(new ReplayEntry({ collection: this.collection }).render().el);
        },
        add: function(model) {
            this.$listing.append(new ReplayListItem({ model: model }).render().el);
        },
        render: function() {
            this.$listing.empty();
            this.collection.each(function(model) {
                this.add(model);
            }, this);
            return this;
        }
    });


    return {
      model: Replay,
      collection: Replays,
      views: {
        entry: ReplayEntry,
        listItem: ReplayListItem,
        list: ReplayList
      }
    };
  });
