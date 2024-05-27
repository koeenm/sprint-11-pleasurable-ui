// Zet een functie klaar om uit te voeren zodra de volledige pagina is geladen
window.onload = function() {
    // Creëer een nieuw Date-object dat de huidige datum en tijd bevat
    var today = new Date();
    
    // Haal de dag uit het Date-object, zet het om naar een string en vul aan met een nul als het nodig is (zodat het altijd twee cijfers heeft)
    var dd = String(today.getDate()).padStart(2, '0');
    
    // Haal de maand uit het Date-object, tel er 1 bij op (omdat JavaScript maanden van 0 telt), 
    // zet het om naar een string en vul aan met een nul als het nodig is (zodat het altijd twee cijfers heeft)
    var mm = String(today.getMonth() + 1).padStart(2, '0'); // Januari is 0!
    
    // Haal het jaar uit het Date-object
    var yyyy = today.getFullYear();
    
    // Stel het 'today' variabele opnieuw in om het te formatteren naar een standaard datumformaat dat input[type=date] kan lezen
    today = yyyy + '-' + mm + '-' + dd;
    
    // Vind het input-element met id "start_date" en stel zijn "min"-attribuut in op de huidige datum,
    // zodat geen eerdere data geselecteerd kunnen worden
    document.getElementById("start_date").setAttribute("min", today);
    
    // Doe hetzelfde voor het input-element met id "end_date"
    document.getElementById("end_date").setAttribute("min", today);
};
