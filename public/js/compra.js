document.addEventListener('DOMContentLoaded', async () => {
  await window.TecboltApp.layoutReady;
  const userMount = document.getElementById('headerUserMount');
  const quoteForm = document.getElementById('quoteForm');
  const quoteFormMessage = document.getElementById('quoteFormMessage');
  const quoteSubmitButton = document.getElementById('quoteSubmitButton');
  const proposalModal = document.getElementById('proposalModal');
  const modalCloseButton = document.getElementById('proposalModalClose');
  const modalIconButton = document.getElementById('proposalModalIcon');
  const modalText = document.getElementById('proposalModalText');
  const defaultModalMessage = 'Hemos recibido tu interés y pronto podremos compartirte una propuesta comercial.';
  const quoteFields = quoteForm ? Array.from(quoteForm.querySelectorAll('input, textarea')) : [];

  const quoteValidationMessages = {
    institutionName: 'La institución solo debe contener letras y espacios.',
    contactName: 'El nombre del responsable solo debe contener letras y espacios.',
    contactEmail: 'Solo se aceptan correos gmail.com, tecsup.edu.pe, hotmail.com, outlook.com o yahoo.com.',
    contactPhone: 'El teléfono debe tener exactamente 9 dígitos.',
    deviceCount: 'Ingresa una cantidad válida de dispositivos.',
    institutionType: 'El tipo de institución solo debe contener letras y espacios.',
    quoteMessage: 'El mensaje solo puede contener letras, números y signos básicos como coma, punto, paréntesis o guion.'
  };

  const openProposalModal = () => {
    if (!proposalModal) {
      return;
    }

    proposalModal.classList.remove('hidden');
    proposalModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (modalText) {
      modalText.textContent = defaultModalMessage;
    }
    modalCloseButton?.focus();
  };

  const closeProposalModal = () => {
    if (!proposalModal) {
      return;
    }

    proposalModal.classList.add('hidden');
    proposalModal.setAttribute('aria-hidden', 'true');
    proposalModal.classList.remove('proposal-modal-card-celebrating');
    document.body.style.overflow = '';
  };

  const sanitizeQuoteField = (field) => {
    if (!field) {
      return;
    }

    if (['institutionName', 'contactName', 'institutionType'].includes(field.id)) {
      field.value = window.TecboltApp.sanitizeLettersOnly(field.value);
      return;
    }

    if (field.id === 'contactPhone') {
      field.value = window.TecboltApp.sanitizeDigitsOnly(field.value).slice(0, 9);
      return;
    }

    if (field.id === 'deviceCount') {
      field.value = window.TecboltApp.sanitizeDigitsOnly(field.value).slice(0, 4);
      return;
    }

    if (field.id === 'contactEmail') {
      field.value = field.value.trim().toLowerCase();
      return;
    }

    if (field.id === 'quoteMessage') {
      field.value = window.TecboltApp.sanitizeMessageText(field.value);
    }
  };

  const validateQuoteField = (field) => {
    if (!field) {
      return true;
    }

    sanitizeQuoteField(field);

    const trimmedValue = field.value.trim();
    let errorMessage = '';

    if (!trimmedValue) {
      errorMessage = 'Completa este campo.';
    } else if (['institutionName', 'contactName', 'institutionType'].includes(field.id)) {
      if (trimmedValue.length < 3 || !window.TecboltApp.lettersAndSpacesPattern.test(trimmedValue)) {
        errorMessage = quoteValidationMessages[field.id];
      }
    } else if (field.id === 'contactEmail') {
      if (!window.TecboltApp.isAllowedEmail(trimmedValue)) {
        errorMessage = quoteValidationMessages.contactEmail;
      }
    } else if (field.id === 'contactPhone') {
      if (!/^\d{9}$/.test(trimmedValue)) {
        errorMessage = quoteValidationMessages.contactPhone;
      }
    } else if (field.id === 'deviceCount') {
      if (!/^[1-9]\d{0,3}$/.test(trimmedValue)) {
        errorMessage = quoteValidationMessages.deviceCount;
      }
    } else if (field.id === 'quoteMessage') {
      if (trimmedValue.length < 10 || !window.TecboltApp.messagePattern.test(trimmedValue)) {
        errorMessage = quoteValidationMessages.quoteMessage;
      }
    }

    field.setCustomValidity(errorMessage);
    return !errorMessage;
  };

  const syncQuoteSubmitState = () => {
    if (!quoteSubmitButton) {
      return;
    }

    const formIsValid = quoteFields.length > 0 && quoteFields.every((field) => validateQuoteField(field));
    quoteSubmitButton.disabled = !formIsValid;
    quoteSubmitButton.setAttribute('aria-disabled', String(!formIsValid));
  };

  try {
    const user = await window.TecboltApp.getCurrentUser();

    if (user) {
      window.TecboltApp.syncHeaderForUser(user);
      window.TecboltApp.renderUserBox(user, userMount);
    } else {
      window.TecboltApp.syncHeaderForUser(null);
    }
  } catch (error) {
    console.error('No se pudo cargar la sesión actual:', error.message);
  }

  if (quoteForm) {
    quoteFields.forEach((field) => {
      field.addEventListener('input', () => {
        sanitizeQuoteField(field);
        validateQuoteField(field);
        window.TecboltApp.setMessage(quoteFormMessage, '', false);
        syncQuoteSubmitState();
      });

      field.addEventListener('blur', () => {
        validateQuoteField(field);
        syncQuoteSubmitState();
      });
    });

    syncQuoteSubmitState();

    quoteForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const invalidField = quoteFields.find((field) => !validateQuoteField(field));

      if (invalidField) {
        window.TecboltApp.setMessage(quoteFormMessage, 'Completa correctamente todos los campos antes de solicitar la propuesta.');
        syncQuoteSubmitState();
        invalidField.reportValidity();
        invalidField.focus();
        return;
      }

      window.TecboltApp.setMessage(quoteFormMessage, '', false);
      openProposalModal();
      quoteForm.reset();
      quoteFields.forEach((field) => field.setCustomValidity(''));
      syncQuoteSubmitState();
    });
  }

  if (modalCloseButton) {
    modalCloseButton.addEventListener('click', closeProposalModal);
  }

  if (proposalModal) {
    proposalModal.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement && event.target.dataset.closeModal === 'true') {
        closeProposalModal();
      }
    });
  }

  if (modalIconButton) {
    modalIconButton.addEventListener('click', () => {
      if (!proposalModal || !modalText) {
        return;
      }

      proposalModal.classList.remove('proposal-modal-card-celebrating');
      void proposalModal.offsetWidth;
      proposalModal.classList.add('proposal-modal-card-celebrating');
      modalText.textContent = 'Gracias por tu interés. Al hacer clic en el icono activaste una confirmación especial.';
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && proposalModal && !proposalModal.classList.contains('hidden')) {
      closeProposalModal();
    }
  });
});
