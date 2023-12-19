import type { Project } from "./types";

const PROJECT_NAME = 'vite-project-ui';

export const VITE_PROJECT_UI: Project = {
    name: PROJECT_NAME,
    accounts: [
        {
            id: '503479554940',
            environments: [
                {
                    name: 'qa',
                    path: '',
                    optimal: false,
                    variables: {
                        'VITE_API_URL': 'https://qa-api.example.com',
                    },
                },
                {
                    name: 'prod',
                    path: '',
                    optimal: false,
                    variables: {
                        'VITE_API_URL': 'https://api.example.com',
                    },
                },
            ],
        },
        // {
        //     id: '503479554940',
        //     environments: [
        //         {
        //             name: 'uat',
        //             path: '',
        //             optimal: false,
        //             variables: {
        //                 'VITE_API_URL': 'https://dev-api.example.com',
        //             },
        //         },
        //         {
        //             name: 'prod',
        //             path: '',
        //             optimal: true,
        //             variables: {
        //                 'VITE_API_URL': 'https://qa-api.example.com',
        //             },
        //         },
        //     ],
        // },
    ],
};