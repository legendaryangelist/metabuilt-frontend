import { providers, utils } from "near-api-js";
import type {
    CodeResult,
} from "near-api-js/lib/providers/provider";
import { CONTRACT_ID } from "../constants";
import { useWalletSelector } from "../contexts/WalletSelectorContext";

const BOATLOAD_OF_GAS = utils.format.parseNearAmount("0.00000000003")!;
const NO_DEPOSIT = '0';

interface IViewMethod {
    method: string;
    args?: object
}

interface ICallMethod {
    method: string;
    args?: object;
    gas?: string;
    deposit?: string;
}

export const useContractInteractor = () => {
    const { selector, modal, accounts, accountId } = useWalletSelector();

    const handleSignIn = () => {
        modal.show();
    };

    const handleSignOut = async () => {
        const wallet = await selector.wallet();

        wallet.signOut().catch((err) => {
            console.log("Failed to sign out");
            console.error(err);
        });
    };

    const viewMethod = async ({ method, args = {} }: IViewMethod) => {
        const { network } = selector.options;
        const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

        let res = await provider.query<CodeResult>({
            request_type: 'call_function',
            account_id: CONTRACT_ID,
            method_name: method,
            args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
            finality: 'optimistic',
        });

        return JSON.parse(Buffer.from(res.result).toString());
    }

    const callMethod = async ({ method, args = {}, gas = BOATLOAD_OF_GAS, deposit = NO_DEPOSIT }: ICallMethod) => {
        const { contract } = selector.store.getState();
        const wallet = await selector.wallet();

        const outcome = await wallet.signAndSendTransaction({
            signerId: accountId!,
            receiverId: contract!.contractId,
            actions: [
                {
                    type: 'FunctionCall',
                    params: {
                        methodName: method,
                        args,
                        gas,
                        deposit,
                    },
                },
            ],
        });

        return providers.getTransactionLastResult(outcome!);
    }

    return { handleSignIn, handleSignOut, viewMethod, callMethod };
}