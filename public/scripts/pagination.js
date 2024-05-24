document.addEventListener('DOMContentLoaded', function() {
  const paginationLinks = document.querySelectorAll('.pagination__link');

  // Koppel een event listener aan elke pagination link
  paginationLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault(); // WOOP! PREVENT DEFAULT BITCH

      // Haal de URL en content van de volgende pagina op
      const nextPageUrl = this.getAttribute('href');
      fetchPage(nextPageUrl);
    });
  });

  // Functie om een pagina op te halen via Fetch API
  function fetchPage(url) {
    fetch(url)
      .then(response => response.text())
      .then(html => {
        // Maak een DOM-parser aan
        const parser = new DOMParser();
        // Parse de HTML van de nieuwe pagina
        const newDocument = parser.parseFromString(html, 'text/html');
        // Selecteer de inhoud van de nieuwe pagina
        const newContent = newDocument.querySelector('.overzicht__container');
        // Selecteer de pagination van de nieuwe pagina
        const newPagination = newDocument.querySelector('.overzicht__pagination');

        // Controleer of zowel inhoud als pagination zijn gevonden, anders PROBLEMEN
        if (newContent && newPagination) {
          // Selecteer de container van de huidige pagina-inhoud
          const container = document.querySelector('.overzicht__container');
          // Vervang de inhoud van de container door de nieuwe inhoud
          container.innerHTML = newContent.innerHTML;

          // Selecteer de container van de pagination
          const paginationContainer = document.querySelector('.overzicht__pagination');
          // Vervang de inhoud van de pagination door de nieuwe pagination
          paginationContainer.innerHTML = newPagination.innerHTML;
        } else {
          console.error('Oeps! Geen inhoud of paginering gevonden in de respons.');
        }
      })
      .catch(error => {
        console.error('Fout bij het ophalen van de pagina:', error);
      });
  }
});
