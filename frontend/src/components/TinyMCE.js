import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const TinyMCE = ({
    url,
    editorRef,
    content,
    file_picker_callback,
    log,
    editorChangeHandler,
}) => {
    // window.tinymce.PluginManager.add("linkScanner", (editor, url) => {
    //     editor.on("SaveContent", (e) => {
    //         // Check all the links in the content before saving
    //         const links = e.content.match(/<a.*?href=".*?".*?>/g);
    //         if (links) {
    //             links.forEach((link) => {
    //                 // Extract the href value from the link
    //                 const href = link
    //                     .match(/href=".*?"/g)[0]
    //                     .replace(/href="/g, "")
    //                     .replace(/"/g, "");
    //
    //                 // Perform the virus scan here, for example using an API call to VirusTotal
    //                 // ...
    //
    //                 // If the link is flagged as suspicious, prevent the content from being saved
    //                 // ...
    //             });
    //         }
    //     });
    // });

    return (
        <>
            <Editor
                tinymceScriptSrc={url + "/tinymce/tinymce.min.js"}
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={content}
                init={{
                    height: 300,
                    // skin: "oxide-dark",
                    // icons: "Silver",
                    menubar: true, // prevent view Source
                    promotion: false,
                    link_default_protocol: "https",
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
                        // "linkScanner",
                    ],
                    toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "link image media | " +
                        "fullscreen preview removeformat | help",
                    content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    automatic_uploads: true,
                    file_picker_types: "image",
                    file_picker_callback: file_picker_callback,
                    mobile: {
                        menubar: false, // Disable menubar on mobile
                        promotion: false,
                    },
                    // image_title: true,
                    image_dimensions: true,
                    image_class_list: [
                        {
                            title: "Responsive",
                            value: "img-fluid", // Give the bootstrap class to the image uploaded by TinyMCE
                        },
                    ],
                    // setup: (editor) => {
                    //     editor.ui.registry.addButton("custom", {
                    //         text: "Custom pick",
                    //     });
                    // },
                    /*
                     Default valid_elements :
                        "+a[href|target=_blank|rel],+strong/b,+em/i,+u,+p[align],+ol,+ul,+li,+br,+img[src|alt=|width|height],+sub,+sup,+hr,",
                     */
                    // valid_elements:
                    //     "+a[href|target=_blank|rel=noopener noreferrer],+strong/b,+em/i,+u,+p[align],+ol,+ul,+li,+br,+img[src|alt=|width|height],+hr,+h1,+h2,+h3,+h4,+h5,+h6",
                    // extended_valid_elements: "*[style]",
                    invalid_elements:
                        "script,style,object,iframe,frame,frameset,video,audio",
                    forced_root_block: "p",
                }}
                onEditorChange={editorChangeHandler}
            />
            {/*<button onClick={log}>Log editor content</button>*/}
        </>
    );
};

export default TinyMCE;
