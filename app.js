//budget controller
var budgetController = (function(){
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
Expense.prototype.calcPercentage = function(totalIncome){
    if (totalIncome > 0){
    this.percentage = Math.round((this.value / totalIncome) * 100);
    }else{
        this.percentage = -1;
    }
};
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };
     var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
        sum = sum + cur.value;                       
     });
        data.totals[type] = sum;
    }   
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget:0,
        percentage:-1
    }
        
    return{
         addItem: function(type, des, val) {
            var newItem, ID;
            
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            // Push it into our data structure
            data.allItems[type].push(newItem);
            
             var ids,index;
            // Return the new element
            return newItem;
        },deleteItem: function(type, id){
            ids = data.allItems[type].map(function(current){
                return current.id;   
            
            });
            
            index = ids.indexOf(id);
            
            if(index !== -1){
            data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget:function(){
          // calculate total inc and exp 
            calculateTotal('exp');
            calculateTotal('inc');
        
            
        //calculate the budget : income - expenses
        data.budget=data.totals.inc - data.totals.exp
;            
        //calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
        data.percentage = Math.round( (data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.percentage = -1;
            }
        },
        calculatePercentages:function(){
            data.allItems.exp.forEach(function(cur){
               cur.calcPercentage(data.totals.inc);
                
            });
            
        },
        
        getPercentages:function(){
           var allPerc;
            allPerc = data.allItems.exp.map(function(cur){
               return cur.getPercentage(); 
            });
            return allPerc;
        },
        getBudget:function(){
            return{
            budget:data.budget,
    percentage:data.percentage,
    totalInc:data.totals.inc,
    totalExp:data.totals.exp
    
            }
        },
        testing:function(){
            console.log(data);
        }
    };
})();



//ui controller
var UIController = (function(){
    var DOMstring = {
        inputType : '.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
         expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercLabel:'.item__percentage',
        dateLabel:'.budget__title--month'
    }
    
    formatNumer=function(num,type){
            num = Math.abs(num);
            num = num.toFixed(2);
            
            var numSplit = num.split('.');
            
            var int = numSplit[0];
            if(int.length > 3){
                int.substr(0, int.length - 3) + ','+ int.substr(int.length-3,);
            }
            var dec = numSplit[1];
            
            
            
            return (type === 'exp'? '-':'+') + ' ' + int + '.'+dec;
        };
    
    var nodeListForEach = function(list, callback){
                for(var i = 0; i<list.length; i++){
                    callback(list[i], i);
                }
            };
            
    return{
        getInput:function(){
            return{           type: document.querySelector(DOMstring.inputType).value, // value will be inc or exp
            description: document.querySelector(DOMstring.inputDescription).value,
            value:parseFloat(document.querySelector(DOMstring.inputValue).value)
        };
        },
        addListItem:function(obj, type){

                                     
                if(type === 'inc'){
                    element = DOMstring.incomeContainer
                     html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
                } else if (type === 'exp'){
                    element = DOMstring.expensesContainer;
                     html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                    
                }
                      
        newHtml = html.replace('%id%',obj.id);
        newHtml = newHtml.replace('%description%',obj.description);
        newHtml = newHtml.replace('%value%',formatNumer(obj.value,type));
       
            
        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);      
        
        }, deleteListItem:function(selectorID){
           var el =document.getElementById(selectorID); 
        
            el.parentNode.removeChild(el);

        },
        
        clearFields:function(){
           var fields, fieldsArr;
            fields= document.querySelectorAll(DOMstring.inputDescription + ', ' + DOMstring.inputValue);
            
           fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array){
                current.value= "";

            });
            
            fieldsArr[0].focus();
        },
        displayBudget:function(obj){
         var type;
            obj.budget > 0 ? type = 'inc': type = 'exp';
            
  document.querySelector(DOMstring.budgetLabel).textContent = formatNumer(obj.budget,type);
            
       document.querySelector(DOMstring.incomeLabel).textContent = formatNumer(obj.totalInc,'inc');
            
    document.querySelector(DOMstring.expensesLabel).textContent = formatNumer(obj.totalExp,'exp');
            
            
        if(obj.percentage > 0){
            document.querySelector(DOMstring.percentageLabel).textContent = obj.percentage + '%';
        }
        else{
            document.querySelector(DOMstring.percentageLabel).textContent = '---';
    
        }
        
            

        },
        displayPercentages:function(percentages){
            
            var fields = document.querySelectorAll(DOMstring.expensesPercLabel);
            
            
            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }
                else{
                    current.textContent ='---';
                }
            });
        
            
        }, displayMonth : function(){
          
            var now = new Date();
            var year = now.getFullYear();
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var month = now.getMonth();
            
            
        document.querySelector(DOMstring.dateLabel).textContent= months[month] + ' '+ year;
        },
        
        changedType: function() {
            
            var fields = document.querySelectorAll(
                DOMstring.inputType + ',' +
                DOMstring.inputDescription + ',' +
                DOMstring.inputValue);
            
            nodeListForEach(fields, function(cur) {
               cur.classList.toggle('red-focus'); 
            });
            
            document.querySelector(DOMstring.inputBtn).classList.toggle('red');
            
        },
        
        getDOMstrings:function(){
            return DOMstring;
        }
    };
    
})();



//globall App contoller
var controller = (function(budgetCtrl, UIctrl){
    
    var setupEventListeners = function(){
    
    var DOM = UIctrl.getDOMstrings();
        
    document.querySelector(DOM.inputBtn).addEventListener('click',cntrlAdditem);
        
        
 document.addEventListener('keypress',function(event){
        if(event.keyCode === 13|| event.which === 13){
            cntrlAdditem();
        }
        
       
    });
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change',UIctrl.changedType);
        
} 
    
var updateBudget = function(){
         // 1. Calculate the budget 
        budgetCtrl.calculateBudget();
        // 2.return the budget
        var budget = budgetCtrl.getBudget();
        // 3. Display the budget on the UI
        UIctrl.displayBudget(budget);
   };
    
var updatePercentages = function(){
 //1. calculate the percentages
    budgetCtrl.calculatePercentages();
    //2. read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();
   
 
    //3. update the UI with the new percentages
   UIctrl.displayPercentages(percentages);
};
var cntrlAdditem = function(){
        
        var input, newItem;
         // 1. Get the field input data
        input = UIctrl.getInput();
        
        // 2. add the item to budget controller
     if(input.description !=="" && !isNaN(input.value) && input.value > 0){ newItems=budgetCtrl.addItem(input.type, input.description, input.value);      
   // 3. add new item to UI
        UIctrl.addListItem(newItems,input.type);
        
        // 4. clear the fields
        UIctrl.clearFields();
       
    
        //5. calculate and update budget
        updateBudget();
      } 
        //6. calculate and update percetanges
    
        updatePercentages();
    };
    
    var ctrlDeleteItem = function(event){
       var itemID, splitID, type, ID; 
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
    if(itemID){
        //inc-1
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);
        
        //1. Delete the item from the data structure
        budgetCtrl.deleteItem(type,ID);
        
        //2. Delete the item from user interface
        UIctrl.deleteListItem(itemID);
        
        //3. update and show the new budget
        updateBudget();
        
        //4. calculate and update percetanges
    
        updatePercentages();
    }
     };

   return{
       init:function(){ 
           
           console.log('Application has started');
           UIctrl.displayBudget({
               budget:0,
               totalInc:0,
               totalExp:0,
               percentage:-1
           });
           UIctrl.displayMonth();
           setupEventListeners();
           
       
           
       }
   }
    
})(budgetController,UIController);

controller.init();