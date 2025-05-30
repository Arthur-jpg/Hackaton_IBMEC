export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  correctOptionId: string; // ID of the correct QuestionOption
  type: 'multiple-choice'; // Can be expanded later (e.g., 'true-false', 'fill-in-the-blank')
}

export interface SubjectTest {
  name: string;
  questions: Question[];
}

export const testData: Record<string, SubjectTest> = {
  electronics: {
    name: 'Electronics Basics Test',
    questions: [
      {
        id: 'q1_elec',
        text: "What is Ohm's Law?",
        type: 'multiple-choice',
        options: [
          { id: 'opt1_q1e', text: 'V = I / R' },
          { id: 'opt2_q1e', text: 'V = I * R' },
          { id: 'opt3_q1e', text: 'I = V * R' },
          { id: 'opt4_q1e', text: 'R = V * I' },
        ],
        correctOptionId: 'opt2_q1e',
      },
      {
        id: 'q2_elec',
        text: 'Which component allows current to flow in only one direction?',
        type: 'multiple-choice',
        options: [
          { id: 'opt1_q2e', text: 'Resistor' },
          { id: 'opt2_q2e', text: 'Capacitor' },
          { id: 'opt3_q2e', text: 'Diode' },
          { id: 'opt4_q2e', text: 'Inductor' },
        ],
        correctOptionId: 'opt3_q2e',
      },
      {
        id: 'q3_elec',
        text: 'What does BJT stand for?',
        type: 'multiple-choice',
        options: [
          { id: 'opt1_q3e', text: 'Basic Junction Transducer' },
          { id: 'opt2_q3e', text: 'Bipolar Junction Transistor' },
          { id: 'opt3_q3e', text: 'Balanced Joint Transformer' },
          { id: 'opt4_q3e', text: 'Broadband Junction Terminal' },
        ],
        correctOptionId: 'opt2_q3e',
      }
    ],
  },
  'software-development': {
    name: 'Software Development Fundamentals Test',
    questions: [
      {
        id: 'q1_soft',
        text: 'What is a variable in programming?',
        type: 'multiple-choice',
        options: [
          { id: 'opt1_q1s', text: 'A fixed value' },
          { id: 'opt2_q1s', text: 'A named storage location for data' },
          { id: 'opt3_q1s', text: 'A type of function' },
          { id: 'opt4_q1s', text: 'A loop construct' },
        ],
        correctOptionId: 'opt2_q1s',
      },
      {
        id: 'q2_soft',
        text: 'Which of these is a common version control system?',
        type: 'multiple-choice',
        options: [
          { id: 'opt1_q2s', text: 'JPEG' },
          { id: 'opt2_q2s', text: 'Docker' },
          { id: 'opt3_q2s', text: 'Git' },
          { id: 'opt4_q2s', text: 'Apache Kafka' },
        ],
        correctOptionId: 'opt3_q2s',
      }
    ],
  },
  calculus: {
    name: 'Calculus Basics Test',
    questions: [
       {
        id: 'q1_calc',
        text: 'What does the derivative of a function represent?',
        type: 'multiple-choice',
        options: [
          { id: 'opt1_q1c', text: 'Area under the curve' },
          { id: 'opt2_q1c', text: 'The sum of its values' },
          { id: 'opt3_q1c', text: 'Instantaneous rate of change' },
          { id: 'opt4_q1c', text: 'The highest point of the function' },
        ],
        correctOptionId: 'opt3_q1c',
      }
    ]
  },
  'engineering-data': {
    name: 'Engineering Data Analysis Test',
     questions: [
       {
        id: 'q1_engd',
        text: 'What is the "mean" of a dataset?',
        type: 'multiple-choice',
        options: [
          { id: 'opt1_q1ed', text: 'The most frequent value' },
          { id: 'opt2_q1ed', text: 'The middle value' },
          { id: 'opt3_q1ed', text: 'The average value' },
          { id: 'opt4_q1ed', text: 'The difference between max and min' },
        ],
        correctOptionId: 'opt3_q1ed',
      }
    ]
  }
  // Add more subjects and questions as needed
};