import { readQuestions } from "./file-io.js";
import { speakOutLoud } from "./text-to-speech.js";
import { CycList, listIt, rangeIt, mod } from "./utils.js";

(function() {
  'use strict';
  const container = document.getElementsByClassName("content")[0];
  const nextButton = document.getElementById("next-button");
  const prevButton = document.getElementById("prev-button");
  const sectionDiv = document.getElementById("section");
  const questionDiv = document.getElementById("question");
  const questionSpan = document.getElementById("QText");
  const answersDiv = document.getElementById("answers");
  const speakCheck = document.getElementById("speak-question");
  const hideQCheck = document.getElementById("hide-question");
  const hideACheck = document.getElementById("hide-answers");

  let test;
  let testFlat;
  let index = 0;
  let iter = new CycList({start: 0, finish: 0});

  speakCheck.addEventListener("change", () => {
    if (speakCheck.checked) playQuestion();
  });

  hideQCheck.addEventListener("change", () => {
    hideQuestions(true);
  });

  hideACheck.addEventListener("change", () => {
    hideAnswers(true);
  });

  questionDiv.addEventListener("click", () => {
    playQuestion();
  });

  answersDiv.addEventListener("click", () => {
    hideAnswers(!answersDiv.classList.contains("hidden"));
  });

  window.addEventListener("load", () => {
    readQuestions("/data/civic-questions.json")
      .then(r => {
        test = r.test;
        testFlat = test
          .sections.flatMap(a =>
            a.parts.flatMap(b =>
              b.content.map(c => 
                ({title: a.title, subtitle: b.title, ...c}))));
        window.q = test;
        window.qf = testFlat;
        iter = new CycList({start: 0, finish: testFlat.length - 1, shuffled: true});
        hideQuestions(true);
        changeQuestion(0);
      })
      .catch(e => console.warn(e));
  });

  window.addEventListener("keydown", (evt) => {
    console.log(evt);
  });

  nextButton.addEventListener("click", () => {
    changeQuestion(1);
  });
  prevButton.addEventListener("click", () => {
    changeQuestion(-1);
  });

  function playQuestion() {
    let {question} = testFlat[index];
    speakOutLoud(question);
  }

  function hideQuestions(hide) {
    if (hideQCheck.checked) {
      if (hide) questionSpan.classList.add("spoiler");
      else questionSpan.classList.remove("spoiler");
    } else {
      questionSpan.classList.remove("spoiler");
    }
  }

  function hideAnswers(hide) {
    if (hideACheck.checked) {
      if (hide) {
        answersDiv.style.transition = "none";
        answersDiv.classList.add("hidden");
      } else {
        answersDiv.style.removeProperty("transition");
        answersDiv.classList.remove("hidden");
      }
    } else {
      answersDiv.style.removeProperty("transition");
      answersDiv.classList.remove("hidden");
    }
  }

  function changeQuestion(delta) {
    // index = mod(index + delta, testFlat.length);
    if (delta > 0) index = iter.next();
    else if (delta < 0) index = iter.prev();
    else index = iter.current();
    
    hideAnswers(true);
    let {
      title,
      subtitle,
      question,
      answer,
      type
    } = testFlat[index];
    if (speakCheck.checked) speakOutLoud(question);
    sectionDiv.innerText = `[${index}]. ${title}: ${subtitle}`;
    questionSpan.innerText = question;
    answersDiv.innerHTML = (
      type === "single-direct" ?
      `<p>${answer}</p>` :
      `<ul>${answer.map(s=>`<li>${s}</li>`).join("\n")}</ul>`
    );
  }
}());