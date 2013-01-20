(function(){
    
    /* General Helper Functions */
    
    function localStorageExists() {
        try {
            'localStorage' in window && window['localStorage'] !== null;  
        } catch(e) {
            return false;
        }
    }
    
    function isNumber(n){
        return !isNaN(parseFloat(n));
    }
    
    function isString(s) {
        return typeof s === 'string';
    }
    
    function isArray() {
        return true;
    }
    
    function isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]' ? true : false;
    }
    
    /* Exit if localStorage does not exist */
    
    if (!localStorageExists) {
        return;
    }
    
    if (document.getElementsByClassName == undefined) {
        document.getElementsByClassName = function(clName) {
            var allElements = document.getElementsByTagName('*'),
                matchedElements = [];
            for (var i=0; i<allElements.length; i++) {
                var elementClassNames = allElements[i].className.split(' ');
                if (elementClassNames.indexOf(clName) > -1) {
                    matchedElements.push(allElements[i]);
                }
            }
            return matchedElements;
        }
    }
    
    var cartElements = document.getElementsByClassName('mycart');
    
    for (var i = 0; i < cartElements.length; i++) {
        (function(index) {
                /* find the data attribute and set an id after adding */
                cartElements[index].onclick = function() {
                    var id = cartElements[index].id;
                    if (cart.itemExists(id)) {    
                        cart.updateQty(id,1);
                    } else {
                        var data = {
                            'title' : cartElements[index].getAttribute('data-title'),
                            'price' : cartElements[index].getAttribute('data-price'),
                            'qty'   : cartElements[index].getAttribute('data-qty')
                        }
                        cart.addItem(data);
                    }
                }
        })(i);
    }
    
    /* The Cart Object */
    
    var cart = {
        
        ids: [],
        
        addItem: function(data) {
            var id = cart.newId;
            cart.saveItem(id,data);
            
        },
        
        itemExists: function(id) {
            return cart.ids.indexOf(id) > -1;
        },
        
        saveItem: function(id,data){
            var key = id;
            try {
                if (isNumber(key) && isObject(data)){
                    localStorage.setItem(key,data);
                    cart.ids.push(id);
                }
            } catch (e) {
                if (e == QUOTA_EXCEEDED_ERR) {
                    alert('You cannot add more items to the cart.');
                }
            }
        },
        
        updateQty: function(id,val){
            var newQty = localStorage[id]['qty'] + val;
            localStorage[id]['qty'] = newQty;
        },
        
        removeItem: function(key){
            localStorage.removeItem(key);
            delete cart.ids[key];
        },

        newId: function(){
            /* get the previous id + 1 and check if that does not exist anywhere */
            return cart.ids.length ? cart.ids[cart.ids.length-1]+1 : 1;
        },
        
        itemsCount: function() {
            var count = 0;
            for (var i = 0; i < cart.ids.length; i++){
                count += parseInt(localStorage[i]['qty']);
            }
            return count;
        },
        
        subTotal: function() {
            var total = 0;
            for (var i=0;i<cart.ids.length;i++) {
                total += (parseInt(localStorage[i]['qty']) * parseInt(localStorage[i]['price']));
            }
            return total;
        },
        
        grandTotal: function() {
            return cart.subTotal();
        }
    }
    
    cart.views = {
        'widget': function() {
            return ''
        },
        'main': function(){
            
        }
    } 
})();