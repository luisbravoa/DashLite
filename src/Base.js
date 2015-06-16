
var Base = {
    subscribers: {},
    addEventHandler: function(type, fn, context) {
        if(type === undefined || fn === undefined){
            return;
        }
        fn = typeof fn === 'function' ? fn : context[fn];
        if (typeof this.subscribers[type] === "undefined") {
            this.subscribers[type] = [];
        }
        this.subscribers[type].push({ fn: fn, context: context || this });
    },
    removeEventHandler: function(type, fn, context) {
        context = context || this;
        this.visitSubscribers('remove', type, fn, context);
    },
    trigger: function(type, publication) {
        this.visitSubscribers('trigger', type, publication);
    },
    visitSubscribers: function(action, type, arg, context) {
        var pubtype = type,
            subscribers = this.subscribers[pubtype],
            max = subscribers ? subscribers.length : 0;

        for (var i = 0; i < max; i += 1) {
            if (action === 'trigger') {
                subscribers[i].fn.call(subscribers[i].context, arg);
            } else {
                if (subscribers[i].fn === arg && subscribers[i].context === context) {
                    subscribers.splice(i, 1);
                }
            }
        }
    }
};



