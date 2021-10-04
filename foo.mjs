function myFunction() {
    console.log(this);
}

myFunction();

class someClass {
    myClassFunction() {
        console.log(this);
    }
}

// error
//someClass.myClassFunction();

// lazily create new global var
sc = new someClass();

sc.myClassFunction();

import aFunction from './somemodule.js';

aFunction();


