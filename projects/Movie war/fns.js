const popUpFn = (txt) => {
  infoUpdate.classList.add("popInfo");
  infoUpdate.textContent = "";
  infoUpdate.textContent = txt;
  let timeCount = setTimeout(() => {
    infoUpdate.classList.remove("popInfo");
    clearTimeout(timeCount);
  }, 3000);
};

const debounce = (func, delay = 1000) => {
  let timeOutId;
  return (...args) => {
    if (timeOutId) {
      clearTimeout(timeOutId);
    }

    timeOutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const autoComplete = ({ root, renderOption, onOptionSelect, setInput }) => {
  root.innerHTML = `
            <h3>Search for a movie</h3>
            <input class="searchInput" placeholder="Enter name here..." type="text">
            <div class="highlightBox"> 
                <div class="hBox">
                </div>
            </div>
            <div class="detailBox showDetails">
            </div>
          
            `;

  let input = root.querySelector(".searchInput");
  const highlightBox = root.querySelector(".highlightBox");
  const highlightWindow = root.querySelector(".hBox");
  const detailWindow = root.querySelector(".detailBox");

  const onInput = async (event) => {
    let movies = await fetchData(event.target.value);
    highlightWindow.innerHTML = "";
    highlightBox.classList.add("showBox");

    movies.forEach((movie) => {
      const item = document.createElement("a");
      item.classList.add("hItems");
      item.innerHTML = renderOption(movie);

      highlightWindow.insertAdjacentElement("beforeend", item);

      item.addEventListener("click", (event) => {
        highlightBox.classList.remove("showBox");

        input.value = setInput(movie);
        onOptionSelect(movie, detailWindow);
        // console.log(renderedDetail, movie);
      });
    });

    if (highlightWindow.childElementCount === 0) {
      highlightBox.classList.remove("showBox");
    }
  };

  input.addEventListener("input", debounce(onInput, 500));

  document.addEventListener("click", (event) => {
    if (!highlightBox.contains(event.target)) {
      highlightBox.classList.remove("showBox");
    }
  });
};

const fetchData = async (search) => {
  try {
    let response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: "e7a68e39",
        s: search,
      },
    });
    //   console.log(response);
    if (response.data.Error === "Movie not found!") {
      popUpFn("Movie not found!");
      return [];
    }
    if (response.data.Error === "Too many results.") {
      popUpFn("Search with specific words please...");
      return [];
    }
    if (response.data.Response === "False") {
      return [];
    }
    return response.data.Search;
  } catch (error) {
    popUpFn(error);
    return [];
  }
};

let leftMovie, rightMovie;

const secondRequest = async (movie, location, side) => {
  movieDetail = await axios.get("https://www.omdbapi.com/", {
    params: {
      apikey: "e7a68e39",
      i: movie.imdbID,
    },
  });
  document.querySelector(".pageInfo").classList.remove("showPageInfo");
  let renderedDetail = renderDetail(movieDetail.data);
  location.innerHTML = renderedDetail;
  location.classList.add("showDetails");

  if (side === "left") {
    leftMovie = movieDetail.data;
  } else {
    rightMovie = movieDetail.data;
  }

  if (leftMovie && rightMovie) {
    compareMovies();
  }
};

const renderDetail = (movieDetail) => {
  let box = movieDetail.BoxOffice
    ? +movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
    : 0;
  box = isNaN(box) || !box ? 0 : box;

  let meta = +movieDetail.Metascore;
  meta = isNaN(meta) ? 0 : meta;

  let imdbRating = +movieDetail.imdbRating;
  imdbRating = isNaN(imdbRating) ? 0 : imdbRating;

  let imdbVote = +movieDetail.imdbVotes.replace(/,/g, "");
  imdbVote = isNaN(imdbVote) ? 0 : imdbVote;

  let award = movieDetail.Awards.split(" ").reduce((prev, current) => {
    current = +current;

    if (isNaN(current)) {
      return prev;
    } else {
      return prev + current;
    }
  }, 0);

  // console.log(award, box, meta, imdbRating, imdbVote);

  let awards =
    movieDetail.Awards === "N/A" ? "No award found" : movieDetail.Awards;

  movieDetail.Plot =
    movieDetail.Plot === "N/A" ? "Detail unavailable" : movieDetail.Plot;

  let boxRating =
    movieDetail.BoxOffice === "N/A" || !movieDetail.BoxOffice
      ? "No Box Office Rating available."
      : movieDetail.BoxOffice;

  let metascore =
    movieDetail.Metascore === "N/A"
      ? "No Metascore Rating available."
      : movieDetail.Metascore;

  let imdbRatings =
    movieDetail.imdbRating === "N/A"
      ? "No Box IMDB Rating available"
      : movieDetail.imdbRating;

  let imdbVotes =
    movieDetail.imdnVotes === "N/A"
      ? "No Box IMDB Votes available"
      : movieDetail.imdbVotes;
  return `
        <div class="detailHead single">
                    <img class="headContent single detailImage" src="${movieDetail.Poster}" alt="movie image">
                    <div class="headContent detailText">
                        <h4 class="title">${movieDetail.Title}</h4>
                        <p class="type">${movieDetail.Genre}</p>
                        <p class="details">
                            ${movieDetail.Plot}
                        </p>
                    </div>
                </div>
                <div data-value=${award} class="awards defaultBColor divInfo">
                    <h4>${awards}</h4>
                    <p>Awards</p>
                </div>
                <div data-value=${box} class="boxOffice defaultBColor divInfo">
                    <h4>${boxRating}</h4>
                    <p>Box Office</p>
                </div>
                <div data-value=${meta} class="metascore defaultBColor divInfo">
                    <h4>${metascore}</h4>
                    <p>Metascore</p>
                </div>
                <div data-value=${imdbRating} class="imdb defaultBColor divInfo">
                    <h4>${imdbRatings}</h4>
                    <p>IMDB Rating</p>
                </div>
                <div data-value=${imdbVote} class="last defaultBColor divInfo">
                    <h4>${imdbVotes}</h4>
                    <p>IMDB Votes</p>
        </div>
    `;
};

const compareMovies = () => {
  const leftSideStat = document.querySelectorAll(".cell-one .divInfo");
  const rightSideStat = document.querySelectorAll(".cell-two .divInfo");

  leftSideStat.forEach((leftStat, idx) => {
    const rightStat = rightSideStat[idx];

    const leftValue = +leftStat.dataset.value;
    const rightValue = +rightStat.dataset.value;

    if (rightValue > leftValue) {
      leftStat.classList.remove("defaultBColor");
      leftStat.classList.add("lossBColor");
      console.log(true);
    } else {
      rightStat.classList.remove("defaultBColor");
      rightStat.classList.add("lossBColor");
    }

    console.log(leftValue, rightValue);
  });
};
