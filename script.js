
$(document).ready(function () {

    // Слова для кожного рівня складності
    const levels = {
        "A1": [
            { english: "Apple", ukrainian: "яблуко" },
            { english: "House", ukrainian: "будинок" },
            { english: "Water", ukrainian: "вода" },
            { english: "Friend", ukrainian: "друг" },
            { english: "Book", ukrainian: "книга" },
            { english: "Happy", ukrainian: "щасливий" },
            { english: "Family", ukrainian: "сім'я" },
            { english: "Morning", ukrainian: "ранок" },
            { english: "School", ukrainian: "школа" },
            { english: "Beautiful", ukrainian: "красивий" }
        ],

        "A2-B1": [
            { english: "Journey", ukrainian: "подорож" },
            { english: "Knowledge", ukrainian: "знання" },
            { english: "Improve", ukrainian: "покращувати" },
            { english: "Freedom", ukrainian: "свобода" },
            { english: "Success", ukrainian: "успіх" },
            { english: "Environment", ukrainian: "середовище" },
            { english: "Friendly", ukrainian: "дружній" },
            { english: "Happiness", ukrainian: "щастя" },
            { english: "Experience", ukrainian: "досвід" },
            { english: "Opportunity", ukrainian: "можливість" }
        ],

        "B2": [
            { english: "Achievement", ukrainian: "досягнення" },
            { english: "Responsibility", ukrainian: "відповідальність" },
            { english: "Nevertheless", ukrainian: "проте" },
            { english: "Awareness", ukrainian: "обізнаність" },
            { english: "Significant", ukrainian: "значний" },
            { english: "Determination", ukrainian: "рішучість" },
            { english: "Overwhelming", ukrainian: "приголомшливий" },
            { english: "Circumstances", ukrainian: "обставини" },
            { english: "Consequence", ukrainian: "наслідок" },
            { english: "Inevitable", ukrainian: "неминучий" }
        ]
    };

    let selectedLevel = "";
    let shuffledWords = [];
    let currentIndex = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let isChecked = false;

    // Випадковий порядок слів
    function shuffleWords() {
        shuffledWords = [...levels[selectedLevel]];

        for (let i = shuffledWords.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));

            [shuffledWords[i], shuffledWords[j]] =
                [shuffledWords[j], shuffledWords[i]];
        }
    }

    // Початок тестування
    function startGame(level) {
        selectedLevel = level;

        currentIndex = 0;
        correctAnswers = 0;
        wrongAnswers = 0;

        shuffleWords();

        $("#levelSelection").hide();
        $("#app").addClass("started");

        $("#currentLevel").text("LEVEL " + selectedLevel);

        showWord();
    }

    // Відображення слова
    function showWord() {
        let word = shuffledWords[currentIndex];

        $("#englishWord").text(word.english);

        $("#progress").text(
            String(currentIndex + 1).padStart(2, "0") +
            " / " + shuffledWords.length
        );

        $("#wordNumber").text(
            "WORD " + String(currentIndex + 1).padStart(2, "0")
        );

        $("#correct").text(correctAnswers);
        $("#wrong").text(wrongAnswers);

        $("#progressFill").css(
            "width",
            ((currentIndex + 1) / shuffledWords.length * 100) + "%"
        );

        $("#answer").val("").prop("disabled", false);

        $("#message")
            .text("")
            .removeClass("success error");

        $("#checkButton")
            .prop("disabled", false)
            .text("Перевірити відповідь →");

        isChecked = false;
    }

    // Перевірка відповіді
    function checkAnswer() {

        if (isChecked) {
            return;
        }

        let answer = $("#answer").val().trim().toLowerCase();

        if (answer === "") {
            $("#message")
                .text("Будь ласка, введи переклад слова!")
                .removeClass("success")
                .addClass("error");

            $("#answer").focus();
            return;
        }

        let correctAnswer =
            shuffledWords[currentIndex].ukrainian.toLowerCase();

        if (answer === correctAnswer) {
            correctAnswers++;

            $("#message")
                .text("✓ Правильно! Молодець!")
                .removeClass("error")
                .addClass("success");

        } else {
            wrongAnswers++;

            $("#message")
                .text("✗ Неправильно! Правильна відповідь: " +
                    correctAnswer)
                .removeClass("success")
                .addClass("error");
        }

        isChecked = true;

        $("#correct").text(correctAnswers);
        $("#wrong").text(wrongAnswers);

        $("#answer").prop("disabled", true);

        if (currentIndex === shuffledWords.length - 1) {
            $("#checkButton").text("Показати результат →");
        } else {
            $("#checkButton").text("Наступне слово →");
        }
    }

    // Наступне слово
    function nextWord() {

        if (!isChecked) {
            checkAnswer();
            return;
        }

        currentIndex++;

        if (currentIndex >= shuffledWords.length) {
            showResults();
        } else {
            showWord();
        }
    }

    // Визначення результату
    function showResults() {

        let percentage = Math.round(
            correctAnswers / shuffledWords.length * 100
        );

        let level = "";
        let icon = "";

        if (percentage >= 90) {
            level = "Відмінний результат!";
            icon = "🏆";
        } else if (percentage >= 70) {
            level = "Хороший результат!";
            icon = "🌟";
        } else if (percentage >= 50) {
            level = "Середній результат";
            icon = "📚";
        } else {
            level = "Потрібно більше практики";
            icon = "🌱";
        }

        $("#percentage").text(percentage + "%");
        $("#knowledgeLevel").text(level);
        $("#resultIcon").text(icon);

        $("#finalCorrect").text(correctAnswers);
        $("#finalWrong").text(wrongAnswers);

        $("#resultModal").css("display", "flex");
    }

    // Повторення тесту
    function restartGame() {
        startGame(selectedLevel);
        $("#resultModal").hide();
    }

    // Повернення до вибору рівня
    function chooseAnotherLevel() {
        $("#resultModal").hide();
        $("#app").removeClass("started");
        $("#levelSelection").show();
    }

    // Вибір рівня складності
    $(".level-btn").on("click", function () {
        let level = $(this).data("level");
        startGame(level);
    });

    // Натискання на картку
    $("#wordCard").on("click", function () {
        if (!isChecked) {
            checkAnswer();
        } else {
            nextWord();
        }
    });

    // Натискання на кнопку
    $("#checkButton").on("click", function () {
        if (!isChecked) {
            checkAnswer();
        } else {
            nextWord();
        }
    });

    // Перевірка за допомогою Enter
    $("#answer").on("keydown", function (event) {
        if (event.key === "Enter" && !isChecked) {
            checkAnswer();
        }
    });

    // Кнопки результатів
    $("#restartButton").on("click", restartGame);

    $("#chooseLevelButton").on("click", chooseAnotherLevel);

});
