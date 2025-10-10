// Get DOM elements
const tempInput = document.getElementById('temperature');
const resultDiv = document.getElementById('result');
const resultValue = document.getElementById('resultValue');
const errorMsg = document.getElementById('error');
const convertBtn = document.getElementById('convertBtn');

// Conversion function
function convertTemperature() {
    const selectedUnit = document.querySelector('input[name="unit"]:checked').value;
    const temp = parseFloat(tempInput.value);
    
    // Validate input
    if (isNaN(temp) || tempInput.value.trim() === '') {
        errorMsg.classList.add('show');
        resultDiv.classList.remove('show');
        return;
    }
    
    errorMsg.classList.remove('show');
    
    let results = [];
    
    // Convert based on selected unit
    if (selectedUnit === 'celsius') {
        const fahrenheit = (temp * 9/5) + 32;
        const kelvin = temp + 273.15;
        results.push(`${fahrenheit.toFixed(2)}°F`);
        results.push(`${kelvin.toFixed(2)}K`);
    } else if (selectedUnit === 'fahrenheit') {
        const celsius = (temp - 32) * 5/9;
        const kelvin = celsius + 273.15;
        results.push(`${celsius.toFixed(2)}°C`);
        results.push(`${kelvin.toFixed(2)}K`);
    } else if (selectedUnit === 'kelvin') {
        const celsius = temp - 273.15;
        const fahrenheit = (celsius * 9/5) + 32;
        results.push(`${celsius.toFixed(2)}°C`);
        results.push(`${fahrenheit.toFixed(2)}°F`);
    }
    
    // Display results
    resultValue.innerHTML = results.join('<br>');
    resultDiv.classList.add('show');
}

// Event listeners
convertBtn.addEventListener('click', convertTemperature);

// Allow Enter key to trigger conversion
tempInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        convertTemperature();
    }
});

// Clear error when user starts typing
tempInput.addEventListener('input', function() {
    errorMsg.classList.remove('show');
});
