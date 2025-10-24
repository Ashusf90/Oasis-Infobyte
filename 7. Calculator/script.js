// Calculator Class for better organization
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    // Clear all values
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.shouldResetScreen = false;
        this.removeOperatorHighlight();
    }

    // Delete last digit
    delete() {
        if (this.currentOperand === '0') return;
        
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    // Append number to current operand
    appendNumber(number) {
        // Reset screen if needed
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        // Prevent multiple decimal points
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        // Limit input length to prevent overflow
        if (this.currentOperand.length >= 15) return;
        
        // Replace leading zero
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    // Select operation
    chooseOperation(operation) {
        // Prevent operation on empty input
        if (this.currentOperand === '') return;
        
        // Complete previous calculation if exists
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
        
        // Highlight selected operator
        this.highlightOperator(operation);
    }

    // Perform calculation
    compute() {
        let result;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        // Validate numbers
        if (isNaN(prev) || isNaN(current)) return;
        
        // Perform calculation based on operation
        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.showError('Cannot divide by zero!');
                    
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        // Handle very large or very small numbers
        if (Math.abs(result) > 1e15) {
            this.currentOperand = result.toExponential(6);
        } else {
            // Round to avoid floating point errors
            result = Math.round(result * 100000000) / 100000000;
            this.currentOperand = result.toString();
        }
        
        this.operation = null;
        this.previousOperand = '';
        this.removeOperatorHighlight();
    }

    // Convert to percentage
    percentage() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.currentOperand = (current / 100).toString();
    }

    // Format number for display
    formatNumber(number) {
        if (number === '') return '';
        
        const stringNumber = number.toString();
        
        // Handle exponential notation
        if (stringNumber.includes('e')) {
            return parseFloat(stringNumber).toExponential(6);
        }
        
        const parts = stringNumber.split('.');
        const integerPart = parseFloat(parts[0]);
        
        if (isNaN(integerPart)) return '';
        
        // Format integer part with commas
        const integerDisplay = integerPart.toLocaleString('en', {
            maximumFractionDigits: 0
        });
        
        // Add decimal part if exists
        if (parts.length > 1) {
            // Limit decimal places to 8
            const decimalPart = parts[1].substring(0, 8);
            return `${integerDisplay}.${decimalPart}`;
        } else {
            return integerDisplay;
        }
    }

    // Update display
    updateDisplay() {
        this.currentOperandElement.textContent = this.formatNumber(this.currentOperand);
        
        // Show previous operand with operation
        if (this.operation != null) {
            const operatorSymbol = this.getOperatorSymbol(this.operation);
            this.previousOperandElement.textContent = 
                `${this.formatNumber(this.previousOperand)} ${operatorSymbol}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }

    // Get display symbol for operator
    getOperatorSymbol(operation) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷'
        };
        return symbols[operation] || operation;
    }

    // Highlight selected operator button
    highlightOperator(operation) {
        this.removeOperatorHighlight();
        const operatorButton = document.querySelector(`[data-operator="${operation}"]`);
        if (operatorButton) {
            operatorButton.classList.add('active');
        }
    }

    // Remove operator highlight
    removeOperatorHighlight() {
        const operatorButtons = document.querySelectorAll('[data-operator]');
        operatorButtons.forEach(button => {
            button.classList.remove('active');
        });
    }

    // Show error message
    showError(message) {
        alert(message);
        this.clear();
        this.updateDisplay();
    }
}

// Initialize calculator
const previousOperandElement = document.getElementById('previousOperand');
const currentOperandElement = document.getElementById('currentOperand');
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Get all buttons
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const actionButtons = document.querySelectorAll('[data-action]');

// Add event listeners to number buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
    });
});

// Add event listeners to operator buttons
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.operator);
        calculator.updateDisplay();
    });
});

// Add event listeners to action buttons
actionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        
        switch (action) {
            case 'clear':
                calculator.clear();
                break;
            case 'delete':
                calculator.delete();
                break;
            case 'equals':
                calculator.compute();
                calculator.shouldResetScreen = true;
                break;
            case 'percent':
                calculator.percentage();
                break;
        }
        
        calculator.updateDisplay();
    });
});

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    // Numbers (0-9)
    if (key >= '0' && key <= '9') {
        calculator.appendNumber(key);
    }
    // Decimal point
    else if (key === '.') {
        calculator.appendNumber(key);
    }
    // Operators
    else if (key === '+') {
        calculator.chooseOperation('+');
    }
    else if (key === '-') {
        calculator.chooseOperation('-');
    }
    else if (key === '*') {
        calculator.chooseOperation('*');
    }
    else if (key === '/') {
        event.preventDefault(); // Prevent browser search
        calculator.chooseOperation('/');
    }
    // Equals
    else if (key === '=' || key === 'Enter') {
        calculator.compute();
        calculator.shouldResetScreen = true;
    }
    // Clear
    else if (key === 'Escape' || key === 'c' || key === 'C') {
        calculator.clear();
    }
    // Delete
    else if (key === 'Backspace' || key === 'Delete') {
        calculator.delete();
    }
    // Percentage
    else if (key === '%') {
        calculator.percentage();
    }
    
    calculator.updateDisplay();
});

// Add button press animation for keyboard inputs
document.addEventListener('keydown', (event) => {
    const key = event.key;
    let button = null;
    
    // Find corresponding button
    if (key >= '0' && key <= '9') {
        button = document.querySelector(`[data-number="${key}"]`);
    } else if (key === '.') {
        button = document.querySelector('[data-number="."]');
    } else if (['+', '-', '*', '/'].includes(key)) {
        button = document.querySelector(`[data-operator="${key}"]`);
    } else if (key === 'Enter' || key === '=') {
        button = document.querySelector('[data-action="equals"]');
    } else if (key === 'Escape') {
        button = document.querySelector('[data-action="clear"]');
    } else if (key === 'Backspace') {
        button = document.querySelector('[data-action="delete"]');
    } else if (key === '%') {
        button = document.querySelector('[data-action="percent"]');
    }
    
    // Animate button if found
    if (button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    }
});

// Initialize display
calculator.updateDisplay();

// Console message
console.log('Calculator initialized successfully!');
console.log('Keyboard shortcuts:');
console.log('- Numbers: 0-9');
console.log('- Operators: +, -, *, /');
console.log('- Equals: Enter or =');
console.log('- Clear: Escape or C');
console.log('- Delete: Backspace or Delete');
console.log('- Percentage: %');
