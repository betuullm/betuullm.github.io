document.addEventListener("DOMContentLoaded", function () {
    const itemsPerPage = 6; 
    let currentPage = 1; 

    fetch("https://api.github.com/users/betuullm/repos")
        .then(response => response.json())
        .then(data => {
            const filteredRepos = data.filter(repo => 
                !repo.name.includes("betuullm") && !repo.name.includes("betuullm.github.io")
            );
            const promises = filteredRepos.map(repo => {
                return fetch(`https://api.github.com/repos/betuullm/${repo.name}/commits?per_page=1`)
                        .then(response => response.json())
                        .then(commits => {
                            if (commits.length > 0) {
                                repo.last_commit_date = commits[0].commit.author.date;
                            } else {
                                repo.last_commit_date = repo.created_at; 
                            }
                            return repo;
                        });
            });
            Promise.all(promises).then(repos => {
                repos.sort((a, b) => new Date(b.last_commit_date) - new Date(a.last_commit_date));
                const portfolioGrid = document.querySelector(".portfolio-grid");
                function paginate(page) {
                    portfolioGrid.innerHTML = '';
                    const startIndex = (page - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const currentRepos = repos.slice(startIndex, endIndex);

                    currentRepos.forEach(repo => {
                        const portfolioItem = document.createElement("div");
                        portfolioItem.classList.add("portfolio-item", "col-md-3");
                        portfolioItem.style.cursor = "pointer"; 
                        const img = document.createElement("img");
                        img.src = getImageForRepo(repo.name);
                        img.alt = repo.name;
                        const h3 = document.createElement("h3");
                        h3.textContent = repo.name;
                        const p = document.createElement("p");
                        p.textContent = repo.description || "No description provided.";
                        portfolioItem.addEventListener("click", function() {
                            window.open(repo.html_url, "_blank");
                        });
                        portfolioItem.appendChild(img);
                        portfolioItem.appendChild(h3);
                        portfolioItem.appendChild(p);
                        portfolioGrid.appendChild(portfolioItem);
                    });
                    updatePagination(page);
                }
                paginate(currentPage);
                function updatePagination(currentPage) {
                    const paginationContainer = document.querySelector(".pagination-container");
                    paginationContainer.innerHTML = '';
                    const pageCount = Math.ceil(repos.length / itemsPerPage);
                    for (let i = 1; i <= pageCount; i++) {
                        const button = document.createElement("button");
                        button.textContent = i;
                        button.classList.add("btn", "btn-sm", "btn-outline-primary", "mx-1");
                        if (i === currentPage) {
                            button.classList.add("active");
                        }
                        button.addEventListener("click", function() {
                            currentPage = i;
                            paginate(currentPage);
                        });
                        paginationContainer.appendChild(button);
                    }
                }
            });
        })
        .catch(error => console.error("Error fetching GitHub repos:", error));
});
function getImageForRepo(repoName) {
    const imageMap = {
        "default": "./images/7040859.jpg",
    };
    return imageMap.hasOwnProperty(repoName) ? imageMap[repoName] : "./images/default.jpg";
}