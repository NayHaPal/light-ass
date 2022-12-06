import React, {createContext, useContext, useState} from "react";
import {
    IFollowersReportItem,
    IFollowersReportContext,
    IUserDetailsAPIResponse
} from "../Interfaces/FollowersRepoertInterface";

const initialUser: IUserDetailsAPIResponse = {
    login: "",
    id: 0,
    node_id: "",
    avatar_url: "",
    gravatar_id: "",
    url: "",
    html_url: "",
    followers_url: "",
    following_url: "",
    gists_url: "",
    starred_url: "",
    subscriptions_url: "",
    organizations_url: "",
    repos_url: "",
    events_url: "",
    received_events_url: "",
    type: "",
    site_admin: false,
    name: "",
    company: "",
    blog: "",
    location: "",
    email: "",
    hireable: false,
    bio: "",
    twitter_username: "",
    public_repos: 0,
    public_gists: 0,
    followers: 0,
    following: 0,
    created_at: "",
    updated_at: "",
}

export const FollowersReportContext = createContext<IFollowersReportContext>(
    {
        reportsItems: [], updateReport: () => {
        },
        loading: false, updateLoading: () => {
        },
        user: initialUser, updateUser: () => {
        }
    }
);


function FollowersReportProvider(props: { children: any }) {
    const [reportsItems, setFollowersItems] = useState<IFollowersReportItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<IUserDetailsAPIResponse>(initialUser);
    const updateReport = (followersItems: IFollowersReportItem[]): void => {
        setFollowersItems(followersItems)
    }
    const updateUser = (user: IUserDetailsAPIResponse): void => {
        setUser(user)
    }
    const updateLoading = (loading: boolean): void => {
        setLoading(loading)
    }
    return <FollowersReportContext.Provider
        value={{
            reportsItems,
            updateReport,
            loading,
            updateLoading,
            user,
            updateUser
        }}>{props.children}
    </FollowersReportContext.Provider>;
}

export const useReportItems = () => useContext(FollowersReportContext).reportsItems;
export const useUpdateReport = () => useContext(FollowersReportContext).updateReport;
export const useLoading = () => useContext(FollowersReportContext).loading;
export const useUpdateLoading = () => useContext(FollowersReportContext).updateLoading;
export const useUpdateUser = () => useContext(FollowersReportContext).updateUser;


export default FollowersReportProvider;

