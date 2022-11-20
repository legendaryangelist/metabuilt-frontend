import { type NextPage } from "next";
import Image from 'next/image';
import { useRouter } from "next/router";
import { memo, useEffect, useState } from 'react';
import { Spin, Tooltip } from "antd";
import copy from 'copy-to-clipboard';
import NotificationModal from "../../components/Modal";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { ICommunityInfo } from "../../data/interfaces";
import { useContractInteractor, getRandomInt, getCommitment, getProof, verifyProof } from "../../utils";
import { DEFAULT_TEXT, COPIED_TEXT } from "../../constants"

const Communities: NextPage = memo(() => {
    const router = useRouter();
    const { viewMethod, callMethod } = useContractInteractor();
    const { selector, modal, accounts, accountId } = useWalletSelector();
    const { handleSignIn } = useContractInteractor();
    const [communityInfo, setCommunityInfo] = useState<ICommunityInfo | null>();
    const [membershipKey, setMembershipKey] = useState<string>("");
    const [clipboardText, setClipboardText] = useState<string>(DEFAULT_TEXT);
    const [proof, setProof] = useState<string>("");
    const [messageType, setMessageType] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const handleNaviagte = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | undefined, path: string) => {
        e?.preventDefault();
        router.push(path);
    };

    const initialize = async () => {
        try {
            const randomInt = await getRandomInt();
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
            setMembershipKey(randomInt.toString());
        } catch (e) {
            console.log("error: ", e);
        }
    }

    const handleShowModal = (showModal: boolean) => {
        setShowModal(showModal);
    }

    const handleJoinCommunity = async () => {
        try {
            setIsProcessing(true);
            const commitment = await getCommitment(accountId!, membershipKey);
            if (communityInfo?.members?.includes(commitment)) {
                setIsProcessing(false);
                setMessageType("Warning");
                setMessage("Already joined member");
                setShowModal(true);

                return;
            }
            const proof = await getProof(JSON.stringify(communityInfo?.members), accountId!, membershipKey);
            setProof(proof);
            const args = { community_id: router.query.communityId, commitment };
            const rsp = await callMethod({ method: "add_member", args });
            setIsProcessing(false);

            if (rsp) {
                router.push(`/communities/${communityInfo?.community_id}/join?commitment=${commitment}&proof=${proof}`);
            } else {
                setMessageType("Error");
                setMessage("Failed to add member");
                setShowModal(true);
            }
        } catch (e) {
            console.log("join community error: ", e);
            setIsProcessing(false);
            setMessageType("Error");
            setMessage("Failed to join community");
            setShowModal(true);
        }
    }

    const handleGetProof = async () => {
        try {
            setIsProcessing(true);

            const communityMembers = JSON.stringify(communityInfo?.members);
            const commitment = await getCommitment(accountId!, membershipKey);
            const proof = await getProof(communityMembers, accountId!, membershipKey);
            const verifyProofStatus = await verifyProof(communityMembers, proof);
            setProof(proof);
            setIsProcessing(false);
            if (verifyProofStatus) {
                router.push(`/communities/${communityInfo?.community_id}/join?commitment=${commitment}&proof=${proof}`);
            } else {
                setMessageType("Error");
                setMessage("Failed to verify proof");
                setShowModal(true);
            }
        } catch (e) {
            console.log("get proof error: ", e);
            setIsProcessing(false);
            setMessageType("Error");
            setMessage("Failed to get proof");
            setShowModal(true);
        }
    }

    const handleVerifyProof = async () => {
        try {
            setIsProcessing(true);
            const communityMembers = JSON.stringify(communityInfo?.members);
            const verifyProofStatus = await verifyProof(communityMembers, proof);
            setProof(proof);
            setIsProcessing(false);
            if (verifyProofStatus) {
                setMessageType("Info");
                setMessage("Member found!");
                setShowModal(true);
            } else {
                setMessageType("Info");
                setMessage("Member not found!");
                setShowModal(true);
            }
        } catch (e) {
            console.log("verify proof error: ", e);
            setIsProcessing(false);
            setMessageType("Error");
            setMessage("Failed to verify proof");
            setShowModal(true);
        }
    }

    useEffect(() => {
        (async () => {
            await initialize();
        })()
    }, [accountId]);

    return (
        <Spin spinning={isProcessing}>
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

                    {/* Display when current user is a community owner */}
                    {
                        accountId == communityInfo?.community_owner && (
                            <>
                                {
                                    communityInfo?.badge_event_id != "" && (
                                        <>
                                            <hr className="mt-[30px] opacity-20" />
                                            <div className="flex items-center gap-[50px]">
                                                <div className={`w-[125px] rounded-full ${!accountId ? 'grayscale' : ''}`}>
                                                    {
                                                        communityInfo && communityInfo?.badge_source_image && (
                                                            <Image
                                                                layout="responsive"
                                                                src={communityInfo?.badge_source_image}
                                                                alt="badge_source_image"
                                                                width={125}
                                                                height={125}
                                                            />
                                                        )
                                                    }
                                                </div>
                                                <div className="text-left">
                                                    <h1 className="text-[20px] leading-10 font-extrabold font-grotesk tracking-[0.04em] mb-[15px]">{communityInfo?.badge_name}</h1>
                                                    <h3 className="text-[16px] leading-5 font-bold">{communityInfo?.badge_description}</h3>
                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                                <hr className="mt-[30px] opacity-20" />
                                <div className="text-left">
                                    <h1 className="text-[20px] text-[#3D3D3D] font-grotesk font-extrabold leading-[40px] tracking-[0.04em] my-[20px]">Public Members</h1>
                                    <div className="flex flex-wrap gap-[10px]">
                                        {
                                            communityInfo && communityInfo?.public_members && Object.values(communityInfo?.public_members).map((item, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="bg-[#F5F5F5] rounded-full text-[16px] text-[#3D3D3D] font-inter px-[15px] py-[5px]">
                                                        {item}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </>
                        )
                    }

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
                        accountId && communityInfo && accountId != communityInfo?.community_owner && (
                            <>
                                <div className="text-left mt-[25px]">
                                    <h1 className="text-[20px] leading-10 font-extrabold font-grotesk">Join community</h1>
                                    <div className="flex space-x-[20px] my-[5px] items-center">
                                        <div className="flex-none w-[180px] text-[16px] font-bold">
                                            signed as:
                                        </div>
                                        <div className="flex-initial w-80">
                                            <input
                                                className="bg-[#F5F5F5] rounded-full w-full py-[5px] px-[15px]"
                                                value={accountId}
                                                placeholder="petya.near"
                                                disabled
                                            />
                                        </div>
                                        <div className="flex-initial w-48">
                                            <button
                                                className="w-full main-green-bg py-[5px] rounded-full font-medium text-[16px]"
                                                onClick={() => handleJoinCommunity()}
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
                                                        copy(membershipKey);
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
                                            <input
                                                className="bg-[#F5F5F5] rounded-full w-full py-[5px] px-[15px]"
                                                value={accountId}
                                                placeholder="petya.near"
                                                disabled
                                            />
                                        </div>
                                        <div className="flex-initial w-48">
                                            <button
                                                className="w-full main-green-bg py-[5px] rounded-full"
                                                onClick={() => handleGetProof()}
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
                                            <input
                                                className="bg-[#F5F5F5] rounded-full w-full py-[5px] px-[15px]"
                                                value={membershipKey}
                                                placeholder="default_random_value"
                                                disabled
                                            />
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
                                            <input
                                                className="bg-[#F5F5F5] rounded-full w-full py-[5px] px-[15px]"
                                                placeholder="your proof"
                                                value={proof}
                                                onChange={(e) => setProof(e?.target?.value)}
                                            />
                                        </div>
                                        <div className="flex-initial w-48">
                                            <button
                                                className="w-full main-green-bg py-[5px] rounded-full"
                                                onClick={() => handleVerifyProof()}
                                            >
                                                Verify
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>

                <NotificationModal
                    messageType={messageType}
                    message={message}
                    showModal={showModal}
                    handleShowModal={handleShowModal}
                />
            </div>
        </Spin>
    );
});

export default Communities;