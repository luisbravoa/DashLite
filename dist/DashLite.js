// wrap-start.frag.js
(function (root, factory) {
  if (typeof define === 'function') {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    // change "myLib" to whatever your library is called
    root.DashLite = factory();
  }
}(this, function () {
//define(function () {
    var utils = {
        parse: function (s) {
            var div = document.createElement('div');
            div.innerHTML = s;
            return div.firstChild;
        },
        addClass: function (element, className) {
            var currentClassName = element.className;
            if (currentClassName.indexOf(className) === -1) {
                element.className += ' ' + className;
            }
        },
        removeClass: function (element, className) {
            var currentClassName = element.className;
            if (currentClassName.indexOf(className) !== -1) {
                element.className = currentClassName.replace(className, '').trim();
            }
        }
    };
    
//});

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




function Item(options) {
    this.options = options;

    // create the element
    this.element = utils.parse(
        '<div class="DashLite-item white">' +
        '<div class="DashLite-item-holder">' +
        '<div class="DashLite-item-header">' +
        '<div class="DashLite-item-header-text"></div>' +
        '<div class="DashLite-item-header-icons">' +
        '<a href="#" class="DashLite-item-header-action-colapse">' +
        '<icon class="DashLite-item-header-icon arrowUp"></icon>' +
        '<icon class="DashLite-item-header-icon arrowDown"><icon>' +
        '</a>' +
        '</div>' +
        '</div>' +
        '<div class="DashLite-item-content"><div class="DashLite-item-content-holder"></div></div>' +
        '</div>' +
        '</div>'
    );

    this.headerElement = this.element.querySelector('.DashLite-item-header');
    this.contentElement = this.element.querySelector('.DashLite-item-content');
    this.contentHolderElement = this.element.querySelector('.DashLite-item-content-holder');

    // add it to the content holder
    this.contentHolderElement.innerHTML = (this.options.content);
    if (this.options.title) {
        this.headerElement.querySelector('.DashLite-item-header-text').innerHTML = (this.options.title);
    }

    this.color();

    this.listenForDragAndDropEvents();

    this.collapseButton = this.element.querySelector('.DashLite-item-header-action-colapse');

    this.collapsed = false;

    requestAnimationFrame(function () {
        this.maxHeight = this.contentElement.offsetHeight + 'px';
        this.contentElement.style.maxHeight = this.maxHeight;
    }.bind(this));

    this.collapseButton.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.collapsed = !this.collapsed;
        if (this.collapsed) {
            this.contentElement.style.maxHeight = '0px';
            utils.addClass(this.element, 'collapsed');
        } else {
            this.contentElement.style.maxHeight = this.maxHeight;

            utils.removeClass(this.element, 'collapsed');
        }

    }.bind(this));
}

Item.prototype = Object.create(Base);

Item.prototype.color = function () {
    var colors = [
        '#ec663c',
        '#9c4274',
        '#12b0c5',
        '#ff9618',
        '#979996',
//        '#ff0000',
//        '#ffff00',
//        '#00b500',
//        '#00ffff',
//        '#eece0d',
//        '#77c71a',
//        '#2cd6d2',
//        '#2d73d4',
//        '#bb37c3'
    ];

    this.element.style.backgroundColor = colors[randomIntFromInterval(0, colors.length - 1)];

}
Item.prototype.onMove = function (e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.which !== 1) {
        this.revertDrag();
        this.element.dispatchEvent(new Event('drag:cancel'));
        return;
    }
    var mouseCoordinates = {
        x: e.clientX + document.body.scrollLeft - document.documentElement.offsetLeft,
        y: e.clientY + document.body.scrollTop - document.documentElement.offsetTop
    };

    this.element.style.left = (mouseCoordinates.x - this.offsetX + document.body.scrollLeft) + 'px';
    this.element.style.top = (mouseCoordinates.y - this.offsetY + document.body.scrollTop) + 'px';


    // get the element
    this.element.style.display = 'none';
    this.destinationElement = document.elementFromPoint(e.clientX, e.clientY);
    this.element.style.display = '';

    var moveEvent = new Event('drag:move');
    moveEvent.destinationElement = this.destinationElement;
    this.element.dispatchEvent(moveEvent);
}
Item.prototype.revertDrag = function () {
    utils.removeClass(this.element, 'drag');
    this.element.style.left = '';
    this.element.style.top = '';
    this.element.style.width = '';

    document.body.removeEventListener("mousemove", this.onMoveHandler, true);
};

