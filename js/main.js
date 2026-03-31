var navbarHeightMobile = document.querySelector('.mobile-component ul').offsetHeight;
var navbarHeightDesktop = document.querySelector('.desktop-component ul').offsetHeight;

document.querySelectorAll('.mobile-component ul li a, .desktop-component ul li a').forEach(function(anchor) {
  anchor.addEventListener('click', function(event) {
    event.preventDefault();

    var targetId = this.getAttribute('href');
    var targetElement = document.querySelector(targetId);
    var targetOffsetTop = targetElement.offsetTop;

    var navbarHeight = (window.innerWidth < 768) ? navbarHeightMobile : navbarHeightDesktop;
    window.scrollTo({
      top: targetOffsetTop - navbarHeight,
      behavior: 'smooth'
    });
  });
});

var scrollToTopBtn = document.getElementById("scroll-to-top");

window.onscroll = function() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
};

scrollToTopBtn.addEventListener("click", function() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

let authorLinks = {};

async function loadAuthorLinks() {
  try {
    const response = await fetch('data/authors.json');
    authorLinks = await response.json();
  } catch (error) {
    console.error('Error loading author links:', error);
  }
}

async function renderPublications() {
  try {
    await loadAuthorLinks();
    const response = await fetch('data/publications.json');
    const publications = await response.json();
    const filteredPublications = publications.filter(publication => publication.show);
    const container = document.getElementById('publications-container');

    filteredPublications.forEach(publication => {
      const publicationHTML = createPublicationHTML(publication);
      container.innerHTML += publicationHTML;
    });
  } catch (error) {
    console.error('Error loading publications:', error);
  }
}

function createPublicationHTML(pub) {
  let authorsHTML = '';
  pub.authors.forEach((author, index) => {
    let authorName = author.name;

    const authorLink = authorLinks[authorName];
    if (authorLink && authorLink !== '') {
      authorName = `<a href="${authorLink}">${authorName}</a>`;
    }

    if (author.isHighlight) {
      authorName = `<strong>${authorName}</strong>`;
    }

    if (author.isCoFirst) {
      authorName += '*';
    }

    authorsHTML += authorName;

    if (index < pub.authors.length - 1) {
      authorsHTML += ',\n      ';
    }
  });

  let linksHTML = '';
  for (const [linkType, url] of Object.entries(pub.links)) {
    if (url && url !== '') {
      let iconClass = '';
      let linkText = '';

      switch (linkType) {
        case 'paper':
          iconClass = 'fas fa-file-pdf';
          linkText = 'Paper';
          break;
        case 'code':
          iconClass = 'fab fa-github';
          linkText = 'Code';
          break;
        case 'project':
          iconClass = 'fas fa-globe';
          linkText = 'Project';
          break;
        case 'demo':
          iconClass = 'fas fa-globe';
          linkText = 'Demo';
          break;
        case 'benchmark':
          iconClass = 'fas fa-database';
          linkText = 'Benchmark';
          break;
        default:
          iconClass = 'fas fa-link';
          linkText = linkType.charAt(0).toUpperCase() + linkType.slice(1);
      }

      linksHTML += `<a href="${url}" class="buttom"><i class="${iconClass}"></i> ${linkText}</a>\n      `;
    }
  }

  let miscHTML = '';
  if (pub.misc && pub.misc.text && pub.misc.link && pub.misc.link !== '') {
    miscHTML = `<a href="${pub.misc.link}" class="buttom misc-button">${pub.misc.text}</a>\n      `;
  }

  const coFirstNote = '<br>\n      ';

  return `
    <div class="paper-container">
      <div class="image">
        <img src="${pub.image}" alt="${pub.title}">
      </div>
      <div class="text">
        <div class="paper-title-section">
          <span class="papertitle">${pub.title}</span>
        </div>
        <div class="paper-bottom-section">
          <p>${coFirstNote}${authorsHTML}</p>
          <p class="paper-links">
            <span class="${pub.venueType}">${pub.venue}</span>
            ${linksHTML}${miscHTML}
          </p>
        </div>
      </div>
    </div>`;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function() {
    renderPublications();
  });
} else {
  renderPublications();
}

let currentRotation = 0;
const profileImg = document.getElementById('profile-img');
if (profileImg) {
  const profileContainer = profileImg.closest('.profile-img-container');
  if (profileContainer) {
    profileContainer.addEventListener('click', function() {
      currentRotation -= 90;
      profileImg.style.transform = `rotate(${currentRotation}deg)`;
    });
  }
}
