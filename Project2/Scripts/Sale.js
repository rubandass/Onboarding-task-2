//Load data to table
$(document).ready(function () {
    $("#LoadingStatus").html("Loading...");
    dataBind();
    $("#LoadingStatus").html("");  // To remove "Loading..." status text
    

});

//Bind the data got from Sale Controller into table
function dataBind(SaleList) {
    $.ajax({
        type: "GET",
        url: "/Sales/GetSaleList",
        success: function (saleList) {
            for (var i = 0; i < saleList.length; i++) {
                var data =
                    "<tr>" + saleList[i].Id +
                    "<td>" + saleList[i].CustomerId + "</td>" +
                    "<td>" + saleList[i].ProductId + "</td>" +
                    "<td>" + saleList[i].StoreId + "</td>" +
                    "<td>" + saleList[i].DateSold + "</td>" +
                    "<td>" + "<a href='#' class='btn btn-warning' onclick='editSale(" + saleList[i].Id + ")'><span class='glyphicon glyphicon-edit'></span> Edit</a>" + "</td>" +
                    "<td>" + "<a href='#' class='btn btn-danger' onclick='deleteSale(" + saleList[i].Id + ")'><span class='glyphicon glyphicon-trash'></span> Delete</a>" + "</td>" +
                    "</tr>";
                $("#SetSaleList").append(data);   //Append the data into existing table body element
            }
        }
    });
}


//Show the pop up modal dialog for create new Sale
function addNewSale() {
    addEditFormReset();
    $("#ModalTitle").html("Add New Sale");
    $("#SaleModal").modal(); //Show the modal dialog
    $("#btnUpdate").hide();
    $("#btnAdd").show();

    $('#CustomerName').change(function () {
        if ($('#CustomerName option:selected').text() !== '--Select Customer--') {
            $("#CustomerName").css("border-color", "lightgrey");
        }
        else {
            $("#CustomerName").css("border-color", "red");
            isValid = false;
        }
    });

    $('#ProductName').change(function () {
        if ($('#ProductName option:selected').text() !== '--Select Product--') {
            $("#ProductName").css("border-color", "lightgrey");
        }
        else {
            $("#ProductName").css("border-color", "red");
            isValid = false;
        }
    });

    $('#StoreName').change(function () {
        if ($('#StoreName option:selected').text() !== '--Select Store--') {
            $("#StoreName").css("border-color", "lightgrey");
        }
        else {
            $("#StoreName").css("border-color", "red");
            isValid = false;
        }
    });

    $('#Datesold').change(function () {
        if ($('#Datesold').val().trim() === "") {
            $('#Datesold').css("border-color", "red");
            isValid = false;
        }
        else {
            $('#Datesold').css("border-color", "lightgrey");
        }
    });

}

function addEditFormReset() {
    $("#AddEditform")[0].reset(); //This will bring the Sale Add/Edit form inside the modal popup dialog and clear its fields
    $("#CustomerName").css("border-color", "lightgrey");
    $('#ProductName').css("border-color", "lightgrey");
    $('#StoreName').css("border-color", "lightgrey");
    $('#Datesold').css("border-color", "lightgrey");
}


