import React from "react";
import axios from "axios";
import Loader from "./Loader";
import Message from "./Message";

// TODO: FIX THIS. NOT WORKING
/*
    Upon user input => only scan new links
    Upon loaded with existent links => not scan
 */
const virusTotal = ({
    isVerifyReport,
    setIsSendingURL,
    virusTotalURL,
    virusTotalAPIKey,
    linksG,
    setScanID,
    setIsGettingResult,
    setScanResult,
    setIsVerifyReport,
    setBadLink,
}) => {
    const verifyURLs = async () => {
        // Sending URL to Virus Total API
        setIsSendingURL(true);
        let scanID = "";
        let scanResult = "";
        let badLink = undefined;

        const options = {
            method: "POST",
            url: virusTotalURL,
            headers: {
                accept: "application/json",
                "x-apikey": virusTotalAPIKey,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: new URLSearchParams({
                url: linksG.toString(),
            }),
        };
        try {
            await axios.request(options).then(async (response) => {
                console.log(
                    "REPORT ID: " + response.data.data.id.split("-")[1]
                );

                scanID = await response.data.data.id.split("-")[1];
                setScanID(scanID);
                setIsSendingURL(false);

                // Get Report from scanID
                setIsGettingResult(true);

                const options = {
                    method: "GET",
                    headers: {
                        accept: "application/json",
                        "x-apikey": virusTotalAPIKey,
                        "Content-Type": "application/json",
                    },
                };

                const result = await axios.get(
                    `${virusTotalURL}/${scanID}`,
                    options
                );
                scanResult = await result.data.data.attributes
                    .last_analysis_stats;
                setScanResult(scanResult);
                setIsGettingResult(false);

                // Verify result
                setIsVerifyReport(true);
                if (scanResult && scanResult.malicious > 0) {
                    badLink = true;
                    console.log("Link BAD");
                    setBadLink(true);
                    setIsVerifyReport(false);
                } else {
                    badLink = false;
                    setBadLink(false);
                    console.log("Link OK");
                    setIsVerifyReport(false);
                }
            });
        } catch (error) {
            console.error(error);
            setIsSendingURL(false);
            setIsGettingResult(false);
        }

        console.log("badLink Return: " + badLink);
        return badLink;
    };

    return (
        <>
            {isVerifyReport && <Loader size={"small"} />}
            {scanResult &&
            JSON.stringify(scanResult) !== "{}" &&
            badLink !== undefined ? (
                // Object.keys(scanResult).length > 0 &&
                badLink === true ? (
                    <Message variant={"danger"}>
                        "{links}" is malicious. Please remove or use another
                        link
                    </Message>
                ) : (
                    <Message variant={"info"}>
                        "{links}" is safe. You can use this link
                    </Message>
                )
            ) : (
                <p>"Nothing"</p>
            )}
        </>
    );
};

export default virusTotal;
