(function (window) {
  var ContactApp = (function () {
    var contacts = [];
    var container;

    function Contact(name, phoneNo) {
      this.name = name;
      this.phoneNo = phoneNo;
      this.setName = function (name) {
        this.name = name;
        return this;
      };
      this.setPhoneNo = function (phoneNo) {
        this.phoneNo = phoneNo;
        return this;
      };
    }

    function view() {
      var template = "<tr><td>{i}</td><td>{name}</td><td>{phoneNo}</td></tr>";
      var result = [];
      for (var i = 0; i < contacts.length; i++) {
        result.push(template.replace("{i}", i + 1)
          .replace("{name}", contacts[i]["name"])
          .replace("{phoneNo}", contacts[i]["phoneNo"]));
      }
      var table = "<table class = 'table table-hover table-responsive' >" +
		"<thead>S.No</thead>\
		<thead>Name</thead>\
		<thead>Phone No</thead>" +
        result.join("") +
        "</table>";
      container.innerHTML = table;
    }

    function init(element) {
      var data = window.localStorage.getItem("contacts");
      contacts = !data ? [] : JSON.parse(data);
      container = element;
    }

    function commit() {
      window.localStorage.setItem("contacts", JSON.stringify(contacts));
    }
    return {
      init: init,
      commit: commit,
      view: view
    };
  })();
  window.ContactApp = ContactApp;
})(window);

window.addEventListener("load", function () {
  ContactApp.init(document.getElementById("contact-holder"));
  ContactApp.init();
});
window.addEventListener("beforeunload", function () {
  ContactApp.commit();
});