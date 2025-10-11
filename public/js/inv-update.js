/*
 * This function enables the update button when the user changes the form.
 * Unit 5, Update (step 2) activity
 */ 
const form = document.querySelector("#updateForm");
form.addEventListener("change", function () {
  const updateBtn = document.querySelector("button");
  updateBtn.removeAttribute("disabled");
});
