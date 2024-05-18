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
      const isLike = this.checked;
      const likeCount = this.parentElement.querySelector("span");
      const heartIcon = this.parentElement.querySelector("i.fas.fa-heart");
      const spinner = this.parentElement.querySelector(".spinner");

      console.log("Checkbox changed:", this.checked);
      console.log("Initial state - heartIcon:", heartIcon.style.display, "spinner:", spinner.style.display);

      // Show spinner and hide heart icon
      heartIcon.style.display = "none";
      spinner.style.display = "block";

      // Als de checkbox checked is, up de like count, anders eentje eraf halen!
      if (this.checked) {
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
      } else {
        likeCount.textContent = parseInt(likeCount.textContent) - 1;
      }

      console.log("Updated like count:", likeCount.textContent);

      // Update de Like count in de Directus API
      fetch("/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ like_id: serviceId, isLike: isLike }), // Voeg isLike parameter toe
      }).then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to update likes count in Directus API");
        }
        console.log("Like count successfully updated");
        // Hide spinner and show heart icon when request is complete
        spinner.style.display = "none";
        heartIcon.style.display = "flex";
      }).catch(function (error) {
        console.error("Error updating likes count:", error);
        // Hide spinner and show heart icon if there's an error
        spinner.style.display = "none";
        heartIcon.style.display = "flex";

        // Verander naar een broken heart
        heartIcon.className = "fas fa-heart-broken heart-checkbox-error";
        // Disable de checkbox tot een refresh
        checkbox.disabled = true;
        // Geef een pop-up met een foutmelding en instructie hoe nu verder
        alert(
          "Oeps! Er is iets mis gegaan bij het liken van dit initiatief. Herlaad de pagina en probeer het opnieuw."
        );
      });

      console.log('jippie');
    });
  });

  // Laat elk like formulier/button zien
  likeForm.forEach(function (likeForm) {
    likeForm.style.display = "block";
  });
});
