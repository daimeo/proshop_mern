import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const TinyMCE = ({ url, editorRef, log, file_picker_callback }) => {
    return (
        <>
            <Editor
                tinymceScriptSrc={url + "/tinymce/tinymce.min.js"}
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue="<p>This is the initial content of the editor.</p>"
                init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "preview",
                        "help",
                        "wordcount",
                    ],
                    toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "custom | insertfile | link image media | " +
                        "removeformat | help",
                    content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    image_title: true,
                    automatic_uploads: true,
                    file_picker_types: "image",
                    file_picker_callback: file_picker_callback,
                    // setup: (editor) => {
                    //     editor.ui.registry.addButton("custom", {
                    //         text: "Custom pick",
                    //     });
                    // },
                }}
            />
            <button onClick={log}>Log editor content</button>
        </>
    );
};

export default TinyMCE;
