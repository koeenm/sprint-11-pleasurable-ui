document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.overzicht__zoeken');
    const initiativesList = document.getElementById('initiatieven__lijst');
  
    // Verkrijg de services data die vanuit de server wordt doorgegeven aan het EJS-template
    let services = window.services;
  
    // Functie om initiatieven te renderen
    function renderInitiatives(filteredInitiatives) {
      initiativesList.innerHTML = '';
      filteredInitiatives.forEach(service => {
        const listItem = document.createElement('li');
        listItem.className = 'overzicht__service';
        listItem.innerHTML = `
          <div class="loading"></div>
          <a href="/service/${service.slug}">
            <form action="/like" method="POST" class="overzicht__like--form">
              <label class="heart-checkbox" for="${service.id}-like">
                <input type="checkbox" name="like" id="${service.id}-like" value="${service.id}" />
                <i class="fas fa-heart"></i>
                <span>${service.likes}</span>
              </label>
            </form>
            <img loading="lazy" src="${service.image ? 'https://fdnd-agency.directus.app/assets/' + service.image : '/assets/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg'}" alt="Image">
            <section class="overzicht__service--tekst">
              <h2>${service.title}</h2>
              <p>${service.short_description}</p>
            </section>
          </a>
        `;
        initiativesList.appendChild(listItem);
      });
    }
  
    // Initialiseer met alle initiatieven
    renderInitiatives(services);
  
    // Event listener voor de zoekbalk
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase(); // Haal de zoekterm op en zet deze om naar kleine letters
  
      // Filter initiatieven op basis van de zoekterm in de titel
      const filteredInitiatives = services.filter(service => 
        service.title.toLowerCase().includes(query) // Vergelijk titels in kleine letters met de zoekterm
      );
  
      // Render de gefilterde initiatieven
      renderInitiatives(filteredInitiatives);
    });
  });
  