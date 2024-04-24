const infoUpdate = document.querySelector(".infoUpdate");

const autoCompleteData = {
  renderOption(movie) {
    const movieSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
        <div class="imageItem"><img src="${movieSrc}" ></div>
        <h3 class="textItem">${movie.Title} ${movie.Year}</h3>
      `;
  },
  setInput(movie) {
    return movie.Title;
  },
};

autoComplete({
  root: document.querySelector(".cell-one"),
  onOptionSelect(movie, location) {
    secondRequest(movie, location, "left");
  },
  ...autoCompleteData,
});

autoComplete({
  root: document.querySelector(".cell-two"),
  onOptionSelect(movie, location) {
    secondRequest(movie, location, "right");
  },
  ...autoCompleteData,
});
