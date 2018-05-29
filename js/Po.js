// Variables to store the data input
var key;
var prid = new Array();
var nam = new Array();
var quan = new Array();
var tot_price = new Array();


// Triggering function of button submit
function sub() {
  var ref = firebase.database().ref('Purchase_Order');    // Reference to the table Purchase_Order in database
  ref.once('value', gotData, errData);                    // To read the order ID entered last
}

function gotData(data) {
  if (data.val() == null) {                               // For specifying the OID of first entry in database
    key = 99;
    writeData();
  } else {                                                // To read the last entered OID in database
    var tot_key = Object.keys(data.val());
    var num_of_key = tot_key.length;
    key = tot_key[num_of_key - 1];
    writeData();
  }

}


function errData(err) {
  console.log('Error');
  console.log(err);
}


function writeData() {                                  // To write the entered id,name,quantity,price of each item to database
  ++key;
  var ref = firebase.database().ref('Purchase_Order');
  for (var i = 1; i < prid.length - 1; i++) {
    var rootref = firebase.database().ref().child('Purchase_Order/' + (key) + "/ItemNo:" + i);
    rootref.set({
      Product_id: prid[i + 1],
      Product_name: nam[i + 1],
      Quantity: quan[i + 1],
      Total_Price: tot_price[i + 1]
    });
  }
  alert("Order Submitted Succesfully...!");             // Alert on succesfull submission
}


$(document).ready(function () {
  $add = $('#add-user');                                //On-Click of the green add-user button
  setTimeout(function () {
    $add.addClass('hidden');
  }, 200)
  var numRows = 2;

  $('input').keyup(function () {
    var isReady = false;

    $('input').each(function () {
      if ($(this).val() != '') {
        isReady = true;
      }
    });

    if (isReady) {
      $add.removeClass('hidden');
    } else {
      $add.addClass('hidden');
    }
  });

  $add.on('click', function () {
    var $scope = $('.tb-entry');                    // To get details entered on text fields in realtime
    var pr_id = $scope.find('#Product_id').val();
    var name = $scope.find('#Product_name').val();
    var quant = $scope.find('#Quantity').val();
    var price = $scope.find('#price').val();
    prid[numRows] = pr_id;
    nam[numRows] = name;
    quan[numRows] = quant;
    tot_price[numRows] = price;

    $scope.find('input').attr('disabled', 'true');
    $scope.find('input').val('');

    $scope.after(                                  // To further show the details entered as unhighlited texts under the entry fields
      '<div class="tb-data row row-' + numRows + '">' +
      '<ul class="data-options">' +
      '<li><a href="#"><i class="fa fa-pencil"></i> Edit</a></li>' +
      '<li><a href="#"><i class="fa fa-trash-o"></i> Delete</a></li>' +
      '</ul>' +
      '<div class="col">' +
      pr_id +
      '</div>' +
      '<div class="col">' +
      name +
      '</div>' +
      '<div class="col">' +
      quant +
      '</div>' +
      '<div class="col last">' +
      price +
      '</div>' +
      '</div>');


    $('.row-' + numRows).hide();
    $('.row-' + numRows).slideDown(300);

    setTimeout(function () {
      $scope.find('input').removeAttr('disabled');
      $scope.find('input').first().focus();
      $add.addClass('hidden');
    }, 300);

    numRows++;                                  // Increment the total number of rows of each entry
  });


})