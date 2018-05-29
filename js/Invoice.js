var key;
var id = new Array();
var pname = new Array();
var pquant = new Array();
var pprice = new Array();
var tot;
var num_of_fields;
var oid;
var res = [];

function sub() // Submit button function
{

  var ref = firebase.database().ref('Purchase_Order');
  ref.once('value', gotData, errData); // To get the last updated PO/Invoice number

}

function gotData(data) {
  if (data.val() == null) // No po has been placed yet
  {
    res.push("No PO Registered...!!!");
  } else {
    var tot_key = Object.keys(data.val());
    var flag = 2;
    var pflag = 0;
    if (data.hasChild(oid)) {
      var po_num_of_fields = data.child(oid).numChildren() 

      if (po_num_of_fields == num_of_fields) {           // checking number of fields in po vs invoice
        for (var i = 0; i < num_of_fields; i++) {
          data.child(oid).forEach(function (item) {
            var temp = item.val();
            if (temp.Product_id == id[i]) {             // Checking for a product id of each item in invoice with po details
              if (flag != 1)                            // flag = 1 is an erroneous condition
                flag = 0;                               // set as 0 when all the entered details are correct
              if (temp.Product_name != pname[i]) {      
                res.push("Mismatch in Name of Product_id : " + id[i]);
                flag = 1;
              }
              if (temp.Quantity != pquant[i]) {
                res.push("Mismatch in Quantity of Product_id : " + id[i]);
                flag = 1;
              }
              if (temp.Total_Price != pprice[i]) {
                res.push("Mismatch in Total_Price of Product_id : " + id[i]);
                flag = 1;
              }
            }
          });

          if (flag == 2) {
            res.push("Product entered does not exist in PO : " + pname[i]);
            pflag = 1;

          }

        }
      } else {
        flag = 1;
        res.push("Mismatch in number of items purchased..!!");
      }
    } else {
      flag = 1;
      res.push("Given Order ID Does not exist..!!");
    }

    if (flag == 0 && pflag == 0) {                  // All the conditions are passed and satisfied
      res.push("Invoice Verified and Approved..!");
    } else {                                        // Any one or more conditions are not satisfied
      res.push("Invoice Rejected .. !");
    }
    alert(res);                                     // Alert the status immediately
    writeData();
  }
}

function errData(err) {
  console.log('Error');
  res.push("Error :", err);
  console.log(err);
}

function writeData() {
  var ref = firebase.database().ref('Notification');        
  var rootref = firebase.database().ref().child('Notification/ ' + oid);
  rootref.set(res);     // Store the entire status in the database
  res = [];             // clearing the staus variable
}

var state = {
  tickets: [{
    name: "Result"
  }],
  headers: ["Header"]
}

function get_header_row(sheet) {                              // Get the header names from first row of xlsx file
  var headers = [],
  range = XLSX.utils.decode_range(sheet['!ref']);             // using xlsx plugin to decode range of excel file
  var C, R = range.s.r;                                       // start from the first row 
  for (C = range.s.c; C <= range.e.c; ++C) {                  // traverse through every column in the range 
    var cell = sheet[XLSX.utils.encode_cell({
      c: C,
      r: R
    })]                                                        // find the cell in the first row */
    var hdr = " ";                                             
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
    headers.push(hdr);                                         // For displaying the xlsx file return the headers of file
  }
  return headers;
}

function fixdata(data) {
  var o = "",
    l = 0,
    w = 10240;
  for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
  return o;
}

function workbook_to_json(workbook) {                 // Workbook converted to json format for analysis
  var result = {};
  workbook.SheetNames.forEach(function (sheetName) {
    var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    if (roa.length > 0) {
      result[sheetName] = roa;
    }
  });
  return result;
}
/** PARSING and DRAGDROP **/
function handleDrop(e) {
  e.stopPropagation();
  e.preventDefault();

  var files = e.dataTransfer.files,i, f;
  for (i = 0, f = files[i]; i != files.length; ++i) {     // For each file by default 1
    var reader = new FileReader(),name = f.name;
    reader.onload = function (e) {
      var results,
        data = e.target.result,
        fixedData = fixdata(data),                        // convert from charcode format to unint8 array format
        workbook = XLSX.read(btoa(fixedData), {
          type: 'base64'
        }),
        firstSheetName = workbook.SheetNames[0],
        worksheet = workbook.Sheets[firstSheetName];
      state.headers = get_header_row(worksheet);          // Gettig header row
      results = XLSX.utils.sheet_to_json(worksheet);      // Convert sheet to json
      state.tickets = results;

      num_of_fields = results.length - 2;                 // No of rows in the excel file that is required
      for (var i = 0; i < results.length - 2; i++) {
        id[i] = results[i]["Product ID"];                  // storing the data in corresponding arrays
        pname[i] = results[i]["Product Name"];
        pquant[i] = results[i]["Quantity"];
        pprice[i] = results[i]["Price"];

      }

      tot = results[i]["Price"];
      oid = results[results.length - 1]["Product Name"];    // Fetching order ID from invoice number field

    };
    reader.readAsArrayBuffer(f);
  }
}

function handleDragover(e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
}


/** VIEW **/
var myView = new Vue({                                    // Using vue.js for displaying the xlsx file in the webpage
  el: "#app",
  data: state,
  methods: {
    handleDragover: handleDragover,
    handleDrop: handleDrop
  }
});