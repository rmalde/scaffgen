import { Content } from "@/utils/slidesFormatter";

const contentList: Content[] = [
  {
    type: "text",
    text: "Finding the Square Root of Expressions",
    width: 400,
    height: 60,
    translateX: 150,
    translateY: 20,
    textColor: "#012b1c",
    bold: true,
    fontFamily: "Nunito",
    fontSize: 40,
  },
  {
    type: "text",
    text: "Introduction",
    width: 300,
    height: 40,
    translateX: 50,
    translateY: 100,
  },
  {
    type: "shape",
    shapeType: "RECTANGLE",
    width: 500,
    height: 2,
    translateX: 50,
    translateY: 140,
    backgroundColor: "#eb9b34",
    outlineColor: "#03a9fc",
    outlineWeight: 5,
  },
  {
    type: "text",
    text: "Definition: The square root of a number is a value that, when multiplied by itself, gives the original number.",
    width: 450,
    height: 60,
    translateX: 50,
    translateY: 160,
  },
  {
    type: "shape",
    shapeType: "RECTANGLE",
    width: 400,
    height: 200,
    translateX: 50,
    translateY: 240,
    backgroundColor: "#eb9b34",
    outlineColor: "#03a9fc",
    outlineWeight: 20,
  },
  {
    type: "text",
    text: "Examples:",
    width: 200,
    height: 40,
    translateX: 60,
    translateY: 250,
  },
  {
    type: "text",
    text: "1. √25 = 5",
    width: 200,
    height: 40,
    translateX: 80,
    translateY: 290,
  },
  {
    type: "text",
    text: "2. √36 = 6",
    width: 200,
    height: 40,
    translateX: 80,
    translateY: 330,
  },
  {
    type: "text",
    text: "3. √49 = 7",
    width: 200,
    height: 40,
    translateX: 80,
    translateY: 370,
  },
  {
    type: "shape",
    shapeType: "RECTANGLE",
    width: 500,
    height: 2,
    translateX: 50,
    translateY: 420,
  },
  {
    type: "text",
    text: "Practice Problems:",
    width: 300,
    height: 40,
    translateX: 50,
    translateY: 450,
  },
  {
    type: "text",
    text: "1. √64 = ?",
    width: 200,
    height: 40,
    translateX: 80,
    translateY: 490,
  },
  {
    type: "text",
    text: "2. √81 = ?",
    width: 200,
    height: 40,
    translateX: 80,
    translateY: 530,
  },
  {
    type: "text",
    text: "3. √100 = ?",
    width: 200,
    height: 40,
    translateX: 80,
    translateY: 570,
  },
];

export default contentList;
