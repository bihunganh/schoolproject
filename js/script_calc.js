let calo;
document
  .getElementById("calo_form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let age = document.getElementById("age").value;
    let gender = document.getElementById("gender").value;
    let height = document.getElementById("height").value;
    let weight = document.getElementById("weight").value;
    let activity = document.getElementById("activity").value;
    console.log(age);
    let bmr;
    if (gender == 0) {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    calo = bmr * activity;
    if (unit == 1) {
      calo = calo * 4.1868;
    }
    console.log(calo);
    let calo_popup = document.getElementById("calo_popup");
    let rec_calo = document.getElementById("rec_calo");
    rec_calo.innerHTML = `Your recommended daily calories intake: <h4>${Math.ceil(
      calo
    )}</h4>`;
    calo_popup.style.display = "block";
  });

function calo_close() {
  let calo_popup = document.getElementById("calo_popup");
  calo_popup.style.display = "none";
}

function calo_save() {
  let foodJSON = JSON.parse(localStorage.getItem("data"));
  foodJSON["rec_calo"] = calo;
  localStorage.setItem("data", JSON.stringify(foodJSON));
  window.location.href = "index_main.html";
}
