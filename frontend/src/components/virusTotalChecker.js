import React, { useEffect } from "react";
import Loader from "./Loader";
import Message from "./Message";
import { Button } from "react-bootstrap";
import axios from "axios";

const virusTotalChecker = ({
    links,
    setScanResultGeneral,
    setIsGettingResultGeneral,
    badLinksGeneral,
    setBadLinksGeneral,
    goodLinksGeneral,
    setGoodLinksGeneral,
    setIsSendingURLGeneral,
    scannedLinks,
    generalResult,
    setScannedLinks,
    virusTotalURL,
    virusTotalAPIKey,
    setScanIDGeneral,
    linksGeneral,
    totalLinksG,
    isSendingURLGeneral,
    scanIDGeneral,
    isGettingResultGeneral,
    scanResultGeneral,
}) => {
    /*
        Check for Analysis Report from the self link for status complete
        If not recall after a set delay
     */
    const checkResult = async (
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

    /*
        Get URL Analysis Report from Scan URL using stripped ID
        This link will have more information but need to wait longer
    */
    const getURLAnalysisReport = async (
        shortScanID,
        options,
        scanResult,
        link
    ) => {
        const result = await axios.get(
            `${virusTotalURL}/${shortScanID}`,
            options
        );
        if (
            result &&
            result.data &&
            result.data.data &&
            result.data.data.attributes
        ) {
            scanResult = await result.data.data.attributes.last_analysis_stats;
            setScanResultGeneral(scanResult);
            setIsGettingResultGeneral(false);
            console.log("SCAN RESULT: " + JSON.stringify(result, null, 2));

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
        } else console.error("Error fetching scan result");
    };

    const verifyURLsGeneral = async (links) => {
        /*
            Set links max limit to 4 and check
            if there are more than 4 links
            then set delay time between each link
         */
        const MAX_REQUESTS_PER_MINUTE = 4;
        const DELAY_BETWEEN_REQUESTS_MS =
            Object.keys(links).length > 4
                ? (60 * 1000) / MAX_REQUESTS_PER_MINUTE
                : 1;

        // let fullScanID = "";
        let shortScanID = "";
        let analysesLink = "";
        let scanResult = "";

        setIsSendingURLGeneral(true);

        if (links.toString() !== "") {
            for (const link of links) {
                if (scannedLinks.has(link) || generalResult.includes(link)) {
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
                    url: virusTotalURL,
                    headers: {
                        accept: "application/json",
                        "x-apikey": virusTotalAPIKey,
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
                            "x-apikey": virusTotalAPIKey,
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
                        isResultReady = await checkResult(
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
        } else console.log("no links");
    };

    useEffect(() => {
        verifyURLsGeneral(links);
    }, [links]);
    return (
        <>
            <h3>virusTotal</h3>
            <div className={"mb-3"}>
                {linksGeneral && Object.keys(linksGeneral).length > 0 && (
                    <>
                        <h5>Inserted Links (Total : {totalLinksG})</h5>
                        <ul>
                            {Object.entries(linksGeneral).map(
                                ([link, count]) => (
                                    <li key={link}>
                                        {link} : <strong>{count}</strong>{" "}
                                        occurrences
                                    </li>
                                )
                            )}
                        </ul>
                    </>
                )}

                {((isSendingURLGeneral && !scanIDGeneral) ||
                    isGettingResultGeneral) && <Loader size={"small"} />}
                <>
                    {scanResultGeneral &&
                        JSON.stringify(scanResultGeneral) !== "{}" &&
                        badLinksGeneral.length > 0 &&
                        badLinksGeneral.map((badLink, index) => (
                            <Message key={index} variant={"danger"}>
                                "{badLink}" is malicious. Please remove or use
                                another link
                            </Message>
                        ))}
                    {scanResultGeneral &&
                        JSON.stringify(scanResultGeneral) !== "{}" &&
                        goodLinksGeneral.length > 0 &&
                        goodLinksGeneral.map((link, index) => (
                            <Message key={index} variant={"info"}>
                                "{link}" is safe. You can use this link
                            </Message>
                        ))}
                </>
                {/*<Button*/}
                {/*    type={"button"}*/}
                {/*    variant={"primary"}*/}
                {/*    onClick={showLinkG}*/}
                {/*    className={"mb-3"}*/}
                {/*>*/}
                {/*    Show Links General*/}
                {/*</Button>*/}
                {/*<Button*/}
                {/*    type={"button"}*/}
                {/*    variant={"primary"}*/}
                {/*    onClick={verifyURLsGeneral}*/}
                {/*    className={"mb-3"}*/}
                {/*>*/}
                {/*    Verify Links*/}
                {/*</Button>*/}
            </div>
        </>
    );
};

export default virusTotalChecker;
