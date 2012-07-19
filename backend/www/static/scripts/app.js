(function( window ) {

    // Dependencies
    var $ = window.jQuery;
    var _ = window._;
    var Backbone = window.Backbone;
    var moment = window.moment;

    var Recording = Backbone.Model.extend({
        urlRoot: "/recording",
        defaults: function() {
            return {
                comments: "",
                replayTimestamps: []
            };
        },
        validate: function(attrs) {

            var startDate;

            if (!attrs.name || typeof attrs.name.match !== "function" ||
               !attrs.name.match(/[^\s]/)) {
                    return "Name must contain at least 1 non-whitespace character";
            }

            startDate = new Date(attrs.timeStamp);

            if (!startDate || !!isNaN(startDate.getTime())) {
                return "Invalid start date";
            }

            if (_.any(attrs.replayTimestamps, function(timestamp) {
                    var date = new Date(timestamp);
                    return !date || isNaN(date.getTime());
                })) {
                return "Invalid time stamp";
            }

            //if(!/^[0-9]+$/.test(attrs.duration)) {
            if (attrs.duration < 0 || parseFloat(attrs.duration, 10) !== attrs.duration) {
                return "Bad duration";
            }
        }
    });
    var Recordings = Backbone.Collection.extend({
        model: Recording,
        url: "/recording"
    });

    var RecordingListItem = Backbone.View.extend({
        tagName: "tr",
        className: "broadcast-listitem",
        template: _.template("<td><%= name %></td>" +
            "<td>" +
                "<%= new Date(timeStamp).toString().slice(4, -15) %>" +
            "</td>" +
            "<td><%= duration/1000 %></td>" +
            "<td class='replays'>" +
                "<ul class='replay-listing'><% _.forEach(replayTimestamps, function(timestamp) { %>" +
                    "<li class='replay' data-timestamp='<%= timestamp %>'>" +
                        "<%= new Date(timestamp).toString().slice(4, -15) %>" +
                        "<span class='delete-replay'>&times;</span>" +
                    "</li>" +
                "<% }); %></ul>" +
                "<div class='replay-creator'>" +
                    "<input class='new-replay' type='text'></input>" +
                    "<button class='add-replay'>Add</button>" +
                "</div>" +
            "</td>" +
            "<td class='delete'>&times;</td>"),
        initialize: function() {
            this.model.on("change", _.bind(this.render,this));
            this.model.on("destroy", _.bind(this.remove, this));
        },
        events: {
            "click .delete": "requestDestroy",
            "click .add-replay": "addReplay",
            "click .delete-replay": "requestDeleteReplay"
        },
        requestDestroy: function(event) {
            this.model.destroy();
        },
        requestDeleteReplay: function(event) {
            var self = this;
            var replayTimestamps = this.model.get("replayTimestamps");
            var toDelete = $(event.target).closest(".replay").data("timestamp");

            replayTimestamps = _.without(replayTimestamps, toDelete);

            this.model.save({
                replayTimestamps: replayTimestamps
            }, {
                error: function() {
                    replayTimestamps = _.clone(self.model.get("replayTimestamps"));
                    replayTimestamps.push(toDelete);
                    self.model.set({ replayTimestamps: replayTimestamps });
                }
            });
        },
        addReplay: function() {
            var self = this;
            var replayTimestamps;
            var newTimestamp;

            newTimestamp = Date.parse(this.$(".new-replay").val());
            // Clone the property off the model before modifying it (so the
            // call to .save() triggers a "change" event as expected
            replayTimestamps = _.clone(this.model.get("replayTimestamps"));
            replayTimestamps.push(newTimestamp);

            this.model.save({
                replayTimestamps: replayTimestamps
            }, {
                error: function() {
                    replayTimestamps = _.without(
                        self.model.get("replayTimestamps"),
                        newTimestamp);
                    self.model.set({ replayTimestamps: replayTimestamps });
                }
            });
        },
        remove: function() {
            this.$el.remove();
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var BroadcastEntry = Backbone.View.extend({
        tagName: "tr",
        template: _.template(
            "<td><input type='text' class='name'></input></td>" +
            "<td><input type='text' class='start'></input></td>" +
            "<td><input type='text' class='duration'></td>" +
            "<td></td>" +
            "<td><button class='submit'>Create</button></td>"),
        initialize: function() {
            this.$el.html(this.template());
            this.collection = this.options.collection;
        },
        events: {
            "click .submit": "handleSubmit"
        },
        handleSubmit: function(event) {
            this.collection.create(this.serialize());
            event.preventDefault();
        },
        serialize: function() {
            return {
                name: this.$(".name").val(),
                timeStamp: Date.parse(this.$(".start").val()),
                duration: parseFloat(this.$(".duration").val(), 10) * 1000
            };
        },
        render: function() {
            return this;
        }
    });

    var RecordingList = Backbone.View.extend({
        className: "broadcast-list",
        initialize: function() {
            this.collection.on("reset", this.render, this);
            this.collection.on("add", this.add, this);
            this.$el.html("<h2>Broadcast Schedule</h2>");
            this.$table = $("<table>");
            this.$table.html("<thead><tr>" +
                "<td>Name</td>" +
                "<td>Start <span class='format'>(MMM DD YYYY HH:mm:ss)</span></td>" +
                "<td>Duration <span class='format'>(sec)</span></td>" +
                "<td>Rebroadcasts</td>" +
                "<td></td>" +
                "</tr></thead>");
            this.$listing = $("<tbody>");
            this.$table.append(this.$listing);
            $("<tfoot>").appendTo(this.$table).append(new BroadcastEntry({ collection: this.collection }).render().el);
            this.$el.append(this.$table);
        },
        add: function(model) {
            this.$listing.append(new RecordingListItem({ model: model }).render().el);
        },
        render: function() {
            this.$listing.empty();
            this.collection.each(function(model) {
                this.add(model);
            }, this);
            return this;
        }
    });

    var recordings = new Recordings();

    $(function() {
        var $cache = {
            statusList: $(".map-status .status"),
            body: $("body")
        };
        var socket = io.connect();
        socket.on("changeVotes", function(data) {
            $cache.statusList.prepend(
                $("<li>").text(JSON.stringify(data.stateVotes)));
        });
        $cache.recordingList = new RecordingList({ collection: recordings }).$el;
        $cache.body.append($cache.recordingList);
        recordings.fetch();
    });

}(this, undefined));