//Show the pop up modal dialog for Edit sale and get the corresponding Sale data based on SaleId.
function editSale(saleId) {
    $("#ModalTitle").html("Sale Details");
    addEditFormReset();
    $("#SaleModal").modal();

    $.ajax({
        type: "GET",
        url: "/Sales/GetSaleById?saleId=" + saleId,
        success: function (data) {
            var obj = JSON.parse(data);
            $("#btnAdd").hide();
            $("#btnUpdate").show();

            $('#CustomerName').change(function () {
                if ($('#CustomerName option:selected').text() !== '--Select Customer--') {
                    $("#CustomerName").css("border-color", "lightgrey");
                }
                else {
                    $("#CustomerName").css("border-color", "red");
                    isValid = false;
                }
            });

            $('#ProductName').change(function () {
                if ($('#ProductName option:selected').text() !== '--Select Product--') {
                    $("#ProductName").css("border-color", "lightgrey");
                }
                else {
                    $("#ProductName").css("border-color", "red");
                    isValid = false;
                }
            });

            $('#StoreName').change(function () {
                if ($('#StoreName option:selected').text() !== '--Select Store--') {
                    $("#StoreName").css("border-color", "lightgrey");
                }
                else {
                    $("#StoreName").css("border-color", "red");
                    isValid = false;
                }
            });

            $('#Datesold').change(function () {
                if ($('#Datesold').val().trim() === "") {
                    $('#Datesold').css("border-color", "red");
                    isValid = false;
                }
                else {
                    $('#Datesold').css("border-color", "lightgrey");
                }
            });

            $("#SaleId").val(obj.Id);
            $("#CustomerName").val(obj.CustomerId);
            $("#ProductName").val(obj.ProductId);
            $("#StoreName").val(obj.StoreId);
            var rawSoldDate = new Date(obj.DateSold);
            var day = ("0" + rawSoldDate.getDate()).slice(-2);
            var month = ("0" + (rawSoldDate.getMonth() + 1)).slice(-2);
            var dateSold = rawSoldDate.getFullYear() + "-" + month + "-" + day;
            $("#Datesold").val(dateSold);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

//Add new Sale to database
$("#btnAdd").click(function () {
    var res = validate();
    if (res === false) {
        return false;
    }
    var myformdata = $("#AddEditform").serialize();
    $.ajax({
        type: "POST",
        url: "/Sales/Add",
        data: myformdata,
        success: function (result) {
            $("#SetSaleList").empty();
            dataBind();
            $("#SaleModal").modal("hide");
        }
    });
});


//Edit Sale record and save to database
$("#btnUpdate").click(function () {
    var res = validate();
    if (res === false) {
        return false;
    }
    var myformdata = $("#AddEditform").serialize();
    $.ajax({

        type: "POST",
        url: "/Sales/Update",
        data: myformdata,
        success: function (result) {
            $("#SetSaleList").empty();
            dataBind();
            $("#SaleModal").modal("hide");
        }
    });
});

//Show The Popup Modal For DeleteComfirmation
function deleteSale(saleId) {
    $.ajax({
        type: "GET",
        url: "/Sales/GetSaleByIdWithName?saleId=" + saleId,
        success: function (data) {
            $("#spanCustomerName").empty();
            $("#spanProductName").empty();
            $("#spanStoreName").empty();
            $("#SaleId").val(data.Id);
            $("#spanCustomerName").append(data.CustomerId);
            $("#spanProductName").append(data.ProductId);
            $("#spanStoreName").append(data.StoreId);
            $("#DeleteConfirmation").modal("show");
        }
    });
}
//var deleteSale = function (saleId) {
//    $("#SaleId").val(saleId);
//    $("#spanSaleName").val()
//    $("#DeleteConfirmation").modal("show");
//};
var confirmDelete = function () {
    var saleId = $("#SaleId").val();
    $.ajax({
        type: "POST",
        url: "/Sales/Delete?saleId=" + saleId,
        success: function (result) {
            $("#SetSaleList").empty();
            dataBind();
            $("#DeleteConfirmation").modal("hide");
        }
    });
};

//Validation using jquery
function validate() {
    var isValid = true;
    var dateInput = $("#Datesold").val();

    if ($('#CustomerName option:selected').text() !== '--Select Customer--') {
        $("#CustomerName").css("border-color", "lightgrey");
    }
    else {
        $("#CustomerName").css("border-color", "red");
        isValid = false;
    }

    if ($('#ProductName option:selected').text() !== '--Select Product--') {
        $("#ProductName").css("border-color", "lightgrey");
    }
    else {
        $("#ProductName").css("border-color", "red");
        isValid = false;
    }

    if ($('#StoreName option:selected').text() !== '--Select Store--') {
        $("#StoreName").css("border-color", "lightgrey");
    }
    else {
        $("#StoreName").css("border-color", "red");
        isValid = false;
    }

    if ($('#Datesold').val().trim() === "") {
        $('#Datesold').css("border-color", "red");
        isValid = false;
    }
    else {
        $('#Datesold').css("border-color", "lightgrey");
    }
    return isValid;
}


function ValidateDate(dtValue) {
    var dtRegex = new RegExp(/^\d{1,2}[\/-]\d{1,2}[\/-]\d{4}$/);
    return dtRegex.test(dtValue);
}