Item.prototype.onDrag = function (e) {
    e.stopPropagation();
    e.preventDefault();
    var mouseCoordinates = {
        x: e.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: e.clientY + document.body.scrollTop - document.body.clientTop
    };

    var elementPosition = this.element.getBoundingClientRect();

    this.offsetX = mouseCoordinates.x - elementPosition.left;
    this.offsetY = mouseCoordinates.y - elementPosition.top;

    this.element.style.width = elementPosition.width + 'px';
    utils.addClass(this.element, 'drag');
    this.onMoveHandler = this.onMove.bind(this);
    document.body.addEventListener('mousemove', this.onMoveHandler, true);

    var customEvent = new Event('drag:start');
    this.element.dispatchEvent(customEvent);
};


Item.prototype.onDrop = function (e) {
    e.stopPropagation();
    e.preventDefault();
    this.revertDrag();

    var stopEvent = new Event('drag:stop');
    stopEvent.destinationElement = this.destinationElement;
    this.element.dispatchEvent(stopEvent);

    this.destinationElement = undefined;

};

Item.prototype.listenForDragAndDropEvents = function () {
    this.mouseDownEvent = this.headerElement.querySelector('.DashLite-item-header-text').addEventListener('mousedown', this.onDrag.bind(this), true);
    this.mouseUpEvent = this.element.addEventListener('mouseup', this.onDrop.bind(this), true);
};


function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function Column(options) {
    this.options = options;

    // create the element
    this.element = utils.parse('<div class="DashLite-column"></div>');


    this.createItems();

}

Column.prototype = Object.create(Base);

Column.prototype.createItems = function () {
    this.items = [];
    this.options.items.forEach(function (itemData) {
        itemData.column = this;
        var item = new Item(itemData);
        this.items.push(item);
        // Add the column element to the DashLite element
        this.element.appendChild(item.element);
    }.bind(this));
};

Column.prototype.getItemByElement = function (element) {
    var found;
    this.items.forEach(function (item) {
        if (item.element == element) {
            found = item;
        }
    }.bind(this));

    return found;
};
Column.prototype.addOriginPlaceHolder = function (item) {
    this.originPlaceHolder = createPlaceholder(item.element.offsetHeight);
    this.element.insertBefore(this.originPlaceHolder, item.element);
};
Column.prototype.addDestinationPlaceHolder = function (item, draggedItem) {
    if (item === draggedItem) {
        return;
    }
    var index = this.items.indexOf(item);
    if (index !== -1) {
        this.destinationPlaceHolder = createPlaceholder(draggedItem.element.offsetHeight);
        this.element.insertBefore(this.destinationPlaceHolder, item.element);
    } else {
        this.destinationPlaceHolder = createPlaceholder(draggedItem.element.offsetHeight);
        this.element.appendChild(this.destinationPlaceHolder);
    }

};
Column.prototype.removeOriginPlaceHolder = function () {
    if (this.originPlaceHolder) {
        this.element.removeChild(this.originPlaceHolder);
        delete this.originPlaceHolder;
    }
};
Column.prototype.removeDestinationPlaceHolder = function () {
    if (this.destinationPlaceHolder) {
        this.element.removeChild(this.destinationPlaceHolder);
        delete this.destinationPlaceHolder;
    }
};
Column.prototype.extractItem = function (index) {
    if (this.items[index] !== undefined) {
        this.element.removeChild(this.items[index].element);
        return this.items.splice(index, 1)[0];
    }
};
Column.prototype.addItemInPlaceholder = function (item) {
    if (this.destinationPlaceHolder !== undefined) {
        var index = Array.prototype.indexOf.call(this.element.childNodes, this.destinationPlaceHolder);
        this.element.replaceChild(item.element, this.destinationPlaceHolder);
        delete this.destinationPlaceHolder;
        console.log(this.items.length);
        this.items.splice(1, 0, item);
        console.log(this.items.length);
    }
};


function createPlaceholder(height) {
    height = (height === undefined) ? 100 : height;
    return utils.parse(
        '<div class="DashLite-item-placeholder" style="height:' + height + 'px;">' +
        '<div class="DashLite-item-placeholder-holder"></div>' +
        '</div>'
    );
}
function DashLite(options) {

    "use strict";

    this.options = options;

    // create the element
    this.element = utils.parse('<div class="DashLite"></div>');

    // create the columns
    this.createColumns();
    //    console.log(this.options.parentElement);

    this.setLayout(this.options.items.length);

    // add DashLite to the parent element
    this.options.parentElement.appendChild(this.element);
}

DashLite.prototype = Object.create(Base);

