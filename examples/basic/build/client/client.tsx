"use client";
import React from "react";
import ReactDOMClient from "react-dom/client";
import UpdateName from "./components/server-functions-with-form-actions/UpdateName.tsx";
import UpdateMyName from "./components/server-functions-with-actions/UpdateMyName.tsx";
import CommentsComp from "./components/passing-live-promise-to-client/Comments.tsx";
import EmptyNote from "./components/importing-server-functions-from-client-components/EmptyNote.tsx";
import InspirationGenerator from "./components/how-use-client-marks-client-code/InspirationGenerator.tsx";
import FancyText from "./components/how-use-client-marks-client-code/FancyText.tsx";
import Button from "./components/creating-server-function-from-server-component/Button.tsx";
import LikeButton from "./components/calling-server-function-outside-form/LikeButton.tsx";
import Comments from "./components/async-components-with-server-components/Comments.tsx";
import Expandable from "./components/adding-interactivity-to-server-components/Expandable.tsx";
window.React = React;
window.ReactDOMClient = ReactDOMClient;
window.Expandable = Expandable;
window.Comments = Comments;
window.LikeButton = LikeButton;
window.Button = Button;
window.FancyText = FancyText;
window.InspirationGenerator = InspirationGenerator;
window.EmptyNote = EmptyNote;
window.CommentsComp = CommentsComp;
window.UpdateMyName = UpdateMyName;
window.UpdateName = UpdateName;
if (typeof window.FRSC_init === "function") {
    window.FRSC_init();
}
