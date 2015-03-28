function Item(options){
    this.options = options;




    // create the element
    this.element = utils.parse(
    '<div class="DashLite-item">'+
        '<div class="DashLite-item-header"></div>'+
        '<div class="DashLite-item-content"></div>'+
    '</div>'
    );

    // add it to the content holder
    this.element.querySelector('.DashLite-item-content').innerHTML = (this.options.content);
    if(this.options.title){
        this.element.querySelector('.DashLite-item-header').innerHTML = (this.options.title);
    }

    this.color();

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

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}