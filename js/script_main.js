const url = "https://food-nutrional-data.p.rapidapi.com/";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "7811829dbamshb0ac0de63710ca7p1d1d48jsn0385407209d4",
    "X-RapidAPI-Host": "food-nutrional-data.p.rapidapi.com",
  },
};

let localdata = localStorage.getItem("data");
let result;
let prev = "";
let foodJSON = {};
let userdata;

// lay du lieu tu localStorage
if (localdata === null) {
  localStorage.setItem("data", "");
} else {
  userdata = JSON.parse(localdata);
  if (userdata.hasOwnProperty("menu")) {
    foodJSON = userdata["menu"];
  }
  console.log(foodJSON);
}
// tim do an
async function findFood(value) {
  if (value !== prev && value !== "") {
    prev = value;
    let foodlist = document.getElementById("foodlist");
    while (foodlist.firstChild) {
      foodlist.removeChild(foodlist.firstChild);
    }
    try {
      const response = await fetch(url + value, options);
      result = await response.json();
      if (result.result === undefined) {
        let not_found = document.getElementById("not-found");
        not_found.style.display = "block";
      } else {
        let not_found = document.getElementById("not-found");
        not_found.style.display = "none";
        console.log(result);
        printfoodlist();
      }
    } catch (error) {
      console.error(error);
    }
  }
}

// in danh sach do an tim dc
async function printfoodlist() {
  let foodList = document.getElementById("foodlist");
  await result;
  for (let i = 0; i < 10; i++) {
    let foodList_item = document.createElement("li");
    foodList_item.textContent = result.result[i].food_description;
    foodList_item.dataset.index = i;
    foodList_item.addEventListener("click", foodDetail);
    foodList.appendChild(foodList_item);
  }
}

// hien thi  cua so chi tiet do an khi chon tu list do an
async function foodDetail(event) {
  const clickedItem = event.target;
  const itemIndex = clickedItem.dataset.index;
  console.log(itemIndex);
  const popup = document.getElementById("selectedfood-popup");
  const popupContent = document.getElementById("popupContent");
  await result;
  popupContent.innerHTML = `${clickedItem.textContent}<br>Calories per serving: ${result.result[itemIndex].energy_kcal} calo`;
  popupContent.dataset.index = itemIndex;
  popup.style.display = "block";
}

// dong cua so chi tiet do an
function closePopup() {
  const popup = document.getElementById("selectedfood-popup");
  let servings = document.getElementById("servings");
  popup.style.display = "none";
  servings.value = "";
}

// them vao menu
async function addToCart(index) {
  const item = await result.result[index];
  const servings = document.getElementById("servings");
  let yourserving = parseFloat(servings.value);
  if (servings.value === "") {
    yourserving = 100;
  }
  if (foodJSON.hasOwnProperty(`${item.food_description}`)) {
    foodJSON[item.food_description].servings += yourserving;
  } else {
    foodJSON[item.food_description] = item;
    foodJSON[item.food_description].servings = yourserving;
  }
  userdata["menu"] = foodJSON;
  localStorage.setItem("data", JSON.stringify(userdata));
  closePopup();
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

function toggleSidebar() {
  let side_bar = document.getElementById("side_bar");
  side_bar.classList.toggle("hidden");
}
