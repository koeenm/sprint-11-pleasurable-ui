document.addEventListener("DOMContentLoaded", function () {
  const loadingElements = document.querySelectorAll(".loading");
  const likeForm = document.querySelectorAll(".overzicht__like--form");
  const likeCheckboxes = document.querySelectorAll(
    '.heart-checkbox input[type="checkbox"]'
  );

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
      console.log(
        "Initial state - heartIcon:",
        heartIcon.style.display,
        "spinner:",
        spinner.style.display
      );

      // Laat spinner zien, en haal het hartje weg
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
        body: JSON.stringify({ like_id: serviceId, isLike: isLike }),
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Failed to update likes count in Directus API");
          }
          console.log("Like count successfully updated");
          // Haal de spinner weg en laat het hartje zien als de like compleet is
          spinner.style.display = "none";
          heartIcon.style.display = "flex";
        })
        .catch(function (error) {
          console.error("Error updating likes count:", error);
          // Haal de spinner weg en laat het hartje zien als er een error is
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
    });
  });

  // Selecteer de pagination links
  const prevPageLink = document.getElementById("prevPage");
  const nextPageLink = document.getElementById("nextPage");

  // Add event listenener click aan de pagination links
  prevPageLink.addEventListener("click", handlePaginationClick);
  nextPageLink.addEventListener("click", handlePaginationClick);

  // Functie voor het handelen van de pagination dinges
  function handlePaginationClick(event) {
    event.preventDefault(); // Prevent default! WOOP!

    // Haal de url op van de paginatie link
    const url = this.href;

    // Haal de inhoud van de gevraagde pagina op
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        // Maak een nieuw element aan om de inhoud van de gevraagde pagina te houden
        const tempElement = document.createElement("div");
        tempElement.innerHTML = html;

        // Selecteer alleen de inhoud binnen het <ul> element van de nieuwe pagina
        const newContent = tempElement.querySelector("main > ul").innerHTML;

        // Update de content op de pagina met de gevraagde HTML
        document.querySelector("main > ul").innerHTML = newContent;

        // Update de pagination links
        const newPrevPageLink = tempElement.querySelector("#prevPage");
        const newNextPageLink = tempElement.querySelector("#nextPage");

        // Update de class van de vorige link
        prevPageLink.classList.toggle(
          "disabled",
          newPrevPageLink.classList.contains("disabled")
        );

        // Update de class van de volgende link
        nextPageLink.classList.toggle(
          "disabled",
          newNextPageLink.classList.contains("disabled")
        );

        // Update the page number
        const currentPageElement = tempElement.querySelector(
          ".overzicht__pagination span"
        );
        const currentPage = currentPageElement.textContent;
        document.querySelector(".overzicht__pagination span").textContent =
          currentPage;

        // Update de URL
        history.pushState(null, null, url);

        // Zorg ervoor dat de event listeners opnieuw worden toegevoegd na het vervangen van de inhoud
        prevPageLink.addEventListener("click", handlePaginationClick);
        nextPageLink.addEventListener("click", handlePaginationClick);
      })
      .catch((error) => console.error("Error fetching page:", error));
  }
});
