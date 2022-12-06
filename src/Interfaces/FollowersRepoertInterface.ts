export interface IFollowersReportItem {
    userName: string;
    avatar: string;
    ProfileUrl: string;
    CreationDate: string;
    followersRank: number;
}

export interface IFollowersReportContext {
    reportsItems: IFollowersReportItem[];
    loading: boolean;
    updateLoading: (loading: boolean) => void;
    updateReport: (FollowerItem: IFollowersReportItem[]) => void;
    user: IUserDetailsAPIResponse ,
    updateUser: (user: IUserDetailsAPIResponse) => void
}

export interface IOptionType {
    value: string;
}


export interface IUserAPIResponse {
    total_count: number;
    incomplete_results: boolean;
    items: Array<IUserAPIResponseItem>;
}

export interface IUserAPIResponseItem {
    id: number,
    site_admin: boolean;
    login: string;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    followers?: IUserAPIResponseItem[];
}

export interface IUserDetailsAPIResponse {

    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: false;
    name: string;
    company: string;
    blog: string;
    location: string;
    email: string;
    hireable: false;
    bio: string;
    twitter_username: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
}

export interface IFollowersReportForm {
    depth: number;
    user: string;
}