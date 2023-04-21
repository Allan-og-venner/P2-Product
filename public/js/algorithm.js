//let startTime = performance.now()
const helper = require('./algHelpers.js');

//Define values that should be given by the website
let min = 0;
let StudentNum = 100;
let groupSize = 7;
const roleNumber = 9
const maxIterations = 100
//const minDiversity = 0.75

//Creates the object Student
function Student(first, index, prefs = [], blocks = [], roles = [], groupNr, topics = []) {
    this.firstName = first;
    this.index = index;
    this.prefs = prefs;
    this.blocks = blocks;
    this.roles = roles;
    this.groupNr = groupNr;
    this.topics = topics;
}

//Creates the object Group
  function Group(students = [], isFull) {
    this.students = students;
    this.isFull = isFull;
}

/**
* For debugging
* Only purpose is to randomize the students preference to eachother
* Can be deleted
*/
function getRandomInts(max,block,numbers){
    let array = []
    while (array.length < numbers){
        let a = Math.floor(Math.random() * (max-1))
        if (a >= block){
            a++
        }
        if (array.indexOf(a) == -1){
            array.push(a)
        }
    }
    return array
}
/**
 * 
 */
  


//Initilize the student arrays with StudentNum amount of students 
let students = [];
for (let s = 0;s<StudentNum;s++) {
    let student0 = new Student(["Student "+s], 0, getRandomInts(StudentNum,s,14), [], getRandomInts(8,-1,3), -1, [])
    students.push(student0)
}

//Calculate whether the group member size adds up (groups can be made
// with the group member size but some groups may have one less group member)  
amountOfStudents = students.length;
updatedGroupSize = Math.ceil(amountOfStudents/Math.ceil(amountOfStudents/groupSize));

//If it adds up. updatedGroupSize will be the same as groupSize
if (updatedGroupSize != groupSize) {
    console.log("The group size does not add up. The new size is: ", updatedGroupSize)
}

//Updates the student array so each student have their index
helper.indexStudents(students);

//Returns the preferenceMatrix
let matrix = preferenceMatrix(students);

//Returns the created groups
let groups = prefGroups(students, matrix, updatedGroupSize);

/**
* Creates a preferenceMatrix consisting of
* Each student's preference for the other students
*/
function preferenceMatrix (students) {
//initilize step of the function
const numStudents = students.length;
let preferenceMatrix = new Array(numStudents);
for (let i = 0; i < numStudents; i++) {
    preferenceMatrix[i] = new Array(numStudents);
}

//Loops through all rows in the matrix
row_loop:
for (let row = 0; row < numStudents; row++) {
    //A students preference to theirselves is set to 0
    preferenceMatrix[row][row] = 0;

    //Loops through all colums starting from the
    //calculations that have not been calculated yet 
    column_loop:
    for (let col = row+1; col < numStudents; col++) {
        let prefScore = 0;
        //Calculate the prefScore, consisting of: 
        //  student A's preference to student B  and 
        //  student B's preference to student A 
        prefScore = helper.prefCheck(students[row], students[col], numStudents) + helper.prefCheck(students[col], students[row], numStudents)
            

/**
 * Check for topics
 */


        let = commonTopics = true
        //Loops through student A's topics and checking for a match with student B.
        //If a match occur, they have at least 1 common topic and the loop stops
        if(students[row].topics.length > 0 && students[col].topics.length > 0){
            commonTopics = false;
            for (let topic = 0; topic < students[row].topics.length; topic++) {
                if (students[col].topics.includes(students[row].topics[topic])) {
                    commonTopics = true;
                    break;
                }
            }
        }

        //In case both students does not have any common topics
        //the prefScore will be raised with the number of students
        if (!commonTopics) {
            prefScore += numStudents;
        }

        //The prefScore is assigned to both indexes in the matrix
        preferenceMatrix[row][col] = prefScore;
        preferenceMatrix[col][row] = prefScore;
    }
}
return preferenceMatrix;
}



