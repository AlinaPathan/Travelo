(() => {
  "use strict";
  // fetching forms need to apply validation
  const forms = document.querySelectorAll("needs-validation");
  // lopp over them and prevent submission4
  Array.form(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropogation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
});
