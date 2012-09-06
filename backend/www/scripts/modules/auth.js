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

    var Token = Backbone.Model.extend({
        parse: function(attributes) {
            this.id = attributes.val;
            delete attributes.val;
            return attributes;
        }
    });
    var Tokens = Backbone.Collection.extend({
        model: Token,
        url: "/token"
    });

    var TokenListItem = Backbone.View.extend({
        template: JST["backend/templates/token-list-item.html"],
        events: {
            "click .delete": "destroy"
        },
        render: function() {
            this.$el.html( this.template( this.model.toJSON() ) );
            return this;
        },
        destroy: function() {
            this.model.destroy();
            this.$el.remove();
        }
    });
    var TokenList = Backbone.View.extend({
        template: JST["backend/templates/token-list.html"],
        initialize: function() {
            this.collection.on("reset", this.render, this);
        },
        render: function() {
            this.$el.html( this.template() );
            this.collection.each(function(model) {
                this.$(".token-list").append(new TokenListItem({ model: model }).render().el);
            }, this);
            return this;
        }
    });

    return {
        Token: Token,
        Tokens: Tokens,
        views: {
            tokenList: TokenList,
            loginForm: LoginForm
        }
    };

});