function prefGroups (students, matrix, groupSize) {  
    const groupNumber = Math.ceil(students.length/groupSize);
    
    let smallerGroups = 0;
    if ((students.length % groupSize) != 0) {

        smallerGroups = groupSize - (students.length % groupSize);
        while (smallerGroups > groupNumber) {
            groupSize -= Math.floor(smallerGroups/groupNumber);
            smallerGroups = groupSize - (students.length % groupSize);
        }
    }

    let groups = []; 
    for (let i = 0; i < groupNumber; i++) {
        let group = new Group (new Array(2),false)
        groups.push(group)
    }
    
    let j = 0;
    for (let groupNum = 0; groupNum < groupNumber; groupNum++) {
        while (students[j].groupNr != -1) {
            j++;
        }
        groups[groupNum].students[0] = students[j];
        students[j].groupNr = groupNum;
        //Creates an array without references in order to sort preference values
        let sortedStudentToStudentsPrefs = matrix[j].slice();
        //Sorts preference values in increasing order
        sortedStudentToStudentsPrefs.sort((a, b) =>(a - b)); 
        
        let a = 1
        let matrixIndex = -1
        do {            
            if (sortedStudentToStudentsPrefs[a] != sortedStudentToStudentsPrefs[a-1]) {
                matrixIndex = -1
            }
            //k gets assigned the indexOf the lowest preference value.
            //If the student is in a group the IndexOf searches for the next value
            //k + 1 allows to find the next student with same preference value in the matrix[j]
            matrixIndex = matrix[j].indexOf(sortedStudentToStudentsPrefs[a], matrixIndex + 1);            
            a++
        } while (students[matrixIndex].groupNr != -1)
        
        groups[groupNum].students[1] = students[matrixIndex]
        students[matrixIndex].groupNr = groupNum
    }

    let studentToGroupsPref = [];
    for (let x = groupNumber; x < students.length; x++) {
        if (students[x].groupNr != -1) {
            continue;
        }
        let groupNum = 0
        let a = 0
        studentToGroupsPref = new Array(groupNumber)

        for (groupNum; groupNum < groupNumber; groupNum++) {
            if (groups[groupNum].isFull) {
                studentToGroupsPref[groupNum] = 0;
                a++
                continue;
            }
            
            studentToGroupsPref[groupNum] = 0;
            let j = 0;

            for (j; j < groupSize; j++) {
                if (groups[groupNum].students[j] == undefined) {
                    break;
                }
                studentToGroupsPref[groupNum] += helper.findPrefSum(students[x], groups[groupNum].students[j], matrix);
            }
            studentToGroupsPref[groupNum] /= j;
        } 
        //Creates an array without references in order to sort preference values
        let sortedStudentToGroupsPref = studentToGroupsPref.slice();
        //Sorts preference values in increasing order
        sortedStudentToGroupsPref.sort((a, b) =>(a - b)); 
        groupNum = studentToGroupsPref.indexOf(sortedStudentToGroupsPref[a]);

        groups[groupNum].students.push(students[x]);
        students[x].groupNr = groupNum;
        if (groups[groupNum].students.length == groupSize || (groupNum >= groupNumber - smallerGroups && groups[groupNum].students.length == groupSize - 1)) {
            groups[groupNum].isFull = true;
        }
    }


    /**
     * Only purpose is to print the groups for debugging.
     * Can be deleted
     */
    for (let i = 0; i < 1; i++) {
        console.log(" Initial group:",i)
        for (let j = 0; j < groupSize; j++) {
            if (groups[i].students[j] != undefined) {
                console.log(groups[i].students[j].firstName,groups[i].students[j].groupNr)
            }
        }    
    }
     /**
     * 
     */

    return groups
}


