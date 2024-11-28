// JavaScript for Day Trading Helper

function populateFields() {
    const bulkInput = document.getElementById('bulkInput').value.split('\n');
    if (bulkInput.length >= 5) {
        document.getElementById('stockPrice').value = parseFloat(bulkInput[0]);
        const emaValues = bulkInput[1].split(',');
        document.getElementById('ema9').value = parseFloat(emaValues[0]);
        document.getElementById('ema50').value = parseFloat(emaValues[1]);
        const macdValues = bulkInput[2].split(',');
        document.getElementById('macdFast').value = parseFloat(macdValues[0]);
        document.getElementById('macdSlow').value = parseFloat(macdValues[1]);
        document.getElementById('macdSignal').value = parseFloat(macdValues[2]);
        document.getElementById('rsi').value = parseFloat(bulkInput[3]);
        const bollingerValues = bulkInput[4].split(',');
        document.getElementById('bollingerTop').value = parseFloat(bollingerValues[0]);
        document.getElementById('bollingerBottom').value = parseFloat(bollingerValues[1]);
    }
}

function generateRecommendation() {
    // Get all input values
    const stockPrice = parseFloat(document.getElementById('stockPrice').value);
    const ema9 = parseFloat(document.getElementById('ema9').value);
    const ema50 = parseFloat(document.getElementById('ema50').value);
    const macdFast = parseFloat(document.getElementById('macdFast').value);
    const macdSlow = parseFloat(document.getElementById('macdSlow').value);
    const macdSignal = parseFloat(document.getElementById('macdSignal').value);
    const rsi = parseFloat(document.getElementById('rsi').value);
    const bollingerTop = parseFloat(document.getElementById('bollingerTop').value);
    const bollingerBottom = parseFloat(document.getElementById('bollingerBottom').value);

    // Weights
    const emaWeight = 0.4;
    const macdWeight = 0.3;
    const rsiWeight = 0.2;
    const bollingerWeight = 0.1;

    let confidenceScore = 0;
    let recommendationReason = [];

    // EMA Analysis
    if (ema9 > ema50) {
        confidenceScore += emaWeight;
        recommendationReason.push("EMA (9) is above EMA (50), indicating an uptrend.");
    } else {
        recommendationReason.push("EMA (9) is below EMA (50), indicating a downtrend.");
    }

    // MACD Analysis
    const macdDifference = macdFast - macdSlow;
    if (macdDifference > macdSignal) {
        confidenceScore += macdWeight;
        recommendationReason.push("MACD is positive, showing momentum in an upward direction.");
    } else if (macdDifference < 0) {
        recommendationReason.push("MACD is negative, showing downward momentum.");
    } else {
        recommendationReason.push("MACD is below the signal line, showing a lack of upward momentum.");
    }

    // RSI Analysis
    if (rsi < 30) {
        confidenceScore += rsiWeight;
        recommendationReason.push("RSI is below 30, indicating the stock may be oversold.");
    } else if (rsi > 70) {
        recommendationReason.push("RSI is above 70, indicating the stock may be overbought.");
    } else {
        confidenceScore += rsiWeight * 0.5;
        recommendationReason.push("RSI is in the neutral range, providing moderate support.");
    }

    // Bollinger Bands Analysis
    if (stockPrice > bollingerTop) {
        recommendationReason.push("Stock price is above the upper Bollinger Band, indicating potential overvaluation.");
    } else if (stockPrice < bollingerBottom) {
        confidenceScore += bollingerWeight;
        recommendationReason.push("Stock price is below the lower Bollinger Band, indicating potential undervaluation.");
    } else {
        recommendationReason.push("Stock price is within the Bollinger Bands, indicating stable conditions.");
    }

    // Generate Final Recommendation
    let recommendation = "Hold";
    if (confidenceScore > 0.6) {
        recommendation = "Buy";
    } else if (confidenceScore < 0.3) {
        recommendation = "Sell";
    }

    // Output the recommendation
    document.getElementById('recommendationOutput').innerHTML = `${recommendation}: ${recommendationReason.join(" ")}`;
}
