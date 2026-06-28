Feature: Flujo de Compra de SauceDemo E2E

  Background:
    Given navego a la página de login de SauceDemo
    And inicio sesión con credenciales válidas

  Scenario: Flujo de compra completo con múltiples productos
    When agrego "Sauce Labs Backpack" y "Sauce Labs Bolt T-Shirt" al carrito
    Then el carrito de compras debería mostrar 2 artículos
    When hago clic en el carrito de compras
    Then debería ver "Sauce Labs Backpack" y "Sauce Labs Bolt T-Shirt" en el carrito
    When hago clic en checkout
    And ingreso los datos de envío "Juan" "Perez" "12345"
    And completo la compra
    Then debería ver el mensaje de éxito de la compra "Thank you for your order!"

  Scenario: Verificar ordenamiento de productos por precio de menor a mayor
    When selecciono la opción de ordenamiento "lohi"
    Then los productos deberían estar ordenados por precio de forma ascendente
