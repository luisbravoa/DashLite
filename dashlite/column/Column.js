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