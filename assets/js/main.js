////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//           STANDATR WRITING FOR "dataJson"
//   {"question": "que1", "answer": [["Yes","3"],["No","2"],...]}
//  into field "question" is located question "que1".
//  into field "answer" is located arrays into which are located answer as string and as link to another question 
//  Link is index of array into questions are located, if this question last need writing in link "nothing"
//////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

let dataJson = `[{"question": "que0", "answer": [["Yes",1],["No","2"],["No savvy","3"]]},
                {"question": "que1", "answer": [["Yes","3"],["No","2"],["No savvy","7"],["Maybe","6"]]},
                {"question": "que2", "answer": [["Yes","nothing"],["No","4"],["Maybe","6"]]},
                {"question": "que3", "answer": [["Yes","5"],["No","nothing"],["No savvy","4"],["Maybe","6"]]},
                {"question": "que4", "answer": [["Yes","nothing"],["No","6"]]},
                {"question": "que5", "answer": [["Yes","7"],["No","nothing"]]},
                {"question": "que6", "answer": [["Yes","nothing"],["No","7"]]},
                {"question": "que7", "answer": [["Yes","nothing"],["No","nothing"]]}]`
dataJson = JSON.parse(dataJson);
console.log(dataJson);

//Algorithm implement through function answerOnQuestion, which iterates over an questiannaire answering question
//iterates over an questiannaire is =  function answerOnQuestion calls itself, if question haves link to another question
//Otherwise when in link will be "nothing". Object "memoryWay" pushes to array "result" and to finishes work function.
function answerOnQuestion(i, j, memoryWay,n) {
    if (dataJson[i].answer[j][1] == 'nothing') {
        // save quetion with answer to "memoryWay"
        memoryWay[dataJson[i].question] = dataJson[i].answer[j][0]; 
        //Object "memoryWay" pushes to array "result"
        result.push({...memoryWay});   
        //console.log(result)        
        //delete memoryWay[dataJson[i].question];
        return result;     
    }else{
        // save quetion with answer to "memoryWay"
        memoryWay[dataJson[i].question] = dataJson[i].answer[j][0]; 
        //Into i is seted index"link" of next question  
        i = dataJson[i].answer[j][1];
        //function launch for each answer on next question
        for (let k = 0; k < dataJson[i].answer.length; k++) {
            //reserve for next functions, otherwise for two function(ways) will one object, and both they will use one object 
            memoryWayReserve[`${k}`][`${n}`] = {...memoryWay};
            //i function set n = n+1, but no n++, because need unique variable "n" for each running function
            //because we can not use needed field of "memoryWayReserve" 
            answerOnQuestion(i,k,memoryWayReserve[`${k}`][`${n}`],n+1);
        }                
    } 
}

//array into will be located ways question
let result = new Array();
let memoryWay = new Object();
let memoryWayReserve = new Object();
//index for "memoryWayReserve"
let n = 0;
//i is index question
let i = 0;
// j is option answer on question
let j = 0;

//console.log(dataJson[i].answer)

let maxAnswers = 0;
//cycle determines largest number of answers by question in "dataJson"
//for create objects for this numbers of answers
for (let k = 0; k <  dataJson.length-1; k++) {
    if (dataJson[k].answer.length > maxAnswers) {
        maxAnswers = dataJson[k].answer.length;
    }         
}

//create objects for reserve way 
function createReserve() {
    for (let k = 0; k < maxAnswers; k++) {
        memoryWayReserve[k]={};
    }
}


createReserve();
//cycle start function "answerOnQuestion" for first question
//k = numbers answer first question
for (let k = 0; k < dataJson[0].answer.length; k++) {
    answerOnQuestion(0,k,memoryWay,n);
    memoryWay = {};
    //clear reserve
    createReserve();
}
    
console.log(result);
//Formation of featback according to standarts
let resultKey = new Array();
let list = new Array();
for (let k = 0; k < result.length; k++) {
    resultKey[k] = Object.keys(result[k]);
    list[k] = new Array();
    for (let h = 0; h < resultKey[k].length; h++) {
        let a = {[`${resultKey[k][h]}`]: result[k][resultKey[k][h]]};
        list[k].push(a)
        //console.log(list[k][h])
    }
    
}
console.log(list)

let featback = {"path":{"number":list.length, "list": list}}
console.log(featback);
//JSON
featback = JSON.stringify(featback);
console.log(featback);  

let wayClient = new Array();

//show qestion and answer and set function
function question(index) {
    let question = document.querySelector('#question');
    let answer = document.querySelector('#answers');
    indexOfQuestion = index;
    console.log(dataJson[index].question)
    question.innerHTML = dataJson[index].question;
    answer.innerHTML = '';
    let answers = dataJson[index].answer;

    for (let i = 0; i < answers.length; i++) {
        answer.innerHTML +=  `<div class="p-1">
            <button id="answer${i}" type="button" class="btn btn-dark">
                ${answers[i][0]}        
            </button>
         </div>`     
    }
    let divAnswer = document.querySelectorAll(`button`);
    console.log(divAnswer);

    for (let i = 0; i < divAnswer.length; i++) {
        divAnswer[i].onclick = request;        
    }
}

//request button" answer"
function request() {
    //console.log(this.id[this.id.length-1]);
    let i = + this.id[this.id.length-1];
    let answers = dataJson[indexOfQuestion].answer
    console.log(indexOfQuestion,i);

    wayClient.push({"question": dataJson[indexOfQuestion].question,"answer": answers[i][0]})
    console.log(wayClient);
    if (answers[i][1] == "nothing") {
        let featbackClient = document.querySelector('main');
        featbackClient.innerHTML = "END"
        console.log("end");
    }else{
        question(answers[i][1]);
    }
};
let indexOfQuestion = 0;

question(indexOfQuestion);


