/**
 * Transcribed from the QCTO interim Statement of Results.
 *
 * The source PDF carries an ID number and is deliberately not published or
 * linked anywhere on the site. Only the qualification and module results are
 * reproduced here.
 */
export interface Module {
  code: string;
  name: string;
  credits: number;
  nqf: number;
  /** The two recorded marks, in the order the statement lists them. */
  marks: [number, number];
  outcome: "C" | "NYC";
  note?: string;
}

export const qualification = {
  title: "Occupational Certificate: Software Engineer",
  saqaId: "119458",
  credits: 240,
  nqf: 6,
  institution: "AIE — Academic Institute of Excellence",
  /** Interim: the qualification is still in progress. */
  interim: true,
};

export const knowledgeModules: Module[] = [
  {
    code: "SOEN-KM01",
    name: "Software Engineering",
    credits: 20,
    nqf: 6,
    marks: [71, 91],
    outcome: "C",
  },
  {
    code: "SOEN-KM02",
    name: "Programming",
    credits: 20,
    nqf: 6,
    marks: [96, 100],
    outcome: "C",
  },
  {
    code: "SOEN-KM03",
    name: "Database Design and Information Systems",
    credits: 15,
    nqf: 6,
    marks: [84, 96],
    outcome: "C",
  },
  {
    code: "SOEN-KM04",
    name: "Fundamentals of Project Management in Software Engineering",
    credits: 5,
    nqf: 5,
    marks: [90, 83],
    outcome: "C",
  },
  {
    code: "SOEN-KM05",
    name: "Digital and Business Mathematics",
    credits: 15,
    nqf: 5,
    marks: [92, 100],
    outcome: "C",
  },
];

export const practicalModules: Module[] = [
  {
    code: "SWE-PM-01",
    name: "Document System Design",
    credits: 25,
    nqf: 6,
    marks: [76, 93],
    outcome: "C",
  },
  {
    code: "SWE-PM-02",
    name: "Design and Manipulate Databases",
    credits: 5,
    nqf: 5,
    marks: [90, 90],
    outcome: "C",
  },
  {
    code: "SWE-PM-03",
    name: "Program and Deploy Applications",
    credits: 25,
    nqf: 6,
    marks: [69, 88],
    outcome: "C",
  },
  {
    code: "SWE-PM-04",
    name: "Test or Debug Source Code to Meet Client Needs",
    credits: 15,
    nqf: 5,
    marks: [0, 92],
    outcome: "NYC",
    note: "Resubmission required",
  },
];
