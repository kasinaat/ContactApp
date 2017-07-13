(function() {
  var ContactApp = (function() {
    var phoneBook = [];
    var container = document.getElementById("contact-holder");

    // main-class representation to denote the model of the app
    function Contact(name, mobile) {
      this.name = name;
      this.mobile = mobile;
      this.setName = function() {
        this.name = name;
        return this;
      };
      this.setMobile = function() {
        this.mobile = mobile;
        return this;
      };
    }

    function init() {
      localStorage.phone;
      var data = window.localStorage.getItem("phone");
      phoneBook = !data ? [] : JSON.parse(data);
    }
    var controller = (function(ContactApp){
      function add() {
        console.log("kasinaat");
        var contact = new Contact(
          document.getElementById("inputName").value,
          document.getElementById("inputMobile").value
        );
        phoneBook.push(contact);
      }
      return{
        add:add
      }
      ContactApp.controller = controller;
    })(ContactApp);

    function view() {
      var contactHold = document.getElementById("contact-holder");
      contactHold.innerHTML =
        "<div class = 'col-lg-3' ></div>\
					<div class='row col-lg-6'>\
					<table id = 'contact-table' class = 'table table-striped'>\
						<tr>\
							<th>S.no</th>\
							<th>Name</th> \
							<th>Mobile</th>\
						</tr>\
					</table>\
				</div>";
      var table = document.getElementById("contact-table");
      for (var i = 0; i < phoneBook.length; i++) {
        var row = table.insertRow();
        var serial = row.insertCell(0);
        var nameCell = row.insertCell(1);
        var mobileCell = row.insertCell(2);
        serial.innerHTML = i + 1;
        nameCell.innerHTML = phoneBook[i].name;
        mobileCell.innerHTML = phoneBook[i].mobile;
      }
    }

    function commit() {
      window.localStorage.setItem("phone", JSON.stringify(phoneBook));
    }
    return {
      init: init,
      commit: commit,
      view: view,
      controller:controller
    };
  })();
  window.ContactApp = ContactApp;
})(window);

window.addEventListener("hashchange", function() {
  var h = window.location.hash;
  console.log(h);
  if (h === "#/view") {
    ContactApp.view();
  }
  if (h === "#/add") {
    sendReq(render, "add.html");
  }
  if (h === "") {
    document.getElementById("contact-holder").innerHTML = "";
  }
  /* if (h === "#/delete") {
    localStorage.clear();
    ContactApp.init();
  } */
});

window.addEventListener("load", function() {
  window.location.hash = "";
  ContactApp.init();
});
window.addEventListener("beforeunload", function() {
  ContactApp.commit();
});
// AJAX calls
function render(data) {
  document.getElementById("contact-holder").innerHTML = data;
  if (document.getElementById("submit-btn")) {
    document.getElementById("submit-btn").addEventListener("click", function() {
      ContactApp.controller.add();
    });
  }
}

function sendReq(callback, fname) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", fname);
  xhr.send(null);
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callback.call(this, this.responseText);
    }
  };
}