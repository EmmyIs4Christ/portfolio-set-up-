// ANIMATING TYPE WRITING
const word = [
  " ",
  "F",
  "r",
  "o",
  "n",
  "t",
  "e",
  "n",
  "d",
  " ",
  "D",
  "e",
  "v",
  "e",
  "l",
  "o",
  "p",
  "e",
  "r",
  " ",
  " ",
];
let i = 0;
const wordLength = word.length - 1;
let acces = true;

const renderTyping = () => {
  document.querySelector(".typing").textContent += word[i];
  i++;
  if (i === wordLength) {
    i = 0;
    document.querySelector(".typing").textContent = "";
    !acces;
  }
};
function count() {
  if (acces) {
    renderTyping();
  }

  if (!acces) {
    renderTyping();
  }
  setTimeout(count, 300);
}

count();

///HANDBURGER BTN EFFECT
const handburgerBtn = document.querySelector(".handburgerBtn");
const nav = document.querySelector(".header nav");

const closeDropdown = () => {
  nav.classList.remove("openNav");
  handburgerBtn.textContent = "⚌";
};
const openDropdown = () => {
  nav.classList.add("openNav");
  handburgerBtn.textContent = "⛌";
};

handburgerBtn.addEventListener("click", () => {
  if (nav.classList.contains("openNav")) {
    closeDropdown();
  } else {
    openDropdown();
  }
});

////SMOOTH SCROL////
const scrollBtns = document.querySelectorAll(".scrollBtn");
const linksContainer = document.querySelector(".links");

scrollBtns.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    if (nav.classList.contains("openNav")) {
      closeDropdown();
    }
    const id = e.target.getAttribute("href").slice(1);
    const element = document.getElementById(id);
    const linksHeight = linksContainer.getBoundingClientRect().height;
    const navHeight = navBar.getBoundingClientRect().height;
    const fixNav = navBar.classList.contains("stickyNav");
    let position = element.offsetTop - navHeight;

    // if (navHeight > 80) {
    //   position = position + linksHeight;
    // }

    if (!fixNav) {
      position = position - navHeight;
    }

    window.scrollTo({
      left: 0,
      top: position,
    });

    // linksContainer.style.height = 0;
    //  console.log(fixNav)
  });
});

document.addEventListener("click", (e) => {
  if (
    !nav.contains(e.target) &&
    nav.classList.contains("openNav") &&
    e.target !== handburgerBtn
  ) {
    closeDropdown();
  }
});

///sending http request

// const sentRequest = async () => {
//   const response = await fetch(
//     "https://my-redux-project-b424c-default-rtdb.firebaseio.com/orders.json"
//   );
//   const data = await response.json();
//   console.log(data);
// };

// sentRequest();

const postRequest = async function (mail) {
  try {
    const response = await fetch(
      // "https://new-entries-default-rtdb.firebaseio.com/client.json",
      "https://new-entries-default-rtdb.firebaseio.com/client.json",
      {
        method: "POST",
        body: JSON.stringify(mail),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    alert("Please resend message");
  }
};

////FORM HANDLING
let inputs = document.querySelectorAll(".form-control");

let nameInput = document.getElementById("name");
let emailInput = document.getElementById("email");
let subjectInput = document.getElementById("subject");
let messageInput = document.getElementById("message");
let textIsValid = false;
let emailIsValid = false;

inputs.forEach((input) => {
  input.addEventListener("blur", () => {
    if (input.value.trim() === "") {
      input.classList.add("invalid");
      textIsValid = false;
      return;
    } else {
      input.classList.remove("invalid");
      textIsValid = true;
    }

    if (!emailInput.value.includes("@")) {
      emailInput.classList.add("invalid");
      emailIsValid = false;
      return;
    } else {
      emailInput.classList.remove("invalid");
      emailIsValid = true;
    }
  });
});

document
  .getElementById("myForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    // Check if inputs are empty
    // inputs.forEach((input) => {
    //   if (input.value.trim() === "") {
    //     input.classList.add("invalid");
    //     textIsValid = false;
    //     return;
    //   } else {
    //     input.classList.remove("invalid");
    //     textIsValid = true;
    //   }
    // });

    // // Check if email contains "@" symbol
    // if (!emailInput.value.includes("@")) {
    //   emailInput.classList.add("invalid");
    //   emailIsValid = false;
    //   return;
    // } else {
    //   emailInput.classList.remove("invalid");
    //   emailIsValid = true;
    // }

    let clientName = nameInput.value;
    let clientEmail = emailInput.value;
    let clientSubject = subjectInput.value;
    let clientMessage = messageInput.value;

    const mailData = {
      name: clientName,
      email: clientEmail,
      subject: clientSubject,
      message: clientMessage,
    };

    console.log(textIsValid, emailIsValid);

    if (
      textIsValid === true &&
      emailIsValid === true &&
      nameInput.value !== "" &&
      emailInput.value !== "" &&
      subjectInput.value !== "" &&
      messageInput.value !== ""
    ) {
      let callResponse = await postRequest(mailData);
      console.log(callResponse);

      if (callResponse.status === 200) {
        document.querySelector(".fa-paper-plane").classList.add("showSent");

        let successId = setTimeout(() => {
          document
            .querySelector(".fa-paper-plane")
            .classList.remove("showSent");
          clearTimeout(successId);
        }, 4000);

        nameInput.value = "";
        emailInput.value = "";
        subjectInput.value = "";
        messageInput.value = "";
        textIsValid = false;
        emailIsValid = false;
      } else {
        textIsValid = false;
        emailIsValid = false;
        return;
      }
    }

    // const firebaseConfig = {
    //   apiKey: "AIzaSyCttayBYGgIzFgmHRo1IMR2s00Jk4RKpZc",
    //   authDomain: "my-redux-project-b424c.firebaseapp.com",
    //   databaseURL: "https://my-redux-project-b424c-default-rtdb.firebaseio.com",
    //   projectId: "my-redux-project-b424c",
    //   storageBucket: "my-redux-project-b424c.appspot.com",
    //   messagingSenderId: "400971481352",
    //   appId: "1:400971481352:web:7ec866d16b0362de076cbd",
    // };

    // firebase.initializeApp(firebaseConfig);

    // const formData = new FormData(this);

    // const data = {
    //   name: formData.get("name"),
    //   email: formData.get("email"),
    //   message: formData.get("message"),
    // };
  });
