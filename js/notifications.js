var ref = firebase.database().ref('Notification'); // Reference to the table Notifications
ref.once('value', gotData, errData);  
var row = document.getElementById("list");         // Get the element list to display notifications

function gotData(data) {
  var i = 0;
  var key = Object.keys(data.val());              // Get the order id number as the sub header of each notification
  data.forEach(function (item) {

    var curr_row = row.insertRow(-1);
    var curr_cell = curr_row.insertCell(0);
    curr_cell.innerHTML = key[i].bold();
    var temp = item.val();
    var para = document.createElement("p");
    var node = document.createTextNode(temp);
    para.appendChild(node);
    curr_cell.appendChild(para);                  // append each status to sub list under each order id as paragraph.
    i++;
  });
}

function errData(err) {
  console.log('Error');
  console.log(err);
}