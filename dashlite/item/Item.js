"use strict";
function Item(options){
    this.options = options;

    // create the element
    this.element = utils.parse(
    '<div class="DashLite-item">'+
        '<div class="DashLite-item-header"></div>'+
        '<div class="DashLite-item-content"></div>'+
    '</div>'
    );

    this.headerElement = this.element.querySelector('.DashLite-item-header');
    this.contentHolderElement = this.element.querySelector('.DashLite-item-content')
    
    // add it to the content holder
    this.contentHolderElement.innerHTML = (this.options.content);
    if(this.options.title){
        this.headerElement.innerHTML = (this.options.title);
    }

    this.color();
    
    this.listenForDragAndDropEvents();

}

Item.prototype.color = function(){
    var colors = [
        '#b50000',
        '#ff0000',
        '#ffff00',
        '#00b500',
        '#00ffff',
        '#eece0d',
        '#77c71a',
        '#2cd6d2',
        '#2d73d4',
        '#bb37c3'
    ];

    this.element.style.backgroundColor = colors[randomIntFromInterval(0, colors.length - 1)];

}
Item.prototype.onMove = function (e){
        e.stopPropagation();
    e.preventDefault();
    
    var mouseCoordinates = {
        x: e.clientX  + document.body.scrollLeft - document.documentElement.offsetLeft,
        y: e.clientY + document.body.scrollTop  - document.documentElement.offsetTop
    };
    
    this.element.style.left = ( mouseCoordinates.x - this.offsetX + document.body.scrollLeft) + 'px';
    this.element.style.top = ( mouseCoordinates.y - this.offsetY + document.body.scrollTop) + 'px';
    
    
    // get the element 
    this.element.style.display = 'none';
    var destinationElement = document.elementFromPoint(e.clientX, e.clientY);
    this.element.style.display = '';
    
    this.element.dispatchEvent(new Event('drag:move'));
}


Item.prototype.onDrag = function (e){
//    console.log(e);
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


Item.prototype.onDrop = function (e){
    e.stopPropagation();
    e.preventDefault();
    utils.removeClass(this.element, 'drag');
    this.element.style.left = '';
    this.element.style.top = '';
    this.element.style.width = '';
    
    document.body.removeEventListener("mousemove", this.onMoveHandler, true);
    
    this.element.dispatchEvent(new Event('drag:stop'));
    
};

Item.prototype.listenForDragAndDropEvents = function(){
    this.mouseDownEvent = this.headerElement.addEventListener('mousedown', this.onDrag.bind(this), true);
    this.mouseUpEvent = this.element.addEventListener('mouseup', this.onDrop.bind(this), true);
};


function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}