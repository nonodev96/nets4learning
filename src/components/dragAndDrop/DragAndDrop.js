import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 3,
  borderColor: '#b1b1b1',
  borderStyle: 'dashed',
  backgroundColor: '#e5e5e5',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};
//     border-color: rgb(177 177 177);
//     border-style: dashed;
//     background-color: rgb(229 229 229);

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};
export default function DragAndDrop(props) {
  const {
    name,
    id,
    accept,
    text,
    labelFiles = "Ficheros",
    multiple = false,
    function_DropAccepted = (files) => console.log("function_DropAccepted", { files })
  } = props

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    onDropAccepted: (files) => function_DropAccepted(files),
    accept: accept,
    multiple: multiple
  })
  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  const files = acceptedFiles.map((file, i) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ))

  return (
    <section className="container p-0">
      <div {...getRootProps({ style, name })}>
        <input id={id}
               {...getInputProps()}/>

        <p className={"mb-0"}>{text}</p>
      </div>
      <aside className={"mt-2"}>
        <p className={"text-muted"}>{labelFiles}</p>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}