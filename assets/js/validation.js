// Отримуємо форму та всі поля, які перевіряються під час надсилання.
const feedbackForm = document.querySelector("#feedbackForm") || document.querySelector("#lead-form");

const fields = {
  username: document.querySelector("#username") || document.querySelector("#user_name"),
  email: document.querySelector("#email") || document.querySelector("#user_email"),
  phone: document.querySelector("#phone") || document.querySelector("#user_phone"),
  message: document.querySelector("#message") || document.querySelector("#user_message"),
  agreement: document.querySelector("#agreement") || document.querySelector("#privacy_consent")
};

// Видаляє попередній стан і повертає поле до нейтрального вигляду.
function clearFieldState(field) {
  field.classList.remove("border-red-500", "border-green-500");
  field.removeAttribute("aria-invalid");
}

// Показує або приховує текст помилки під конкретним полем.
function setFieldError(field, message) {
  const error = document.querySelector(`#${field.id}-error`);

  clearFieldState(field);

  if (message) {
    field.classList.add("border-red-500");
    field.setAttribute("aria-invalid", "true");

    if (error) {
      error.textContent = message;
      error.classList.remove("hidden");
    }
  } else {
    field.classList.add("border-green-500");
    field.removeAttribute("aria-invalid");

    if (error) {
      error.textContent = "";
      error.classList.add("hidden");
    }
  }

  return !message;
}

// Перевіряє ім'я: допускаються щонайменше два символи.
function validateUsername() {
  const value = fields.username.value.trim();

  if (value.length < 2) {
    return setFieldError(fields.username, "Ім'я повинно містити щонайменше 2 символи.");
  }

  return setFieldError(fields.username, "");
}

// Перевіряє базовий формат email-адреси.
function validateEmail() {
  const value = fields.email.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(value)) {
    return setFieldError(fields.email, "Введіть коректну адресу електронної пошти.");
  }

  return setFieldError(fields.email, "");
}

// Перевіряє номер у форматі +380 (00) 000-00-00.
function validatePhone() {
  const value = fields.phone.value.replace(/[\s\u00a0\u202f]+/g, " ");
  const phonePattern = /^\+380 \(\d{2}\) \d{3}-\d{2}-\d{2}$/;

  if (!phonePattern.test(value)) {
    return setFieldError(fields.phone, "Введіть номер у форматі +380 (00) 000-00-00.");
  }

  return setFieldError(fields.phone, "");
}

// Перевіряє повідомлення: мінімальна довжина становить 10 символів.
function validateMessage() {
  const value = fields.message.value.trim();

  if (value.length < 10) {
    return setFieldError(fields.message, "Повідомлення повинно містити щонайменше 10 символів.");
  }

  return setFieldError(fields.message, "");
}

// Перевіряє обов'язкову згоду користувача.
function validateAgreement() {
  const error = document.querySelector(`#${fields.agreement.id}-error`);

  clearFieldState(fields.agreement);

  if (!fields.agreement.checked) {
    fields.agreement.setAttribute("aria-invalid", "true");
    fields.agreement.classList.add("border-red-500");

    if (error) {
      error.textContent = "Для надсилання форми необхідна ваша згода.";
      error.classList.remove("hidden");
    }

    return false;
  }

  fields.agreement.classList.add("border-green-500");
  fields.agreement.removeAttribute("aria-invalid");

  if (error) {
    error.textContent = "";
    error.classList.add("hidden");
  }

  return true;
}

// Перевіряє усі поля перед надсиланням форми.
function validateForm() {
  const validations = [
    { field: fields.username, validate: validateUsername },
    { field: fields.email, validate: validateEmail },
    { field: fields.phone, validate: validatePhone },
    { field: fields.message, validate: validateMessage },
    { field: fields.agreement, validate: validateAgreement }
  ];

  const results = validations.map(({ validate }) => validate());
  const firstInvalid = validations.find((_, index) => !results[index]);

  if (firstInvalid) {
    firstInvalid.field.focus();
  }

  return results.every(Boolean);
}

if (feedbackForm) {
  // Перевіряємо всі поля під час submit, не перериваючись на першій помилці.
  feedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (validateForm() && feedbackForm.id !== "lead-form") {
      feedbackForm.submit();
    }
  });

  const inputValidators = [
    [fields.username, validateUsername],
    [fields.email, validateEmail],
    [fields.phone, validatePhone],
    [fields.message, validateMessage]
  ];

  inputValidators.forEach(([field, validate]) => {
    field.addEventListener("input", () => {
      validate();
    });

    field.addEventListener("blur", () => {
      validate();
    });
  });

  fields.agreement.addEventListener("change", () => {
    validateAgreement();
  });

  fields.agreement.addEventListener("blur", () => {
    validateAgreement();
  });
}
