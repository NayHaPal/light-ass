import React from "react"
import SearchForm from "./SearchSection/SearchForm";
import FollowersDataReport from "./ReportSection/FollowersDataReport";
import FollowersReportProvider from "../../Context/FollowersReportContext";

function FollowersReportPage() {
    return (
        <FollowersReportProvider>
            <br/>
            <SearchForm/>
            <br/>
            <FollowersDataReport/>
            <br/>
        </FollowersReportProvider>
    );

}

export default FollowersReportPage;