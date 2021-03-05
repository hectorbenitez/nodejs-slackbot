module.exports = {
    createBlockKitQuestion
}

function createBlockKitQuestion(question, index, answerSelected = null) {
  let answers = [
    "Never",
    "Almost Never",
    "Sometimes",
    "Almost Always",
    "Always",
  ];
    
  if(question.type === 'yes_no'){
    answers = [
     "Yes",
     "No",
   ]
  }
  
    const buttons = answers.map((answer, idx) => {
      const button = {
        type: "button",
        action_id: `survey-answer-${idx}`,
        value: `answer-${index}-${answer}`,
        text: {
          type: "plain_text",
          emoji: true,
          text: answer,
        },
      };

      if(answerSelected === answer) {
        button.style = 'primary'
      }

      return button;
    });
    
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Question: ${question.question}`,
        },
      },
      {
        type: "actions",
        elements: buttons,
      },
    ];
  }