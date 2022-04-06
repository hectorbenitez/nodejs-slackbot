module.exports = {
    getNextIndex
}

function getNextIndex(surveySession) {
    let idx = surveySession.index + 1
    let question = surveySession.questions[idx]

    while(question && question.condition) {
        const conditionIdx = question.condition.idx
        if (!conditionIdx) {
            break
        }

        const conditionValue = question.condition.value
        if(surveySession.questions[conditionIdx].answer === conditionValue) {
            break
        }

        if(question.condition.values.includes(surveySession.questions[conditionIdx].answer)) {
            break
        }

        idx++
        question = surveySession.questions[idx]        
    }

    return idx
}