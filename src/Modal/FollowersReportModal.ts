import {API_DAMIAN, FETCH_API_HEADER, PER_PAGE} from "../Constant/APIConstant";
import {
    IUserAPIResponse,
    IUserAPIResponseItem,
    IUserDetailsAPIResponse
} from "../Interfaces/FollowersRepoertInterface";

const getFollowerApi = (user: string, page: number = 1): string => {
    return `${API_DAMIAN}users/${user}/followers?per_page=${PER_PAGE};page=${page}`;
}

const getUserApi = (user: string): string => {
    return `${API_DAMIAN}search/users?q=${user};per_page=10`;
}

const getUserDetailApi = (user: string): string => {
    return `${API_DAMIAN}users/${user}`;
}

export const getUsers = async (user: string): Promise<IUserAPIResponseItem[]> => {
    let data: IUserAPIResponse;
    try {
        let followerApi = getUserApi(user);
        if (localStorage.getItem(followerApi)) {
            return JSON.parse(localStorage.getItem(followerApi) || "");
        }
        const resp = await fetch(followerApi, {headers: FETCH_API_HEADER});
        if (!resp.ok) {
            return [];
        }
        data = await resp.json();
        localStorage.setItem(followerApi, JSON.stringify(data.items));
        return data.items;
    } catch (e) {
        return [];
    }
}

export const getUserDetails = async (user: string): Promise<IUserDetailsAPIResponse> => {
    let data: IUserDetailsAPIResponse;
    try {
        let followerApi = getUserDetailApi(user);
        if (localStorage.getItem(followerApi)) {
            return JSON.parse(localStorage.getItem(followerApi) || "");
        }
        const resp = await fetch(followerApi, {headers: FETCH_API_HEADER});
        if (!resp.ok) {
            throw new Error('API error with status ' + resp.status);
        }
        data = await resp.json();
        localStorage.setItem(followerApi, JSON.stringify(data));
        return data;
    } catch (e) {
        throw new Error('error: ' + e);
    }
}
const CallFollowerAPI = async (user: string, page: number): Promise<IUserAPIResponseItem[]> => {
    let data: IUserAPIResponseItem[];
    let followerApi = getFollowerApi(user, page);
    const resp = await fetch(followerApi, {headers: FETCH_API_HEADER});
    if (!resp.ok) {
        return [];
    }
    data = await resp.json();
    return data;
}
const getFullListOfFollowers = async (user: string, numberOfFollowers: number): Promise<IUserAPIResponseItem[]> => {

    let finalFollowersArray: IUserAPIResponseItem[] = [];
    try {
        const result: Promise<IUserAPIResponseItem[]>[] = [];
        let followersPages = Math.ceil(numberOfFollowers / PER_PAGE);
        for (let i = 1; i <= followersPages; i++) {
            let resp: Promise<IUserAPIResponseItem[]> = CallFollowerAPI(user, i);
            result.push(resp);
        }
        const allFollowersWithPagination: IUserAPIResponseItem[][] = await Promise.all(result);
        allFollowersWithPagination.forEach((arrayOfFollowers: IUserAPIResponseItem[]) => {
            arrayOfFollowers.forEach((follower: IUserAPIResponseItem) => {
                finalFollowersArray.push(follower);
            })
        })
    } catch (e) {
        console.log(e);
        return []
    }
    return finalFollowersArray;
}

export const getFollowers = async (user: string): Promise<IUserAPIResponseItem[]> => {
    let follower: IUserAPIResponseItem[] = [];
    try {
        let followerApi = getFollowerApi(user);
        if (localStorage.getItem(followerApi)) {
            return JSON.parse(localStorage.getItem(followerApi) || "[]");
        }
        let userDetails: IUserDetailsAPIResponse = await getUserDetails(user);
        debugger
        follower = await getFullListOfFollowers(user, userDetails.followers);
        localStorage.setItem(followerApi, JSON.stringify(follower));
    } catch (e) {
        console.log(e);
        return [];
    }
    return follower;
}

export const getListOfUserDetails = async (users: string[]) =>{
    const listOfUserDerailsPromises: Promise<IUserDetailsAPIResponse>[] = [];
    users.forEach(user => {
        let listCurrentOfUserDerailsPromises: Promise<IUserDetailsAPIResponse> = getUserDetails(user);
        listOfUserDerailsPromises.push(listCurrentOfUserDerailsPromises);
    })
    await Promise.all(listOfUserDerailsPromises);
}

export const getFollowersForListOfFollowers = async (users: string[]): Promise<IUserAPIResponseItem[][]> => {
    const listOfFollowersPromises: Promise<IUserAPIResponseItem[]>[] = [];
    await getListOfUserDetails(users);
    users.forEach(user => {
        let currentUserFollowers: Promise<IUserAPIResponseItem[]> = getFollowers(user);
        listOfFollowersPromises.push(currentUserFollowers);
    })
    return await Promise.all(listOfFollowersPromises);
}
