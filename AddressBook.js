const fs = require('fs');
const readline = require('readline');
const { checkServerIdentity } = require('tls');
const { Console } = require('console');

const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Makes the directory if not present 
fs.access('directory.json', (err) => {
    if (err) {
      fs.writeFileSync('directory.json',"",(err)=>{
          if(err)throw err;
      });
      return;
    }
});

console.log("Address Book Directory");
console.log("");

// The main question function
ques();
function ques(){
read.question("Press (1) for New Entry | (2) for viewing full directory | (3) for deleting a single entry | (4) for deleting whole directory | (5) for going out of directory.", (option) => {
    switchfunc(option);
  });
}

console.log("");

function switchfunc(op){
    switch (op)
        {
            case '1':
                add();
                break;
             case '2':
                view();
                break;
            case '3':
                single();
                break;
            case '4':
                dirclean();
                break;
            case '5':
                exit();
                break;
            default: console.log("Wrong option. Please Choose again."); 
            console.log("");  
            ask();
        }
       
};

let sp=0;

// Lets you add entries in database
function add(){
    read.question("Enter the name = ", (namev) => {
        read.question("Enter the address = ", (addressv) => {
            let apnd = {
                name:namev,
                address:addressv,
            }
            let json=JSON.stringify(apnd);
            fs.appendFileSync('directory.json',json+",",(err)=>{
                if(err) throw err;
            });
            console.log("");
            console.log("The entry has been stored");
            console.log("");
            ques();
        });
    });
}

// View the full directory
function view(){
    let data=fs.readFileSync('directory.json','utf-8');
    let l=data.length;
    let data1;
    if(data.length<3)
    data1="[]";
    else if(data.charAt(l-1)==',')
    data1="["+data.substring(0,data.length-1)+" ]";
    else if(data.charAt(l-1)=='}')
    data1="["+data.substring(0,data.length)+" ]";
    else if(data.charAt(l-1)==' ')
    data1="["+data.substring(0,data.length-2)+" ]";
    let data2=JSON.parse(data1);
    console.table(data2);
    console.log("");
    if(sp==0)
    ques();
    else if(sp==1)
    return;
}

// Delete a single Line
function single(){
    sp=1;
    console.log("Here is the Full record = ");
    console.log("");
    view();
    sp=0;
    read.question("The line which you want to delete : ", (index) => {
        deleteLine(index);
    });
}

let i;

// Continuation for single Line delete
function deleteLine(index)
{
    let data=fs.readFileSync('directory.json','utf-8');
    let counter=-1; let char;
    for(i=0;i<data.length;i++)
    {
        char=data.charAt(i);
        if(char=="{")
        {
            counter++;
            if(counter==index)
            break;
        }
    }
    let str = data.substring(0,i);
    let ind = data.indexOf('}',i);
    let str1 = data.substring(ind+2);
    str+=str1;
    fs.writeFileSync('directory.json',str);
    console.log("");
    console.log("Task completed successfully");
    console.log();
    ques();
}

// Clean the whole directory down
function dirclean(){
    fs.writeFileSync('directory.json', " ");
    console.log();
    console.log("The directory has been deleted successfully");
    console.log();
    ques();
}

// Exit the Directory
function exit(){
    console.log("");
    console.log("Thank u For using the Address Book");
    console.log("");
    read.close();
}