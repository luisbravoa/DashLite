var utils = {
    parse: function(s){
        var div = document.createElement('div');
        div.innerHTML = s;
        return div.firstChild;
    }
};