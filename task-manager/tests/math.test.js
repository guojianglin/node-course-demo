const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit}  = require('../src/math')

test('should calculate total with tip', () => {
    const total = calculateTip(10, .2)
    expect(total).toBe(12)
})

test('Should calculate total with default tip',() => {
    const total = calculateTip(10)
    expect(total).toBe(12.5)
})

test('Should convert 32 F to 0 C', () => {
    const cel = fahrenheitToCelsius(32)
    expect(cel).toBe(0)
})

test('Create "Should convert 0 C to 32 F', () => {
    const fah = celsiusToFahrenheit(0)
    expect(fah).toBe(32)
})