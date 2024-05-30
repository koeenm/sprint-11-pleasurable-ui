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

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('form[action="/search"]');
  const searchInput = searchForm.querySelector('input[name="query"]');
  const resultsContainer = document.querySelector('.zoekresultaten__container');

  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    
    if (!query) return;

    try {
      const response = await fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const html = await response.text();
      
      // Update de inhoud van het zoekresultaten element met de gerenderde partial
      resultsContainer.innerHTML = html;
    } catch (error) {
      console.error('Error:', error);
    }
  });
});


