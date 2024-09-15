document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let allValid = true;
        let firstInvalid = null;
        
        inputs.forEach(input => {
            input.classList.remove('highlight', 'success');
            if (!input.value.trim()) {
                allValid = false;
                input.classList.add('highlight');
                if (!firstInvalid) {
                    firstInvalid = input;
                }
                setTimeout(() => {
                    input.classList.remove('highlight');
                }, 2000);
            }
        });
        
        if (!allValid) {
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Tutti i campi sono validi
            inputs.forEach(input => {
                input.classList.add('success');
                input.value = ''; // Svuota il campo
            });
            
            // Mostra il messaggio di successo
            successMessage.style.display = 'block';
            
            // Nascondi il messaggio dopo 3 secondi
            setTimeout(() => {
                successMessage.style.display = 'none';
                // Rimuovi la classe success dai campi
                inputs.forEach(input => {
                    input.classList.remove('success');
                });
            }, 2000);
            
        }
    });
});