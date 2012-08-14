define([
    "jst",
    "jquery",
    "backbone"
], function(JST, $, Backbone) {

    var LoginForm = Backbone.View.extend({
        tagName: "form",
        initialize: function() {
            this.$el.html("<h2>Login</h2>" +
                "<input type='password' name='pwd'></input>" +
                "<input type='submit'></input>");
        },
        events: {
            "submit": "handleSubmit"
        },
        handleSubmit: function(event) {
            event.preventDefault();

            $.ajax({
                url: "/auth",
                type: "POST",
                data: this.serialize()
            });
        },
        serialize: function() {
            return this.$el.serialize();
        }
    });

    return {
        views: {
            loginForm: LoginForm
        }
    };

});
