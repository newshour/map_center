(function( window ) {

    // Dependencies
    var $ = window.jQuery;
    var _ = window._;
    var Backbone = window.Backbone;

    var BroadcastEvent = Backbone.Model.extend({
        urlRoot: "/broadcastevent",
        defaults: {
            comments: ""
        },
        initialize: function() {
            this.on("error", this.destroy, this);
        }
    });
    var BroadcastEvents = Backbone.Collection.extend({
        model: BroadcastEvent,
        url: "/broadcastevent"
    });

    var BroadcastListItem = Backbone.View.extend({
        tagName: "li",
        className: "broadcast-listitem",
        template: _.template("Hey <%= name %>! <div class='delete'>&times;</div>"),
        initialize: function() {
            this.model.on("change", _.bind(this.render,this));
            this.model.on("destroy", _.bind(this.remove, this));
        },
        events: {
            "click .delete": "requestDestroy"
        },
        requestDestroy: function(event) {
            this.model.destroy();
        },
        remove: function() {
            this.$el.remove();
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var BroadcastList = Backbone.View.extend({
        tagName: "div",
        className: "broadcast-list",
        initialize: function() {
            this.collection.on("reset", this.render, this);
            this.collection.on("add", this.add, this);
            this.$el.html("<h2>Broadcast Schedule</h2>");
            this.$listing = $("<ol>");
            this.$el.append(this.$listing);
        },
        add: function(model) {
            this.$listing.append(new BroadcastListItem({ model: model }).render().el);
        },
        render: function() {
            this.$listing.empty();
            this.collection.each(function(model) {
                this.add(model);
            }, this);
            return this;
        }
    });

    var broadcastEvents = new BroadcastEvents();

    $(function() {
        var $cache = {
            nameField: $("<input>").attr("type", "text"),
            statusList: $(".map-status .status"),
            submitBtn: $("<button>"),
            body: $("body")
        };
        var socket = io.connect();
        socket.on("changeVotes", function(data) {
            $cache.statusList.prepend(
                $("<li>").text(JSON.stringify(data.stateVotes)));
        });
        $cache.broadcastList = new BroadcastList({ collection: broadcastEvents }).$el;
        $cache.submitBtn.text("New broadcast event")
            .on("click", function(event) {
                broadcastEvents.create({ name: $cache.nameField.val() });
                $cache.nameField.val("");
            });
        $cache.body.append($cache.broadcastList, $cache.nameField, $cache.submitBtn);
        broadcastEvents.fetch();
    });

}(this, undefined));
