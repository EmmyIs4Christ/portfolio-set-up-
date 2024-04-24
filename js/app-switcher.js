const switchToggler = document.querySelector(".style-switcher-toggler");

switchToggler.addEventListener("click", function () {
  document.querySelector(".style-switcher").classList.toggle("open");
});

const alternateStyle = document.querySelectorAll(".alternate-style");
function setActiveStyle(color) {
  alternateStyle.forEach((style) => {
    if (style.getAttribute("title") === color) {
      style.removeAttribute("disabled");
    } else {
      style.setAttribute("disabled", true);
    }
  });
}

const themeBtn = document.querySelector(".themeBtn");
const slider = document.querySelector(".shiftTheme");

themeBtn.addEventListener("click", function () {
  slider.classList.toggle("switch");
  document.body.classList.toggle("dark");
});

///STATUS BAR
let statusBar, content;
document.addEventListener("DOMContentLoaded", function () {
  statusBar = document.querySelector(".line");
  content = document.getElementById("content");

  const hiWelcome = document.querySelector(".hiWelcome");
  const welcomeId = setTimeout(() => {
    let word2 = [
      "W",
      "e",
      "l",
      "c",
      "o",
      "m",
      "e",
      " ",
      "T",
      "o",
      " ",
      "M",
      "y",
      " ",
      "P",
      "o",
      "r",
      "t",
      "f",
      "o",
      "l",
      "i",
      "o",
    ];

    let i2 = 0;
    const wordLength2 = word2.length;
    let acces2 = true;

    function count2() {
      if (acces2) {
        document.querySelector(".remWelcomeMsg").textContent += word2[i2];
        i2++;
        // console.log(wordLength2, i2, word2[i2]);
        if (i2 === wordLength2) {
          acces2 = false;
          return;
        }
      } else {
        return;
      }
      setTimeout(count2, 150);
    }
    count2();
    // renderTyping
    hiWelcome.textContent = "";
    hiWelcome.classList.add("positionRelative");
    clearTimeout(welcomeId);
  }, 3000);
});

////STATIC NAV BAR/////
const navBar = document.querySelector(".headerWrapper");
const arrowLink = document.querySelector(".arrowUp");

const navHeight = navBar.getBoundingClientRect().height;
let scrollHeight = 0;

window.addEventListener("scroll", function (e) {
  if (document.querySelector(".style-switcher").classList.contains("open")) {
    document.querySelector(".style-switcher").classList.remove("open");
  }

  if (!nav) return;

  if (nav.classList.contains("openNav")) {
    closeDropdown();
  }

  scrollHeight = window.pageYOffset;
  if (scrollHeight > navHeight) {
    navBar.classList.add("stickyNav");
  } else {
    navBar.classList.remove("stickyNav");
  }

  if (scrollHeight > 500) {
    arrowLink.classList.add("showArrow");
  } else {
    arrowLink.classList.remove("showArrow");
  }

  ///SCROLL EFFECT
  let scrollLocation = window.scrollY;
  let maxScroll = content.scrollHeight - window.innerHeight;
  let statusBarWidth = (scrollLocation / maxScroll) * 100;
  statusBar.style.width = statusBarWidth + "%";
});
