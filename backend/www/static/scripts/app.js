(function( window ) {

    // Dependencies
    var $ = window.jQuery;
    var _ = window._;
    var Backbone = window.Backbone;
    var moment = window.moment;

    var BroadcastEvent = Backbone.Model.extend({
        urlRoot: "/broadcastevent",
        defaults: {
            comments: ""
        },
        initialize: function() {
            this.on("error", this.destroy, this);
        },
        validate: function() {
            var type = this.get("type");
            var name = this.get("name");
            var replayId = this.get("replayId");
            var startMoment = moment(this.get("start"));
            var duration = this.get("duration");

            if (!type || (type !== "record" && type !== "replay")) {
                return "Unrecognized type";
            }

            if (type ==="record") {
                if (!name || typeof name.match !== "function" ||
                    !name.match(/[^\s]/)) {
                    return "Name must contain at least 1 non-whitespace character";
                }
            } else {
                if (!replayId) {
                    return "No recording specified";
                }
            }

            if (!startMoment || !!isNaN(startMoment.toDate().getTime())) {
                return "Invalid start date";
            }

            if(!/^[0-9]+$/.test(duration)) {
                return "Bad duration";
            }
        }
    });
    var BroadcastEvents = Backbone.Collection.extend({
        model: BroadcastEvent,
        url: "/broadcastevent"
    });

    var BroadcastListItem = Backbone.View.extend({
        tagName: "tr",
        className: "broadcast-listitem",
        template: _.template("<td><%= type %></td>" +
            "<td><%= name %></td>" +
            "<td><%= start %></td>" +
            "<td><%= duration %></td>" +
            "<td class='delete'>&times;</td>"),
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

    var BroadcastEntry = Backbone.View.extend({
        tagName: "tr",
        template: _.template(
            "<td><select class='type'>" +
                "<option value='record'>Record</option>" +
                "<option value='replay'>Replay</option>" +
            "</select></td>" +
            "<td>" +
                "<select class='recording'></select>" +
                "<input type='text' class='name'></input>" +
            "</td>" +
            "<td><input type='text' class='start'></input></td>" +
            "<td><input type='text' class='duration'></td>" +
            "<td><button class='submit'>Create</button></td>"),
        initialize: function() {
            this.$el.html(this.template());
            this.collection = this.options.collection;
            this.collection.on("sync", this.renderRecordingChooser, this);
            this.collection.on("reset", this.renderRecordingChooser, this);
            this.renderRecordingChooser();
            // Ensure that the form initializes according to the default type
            this.handleTypeChange();
        },
        events: {
            "click .submit": "handleSubmit",
            "change .type": "handleTypeChange",
            "change .recording": "handleRecordingChange"
        },
        handleSubmit: function(event) {
            this.collection.create(this.serialize());
            event.preventDefault();
        },
        // handleTypeChange
        // Update the form according to the new broadcast type
        // - record: text input for the name of the recording, along with the
        //   start date and duration
        // - replay: select input for the name of the previous recording, a
        //   text input for the start date, and a disabled text input to
        //   communicate the duration of the previous recording
        handleTypeChange: function(event) {
            if (this.$(".type").val() === "replay") {
                this.$(".recording").show();
                this.$(".name").hide();
                this.$(".duration").prop("disabled", true);
                this.handleRecordingChange();
            } else {
                this.$(".recording").hide();
                this.$(".name").show();
                this.$(".duration").prop("disabled", false).val("");
            }
        },
        // handleRecordingChange
        // Update the duration of this replay event to match the duration of
        // the selected recorded event
        handleRecordingChange: function(event) {
            var recordingId = this.$(".recording").val();
            var recordingDuration = this.collection.get(recordingId).get("duration");
            this.$(".duration").val(recordingDuration);
        },
        // renderRecordingChooser
        // Populate the recording select field according to the recorded events
        // that are currently present in the collection
        renderRecordingChooser: function() {
            this.$(".recording").empty().html(
                _.map(this.collection.models, function(model) {
                    if (model.get("type") !== "record") {
                        return;
                    }
                    return "<option value='" + model.get("id") + "'>" +
                        model.get("name") +
                        "</option>";
                }).join(""));
        },
        serialize: function() {
            return {
                type: this.$(".type").val(),
                name: this.$(".name").val(),
                replayId: this.$(".recording").val(),
                start: this.$(".start").val(),
                duration: this.$(".duration").val()
            };
        },
        render: function() {
            return this;
        }
    });

    var BroadcastList = Backbone.View.extend({
        className: "broadcast-list",
        initialize: function() {
            this.collection.on("reset", this.render, this);
            this.collection.on("add", this.add, this);
            this.$el.html("<h2>Broadcast Schedule</h2>");
            this.$table = $("<table>");
            this.$table.html("<thead><tr>" +
                "<td>Type</td><td>Name</td><td>Start</td><td>Duration</td><td></td>" +
                "</tr></thead>");
            this.$listing = $("<tbody>");
            this.$table.append(this.$listing);
            $("<tfoot>").appendTo(this.$table).append(new BroadcastEntry({ collection: this.collection }).render().el);
            this.$el.append(this.$table);
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
            statusList: $(".map-status .status"),
            body: $("body")
        };
        var socket = io.connect();
        socket.on("changeVotes", function(data) {
            $cache.statusList.prepend(
                $("<li>").text(JSON.stringify(data.stateVotes)));
        });
        $cache.broadcastList = new BroadcastList({ collection: broadcastEvents }).$el;
        $cache.body.append($cache.broadcastList);
        broadcastEvents.fetch();
    });

}(this, undefined));
