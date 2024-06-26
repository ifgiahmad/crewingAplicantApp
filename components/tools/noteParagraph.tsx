import React from "react";

type NoteParagraphProps = {
  note: string;
};

const NoteParagraph: React.FC<NoteParagraphProps> = ({ note }) => {
  // Split the note string by new lines
  const noteLines = note.split("\n").filter((line) => line.trim() !== "");

  return (
    <div>
      {noteLines.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );
};

export default NoteParagraph;
