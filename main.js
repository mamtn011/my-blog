console.log("connecter");
const apiData = {
  async getposts() {
    const res = await fetch("https://mamtn011.github.io/my-blog/db.json");
    const data = await res.json();
    return {
      apipost: data.post,
      apiauthor: data.author,
      apicategory: data.category,
    };
  }
};

const UI = {
  posts: [],
  authors: [],
  categories: [],
  selectDomElements() {
    const contentsElm = document.querySelector(".grid");
    const filter = document.querySelector(".gategories-authors");
    const categoryElm = document.querySelector("#categories");
    const authorElm = document.querySelector("#authors");
    return {
      contentsElm,
      filter,
      categoryElm,
      authorElm,
    };
  },
  showCaegoriesOrAutorsToUI(uiElm, datas) {
    let elm = "";
    datas.forEach((data) => {
      elm += `<option value="${data.name}">${data.name}</option>`;
    });
    uiElm.insertAdjacentHTML("beforeend", elm);
  },
  showPostsToUI(uiElm, datas) {
    uiElm.textContent = "";
    let elm = "";
    if (datas.length < 1) {
      elm = `<h2 style="text-align: center">Sorry! No post found.</h2>`;
    } else {
      datas.forEach((data, index) => {
        const category = this.categories.find(
          (cat) => cat.id === data.categoryId
        );
        const author = this.authors.find((aut) => aut.id === data.authorId);
        elm += `<div class="contents">
        <div>
          <h3 class="title">${index + 1}. ${data.title}.</h3>
          <div class="bloginfo">
            <img src="img/${author.img}" width="30" height="40" />
            <p class="name"><strong>Author: </strong>${author.name}</p>
            <p class="category"><strong>Category: </strong>${category.name}</p>
            <p class="date"><strong>Date: </strong>${data.date}</p>
          </div>
          <p class="post">
          ${data.body}
          </p>
        </div>
      </div>`;
      });
    }
    uiElm.insertAdjacentHTML("afterbegin", elm);
  },
  handleFilterdData(evt, categoryElm, authorElm, posts, authors, categories) {
    const categoryVal = categoryElm.value;
    const authorVal = authorElm.value;
    const category = categories.find((cat) => cat.name === categoryVal);
    const author = authors.find((aut) => aut.name === authorVal);

    let datas = [];
    if (categoryVal === "all" && authorVal === "all") {
      datas = posts;
    } else if (evt.target.id === "categories") {
      if (authorVal === "all") {
        datas = posts.filter((post) => post.categoryId === category.id);
      } else if (categoryVal === "all") {
        datas = posts.filter((post) => post.authorId === author.id);
      } else {
        datas = posts.filter(
          (post) =>
            post.categoryId === category.id && post.authorId === author.id
        );
      }
    } else {
      if (categoryVal === "all") {
        datas = posts.filter((post) => post.authorId === author.id);
      } else if (authorVal === "all") {
        datas = posts.filter((post) => post.categoryId === category.id);
      } else {
        datas = posts.filter(
          (post) =>
            post.categoryId === category.id && post.authorId === author.id
        );
      }
    }
    return datas;
  },
  async init() {
    const { contentsElm, categoryElm, authorElm, filter } =
      this.selectDomElements();
    const { apipost, apiauthor, apicategory } = await apiData.getposts();
    this.posts = apipost;
    this.authors = apiauthor;
    this.categories = apicategory;
    this.showCaegoriesOrAutorsToUI(categoryElm, this.categories);
    this.showCaegoriesOrAutorsToUI(authorElm, this.authors);
    this.showPostsToUI(contentsElm, this.posts);
    filter.addEventListener("change", (evt) => {
      const datas = this.handleFilterdData(
        evt,
        categoryElm,
        authorElm,
        this.posts,
        this.authors,
        this.categories
      );
      this.showPostsToUI(contentsElm, datas);
    });
  },
};
UI.init();
