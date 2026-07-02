Feature: Funcionalidad de Login

@test
  Scenario: Inicio de Sesión Exitoso con Credenciales Válidas
    Given navego a la página de login
    When envío el usuario "tomsmith" y la contraseña "SuperSecretPassword!"
    Then debería ver el mensaje de éxito que contiene "You logged into a secure are!"

  Scenario: Inicio de Sesión Fallido con Credenciales Inválidas
    Given navego a la página de login
    When envío el usuario "invalid" y la contraseña "invalid"
    Then debería ver el mensaje de error que contiene "Your username is invalid!"
