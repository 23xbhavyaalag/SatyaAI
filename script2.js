// DOM Elements
const newsInput = document.getElementById('news-input');
const verifyBtn = document.getElementById('verify-btn');
const trustScore = document.getElementById('trust-score');
const analysisText = document.getElementById('analysis-text');
const voteButtons = document.querySelectorAll('.vote-btn');
const scoreCircle = document.querySelector('.score-circle');

// Sample fact-checking database
const factCheckingDatabase = {
    "sample fake news": {
        score: 20,
        analysis: "This claim has been debunked by multiple fact-checking organizations.",
        sources: ["https://example.com/fact-check-1", "https://example.com/fact-check-2"]
    },
    "sample true news": {
        score: 90,
        analysis: "This information has been verified by reliable sources.",
        sources: ["https://example.com/verified-1", "https://example.com/verified-2"]
    }
};

// Extended analysis results
const analysisResults = [
    {
        verdict: 'fake',
        confidence: 87,
        explanation: 'This article contains several inconsistencies and unverified claims. The sources mentioned are not credible, and key details contradict verified reports from reliable news outlets.'
    },
    {
        verdict: 'review',
        confidence: 50,
        explanation: 'The content shows mixed signals. While some claims are supported by evidence, others require additional verification. We recommend cross-referencing with other reliable sources before sharing.'
    },
    {
        verdict: 'true',
        confidence: 67,
        explanation: 'Most claims in this article appear to be accurate, though some details could benefit from additional context. The sources cited are generally reliable, but we recommend checking the latest updates on this topic.'
    },
    {
        verdict: 'fake',
        confidence: 27,
        explanation: 'This article contains information that appears to be misleading or false. Several claims lack credible sources or are taken out of context. We recommend verifying with trusted news outlets or official updates before accepting or sharing this content.'
    },
    {
        verdict: 'Needs Review',
        confidence: 59,
        explanation: 'This article contains information that appears to be misleading or false. Several claims lack credible sources or are taken out of context. We recommend verifying with trusted news outlets or official updates before accepting or sharing this content.'
    }
];

// Initialize text-to-speech
const speechSynthesis = window.speechSynthesis;

// Main text analysis function
function analyzeText(text) {
    const keywords = {
        fake: ['urgent', 'breaking', 'exclusive', 'must share', 'viral'],
        true: ['verified', 'confirmed', 'official', 'reliable source']
    };

    let score = 50;
    let analysis = "This content needs further verification.";
    let sources = [];

    for (const [key, value] of Object.entries(factCheckingDatabase)) {
        if (text.toLowerCase().includes(key)) {
            score = value.score;
            analysis = value.analysis;
            sources = value.sources;
            return { score, analysis, sources };
        }
    }

    keywords.fake.forEach(word => {
        if (text.toLowerCase().includes(word)) score = Math.max(0, score - 10);
    });

    keywords.true.forEach(word => {
        if (text.toLowerCase().includes(word)) score = Math.min(100, score + 10);
    });

    // Pull a verdict from predefined analysis results randomly for demonstration
    const selectedAnalysis = analysisResults[Math.floor(Math.random() * analysisResults.length)];
    return {
        score: selectedAnalysis.confidence,
        analysis: selectedAnalysis.explanation,
        sources: []
    };
}

// Update UI results
function updateResults(analysis) {
    trustScore.textContent = analysis.score;
    analysisText.textContent = analysis.analysis;

    if (analysis.score >= 70) {
        scoreCircle.style.backgroundColor = '#d4edda';
        scoreCircle.style.color = '#155724';
    } else if (analysis.score >= 40) {
        scoreCircle.style.backgroundColor = '#fff3cd';
        scoreCircle.style.color = '#856404';
    } else {
        scoreCircle.style.backgroundColor = '#f8d7da';
        scoreCircle.style.color = '#721c24';
    }

    if (speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(
            `Trust score: ${analysis.score} percent. ${analysis.analysis}`
        );
        speechSynthesis.speak(utterance);
    }
}

// Button listener
verifyBtn.addEventListener('click', () => {
    const text = newsInput.value.trim();
    if (text) {
        verifyBtn.disabled = true;
        verifyBtn.textContent = 'Analyzing...';

        setTimeout(() => {
            const analysis = analyzeText(text);
            updateResults(analysis);
            verifyBtn.disabled = false;
            verifyBtn.textContent = 'Verify News';
        }, 1500);
    } else {
        alert('Please enter some text to verify');
    }
});

// Community voting
voteButtons.forEach(button => {
    button.addEventListener('click', () => {
        const currentScore = parseInt(trustScore.textContent);
        let newScore = currentScore;

        switch (button.classList[1]) {
            case 'true':
                newScore = Math.min(100, currentScore + 5);
                break;
            case 'fake':
                newScore = Math.max(0, currentScore - 5);
                break;
            case 'review':
                newScore = Math.max(0, Math.min(100, currentScore - 2));
                break;
        }

        trustScore.textContent = newScore;
        updateResults({ score: newScore, analysis: analysisText.textContent });
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Statistic counter
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + (element.id === 'accuracy-rate' ? '%' : '+');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', () => {
    const accuracyRate = document.getElementById('accuracy-rate');
    const articlesAnalyzed = document.getElementById('articles-analyzed');
    const usersProtected = document.getElementById('users-protected');

    animateValue(accuracyRate, 0, 95, 2000);
    animateValue(articlesAnalyzed, 0, 10000, 2000);
    animateValue(usersProtected, 0, 50000, 2000);
});
