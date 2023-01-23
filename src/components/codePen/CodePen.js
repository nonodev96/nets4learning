import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import { Controlled as ControlledEditor } from "react-codemirror2-react-17";
import { BsArrowsAngleExpand, BsArrowsAngleContract } from "react-icons/bs";
import "./CodePen.css";

export default function CodePen(props) {
  const { language, displayName, value, onChange } = props;
  const [open, setOpen] = useState(true);
  const [theme, setTheme] = useState("light");

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  function handleChange(editor, data, value) {
    onChange(value);
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
            <div className={`editor-container ${open ? "" : "collapsed"}`}>
              <div className="editor-title">
                {displayName}
                <button type="button"
                        className="expand-collapse-btn"
                        onClick={() => setOpen((prevOpen) => !prevOpen)}>
                  {open ? <BsArrowsAngleExpand/> : <BsArrowsAngleContract/>}
                </button>
                Tema del editor
                <button className="btn"
                        onClick={() => toggleTheme}>
                  Cambiar
                </button>
              </div>
              <ControlledEditor className="code-mirror-wrapper"
                                onBeforeChange={handleChange}
                                value={value}
                                options={{
                                  lineWrapping: true,
                                  lint: true,
                                  mode: language,
                                  theme: theme,
                                  lineNumbers: true,
                                }}/>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
