let display = document.getElementById('result');
let currentInput = '';
let shouldResetDisplay = false;

function appendToResult(value) {
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }
    
    if (display.value === '0' && value !== '.') {
        display.value = value;
    } else {
        display.value += value;
    }
    currentInput = display.value;
}

function clearResult() {
    display.value = '';
    currentInput = '';
    shouldResetDisplay = false;
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
    currentInput = display.value;
}

async function calculate() {
    try {
        const expression = display.value;
        if (!expression) return;

        const result = await evaluateExpression(expression);
        display.value = result;
        currentInput = result.toString();
        shouldResetDisplay = true;
    } catch (error) {
        display.value = 'Error';
        shouldResetDisplay = true;
    }
}

async function evaluateExpression(expression) {
    const operators = ['+', '-', '*', '/'];
    let operator = null;
    let operatorIndex = -1;

    for (let i = expression.length - 1; i >= 0; i--) {
        if (operators.includes(expression[i]) && i > 0) {
            operator = expression[i];
            operatorIndex = i;
            break;
        }
    }

    if (!operator || operatorIndex === -1) {
        throw new Error('Invalid expression');
    }

    const num1 = parseFloat(expression.substring(0, operatorIndex));
    const num2 = parseFloat(expression.substring(operatorIndex + 1));

    if (isNaN(num1) || isNaN(num2)) {
        throw new Error('Invalid numbers');
    }

    let operation;
    switch (operator) {
        case '+':
            operation = 'add';
            break;
        case '-':
            operation = 'subtract';
            break;
        case '*':
            operation = 'multiply';
            break;
        case '/':
            operation = 'divide';
            break;
        default:
            throw new Error('Invalid operation');
    }

    const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            num1: num1,
            num2: num2,
            operation: operation
        })
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Calculation failed');
    }

    return data.result;
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        appendToResult(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToResult(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearResult();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});