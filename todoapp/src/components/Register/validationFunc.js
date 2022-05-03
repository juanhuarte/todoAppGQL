export function validationFunc(input) {
  let errors = {};
  if (input.name.length === 0) errors.name = "Name is required";
  if (input.lastName.length === 0) errors.lastName = "Last Name is required";
  if (input.mail.length === 0) errors.mail = "Mail is required";
  else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(input.mail))
    errors.mail = "Invalid Mail";
  if (input.password.length === 0) errors.password = "Password is required";
  else if (!/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/.test(input.password))
    errors.password =
      "Between 8 and 16 characters, must include (Uppercase, Lowercase, Numbers)";
  if (input.password !== input.rePassword)
    errors.rePassword = "The password does not match";
  else if (
    !/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/.test(input.rePassword)
  )
    errors.rePassword = "Password is required";
  return errors;
}
