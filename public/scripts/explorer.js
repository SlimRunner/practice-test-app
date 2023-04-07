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
  const answersDiv = document.getElementById("answers");
  const speakCheck = document.getElementById("speakit");

  let test;
  let testFlat;
  let index = 0;
  let iter = new CycList({start: 0, finish: 0});

  questionDiv.addEventListener("click", () => {
    playQuestion();
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
        changeQuestion(0);
      })
      .catch(e => console.warn(e));
  });

  container.addEventListener("click", (evt) => {
    if (evt.target.isSameNode(container)) {
      answersDiv.classList.remove("hidden");
    }
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

  function changeQuestion(delta) {
    // index = mod(index + delta, testFlat.length);
    if (delta > 0) index = iter.next();
    else if (delta < 0) index = iter.prev();
    else index = iter.current();
    
    answersDiv.classList.add("hidden");
    let {
      title,
      subtitle,
      question,
      answer,
      type
    } = testFlat[index];
    if (speakCheck.checked) speakOutLoud(question);
    sectionDiv.innerText = `[${index}]. ${title}: ${subtitle}`;
    questionDiv.innerText = question;
    answersDiv.innerHTML = (
      type === "single-direct" ?
      `<p>${answer}</p>` :
      `<ul>${answer.map(s=>`<li>${s}</li>`).join("\n")}</ul>`
    );
  }
}());