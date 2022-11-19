import { type NextPage } from "next";
import Image from 'next/image';
import { useRouter } from "next/router";
import { memo, useEffect, useState } from 'react';
import { Tooltip } from "antd";
import copy from 'copy-to-clipboard';
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { ICommunityInfo } from "../../data/interfaces";
import { useContractInteractor } from "../../utils";

const DEFAULT_TEXT = 'Copy to clipboard';
const COPIED_TEXT = 'Copied';

const Communities: NextPage = memo(() => {
    const router = useRouter();
    const { viewMethod } = useContractInteractor();
    const { selector, modal, accounts, accountId } = useWalletSelector();
    const { handleSignIn } = useContractInteractor();
    const [communityInfo, setCommunityInfo] = useState<ICommunityInfo | null>();
    const [membershipKey, setMembershipKey] = useState<number>(Math.round(Math.random() * 10 ** 12));
    const [clipboardText, setClipboardText] = useState<string>(DEFAULT_TEXT);

    const handleNaviagte = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | undefined, path: string) => {
        e?.preventDefault();
        router.push(path);
    };

    const initialize = async () => {
        try {
            const communityId = router.query.communityId;
            const result: any[] = await viewMethod({
                method: "get_community",
                args: {
                    community_id: communityId
                }
            });

            const communityInfo: ICommunityInfo = {
                ...result[0],
                community_id: communityId,
                members: result[1],
                public_members: result[2]
            };

            setCommunityInfo(communityInfo);

            console.log("result", result);
        } catch (e) {
            console.log("error: ", e);
        }
    }

    useEffect(() => {
        (async () => {
            await initialize();
        })()
    }, []);

    return (
        <div className="bg-white rounded-[20px] text-[#3D3D3D] font-inter w-full max-w-[1030px]">
            <div className="px-[80px] py-[40px]">
                <div className="flex items-center gap-[50px]">
                    <div className={`w-[125px] rounded-full ${!accountId ? 'grayscale' : ''}`}>
                        {
                            communityInfo && communityInfo?.community_source_image && (
                                <Image
                                    layout="responsive"
                                    src={communityInfo?.community_source_image}
                                    alt="community_source_image"
                                    width={125}
                                    height={125}
                                />
                            )
                        }
                    </div>
                    <div className="text-left">
                        <h1 className="text-[20px] leading-10 font-extrabold font-grotesk tracking-[0.04em] mb-[15px]">{communityInfo?.community_name}</h1>
                        <h3 className="text-[16px] leading-5 font-bold">{communityInfo?.community_description}</h3>
                        <div className="mt-[15px]">
                            <h5><strong>administrator:</strong> {communityInfo?.community_owner}</h5>
                            <h5><strong>number of public:</strong> {communityInfo?.public_members && Object.keys(communityInfo?.public_members).length}</h5>
                            {accountId && (<h5><strong>private members:</strong> {communityInfo && communityInfo?.members?.length}</h5>)}
                        </div>
                    </div>
                    {accountId && (<button className="bg-[#FB40FF] text-white text-[12px] text-medium px-[50px] py-[3px] rounded-full">Share link</button>)}
                </div>

                {
                    !accountId && (
                        <div className="flex items-center gap-[50px] mt-[40px]">
                            <div className={`w-[125px]`}>
                            </div>
                            <div className="text-left">
                                <h1 className="text-[30px] text-[#3D3D3D] font-extrabold font-grotesk leading-[40px] trancking-[0.04em]">
                                    You are not authorized.<br />
                                    Please <span className="text-[#FB40FF] underline cursor-pointer" onClick={handleSignIn}>sign in</span>
                                </h1>
                            </div>
                        </div>
                    )
                }

                {
                    accountId && communityInfo && (
                        <>
                            <div className="text-left mt-[25px]">
                                <h1 className="text-[20px] leading-10 font-extrabold font-grotesk">Join community</h1>
                                <div className="flex space-x-[20px] my-[5px] items-center">
                                    <div className="flex-none w-[180px] text-[16px] font-bold">
                                        signed as:
                                    </div>
                                    <div className="flex-initial w-80">
                                        <input className="bg-[#F5F5F5] rounded-full w-full py-[5px] px-[15px]" placeholder="petya.near" />
                                    </div>
                                    <div className="flex-initial w-48">
                                        <button
                                            className="w-full main-green-bg py-[5px] rounded-full font-medium text-[16px]"
                                            onClick={(e) => handleNaviagte(e as any, `/communities/${communityInfo.community_id}/join`)}
                                        >
                                            Join
                                        </button>
                                    </div>
                                    <div className="flex-initial text-[14px] w-[125px]">
                                    </div>
                                </div>
                                <div className="flex space-x-[20px] my-[5px] items-center">
                                    <div className="flex-none w-[180px] text-[16px] font-bold">
                                        your membership key:
                                    </div>
                                    <div className="flex-initial w-80">
                                        <input
                                            className="bg-[#F5F5F5] rounded-full w-full py-[5px] px-[15px]"
                                            value={membershipKey}
                                            placeholder="default_random_value"
                                            disabled
                                        />
                                    </div>
                                    <div className="flex-initial w-48">
                                        <Tooltip placement="right" title={clipboardText}>
                                            <button
                                                className="w-full main-green-bg py-[5px] rounded-full"
                                                onClick={() => {
                                                    copy(membershipKey.toString());
                                                    setClipboardText(COPIED_TEXT);
                                                }}
                                                onMouseOut={() => {
                                                    setTimeout(() => {
                                                        setClipboardText(DEFAULT_TEXT);
                                                    }, 300);
                                                }}
                                            >
                                                Copy
                                            </button>
                                        </Tooltip>
                                    </div>
                                    <div className="flex-initial text-[14px] w-[125px]">
                                        what's memership key?
                                    </div>
                                </div>
                            </div>

                            <div className="text-left mt-[25px]">
                                <h1 className="text-[20px] leading-10 font-extrabold font-grotesk">Get proof</h1>
                                <div className="flex space-x-[20px] my-[5px] items-center">
                                    <div className="flex-none w-[180px] text-[16px] font-bold">
                                        signed as:
                                    </div>
                                    <div className="flex-initial w-80">
                                        <input className="bg-[#F5F5F5] rounded-full w-full py-[5px] px-[15px]" placeholder="petya.near" />
                                    </div>
                                    <div className="flex-initial w-48">
                                        <button
                                            className="w-full main-green-bg py-[5px] rounded-full"
                                            onClick={(e) => handleNaviagte(e as any, `/communities/${router.query.communityId}/join`)}
                                        >
                                            Get
                                        </button>
                                    </div>
                                </div>
                                <div className="flex space-x-[20px] my-[5px] items-center">
                                    <div className="flex-none w-[180px] text-[16px] font-bold">
                                        your membership key:
                                    </div>
                                    <div className="flex-initial w-80">
                                        <input className="bg-[#F5F5F5] rounded-full w-full py-[5px] px-[15px]" placeholder="default_random_value" />
                                    </div>
                                </div>
                            </div>

                            <div className="text-left mt-[25px]">
                                <h1 className="text-[20px] leading-10 font-extrabold font-grotesk">Verify proof</h1>
                                <div className="flex space-x-[20px] my-[5px] items-center">
                                    <div className="flex-none w-[180px] text-[16px] font-bold">
                                        proof:
                                    </div>
                                    <div className="flex-initial w-80">
                                        <input className="bg-[#F5F5F5] rounded-full w-full py-[5px] px-[15px]" placeholder="petya.near" />
                                    </div>
                                    <div className="flex-initial w-48">
                                        <button className="w-full main-green-bg py-[5px] rounded-full">Verify</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    );
});

export default Communities;