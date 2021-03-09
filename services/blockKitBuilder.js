module.exports = {
  createSurveyHeader,
  createBlockKitQuestion,
};

function createSurveyHeader(surveyName, welcomeMessage) {
  return [
    {
      type: "header",
      text: {
        type: "mrkdwn",
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

  return [
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
    {
      type: "actions",
      elements: buttons,
    }
  ];
}
