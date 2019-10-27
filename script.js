window.onload = function() {
    GameManager.initialize();
    GameManager.newTile();
    
    document.onkeyup = function(e) {
        var curKey = 0, e = e || event;
        curKey = e.keyCode || e.which || e.charCode;
        // console.log(curKey);

        switch (curKey) {
            case 37: // left
            GameManager.move(0,0);
            break;
            
            case 38: // up
            GameManager.move(1,0);
            break;
            
            case 39: // right
            GameManager.move(0,1);
            break;
            
            case 40: // down
            GameManager.move(1,1);
            break;
        }
        
    }
};


let GameManager = {
    points: 0, 
    stage: [],
    
    initialize: function() {
        for (let col = 0; col < 3; col++) {
            this.stage[col] = [];
            for (let row = 0; row < 3; row++) {
                this.stage[col][row] = {
                    boxObj: null,
                    position: [col, row]
                };
            }
        }
    },
    empty: function() {
        let emptyList = [];
        for (let col = 0; col < 3; col++) {
            for (let row = 0; row < 3; row++) {
                if (this.stage[col][row].boxObj == null) {
                    emptyList.push(this.stage[col][row]);
                }
            }
        }
        return emptyList;
    },
    newTile: function() {
        var box = function(obj) {
            var num = Math.random() > 0.9 ? 4 :2;
            this.value = num;
            this.parent = obj;
            this.domObj = function() {
                var domBox = document.createElement('span');
                domBox.innerText = num;
                domBox.className = 'row' + obj.position[0] + ' col' + obj.position[1] + ' num' + num;
                var root = document.getElementById('stage');
                root.appendChild(domBox);
                return domBox;
            }();
            obj.boxObj = this;
        }
        var emptyList = this.empty();
        if (emptyList.length) {
            var randomIndex = Math.floor(Math.random() * emptyList.length);
            new box(emptyList[randomIndex]);
            return true;
        }
    },
    
    move: function (x, y) {
        var can = 0;
        can = this.clear(x, y) ? 1 : 0;
        
        for (var col = 0; col < 3; col++) {
            for (var row = 0; row < 2; row++) {
                var objInThisWay = null
                var objInThisWay2 = null
                switch("" + x + y) {
                    case '00': //left
                    // console.log('00');
                        objInThisWay = this.stage[col][row];
                        objInThisWay2 = this.stage[col][row + 1];
                    break;
                    case '10': // top
                    // console.log('10');
                        objInThisWay = this.stage[row][col];
                        objInThisWay2 = this.stage[row + 1][col];
                    break;
                    case '11': // down
                    // console.log('11');
                        objInThisWay = this.stage[2 - row][col];
                        objInThisWay2 = this.stage[1 - row][col];
                    break;
                    case '01': // right
                    // console.log('01');
                        objInThisWay = this.stage[col][2 - row];
                        objInThisWay2 = this.stage[col][1 - row];
                    break;
                }
                
                if (objInThisWay2.boxObj && objInThisWay.boxObj.value == objInThisWay2.boxObj.value) {
                    this.addTo(objInThisWay2, objInThisWay);
                    this.clear(x, y);
                    can = 1;
                }
            }
        }
        
        
        if (can) {
            this.newTile();
        }
        
        if (this.isEnd()) {
            alert('Game Over');
        }
    },
    clear: function(x,y) {
        var can = 0;
        for (var col = 0; col < 3; col++) {
            var fstEmpty = null;
            for (var row = 0; row < 3; row++) {
                var objInThisWay = null
                switch("" + x + y) {
                    case '00': // left
                        objInThisWay = this.stage[col][row];
                    break;
                    case '10': // up
                        objInThisWay = this.stage[row][col];
                    break;
                    case '11': // right
                        objInThisWay = this.stage[2 - row][col];
                    break;
                    case '01': // down
                        objInThisWay = this.stage[col][2 - row];
                    break;
                    
                }
                if (objInThisWay.boxObj != null) {
                    if (fstEmpty) {
                        this.moveTo(objInThisWay, fstEmpty)
                        fstEmpty = null;
                        row = 0;
                        can = 1;
                    }
                } else if (!fstEmpty) {
                    fstEmpty = objInThisWay;
                }
            }
        }
        return can;
    },
    moveTo: function(obj1, obj2) {
        obj2.boxObj = obj1.boxObj;
        obj2.boxObj.domObj.className = 'row' + obj2.position[0] + ' ' + 'col' + obj2.position[1] + ' ' + 'num' + obj2.boxObj.value;
        obj1.boxObj = null;
    },
    addTo: function(obj1, obj2) {
        obj2.boxObj.domObj.parentNode.removeChild(obj2.boxObj.domObj);
        obj2.boxObj = obj1.boxObj;
        obj1.boxObj = null;
        obj2.boxObj.value = obj2.boxObj.value * 2;
        obj2.boxObj.domObj.className = 'row' + obj2.position[0] + ' col' + obj2.position[1] + ' num' + obj2.boxObj.value;
        obj2.boxObj.domObj.innerText = obj2.boxObj.value;
        this.points += obj2.boxObj.value;
        var scoreBar = document.getElementById('score');
        scoreBar.innerText = this.points;
        // return  obj2.boxObj.value;
    },
    
    isEnd: function() {
        for (var col = 0; col < 3; col++) {
            for (var row = 0; row < 3; row++) {
                if (this.stage[col][row].boxObj != null && this.stage[col][row].boxObj.domObj.value == 128) {
                    return true;
                }
            }
        }
        var emptyList = this.empty();
        if (!emptyList.length) {
            for (var col = 0; col < 3; col++) {
                for (var row = 0; row < 3; row++) {
                    var obj = this.stage[col][row];                    
                    var objLeft = (row == 0) ? {
                        boxObj: {
                            value: 0
                        }
                    } : this.stage[col][row - 1];
                    var objRight = (row == 2) ? {
                        boxObj: {
                            value: 0
                        }
                    } : this.stage[col][row + 1];
                    
                    var objUp = (col == 0) ? {
                        boxObj: {
                            value: 0
                        }
                    } : this.stage[col - 1][row];
                    var objDown = (col == 2) ? {
                        boxObj: {
                            value: 0
                        }
                    } : this.stage[col + 1][row];
                    
                    if (obj.boxObj.value == objLeft.boxObj.value ||
                        obj.boxObj.value == objDown.boxObj.value ||
                        obj.boxObj.value == objRight.boxObj.value ||
                        obj.boxObj.value == objUp.boxObj.value) {
                        return false
                    }
                }
            }
            return true;
        }
    }
}
