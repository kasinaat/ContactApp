
/* ----------------------------Contact App---------------------------------- */

(function () {
  /* Immediately Invoked Function Expression
   */

  var ContactApp = (function () {
    /* Array to store contacts */
    var phoneBook = [];

   /*  Main-class representation to denote the model of the app */
    function Contact(id, name, mobile) {
      this.id = id;
      this.name = name;
      this.mobile = mobile;
      this.setName = function () {
        this.name = name;
        return this;
      };
      this.setMobile = function () {
        this.mobile = mobile;
        return this;
      };
      this.setId = function () {
        this.id = id;
      };
    }

    /* End of class defintion------------------------------- */



/*-------------------- Init Function------------------ */
    function init() {
      localStorage.phone;
      var data = window.localStorage.getItem("phone");
      phoneBook = !data ? [] : JSON.parse(data);
    }
/*-------------------- Init Function------------------ */




/*-------------------- Controller Function------------------ */
    var controller = (function (ContactApp) {
      function add(event) {
        var len = phoneBook.length;
        var flag = 0;
        var id = 100;
        var contactRegex = /[0-9]{10}/;
        var contactName = document.getElementById("inputName").value;
        var mobileNumber = document.getElementById("inputMobile").value;
        if (
          contactName === undefined ||
          contactName === "" ||
          contactName === null
        ) {
          document.getElementById('errorBox').innerHTML = "Please enter Contact Name";
          event.preventDefault();
          return false;
        } else if (!contactRegex.test(mobileNumber)) {
          event.preventDefault();
          document.getElementById('errorBox').innerHTML = "Please enter Valid Mobile Number";
          return false;
        } else {
          for (var i = 0; i < phoneBook.length; i++) {
            if (phoneBook[i].name === contactName) {
              event.preventDefault();
              flag = 1;
              document.getElementById('errorBox').innerHTML = "Contact Already Exists";
              break;
            }
          }
          if (!flag) {
            var contact = new Contact(id + len, contactName, mobileNumber);
            phoneBook.push(contact);
            id++;
          }
        }
      }

      function edit() {
        var name = document.getElementById('inputName').value;
        var mobile = document.getElementById('inputMobile').value;
        var idRegex = /\d+/g;
          var flag = false;
          var temp;
          var contactId = idRegex.exec(window.location.hash);
          for (var i = 0; i < phoneBook.length; i++) {
            if (phoneBook[i].id == contactId) {
              flag = true;
              temp = i;
              break;
            }
          }
          if (flag) {
            phoneBook[temp].name = name;
            phoneBook[temp].mobile = mobile;
          }
      }

      function remove(id) {
        for (var i = 0; i < phoneBook.length; i++) {
          if (phoneBook[i].id == id) {
            phoneBook.splice(i, 1);
          }
        }
        window.location.href = "#/view";
      }
      return {
        add: add,
        edit: edit,
        remove: remove
      };
      ContactApp.controller = controller;
    })(ContactApp);

/*-------------------- Controller Function End------------------ */



/*-------------------- View Function ------------------ */

    var view = (function () {
      function contacts() {
        var contactHold = document.getElementById("contact-holder");
        contactHold.innerHTML =
          "<div class = 'col-lg-3' ></div>\
					<div class='row col-lg-6'>\
					<table id = 'contact-table' class = 'table table-striped'>\
						<tr>\
							<th>S.no</th>\
							<th>Name</th> \
              <th>Mobile</th>\
              <th>Action</th>\
						</tr>\
					</table>\
				</div>";
        var table = document.getElementById("contact-table");
        for (var i = 0; i < phoneBook.length; i++) {
          var row = table.insertRow();
          var serial = row.insertCell(0);
          var nameCell = row.insertCell(1);
          var mobileCell = row.insertCell(2);
          var actionCell = row.insertCell(3);
          serial.innerHTML = i + 1;
          nameCell.innerHTML = phoneBook[i].name;
          mobileCell.innerHTML = phoneBook[i].mobile;
          actionCell.innerHTML =
            '<button class="btn btn-success"><a href="#/edit/' +
            phoneBook[i].id +
            '">Edit</a></button>\
          <button id="delete" class="btn btn-danger"><a href="#/delete/' +
            phoneBook[i].id +
            '">delete</a></button>';
        }
      }

      function editView() {
        if (document.getElementById('edit-btn')) {
          var name = document.getElementById('inputName');
          var mobile = document.getElementById('inputMobile');
          var idRegex = /\d+/g;
          var flag = false;
          var temp;
          var contactId = idRegex.exec(window.location.hash);
          for (var i = 0; i < phoneBook.length; i++) {
            if (phoneBook[i].id == contactId) {
              flag = true;
              temp = i;
              break;
            }
          }
          if (flag) {
            name.value = phoneBook[temp].name;
            mobile.value = phoneBook[temp].mobile;
          }
        }
      }
      return {
        contacts: contacts,
        editView: editView
      }
      ContactApp.view = view;
    })();

 /*-------------------- View Function End------------------ */

/*-------------------- Commit Function ------------------ */

    function commit() {
      window.localStorage.setItem("phone", JSON.stringify(phoneBook));
    }

/*-------------------- Commit Function End------------------ */

    return {
      init: init,
      commit: commit,
      view: view,
      controller: controller
    };
  })();
  window.ContactApp = ContactApp;
})(window);
/* ----------------------------Contact App End---------------------------------- */










/* ----------------------------HASH CHANGE Event Listeners---------------------------------- */
window.addEventListener("hashchange", function () {
  var h = window.location.hash;
  var editRegex = /#\/[edit]+\/[0-9]+/g;
  var deleteRegex = /#\/[delete]+\/[0-9]+/g;
  var idRegex = /\d+/g;
  if (h === "#/view") {
    ContactApp.view.contacts();
  }
  if (h === "#/add") {
    sendReq(render, "add.html");
  }
  if (h === "") {
    document.getElementById("contact-holder").innerHTML = "";
  }
  if (editRegex.test(h)) {
    sendReq(render, "edit.html");

  }
  if (deleteRegex.test(h)) {
    var id = idRegex.exec(h);
    ContactApp.controller.remove(id[0]);
  }
});
/* ----------------------------HASH CHANGE Event Listeners End---------------------------------- */






/* ----------------------------Init And Commit---------------------------------- */

window.addEventListener("load", function () {
  window.location.hash = "";
  ContactApp.init();
});
window.addEventListener("beforeunload", function () {
  ContactApp.commit();
});
/* ----------------------------Init And Commit end---------------------------------- */



/* ----------------------------Ajax Calls---------------------------------- */


function render(data) {
  document.getElementById("contact-holder").innerHTML = data;
  if (document.getElementById("submit-btn")) {
    document
      .getElementById("submit-btn")
      .addEventListener("click", function (event) {
        ContactApp.controller.add(event);
      });
  }
  if (document.getElementById('contact-holder') && document.getElementById('edit-btn')) {
    ContactApp.view.editView();
    document.getElementById('edit-btn').addEventListener('click', function () {
      ContactApp.controller.edit();
    });
  }
}

function sendReq(callback, fname) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", fname);
  xhr.send(null);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback.call(this, this.responseText);
    }
  };
}



/* ----------------------------Ajax Calls End---------------------------------- */
