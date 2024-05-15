// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Importeer slugify voor leesbare URLs met slug
import slugify from "slugify";

// Declare de base URL van de directus API
const baseUrl = "https://fdnd-agency.directus.app";

// Maak een nieuwe express app aan
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Fetch de data van de API
const fetchFromApi = (endpoint) => {
  return fetchJson(baseUrl + endpoint).then((response) => response.data);
};

// Fetch de data van de API van dh_services
const fetchData = () => {
  return fetchFromApi("/items/dh_services");
};

// Data ophalen van de API
fetchData().then((allAdvertisementsData) => {

  // GET-route voor de indexpagina
  app.get("/", function (request, response) {
    response.render("index", { services: allAdvertisementsData });
  });

  // GET-route voor de FAQ pagina
  app.get("/faq", function (request, response) {
    response.render("faq", { services: allAdvertisementsData, });
  });

  // GET-route voor de overzichtspagina
  app.get("/overzicht", function (request, response) {
    response.render("overzicht", { services: allAdvertisementsData });
  });

  // GET-route voor de overzicht detail page van een service met slug
  app.get("/service/:slug", function (request, response) {
    const serviceSlug = request.params.slug;
    const service = allAdvertisementsData.find(
      (service) => service.slug === serviceSlug
    );
    if (!service) {
      console.error(`Service met slug ${serviceSlug} niet gevonden`);
      response.status(404).send("Service niet gevonden");
      return;
    }
    response.render("service", { service: service });
  });

  // Zorg voor een leesbare URL door de titel weer te geven in plaats van het ID
  allAdvertisementsData.forEach((service) => {
    service.slug = slugify(service.title, { lower: true });
  });

  // GET-route voor de pagina om een service aan te melden
  app.get("/service-aanmelden", function (request, response) {
    response.render("service-aanmelden", { services: allAdvertisementsData });
  });

  // GET-route voor de pagina om een service aanmelding succes weer te geven
  app.get("/service-aanmelden-gelukt", function (request, response) {
    response.render("service-aanmelden-gelukt", { services: allAdvertisementsData });
  });

  // POST-route om formuliergegevens te verwerken
  app.post("/service-aanmelden", function (request, response) {
    const formData = request.body;

    const newAdvertisement = {
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      contact: formData.contact,
      title: formData.title,
      short_description: formData.short_description,
      long_description: formData.long_description,
      location: formData.location,
      neighbourhood: formData.neighbourhood,
      start_date: formData.start_date,
      end_date: formData.end_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
    };

    // Gegevens naar de API endpoint sturen
    fetchJson(baseUrl + "/items/dh_services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAdvertisement),
    }).then((responseFromAPI) => {
      console.log("Response from API:", responseFromAPI);

      // Bijwerken van de gegevens vanuit de API
      fetchData().then((updatedData) => {
        allAdvertisementsData = updatedData;
        response.redirect("/service-aanmelden-gelukt");
      }).catch((error) => {
        console.error("Error fetching data from API:", error);
        response.status(500).send("Internal Server Error");
      });
    }).catch((error) => {
      console.error("Error while posting data to API:", error);
      response.status(500).send("Internal Server Error");
    });
  });

  // POST-route voor het liken van een service
  app.post("/like", function (request, response) {
    const { like_id } = request.body;
    console.log("Like verzoek voor service met ID:", like_id);
    const service = allAdvertisementsData.find(
      (service) => service.id === parseInt(like_id)
    );
    if (service) {
      service.likes = (service.likes || 0) + 1;
      // Aantal likes bijwerken in de Directus API
      fetchJson(baseUrl + `/items/dh_services/${like_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ likes: service.likes }),
      }).then(() => {
        console.log("Aantal likes bijgewerkt voor service:", service);
      }).catch((error) => {
        console.error("Error patching likes in Directus API:", error);
      });
    } else {
      console.log("Service niet gevonden voor ID:", like_id);
      response.status(404).send("Service niet gevonden");
    }
  });

  // Poort instellen waarop Express moet luisteren
  app.set("port", process.env.PORT || 8000);

  // Start de Express server
  app.listen(app.get("port"), function () {
    console.log(`Applicatie gestart op http://localhost:${app.get("port")}`);
  });
});
