declare var compareTo: () => {
    require: string;
    scope: {
        otherModelValue: string;
    };
    link: (scope: any, element: any, attributes: any, ngModel: any) => void;
};
