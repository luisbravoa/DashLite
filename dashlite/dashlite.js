function DashLite (options){
    this.options = options;

    // create the element
    this.element = utils.parse('<div class="DashLite"></div>');

    // create the columns
    this.createColumns();
    console.log(this.options.parentElement);

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
    }.bind(this));
};

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