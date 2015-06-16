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