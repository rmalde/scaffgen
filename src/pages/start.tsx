import React, { useState, useEffect } from "react";
import InputForm from "@/components/scaffolds/InputForm";
import LessonInfo from "@/components/scaffolds/LessonInfo";
import Results from "@/components/scaffolds/Results";
import AllScaffolds from "@/components/scaffolds/AllScaffolds";
import BorderLinearProgress from "@/components/general/BorderLinearProgress";

import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

import axios from "axios";

import { InputData, ScaffoldProps } from "~/utils/interfaces";

export default function Start() {
  const [lessonData, setLessonData] = useState<InputData>({
    lessonObjectives: "",
    lessonStandards: "",
  });
  const [submitCount, setSubmitCount] = useState(0);
  const [activeTab, setActiveTab] = useState("illustrativeMathematics");
  const [scaffolds, setScaffolds] = useState<ScaffoldProps[]>([]);
  const [selectedScaffolds, setSelectedScaffolds] = useState<ScaffoldProps[]>(
    [],
  );
  const [scaffoldPercentLoaded, setScaffoldPercentLoaded] = useState(100);

  const [presentationLink, setPresentationLink] = useState<string | null>(null);

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Ensure the session is valid and sign in if not
    if (status === "loading") return; // Do nothing while loading

    if (!session) {
      signIn();
    }
  }, [session, status, router]);

  const handleResultsInput = (inputType: string, inputData: InputData) => {
    console.log(`Handling results input: ${inputType}`, inputData); // Log for debugging
    setLessonData({
      lessonObjectives: inputData.lessonObjectives || "",
      lessonStandards: inputData.lessonStandards || "",
    });
    setSubmitCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    // Reset lessonData when the active tab changes
    setLessonData({ lessonObjectives: "", lessonStandards: "" });
    setSubmitCount(0);
  }, [activeTab]);

  useEffect(() => {
    if (lessonData.lessonObjectives && lessonData.lessonStandards) {
      const fetchAndSetResults = async () => {
        const resultScaffolds = await Results(
          lessonData,
          setScaffoldPercentLoaded,
        );
        setScaffolds(resultScaffolds);
      };
      fetchAndSetResults();
    }
  }, [lessonData, submitCount]);

  const handleSelectScaffold = (scaffold: ScaffoldProps) => {
    setSelectedScaffolds((prevSelectedScaffolds) => {
      if (prevSelectedScaffolds.includes(scaffold)) {
        return prevSelectedScaffolds.filter((item) => item !== scaffold);
      } else {
        return [...prevSelectedScaffolds, scaffold];
      }
    });
  };

  const handleCreatePresentation = async () => {
    if (session) {
      const accessToken = session.accessToken as string;
      const response = await axios.post("/api/createPresentation", {
        accessToken,
      });
      const newPresentationId = response.data.presentationId;

      await axios.post("/api/updatePresentation", {
        accessToken,
        presentationId: newPresentationId,
        scaffolds: selectedScaffolds,
      });

      setPresentationLink(
        `https://docs.google.com/presentation/d/${newPresentationId}/edit`,
      );
    }
  };

  return (
    <div className="max-w-hh mx-auto flex min-h-screen flex-col items-center bg-slate-100">
      <div className="container flex min-w-96 flex-col items-center gap-8 pt-10">
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
        {lessonData.lessonObjectives && lessonData.lessonStandards && (
          <div
            key="lessonInfo"
            className="mx-auto my-5 w-full md:w-10/12 lg:max-w-6xl"
          >
            <LessonInfo
              lessonObjectives={lessonData.lessonObjectives}
              lessonStandards={lessonData.lessonStandards}
            />
          </div>
        )}
        {scaffoldPercentLoaded < 100 && (
          <div className="mx-auto flex w-2/3 flex-col">
            <p className="mx-auto py-5 text-xl font-bold text-slate-700">
              Generating scaffolds...
            </p>
            <BorderLinearProgress
              key="linearProgress"
              variant="buffer"
              value={scaffoldPercentLoaded}
              valueBuffer={scaffoldPercentLoaded}
            />
          </div>
        )}
        {scaffolds.length > 0 && (
          <AllScaffolds
            scaffoldsData={scaffolds}
            onSelectScaffold={handleSelectScaffold}
            selectedScaffolds={selectedScaffolds}
          />
        )}
        <div className="mt-4 flex flex-col gap-8">
          {selectedScaffolds.length > 0 && (
            <button
              className="rounded-lg bg-rose-400 px-4 py-2.5 font-semibold text-white hover:bg-rose-300 active:bg-rose-500"
              onClick={handleCreatePresentation}
            >
              Create presentation
            </button>
          )}
          {presentationLink && (
            <a
              href={presentationLink}
              target="_blank"
              className="text-blue-500 underline"
            >
              Open your presentation
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
