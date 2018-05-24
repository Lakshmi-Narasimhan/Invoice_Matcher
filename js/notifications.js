var ref=firebase.database().ref('Notification');
   // console.log("hi"+ref);
ref.once('value',gotData,errData);
res = ["asdsadsd","adwewe","eqweqwe"];
var x = document.getElementById("list");
// var y = x.insertRow(-1);
// var z = y.insertCell(0);


//y.innerHTML = "NEW CELL1";
//z.innerHTML = res[0];


function gotData(data)
{
 // console.log('Inside gotData');
 // var val=data.val();
 var key = Object.keys(data.val());
 console.log('values '+key);
    

   
       // key =99;
       var i=0;
       data.forEach(function(item) {
                                  
            var y = x.insertRow(-1);
            var z = y.insertCell(0);
            z.innerHTML = key[i].bold();
            console.log(key[i].bold());

              // console.log(item.child());
                 var temp = item.val();
                  console.log(temp);    

              var para = document.createElement("p");
              var node = document.createTextNode(temp);
              para.appendChild(node);
              z.appendChild(para);

                   i++;   
               });


   
}
function errData(err)
{
  console.log('Error');
  res.push("Error :",err);
  console.log(err);
}


