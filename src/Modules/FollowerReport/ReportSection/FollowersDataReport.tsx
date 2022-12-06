import React, {useEffect} from 'react';
import '../../../App.css';
import {Card, Table} from "antd";
import {IFollowersReportItem,} from "../../../Interfaces/FollowersRepoertInterface";
import {ColumnsType} from "antd/es/table/interface";
import {useLoading, useReportItems} from "../../../Context/FollowersReportContext";
import Moment from 'react-moment';


const columns: ColumnsType<IFollowersReportItem> = [
    {
        title: 'User Name',
        key: 'userName',
        dataIndex: 'userName',
        sorter: (a, b) => {
            if (a.userName.toUpperCase() < b.userName.toUpperCase()) {
                return -1;
            }
            if (a.userName.toUpperCase() > b.userName.toUpperCase()) {
                return 1;
            }
            return 0;
        },
        render: (_, {userName, ProfileUrl, avatar}) => <div>
            <a href={ProfileUrl}>
                <img src={avatar} height={50} alt={userName}/><br/>
                {userName}</a>
        </div>,
    },
    {
        title: 'Creation Date',
        dataIndex: 'CreationDate',
        key: 'CreationDate',
        sorter: (a, b) => new Date(b.CreationDate).getTime() - new Date(a.CreationDate).getTime(),
        render: (text) => <><Moment date={text} format="YYYY/MM/DD HH:MM"/></>,
    },
    {
        title: 'Followers Rank',
        dataIndex: 'followersRank',
        key: 'followersRank',
        sorter: (a, b) => a.followersRank - b.followersRank,
        render: (text) => <span>{text}</span>,
    },
];

function FollowersDataReport() {
    const reportsItems: IFollowersReportItem[] = useReportItems();
    const loading: boolean = useLoading();
    useEffect(() => {
    }, [reportsItems])
    return (
        <Card title={"Followers List"}>
            <Table loading={loading} dataSource={reportsItems} columns={columns}/>
        </Card>

    );
}

export default FollowersDataReport;
