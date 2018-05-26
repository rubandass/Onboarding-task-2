
//Load data to table
$(document).ready(function () {
    $("#LoadingStatus").html("Loading...");
    dataBind();
    $("#LoadingStatus").html("");  // To remove "Loading..." status text
});

//Bind the data got from Product Controller into table
function dataBind(ProductList) {

    $.ajax({
        type: "GET",
        url: "/Products/GetProductList",
        success: function (productList) {
            for (var i = 0; i < productList.length; i++) {
                var data =
                    "<tr>" + productList[i].Id +
                    "<td>" + productList[i].Name + "</td>" +
                    "<td>" + productList[i].Price + "</td>" +
                    "<td>" + "<a href='#' class='btn btn-warning' onclick='editProduct(" + productList[i].Id + ")'><span class='glyphicon glyphicon-edit'></span> Edit</a>" + "</td>" +
                    "<td>" + "<a href='#' class='btn btn-danger' onclick='deleteProduct(" + productList[i].Id + ")'><span class='glyphicon glyphicon-trash'></span> Delete</a>" + "</td>" +
                    "</tr>";
                $("#SetProductList").append(data);   //Append the data into existing table body element
            }
        }
    });
}


//Show the pop up modal dialog for create new Product
function addNewProduct() {

    $("#AddEditform")[0].reset(); //This will bring the customer Add/Edit form inside the modal popup dialog and clear its fields
    $("#ProductName").css("border-color", "lightgrey");
    $('#ProductPrice').css("border-color", "lightgrey");
    $("#ModalTitle").html("Add New Product");
    $("#ProductModal").modal(); //Show the modal dialog
    $("input:text").keyup(function () { $(this).css("border-color", "lightgrey"); }); //To remove validation error when user starts to type
    $("#btnUpdate").hide();
    $("#btnAdd").show();

}

//Show the pop up modal dialog for Edit Product and get the corresponding Product data based on ProductId.
function editProduct(productId) {
    $("#ModalTitle").html("Product Details");
    $("#btnAdd").hide();
    $("#btnUpdate").show();


    $.ajax({
        type: "GET",
        url: "/Products/GetProductById?productId=" + productId,
        success: function (data) {
            var obj = JSON.parse(data);
            $("#ProductName").css("border-color", "lightgrey");
            $('#ProductPrice').css("border-color", "lightgrey");
            $("#ProductId").val(obj.Id);
            $("#ProductName").val(obj.Name);
            $("#ProductPrice").val(obj.Price);
            $("#ProductModal").modal();
            $("input:text").keyup(function () { $(this).css("border-color", "lightgrey"); });

        }
    });
}
//Add new Product to database
$("#btnAdd").click(function () {
    var res = validate();
    if (res === false) {
        return false;
    }
    var myformdata = $("#SubmitForm").serialize();
    $.ajax({
        type: "POST",
        url: "/Products/Add",
        data: myformdata,
        success: function (result) {
            $("#SetProductList").empty();
            dataBind();
            $("#ProductModal").modal("hide");
        }
    });
});


//Edit Product record and save to database
$("#btnUpdate").click(function () {
    var res = validate();
    if (res === false) {
        return false;
    }
    var myformdata = $("#SubmitForm").serialize();
    $.ajax({

        type: "POST",
        url: "/Products/Update",
        data: myformdata,
        success: function (result) {
            $("#SetProductList").empty();
            dataBind();
            $("#ProductModal").modal("hide");
        }
    });
});

//Show The Popup Modal For DeleteComfirmation
function deleteProduct(productId) {
        $.ajax({
            type: "GET",
            url: "/Products/GetProductById?productId=" + productId,
            success: function (data) {
                var obj = JSON.parse(data);
                $("#spanProductName").empty();
                $("#ProductId").val(obj.Id);
                $("#spanProductName").append(obj.Name);
                $("#DeleteConfirmation").modal("show");
            }
        });
}

function confirmDelete() {
    
    $("#DeleteConfirmation").modal("hide");
    var productId = $("#ProductId").val();
    $.ajax({
        type: "POST",
        url: "/Products/Delete?productId=" + productId,
        success: function (result) {
            if (result === "Error") {   //This loop will be executed if the controller thrown exception due to foreign key constraint.
                $("#DeleteConfirmationForeignKey").modal();
            }
                $("#SetProductList").empty();
                dataBind();
                $("#DeleteConfirmation").modal("hide");
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function deleteProductReference() {     //Call another function to delete foreign key constraint records on sales table.
    $("#DeleteConfirmationForeignKey").modal("hide");
    var Id = $("#ProductId").val();
    $.ajax({
        type: "POST",
        url: "/Sales/DeleteProductReference?Id=" + Id,
        success: function (deleteResult) {
            confirmDelete();    //Again calling the normal delete function for product delete.
        }
    });
}

//Valdidation using jquery
function validate() {
    var isValid = true;
    if ($('#ProductName').val().trim() === "") {
        $('#ProductName').css("border-color", "red");
        isValid = false;
    }


    if ($('#ProductPrice').val().trim() === "") {
        $('#ProductPrice').css("border-color", "red");
        isValid = false;
    }
    else {
        var input = $('#ProductPrice').val().trim();
        $('#ProductPrice').css("border-color", "red");
        isValid = isDecimal(input);
    }

    return isValid;
}

function isDecimal(input) {
    var regex = /^\s*-?[1-9]\d*(\.\d{1,2})?\s*$/;   //Regular Expression
    return regex.test(input);   //returns a boolean

}

