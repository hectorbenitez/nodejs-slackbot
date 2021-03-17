module.exports = {
  createSurveyHeader,
  createBlockKitQuestion,
  createSurveyReminder,
};

function createSurveyHeader(surveyName, welcomeMessage) {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: surveyName,
      },
    },
    {
      type: "context",
      elements: [
        {
          text: "Thank you for taking the time to complete this survey.",
          type: "mrkdwn",
        },
      ],
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:wave: ${welcomeMessage}`,
      },
    }
  ];
}

function createBlockKitQuestion(surveySession, index, answerSelected = null) {
  let answers = [
    "Never",
    "Almost Never",
    "Sometimes",
    "Almost Always",
    "Always",
  ];

  index = parseInt(index)
  const question = surveySession.questions[index]

  if (question.type === "yes_no") {
    answers = ["Yes", "No"];
  }

  if (question.type === "free_text") {
    answers = [];
  }

  const buttons = answers.map((answer, idx) => {
    const button = {
      type: "button",
      action_id: `survey-answer-${idx}`,
      value: `answer-${surveySession._id}-${index}-${answer}`,
      text: {
        type: "plain_text",
        emoji: true,
        text: answer,
      },
    };

    if (answerSelected === answer) {
      button.style = "primary";
    }

    return button;
  });

  const questionText = `${question.emoji ? question.emoji : ''} *Question:* ${question.question}`;

  const block = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: questionText,
      },
    },
    {
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": `Question ${index + 1} out of ${surveySession.questions.length}`
				}
			]
		},
  ];
  if(question.context){
    block.unshift({
      type: "section",
      text: {
        type: "mrkdwn",
        text: question.context,
      },
    });
  }
  if(buttons.length){
    block.push({
      type: "actions",
      elements: buttons,
    });
  }else if(answerSelected){ // this applies for free text questions, there are no buttons and the answer selected is the text to put in place 
    block.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: answerSelected,
      },
    });
  }
  return block;
}

function createSurveyReminder(reminderMessage, percentage) {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: reminderMessage,
      },
    },
    {
			type: "context",
			elements: [
				{
					"type": "mrkdwn",
					"text": `Current progress ${percentage}`
				}
			]
		},
  ];
}
