const login_modal = document.getElementById("login_modal");
const signup_modal = document.getElementById("signup_modal");
const changepwd_modal = document.getElementById("changepwd_modal");
let state = localStorage.getItem("state");
let foodJSON = {};
let userdata = {};
let localdata = localStorage.getItem("data");

// lay du lieu tu localStorage
if (localdata == null) {
  localStorage.setItem("data", JSON.stringify(userdata));
} else {
  try {
    userdata = JSON.parse(localdata);
    if (userdata.hasOwnProperty("menu")) {
      foodJSON = userdata["menu"];
    }
    console.log(foodJSON);
  } catch (error) {
    console.log(error);
  }
}

// state: logged in or not
if (state == null) {
  localStorage.setItem("state", 0);
} else {
  if (state == 1) {
    document.getElementById("user_pfp").hidden = false;
    document.getElementById("showLoginModal_btn").hidden = true;
  }
}
// export {localStorage}

let login = document.getElementById("login_form");
login.addEventListener("submit", function (event) {
  event.preventDefault();
  localStorage.setItem("state", 1);
  window.alert("Login successful");
  window.location.reload();
});

let signup = document.getElementById("signup_form");

function showLoginModal() {
  login_modal.showModal();
}
function showSignupModal() {
  login_modal.close();
  signup_modal.showModal();
}
function showChangepwdModal() {
  login_modal.close();
  changepwd_modal.showModal();
}

function closeLoginModal() {
  login_modal.close();
  signup_modal.close();
  changepwd_modal.close();
}

function closeSignupModal() {
  signup_modal.close();
}

function closeChangepwdModal() {
  changepwd_modal.close();
}

function logout() {
  localStorage.setItem("state", 0);
  window.location.reload();
}

// hien thi menu hom nay
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
        cart_item_detail.innerHTML = `${key}<br>Calories per 100g: ${keydata.energy_kcal} cal`;
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
    document.getElementById("showtotalcalo").innerHTML =
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
  total_calo.innerText = `${totalcal}`;
}