//This function takes a student (the origin) and finds the best possible swap between a set of groups
//It compares the student to every other student in every other group
//If certain swaps make the number of groups above minimum diversity bigger, make one of those swaps
//Else, make the swap that doesn't decrease the diversity while still lowering the pref number as much as possible
//Returns the group and index of the person that should be swapped
function swapCheck(origin, groups, minDiversity, matrix){
    let originGroup = groups[origin.groupNr];
    let originIndex = originGroup.students.indexOf(origin);
    let prefDelta = new Array(students.length);
    prefDelta[origin.index] = 1
    let divImprovements = new Array(students.length).fill(false);
    //Initialize some 2-element arrays.
    //The first element is for the origin group and the second element is for the new group.
    let diverseOld = [false, false];
    let diverseNew = [false, false];
    diverseOld[0] = helper.groupDiversityCheck(originGroup, minDiversity);
    let prefAvgOld = [0, 0];
    let prefAvgNew = [0, 0];
    prefAvgOld[0] += helper.groupPrefAvg(origin, originGroup, matrix);
    //This loop goes through every group
    for(let i in groups){
        diverseOld[1] = helper.groupDiversityCheck(groups[i], minDiversity)
        //If this is the origin's group, no swaps need to be checked
        if(originGroup == groups[i]){
            continue;
        }
        //Now to through all students to check what a swap would do
        for(j in groups[i].students){
            let target = groups[i].students[j]
            prefAvgOld[1] = helper.groupPrefAvg(target, groups[i], matrix)
            helper.swapStudents(originGroup, originIndex, groups[i], j);
            diverseNew[0] = helper.groupDiversityCheck(originGroup, minDiversity)
            diverseNew[1] = helper.groupDiversityCheck(groups[i], minDiversity)
            //If the number of diverse groups is not decreased by the swap, calculate the preference delta
            let diversityDelta = diverseNew[0] + diverseNew[1] - diverseOld[0] - diverseOld[1];
            if(diversityDelta > 0){
                divImprovements[target.index] = true
            }
            if(diversityDelta >= 0){
                //The preference delta is simply the difference in average preference for the two groups
                prefAvgNew[0] = helper.groupPrefAvg(target, originGroup, matrix);
                prefAvgNew[1] = helper.groupPrefAvg(origin, groups[i], matrix);
                prefDelta[target.index] = prefAvgNew[0] + prefAvgNew[1] - prefAvgOld[0] - prefAvgOld[1];
            }
            //If the diversity will get worse from this swap, set prefDelta to 0, indicating no swap
            else{
                prefDelta[target.index] = 0;
            }
            helper.swapStudents(originGroup, originIndex, groups[i], j);
        }
    }
    //If no swaps can increase the number of diverse groups, simply return the best swap
    if(divImprovements.indexOf(true) == -1){
        let bestSwap = helper.findMin(prefDelta);
        //If the best swap does not improve the pref satisfaction (ie. is not negative), return 0
        if(prefDelta[bestSwap] >= 0)
            return -1;
        else 
            return bestSwap;
    }
    //If there exist swaps that increase the number of diverse groups, find the best of these swaps and return it
    else{
        return helper.findMinSpace(prefDelta, divImprovements);
    }
}


//This hill climbing algorithm takes the following input
//An array of students
//An array of groups containing only these students
//A minimum diversity as a fraction
//A preference matrix
//First, it calls checkMinDiversity to find how many groups are below it
//Then, it continuously calls swapCheck to ensure minDiversity is reached as far as possible
//Then, it continues to call swapCheck until no improving swaps can be made
//It also terminates after a large number of iterations
function masterAlgorithm(students, groups, minDiversity, matrix, maxIterations){
    let homogenousGroups = helper.checkMinDiversity(groups, minDiversity);
    //If there exist groups that do not fulfill min diversity, start with those
    if (homogenousGroups.length > 0){
        //Call swapCheck on each student in these groups
        for(let i in homogenousGroups){
            for(let j in homogenousGroups[i].students){
                let targetIndex = swapCheck(homogenousGroups[i].students[j], groups, minDiversity, matrix);
                //Only swap if there is a valid target
                if(targetIndex > 0){
                    let originGroup = groups[groups.indexOf(homogenousGroups[i])]
                    let target = students[targetIndex]
                    let targetGroup = groups[target.groupNr];
                    //console.log("div swap: swapped student " + groups[i].students[j].index + " with " + target.index)
                    helper.swapStudents(originGroup, j, targetGroup, targetGroup.students.indexOf(target));
                }
            }
        }
    }                
    let swapped = true
    let iterations = 0
    //Now loop through all the students, calling swapCheck
    //Keep looping until not a single improving swap can be made
    //max iterations will be some variable that makes the program terminate in case it runs too long
    while(swapped == true && iterations <= maxIterations){
        //console.log("entered while loop")
        swapped = false;
        iterations++;
        for(let i in groups){
            for(let j in groups[i].students){
                let targetIndex = swapCheck(groups[i].students[j], groups, minDiversity, matrix)
                if(targetIndex > 0){
                    let target = students[targetIndex]
                    let targetGroup = groups[target.groupNr];
                        //console.log("normal swap: swapped student " + groups[i].students[j].index + " with " + target.index)
                    helper.swapStudents(groups[i], j, targetGroup, targetGroup.students.indexOf(target));
                    swapped = true;
                }
            }
        }
    }
    if(iterations == maxIterations){
        console.log("Reached max iterations, terminating")
    }
    else{
        console.log("No more swaps can be made, terminating")
    }
    return groups
}


