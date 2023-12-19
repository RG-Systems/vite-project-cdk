type Environment = {
    name: string;
    path: string;
    optimal: boolean;
    variables?: Record<string, string>;
};

type Account = {
    id: string;
    environments: Environment[];
}

export type Project = {
    name: string;
    accounts: Account[];
};
