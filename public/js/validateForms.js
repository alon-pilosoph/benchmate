// Bootstrap script to enable custom validation feedback
(function () {
    'use strict'

    const forms = document.querySelectorAll('.needs-validation')

    // Loop over forms and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()