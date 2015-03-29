function Column (options){
    this.options = options;

    // create the element
    this.element = utils.parse('<div class="DashLite-column"></div>');


    this.createItems();

}

Column.prototype.createItems = function(){
    this.items = [];
    this.options.items.forEach(function(itemData){
        var item = new Item(itemData);
        this.items.push(item);
        // Add the column element to the DashLite element
        this.element.appendChild(item.element);
    }.bind(this));
};

Column.prototype.getItemByElement = function(element){
    var found;
    this.items.forEach(function(item){
        if(item.element == element){
            found = item;
        }
    }.bind(this));  
    
    return found;
};
Column.prototype.addOriginPlaceHolder = function(item){
    this.originPlaceHolder = createPlaceholder(item.element.offsetHeight);
    this.element.insertBefore(this.originPlaceHolder, item.element);
};
Column.prototype.addDestinationPlaceHolder = function(item, draggedItem){
    if(item === draggedItem){
        return;
    }
    var index = this.items.indexOf(item);
    if(index !== -1){
        this.destinationPlaceHolder = createPlaceholder(draggedItem.element.offsetHeight);
        this.element.insertBefore(this.destinationPlaceHolder, item.element);
    }else{
        this.destinationPlaceHolder = createPlaceholder(draggedItem.element.offsetHeight);
        this.element.appendChild(this.destinationPlaceHolder);
    }
    
};
Column.prototype.removeOriginPlaceHolder = function(){
    if(this.originPlaceHolder){
        this.element.removeChild(this.originPlaceHolder);
        delete this.originPlaceHolder;
    }
};
Column.prototype.removeDestinationPlaceHolder = function(){
    if(this.destinationPlaceHolder){
        this.element.removeChild(this.destinationPlaceHolder);
        delete this.destinationPlaceHolder;
    }
};
Column.prototype.extractItem = function(index){
    if(this.items[index] !== undefined){
        this.element.removeChild(this.items[index].element);
        return this.items.splice(index, 1)[0];
    }
};
Column.prototype.addItemInPlaceholder = function(item){
    if(this.destinationPlaceHolder !== undefined){
        var index = Array.prototype.indexOf.call(this.element.childNodes, this.destinationPlaceHolder);
        this.element.replaceChild(item.element, this.destinationPlaceHolder);
        delete this.destinationPlaceHolder;
        console.log(this.items.length);
        this.items.splice(1, 0, item);
        console.log(this.items.length);
    }
};



function createPlaceholder(height){
    height = (height === undefined)? 100 : height;
    return utils.parse(
    '<div class="DashLite-item-placeholder" style="height:'+height+'px;">'+
        '<div class="DashLite-item-placeholder-holder"></div>'+
    '</div>'
    );
}