DashLite.prototype.createColumns = function () {
    this.columns = [];
    this.options.items.forEach(function (items) {
        var column = new Column({
            items: items
        });
        this.columns.push(column);
        // Add the column element to the DashLite element
        this.element.appendChild(column.element);

        // Listen for events in the items
        column.items.forEach(function (item) {
            item.element.addEventListener('drag:start', this.onDragStart.bind(this));
            item.element.addEventListener('drag:stop', this.onDragStop.bind(this));
            item.element.addEventListener('drag:move', this.onDragMove.bind(this));
            item.element.addEventListener('drag:cancel', this.onDragCancel.bind(this));
        }.bind(this));


    }.bind(this));
};




DashLite.prototype.onDragMove = function (e) {

    var destinationElemement = e.destinationElement;

    var originData = getOriginColumnAndItemFromElement.call(this, e.target);
    var destinationData = getDestinationnColumnAndItemFromElement.call(this, e.destinationElement);

    // complex conditionals here
    var isTheNextSibling = (destinationData.item !== undefined && originData.item.element.nextSibling === destinationData.item.element);
    var targetIsOriginPlaceholder = originData.column !== undefined && originData.column.originPlaceHolder && (originData.column.originPlaceHolder === destinationElemement || originData.column.originPlaceHolder.contains(destinationElemement));
    var outOfRange = (destinationData.column === undefined && destinationData.item === undefined && destinationData.destinationPlaceholder === undefined);
    var isItem = destinationData.column !== undefined && destinationData.item !== undefined && destinationData.destinationPlaceholder === undefined;
    var isDestinationPlaceHolder = (destinationData.column !== undefined && destinationData.destinationPlaceholder === undefined && originData.column.originPlaceHolder !== destinationData.destinationPlaceholder);

    if (targetIsOriginPlaceholder || isTheNextSibling || outOfRange) {
        this.removeDestinationPlaceholders();
    } else if (isItem || isDestinationPlaceHolder) {
        this.removeDestinationPlaceholders();
        destinationData.column.addDestinationPlaceHolder(destinationData.item, originData.item);
        this.destinationColumn = destinationData.column;
    }
};
DashLite.prototype.removeDestinationPlaceholders = function () {
    this.columns.forEach(function (column) {
        column.removeDestinationPlaceHolder();
    });
};
DashLite.prototype.onDragStart = function (e) {
    console.log(e);
    var data = getOriginColumnAndItemFromElement.call(this, e.target);
    data.column.addOriginPlaceHolder(data.item);
};

function getDestinationnColumnAndItemFromElement(targetElement) {
    var column, item, destinationPlaceholder;
    this.columns.forEach(function (col) {
        if (col.element.contains(targetElement)) {
            column = col;
            column.items.forEach(function (it) {
                if (it.element.contains(targetElement) || it.element === targetElement) {
                    item = it;
                }
            }.bind(this));

            if (col.destinationPlaceHolder !== undefined && (col.destinationPlaceHolder === targetElement || col.destinationPlaceHolder.contains(targetElement))) {
                destinationPlaceholder = col.destinationPlaceHolder;
            }
        }
    }.bind(this));
    return {
        column: column,
        item: item,
        destinationPlaceholder: destinationPlaceholder
    };
}

function getOriginColumnAndItemFromElement(itemElement) {
    var column, item, it;
    this.columns.forEach(function (col) {
        it = col.getItemByElement(itemElement);
        if (it) {
            column = col;
            item = it;
        }
    }.bind(this));
    return {
        column: column,
        item: item
    };
}

DashLite.prototype.onDragStop = function (e) {
    var originData = getOriginColumnAndItemFromElement.call(this, e.target);

    if (originData.column !== undefined && originData.item !== undefined && this.destinationColumn !== undefined) {
        var indexToRemove = originData.column.items.indexOf(originData.item);
        originData.column.extractItem(indexToRemove);

        this.destinationColumn.addItemInPlaceholder(originData.item);
        delete this.destinationColumn;
    }

    originData.column.removeOriginPlaceHolder();

};

DashLite.prototype.onDragCancel = function (e) {
    var originData = getOriginColumnAndItemFromElement.call(this, e.target);
    originData.column.removeOriginPlaceHolder();
    this.removeDestinationPlaceholders();
};

DashLite.prototype.setLayout = function (columns) {
    var className = 'fourColumn';
    switch (columns) {
        case 1:
            className = 'oneColumn';
            break;
        case 2:
            className = 'twoColumn';
            break;
        case 3:
            className = 'threeColumn';
            break;
        case 4:
            className = 'fourColumn';
            break;
        default:
            className = 'fourColumn';
            break;
    }

    this.element.className += ' ' + className;

};
  // wrap-end.frag.js

  // change "my-lib" to your 'entry-point' module name 
  return DashLite;
}));