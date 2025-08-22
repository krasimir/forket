import React from 'react';
type ImageProps = {
    id?: string;
    className?: string;
    isPlaceholder?: boolean;
    children?: React.ReactNode;
};
export default function Image({ id, className, isPlaceholder, children }: ImageProps) {
    if (isPlaceholder) {
        return (<div className={"rel grid p1 card " + (className || "")} style={{
            gridTemplateColumns: "1fr 4fr"
        }}>
        <div className="image-placeholder"></div>
        <div className="px1">{generateFakeText()}</div>
      </div>);
    }
    return (<div className={"rel grid p1 card " + (className || "")} style={{
        gridTemplateColumns: "1fr 4fr"
    }}>
      <div className="lh0">
        <a href={`/image/${id}`} target="_blank">
          <img src={`/image/${id}`} alt="Uploaded content" className="image-fit"/>
        </a>
      </div>
      <div className="px1">{children}</div>
    </div>);
}
function generateFakeText(lines = 10) {
    const text: string[] = [];
    for(let i = 0; i < lines; i++){
        text.push("----- --------------- - ------ --- -----------");
    }
    return <span className="op05">{text.join("")}</span>;
}
