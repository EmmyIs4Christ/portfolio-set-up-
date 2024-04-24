const infoUpdate = document.querySelector(".infoUpdate");

autoComplete({
  root: document.querySelector(".cellSingle"),
  onOptionSelect(movie, location) {
    secondRequest(movie, location, "left");
  },
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
});
