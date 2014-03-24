(function (global, $) {

    var notifyEl = global.NOTIFICATION_DEFAULT_CONTAINER = $('#global-notifications');

    /**
     * @class view.NotificationMixin
     * @mixin
     *
     * Mix into your View classes in order to provide common notication
     * functions to views.
     * Properties you may override to get custom behaviour:
     *
     * @property {Object} notificationDefaults
     * @property {Function} getNotificationContainer
     */
    global.view.NotificationMixin = {

        /**
         * @param msg
         * @param options
         */
        notify: function (msg, options) {
            msg = msg || '';
            options = options || { };
            var text = { };
            if (_.isString(msg)) {
                var msgText = msg;
                msg = {
                    html : msgText
                };
            } else if (!_.isObject(msg) || !_.has(msg, 'text')) {
                throw new Error('The "msg" argument is not a String or a valid Object with a "text" property.');
            }
            var msgOptions = _.extend(options, {
                message: msg
            });
            var el = this.getNotificationContainer ? this.getNotificationContainer() : notifyEl;
            if (!el || !el.length) {
                el = notifyEl;
            }
            var notification = this.currentNotification = el.notify(
                _.extend(this.notificationDefaults || {}, msgOptions));
            notification.$note.append($('<i class="alert-icon"></i>'));
            if (msgOptions.autoShow !== false) {
                notification.show();
            }
            return notification;
        },

        notifySuccess: function (msg, options) {
            return this.notify(msg, _.extend(options || {}, {
                type : 'success'
            }));
        },

        notifyError: function (msg, options) {
            return this.notify(msg, _.extend(options || {}, {
                type: 'danger'
            }));
        },

        notifyWarning: function (msg, options) {
            return this.notify(msg, _.extend(options || {}, {
                type: 'warning'
            }));
        },

        notifyInfo: function (msg, options) {
            return this.notify(msg, _.extend(options || {}, {
                type: 'info'
            }));
        }

    };

})(window, domLib());