  /**
**  Disclaimer: XLSX Code comes from http://oss.sheetjs.com/js-xlsx/
**  This is just a project to show Vue.js working in conjunction with HTML5 Drag and Drop and XLSX
**/
var key;
var id = new Array();    
var pname = new Array();  
var pquant = new Array(); 
var pprice = new Array();
var tot;
var num_of_fields;
var oid;
var res=[];

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
 // console.log('Inside gotData');
 // var val=data.val();
 // console.log('values '+data.val());
  

    if(data.val() == null)
    {
       // key =99;
        console.log("No PO Registered...!!!");
        res.push("No PO Registered...!!!");

    }
    else
    {
    var tot_key = Object.keys(data.val());
    //var num_of_key = tot_key.length;
    var flag = 2;
    var pflag=0;
   // key = tot_key[num_of_key-1];



      
          if(data.hasChild(oid))
          {
            var po_num_of_fields =data.child(oid).numChildren()

            if(po_num_of_fields == num_of_fields)
            {
              for(var i = 0;i<num_of_fields;i++)
              {
                          data.child(oid).forEach(function(item) {
                                        // console.log(item.child());
                          var temp = item.val();
                          if(temp.Product_id==id[i])
                          {
			    if(flag!=1)  
                            	flag=0;
                            if(temp.Product_name != pname[i])
                             {
                                console.log("Mismatch in Name of Product_id : ",id[i]);
                                res.push("Mismatch in Name of Product_id : "+id[i]);

                                flag=1;
                             } 
                            if(temp.Quantity != pquant[i])
                            {
                              console.log("Mismatch in Quantity of Product_id : ",id[i]);
                                res.push("Mismatch in Quantity of Product_id : "+id[i]);

                              flag =1;
                            }  
                             if(temp.Total_Price != pprice[i])
                            {
                              console.log("Mismatch in Total_Price of Product_id : ",id[i]);
                                res.push("Mismatch in Total_Price of Product_id : "+id[i]);

                              flag =1;
                            } 
                          }
                      
               });

                          if(flag == 2)
                          {
                                console.log("Product entered does not exist in PO  ",pname[i]);
                                res.push("Product entered does not exist in PO : "+ pname[i]);
                                pflag=1;

                          }

              }
            }
            else
            {
              flag=1;
              console.log("Mismatch in number of items purchased..!!");
              res.push("Mismatch in number of items purchased..!!");

            }
          }
          else
          {
              flag=1;
              console.log("Given Order ID Does not exist..!!");
              res.push("Given Order ID Does not exist..!!");


          }
      
          if(flag == 0 && pflag ==0)
          {
            console.log("Invoice Verified and Approved..!");
              res.push("Invoice Verified and Approved..!");


          }
          else
          {
            console.log("Invoice Rejected .. !");
              res.push("Invoice Rejected .. !");

          }

          alert(res);
          writeData();
        }
   
 

}

function errData(err)
{
  console.log('Error');
  res.push("Error :",err);
  console.log(err);
}

function writeData()
{
      var ref=firebase.database().ref('Notification');

        var rootref=firebase.database().ref().child('Notification/ '+ oid );
        rootref.set(res);
        res=[];
}




/** DATA STATE **/
var state={
    tickets:[{name:"Result"}],
    headers:["Header"]
  }
/** HELPERS **/
function get_header_row(sheet) {
    var headers = [], range = XLSX.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r; /* start in the first row */
    for(C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})] /* find the cell in the first row */
        var hdr = " "; // <-- replace with your desired default 
        if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
    }
    return headers;
}
function fixdata(data) {
	var o = "", l = 0, w = 10240;
	for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
	o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));   
	return o;
}
function workbook_to_json(workbook) {
	var result = {};
	workbook.SheetNames.forEach(function(sheetName) {
		var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if(roa.length > 0){
			result[sheetName] = roa;
		}
	});
	return result;
}
/** PARSING and DRAGDROP **/
function handleDrop(e) {
  e.stopPropagation();
  e.preventDefault();
//  console.log("DROPPED");
  var files = e.dataTransfer.files, i, f;
  for (i = 0, f = files[i]; i != files.length; ++i) {
    var reader = new FileReader(),
        name = f.name;
    reader.onload = function(e) {
      var results, 
          data = e.target.result, 
          fixedData = fixdata(data), 
          workbook=XLSX.read(btoa(fixedData), {type: 'base64'}), 
          firstSheetName = workbook.SheetNames[0], 
          worksheet = workbook.Sheets[firstSheetName];
      state.headers=get_header_row(worksheet);
      results=XLSX.utils.sheet_to_json(worksheet);
      state.tickets=results;

    num_of_fields = results.length-2;
    for(var i=0;i<results.length - 2;i++)
    {
      id[i] = results[i]["Product ID"];
      pname[i] = results[i]["Product Name"];
      pquant[i] = results[i]["Quantity"];
      pprice[i] = results[i]["Price"];


      // console.log("ID : ",results[i]["Product ID"]);
      // console.log("Name : ",results[i]["Product Name"]);
      // console.log("Quantity : ",results[i]["Quantity"]);
      // console.log("Unit Price : ",results[i]["Price"]);
    }  

      tot = results[i]["Price"];
      oid = results[results.length-1]["Product Name"];
 //     console.log("Total Price : ",results[i]["Price"]);

 //    console.log("Order ID : ",results[results.length-1]["Product Name"]);
    };
    reader.readAsArrayBuffer(f);
  }
}
function handleDragover(e) {
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
}
 /*Testing only*
var drop=document.getElementById("drop");
if(drop.addEventListener) {
	drop.addEventListener('dragenter', handleDragover, false);
	drop.addEventListener('dragover', handleDragover, false);
	drop.addEventListener('drop', handleDrop, false);
}*/

/** VIEW **/
var myView=new Vue({
  el:"#app",
  data:state,
  methods:{
  handleDragover:handleDragover,
  handleDrop:handleDrop
}
});