//This function will return an array of arrays of groups, with maximized role diversity
function findMinDiversity(students, groupSize){
    let groupNumber = Math.ceil(students.length/groupSize);
    //If the students cannot be evenly divided, there have to be a number of smaller groups
    let smallerGroups = 0;
    if(students.length % groupSize != 0){
        smallerGroups = groupSize - (students.length % groupSize)
     }
    //small_group_size = ceiling(smallerGroups/groupNumber)
        while(smallerGroups > groupNumber){
            groupSize -= Math.floor(smallerGroups/groupNumber)
            smallerGroups = groupSize - (students.length % groupSize)
        }
    let groups = [];
    for(let i = 0; i < groupNumber; i++){
        let newGroup = new Group (new Array(),false);
        groups.push(newGroup);
    }
    let overlap = new Array(groupNumber);
    //The first student in the first group, since order does not matter
    groups[0].students[0] = students[0];
    //Looping through each student to put them into groups, labelling loops to be able to break loops properly
    student_loop: for(let student = 1; student < students.length; student++){
        //Looping through the groups to compare to current student 
        group_loop: for(let i in groups){
            if(groups[i].students.length == 0){
                groups[i].students.push(students[student]);
                continue student_loop;
            }
            if(groups[i].isFull == true){
                overlap[i] = -1;
                continue;
            }
            overlap[i] = 0;
            compare_loop: for(let j in groups[i].students){
                //Calculate the overlap between current student and group until a space is empty
                overlap[i] += helper.roleCheck(students[student], groups[i].students[j])
                    if(groups[i].students.length < j){
                        //If overlap is 0, student is placed into group
                        //If student is placed into a group, break so that the student loop continues
                        //Else, break so that the next loop is checked
                        if(overlap[i] == 0){
                            groups[i].push(students[student]);
                            break group_loop;
                        }
                        break;
                    }
            }
        }
        let i = helper.findMinPos(overlap);
        groups[i].students.push(students[student]);
        //If the number of students in the group is equal to the group size, or 1 smaller if the group is part of the last smaller groups, it becomes full
        if(groups[i].students.length >= groupSize ||
          (i > groupNumber - smallerGroups && groups[i].students.length == groupSize - 1))
            groups[i].isFull = true
    }
    //Finding the minimum diversity, meaning the number of unique roles in a group divided by the total number of roles
    let diversityMin = helper.checkRoleDiversity(groups[0].students, roleNumber)
    for(i = 1; i < groups.length; i++){
        let diversity = helper.checkRoleDiversity(groups[i].students, roleNumber)
        if(diversity < diversityMin){
            diversityMin = diversity
        }
    }
    //EDIT HERE TO CHANGE MINIMUM DIVERSITY CALCULATIONS
    return diversityMin;
}


//Below here is only for testing

let minDiversity = findMinDiversity(students, groupSize);

let totalPercent = 0;
let totalDiverse = 0
for(let i in groups){
    let prefSum = helper.groupPrefSum(groups[i].students, matrix);
    let percent = helper.prefSatisfactionPercent(prefSum, StudentNum, groups[i].students.length)
    totalDiverse += helper.groupDiversityCheck(groups[i], minDiversity)
    totalPercent += percent;
    console.log("Pref satisfaction of group" + i + ": " + percent);
}
console.log(totalPercent/Math.ceil(StudentNum/groupSize))
console.log(totalDiverse/Math.ceil(StudentNum/groupSize))

console.log(masterAlgorithm(students, groups, minDiversity, matrix, maxIterations))

for (let i = 0; i < 1; i++) {
    for (let j = 0; j < groupSize; j++) {
        if (groups[i].students[j] != undefined) {
            console.log(groups[i].students[j].firstName,groups[i].students[j].groupNr);
        }
    }    
}

totalPercent = 0;
totalDiverse = 0;
for(let i in groups){
    let prefSum = helper.groupPrefSum(groups[i].students, matrix);
    let percent = helper.prefSatisfactionPercent(prefSum, StudentNum, groups[i].students.length);
    totalDiverse += helper.groupDiversityCheck(groups[i],minDiversity)
    totalPercent += percent;
    console.log("Pref satisfaction of group" + i + ": " + percent);
}
console.log(totalPercent/Math.ceil(StudentNum/groupSize))
console.log(totalDiverse/Math.ceil(StudentNum/groupSize))