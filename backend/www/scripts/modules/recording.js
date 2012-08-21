define([
    "jst",
    "replay",
    "liveMap.status",
    "liveMap.popcorn",
    "jquery",
    "underscore",
    "backbone",
    "popcorn"
  ], function(JST, Replay, liveMapStatus, liveMapPopcorn, $, _, Backbone, Popcorn) {

    // Alias the global liveMap variable
    var liveMap = this.liveMap;

    var Recording = Backbone.Model.extend({
        urlRoot: "/recording",
        defaults: {
            // TODO: Infer the type on the backend from the route used
            type: "recording"
        },
        initialize: function() {

            if (!this.replays) {
                this.replays = new Replay.collection();
                this.replays.recordingID = this.id;
            }
        },
        parse: function(resp) {

            if (!this.replays) {
                this.replays = new Replay.collection();
            }

            if (resp.id) {
                this.replays.recordingID = resp.id;
            }

            if (resp.replays) {
                this.replays.reset(resp.replays);
                delete resp.replays;
            }

            return resp;
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

            /*if (_.any(attrs.replayTimestamps, function(timestamp) {
                    var date = new Date(timestamp);
                    return !date || isNaN(date.getTime());
                })) {
                return "Invalid time stamp";
            }*/

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
        className: "broadcast",
        template: JST["backend/templates/recording-list-item.html"],
        initialize: function() {
            this.model.on("change", _.bind(this.render,this));
            this.model.on("destroy", _.bind(this.remove, this));
        },
        events: {
            "click .delete": "requestDestroy",
            "click .download": "requestDownload"
        },
        requestDestroy: function(event) {
            this.model.destroy();
        },
        requestDownload: function() {
            $("body").append(new DownloadModal({ model: this.model }).render().el);
        },
        remove: function() {
            this.$el.remove();
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$(".replays").append(new Replay.views.list({
                collection: this.model.replays
            }).render().el);
            return this;
        }
    });

    var RecordingEntry = Backbone.View.extend({
        tagName: "tr",
        template: JST["backend/templates/broadcast-entry.html"],
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
            this.$el.html("<h2 class='section-title'>Broadcast Schedule</h2>");
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
            $("<tfoot>").appendTo(this.$table).append(new RecordingEntry({ collection: this.collection }).render().el);
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

    var DownloadModal = Backbone.View.extend({
        className: "modal download",
        template: JST["backend/templates/json-editor.html"],
        initialize: function() {
            this.$container = $("<div>").addClass("container");
            this.$el.append(this.$container);
        },
        events: {
            "click .buttons .download": "requestDownload",
            "click .buttons .preview": "preview",
            "click": "handleClose"
        },
        handleClose: function(event) {
            if (event.target === this.el) {
                this.close();
            }
        },
        preview: function() {
            var $media = this.$("#json-editor-preview-media");
            var $ifr = this.$(".preview-frame");
            var self = this;
            var ytUrl = this.$(".preview-source").val();
            liveMap.status.off("change");
            liveMap.status.on("change", function(event, status) {
                $ifr.attr("src", status.href);
            });
            if (this.pop) {
                this.pop.destroy();
            }
            this.pop = Popcorn.youtube("#json-editor-preview-media", ytUrl);
            $.ajax({
                url: this.getDownloadUrl(),
                success: function(data) {
                    liveMap.popcorn(self.pop, { replayData: data });
                    self.pop.play();
                }
            });
        },
        close: function() {
            this.$el.remove();
        },
        // getDownloadUrl
        // The data may be formatted according to two optional query string
        // parameters:
        // - startTime <number> - All events that take place before this
        //   timestamp (relative to the beginning of the event) will be removed
        //   from the response. All other event timestamps will be relative to
        //   this offset
        // - endTime <number> - All events that take place after this timestamp
        //   (relative to the beginning of the event) will be removed from the
        //   response
        getDownloadUrl: function() {
            var requestUrl = "/recordingjson/" + this.model.id;
            var paramsObj = this.serialize();
            var paramsArray = [];
            var paramsStr;

            _.forEach(paramsObj, function(val, attr) {
                if (val) {
                    paramsArray.push(attr + "=" + val);
                }
            });
            paramsStr = paramsArray.join("&");

            if (paramsStr) {
                requestUrl += "?" + paramsStr;
            }

            return requestUrl;
        },
        // requestDownload
        // Redirect to an endpoint designed to serve JSON file downloads.
        requestDownload: function() {
            window.location.href = this.getDownloadUrl();
        },
        // serialize
        // Parse the input fields for milliseconds
        serialize: function() {
            return {
                startTime: parseFloat(this.$(".start-time").val(), 10) * 1000,
                endTime: parseFloat(this.$(".end-time").val(), 10) * 1000,
                offset: parseFloat(this.$(".offset-time").val(), 10) * 1000
            };
        },
        render: function() {
            this.$container.html(this.template(this.model.toJSON()));

            return this;
        }
    });

    return {
        model: Recording,
        collection: Recordings,
        views: {
          entry: RecordingEntry,
          listItem: RecordingListItem,
          list: RecordingList,
          downloadModal: DownloadModal
        }
    };
});
