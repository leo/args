declare var args: Args.API;
export = args;

declare namespace Args {
    export interface IMinimistUnknownFunction {
        (param: string): boolean
    }

    export interface IMinimistArguments {
        string?: string | string[];
        boolean?: boolean | string | string[];
        alias?: any;
        default?: any;
        stopEarly?: boolean;
        "--"?: boolean;
        unknown?: IMinimistUnknownFunction;
    }

    export interface IOptionInitFunction {
        (value: any): void;
    }

    export interface ICommandInitFunction {
        (name: string, sub: {}[], options: {}[]): void;
    }

    export interface IUsageFilterFunction {
        (output: any): any;
    }

    export interface IConfiguration {
        help?: boolean;
        name?: string;
        version?: boolean;
        usageFilter?: IUsageFilterFunction;
        value?: string;
        minimist?: IMinimistArguments;
    }

    export interface IOption {
        name: string;
        description: string;
        init?: IOptionInitFunction;
        defaultValue?: any;
    }

    export interface API {
        sub: string[],

        option(name: string, description: string, defaultValue?: any, init?: IOptionInitFunction): void,
        options(list: IOption[]): void,
        command(name: string, description: string, init?: ICommandInitFunction, aliases?: string[]): void,
        parse(argv: string[], options: IConfiguration): void,
        showHelp(): void,
    }
}
