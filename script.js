let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height){
            navLinks.forEach(link => {
                link.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        }
    });

    navbar.classList.remove('active');
    menuIcon.classList.remove('bx-x');
}

const scrollToTopBtn = document.getElementById('scrollToTopBtn');

function toggleScrollToTopBtn() {
  if (window.scrollY > 300) {
    scrollToTopBtn.style.display = 'flex';

  } else {
    scrollToTopBtn.style.display = 'none';
  }
}
window.addEventListener('scroll', toggleScrollToTopBtn);
document.addEventListener('DOMContentLoaded', toggleScrollToTopBtn);

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const githubUsername = 'ImY1l';
const githubGrid = document.getElementById('github-grid');
const showMoreBtn = document.getElementById('show-more-btn');
let allRepos = [];
let showingAll = false;

async function fetchMostUsedLanguage(repo) {
  try {
    const response = await fetch(`https://api.github.com/repos/${githubUsername}/${repo.name}/languages`);
    const languages = await response.json();
    const mostUsed = Object.entries(languages).sort((a, b) => b[1] - a[1])[0];
    return mostUsed ? mostUsed[0] : 'N/A';
  } catch (err) {
    return 'N/A';
  }
}

function createRepoCard(repo, language) {
  const updatedDate = new Date(repo.updated_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return `
    <div class="github-card">
      <div class="github-card-content">
        <h3>${repo.name}</h3>
        <div class="project-description">
          <p>${repo.description ? repo.description : ''}</p>
        </div>
      </div>
      <div class="github-card-footer">
        <span><strong>Most used language:</strong> ${language}</span><br>
        <span><strong>Last updated:</strong> ${updatedDate}</span><br>
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View on GitHub</a>
      </div>
    </div>
  `;
}

async function fetchRepos() {
  const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`);
  allRepos = await response.json();
  displayRepos();
}

async function displayRepos() {
  githubGrid.innerHTML = '';
  const reposToShow = showingAll ? allRepos : allRepos.slice(0, 6);

  if (reposToShow.length === 0) {
    githubGrid.innerHTML = '<p>No repositories found.</p>';
    showMoreBtn.style.display = 'none';
    return;
  }

  for (const repo of reposToShow) {
    const language = await fetchMostUsedLanguage(repo);
    githubGrid.innerHTML += createRepoCard(repo, language);
  }

  if (allRepos.length > 6 && !showingAll) {
    showMoreBtn.style.display = 'inline-block';
  } else {
    showMoreBtn.style.display = 'none';
  }
}

showMoreBtn.addEventListener('click', () => {
  showingAll = true;
  displayRepos();
});

fetchRepos();


menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}