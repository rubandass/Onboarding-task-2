
//Load data to table

$(document).ready(function () {
    $("#LoadingStatus").html("Loading...");
    //$.get("/Customers/GetCustomerList", null, dataBind);
    dataBind();
    $("#LoadingStatus").html("");  // To remove "Loading..." status text
});

//Bind the data got from Customer Controller into table
function dataBind(CustomerList) {
    $.ajax({
        type: "GET",
        url: "/Customers/GetCustomerList",
        success: function (customerList) {
            for (var i = 0; i < customerList.length; i++) {
                var data =
                    "<tr>" + customerList[i].Id +
                    "<td>" + customerList[i].Name + "</td>" +
                    "<td>" + customerList[i].Address + "</td>" +
                    "<td>" + "<a href='#' class='btn btn-warning' onclick='editCustomer(" + customerList[i].Id + ")'><span class='glyphicon glyphicon-edit'></span> Edit</a>" + "</td>" +
                    "<td>" + "<a href='#' class='btn btn-danger' onclick='deleteCustomer(" + customerList[i].Id + ")'><span class='glyphicon glyphicon-trash'></span> Delete</a>" + "</td>" +
                    "</tr>";
                $("#SetCustomerList").append(data);   //Append the data into existing table body element
            }
        }
    });
}


//Show the pop up modal dialog for create new customer
function addNewCustomer() {

    $("#AddEditform")[0].reset(); //This will bring the customer Add/Edit form inside the modal popup dialog and clear its fields
    $("#CustomerName").css("border-color", "lightgrey");
    $('#CustomerAddress').css("border-color", "lightgrey");
    $("#ModalTitle").html("Add New Customer");
    $("#CustomerModal").modal(); //Show the modal dialog
    $("input:text").keyup(function () { $(this).css("border-color", "lightgrey"); }); //To remove validation error when user starts to type
    $("#btnUpdate").hide();
    $("#btnAdd").show();

}

//Show the pop up modal dialog for Edit customer and get the corresponding customer data based on CustomerId.
function editCustomer(customerId) {
    $("#ModalTitle").html("Customer Details");
    $("#CustomerModal").modal();
    $.ajax({
        type: "GET",
        url: "/Customers/GetCustomerById?customerId=" + customerId,
        success: function (data) {
            var obj = JSON.parse(data);
            $("#CustomerName").css("border-color", "lightgrey");
            $('#CustomerAddress').css("border-color", "lightgrey");
            $("#CustomerId").val(obj.Id);
            $("#CustomerName").val(obj.Name);
            $("#CustomerAddress").val(obj.Address);
            $("input:text").keyup(function () { $(this).css("border-color", "lightgrey"); });
            $("#btnAdd").hide();
            $("#btnUpdate").show();
        }
    });
}
//Add new customer to database
$("#btnAdd").click(function () {
    var res = validate();
    if (res === false) {
        return false;
    }
    var myformdata = $("#SubmitForm").serialize();
    $.ajax({
        type: "POST",
        url: "/Customers/Add",
        data: myformdata,
        success: function (result) {
            //window.location.href = "/Customers/Index";    //Redirecting to Controller AND PAGE WILL BE REFRESHED. OLD METHOD.
            $("#SetCustomerList").empty();
            dataBind();
            $("#CustomerModal").modal("hide");
        }
    });
});


//Edit customer record and save to database
$("#btnUpdate").click(function () {

    var res = validate();
    if (res === false) {
        return false;
    }
    var myformdata = $("#SubmitForm").serialize();
    $.ajax({

        type: "POST",
        url: "/Customers/Update",
        data: myformdata,
        success: function (result) {
            $("#SetCustomerList").empty();
            dataBind();
            $("#CustomerModal").modal("hide");
        }
    });
});

//Show The Popup Modal For DeleteComfirmation
var deleteCustomer = function (customerId) {
    $.ajax({
        type: "GET",
        url: "/Customers/GetCustomerById?customerId=" + customerId,
        success: function (data) {
            var obj = JSON.parse(data);
            $("#spanCustomerName").empty();
            $("#CustomerId").val(obj.Id);
            $("#spanCustomerName").append(obj.Name);
            $("#DeleteConfirmation").modal("show");
        }
    });
};
var confirmDelete = function () {
    $("#DeleteConfirmation").modal("hide");
    var customerId = $("#CustomerId").val();
    $.ajax({
        type: "POST",
        url: "/Customers/Delete?customerId=" + customerId,
        success: function (result) {
            if (result === "Error") {   //This loop will be executed if the controller thrown exception due to foreign key constraint.
                $("#DeleteConfirmationForeignKey").modal();
            }
            $("#SetCustomerList").empty();
            dataBind();
            $("#DeleteConfirmation").modal("hide");
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
};

function deleteCustomerReference() {     //Call another function to delete foreign key constraint records on sales table.
    $("#DeleteConfirmationForeignKey").modal("hide");
    var Id = $("#CustomerId").val();
    $.ajax({
        type: "POST",
        url: "/Sales/DeleteCustomerReference?Id=" + Id,
        success: function (deleteResult) {
            confirmDelete();    //Again calling the normal delete function for Customer delete.
        }
    });
}

//Valdidation using jquery
function validate() {
    var isValid = true;
    if ($('#CustomerName').val().trim() === "") {
        $('#CustomerName').css("border-color", "red");
        //$('#CustomerName').addClass("err");
        isValid = false;
    }

    if ($('#CustomerAddress').val().trim() === "") {
        $('#CustomerAddress').css("border-color", "red");
        isValid = false;
    }

    return isValid;
}