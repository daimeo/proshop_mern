import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Form, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { listProductDetails, updateProduct } from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";
// import { useForm } from "react-hook-form";
import TinyMCE from "../components/TinyMCE";
import * as DOMPurify from "dompurify";

// https://refine.dev/blog/how-to-multipart-file-upload-with-react-hook-form/
// https://viblo.asia/p/react-hook-form-vs-formik-Qbq5QmwR5D8
// https://viblo.asia/p/react-hook-form-xu-ly-form-de-dang-hon-bao-gio-het-RnB5pAdDKPG
// https://codesandbox.io/s/y74yf?file=/src/App.js
// Upload file to firebase with react-hook-form https://www.newline.co/@satansdeer/handling-file-fields-using-react-hook-form--93ebef46
// TODO: Upload image: Open Modal with file-picker, drag-drop file upload, image name/title, width-height, description(alt)

const ProductEditScreen = () => {
    const params = useParams();
    const productId = params.id;
    const navigate = useNavigate();

    // const {
    //     register,
    //     handleSubmit,
    //     reset,
    //     setError,
    //     control,
    //     formState: { errors },
    //     getValues,
    // } = useForm();

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState("");
    // const [image_base64, setImage_base64] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState("");
    // const [general, setGeneral] = useState("");
    // const [detail, setDetail] = useState("");
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isSuccess, setIsSuccess] = useState("");
    const [url, setURL] = useState("");
    const [maxFileSize, setMaxFileSize] = useState("");
    const [base64MaxFileSize, setBase64MaxFileSize] = useState("");
    const [virusTotalURL, setVirusTotalURL] = useState("");
    const [virusTotalAPIKey, setVirusTotalAPIKey] = useState("");
    const [generalResult, setGeneralResult] = useState("");
    const [detailResult, setDetailResult] = useState("");

    // TinyMCE
    // const [content, setContent] = useState("");
    const [linksGeneral, setLinksGeneral] = useState([]);
    const [linksDetail, setLinksDetail] = useState([]);
    const [scannedLinks, setScannedLinks] = useState([]);
    // VirusTotal
    const [scanIDGeneral, setScanIDGeneral] = useState({});
    const [scanIDDetail, setScanIDDetail] = useState({});
    const [isSendingURLGeneral, setIsSendingURLGeneral] = useState(false);
    const [isSendingURLDetail, setIsSendingURLDetail] = useState(false);
    const [isGettingResultGeneral, setIsGettingResultGeneral] = useState(false);
    const [isGettingResultDetail, setIsGettingResultDetail] = useState(false);
    const [scanResultGeneral, setScanResultGeneral] = useState({});
    const [scanResultDetail, setScanResultDetail] = useState({});
    const [isVerifyReport, setIsVerifyReport] = useState(false);
    const [badLinkGeneral, setBadLinkGeneral] = useState(false);
    const [badLinkDetail, setBadLinkDetail] = useState(false);

    const dispatch = useDispatch();

    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    const productUpdate = useSelector((state) => state.productUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = productUpdate;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const generalRef = useRef(null);
    const detailRef = useRef(null);

    // const encodedParams = new URLSearchParams();
    // encodedParams.set("url", linksGeneral.toString());

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            navigate("/admin/productlist");
        } else {
            // IIFE
            if (
                url === "" ||
                maxFileSize === "" ||
                base64MaxFileSize === "" ||
                virusTotalURL === "" ||
                virusTotalAPIKey === ""
            ) {
                (async () => {
                    const { data } = await axios.get("/api/config");
                    setURL(data.url);
                    setMaxFileSize(data.maxFileSize);
                    setBase64MaxFileSize(data.base64MaxFileSize);
                    setVirusTotalURL(data.virusTotalURL);
                    setVirusTotalAPIKey(data.virusTotalAPIKey);
                })();
            }

            // console.log("Product Detail: " + product.detail);
            // console.log("STATE EDITOR GEN: " + generalResult);

            if (!product.name || product._id !== productId) {
                dispatch(listProductDetails(productId));
            } else {
                setName(product.name);
                console.log("NAME: " + product.name);
                setPrice(product.price);
                product.image && setImage(product.image);
                // product.image_base64 && setImage_base64(product.image_base64);
                setBrand(product.brand);
                setCategory(product.category);
                setCountInStock(product.countInStock);
                setDescription(product.description);
                product.general && setGeneralResult(product.general);
                product.detail && setDetailResult(product.detail);
            }
        }
    }, [dispatch, navigate, productId, product, successUpdate, userInfo]);

    const purifyContent = async (content) => {
        return await DOMPurify.sanitize(content, {
            USE_PROFILES: { html: true },
        });
    };

    // Get user input link in TinyMCE
    const extractLinks = (content) => {
        const regex = /(?<=(href="))[^"]+(?=")/g;
        return content.match(regex) || [];
        // setLinksGeneral(extractedLinks);
        // setLinksDetail(extractedLinks);
    };

    const verifyURLsGeneral = async (linksG) => {
        // Sending URL to Virus Total API
        setIsSendingURLGeneral(true);
        let scanID = "";
        let scanResult = "";
        let badLink = false;

        const options = {
            method: "POST",
            url: virusTotalURL,
            headers: {
                accept: "application/json",
                "x-apikey": virusTotalAPIKey,
                "content-type": "application/x-www-form-urlencoded",
            },
            data: new URLSearchParams({
                // url: linksGeneral.toString(),
                url: linksG.toString(),
            }),
        };
        await axios
            .request(options)
            .then(function (response) {
                console.log(
                    "REPORT ID: " + response.data.data.id.split("-")[1]
                );
                scanID = response.data.data.id.split("-")[1];
                setScanIDGeneral(scanID);
                setIsSendingURLGeneral(false);

                // Get Report from scanID
                setIsGettingResultGeneral(true);

                const options = {
                    method: "GET",
                    headers: {
                        accept: "application/json",
                        "x-apikey": virusTotalAPIKey,
                    },
                };

                fetch(`${virusTotalURL}/${scanID}`, options)
                    .then((response) => response.json())
                    .then((response) => {
                        scanResult =
                            response.data.attributes.last_analysis_stats;
                        console.log(
                            "ScanResultGeneral: " +
                                JSON.stringify(scanResult, null, 2)
                        );
                        setScanResultGeneral(
                            response.data.attributes.last_analysis_stats
                        );
                        setIsGettingResultGeneral(false);

                        // Verify result
                        setIsVerifyReport(true);
                        // console.log(
                        //     "ScanResult: " + JSON.stringify(scanResult)
                        // );
                        if (scanResult && scanResult.malicious > 0) {
                            console.log("Link BAD");
                            badLink = true;
                            // setBadLinkGeneral(true);
                            setIsVerifyReport(false);
                        } else {
                            console.log("Link OK");
                            setIsVerifyReport(false);
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                        setIsGettingResultGeneral(false);
                    });
                // console.log("scanResult: " + JSON.stringify(scanResult, null, 2));
                return scanResult;
            })
            .catch(function (error) {
                console.error(error);
                setIsSendingURLGeneral(false);
            });

        return badLink;

        // if (scanResultGeneral && scanResultGeneral.malicious > 0) {
        //     console.log("Link BAD");
        //     setBadLinkGeneral(true);
        //     setIsVerifyReport(false);
        // } else {
        //     console.log("Link OK");
        //     setIsVerifyReport(false);
        // }
    };

    const verifyURLsDetail = async (linksD) => {
        // Sending URL to Virus Total API
        setIsSendingURLDetail(true);
        let scanID = "";
        let scanResult = {};
        let badLink = false;

        const options = {
            method: "POST",
            url: virusTotalURL,
            headers: {
                accept: "application/json",
                "x-apikey": virusTotalAPIKey,
                "content-type": "application/x-www-form-urlencoded",
            },
            data: new URLSearchParams({
                url: linksD.toString(),
            }),
        };
        await axios
            .request(options)
            .then(function (response) {
                console.log(
                    "REPORT ID: " + response.data.data.id.split("-")[1]
                );
                scanID = response.data.data.id.split("-")[1];
                // setScanIDDetail(scanID);
                setIsSendingURLDetail(false);

                // Get Report from scanID
                setIsGettingResultDetail(true);

                const options = {
                    method: "GET",
                    headers: {
                        accept: "application/json",
                        "x-apikey": virusTotalAPIKey,
                    },
                };

                fetch(`${virusTotalURL}/${scanID}`, options)
                    .then((response) => response.json())
                    .then((response) => {
                        scanResult =
                            response.data.attributes.last_analysis_stats;
                        console.log(
                            "ScanResultDetail: " +
                                // JSON.stringify(
                                //     response.data.attributes.last_analysis_stats,
                                //     null,
                                //     2
                                // )
                                JSON.stringify(scanResult)
                        );
                        setScanResultDetail(
                            response.data.attributes.last_analysis_stats
                        );
                        setIsGettingResultDetail(false);

                        // Verify result
                        setIsVerifyReport(true);
                        console.log(
                            "SCAN RESULT: " +
                                JSON.stringify(scanResult.malicious)
                        );
                        if (scanResult && scanResult.malicious > 0) {
                            console.log("Link BAD");
                            badLink = true;
                            // setBadLinkDetail(true);
                            setIsVerifyReport(false);
                        } else {
                            console.log("Link OK");
                            setIsVerifyReport(false);
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                        setIsGettingResultDetail(false);
                    });
                // console.log("scanResult: " + JSON.stringify(scanResult, null, 2));
                // return scanResult;
            })
            .catch(function (error) {
                console.error(error);
                setIsSendingURLDetail(false);
            });

        return badLink;

        // console.log(scanResultDetail.malicious);
        // console.log(scanResultDetail.malicious);
        // setIsVerifyReport(true);

        // if (scanResultDetail && scanResultDetail.malicious > 0) {
        //     console.log("Link BAD");
        //     setBadLinkDetail(true);
        //     setIsVerifyReport(false);
        // } else {
        //     console.log("Link OK");
        //     setIsVerifyReport(false);
        // }
    };

    const editorChangeHandler = async () => {
        let cleanGeneral, cleanDetail;
        console.log("Product general: " + product.general);
        console.log("Product general Result: " + generalResult);
        if (generalRef.current && generalRef.current !== "") {
            cleanGeneral = await purifyContent(generalRef.current.getContent());
            const cleanG = extractLinks(cleanGeneral);
            setLinksGeneral(cleanG);
            // console.log("CLEAN GENERAL: " + cleanG.toString());

            if (product.general !== cleanGeneral) {
                await verifyURLsGeneral(cleanG);
            }
        }

        if (detailRef.current && detailRef.current !== "") {
            cleanDetail = await purifyContent(detailRef.current.getContent());
            const cleanD = extractLinks(cleanDetail);
            setLinksDetail(cleanD);
            // console.log("CLEAN DETAIL: " + cleanD.toString());

            if (product.detail !== cleanDetail) {
                await verifyURLsDetail(cleanD);
            }
        }
    };

    const setEditorContent = async (e) => {
        e.preventDefault();
        let cleanGeneral, cleanDetail;
        if (
            generalRef.current &&
            generalRef.current !== "" &&
            generalRef.current !== product.general
        ) {
            cleanGeneral = await purifyContent(generalRef.current.getContent());
            setGeneralResult(cleanGeneral);
        }
        if (
            detailRef.current &&
            detailRef.current !== "" &&
            detailRef.current !== product.detail
        ) {
            cleanDetail = await purifyContent(detailRef.current.getContent());
            setDetailResult(cleanDetail);
        }
        return { cleanGeneral, cleanDetail };
    };

    // const setGeneralContent = (e) => {
    //     e.preventDefault();
    //     if (generalRef.current) {
    //         console.log("GENERAL: " + generalRef.current.getContent());
    //         setGeneralResult(generalRef.current.getContent());
    //     }
    // };
    // const setDetailContent = (e) => {
    //     e.preventDefault();
    //     if (detailRef.current) {
    //         console.log("DETAIL: " + detailRef.current.getContent());
    //         setDetailResult(detailRef.current.getContent());
    //     }
    // };

    const file_picker_callback = (callback, value, meta) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");

        input.addEventListener("change", (e) => {
            const file = e.target.files[0];

            const reader = new FileReader();
            reader.addEventListener("load", () => {
                /*
                  Note: Now we need to register the blob in TinyMCEs image blob
                  registry. In the next release this part hopefully won't be
                  necessary, as we are looking to handle it internally.
                */
                const id = "blobid" + new Date().getTime();
                const blobCache =
                    window.tinymce.activeEditor.editorUpload.blobCache;
                const base64 = reader.result.split(",")[1];
                const blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);

                /* call the callback and populate the Title field with the file name */
                callback(blobInfo.blobUri(), { title: file.name });
            });
            reader.readAsDataURL(file);
        });

        input.click();

        // Provide file and text for the link dialog
        // if (meta.filetype === "file") {
        //     callback("mypage.html", { text: "My text" });
        // }

        // Provide image and alt text for the image dialog
        // if (meta.filetype === "image") {
        //     callback("myimage.jpg", { alt: "My alt text" });
        // }

        // Provide alternative source and posted for the media dialog
        // if (meta.filetype === "media") {
        //     callback("movie.mp4", {
        //         source2: "alt.ogg",
        //         poster: "image.jpg",
        //     });
        // }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => {
                // console.log("called: ", reader);
                // console.log("reader.result: ", reader.result);
                // console.log("Type of reader.result: ", typeof reader.result);
                resolve(reader.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };

    // const getMaxFileSize = async () => {
    //     const { data } = await axios.get("/api/config");
    //     setMaxFileSize(data.maxFileSize);
    //     setBase64MaxFileSize(data.base64MaxFileSize);
    // };

    // console.log(getMaxFileSize());

    // const selectedFileHandler = (event) => {
    //     if (event.target.files.length > 0) {
    //         setSelectedFile(event.target.files[0]);
    //     }
    // };

    const validateFileSize = async (event) => {
        const minSize = 0; // 1MB
        const base64MaxSize = 1024 * 1024 * base64MaxFileSize; // 5MB
        const maxSize = 1024 * 1024 * maxFileSize; // 10MB
        // console.log(
        //     "MaxSize 10MB: " +
        //         maxSize +
        //         " = " +
        //         1024 +
        //         " * " +
        //         1024 +
        //         " * " +
        //         maxFileSize
        // );
        // console.log(
        //     "Base64MaxSize 5MB: " +
        //         base64MaxSize +
        //         " = " +
        //         1024 +
        //         " * " +
        //         1024 +
        //         " * " +
        //         base64MaxFileSize
        // );

        let file;
        if (event.target.files.length > 0) {
            file = event.target.files[0];
            setSelectedFile(event.target.files[0]);
        } else {
            setErrorMsg("Please choose a file");
            setIsSuccess("fail");
            return false;
        }

        console.log("FILE SIZE: " + file.size);
        // const fileSizeInBytes = file.size / (1024 * 1024);
        const fileSizeInBytes = file.size;

        if (fileSizeInBytes <= minSize) {
            setErrorMsg("File size is less than minimum limit");
            setIsSuccess("fail");
            return false;
        }
        if (fileSizeInBytes > maxSize) {
            setErrorMsg("File size is greater than maximum limit");
            setIsSuccess("fail");
            return false;
        }

        if (fileSizeInBytes <= base64MaxSize) {
            const base64 = await convertToBase64(file);
            // console.log("UPLOAD FILE: " + file);
            // console.log("BASE64: " + JSON.stringify(base64));
            // await setImage_base64(base64);
            await setImage(base64);
            setIsSuccess("base64");
            // console.log("BASE64IMG: " + image);
        }

        setErrorMsg("");
        setIsSuccess("pass");
    };

    const uploadFileHandler = async () => {
        // const file = await e.target.files[0];
        // const base64 = convertToBase64(selectedFile);
        // console.log("UPLOAD FILE: " + selectedFile);
        // console.log("BASE64: " + base64);
        // console.log("BASE64IMG: " + image_base64);
        // setImage_base64("");
        const formData = new FormData();
        formData.append("image", selectedFile);
        // console.log("FILE: " + file);
        // console.log("FILE Selected: " + selectedFile);

        setUploading(true);

        try {
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            // console.log("FORM DATA: " + formData);
            const { data } = await axios.post("/api/upload", formData, config);

            // console.log("UPLOAD DATA: " + JSON.stringify(data));
            setImage(data);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const editorHandler = async (e) => {
        const result = await setEditorContent(e);
        console.log("EDITOR RESULT: " + JSON.stringify(result.cleanGeneral));
        console.log("EDITOR RESULT: " + JSON.stringify(result.cleanDetail));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        // console.log("IS SUCCESS: " + isSuccess);
        // console.log("GENERAL RESULT: " + generalResult);
        // isSuccess === "pass" && (await uploadFileHandler());

        const result = await setEditorContent(e);

        dispatch(
            updateProduct({
                _id: productId,
                name,
                price,
                brand,
                category,
                countInStock,
                description,
                general: result.cleanGeneral,
                detail: result.cleanDetail,
                image,
                // image_base64,
            })
        );
    };

    // const onError = (error) => {
    //     console.log("ERROR:::", error);
    // };

    return (
        <>
            <Link
                to={
                    userInfo && userInfo.isAdmin
                        ? "/admin/productlist"
                        : // : userInfo.isEditor
                          // ? "/editor/productlist"
                          "/"
                }
                className="btn btn-light my-3"
            >
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && (
                    <Message variant="danger">{errorUpdate}</Message>
                )}
                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">{error}</Message>
                ) : (
                    <Form
                        onSubmit={
                            isSuccess === "pass"
                                ? uploadFileHandler &&
                                  //   handleSubmit(submitHandler, onError)
                                  // : handleSubmit(submitHandler, onError)
                                  submitHandler
                                : submitHandler
                        }
                        // onReset={reset}
                    >
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="name"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) =>
                                    setPrice(Number(e.target.value))
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="image">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter image url"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            />
                            <Form.Control
                                as={"input"}
                                type="file"
                                multiple={false}
                                label="Choose File"
                                // onChange={selectedFileHandler}
                                onChange={validateFileSize}
                                //{...register("productImage", {
                                //    required: "Please select product image",
                                //})}
                            />
                            {/*{errors.productImage && (*/}
                            {/*    <Message variant={"danger"}>*/}
                            {/*        {errors.productImage.message}*/}
                            {/*    </Message>*/}
                            {/*)}*/}
                            {uploading && <Loader />}
                            {isSuccess !== "fail" && (
                                <Message variant={"success"}>
                                    Validation successfully
                                </Message>
                            )}
                            {errorMsg && (
                                <Message variant={"danger"}>{errorMsg}</Message>
                            )}
                            <Button
                                className={"btn btn-sm"}
                                onClick={uploadFileHandler}
                                variant={"primary"}
                            >
                                Upload
                            </Button>
                            {image && isSuccess !== "fail" && (
                                <div>
                                    <Form.Label>Image Preview</Form.Label>
                                    <Image
                                        src={image}
                                        height={"200px"}
                                        alt={"Base64 image"}
                                        className={"img-fluid"}
                                    />
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group controlId="brand">
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter brand"
                                required={true}
                                isInvalid={true}
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            ></Form.Control>
                            <Form.Control.Feedback type={"invalid"}>
                                Please input Product Brand
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="countInStock">
                            <Form.Label>Count In Stock</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter countInStock"
                                value={countInStock}
                                onChange={(e) =>
                                    setCountInStock(Number(e.target.value))
                                }
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <div>
                            {/*TinyMCE*/}
                            <Form.Group
                                controlId="product-general"
                                className={"my-3"}
                            >
                                <Form.Label>Product General</Form.Label>
                                <TinyMCE
                                    url={url}
                                    editorRef={generalRef}
                                    content={product.general && generalResult}
                                    file_picker_callback={file_picker_callback}
                                    // log={setEditorContent}
                                    editorChangeHandler={editorChangeHandler}
                                />
                            </Form.Group>
                        </div>
                        <div className={"mb-3"}>
                            <ul>
                                {linksGeneral &&
                                    linksGeneral.map((link, index) => (
                                        <li key={index}>{link}</li>
                                    ))}
                            </ul>
                            <hr />
                            <div>
                                {/*<Button*/}
                                {/*    type={"button"}*/}
                                {/*    variant={"primary"}*/}
                                {/*    onClick={sendLinkToVirusTotalAPIGeneral}*/}
                                {/*>*/}
                                {/*    Scan Link*/}
                                {/*</Button>*/}
                                <h4>Scan ID</h4>
                            </div>
                            <div>
                                {isSendingURLGeneral && !scanIDGeneral ? (
                                    <>
                                        <p>Scanning...</p>{" "}
                                        <Loader size={"small"} />{" "}
                                    </>
                                ) : (
                                    <pre>
                                        {JSON.stringify(scanIDGeneral, null, 2)}
                                    </pre>
                                )}
                            </div>
                            <hr />
                            <div>
                                {/*<Button*/}
                                {/*    type={"button"}*/}
                                {/*    variant={"primary"}*/}
                                {/*    onClick={getVirusTotalReportGeneral}*/}
                                {/*>*/}
                                {/*    Get Scan Result General*/}
                                {/*</Button>*/}
                                <h4>Scan Result</h4>
                            </div>
                            <div>
                                {isGettingResultGeneral ? (
                                    <>
                                        <p>Scanning...</p>{" "}
                                        <Loader size={"small"} />{" "}
                                    </>
                                ) : (
                                    <pre>
                                        {JSON.stringify(
                                            scanResultGeneral,
                                            null,
                                            2
                                        )}
                                    </pre>
                                )}
                            </div>
                            <hr />
                            {isVerifyReport && <Loader size={"small"} />}
                            {linksGeneral && badLinkGeneral === true ? (
                                <Message variant={"danger"}>
                                    "{linksGeneral}" is malicious. Please remove
                                    or use another link
                                </Message>
                            ) : (
                                <Message variant={"info"}>
                                    "<strong>{linksGeneral}</strong>" is safe.
                                    You can use this link
                                </Message>
                            )}
                            <Button
                                type={"button"}
                                variant={"primary"}
                                onClick={verifyURLsGeneral}
                                className={"mb-3"}
                            >
                                Verify Links
                            </Button>
                        </div>

                        <div>
                            {/*TinyMCE*/}
                            <Form.Group
                                controlId="product-detail"
                                className={"my-3"}
                            >
                                <Form.Label>Product Detail</Form.Label>
                                <TinyMCE
                                    url={url}
                                    editorRef={detailRef}
                                    content={product.detail && detailResult}
                                    file_picker_callback={file_picker_callback}
                                    // log={setEditorContent}
                                    editorChangeHandler={editorChangeHandler}
                                />
                            </Form.Group>
                        </div>
                        <div>
                            <ul>
                                {linksDetail &&
                                    linksDetail.map((link, index) => (
                                        <li key={index}>{link}</li>
                                    ))}
                            </ul>
                            <hr />
                            <div>
                                {/*<Button*/}
                                {/*    type={"button"}*/}
                                {/*    variant={"primary"}*/}
                                {/*    onClick={sendLinkToVirusTotalAPIDetail}*/}
                                {/*>*/}
                                {/*    Scan Link*/}
                                {/*</Button>*/}
                                <h4>Scan ID</h4>
                            </div>
                            <div>
                                {isSendingURLDetail ? (
                                    <>
                                        <p>Scanning...</p>{" "}
                                        <Loader size={"small"} />{" "}
                                    </>
                                ) : (
                                    <pre>
                                        {JSON.stringify(scanIDDetail, null, 2)}
                                    </pre>
                                )}
                            </div>
                            <hr />
                            <div>
                                {/*<Button*/}
                                {/*    type={"button"}*/}
                                {/*    variant={"primary"}*/}
                                {/*    onClick={getVirusTotalReportDetail}*/}
                                {/*>*/}
                                {/*    Get Scan Result Detail*/}
                                {/*</Button>*/}
                                <h4>Scan Result</h4>
                            </div>
                            <div>
                                {isGettingResultDetail ? (
                                    <>
                                        <p>Scanning...</p>{" "}
                                        <Loader size={"small"} />{" "}
                                    </>
                                ) : (
                                    <pre>
                                        {JSON.stringify(
                                            scanResultDetail,
                                            null,
                                            2
                                        )}
                                    </pre>
                                )}
                            </div>
                            {isVerifyReport && <Loader size={"small"} />}
                            {linksDetail && badLinkDetail === true ? (
                                <Message variant={"danger"}>
                                    "{linksDetail}" is malicious. Please remove
                                    or use another link
                                </Message>
                            ) : (
                                <Message variant={"info"}>
                                    "<strong>{linksDetail}</strong>" is safe.
                                    You can use this link
                                </Message>
                            )}
                            <Button
                                type={"button"}
                                variant={"primary"}
                                onClick={verifyURLsDetail}
                            >
                                Verify Links
                            </Button>
                        </div>

                        <div className={"mt-3"}>
                            <Button type="submit" variant="primary">
                                Update
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                onClick={editorHandler}
                                className={"mx-1"}
                            >
                                Check Editor Content
                            </Button>
                        </div>
                    </Form>
                )}
            </FormContainer>
        </>
    );
};

export default ProductEditScreen;
