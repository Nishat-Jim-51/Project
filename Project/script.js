// Select necessary DOM elements
const templateTitle = document.getElementById('templateTitle');
const templateDescription = document.getElementById('templateDescription');
const questionsSection = document.getElementById('questions-section');
const formContainer = document.getElementById('form-container');
const resultsContainer = document.getElementById('results-container');
const submitFormBtn = document.getElementById('submitForm');

// Template and Form storage
let template = {
    title: '',
    description: '',
    questions: []
};

let formAnswers = [];

// Add text question to the template
document.getElementById('addTextQuestion').addEventListener('click', () => {
    const questionId = template.questions.length;
    const question = {
        id: questionId,
        type: 'text',
        questionText: prompt('Enter your text question:'),
        answer: ''
    };
    template.questions.push(question);
    displayQuestions();
});

// Add number question to the template
document.getElementById('addNumberQuestion').addEventListener('click', () => {
    const questionId = template.questions.length;
    const question = {
        id: questionId,
        type: 'number',
        questionText: prompt('Enter your number question:'),
        answer: ''
    };
    template.questions.push(question);
    displayQuestions();
});

// Add MCQ question to the template
document.getElementById('addMCQQuestion').addEventListener('click', () => {
    const questionId = template.questions.length;
    const questionText = prompt('Enter your MCQ question:');
    let options = [];
    let option;
    do {
        option = prompt('Enter an option (leave empty to stop):');
        if (option) {
            options.push(option);
        }
    } while (option);

    const question = {
        id: questionId,
        type: 'mcq',
        questionText: questionText,
        options: options,
        answer: ''
    };
    template.questions.push(question);
    displayQuestions();
});

// Add checkbox question to the template
document.getElementById('addCheckboxQuestion').addEventListener('click', () => {
    const questionId = template.questions.length;
    const questionText = prompt('Enter your Checkbox question:');
    let options = [];
    let option;
    do {
        option = prompt('Enter an option (leave empty to stop):');
        if (option) {
            options.push(option);
        }
    } while (option);

    const question = {
        id: questionId,
        type: 'checkbox',
        questionText: questionText,
        options: options,
        answer: []
    };
    template.questions.push(question);
    displayQuestions();
});

// Display questions in the Template Creation Section
function displayQuestions() {
    questionsSection.innerHTML = '<h3>Questions</h3>';
    template.questions.forEach((q) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question-item');
        questionElement.innerHTML = `<strong>Question ${q.id + 1}:</strong> ${q.questionText}`;
        questionsSection.appendChild(questionElement);
    });
}

// Save the template
document.getElementById('saveTemplate').addEventListener('click', () => {
    template.title = templateTitle.value;
    template.description = templateDescription.value;

    if (!template.title || !template.description || template.questions.length === 0) {
        alert('Please provide a title, description, and add at least one question.');
        return;
    }

    // Save template and move to the form filling section
    alert('Template saved successfully! Now, users can fill out the form.');
    loadFormForFilling();
});

// Load form for filling based on the template
function loadFormForFilling() {
    formContainer.innerHTML = '';
    template.questions.forEach((q) => {
        const formItem = document.createElement('div');
        formItem.classList.add('form-item');
        formItem.innerHTML = `<label>${q.questionText}</label>`;
        if (q.type === 'text') {
            formItem.innerHTML += `<input type="text" data-id="${q.id}" placeholder="Enter answer">`;
        } else if (q.type === 'number') {
            formItem.innerHTML += `<input type="number" data-id="${q.id}" placeholder="Enter a number">`;
        } else if (q.type === 'mcq') {
            q.options.forEach((option, index) => {
                formItem.innerHTML += `
                    <input type="radio" name="mcq-${q.id}" value="${option}" data-id="${q.id}">
                    <label>${option}</label><br>`;
            });
        } else if (q.type === 'checkbox') {
            q.options.forEach((option, index) => {
                formItem.innerHTML += `
                    <input type="checkbox" value="${option}" data-id="${q.id}">
                    <label>${option}</label><br>`;
            });
        }
        formContainer.appendChild(formItem);
    });
    submitFormBtn.style.display = 'inline-block';
}

// Submit the filled form
submitFormBtn.addEventListener('click', () => {
    const inputs = formContainer.querySelectorAll('input');
    let answers = {};

    inputs.forEach(input => {
        const questionId = input.getAttribute('data-id');
        if (input.type === 'radio' || input.type === 'text' || input.type === 'number') {
            if (input.checked || input.type !== 'checkbox') {
                answers[questionId] = input.value;
            }
        } else if (input.type === 'checkbox') {
            if (!answers[questionId]) answers[questionId] = [];
            if (input.checked) answers[questionId].push(input.value);
        }
    });

    formAnswers.push(answers);
    displayResults();
});

// Display results (filled answers)
function displayResults() {
    resultsContainer.innerHTML = '<h3>Form Responses</h3>';
    formAnswers.forEach((answerSet, index) => {
        const answerElement = document.createElement('div');
        answerElement.classList.add('answer-item');
        answerElement.innerHTML = `<h4>Response ${index + 1}</h4>`;
        Object.keys(answerSet).forEach(questionId => {
            const question = template.questions[questionId];
            answerElement.innerHTML += `<p><strong>${question.questionText}:</strong> ${answerSet[questionId]}</p>`;
        });
        resultsContainer.appendChild(answerElement);
    });
}
