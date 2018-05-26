
//Load data to table

$(document).ready(function () {
    $("#LoadingStatus").html("Loading...");
    dataBind();
    $("#LoadingStatus").html("");  // To remove "Loading..." status text
});

//Bind the data got from Store Controller into table
function dataBind(StoreList) {
    $.ajax({
        type: "GET",
        url: "/Stores/GetStoreList",
        success: function (storeList) {
            for (var i = 0; i < storeList.length; i++) {
                var data =
                    "<tr>" + storeList[i].Id +
                    "<td>" + storeList[i].Name + "</td>" +
                    "<td>" + storeList[i].Address + "</td>" +
                    "<td>" + "<a href='#' class='btn btn-warning' onclick='editStore(" + storeList[i].Id + ")'><span class='glyphicon glyphicon-edit'></span> Edit</a>" + "</td>" +
                    "<td>" + "<a href='#' class='btn btn-danger' onclick='deleteStore(" + storeList[i].Id + ")'><span class='glyphicon glyphicon-trash'></span> Delete</a>" + "</td>" +
                    "</tr>";
                $("#SetStoreList").append(data);   //Append the data into existing table body element
            }
        }
    });
}


//Show the pop up modal dialog for create new Store
function addNewStore() {

    $("#AddEditform")[0].reset(); //This will bring the Store Add/Edit form inside the modal popup dialog and clear its fields
    $("#StoreName").css("border-color", "lightgrey");
    $('#StoreAddress').css("border-color", "lightgrey");
    $("#ModalTitle").html("Add New Store");
    $("#StoreModal").modal(); //Show the modal dialog
    $("input:text").keyup(function () { $(this).css("border-color", "lightgrey"); }); //To remove validation error when user starts to type
    $("#btnUpdate").hide();
    $("#btnAdd").show();

}

//Show the pop up modal dialog for Edit Store and get the corresponding Store data based on StoreId.
function editStore(storeId) {
    $("#ModalTitle").html("Store Details");
    $("#StoreModal").modal();

    $.ajax({
        type: "GET",
        url: "/Stores/GetStoreById?storeId=" + storeId,
        success: function (data) {
            var obj = JSON.parse(data);
            $("#StoreName").css("border-color", "lightgrey");
            $('#StoreAddress').css("border-color", "lightgrey");
            $("#StoreId").val(obj.Id);
            $("#StoreName").val(obj.Name);
            $("#StoreAddress").val(obj.Address);
            $("input:text").keyup(function () { $(this).css("border-color", "lightgrey"); });
            $("#btnAdd").hide();
            $("#btnUpdate").show();
        }
    });
}
//Add new Store to database
$("#btnAdd").click(function () {
    var res = validate();
    if (res === false) {
        return false;
    }
    var myformdata = $("#SubmitForm").serialize();
    $.ajax({
        type: "POST",
        url: "/Stores/Add",
        data: myformdata,
        success: function (result) {
            $("#SetStoreList").empty();
            dataBind();
            $("#StoreModal").modal("hide");
        }
    });
});


//Edit Store record and save to database
$("#btnUpdate").click(function () {

    var res = validate();
    if (res === false) {
        return false;
    }
    var myformdata = $("#SubmitForm").serialize();
    $.ajax({

        type: "POST",
        url: "/Stores/Update",
        data: myformdata,
        success: function (result) {
            $("#SetStoreList").empty();
            dataBind();
            $("#StoreModal").modal("hide");
        }
    });
});

//Show The Popup Modal For DeleteComfirmation
function deleteStore(storeId) {
    $.ajax({
        type: "GET",
        url: "/Stores/GetStoreById?storeId=" + storeId,
        success: function (data) {
            var obj = JSON.parse(data);
            $("#spanStoreName").empty();
            $("#StoreId").val(obj.Id);
            $("#spanStoreName").append(obj.Name);
            $("#DeleteConfirmation").modal("show");
        }
    });
}

function confirmDelete() {

    $("#DeleteConfirmation").modal("hide");
    var storeId = $("#StoreId").val();
    $.ajax({
        type: "POST",
        url: "/Stores/Delete?storeId=" + storeId,
        success: function (result) {
            if (result === "Error") {   //This loop will be executed if the controller thrown exception due to foreign key constraint.
                $("#DeleteConfirmationForeignKey").modal();
            }
            $("#SetStoreList").empty();
            dataBind();
            $("#DeleteConfirmation").modal("hide");
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function deleteStoreReference() {     //Call another function to delete foreign key constraint records on sales table.
    $("#DeleteConfirmationForeignKey").modal("hide");
    var Id = $("#StoreId").val();
    $.ajax({
        type: "POST",
        url: "/Sales/DeleteStoreReference?Id=" + Id,
        success: function (deleteResult) {
            confirmDelete();    //Again calling the normal delete function for product delete.
        }
    });
}

//Valdidation using jquery
function validate() {
    var isValid = true;
    if ($('#StoreName').val().trim() === "") {
        $('#StoreName').css("border-color", "red");
        isValid = false;
    }

    if ($('#StoreAddress').val().trim() === "") {
        $('#StoreAddress').css("border-color", "red");
        isValid = false;
    }

    return isValid;
}