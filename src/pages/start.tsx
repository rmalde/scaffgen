import React, { useState, useEffect } from "react";
import InputForm from "@/components/scaffolds/InputForm";
import Results from "@/components/scaffolds/Results";
import { useSession } from "next-auth/react";
import axios from "axios";
// import AllScaffolds from "@/components/scaffolds/AllScaffolds";

/* 
Start.tsx Outline

1. InputForm.tsx
  - input: one of the three tabs (string)
  - output: lesson standards and lesson objectives
  - Tab structure object thing
    1. UrlTab.tsx
     - curriculum.ts
    2. StandardsTab.tsx
    3. PdfTab.tsx
     - fake function for now
    all three of these should return lesson standards and objectives
  
2. Results 
  - input: lesson standards and lesson objectives (currently LessonData variable)
  - generate AI pdfs (all the original content)
  - display other pdfs (all the original content)

*/
interface InputData {
  lessonObjectives: string;
  lessonStandards: string;
}

export default function Start() {
  const [lessonData, setLessonData] = useState({
    lessonObjective: "",
    lessonStandard: "",
  });
  const [submitCount, setSubmitCount] = useState(0);
  const [activeTab, setActiveTab] = useState("illustrativeMathematics");
  const [presentationId, setPresentationId] = useState("");

  const { data: session } = useSession();

  const handleResultsInput = (inputType: string, inputData: InputData) => {
    console.log(`Handling results input: ${inputType}`, inputData); // Log for debugging
    setLessonData({
      lessonObjective: inputData.lessonObjectives || "",
      lessonStandard: inputData.lessonStandards || "",
    });
    setSubmitCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    // Reset lessonData when the active tab changes
    setLessonData({ lessonObjective: "", lessonStandard: "" });
    setSubmitCount(0);
  }, [activeTab]);

  const createPresentation = async () => {
    if (session) {
      try {
        const response = await axios.post("/api/createPresentation", {
          accessToken: session.accessToken, // assuming accessToken is stored in session
        });
        console.log(
          "Presentation ID in createPresentation:",
          response.data.presentationId,
        );
        return response.data.presentationId;
      } catch (error) {
        console.error("Error creating presentation:", error);
      }
    }
  };

  const updatePresentation = async (newPresentationId: string) => {
    if (session) {
      try {
        console.log("Presentation ID in updatePresentation:", newPresentationId);
        const response = await axios.post("/api/updatePresentation", {
          accessToken: session.accessToken, // assuming accessToken is stored in session
          presentationId: newPresentationId,
        });
        console.log("Presentation Updated:", response.data);
      } catch (error) {
        console.error("Error updating presentation:", error);
      }
    }
  };

  const createAndUpdatePresentation = async () => {
    const newPresentationId = await createPresentation();
    setPresentationId(newPresentationId);
    await updatePresentation(newPresentationId);
  };

  return (
    <div className="max-w-hh mx-auto flex min-h-screen flex-col items-center bg-slate-100">
      <div className="container flex min-w-96 flex-col items-center gap-8 pt-10">
        <div className="flex flex-col gap-8">
          <button
            className="rounded-lg bg-rose-400 px-4 py-2.5 font-semibold text-white hover:bg-rose-300 active:bg-rose-500"
            onClick={() => createAndUpdatePresentation()}
          >
            Create presentation
          </button>
          {presentationId && (
            <a
              href={`https://docs.google.com/presentation/d/${presentationId}/edit`}
              target="_blank"
              className="text-blue-500 underline"
            >
              {`https://docs.google.com/presentation/d/${presentationId}/edit`}
            </a>
          )}
        </div>
        <h1 className="text-4xl font-bold">
          Get Curriculum-Aligned Instructional Scaffolds
        </h1>
        <p className="text-md font-normal text-gray-600">
          To get started, provide the link of the Illustrative Mathematics
          lesson you're teaching
        </p>
        <InputForm
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onResultsInput={handleResultsInput}
        />
        <Results {...lessonData} submitCount={submitCount} />
      </div>
    </div>
  );
}
