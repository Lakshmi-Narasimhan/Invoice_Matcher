var key;


 function sub()
  {
    
  //console.log('prid.length: '+prid.length);
    //var i=1;

    var ref=firebase.database().ref('Purchase_Order');
   // console.log("hi"+ref);
    ref.once('value',gotData,errData);
    
   }

function gotData(data)
{
  console.log('Inside gotData');
 // var val=data.val();
  //console.log('values '+data.val());
  

    if(data.val() == null)
    {
        key =99;
        console.log("First Data :  ",key);
        writeData();

    }
    else if(key!=100)
    {
    console.log('keys '+Object.keys(data.val()));

    console.log('values'+Object.keys(data.val()).values);
    var tot_key = Object.keys(data.val());
    console.log('tot-key  '+tot_key);
    
    var num_of_key = tot_key.length;
    console.log('num key '+num_of_key);

    key = tot_key[num_of_key-1];

    console.log('key dd '+key);
    console.log('Number of children '+data.hasChildren());
    console.log('Number of children of 100 '+data.child("100").numChildren());
   // console.log('child values '+data.hasChild("104"));

    writeData();

                
                      


 
    } 



    }
   
  

function errData(err)
{
  console.log('Error');
  console.log(err);
}
          

function writeData()
{
   ++key;
   console.log(key);

      var ref=firebase.database().ref('Purchase_Order');

      for (var i = 1 ; i < prid.length-1; i++) {

        var rootref=firebase.database().ref().child('Purchase_Order/'+(key)+"/ItemNo:"+i);
        rootref.set({    
        Product_id: prid[i+1],
        Product_name: nam[i+1],
        Quantity : quan[i+1],
        Total_Price : tot_price[i+1] 
      });
  }
  alert("Order Submitted Succesfully...!");
}





var prid = new Array();    
var nam = new Array();  
var quan = new Array(); 
var tot_price = new Array(); 
$(document).ready(function() {
  
  $add = $('#add-user');
  
  setTimeout(function() {
    $add.addClass('hidden');
  }, 200)
  var numRows = 2;
  
  $('input').keyup(function() {
    var isReady = false;
    
    $('input').each(function() {
      if ($(this).val() != '') {
        isReady = true;  
      }
    });
  
    if (isReady) {
      $add.removeClass('hidden'); 
    }
    else {
      $add.addClass('hidden');
    }
  });
  
  $add.on('click', function() {
    var $scope = $('.tb-entry');
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
    
    $scope.after(
      '<div class="tb-data row row-'+numRows+'">' +
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
    

    $('.row-'+numRows).hide();  
    $('.row-'+numRows).slideDown(300);
    
    setTimeout(function() {
      $scope.find('input').removeAttr('disabled');
      $scope.find('input').first().focus();
      $add.addClass('hidden');
    }, 300);
    
    numRows++;
  });
  
 
})
