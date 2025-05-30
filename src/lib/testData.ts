// src/lib/testData.ts
export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  correctOptionId: string;
  type: 'multiple-choice';
}

export interface TopicTest {
  topicId: string;
  topicName: string;
  questions: Question[];
}

export interface SubjectTests {
  subjectName: string;
  topics: TopicTest[];
}

export const testData: Record<string, SubjectTests> = {
  electronics: {
    subjectName: 'Electronics',
    topics: [
      {
        topicId: 'elec_basics',
        topicName: 'Circuit Basics',
        questions: [
          {
            id: 'q1_elec_basics',
            text: "What is Ohm's Law?",
            type: 'multiple-choice',
            options: [ /* ...options... */ { id: 'opt2_q1eb', text: 'V = I * R' } ], // Ensure options are filled
            correctOptionId: 'opt2_q1eb',
          },
          {
            id: 'q2_elec_basics',
            text: 'Which component allows current to flow in only one direction?',
            type: 'multiple-choice',
            options: [/* ...options... */ { id: 'opt3_q2eb', text: 'Diode' } ],
            correctOptionId: 'opt3_q2eb',
          },
        ],
      },
      {
        topicId: 'elec_transistors',
        topicName: 'Transistors',
        questions: [
          {
            id: 'q1_elec_transistors',
            text: 'What does BJT stand for?',
            type: 'multiple-choice',
            options: [/* ...options... */ { id: 'opt2_q1et', text: 'Bipolar Junction Transistor' } ],
            correctOptionId: 'opt2_q1et',
          },
          // Add more transistor questions
        ],
      },
    ],
  },
  'software-development': {
    subjectName: 'Software Development',
    topics: [
      {
        topicId: 'sd_fundamentals',
        topicName: 'Programming Fundamentals',
        questions: [
          {
            id: 'q1_sd_fun',
            text: 'What is a variable in programming?',
            type: 'multiple-choice',
            options: [/* ...options... */ { id: 'opt2_q1sdf', text: 'A named storage location for data' } ],
            correctOptionId: 'opt2_q1sdf',
          },
          // Add more fundamental questions
        ],
      },
      {
        topicId: 'sd_vcs',
        topicName: 'Version Control Systems',
        questions: [
          {
            id: 'q1_sd_vcs',
            text: 'Which of these is a common version control system?',
            type: 'multiple-choice',
            options: [/* ...options... */ { id: 'opt3_q1sdvcs', text: 'Git' } ],
            correctOptionId: 'opt3_q1sdvcs',
          },
        ],
      }
    ],
  },
  // Add other subjects (calculus, engineering-data) with their topics and questions
  calculus: {
    subjectName: "Calculus I",
    topics: [
        {
            topicId: "calc_derivatives",
            topicName: "Derivatives",
            questions: [
                {
                    id: 'q1_calc_der',
                    text: 'What does the derivative of a function represent?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'opt1_q1cd', text: 'Area under the curve' },
                      { id: 'opt2_q1cd', text: 'The sum of its values' },
                      { id: 'opt3_q1cd', text: 'Instantaneous rate of change' },
                      { id: 'opt4_q1cd', text: 'The highest point of the function' },
                    ],
                    correctOptionId: 'opt3_q1cd',
                  }
            ]
        }
    ]
  },
  'engineering-data': {
    subjectName: "Engineering Data",
    topics: [
        {
            topicId: "eng_data_basics",
            topicName: "Basic Statistics",
            questions: [
                 {
                    id: 'q1_engd_basics',
                    text: 'What is the "mean" of a dataset?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'opt1_q1edb', text: 'The most frequent value' },
                      { id: 'opt2_q1edb', text: 'The middle value' },
                      { id: 'opt3_q1edb', text: 'The average value' },
                      { id: 'opt4_q1edb', text: 'The difference between max and min' },
                    ],
                    correctOptionId: 'opt3_q1edb',
                  }
            ]
        }
    ]
  }
};

// Fill in the options for brevity above. Example for one:
testData.electronics.topics[0].questions[0].options = [
  { id: 'opt1_q1eb', text: 'V = I / R' },
  { id: 'opt2_q1eb', text: 'V = I * R' },
  { id: 'opt3_q1eb', text: 'I = V * R' },
  { id: 'opt4_q1eb', text: 'R = V * I' },
];
testData.electronics.topics[0].questions[1].options = [
  { id: 'opt1_q2eb', text: 'Resistor' },
  { id: 'opt2_q2eb', text: 'Capacitor' },
  { id: 'opt3_q2eb', text: 'Diode' },
  { id: 'opt4_q2eb', text: 'Inductor' },
];
testData.electronics.topics[1].questions[0].options = [
    { id: 'opt1_q1et', text: 'Basic Junction Transducer' },
    { id: 'opt2_q1et', text: 'Bipolar Junction Transistor' },
    { id: 'opt3_q1et', text: 'Balanced Joint Transformer' },
    { id: 'opt4_q1et', text: 'Broadband Junction Terminal' },
];
testData['software-development'].topics[0].questions[0].options = [
    { id: 'opt1_q1sdf', text: 'A fixed value' },
    { id: 'opt2_q1sdf', text: 'A named storage location for data' },
    { id: 'opt3_q1sdf', text: 'A type of function' },
    { id: 'opt4_q1sdf', text: 'A loop construct' },
];
testData['software-development'].topics[1].questions[0].options = [
    { id: 'opt1_q1sdvcs', text: 'JPEG' },
    { id: 'opt2_q1sdvcs', text: 'Docker' },
    { id: 'opt3_q1sdvcs', text: 'Git' },
    { id: 'opt4_q1sdvcs', text: 'Apache Kafka' },
];