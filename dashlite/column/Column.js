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
Column.prototype.removeOriginPlaceHolder = function(){
    if(this.originPlaceHolder){
        this.element.removeChild(this.originPlaceHolder);
        delete this.originPlaceHolder;
    }
};



function createPlaceholder(height){
    return utils.parse(
    '<div class="DashLite-item-placeholder" style="height:'+height+'px;"></div>'
    );
}