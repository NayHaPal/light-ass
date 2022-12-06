import React, {useCallback, useState} from 'react';
import debounce from 'lodash/debounce';
import {AutoComplete, Button, Card, Divider, Form, InputNumber, Spin} from "antd";
import {
    IFollowersReportForm,
    IFollowersReportItem,
    IOptionType,
    IUserAPIResponseItem,
    IUserDetailsAPIResponse
} from "../../../Interfaces/FollowersRepoertInterface";
import {
    getFollowers,
    getFollowersForListOfFollowers,
    getListOfUserDetails,
    getUserDetails,
    getUsers
} from "../../../Modal/FollowersReportModal";
import {mapUserApiToOptionLIst} from "../../../Mapper/FollowersReportMapper";
import {useLoading, useUpdateLoading, useUpdateReport,} from "../../../Context/FollowersReportContext";


let defaultList: IOptionType[] = [];

function SearchForm() {
    const [form] = Form.useForm();
    const [options, setOptions] = useState<IOptionType[]>(defaultList);
    const [userInputLoading, setUserInputLoading] = useState<boolean>(false);
    const [disableButton, setDisableButton] = useState<boolean>(true);
    const updateReport = useUpdateReport();
    const loading = useLoading();
    const updateLoading = useUpdateLoading();

    const onSearch = async (searchText: string) => {
        let users: IUserAPIResponseItem[] = await getUsers(searchText);
        setOptions(
            !searchText ? defaultList : mapUserApiToOptionLIst(users),
        );
        setUserInputLoading(false);
    };
    const onSelect = async () => {
        setDisableButton(false);
        setUserInputLoading(false);
    };

    const getOneUserFollowers = async (user: string, depth: number): Promise<IFollowersReportItem> => {
        let uniqueFollowers = new Set<String>();
        let queue = [];
        queue.push(user);
        let userDetails: IUserDetailsAPIResponse = await getUserDetails(user);
        if (depth === 1) {
            return {
                avatar: userDetails.avatar_url,
                CreationDate: userDetails.created_at,
                ProfileUrl: userDetails.html_url,
                userName: user,
                followersRank: userDetails.followers
            };
        }
        while (depth > 0) {
            let qSize = queue.length;
            for (let i = 0; i < qSize; i++) {
                const followers: IUserAPIResponseItem[] = await getFollowers(queue[0]);
                const listAllUsers: string[] = followers.map(user => user.login);
                if (depth > 1) {
                    await getFollowersForListOfFollowers(listAllUsers);
                }
                queue.shift();
                for (let j = 0; j < followers.length; j++) {
                    if (!uniqueFollowers.has(followers[j].login)) {
                        queue.push(followers[j].login);
                        uniqueFollowers.add(followers[j].login);
                    }
                }
            }
            depth--;
        }
        return {
            avatar: userDetails.avatar_url,
            CreationDate: userDetails.created_at,
            ProfileUrl: userDetails.html_url,
            userName: user,
            followersRank: uniqueFollowers.size
        };
    }

    const getReport = async (user: string, depth: number): Promise<IFollowersReportItem[]> => {
        try {
            updateLoading(true);
            const followers: IUserAPIResponseItem[] = await getFollowers(user);
            const listAllUsers: string[] = followers.map(user => user.login);
            listAllUsers.push(user);
            if (depth > 1) {
                await getFollowersForListOfFollowers(listAllUsers);
            }
            await getListOfUserDetails(listAllUsers);
            const result: IFollowersReportItem[] = [];
            result.push(await getOneUserFollowers(user, depth));
            for (let i = 0; i < followers.length; i++) {
                result.push(await getOneUserFollowers(followers[i].login, depth));
            }
            return result;
        } catch (e) {
            console.log(e)
            return [];
        } finally {
            updateLoading(false)
        }
    }

    const onSubmit = async (formData: IFollowersReportForm): Promise<void> => {
        let depth: number = formData.depth;
        const user: string = formData.user;
        updateReport(await getReport(user, depth));
    };

    return (
        <Card title={"Search"}>
            <Form
                layout={"inline"}
                form={form}
                initialValues={{depth: 1}}
                onFinish={onSubmit}>
                <Form.Item label="User" name={"user"} rules={[{required: true}]}
                           hasFeedback
                           validateStatus={userInputLoading ? "validating" : ""}>
                    <AutoComplete onKeyDown={() => {
                        setUserInputLoading(true)
                        setDisableButton(true)
                    }} onBlur={() => setUserInputLoading(false)} onSelect={onSelect}
                                  notFoundContent={<div>No user Found!</div>}
                                  options={options}
                                  onSearch={useCallback(debounce(onSearch, 500), [])} style={{width: 200}}/>
                </Form.Item>
                <Form.Item name={"depth"} label="Depth">
                    <InputNumber min={1} name={"depth"} max={6} defaultValue={1}/>
                </Form.Item>
                <Divider/>
                <Form.Item>
                    <Button disabled={loading || disableButton} htmlType="submit" type="primary">Search</Button>
                    {loading && <>  &nbsp;<Spin size={"small"}/></>}
                </Form.Item>
            </Form>
        </Card>

    );
}

export default SearchForm;
