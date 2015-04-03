//define(['DashLite/utils'],  function (utils) {
//
//    "use strict";

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
    
//    return Item;
//
//});