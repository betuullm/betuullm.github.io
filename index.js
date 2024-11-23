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
        "default": "./images/default.jpg",
        "Flutter-Visit-Trabzon": "./images/SocialApp.jpg",
        "YemekTarifiSite": "./images/BlogProject.jpg",
    };
    return imageMap.hasOwnProperty(repoName) ? imageMap[repoName] : "./images/default.jpg";
}

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("backToTopBtn").style.display = "block";
  } else {
    document.getElementById("backToTopBtn").style.display = "none";
  }
}
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Navbar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarNav = document.querySelector('#navbarNav');
    
    navbarToggler.addEventListener('click', function(e) {
        e.stopPropagation(); // Event bubbling'i durdur
        navbarNav.classList.toggle('show');
    });

    // Menü dışına tıklandığında menüyü kapat
    document.addEventListener('click', function(event) {
        const isClickInside = navbarNav.contains(event.target) || navbarToggler.contains(event.target);
        if (!isClickInside && navbarNav.classList.contains('show')) {
            navbarNav.classList.remove('show');
        }
    });

    // Link tıklamalarında menüyü kapat
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) { // Sadece mobil görünümde
                navbarNav.classList.remove('show');
            }
        });
    });

    // Scroll event listener ekle
    window.addEventListener('scroll', function() {
        if (window.innerWidth <= 992 && navbarNav.classList.contains('show')) {
            navbarNav.classList.remove('show');
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Temel güvenlik önlemleri
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('selectstart', e => e.preventDefault());
    document.addEventListener('dragstart', e => e.preventDefault());
    
    // Gelişmiş DevTools tespiti ve engelleme
    (function() {
        // Console.log tespiti
        const checkConsole = () => {
            const startTime = new Date();
            debugger;
            const endTime = new Date();
            if (endTime - startTime > 100) {
                window.location.href = 'about:blank';
            }
        };

        // Periyodik kontroller
        setInterval(() => {
            // Console.clear bypass engelleyici
            const before = new Date().getTime();
            debugger;
            const after = new Date().getTime();
            if (after - before > 200) {
                window.location.href = 'about:blank';
            }

            // Ek kontroller
            checkConsole();
        }, 1000);

        // Klavye kısayolları engelleme
        document.addEventListener('keydown', function(e) {
            // F12, Ctrl+Shift+I/J/C, Ctrl+U
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && ['I','i','J','j','C','c'].includes(e.key)) ||
                (e.ctrlKey && ['U','u','S','s'].includes(e.key)) ||
                (e.key === 'Escape' && e.keyCode === 27)
            ) {
                e.preventDefault();
                return false;
            }
        });

        // Source görüntüleme engelleme
        document.addEventListener('keypress', function(e) {
            if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
                e.preventDefault();
                return false;
            }
        });

        // Console uyarıları
        console.clear();

        // Ek güvenlik: debugger tespiti
        setInterval(() => {
            Function.prototype.toString = function() {
                window.location.href = 'about:blank';
            };
        }, 100);
    })();
});