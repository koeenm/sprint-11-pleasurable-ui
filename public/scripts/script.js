document.addEventListener("DOMContentLoaded", function () {
  const loadingElements = document.querySelectorAll(".loading");
  const likeForm = document.querySelectorAll(".overzicht__like--form");
  const likeCheckboxes = document.querySelectorAll('.heart-checkbox input[type="checkbox"]');

  // Laat het laad element zien als JavaScript het doet
  loadingElements.forEach(function (loadingElement) {
    loadingElement.style.display = "block";
  });

  // Haal het laad element weg wanneer de DOM content geladen is
  loadingElements.forEach(function (loadingElement) {
    loadingElement.style.display = "none";
  });

  // Voeg een eventListener toe voor alle checkboxes
  likeCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      const serviceId = this.value;
      const likeCount = this.parentElement.querySelector("span");
      const heartIcon = this.parentElement.querySelector("i.fas.fa-heart");

      // Als de checkbox checked is, up de like count, anders eentje eraf halen!
      if (this.checked) {
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
      } else {
        likeCount.textContent = parseInt(likeCount.textContent) - 1;
      }

      // Update de Like count in de Directus API
      try {
        fetch("/like", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ like_id: serviceId }),
        }).then(function (response) {
          if (!response.ok) {
            throw new Error("Failed to update likes count in Directus API");
          }
        }).catch(function (error) {
          console.error("Error updating likes count:", error);
          // Verander naar een broken heart
          heartIcon.className = "fas fa-heart-broken heart-checkbox-error";
          // Disable de checkbox tot een refresh
          checkbox.disabled = true;
          // Geef een pop-up met een foutmelding en instructie hoe nu verder
          alert(
            "Oeps! Er is iets mis gegaan bij het liken van dit initiatief. Herlaad de pagina en probeer het opnieuw."
          );
        });
      } catch (error) {
        console.error("Error updating likes count:", error);
      }
    });
  });

  // Laat elk like formulier/button zien
  likeForm.forEach(function (likeForm) {
    likeForm.style.display = "block";
  });
});

//client-side voor zoekfunctie

// Wacht tot de volledige DOM is geladen
document.addEventListener('DOMContentLoaded', () => {
  // Zoek het zoekformulier en het invoerveld
  const searchForm = document.querySelector('form[action="/search"]');
  const searchInput = searchForm.querySelector('input[name="query"]');
  // Zoek het element waar de zoekresultaten worden weergegeven
  const resultsContainer = document.querySelector('.zoekresultaten__container');

  // Voeg een event listener toe voor het versturen van het zoekformulier
  searchForm.addEventListener('submit', async (event) => {
    // Voorkom dat het formulier de pagina opnieuw laadt
    event.preventDefault();
    // Haal de waarde van het zoekveld op
    const query = searchInput.value.trim();
    
    // Stop als het zoekveld leeg is
    if (!query) return;

    try {
      // Verstuur een POST-verzoek naar de server met de zoekopdracht
      const response = await fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ query }) // Zet de zoekopdracht om naar JSON
      });

      // Controleer of het verzoek succesvol was
      if (!response.ok) throw new Error('Network response was not ok');

      // Haal de zoekresultaten op uit de response
      const results = await response.json();

      // Update de inhoud van het zoekresultaten element
      resultsContainer.innerHTML = `
      <h1 class="overzicht__title">Zoekresultaten</h1>
      <ul class="zoekresultaten__container overzicht__container">
        ${results.map(service => `
          <li class="overzicht__service">
            <a href="/service/${service.slug}">
              <img loading="lazy" src="${service.image ? 'https://fdnd-agency.directus.app/assets/' + service.image : '/assets/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg'}" alt="Image">
              <section class="overzicht__service--tekst">
                <h2>${service.title}</h2>
                <p>${service.short_description}</p>
              </section>
            </a>
          </li>
        `).join('')}
      </ul>
    `;
  } catch (error) {
    console.error('Error:', error);
  }
});
});

