module.exports = {
  createSurveyHeader,
  createBlockKitQuestion,
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

  let questionText = question.context || "Question:";
  questionText += ` ${question.question}`;

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
  if(buttons.length){
    block.push({
      type: "actions",
      elements: buttons,
    });
  }else if(answerSelected){
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
