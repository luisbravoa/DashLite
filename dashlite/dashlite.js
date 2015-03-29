function DashLite (options){
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

DashLite.prototype.createColumns = function(){
    this.columns = [];
    this.options.items.forEach(function(items){
        var column = new Column({items: items});
        this.columns.push(column);
        // Add the column element to the DashLite element
        this.element.appendChild(column.element);
        
        // Listen for events in the items
        column.items.forEach(function(item){
            item.element.addEventListener('drag:start', this.onDragStart.bind(this));
            item.element.addEventListener('drag:stop', this.onDragStop.bind(this));
            item.element.addEventListener('drag:move', this.onDragMove.bind(this));
        }.bind(this));
        
        
    }.bind(this));
};

DashLite.prototype.onDragMove = function(e){
    
//    console.log(e.target);
    
    
}
DashLite.prototype.onDragStart = function(e){
    console.log(e);
    var data = getColumnAndItemFromElement.call(this, e.target);
    data.column.addOriginPlaceHolder(data.item);
}

function getColumnAndItemFromElement(itemElement){
    var column, item;
    this.columns.forEach(function(col){
        it = col.getItemByElement(itemElement);
        if(it){
            column = col;
            item = it;
        }
    }.bind(this));
    return {
        column: column,
        item: item
    }
}
DashLite.prototype.onDragStop = function(e){
    // Add placeholder
    var itemElement = e.target;
    var data = getColumnAndItemFromElement.call(this, e.target);
    console.log(data)
    data.column.removeOriginPlaceHolder();
}

DashLite.prototype.setLayout = function(columns){
    var className = 'fourColumn';
    switch(columns){
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
    default:
        className = 'fourColumn';
        break;
    }

    this.element.className += ' ' + className;

};