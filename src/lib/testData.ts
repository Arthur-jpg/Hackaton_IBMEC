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
    subjectName: 'Eletrônica', // Already in Portuguese, no change needed
    topics: [
      {
        topicId: 'elec_basics',
        topicName: 'Conceitos Básicos de Circuitos', // Translated from 'Circuit Basics'
        questions: [
          {
            id: 'q1_elec_basics',
            text: 'O que é a Lei de Ohm?', // Translated from "What is Ohm's Law?"
            type: 'multiple-choice',
            options: [
              { id: 'opt1_q1eb', text: 'V = I / R' },
              { id: 'opt2_q1eb', text: 'V = I * R' },
              { id: 'opt3_q1eb', text: 'I = V * R' },
              { id: 'opt4_q1eb', text: 'R = V * I' },
            ],
            correctOptionId: 'opt2_q1eb',
          },
          {
            id: 'q2_elec_basics',
            text: 'Qual componente permite que a corrente flua em apenas uma direção?', // Translated from 'Which component allows current to flow in only one direction?'
            type: 'multiple-choice',
            options: [
              { id: 'opt1_q2eb', text: 'Resistor' },
              { id: 'opt2_q2eb', text: 'Capacitor' },
              { id: 'opt3_q2eb', text: 'Diodo' }, // Translated from 'Diode'
              { id: 'opt4_q2eb', text: 'Indutor' },
            ],
            correctOptionId: 'opt3_q2eb',
          },
        ],
      },
      {
        topicId: 'elec_transistors',
        topicName: 'Transistores', // Translated from 'Transistors'
        questions: [
          {
            id: 'q1_elec_transistors',
            text: 'O que significa BJT?', // Translated from 'What does BJT stand for?'
            type: 'multiple-choice',
            options: [
              { id: 'opt1_q1et', text: 'Transdutor de Junção Básica' }, // Translated from 'Basic Junction Transducer'
              { id: 'opt2_q1et', text: 'Transistor de Junção Bipolar' }, // Translated from 'Bipolar Junction Transistor'
              { id: 'opt3_q1et', text: 'Transformador de Junta Balanceada' }, // Translated from 'Balanced Joint Transformer'
              { id: 'opt4_q1et', text: 'Terminal de Junção de Banda Larga' }, // Translated from 'Broadband Junction Terminal'
            ],
            correctOptionId: 'opt2_q1et',
          },
          // Adicione mais perguntas sobre transistores
        ],
      },
    ],
  },
  'software-development': {
    subjectName: 'Desenvolvimento de Software', // Translated from 'Software Development'
    topics: [
      {
        topicId: 'sd_fundamentals',
        topicName: 'Fundamentos de Programação', // Translated from 'Programming Fundamentals'
        questions: [
          {
            id: 'q1_sd_fun',
            text: 'O que é uma variável em programação?', // Translated from 'What is a variable in programming?'
            type: 'multiple-choice',
            options: [
              { id: 'opt1_q1sdf', text: 'Um valor fixo' }, // Translated from 'A fixed value'
              { id: 'opt2_q1sdf', text: 'Um local de armazenamento nomeado para dados' }, // Translated from 'A named storage location for data'
              { id: 'opt3_q1sdf', text: 'Um tipo de função' }, // Translated from 'A type of function'
              { id: 'opt4_q1sdf', text: 'Uma estrutura de laço' }, // Translated from 'A loop construct'
            ],
            correctOptionId: 'opt2_q1sdf',
          },
          // Adicione mais perguntas fundamentais
        ],
      },
      {
        topicId: 'sd_vcs',
        topicName: 'Sistemas de Controle de Versão', // Translated from 'Version Control Systems'
        questions: [
          {
            id: 'q1_sd_vcs',
            text: 'Qual destes é um sistema de controle de versão comum?', // Translated from 'Which of these is a common version control system?'
            type: 'multiple-choice',
            options: [
              { id: 'opt1_q1sdvcs', text: 'JPEG' },
              { id: 'opt2_q1sdvcs', text: 'Docker' },
              { id: 'opt3_q1sdvcs', text: 'Git' },
              { id: 'opt4_q1sdvcs', text: 'Apache Kafka' },
            ],
            correctOptionId: 'opt3_q1sdvcs',
          },
        ],
      }
    ],
  },
  calculus: {
    subjectName: "Cálculo I", // Already in Portuguese, no change needed
    topics: [
      {
        topicId: "calc_derivatives",
        topicName: "Derivadas", // Already in Portuguese, no change needed
        questions: [
          {
            id: 'q1_calc_der',
            text: 'O que a derivada de uma função representa?', // Translated from 'What does the derivative of a function represent?'
            type: 'multiple-choice',
            options: [
              { id: 'opt1_q1cd', text: 'Área sob a curva' }, // Translated from 'Area under the curve'
              { id: 'opt2_q1cd', text: 'A soma de seus valores' }, // Translated from 'The sum of its values'
              { id: 'opt3_q1cd', text: 'Taxa de variação instantânea' }, // Translated from 'Instantaneous rate of change'
              { id: 'opt4_q1cd', text: 'O ponto mais alto da função' }, // Translated from 'The highest point of the function'
            ],
            correctOptionId: 'opt3_q1cd',
          }
        ]
      }
    ]
  },
  'engineering-data': {
    subjectName: "Dados de Engenharia", // Translated from "Engineering Data"
    topics: [
      {
        topicId: "eng_data_basics",
        topicName: "Estatísticas Básicas", // Translated from "Basic Statistics"
        questions: [
          {
            id: 'q1_engd_basics',
            text: 'O que é a "média" de um conjunto de dados?', // Translated from 'What is the "mean" of a dataset?'
            type: 'multiple-choice',
            options: [
              { id: 'opt1_q1edb', text: 'O valor mais frequente' }, // Translated from 'The most frequent value'
              { id: 'opt2_q1edb', text: 'O valor do meio' }, // Translated from 'The middle value'
              { id: 'opt3_q1edb', text: 'O valor médio' }, // Translated from 'The average value'
              { id: 'opt4_q1edb', text: 'A diferença entre o máximo e o mínimo' }, // Translated from 'The difference between max and min'
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