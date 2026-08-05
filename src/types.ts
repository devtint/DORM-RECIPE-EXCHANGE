export type Screen =
  | "splash"
  | "login"
  | "signup"
  | "otp"
  | "home"
  | "filter"
  | "recipe-detail"
  | "submit"
  | "leaderboard"
  | "saved"
  | "my-recipes"
  | "edit-recipe"
  | "profile"
  | "user-profile";

export type NavTab = "home" | "leaderboard" | "saved" | "profile";

export interface Recipe {
  id: string;
  title: string;
  photo: string;
  uploader: string;
  uploaderEmail: string;
  rating: number;
  ratingCount: number;
  cost: string;
  equipment: string;
  equipmentIcon: string;
  cuisine: string;
  ingredients: { name: string; qty: string }[];
  steps: string[];
  notes: string;
  comments: { user: string; text: string; time: string }[];
  isMine?: boolean;
}

export interface AppState {
  screen: Screen;
  screenStack: Screen[];
  savedIds: Set<string>;
  detailId: string;
  leaderTab: "week" | "month";
  searchQ: string;
  sortMode: "top" | "new";
  filterEq: string[];
  filterCuisine: string[];
  costMax: number;
  userRatings: Record<string, number>;
  localComments: Record<string, { user: string; text: string; time: string }[]>;
  email: string;
}
