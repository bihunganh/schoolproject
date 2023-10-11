let calo;
let localdata = localStorage.getItem("data");
let foodJSON = {};
if (localdata === null) {
  localStorage.setItem("data", JSON.stringify(userdata));
} else {
  userdata = JSON.parse(localdata);
  if (userdata.hasOwnProperty("menu")) {
    foodJSON = userdata["menu"];
  }
  console.log(foodJSON);
}
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
  userdata["rec_calo"] = calo;
  localStorage.setItem("data", JSON.stringify(userdata));
  window.location.href = "index_main.html";
}

function showCart() {
  const cart = document.getElementById("cart");
  let cartlist = document.getElementById("cartlist");
  if (Object.keys(foodJSON).length !== 0) {
    for (let key in foodJSON) {
      if (foodJSON.hasOwnProperty(key)) {
        let keydata = foodJSON[key];
        let cart_item = document.createElement("li");
        let cart_item_detail = document.createElement("p");
        let cartservings = document.createElement("input");
        let delete_item = document.createElement("button");
        let unit = document.createElement("span");
        cart_item_detail.innerHTML = `${key}<br>Calories per serving: ${keydata.energy_kcal}`;
        cartservings.setAttribute("type", "number");
        cartservings.setAttribute("value", keydata.servings);
        cartservings.addEventListener("input", () => {
          let timeout;
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            foodJSON[key].servings = cartservings.value;
            localStorage.setItem("data", JSON.stringify(foodJSON));
            totalcalo();
          }, 2000);
        });
        delete_item.textContent = "Delete this item";
        delete_item.addEventListener("click", () => {
          delete foodJSON[key];
          userdata["menu"] = foodJSON;
          localStorage.setItem("data", JSON.stringify(userdata));
          cartlist.removeChild(cartlist.firstChild);
          totalcalo();
        });
        unit.innerText = " g ";
        cart_item.appendChild(cart_item_detail);
        cart_item.appendChild(cartservings);
        cart_item.appendChild(unit);
        cart_item.appendChild(delete_item);
        cartlist.appendChild(cart_item);
      }
    }
    totalcalo();
  } else {
    document.getElementById("total_calo").innerText =
      "You haven't added any items to your menu today.";
  }
  cart.style.display = "block";
}

// dong cua so cart
function closeCart() {
  const cart = document.getElementById("cart");
  let cartlist = document.getElementById("cartlist");
  cart.style.display = "none";
  while (cartlist.firstChild) {
    cartlist.removeChild(cartlist.firstChild);
  }
}

// tinh tong calo
function totalcalo() {
  let total_calo = document.getElementById("total_calo");
  let totalcal = 0;
  for (let key in foodJSON) {
    let keydata = foodJSON[key];
    totalcal += keydata.energy_kcal * (keydata.servings / 100);
  }
  total_calo.innerText = `Today's total calories: ${totalcal} calories.`;
}

// Bật/tắt sidebar
function toggleSidebar() {
  let side_bar = document.getElementById("side_bar");
  side_bar.classList.toggle("hidden");
}
