"use client";

import React from "react";
import ReactHtmlParser from "html-react-parser";

interface RichTextRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders HTML content produced by the Quill rich-text editor.
 * Uses html-react-parser (same as product descriptions) to avoid
 * &nbsp; characters causing odd word breaks with dangerouslySetInnerHTML.
 */
const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  content,
  className = "",
}) => {
  return (
    <div className={`rich-text ${className}`}>
      {ReactHtmlParser(content.replace(/&nbsp;/g, " "))}
    </div>
  );
};

export default RichTextRenderer;
