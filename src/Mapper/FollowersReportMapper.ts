import {IOptionType, IUserAPIResponseItem} from "../Interfaces/FollowersRepoertInterface";

export const mapUserApiToOptionLIst = (users: IUserAPIResponseItem[]): IOptionType[] => {
    const options: IOptionType[] = [];
    users.forEach((user: IUserAPIResponseItem) => {
        options.push({value: user.login});
    })
    return options;
}