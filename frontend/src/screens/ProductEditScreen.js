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

    const [config, setConfig] = useState({});

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
    // const [url, setURL] = useState("");
    // const [maxFileSize, setMaxFileSize] = useState("");
    // const [base64MaxFileSize, setBase64MaxFileSize] = useState("");
    // const [virusTotalURL, setVirusTotalURL] = useState("");
    // const [virusTotalAPIKey, setVirusTotalAPIKey] = useState("");
    const [generalResult, setGeneralResult] = useState("");
    const [detailResult, setDetailResult] = useState("");

    // TinyMCE
    // const [content, setContent] = useState("");
    const [linksGeneral, setLinksGeneral] = useState({});
    const [linksDetail, setLinksDetail] = useState({});
    const [totalLinksG, setTotalLinksG] = useState("");
    const [totalLinksD, setTotalLinksD] = useState("");

    // VirusTotal
    const [scanIDGeneral, setScanIDGeneral] = useState({});
    const [scanIDDetail, setScanIDDetail] = useState({});
    const [isSendingURLGeneral, setIsSendingURLGeneral] = useState(false);
    const [isSendingURLDetail, setIsSendingURLDetail] = useState(false);
    const [isGettingResultGeneral, setIsGettingResultGeneral] = useState(false);
    const [isGettingResultDetail, setIsGettingResultDetail] = useState(false);
    const [scanResultGeneral, setScanResultGeneral] = useState({});
    const [scanResultDetail, setScanResultDetail] = useState({});
    // const [isVerifyReport, setIsVerifyReport] = useState(false);
    // TODO: Create child schema inside Product to store links: productId, scanned, bad, good, userInserted, dateInserted
    // TODO: Status Pending for Review for products that have more than 4 links
    const [badLinksGeneral, setBadLinksGeneral] = useState([]);
    const [goodLinksGeneral, setGoodLinksGeneral] = useState([]);
    const [badLinksDetail, setBadLinksDetail] = useState([]);
    const [goodLinksDetail, setGoodLinksDetail] = useState([]);
    const [scannedLinks, setScannedLinks] = useState(new Set());

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

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            navigate("/admin/productlist");
        } else {
            // IIFE
            // if (
            // url === "" ||
            // maxFileSize === "" ||
            // base64MaxFileSize === "" ||
            // virusTotalURL === "" ||
            // virusTotalAPIKey === ""
            // ) {
            //     (async () => {
            //         const { data } = await axios.get("/api/config");
            // setURL(data.url);
            // setMaxFileSize(data.maxFileSize);
            // setBase64MaxFileSize(data.base64MaxFileSize);
            // setVirusTotalURL(data.virusTotalURL);
            // setVirusTotalAPIKey(data.virusTotalAPIKey);
            // })();
            // }

            if (Object.keys(config).length === 0) {
                axios.get("/api/config").then((response) => {
                    // console.log(
                    //     "RESPONSE DATA CONFIG: " +
                    //         JSON.stringify(response.data, null, 2)
                    // );
                    setConfig(response.data);
                });
            }

            // console.log("Product Detail: " + product.detail);
            // console.log("STATE EDITOR GEN: " + generalResult);

            if (!product.name || product._id !== productId) {
                dispatch(listProductDetails(productId));
            } else {
                setName(product.name);
                // console.log("NAME: " + product.name);
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
    }, [
        dispatch,
        navigate,
        productId,
        product,
        successUpdate,
        userInfo,
        // base64MaxFileSize,
        // maxFileSize,
        // url,
        // virusTotalAPIKey,
        // virusTotalURL,
        config,
        setConfig,
    ]);

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

    /*
        Check for Analysis Report from the self link for status complete
        If not recall after a set delay
     */
    const checkResultGeneral = async (
        analysesLink,
        getResultOptions,
        scanResult,
        link
    ) => {
        let isResultReady = false;
        const result = await axios.get(analysesLink, getResultOptions);
        const status = result.data.data.attributes.status;
        console.log("LINK: " + link);
        console.log("STATUS: " + status);

        if (status && status === "completed") {
            // return result.data.data.attributes.stats;

            scanResult = await result.data.data.attributes.stats;
            setScanResultGeneral(scanResult);
            setIsGettingResultGeneral(false);

            if (scanResult && scanResult.malicious > 0) {
                if (badLinksGeneral && !badLinksGeneral.includes(link)) {
                    await setBadLinksGeneral((prevBadLinks) => [
                        ...prevBadLinks,
                        link,
                    ]);
                }
            } else {
                if (goodLinksGeneral && !goodLinksGeneral.includes(link)) {
                    await setGoodLinksGeneral((prevGoodLinks) => [
                        ...prevGoodLinks,
                        link,
                    ]);
                }
            }

            // // Add scanned links to Set
            // await setScannedLinks(
            //     (prevScannedLinks) =>
            //         new Set(prevScannedLinks.add(link.toString()))
            // );

            isResultReady = true;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }

        return isResultReady;
    };

    const checkResultDetail = async (
        analysesLink,
        getResultOptions,
        scanResult,
        link
    ) => {
        let isResultReady = false;
        const result = await axios.get(analysesLink, getResultOptions);
        const status = result.data.data.attributes.status;
        console.log("LINK DETAIL: " + link);
        console.log("STATUS DETAIL: " + status);

        if (status && status === "completed") {
            // return result.data.data.attributes.stats;

            scanResult = await result.data.data.attributes.stats;
            setScanResultDetail(scanResult);
            setIsGettingResultDetail(false);

            if (scanResult && scanResult.malicious > 0) {
                if (badLinksDetail && !badLinksDetail.includes(link)) {
                    await setBadLinksDetail((prevBadLinks) => [
                        ...prevBadLinks,
                        link,
                    ]);
                }
            } else {
                if (goodLinksDetail && !goodLinksDetail.includes(link)) {
                    await setGoodLinksDetail((prevGoodLinks) => [
                        ...prevGoodLinks,
                        link,
                    ]);
                }
            }

            // // Add scanned links to Set
            // await setScannedLinks(
            //     (prevScannedLinks) =>
            //         new Set(prevScannedLinks.add(link.toString()))
            // );

            isResultReady = true;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }

        return isResultReady;
    };

    /*
        Get URL Analysis Report from Scan URL using stripped ID
        This link will have more information but need to wait longer
        This function served as a backup for the checkResult function
     */
    // const getURLAnalysisReport = async (
    //     shortScanID,
    //     options,
    //     scanResult,
    //     link
    // ) => {
    //     const result = await axios.get(
    //         `${config.virusTotalURL}/${shortScanID}`,
    //         options
    //     );
    //     if (
    //         result &&
    //         result.data &&
    //         result.data.data &&
    //         result.data.data.attributes
    //     ) {
    //         scanResult = await result.data.data.attributes.last_analysis_stats;
    //         setScanResultGeneral(scanResult);
    //         setIsGettingResultGeneral(false);
    //         console.log("SCAN RESULT: " + JSON.stringify(result, null, 2));
    //
    //         // // Add scanned links to Set
    //         // await setScannedLinks(
    //         //     (prevScannedLinks) =>
    //         //         new Set(prevScannedLinks.add(link.toString()))
    //         // );
    //
    //         if (scanResult && scanResult.malicious > 0) {
    //             if (badLinksGeneral && !badLinksGeneral.includes(link)) {
    //                 await setBadLinksGeneral((prevBadLinks) => [
    //                     ...prevBadLinks,
    //                     link,
    //                 ]);
    //             }
    //         } else {
    //             if (goodLinksGeneral && !goodLinksGeneral.includes(link)) {
    //                 await setGoodLinksGeneral((prevGoodLinks) => [
    //                     ...prevGoodLinks,
    //                     link,
    //                 ]);
    //             }
    //         }
    //     } else console.error("Error fetching scan result");
    // };

    const verifyURLsGeneral = async (linksG) => {
        /*
            Set links max limit to 4 and check
            if there are more than 4 links
            then set delay time between each link
         */
        const MAX_REQUESTS_PER_MINUTE = 4;
        const DELAY_BETWEEN_REQUESTS_MS =
            Object.keys(linksG).length > 4
                ? (60 * 1000) / MAX_REQUESTS_PER_MINUTE
                : 1;

        // let fullScanID = "";
        let shortScanID = "";
        let analysesLink = "";
        let scanResult = "";

        setIsSendingURLGeneral(true);

        if (linksG.toString() !== "") {
            for (const link of linksG) {
                if (scannedLinks.has(link) || generalResult.includes(link)) {
                    /*
                        continue is used inside a loop to skip the current iteration and move to the next one.
                        It can be used with for, while, and do-while loops.
                        In this case it is used to skip a link if it's already scanned in the past and future
                     */
                    continue;
                }

                // Add scanned links to Set
                await setScannedLinks(
                    (prevScannedLinks) =>
                        new Set(prevScannedLinks.add(link.toString()))
                );

                const sendRequestOptions = {
                    method: "POST",
                    url: config.virusTotalURL,
                    headers: {
                        accept: "application/json",
                        "x-apikey": config.virusTotalAPIKey,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    data: new URLSearchParams({
                        url: link && link.toString(),
                    }),
                };

                try {
                    // Sending URL to Virus Total API
                    const sendRequest = await axios.request(sendRequestOptions);
                    // console.log(
                    //     "sendRequest: " + JSON.stringify(sendRequest, null, 2)
                    // );
                    console.log("SEND REPORT ID: " + sendRequest.data.data.id);
                    console.log(
                        "RESPONSE SELF LINK: " +
                            JSON.stringify(
                                sendRequest.data.data.links.self,
                                null,
                                2
                            )
                    );

                    // fullScanID = await response.data.data.id;
                    shortScanID = await sendRequest.data.data.id.split("-")[1];
                    analysesLink = await sendRequest.data.data.links.self;
                    setScanIDGeneral(shortScanID);
                    setIsSendingURLGeneral(false);

                    // Get Report from scanID
                    setIsGettingResultGeneral(true);

                    const getResultOptions = {
                        method: "GET",
                        headers: {
                            accept: "application/json",
                            "x-apikey": config.virusTotalAPIKey,
                            "Content-Type": "application/json",
                        },
                    };

                    let isResultReady = false;

                    while (!isResultReady) {
                        /*
                        // const result = await axios.get(
                        //     analysesLink,
                        //     getResultOptions
                        // );
                        // const status = result.data.data.attributes.status;
                        // console.log("LINK: " + link);
                        // console.log("STATUS: " + status);
                        //
                        // if (status && status === "completed") {
                        //     // return result.data.data.attributes.stats;
                        //
                        //     scanResult = await result.data.data.attributes
                        //         .stats;
                        //     setScanResultGeneral(scanResult);
                        //     setIsGettingResultGeneral(false);
                        //
                        //     if (scanResult && scanResult.malicious > 0) {
                        //         if (
                        //             badLinksGeneral &&
                        //             !badLinksGeneral.includes(link)
                        //         ) {
                        //             await setBadLinksGeneral((prevBadLinks) => [
                        //                 ...prevBadLinks,
                        //                 link,
                        //             ]);
                        //         }
                        //     } else {
                        //         if (
                        //             goodLinksGeneral &&
                        //             !goodLinksGeneral.includes(link)
                        //         ) {
                        //             await setGoodLinksGeneral(
                        //                 (prevGoodLinks) => [
                        //                     ...prevGoodLinks,
                        //                     link,
                        //                 ]
                        //             );
                        //         }
                        //     }
                        //
                        //     // Add scanned links to Set
                        //     await setScannedLinks(
                        //         (prevScannedLinks) =>
                        //             new Set(
                        //                 prevScannedLinks.add(link.toString())
                        //             )
                        //     );
                        //
                        //     isResultReady = true;
                        //
                        //     // return true;
                        // } else {
                        //     await new Promise((resolve) =>
                        //         setTimeout(resolve, 5000)
                        //     );
                        // }
                         */
                        isResultReady = await checkResultGeneral(
                            analysesLink,
                            getResultOptions,
                            scanResult,
                            link
                        );
                    }

                    // Wait for 5 seconds before getting the scan result
                    // const delay = (ms) =>
                    //     new Promise((resolve) => setTimeout(resolve, ms));
                    // await delay(2000);

                    // await getURLAnalysisReport(
                    //     shortScanID,
                    //     options,
                    //     scanResult,
                    //     link
                    // );
                    // });

                    // Wait before next request
                    await new Promise((resolve) =>
                        setTimeout(resolve, DELAY_BETWEEN_REQUESTS_MS)
                    );
                } catch (error) {
                    console.error(error);

                    // Remove the link from scannedLinks set if error
                    await setScannedLinks((prevScannedLinks) => {
                        const newScannedLinks = new Set(prevScannedLinks);
                        newScannedLinks.delete(link);
                        return newScannedLinks;
                    });

                    setIsSendingURLGeneral(false);
                    setIsGettingResultGeneral(false);
                }
            }
        } else console.log("no linksG");
    };

    /*
    // const verifyURLsGeneral = async (linksG) => {
    //     // Sending URL to Virus Total API
    //     setIsSendingURLGeneral(true);
    //     let scanID = "";
    //     let scanResult = "";
    //     let badLink = undefined;
    //
    //     const options = {
    //         method: "POST",
    //         headers: {
    //             accept: "application/json",
    //             "x-apikey": config.virusTotalAPIKey,
    //             "Content-Type": "application/x-www-form-urlencoded",
    //         },
    //         body: new URLSearchParams({
    //             url: linksG.toString(),
    //         }),
    //     };
    //
    //     await fetch(virusTotalURL, options)
    //         .then(async (response) => {
    //             const data = await response.json();
    //             console.log("REPORT ID: " + data.data.id.split("-")[1]);
    //             scanID = data.data.id.split("-")[1];
    //             setScanIDGeneral(scanID);
    //             setIsSendingURLGeneral(false);
    //
    //             // Get Report from scanID
    //             setIsGettingResultGeneral(true);
    //
    //             const options = {
    //                 method: "GET",
    //                 headers: {
    //                     accept: "application/json",
    //                     "x-apikey": config.virusTotalAPIKey,
    //                 },
    //             };
    //
    //             await fetch(`${virusTotalURL}/${scanID}`, options)
    //                 .then(async (response) => await response.json())
    //                 .then(async (response) => {
    //                     scanResult = await response.data.attributes
    //                         .last_analysis_stats;
    //                     setScanResultGeneral(scanResult);
    //                     setIsGettingResultGeneral(false);
    //
    //                     // Verify result
    //                     setIsVerifyReport(true);
    //                     if (scanResult && scanResult.malicious > 0) {
    //                         badLink = true;
    //                         console.log("Link BAD");
    //                         setBadLinkGeneral(true);
    //                         setIsVerifyReport(false);
    //                     } else {
    //                         badLink = false;
    //                         setBadLinkGeneral(false);
    //                         console.log("Link OK");
    //                         setIsVerifyReport(false);
    //                     }
    //                 })
    //                 .catch((err) => {
    //                     console.error(err);
    //                     setIsGettingResultGeneral(false);
    //                     setIsVerifyReport(false);
    //                 });
    //         })
    //         .catch(function (error) {
    //             console.error(error);
    //             setIsSendingURLGeneral(false);
    //             setIsGettingResultGeneral(false);
    //         });
    //
    //     console.log("badLink Return: " + badLink);
    //     return badLink;
    // };
*/

    const verifyURLsDetail = async (linksD) => {
        /*
            Set links max limit to 4 and check
            if there are more than 4 links
            then set delay time between each link
         */
        const MAX_REQUESTS_PER_MINUTE = 4;
        const DELAY_BETWEEN_REQUESTS_MS =
            Object.keys(linksD).length > 4
                ? (60 * 1000) / MAX_REQUESTS_PER_MINUTE
                : 1;

        // let fullScanID = "";
        let shortScanID = "";
        let analysesLink = "";
        let scanResult = "";

        setIsSendingURLDetail(true);

        if (linksD.toString() !== "") {
            for (const link of linksD) {
                if (scannedLinks.has(link) || detailResult.includes(link)) {
                    // Skip link if already scanned (past and future)
                    continue;
                }

                // Add scanned links to Set
                await setScannedLinks(
                    (prevScannedLinks) =>
                        new Set(prevScannedLinks.add(link.toString()))
                );

                const sendRequestOptions = {
                    method: "POST",
                    url: config.virusTotalURL,
                    headers: {
                        accept: "application/json",
                        "x-apikey": config.virusTotalAPIKey,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    data: new URLSearchParams({
                        url: link && link.toString(),
                    }),
                };

                try {
                    // Sending URL to Virus Total API
                    const sendRequest = await axios.request(sendRequestOptions);
                    // console.log(
                    //     "sendRequest: " + JSON.stringify(sendRequest, null, 2)
                    // );
                    console.log("SEND REPORT ID: " + sendRequest.data.data.id);
                    console.log(
                        "RESPONSE SELF LINK: " +
                            JSON.stringify(
                                sendRequest.data.data.links.self,
                                null,
                                2
                            )
                    );

                    // fullScanID = await response.data.data.id;
                    shortScanID = await sendRequest.data.data.id.split("-")[1];
                    analysesLink = await sendRequest.data.data.links.self;
                    setScanIDDetail(shortScanID);
                    setIsSendingURLDetail(false);

                    // Get Report from scanID
                    setIsGettingResultDetail(true);

                    const getResultOptions = {
                        method: "GET",
                        headers: {
                            accept: "application/json",
                            "x-apikey": config.virusTotalAPIKey,
                            "Content-Type": "application/json",
                        },
                    };

                    let isResultReady = false;

                    while (!isResultReady) {
                        /*
                        // const result = await axios.get(
                        //     analysesLink,
                        //     getResultOptions
                        // );
                        // const status = result.data.data.attributes.status;
                        // console.log("LINK: " + link);
                        // console.log("STATUS: " + status);
                        //
                        // if (status && status === "completed") {
                        //     // return result.data.data.attributes.stats;
                        //
                        //     scanResult = await result.data.data.attributes
                        //         .stats;
                        //     setScanResultDetail(scanResult);
                        //     setIsGettingResultDetail(false);
                        //
                        //     if (scanResult && scanResult.malicious > 0) {
                        //         if (
                        //             badLinksDetail &&
                        //             !badLinksDetail.includes(link)
                        //         ) {
                        //             await setBadLinksDetail((prevBadLinks) => [
                        //                 ...prevBadLinks,
                        //                 link,
                        //             ]);
                        //         }
                        //     } else {
                        //         if (
                        //             goodLinksDetail &&
                        //             !goodLinksDetail.includes(link)
                        //         ) {
                        //             await setGoodLinksDetail(
                        //                 (prevGoodLinks) => [
                        //                     ...prevGoodLinks,
                        //                     link,
                        //                 ]
                        //             );
                        //         }
                        //     }
                        //
                        //     // Add scanned links to Set
                        //     await setScannedLinks(
                        //         (prevScannedLinks) =>
                        //             new Set(
                        //                 prevScannedLinks.add(link.toString())
                        //             )
                        //     );
                        //
                        //     isResultReady = true;
                        //
                        //     // return true;
                        // } else {
                        //     await new Promise((resolve) =>
                        //         setTimeout(resolve, 5000)
                        //     );
                        // }
                         */
                        isResultReady = await checkResultDetail(
                            analysesLink,
                            getResultOptions,
                            scanResult,
                            link
                        );
                    }

                    // Wait for 5 seconds before getting the scan result
                    // const delay = (ms) =>
                    //     new Promise((resolve) => setTimeout(resolve, ms));
                    // await delay(2000);

                    // await getURLAnalysisReport(
                    //     shortScanID,
                    //     options,
                    //     scanResult,
                    //     link
                    // );
                    // });

                    // Wait before next request
                    await new Promise((resolve) =>
                        setTimeout(resolve, DELAY_BETWEEN_REQUESTS_MS)
                    );
                } catch (error) {
                    console.error(error);

                    // Remove the link from scannedLinks set if error
                    await setScannedLinks((prevScannedLinks) => {
                        const newScannedLinks = new Set(prevScannedLinks);
                        newScannedLinks.delete(link);
                        return newScannedLinks;
                    });

                    setIsSendingURLDetail(false);
                    setIsGettingResultDetail(false);
                }
            }
        } else console.log("no linksD");
    };

    const editorChangeHandler = async () => {
        // let cleanGeneral, cleanDetail;
        // setIsBadLinkGeneral(undefined);
        // setIsBadLinkDetail(undefined);
        // console.log("product.general: " + product.general);
        // console.log("generalRef.current: " + generalRef.current);

        // TODO: Only scan if it's external links
        if (generalRef.current && generalRef.current !== "") {
            const cleanGeneral = await purifyContent(
                generalRef.current.getContent()
            );
            const linksG = await extractLinks(cleanGeneral);
            if (linksG && Object.keys(linksG).length > 0) {
                const linksGCount = await linksG.reduce((count, link) => {
                    count[link] = (count[link] || 0) + 1;
                    setTotalLinksG(linksG.length);
                    return count;
                }, {});
                await setLinksGeneral(linksGCount);
                // console.log("CLEAN GENERAL: " + linksG.toString());
            }

            // console.log("TYPE OF CLEANG: " + typeof linksG); // Object

            // let newLinksG = [];
            // const filterLinksG = (a, b) => {
            //     const links = a.filter((e) => !b.has(e));
            //     return newLinksG.push(links);
            // };

            // console.log(scannedLinks);
            // filterLinksG(linksG, scannedLinks);
            // console.log("FILTERED LINKS G: " + newLinksG);

            // let newLinksG = [];
            // newLinksG = linksG.filter((link) =>
            //     newLinksG.push(!scannedLinks.includes(link))
            // );
            //
            // console.log("FILTERED LINKS G: " + newLinksG);

            if (product.general !== cleanGeneral && linksG.toString() !== "") {
                await verifyURLsGeneral(linksG);
                // console.log("badLinksG: " + badLinksG);
                // setBadLinkGeneral(badLinksG);
            }

            if (Object.keys(linksG).length === 0) {
                setLinksGeneral([]);
                setScanIDGeneral({});
                setScanResultGeneral({});
                // setBadLinkGeneral(false);
            }
        }

        if (detailRef.current && detailRef.current !== "") {
            const cleanDetail = await purifyContent(
                detailRef.current.getContent()
            );
            const linksD = extractLinks(cleanDetail);
            if (Object.keys(linksD).length > 0) {
                const linksDCount = linksD.reduce((count, link) => {
                    count[link] = (count[link] || 0) + 1;
                    setTotalLinksD(linksD.length);
                    return count;
                }, {});
                await setLinksDetail(linksDCount);
                // console.log("CLEAN DETAIL: " + linksD.toString());
            }
            // console.log("CLEAND TOSTRING: " + linksD.toString());

            if (product.detail !== cleanDetail && linksD.toString() !== "") {
                await verifyURLsDetail(linksD);
            }
            if (Object.keys(linksD).length === 0) {
                setLinksDetail([]);
                setScanIDDetail({});
                setScanResultDetail({});
                // setBadLinkDetail(false);
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
            console.log("PURIFYING...");
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

    const showLinkG = () => {
        // console.log("TYPE OF LINKs GENERAL: " + typeof linksGeneral);
        // console.log("LINKs GENERAL: " + linksGeneral);
        // console.log("LINKs GENERAL LENGTH: " + linksGeneral.length);

        // console.log(typeof scanResultGeneral);
        // console.log(scanResultGeneral);

        // console.log("BAD LINKS ARRAY: " + badLinksGeneral);
        console.log(scannedLinks);
    };

    const showLinkD = () => {
        console.log("TYPE OF LINKs GENERAL: " + typeof linksDetail);
        console.log(linksDetail);
        console.log(linksDetail.length);

        console.log(typeof scanResultDetail);
        console.log(scanResultDetail);
    };

    const file_picker_callback = (callback, value, meta) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");

        input.addEventListener("change", (e) => {
            const file = e.target.files[0];
            const minSize = 0; // 0 Byte
            const base64MaxSize = 1024 * 1024 * config.base64MaxFileSize; // 5MB

            /*
                `file.size` is a property of the File object and returns the size of the file in bytes.
                Which can be accessed in the client-side browser to check the size of a file before it's submitted to the server.

                `.blob().size` is a method of the Response object that is returned by the fetch API when making HTTP requests.
                It returns the size of the data in the response body in bytes.
                Which can be used on the server-side to check the size of a file after it has been submitted to the server.
             */
            if (file && file.size <= minSize) {
                alert("File size must be greater than 0 Byte.");
                return;
            }

            if (file && file.size > base64MaxSize) {
                alert(
                    `File size exceeds the maximum limit of ${config.base64MaxFileSize} MB.`
                );
                return;
            }

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
        const base64MaxSize = 1024 * 1024 * config.base64MaxFileSize; // 5MB
        const maxSize = 1024 * 1024 * config.maxFileSize; // 10MB
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

    // const editorHandler = async (e) => {
    //     const result = await setEditorContent(e);
    //     console.log(
    //         "EDITOR RESULT cleanGeneral: " + JSON.stringify(result.cleanGeneral)
    //     );
    //     console.log(
    //         "EDITOR RESULT cleanDetail: " + JSON.stringify(result.cleanDetail)
    //     );
    // };

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

                        <Form.Group controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            ></Form.Control>
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
                                {/*
                                    Must check for `config.url` before rendering TinyMCE
                                    else the `url` will return undefined and errors will occur
                                */}
                                {config.url && (
                                    <TinyMCE
                                        url={config.url}
                                        editorRef={generalRef}
                                        content={
                                            product.general && generalResult
                                        }
                                        file_picker_callback={
                                            file_picker_callback
                                        }
                                        // log={setEditorContent}
                                        editorChangeHandler={
                                            editorChangeHandler
                                        }
                                    />
                                )}
                            </Form.Group>
                        </div>
                        {/*Virus Total*/}
                        <div className={"mb-3"}>
                            {/*<ul>*/}
                            {/*    {linksGeneral &&*/}
                            {/*        Object.keys(linksGeneral).length > 0 &&*/}
                            {/*        linksGeneral.map((link, index) => (*/}
                            {/*            <li key={index}>{link}</li>*/}
                            {/*        ))}*/}
                            {/*</ul>*/}
                            {linksGeneral &&
                                Object.keys(linksGeneral).length > 0 && (
                                    <>
                                        <h5>
                                            Inserted Links (Total :{" "}
                                            {totalLinksG})
                                        </h5>
                                        <ul>
                                            {Object.entries(linksGeneral).map(
                                                ([link, count]) => (
                                                    <li key={link}>
                                                        <a
                                                            href={link}
                                                            rel={
                                                                "noopener noreferrer"
                                                            }
                                                        >
                                                            {link}
                                                        </a>{" "}
                                                        :{" "}
                                                        <strong>{count}</strong>{" "}
                                                        occurrences
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </>
                                )}
                            {/*<div>*/}
                            {/*    {isSendingURLGeneral && !scanIDGeneral ? (*/}
                            {/*        <>*/}
                            {/*            <p>Scanning...</p>{" "}*/}
                            {/*            <Loader size={"small"} />{" "}*/}
                            {/*        </>*/}
                            {/*    ) : (*/}
                            {/*        scanIDGeneral &&*/}
                            {/*        Object.keys(scanIDGeneral).length > 0 && (*/}
                            {/*            <>*/}
                            {/*                <hr />*/}
                            {/*                <h4>Scan ID</h4>*/}
                            {/*                <pre>*/}
                            {/*                    {JSON.stringify(scanIDGeneral)}*/}
                            {/*                </pre>*/}
                            {/*                <hr />*/}
                            {/*            </>*/}
                            {/*        )*/}
                            {/*    )}*/}
                            {/*</div>*/}
                            {/*<div>*/}
                            {/*    {isGettingResultGeneral ? (*/}
                            {/*        <>*/}
                            {/*            <p>Scanning...</p>{" "}*/}
                            {/*            <Loader size={"small"} />{" "}*/}
                            {/*        </>*/}
                            {/*    ) : (*/}
                            {/*        <pre>*/}
                            {/*            {scanResultGeneral &&*/}
                            {/*                Object.keys(scanResultGeneral)*/}
                            {/*                    .length > 0 && (*/}
                            {/*                    <>*/}
                            {/*                        <h4>Scan Result</h4>*/}
                            {/*                        "Scanning Result is:{" "}*/}
                            {/*                        {JSON.stringify(*/}
                            {/*                            scanResultGeneral,*/}
                            {/*                            null,*/}
                            {/*                            2*/}
                            {/*                        )}*/}
                            {/*                        <hr />*/}
                            {/*                    </>*/}
                            {/*                )}*/}
                            {/*        </pre>*/}
                            {/*    )}*/}
                            {/*</div>*/}
                            {((isSendingURLGeneral && !scanIDGeneral) ||
                                isGettingResultGeneral) && (
                                <Loader size={"small"} />
                            )}
                            <>
                                {scanResultGeneral &&
                                    JSON.stringify(scanResultGeneral) !==
                                        "{}" &&
                                    badLinksGeneral.length > 0 &&
                                    badLinksGeneral.map((badLink, index) => (
                                        <Message key={index} variant={"danger"}>
                                            "{badLink}" is malicious. Please
                                            remove or use another link
                                        </Message>
                                    ))}
                                {
                                    scanResultGeneral &&
                                        JSON.stringify(scanResultGeneral) !==
                                            "{}" &&
                                        goodLinksGeneral.length > 0 &&
                                        goodLinksGeneral.map((link, index) => (
                                            <Message
                                                key={index}
                                                variant={"info"}
                                            >
                                                "{link}" is safe. You can use
                                                this link
                                            </Message>
                                        ))
                                    // : ""}
                                }
                            </>
                            <Button
                                type={"button"}
                                variant={"primary"}
                                onClick={showLinkG}
                                className={"mb-3"}
                            >
                                Show Links General
                            </Button>
                            {/*<Button*/}
                            {/*    type={"button"}*/}
                            {/*    variant={"primary"}*/}
                            {/*    onClick={verifyURLsGeneral}*/}
                            {/*    className={"mb-3"}*/}
                            {/*>*/}
                            {/*    Verify Links*/}
                            {/*</Button>*/}
                        </div>

                        <div>
                            {/*TinyMCE*/}
                            <Form.Group
                                controlId="product-detail"
                                className={"my-3"}
                            >
                                <Form.Label>Product Detail</Form.Label>
                                {config.url && (
                                    <TinyMCE
                                        url={config.url}
                                        editorRef={detailRef}
                                        content={product.detail && detailResult}
                                        file_picker_callback={
                                            file_picker_callback
                                        }
                                        // log={setEditorContent}
                                        editorChangeHandler={
                                            editorChangeHandler
                                        }
                                    />
                                )}
                            </Form.Group>
                        </div>
                        <div className={"mb-3"}>
                            {linksDetail &&
                                Object.keys(linksDetail).length > 0 && (
                                    <>
                                        <h5>
                                            Inserted Links (Total :{" "}
                                            {totalLinksD})
                                        </h5>
                                        <ul>
                                            {Object.entries(linksDetail).map(
                                                ([link, count]) => (
                                                    <li key={link}>
                                                        {link} :{" "}
                                                        <strong>{count}</strong>{" "}
                                                        occurrences
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </>
                                )}
                            {/*<div>*/}
                            {/*    {isSendingURLDetail && !scanIDDetail ? (*/}
                            {/*        <>*/}
                            {/*            <p>Scanning...</p>{" "}*/}
                            {/*            <Loader size={"small"} />{" "}*/}
                            {/*        </>*/}
                            {/*    ) : (*/}
                            {/*        scanIDDetail &&*/}
                            {/*        Object.keys(scanIDDetail).length > 0 && (*/}
                            {/*            <>*/}
                            {/*                <hr />*/}
                            {/*                <h4>Scan ID</h4>*/}
                            {/*                <pre>*/}
                            {/*                    {JSON.stringify(scanIDDetail)}*/}
                            {/*                </pre>*/}
                            {/*                <hr />*/}
                            {/*            </>*/}
                            {/*        )*/}
                            {/*    )}*/}
                            {/*</div>*/}
                            {/*<div>*/}
                            {/*    {isGettingResultDetail ? (*/}
                            {/*        <>*/}
                            {/*            <p>Scanning...</p>{" "}*/}
                            {/*            <Loader size={"small"} />{" "}*/}
                            {/*        </>*/}
                            {/*    ) : (*/}
                            {/*        <pre>*/}
                            {/*            {scanResultDetail &&*/}
                            {/*                Object.keys(scanResultDetail)*/}
                            {/*                    .length > 0 && (*/}
                            {/*                    <>*/}
                            {/*                        <h4>Scan Result</h4>*/}
                            {/*                        "Scanning Result is:{" "}*/}
                            {/*                        {JSON.stringify(*/}
                            {/*                            scanResultDetail,*/}
                            {/*                            null,*/}
                            {/*                            2*/}
                            {/*                        )}*/}
                            {/*                        <hr />*/}
                            {/*                    </>*/}
                            {/*                )}*/}
                            {/*        </pre>*/}
                            {/*    )}*/}
                            {/*</div>*/}
                            {((isSendingURLDetail && !scanIDDetail) ||
                                isGettingResultDetail) && (
                                <Loader size={"small"} />
                            )}
                            <>
                                {scanResultDetail &&
                                    JSON.stringify(scanResultDetail) !== "{}" &&
                                    badLinksDetail.length > 0 &&
                                    badLinksDetail.map((badLink, index) => (
                                        <Message key={index} variant={"danger"}>
                                            "{badLink}" is malicious. Please
                                            remove or use another link
                                        </Message>
                                    ))}
                                {
                                    scanResultDetail &&
                                        JSON.stringify(scanResultDetail) !==
                                            "{}" &&
                                        goodLinksDetail.length > 0 &&
                                        goodLinksDetail.map((link, index) => (
                                            <Message
                                                key={index}
                                                variant={"info"}
                                            >
                                                "{link}" is safe. You can use
                                                this link
                                            </Message>
                                        ))
                                    // : ""}
                                }
                            </>
                            <Button
                                type={"button"}
                                variant={"primary"}
                                onClick={showLinkD}
                                className={"mb-3"}
                            >
                                Show Links Detail
                            </Button>
                            {/*<Button*/}
                            {/*    type={"button"}*/}
                            {/*    variant={"primary"}*/}
                            {/*    onClick={verifyURLsDetail}*/}
                            {/*    className={"mb-3"}*/}
                            {/*>*/}
                            {/*    Verify Links*/}
                            {/*</Button>*/}
                        </div>

                        <div className={"mt-3"}>
                            <Button type="submit" variant="primary">
                                Update
                            </Button>
                            {/*<Button*/}
                            {/*    type="submit"*/}
                            {/*    variant="primary"*/}
                            {/*    onClick={editorHandler}*/}
                            {/*    className={"mx-1"}*/}
                            {/*>*/}
                            {/*    Check Editor Content*/}
                            {/*</Button>*/}
                        </div>
                    </Form>
                )}
            </FormContainer>
        </>
    );
};

export default ProductEditScreen;
