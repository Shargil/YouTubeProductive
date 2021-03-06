export interface channelsList {
  id?: string;
  name: string;
  author: string;
  upVotes: number;
  numOfUsers: number;
  list: Array<channel>;
}

export interface channel {
  id: string;
  name: string;
  img: string;
  subs: string;
}
